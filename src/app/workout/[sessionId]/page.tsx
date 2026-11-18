import {
  and,
  asc,
  desc,
  eq,
  isNotNull,
  ne,
} from "drizzle-orm";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/AppShell";
import { LiveExerciseCard } from "@/components/workout/LiveExerciseCard";

import { completeWorkout } from "./complete-workout";

import { requireUser } from "@/lib/auth/require-user";
import { db } from "@/lib/db";
import {
  exercises,
  programWorkouts,
  sets,
  workoutExercises,
  workoutSessions,
} from "@/lib/db/schema";

type WorkoutPageProps = {
  params: Promise<{ sessionId: string }>;
};

export default async function WorkoutPage({
  params,
}: WorkoutPageProps) {
  const user = await requireUser();
  const { sessionId } = await params;

  const sessionRows = await db
    .select({
      id: workoutSessions.id,
      profileId: workoutSessions.profileId,
      programWorkoutId: workoutSessions.programWorkoutId,
      startedAt: workoutSessions.startedAt,
      completedAt: workoutSessions.completedAt,
      workoutName: programWorkouts.name,
    })
    .from(workoutSessions)
    .leftJoin(
      programWorkouts,
      eq(
        workoutSessions.programWorkoutId,
        programWorkouts.id,
      ),
    )
    .where(eq(workoutSessions.id, sessionId))
    .limit(1);

  const session = sessionRows[0];

  if (!session || session.profileId !== user.id) {
    notFound();
  }

  if (!session.programWorkoutId) {
    notFound();
  }

  const plannedExercises = await db
    .select({
      id: workoutExercises.id,
      exerciseId: workoutExercises.exerciseId,
      name: exercises.name,
      orderIndex: workoutExercises.orderIndex,
      targetSets: workoutExercises.targetSets,
      targetRepsMin: workoutExercises.targetRepsMin,
      targetRepsMax: workoutExercises.targetRepsMax,
      restSeconds: workoutExercises.restSeconds,
    })
    .from(workoutExercises)
    .innerJoin(
      exercises,
      eq(workoutExercises.exerciseId, exercises.id),
    )
    .where(
      eq(
        workoutExercises.workoutId,
        session.programWorkoutId,
      ),
    )
    .orderBy(asc(workoutExercises.orderIndex));

  const currentSets = await db
    .select({
      exerciseId: sets.exerciseId,
      setNumber: sets.setNumber,
      weight: sets.weight,
      reps: sets.reps,
    })
    .from(sets)
    .where(eq(sets.workoutSessionId, session.id))
    .orderBy(asc(sets.setNumber));

  const exercisesWithHistory = await Promise.all(
    plannedExercises.map(async (exercise) => {
      const previousSessionRows = await db
        .select({
          sessionId: workoutSessions.id,
        })
        .from(workoutSessions)
        .innerJoin(
          sets,
          eq(
            sets.workoutSessionId,
            workoutSessions.id,
          ),
        )
        .where(
          and(
            eq(workoutSessions.profileId, user.id),
            eq(sets.exerciseId, exercise.exerciseId),
            ne(workoutSessions.id, session.id),
            isNotNull(workoutSessions.completedAt),
          ),
        )
        .orderBy(desc(workoutSessions.startedAt))
        .limit(1);

      const previousSessionId =
        previousSessionRows[0]?.sessionId;

      const lastSets = previousSessionId
        ? await db
            .select({
              setNumber: sets.setNumber,
              weight: sets.weight,
              reps: sets.reps,
            })
            .from(sets)
            .where(
              and(
                eq(
                  sets.workoutSessionId,
                  previousSessionId,
                ),
                eq(
                  sets.exerciseId,
                  exercise.exerciseId,
                ),
                eq(sets.completed, true),
              ),
            )
            .orderBy(asc(sets.setNumber))
        : [];

      return {
        ...exercise,
        loggedSets: currentSets
          .filter(
            (set) =>
              set.exerciseId === exercise.exerciseId,
          )
          .map((set) => ({
            setNumber: set.setNumber,
            weight: set.weight,
            reps: set.reps,
          })),
        lastSets,
      };
    }),
  );

  return (
    <AppShell>
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <header>
          <p className="text-sm font-medium text-muted">
            Live workout
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            {session.workoutName ?? "Workout"}
          </h1>

          <p className="mt-3 text-sm text-muted">
            Started{" "}
            {session.startedAt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          <div className="mt-6">
            <form
              action={completeWorkout.bind(
                null,
                session.id,
              )}
            >
              <button
                type="submit"
                className="rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
              >
                Finish Workout
              </button>
            </form>
          </div>
        </header>

        <div className="mt-8 space-y-5">
          {exercisesWithHistory.map((exercise) => (
            <LiveExerciseCard
              key={exercise.id}
              sessionId={session.id}
              exerciseId={exercise.exerciseId}
              name={exercise.name}
              targetSets={exercise.targetSets}
              targetRepsMin={exercise.targetRepsMin}
              targetRepsMax={exercise.targetRepsMax}
              restSeconds={exercise.restSeconds}
              loggedSets={exercise.loggedSets}
              lastSets={exercise.lastSets}
            />
          ))}
        </div>
      </main>
    </AppShell>
  );
}
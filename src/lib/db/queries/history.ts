import { and, count, desc, eq, isNotNull, sum } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  exercises,
  programWorkouts,
  sets,
  workoutSessions,
} from "@/lib/db/schema";

export async function getWorkoutHistory(profileId: string) {
  const sessions = await db
    .select({
      id: workoutSessions.id,
      startedAt: workoutSessions.startedAt,
      completedAt: workoutSessions.completedAt,
      workoutName: programWorkouts.name,
    })
    .from(workoutSessions)
    .leftJoin(
      programWorkouts,
      eq(workoutSessions.programWorkoutId, programWorkouts.id),
    )
    .where(
      and(
        eq(workoutSessions.profileId, profileId),
        isNotNull(workoutSessions.completedAt),
      ),
    )
    .orderBy(desc(workoutSessions.completedAt));

  return Promise.all(
    sessions.map(async (session) => {
      const rows = await db
        .select({
          exerciseId: sets.exerciseId,
          weight: sets.weight,
          reps: sets.reps,
          completed: sets.completed,
        })
        .from(sets)
        .where(eq(sets.workoutSessionId, session.id));

      const completedSets = rows.filter((set) => set.completed);

      return {
        ...session,
        exerciseCount: new Set(rows.map((set) => set.exerciseId)).size,
        totalSets: completedSets.length,
        totalVolume: completedSets.reduce(
          (total, set) =>
            total +
            (set.weight !== null && set.reps !== null
              ? Number(set.weight) * set.reps
              : 0),
          0,
        ),
      };
    }),
  );
}

export async function getWorkoutHistoryDetail(
  sessionId: string,
  profileId: string,
) {
  const [session] = await db
    .select({
      id: workoutSessions.id,
      profileId: workoutSessions.profileId,
      startedAt: workoutSessions.startedAt,
      completedAt: workoutSessions.completedAt,
      notes: workoutSessions.notes,
      workoutName: programWorkouts.name,
    })
    .from(workoutSessions)
    .leftJoin(
      programWorkouts,
      eq(workoutSessions.programWorkoutId, programWorkouts.id),
    )
    .where(
      and(
        eq(workoutSessions.id, sessionId),
        eq(workoutSessions.profileId, profileId),
        isNotNull(workoutSessions.completedAt),
      ),
    )
    .limit(1);

  if (!session) {
    return null;
  }

  const exerciseRows = await db
    .select({
      exerciseId: exercises.id,
      exerciseName: exercises.name,
      setNumber: sets.setNumber,
      weight: sets.weight,
      reps: sets.reps,
      completed: sets.completed,
      durationSeconds: sets.durationSeconds,
      distance: sets.distance,
    })
    .from(sets)
    .innerJoin(exercises, eq(sets.exerciseId, exercises.id))
    .where(eq(sets.workoutSessionId, sessionId))
    .orderBy(sets.exerciseId, sets.setNumber);

  const exercisesById = new Map<
    string,
    {
      id: string;
      name: string;
      sets: {
        setNumber: number;
        weight: string | null;
        reps: number | null;
        completed: boolean;
        durationSeconds: number | null;
        distance: number | null;
      }[];
    }
  >();

  for (const row of exerciseRows) {
    if (!exercisesById.has(row.exerciseId)) {
      exercisesById.set(row.exerciseId, {
        id: row.exerciseId,
        name: row.exerciseName,
        sets: [],
      });
    }

    exercisesById.get(row.exerciseId)!.sets.push({
      setNumber: row.setNumber,
      weight: row.weight,
      reps: row.reps,
      completed: row.completed,
      durationSeconds: row.durationSeconds,
      distance: row.distance,
    });
  }

  return {
    ...session,
    exercises: Array.from(exercisesById.values()),
  };
}
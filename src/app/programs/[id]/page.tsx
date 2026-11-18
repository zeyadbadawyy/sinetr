import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { EditProgramForm } from "@/components/programs/EditProgramForm";
import { WorkoutDayEditor } from "@/components/programs/WorkoutDayEditor";
import { AddWorkoutDayForm } from "@/components/programs/AddWorkoutDayForm";
import { AddExerciseForm } from "@/components/programs/AddExerciseForm";
import { WorkoutExerciseEditor } from "@/components/programs/WorkoutExerciseEditor";

import { requireUser } from "@/lib/auth/require-user";
import { getProgramById } from "@/lib/db/queries/programs";
import { getPublicExercises } from "@/lib/db/queries/exercises";

type ProgramPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProgramPage({
  params,
}: ProgramPageProps) {
  const user = await requireUser();
  const { id } = await params;

  const program = await getProgramById(id, user.id);
  const exercises = await getPublicExercises();

  if (!program || program.creatorId !== user.id) {
    notFound();
  }

  return (
    <AppShell>
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Program header */}
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted">
              Program
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-tight">
              {program.name}
            </h1>

            {program.description && (
              <p className="mt-4 max-w-2xl leading-7 text-muted">
                {program.description}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <EditProgramForm
              programId={program.id}
              initialName={program.name}
              initialDescription={program.description}
            />

            <span className="rounded-lg bg-surface-muted px-3 py-1.5 text-xs font-semibold">
              {program.isPublic ? "Public" : "Private"}
            </span>
          </div>
        </div>

        {/* Add workout day */}
        <div className="mt-8">
          <AddWorkoutDayForm programId={program.id} />
        </div>

        {/* Workout days */}
        <div className="mt-10 space-y-4">
          {program.workouts.length === 0 ? (
            <Card className="p-10 text-center">
              <h2 className="text-xl font-semibold">
                Your program is empty.
              </h2>

              <p className="mt-2 text-sm text-muted">
                Add your first workout day next.
              </p>
            </Card>
          ) : (
            program.workouts.map((workout, index) => (
              <Card key={workout.id} className="p-6">
                <WorkoutDayEditor
                  programId={program.id}
                  workoutId={workout.id}
                  dayNumber={workout.dayNumber}
                  name={workout.name}
                  activeSessionId={workout.activeSessionId}
                  exerciseCount={workout.exercises.length}
                  isFirst={index === 0}
                  isLast={
                    index === program.workouts.length - 1
                  }
                >
                  {/* Exercises */}
                  {workout.exercises.length > 0 && (
                    <div className="mt-6 divide-y divide-border">
                      {workout.exercises.map(
                        (item, exerciseIndex) => (
                          <WorkoutExerciseEditor
                            key={item.id}
                            programId={program.id}
                            id={item.id}
                            name={item.exercise.name}
                            targetSets={item.targetSets}
                            targetRepsMin={
                              item.targetRepsMin
                            }
                            targetRepsMax={
                              item.targetRepsMax
                            }
                            restSeconds={
                              item.restSeconds
                            }
                            isFirst={exerciseIndex === 0}
                            isLast={
                              exerciseIndex ===
                              workout.exercises.length - 1
                            }
                          />
                        ),
                      )}
                    </div>
                  )}

                  {/* Add exercise */}
                  <AddExerciseForm
                    programId={program.id}
                    workoutId={workout.id}
                    exercises={exercises}
                  />
                </WorkoutDayEditor>
              </Card>
            ))
          )}
        </div>

        {/* Back */}
        <Link
          href="/programs"
          className="mt-8 inline-block text-sm font-semibold hover:underline"
        >
          ← Back to programs
        </Link>
      </main>
    </AppShell>
  );
}
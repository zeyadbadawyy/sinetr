
import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

import { requireUser } from "@/lib/auth/require-user";
import { getWorkoutHistoryDetail } from "@/lib/db/queries/history";

type Props = {
  params: Promise<{ sessionId: string }>;
};

export default async function WorkoutHistoryDetailPage({
  params,
}: Props) {
  const user = await requireUser();
  const { sessionId } = await params;

  const workout = await getWorkoutHistoryDetail(
    sessionId,
    user.id,
  );

  if (!workout) {
    notFound();
  }

  const durationMs = workout.completedAt
    ? new Date(workout.completedAt).getTime() -
      new Date(workout.startedAt).getTime()
    : 0;

  const durationMinutes = Math.max(
    0,
    Math.round(durationMs / 60000),
  );

  return (
    <AppShell>
      <Container className="py-10">
        <Link
          href="/history"
          className="text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          ← Workout History
        </Link>

        <header className="mt-6">
          <p className="text-sm font-medium text-muted">
            Completed workout
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            {workout.workoutName ?? "Workout"}
          </h1>

          <p className="mt-3 text-sm text-muted">
            {new Date(workout.completedAt!).toLocaleString(
              undefined,
              {
                dateStyle: "long",
                timeStyle: "short",
              },
            )}
          </p>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card className="p-5">
            <p className="text-sm text-muted">Exercises</p>
            <p className="mt-2 text-2xl font-semibold">
              {workout.exercises.length}
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-sm text-muted">Duration</p>
            <p className="mt-2 text-2xl font-semibold">
              {durationMinutes} min
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-sm text-muted">Sets completed</p>
            <p className="mt-2 text-2xl font-semibold">
              {workout.exercises.reduce(
                (total, exercise) =>
                  total +
                  exercise.sets.filter((set) => set.completed)
                    .length,
                0,
              )}
            </p>
          </Card>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold">
            Performance
          </h2>

          {workout.exercises.length === 0 ? (
            <Card className="mt-4 p-8">
              <p className="text-sm text-muted">
                No sets were recorded for this workout.
              </p>
            </Card>
          ) : (
            <div className="mt-4 space-y-4">
              {workout.exercises.map((exercise) => (
                <Card key={exercise.id} className="p-5 sm:p-6">
                  <h3 className="text-lg font-semibold">
                    {exercise.name}
                  </h3>

                  {exercise.sets.length === 0 ? (
                    <p className="mt-3 text-sm text-muted">
                      No sets recorded.
                    </p>
                  ) : (
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-border text-muted">
                            <th className="pb-3 pr-4 font-medium">
                              Set
                            </th>
                            <th className="pb-3 pr-4 font-medium">
                              Weight
                            </th>
                            <th className="pb-3 pr-4 font-medium">
                              Reps
                            </th>
                            <th className="pb-3 font-medium">
                              Status
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {exercise.sets.map((set) => (
                            <tr
                              key={set.setNumber}
                              className="border-b border-border last:border-0"
                            >
                              <td className="py-3 pr-4">
                                {set.setNumber}
                              </td>

                              <td className="py-3 pr-4">
                                {set.weight !== null
                                  ? `${set.weight} kg`
                                  : "—"}
                              </td>

                              <td className="py-3 pr-4">
                                {set.reps ?? "—"}
                              </td>

                              <td className="py-3">
                                <span
                                  className={
                                    set.completed
                                      ? "font-medium"
                                      : "text-muted"
                                  }
                                >
                                  {set.completed
                                    ? "Completed"
                                    : "Skipped"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {workout.notes && (
          <Card className="mt-8 p-6">
            <h2 className="font-semibold">Workout notes</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted">
              {workout.notes}
            </p>
          </Card>
        )}

        <Link
          href="/history"
          className="mt-8 inline-block text-sm font-semibold hover:underline"
        >
          ← Back to history
        </Link>
      </Container>
    </AppShell>
  );
}
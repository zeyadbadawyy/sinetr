import Link from "next/link";

import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

import { requireUser } from "@/lib/auth/require-user";
import { getWorkoutHistory } from "@/lib/db/queries/history";

export default async function HistoryPage() {
  const user = await requireUser();
  const workouts = await getWorkoutHistory(user.id);

  return (
    <AppShell>
      <Container className="py-10">
        <div>
          <p className="text-sm font-medium text-muted">
            Your fitness journey
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Workout History
          </h1>
          <p className="mt-3 text-muted">
            Every completed workout becomes part of your record.
          </p>
        </div>

        {workouts.length === 0 ? (
          <Card className="mt-8 p-10 text-center">
            <h2 className="text-xl font-semibold">
              Your history starts here.
            </h2>
            <p className="mt-2 text-sm text-muted">
              Complete your first workout to see it here.
            </p>
            <Link
              href="/programs"
              className="mt-5 inline-block rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              Go to programs
            </Link>
          </Card>
        ) : (
          <div className="mt-8 space-y-3">
            {workouts.map((workout) => (
              <Link
                key={workout.id}
                href={`/history/${workout.id}`}
                className="block rounded-2xl border border-border bg-surface p-5 transition-colors hover:bg-surface-muted"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {workout.workoutName ?? "Workout"}
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                      {workout.completedAt
                        ? new Date(workout.completedAt).toLocaleString(
                            undefined,
                            {
                              dateStyle: "medium",
                              timeStyle: "short",
                            },
                          )
                        : ""}
                    </p>
                  </div>

                  <span className="text-sm font-semibold">
                    View workout →
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
                  <span>{workout.exerciseCount} exercises</span>
                  <span>{workout.totalSets} sets</span>
                  <span>
                    {Math.round(workout.totalVolume).toLocaleString()} kg volume
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </AppShell>
  );
}
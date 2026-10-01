import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { requireUser } from "@/lib/auth/require-user";
import { getProgramById } from "@/lib/db/queries/programs";

type ProgramPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProgramPage({
  params,
}: ProgramPageProps) {
  const user = await requireUser();
  const { id } = await params;

  const program = await getProgramById(id);

  if (!program || program.creatorId !== user.id) {
    notFound();
  }

  return (
    <AppShell>
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-6">
          <div>
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

          <span className="rounded-lg bg-surface-muted px-3 py-1.5 text-xs font-semibold">
            {program.isPublic ? "Public" : "Private"}
          </span>
        </div>

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
            program.workouts.map((workout) => (
              <Card key={workout.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                      Day {workout.dayNumber}
                    </p>

                    <h2 className="mt-1 text-xl font-semibold">
                      {workout.name}
                    </h2>
                  </div>

                  <span className="text-sm text-muted">
                    {workout.exercises.length} exercises
                  </span>
                </div>

                {workout.exercises.length > 0 && (
                  <div className="mt-6 divide-y divide-border">
                    {workout.exercises.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between py-4"
                      >
                        <div>
                          <p className="font-medium">
                            {item.exercise.name}
                          </p>

                          <p className="mt-1 text-sm text-muted">
                            {item.targetSets} sets
                            {item.targetRepsMin &&
                            item.targetRepsMax
                              ? ` · ${item.targetRepsMin}-${item.targetRepsMax} reps`
                              : ""}
                          </p>
                        </div>

                        <span className="text-sm text-muted">
                          #{item.orderIndex + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>

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
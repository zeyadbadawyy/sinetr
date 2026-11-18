import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { getPublicExercises } from "@/lib/db/queries/exercises";

export const dynamic = "force-dynamic";

export default async function ExercisesPage() {
  const exercises = await getPublicExercises();

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-medium text-muted">
            Training
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Exercise library
          </h1>

          <p className="mt-4 max-w-2xl text-muted">
            Explore the movements that power your training.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exercises.map((exercise) => (
            <Link
              key={exercise.id}
              href={`/training/exercises/${exercise.slug}`}
            >
              <Card className="h-full p-6 transition-transform hover:-translate-y-0.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  {exercise.equipment}
                </p>

                <h2 className="mt-3 text-lg font-semibold">
                  {exercise.name}
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted">
                  {exercise.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </AppShell>
  );
}
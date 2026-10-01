import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { getExerciseBySlug } from "@/lib/db/queries/exercises";

type ExercisePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ExercisePage({
  params,
}: ExercisePageProps) {
  const { slug } = await params;
  const exercise = await getExerciseBySlug(slug);

  if (!exercise) {
    notFound();
  }

  const primaryMuscles = exercise.muscles.filter(
    (muscle) => muscle.isPrimary,
  );

  const secondaryMuscles = exercise.muscles.filter(
    (muscle) => !muscle.isPrimary,
  );

  return (
    <AppShell>
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-medium capitalize text-muted">
          {exercise.equipment} · {exercise.category}
        </p>

        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          {exercise.name}
        </h1>

        <p className="mt-5 text-lg leading-8 text-muted">
          {exercise.description}
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Card className="p-6">
            <p className="text-sm font-medium text-muted">
              Primary muscles
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {primaryMuscles.map((muscle) => (
                <span
                  key={muscle.id}
                  className="rounded-lg bg-surface-muted px-3 py-1.5 text-sm capitalize"
                >
                  {muscle.muscle.replace("_", " ")}
                </span>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-medium text-muted">
              Secondary muscles
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {secondaryMuscles.map((muscle) => (
                <span
                  key={muscle.id}
                  className="rounded-lg bg-surface-muted px-3 py-1.5 text-sm capitalize"
                >
                  {muscle.muscle.replace("_", " ")}
                </span>
              ))}
            </div>
          </Card>
        </div>

        <Card className="mt-4 p-6">
          <p className="text-sm font-medium text-muted">
            Instructions
          </p>

          <p className="mt-4 leading-8">
            {exercise.instructions}
          </p>
        </Card>
      </main>
    </AppShell>
  );
}
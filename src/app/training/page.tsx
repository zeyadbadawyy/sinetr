import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";

export default function TrainingPage() {
  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-muted">
          Training
        </p>

        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          Training
        </h1>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Link href="/training/exercises">
            <Card className="p-6 transition-transform hover:-translate-y-0.5">
              <p className="text-sm text-muted">
                Exercise library
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Explore exercises
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted">
                Browse movements and understand how they fit into your
                training.
              </p>
            </Card>
          </Link>

          <Card className="p-6">
            <p className="text-sm text-muted">
              Coming from the training engine
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Start a workout
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted">
              Your actual workout system comes next.
            </p>
          </Card>
        </div>
      </main>
    </AppShell>
  );
}
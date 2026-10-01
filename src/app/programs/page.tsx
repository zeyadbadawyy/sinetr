import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { requireUser } from "@/lib/auth/require-user";
import { getProgramsByCreator } from "@/lib/db/queries/programs";

export default async function ProgramsPage() {
  const user = await requireUser();
  const programs = await getProgramsByCreator(user.id);

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-muted">Training</p>

            <h1 className="mt-2 text-4xl font-semibold tracking-tight">
              Your programs
            </h1>

            <p className="mt-4 max-w-2xl text-muted">
              Build the training systems you actually want to follow.
            </p>
          </div>

          <Link
            href="/programs/new"
            className="rounded-xl bg-signal px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-signal-dark"
          >
            Create program
          </Link>
        </div>

        {programs.length === 0 ? (
          <Card className="mt-10 p-10 text-center">
            <h2 className="text-xl font-semibold">
              No programs yet.
            </h2>

            <p className="mt-2 text-sm text-muted">
              Create your first training program.
            </p>

            <Link
              href="/programs/new"
              className="mt-6 inline-flex rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background"
            >
              Create program
            </Link>
          </Card>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => (
              <Link key={program.id} href={`/programs/${program.id}`}>
                <Card className="h-full p-6 transition-transform hover:-translate-y-0.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    {program.isPublic ? "Public" : "Private"}
                  </p>

                  <h2 className="mt-3 text-xl font-semibold">
                    {program.name}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted">
                    {program.description || "No description yet."}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </AppShell>
  );
}
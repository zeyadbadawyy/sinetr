import Link from "next/link";

export function QuickActions() {
  return (
    <section className="grid gap-3 sm:grid-cols-2">
      <Link
        href="/training"
        className="group rounded-2xl bg-foreground p-6 text-background transition-transform hover:-translate-y-0.5"
      >
        <p className="text-sm opacity-60">Training</p>

        <h2 className="mt-2 text-xl font-semibold">
          Start a workout
        </h2>

        <p className="mt-2 text-sm opacity-60">
          Train, log your sets, and keep the session.
        </p>

        <span className="mt-6 inline-block text-sm font-semibold">
          Start →
        </span>
      </Link>

      <Link
        href="/programs"
        className="group rounded-2xl border border-border bg-surface p-6 transition-colors hover:bg-surface-muted"
      >
        <p className="text-sm text-muted">Programs</p>

        <h2 className="mt-2 text-xl font-semibold">
          Build your training system
        </h2>

        <p className="mt-2 text-sm text-muted">
          Create or explore programs built around your goals.
        </p>

        <span className="mt-6 inline-block text-sm font-semibold">
          Explore →
        </span>
      </Link>
    </section>
  );
}
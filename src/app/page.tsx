import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

export default function Home() {
  return (
    <AppShell>
      <Container className="py-12 sm:py-16">
        <section className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            Your fitness journey
          </p>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Train with purpose.
            <br />
            <span className="text-muted">Keep the history.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            Sinetr brings training, progress, knowledge, creation, and
            community together in one place.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button>Start training</Button>
            <Button variant="secondary">Explore Sinetr</Button>
          </div>
        </section>

        <section className="mt-16 grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <p className="text-sm text-muted">Training</p>
            <h2 className="mt-2 text-xl font-semibold">Build your system.</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Workouts, programs, exercises, and everything around your
              training.
            </p>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-muted">Progress</p>
            <h2 className="mt-2 text-xl font-semibold">Keep your history.</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Your progress becomes a record you can keep building over time.
            </p>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-muted">Community</p>
            <h2 className="mt-2 text-xl font-semibold">Grow together.</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Discover people, knowledge, programs, challenges, and ideas.
            </p>
          </Card>
        </section>
      </Container>
    </AppShell>
  );
}
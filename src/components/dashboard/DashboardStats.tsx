import { Card } from "@/components/ui/Card";

const stats = [
  {
    label: "Workouts",
    value: "0",
    description: "Completed",
  },
  {
    label: "Training volume",
    value: "—",
    description: "No data yet",
  },
  {
    label: "Current streak",
    value: "0",
    description: "Days",
  },
];

export function DashboardStats() {
  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-6">
          <p className="text-sm text-muted">{stat.label}</p>

          <p className="mt-3 text-3xl font-semibold tracking-tight">
            {stat.value}
          </p>

          <p className="mt-1 text-sm text-muted">
            {stat.description}
          </p>
        </Card>
      ))}
    </section>
  );
}
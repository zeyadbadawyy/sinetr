import { Card } from "@/components/ui/Card";

export function RecentActivity() {
  return (
    <Card className="p-6">
      <p className="text-sm font-medium text-muted">
        Recent activity
      </p>

      <div className="mt-6 rounded-xl border border-dashed border-border p-8 text-center">
        <p className="font-medium">Nothing here yet.</p>

        <p className="mt-1 text-sm text-muted">
          Your training history will appear here as you train.
        </p>
      </div>
    </Card>
  );
}
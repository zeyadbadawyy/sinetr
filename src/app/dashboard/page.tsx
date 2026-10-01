import { AppShell } from "@/components/layout/AppShell";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { requireUser } from "@/lib/auth/require-user";
import { getProfile } from "@/lib/db/queries/get-profile";

export default async function DashboardPage() {
  const user = await requireUser();
  const profile = await getProfile(user.id);

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-10">
          <DashboardHeader displayName={profile.display_name} />

          <QuickActions />

          <DashboardStats />

          <RecentActivity />
        </div>
      </main>
    </AppShell>
  );
}
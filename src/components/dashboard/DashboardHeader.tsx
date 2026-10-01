type DashboardHeaderProps = {
  displayName: string;
};

export function DashboardHeader({
  displayName,
}: DashboardHeaderProps) {
  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <section>
      <p className="text-sm font-medium text-muted">{greeting}</p>

      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
        {displayName}
      </h1>

      <p className="mt-4 max-w-xl text-base leading-7 text-muted">
        Ready to keep building your fitness history?
      </p>
    </section>
  );
}
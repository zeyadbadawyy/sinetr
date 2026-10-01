import Link from "next/link";
import { signOut } from "@/app/dashboard/actions";

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="text-xl font-semibold tracking-tight">
          Sinetr
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted md:flex">
          <Link href="/dashboard" className="hover:text-foreground">
            Dashboard
          </Link>
          <span>Training</span>
          <span>Progress</span>
          <span>Discover</span>
        </nav>

        <form action={signOut}>
          <button
            type="submit"
            className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold transition-colors hover:bg-surface-muted"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
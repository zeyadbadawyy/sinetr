import Link from "next/link";

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Sinetr
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted md:flex">
          <Link href="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <Link href="/" className="transition-colors hover:text-foreground">
            Training
          </Link>
          <Link href="/" className="transition-colors hover:text-foreground">
            Progress
          </Link>
          <Link href="/" className="transition-colors hover:text-foreground">
            Discover
          </Link>
        </nav>

        <button
          type="button"
          className="h-9 w-9 rounded-full border border-border bg-surface text-sm font-semibold transition-colors hover:bg-surface-muted"
          aria-label="Profile"
        >
          Z
        </button>
      </div>
    </header>
  );
}
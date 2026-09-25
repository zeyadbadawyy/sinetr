import type { ReactNode } from "react";
import { TopBar } from "./TopBar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      <main>{children}</main>
    </div>
  );
}
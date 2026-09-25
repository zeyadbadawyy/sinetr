import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-signal text-foreground hover:bg-signal-dark",
    secondary:
      "border border-border bg-surface text-foreground hover:bg-surface-muted",
    ghost:
      "text-muted hover:bg-surface-muted hover:text-foreground",
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
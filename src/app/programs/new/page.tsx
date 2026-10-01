"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";

export default function NewProgramPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const response = await fetch("/api/programs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
        description: description.trim(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Failed to create program.");
      setLoading(false);
      return;
    }

    router.push(`/programs/${data.id}`);
  }

  return (
    <AppShell>
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-muted">Programs</p>

        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          Create program
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-5 rounded-2xl border border-border bg-surface p-6 shadow-sm"
        >
          <div>
            <label className="text-sm font-medium">
              Program name
            </label>

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Upper / Lower"
              required
              maxLength={100}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-border-strong"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What is this program built for?"
              rows={5}
              maxLength={1000}
              className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-border-strong"
            />
          </div>

          {error && (
            <p className="text-sm text-danger">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-signal px-4 py-3 text-sm font-semibold transition-colors hover:bg-signal-dark disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create program"}
          </button>
        </form>
      </main>
    </AppShell>
  );
}
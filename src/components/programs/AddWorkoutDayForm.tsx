"use client";

import { useState } from "react";
import { createWorkoutDay } from "@/app/programs/[id]/actions";

type Props = {
  programId: string;
};

export function AddWorkoutDayForm({
  programId,
}: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!name.trim()) {
      return;
    }

    try {
      setLoading(true);

      await createWorkoutDay(
        programId,
        name.trim(),
      );

      setName("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h3 className="text-lg font-semibold">
        Add workout day
      </h3>

      <div className="mt-4 flex gap-3">
        <input
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="Push Day"
          className="flex-1 rounded-xl border border-border bg-background px-4 py-3"
        />

        <button
          onClick={submit}
          disabled={loading}
          className="rounded-xl bg-foreground px-4 py-3 text-background"
        >
          {loading ? "..." : "Add"}
        </button>
      </div>
    </div>
  );
}
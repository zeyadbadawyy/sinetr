"use client";

import { useState } from "react";
import { updateProgram } from "@/app/programs/[id]/actions";

type Props = {
  programId: string;
  initialName: string;
  initialDescription: string | null;
};

export function EditProgramForm({
  programId,
  initialName,
  initialDescription,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(
    initialDescription ?? "",
  );
  const [saving, setSaving] = useState(false);

  function cancel() {
    setName(initialName);
    setDescription(initialDescription ?? "");
    setEditing(false);
  }

  async function save() {
    if (!name.trim()) {
      return;
    }

    try {
      setSaving(true);

      await updateProgram(programId, {
        name,
        description: description || null,
      });

      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-surface-muted"
      >
        Edit program
      </button>
    );
  }

  return (
    <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
      <h2 className="text-lg font-semibold">
        Edit program
      </h2>

      <div className="mt-5 space-y-5">
        <label className="block text-sm font-medium">
          Program name

          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={100}
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
          />
        </label>

        <label className="block text-sm font-medium">
          Description

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            maxLength={1000}
            rows={4}
            placeholder="Describe what this program is for..."
            className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
          />
        </label>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving || !name.trim()}
          className="rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          onClick={cancel}
          disabled={saving}
          className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-surface-muted"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
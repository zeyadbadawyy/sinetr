"use client";

import { useState } from "react";
import {
  moveWorkoutExercise,
  removeExerciseFromWorkout,
  updateWorkoutExercise,
} from "@/app/programs/[id]/actions";

type Props = {
  programId: string;
  id: string;
  name: string;
  targetSets: number;
  targetRepsMin: number | null;
  targetRepsMax: number | null;
  restSeconds: number | null;
  isFirst: boolean;
  isLast: boolean;
};

export function WorkoutExerciseEditor({
  programId,
  id,
  name,
  targetSets,
  targetRepsMin,
  targetRepsMax,
  restSeconds,
  isFirst,
  isLast,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [moving, setMoving] = useState(false);
  const [saving, setSaving] = useState(false);

  const [sets, setSets] = useState(String(targetSets));
  const [minReps, setMinReps] = useState(
    targetRepsMin ? String(targetRepsMin) : "",
  );
  const [maxReps, setMaxReps] = useState(
    targetRepsMax ? String(targetRepsMax) : "",
  );
  const [rest, setRest] = useState(
    restSeconds ? String(restSeconds) : "",
  );

  function cancel() {
    setSets(String(targetSets));
    setMinReps(targetRepsMin ? String(targetRepsMin) : "");
    setMaxReps(targetRepsMax ? String(targetRepsMax) : "");
    setRest(restSeconds ? String(restSeconds) : "");
    setEditing(false);
  }

  async function save() {
    try {
      setSaving(true);

      await updateWorkoutExercise(programId, id, {
        targetSets: Number(sets),
        targetRepsMin: minReps ? Number(minReps) : null,
        targetRepsMax: maxReps ? Number(maxReps) : null,
        restSeconds: rest ? Number(rest) : null,
      });

      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  async function move(direction: "up" | "down") {
    try {
      setMoving(true);

      await moveWorkoutExercise(
        programId,
        id,
        direction,
      );
    } finally {
      setMoving(false);
    }
  }

  async function remove() {
    if (!window.confirm(`Remove ${name}?`)) {
      return;
    }

    await removeExerciseFromWorkout(programId, id);
  }

  if (!editing) {
    return (
      <div className="flex items-center justify-between gap-6 py-5">
        <div className="flex min-w-0 items-center gap-4">
          {/* Reorder controls */}
          <div className="flex shrink-0 flex-col gap-1">
            <button
              type="button"
              onClick={() => move("up")}
              disabled={moving || isFirst}
              aria-label={`Move ${name} up`}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-base font-semibold text-foreground transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-25"
            >
              ↑
            </button>

            <button
              type="button"
              onClick={() => move("down")}
              disabled={moving || isLast}
              aria-label={`Move ${name} down`}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-base font-semibold text-foreground transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-25"
            >
              ↓
            </button>
          </div>

          <div className="min-w-0">
            <p className="font-medium">{name}</p>

            <p className="mt-1 text-sm text-muted">
              {targetSets} sets
              {targetRepsMin && targetRepsMax
                ? ` · ${targetRepsMin}-${targetRepsMax} reps`
                : ""}
              {restSeconds
                ? ` · ${restSeconds}s rest`
                : ""}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-sm font-semibold hover:underline"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={remove}
            className="text-sm text-danger hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5">
      <p className="font-medium">{name}</p>

      <p className="mt-1 text-xs text-muted">
        Configure this movement.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-4">
        <label className="text-sm font-medium">
          Sets
          <input
            type="number"
            min="1"
            value={sets}
            onChange={(event) => setSets(event.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-normal"
          />
        </label>

        <label className="text-sm font-medium">
          Min reps
          <input
            type="number"
            min="1"
            value={minReps}
            onChange={(event) => setMinReps(event.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-normal"
          />
        </label>

        <label className="text-sm font-medium">
          Max reps
          <input
            type="number"
            min="1"
            value={maxReps}
            onChange={(event) => setMaxReps(event.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-normal"
          />
        </label>

        <label className="text-sm font-medium">
          Rest (seconds)
          <input
            type="number"
            min="0"
            value={rest}
            onChange={(event) => setRest(event.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-normal"
          />
        </label>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-background disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          onClick={cancel}
          disabled={saving}
          className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold hover:bg-surface-muted"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
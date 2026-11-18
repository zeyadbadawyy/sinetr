"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  moveWorkoutDay,
  removeWorkoutDay,
  updateWorkoutDay,
} from "@/app/programs/[id]/actions";

import { startWorkout } from "@/app/programs/[id]/start-workout";

type Props = {
  programId: string;
  workoutId: string;
  dayNumber: number;
  name: string;
  activeSessionId: string | null;
  exerciseCount: number;
  isFirst: boolean;
  isLast: boolean;
  children: React.ReactNode;
};

export function WorkoutDayEditor({
  programId,
  workoutId,
  dayNumber,
  name,
  activeSessionId,
  exerciseCount,
  isFirst,
  isLast,
  children,
}: Props) {
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [nameValue, setNameValue] = useState(name);
  const [saving, setSaving] = useState(false);
  const [moving, setMoving] = useState(false);

  function cancel() {
    setNameValue(name);
    setEditing(false);
  }

  async function save() {
    if (!nameValue.trim()) {
      return;
    }

    try {
      setSaving(true);

      await updateWorkoutDay(
        programId,
        workoutId,
        nameValue,
      );

      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  async function move(direction: "up" | "down") {
    try {
      setMoving(true);

      await moveWorkoutDay(
        programId,
        workoutId,
        direction,
      );
    } finally {
      setMoving(false);
    }
  }

  async function remove() {
    const confirmed = window.confirm(
      `Delete ${name}? All exercises inside this day will be removed from the program.`,
    );

    if (!confirmed) {
      return;
    }

    await removeWorkoutDay(programId, workoutId);
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-6">
        <div className="flex min-w-0 items-start gap-4">
          {/* Workout day controls */}
          <div className="flex shrink-0 items-center gap-1 rounded-xl border border-border bg-surface-muted p-1">
            <button
              type="button"
              onClick={() => move("up")}
              disabled={moving || isFirst}
              aria-label={`Move ${name} up`}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-25"
            >
              ↑
            </button>

            <button
              type="button"
              onClick={() => move("down")}
              disabled={moving || isLast}
              aria-label={`Move ${name} down`}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-25"
            >
              ↓
            </button>
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Day {dayNumber}
            </p>

            {!editing ? (
              <>
                <h2 className="mt-1 text-xl font-semibold">
                  {name}
                </h2>

                <p className="mt-1 text-sm text-muted">
                  {exerciseCount}{" "}
                  {exerciseCount === 1
                    ? "exercise"
                    : "exercises"}
                </p>
              </>
            ) : (
              <div className="mt-2">
                <input
                  value={nameValue}
                  onChange={(event) =>
                    setNameValue(event.target.value)
                  }
                  maxLength={100}
                  autoFocus
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold outline-none focus:border-foreground"
                />

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={save}
                    disabled={
                      saving || !nameValue.trim()
                    }
                    className="rounded-xl bg-foreground px-3 py-2 text-xs font-semibold text-background disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>

                  <button
                    type="button"
                    onClick={cancel}
                    disabled={saving}
                    className="rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold hover:bg-surface-muted"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {!editing && (
          <div className="flex shrink-0 items-center gap-4">
            {activeSessionId ? (
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/workout/${activeSessionId}`,
                  )
                }
                className="rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Resume Workout
              </button>
            ) : (
              <form
                action={startWorkout.bind(
                  null,
                  workoutId,
                )}
              >
                <button
                  type="submit"
                  className="rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Start Workout
                </button>
              </form>
            )}

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
              Delete
            </button>
          </div>
        )}
      </div>

      {children}
    </div>
  );
}
"use client";

import { useState } from "react";

import { saveWorkoutSet } from "@/app/workout/[sessionId]/actions";

type LoggedSet = {
  setNumber: number;
  weight: string | null;
  reps: number | null;
};

type LastSet = {
  setNumber: number;
  weight: string | null;
  reps: number | null;
};

type Props = {
  sessionId: string;
  exerciseId: string;
  name: string;
  targetSets: number;
  targetRepsMin: number | null;
  targetRepsMax: number | null;
  restSeconds: number | null;
  loggedSets: LoggedSet[];
  lastSets: LastSet[];
};

export function LiveExerciseCard({
  sessionId,
  exerciseId,
  name,
  targetSets,
  targetRepsMin,
  targetRepsMax,
  restSeconds,
  loggedSets,
  lastSets,
}: Props) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold">{name}</h2>

        <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted">
          <span>
            {targetSets} sets
            {targetRepsMin !== null && targetRepsMax !== null
              ? ` · ${targetRepsMin}–${targetRepsMax} reps`
              : ""}
          </span>

          {restSeconds !== null && (
            <span>· Rest {restSeconds}s</span>
          )}
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          Last time
        </p>

        {lastSets.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            No previous performance yet.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {lastSets.map((set) => (
              <div
                key={set.setNumber}
                className="flex items-center gap-3 text-sm"
              >
                <span className="w-12 text-muted">
                  Set {set.setNumber}
                </span>

                <span className="font-medium">
                  {set.weight ?? "—"} kg
                </span>

                <span className="text-muted">×</span>

                <span className="font-medium">
                  {set.reps ?? "—"} reps
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 border-t border-border pt-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          Today
        </p>

        <div className="mt-4 space-y-3">
          {Array.from({ length: targetSets }).map((_, index) => {
            const setNumber = index + 1;
            const existing = loggedSets.find(
              (set) => set.setNumber === setNumber,
            );

            return (
              <WorkoutSetRow
                key={setNumber}
                sessionId={sessionId}
                exerciseId={exerciseId}
                setNumber={setNumber}
                initialWeight={existing?.weight ?? ""}
                initialReps={existing?.reps ?? null}
                initiallyCompleted={Boolean(existing)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

type WorkoutSetRowProps = {
  sessionId: string;
  exerciseId: string;
  setNumber: number;
  initialWeight: string;
  initialReps: number | null;
  initiallyCompleted: boolean;
};

function WorkoutSetRow({
  sessionId,
  exerciseId,
  setNumber,
  initialWeight,
  initialReps,
  initiallyCompleted,
}: WorkoutSetRowProps) {
  const [weight, setWeight] = useState(initialWeight);
  const [reps, setReps] = useState(
    initialReps === null ? "" : String(initialReps),
  );
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(initiallyCompleted);

  async function completeSet() {
    const parsedReps = reps.trim() === "" ? null : Number(reps);

    if (
      parsedReps !== null &&
      (!Number.isInteger(parsedReps) || parsedReps < 0)
    ) {
      return;
    }

    try {
      setSaving(true);

      await saveWorkoutSet({
        sessionId,
        exerciseId,
        setNumber,
        weight,
        reps: parsedReps,
      });

      setCompleted(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-xl bg-surface-muted p-3">
      <span className="w-12 shrink-0 text-sm font-medium text-muted">
        {setNumber}
      </span>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <input
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          value={weight}
          onChange={(event) => {
            setWeight(event.target.value);
            setCompleted(false);
          }}
          placeholder="kg"
          className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-foreground"
        />

        <span className="text-sm text-muted">kg</span>

        <span className="px-1 text-muted">×</span>

        <input
          type="number"
          min="0"
          step="1"
          inputMode="numeric"
          value={reps}
          onChange={(event) => {
            setReps(event.target.value);
            setCompleted(false);
          }}
          placeholder="reps"
          className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-foreground"
        />

        <span className="text-sm text-muted">reps</span>
      </div>

      <button
        type="button"
        onClick={completeSet}
        disabled={saving}
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-sm font-bold transition-colors ${
          completed
            ? "border-foreground bg-foreground text-background"
            : "border-border bg-surface hover:border-foreground"
        }`}
        aria-label={`Complete set ${setNumber}`}
      >
        {saving ? "…" : completed ? "✓" : "✓"}
      </button>
    </div>
  );
}
"use client";

import { useState } from "react";
import { addExerciseToWorkout } from "@/app/programs/[id]/actions";

type Exercise = {
  id: string;
  name: string;
};

type Props = {
  programId: string;
  workoutId: string;
  exercises: Exercise[];
};

export function AddExerciseForm({
  programId,
  workoutId,
  exercises,
}: Props) {
  const [exerciseId, setExerciseId] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!exerciseId) {
      return;
    }

    try {
      setLoading(true);

      await addExerciseToWorkout(
        programId,
        workoutId,
        exerciseId,
      );

      setExerciseId("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 flex gap-3">
      <select
        value={exerciseId}
        onChange={(event) =>
          setExerciseId(event.target.value)
        }
        className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm"
      >
        <option value="">
          Select exercise
        </option>

        {exercises.map((exercise) => (
          <option
            key={exercise.id}
            value={exercise.id}
          >
            {exercise.name}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={submit}
        disabled={loading || !exerciseId}
        className="rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background disabled:opacity-50"
      >
        {loading ? "..." : "Add"}
      </button>
    </div>
  );
}
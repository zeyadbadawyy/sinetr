"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/require-user";
import { db } from "@/lib/db";
import {
  sets,
  workoutExercises,
  workoutSessions,
} from "@/lib/db/schema";

type SaveSetInput = {
  sessionId: string;
  exerciseId: string;
  setNumber: number;
  weight: string;
  reps: number | null;
};

export async function saveWorkoutSet(input: SaveSetInput) {
  const user = await requireUser();

  const session = await db
    .select()
    .from(workoutSessions)
    .where(eq(workoutSessions.id, input.sessionId))
    .limit(1);

  if (!session[0] || session[0].profileId !== user.id) {
    throw new Error("Workout session not found.");
  }

  if (session[0].completedAt) {
    throw new Error("This workout has already been completed.");
  }

  if (!session[0].programWorkoutId) {
    throw new Error("This workout is not connected to a program day.");
  }

  const plannedExercise = await db
    .select({
      exerciseId: workoutExercises.exerciseId,
    })
    .from(workoutExercises)
    .where(
      and(
        eq(
          workoutExercises.workoutId,
          session[0].programWorkoutId,
        ),
        eq(workoutExercises.exerciseId, input.exerciseId),
      ),
    )
    .limit(1);

  if (!plannedExercise[0]) {
    throw new Error("Exercise does not belong to this workout.");
  }

  if (!Number.isInteger(input.setNumber) || input.setNumber < 1) {
    throw new Error("Invalid set number.");
  }

  const trimmedWeight = input.weight.trim();

  if (trimmedWeight) {
    const parsedWeight = Number(trimmedWeight);

    if (!Number.isFinite(parsedWeight) || parsedWeight < 0) {
      throw new Error("Invalid weight.");
    }
  }

  if (
    input.reps !== null &&
    (!Number.isInteger(input.reps) || input.reps < 0)
  ) {
    throw new Error("Invalid reps.");
  }

  const existing = await db
    .select({
      id: sets.id,
    })
    .from(sets)
    .where(
      and(
        eq(sets.workoutSessionId, input.sessionId),
        eq(sets.exerciseId, input.exerciseId),
        eq(sets.setNumber, input.setNumber),
      ),
    )
    .limit(1);

  const values = {
    weight: trimmedWeight || null,
    reps: input.reps,
    completed: true,
  };

  if (existing[0]) {
    await db
      .update(sets)
      .set(values)
      .where(eq(sets.id, existing[0].id));
  } else {
    await db.insert(sets).values({
      workoutSessionId: input.sessionId,
      exerciseId: input.exerciseId,
      setNumber: input.setNumber,
      ...values,
    });
  }

  revalidatePath(`/workout/${input.sessionId}`);
}
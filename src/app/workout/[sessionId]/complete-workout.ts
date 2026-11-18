"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/require-user";
import { db } from "@/lib/db";
import {
  programWorkouts,
  workoutSessions,
} from "@/lib/db/schema";

export async function completeWorkout(
  sessionId: string,
) {
  const user = await requireUser();

  const session = await db
    .select()
    .from(workoutSessions)
    .where(eq(workoutSessions.id, sessionId))
    .limit(1);

  if (!session[0]) {
    throw new Error("Workout session not found.");
  }

  if (session[0].profileId !== user.id) {
    throw new Error("Unauthorized.");
  }

  if (session[0].completedAt) {
    redirect(`/workout/${sessionId}`);
  }

  let programId: string | null = null;

  if (session[0].programWorkoutId) {
    const workout = await db
      .select({
        programId: programWorkouts.programId,
      })
      .from(programWorkouts)
      .where(
        eq(
          programWorkouts.id,
          session[0].programWorkoutId,
        ),
      )
      .limit(1);

    programId = workout[0]?.programId ?? null;
  }

  await db
    .update(workoutSessions)
    .set({
      completedAt: new Date(),
    })
    .where(eq(workoutSessions.id, sessionId));

  if (programId) {
    revalidatePath(`/programs/${programId}`);
  }

  revalidatePath("/programs");

  redirect("/programs");
}
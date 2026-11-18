"use server";

import { and, eq, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import {
  programWorkouts,
  programs,
  workoutSessions,
} from "@/lib/db/schema";
import { requireUser } from "@/lib/auth/require-user";

export async function startWorkout(programWorkoutId: string) {
  const user = await requireUser();

  const workout = await db
    .select({
      id: programWorkouts.id,
      programId: programWorkouts.programId,
    })
    .from(programWorkouts)
    .where(eq(programWorkouts.id, programWorkoutId))
    .limit(1);

  if (!workout[0]) {
    throw new Error("Workout day not found.");
  }

  const program = await db
    .select({
      creatorId: programs.creatorId,
    })
    .from(programs)
    .where(eq(programs.id, workout[0].programId))
    .limit(1);

  if (!program[0] || program[0].creatorId !== user.id) {
    throw new Error("You do not have access to this workout.");
  }

  const existingSession = await db
    .select({
      id: workoutSessions.id,
    })
    .from(workoutSessions)
    .where(
      and(
        eq(workoutSessions.profileId, user.id),
        eq(
          workoutSessions.programWorkoutId,
          workout[0].id,
        ),
        isNull(workoutSessions.completedAt),
      ),
    )
    .limit(1);

  if (existingSession[0]) {
    revalidatePath(`/programs/${workout[0].programId}`);
    redirect(`/workout/${existingSession[0].id}`);
  }

  const [session] = await db
    .insert(workoutSessions)
    .values({
      profileId: user.id,
      programWorkoutId: workout[0].id,
    })
    .returning({
      id: workoutSessions.id,
    });

  revalidatePath(`/programs/${workout[0].programId}`);

  redirect(`/workout/${session.id}`);
}
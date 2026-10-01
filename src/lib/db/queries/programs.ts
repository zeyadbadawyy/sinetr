import { asc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  exercises,
  programWorkouts,
  programs,
  workoutExercises,
} from "@/lib/db/schema";

export async function getProgramsByCreator(creatorId: string) {
  return db
    .select()
    .from(programs)
    .where(eq(programs.creatorId, creatorId))
    .orderBy(asc(programs.createdAt));
}

export async function getPublicPrograms() {
  return db
    .select()
    .from(programs)
    .where(eq(programs.isPublic, true))
    .orderBy(asc(programs.name));
}

export async function getProgramById(programId: string) {
  const program = await db
    .select()
    .from(programs)
    .where(eq(programs.id, programId))
    .limit(1);

  if (!program[0]) {
    return null;
  }

  const workouts = await db
    .select()
    .from(programWorkouts)
    .where(eq(programWorkouts.programId, programId))
    .orderBy(asc(programWorkouts.dayNumber));

  const workoutIds = workouts.map((workout) => workout.id);

  const workoutExerciseRows =
    workoutIds.length === 0
      ? []
      : await db
          .select({
            workoutExercise: workoutExercises,
            exercise: exercises,
          })
          .from(workoutExercises)
          .innerJoin(
            exercises,
            eq(workoutExercises.exerciseId, exercises.id),
          )
          .where(inArray(workoutExercises.workoutId, workoutIds))
          .orderBy(asc(workoutExercises.orderIndex));

  return {
    ...program[0],
    workouts: workouts.map((workout) => ({
      ...workout,
      exercises: workoutExerciseRows
        .filter(
          (row) => row.workoutExercise.workoutId === workout.id,
        )
        .map((row) => ({
          ...row.workoutExercise,
          exercise: row.exercise,
        })),
    })),
  };
}
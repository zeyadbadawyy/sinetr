"use server";

import { eq, gt, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  programWorkouts,
  programs,
  workoutExercises,
} from "@/lib/db/schema";
import { getProgramById } from "@/lib/db/queries/programs";
import { requireUser } from "@/lib/auth/require-user";

export async function updateProgram(
  programId: string,
  values: {
    name: string;
    description: string | null;
  },
) {
  const user = await requireUser();

  const program = await getProgramById(programId);

  if (!program || program.creatorId !== user.id) {
    throw new Error("Program not found.");
  }

  const name = values.name.trim();

  if (!name) {
    throw new Error("Program name is required.");
  }

  if (name.length > 100) {
    throw new Error("Program name is too long.");
  }

  const description = values.description?.trim() || null;

  if (description && description.length > 1000) {
    throw new Error("Program description is too long.");
  }

  await db
    .update(programs)
    .set({
      name,
      description,
      updatedAt: new Date(),
    })
    .where(eq(programs.id, programId));

  revalidatePath(`/programs/${programId}`);
  revalidatePath("/programs");
}

export async function createWorkoutDay(
  programId: string,
  name: string,
) {
  const user = await requireUser();

  const program = await getProgramById(programId);

  if (!program || program.creatorId !== user.id) {
    throw new Error("Program not found.");
  }

  const cleanName = name.trim();

  if (!cleanName) {
    throw new Error("Workout day name is required.");
  }

  const nextDay = program.workouts.length + 1;

  await db.insert(programWorkouts).values({
    programId,
    name: cleanName,
    dayNumber: nextDay,
  });

  revalidatePath(`/programs/${programId}`);
}

export async function addExerciseToWorkout(
  programId: string,
  workoutId: string,
  exerciseId: string,
) {
  const user = await requireUser();

  const program = await getProgramById(programId);

  if (!program || program.creatorId !== user.id) {
    throw new Error("Program not found.");
  }

  const workout = program.workouts.find(
    (item) => item.id === workoutId,
  );

  if (!workout) {
    throw new Error("Workout not found.");
  }

  const nextOrder = workout.exercises.length;

  await db.insert(workoutExercises).values({
    workoutId,
    exerciseId,
    orderIndex: nextOrder,
    targetSets: 3,
    targetRepsMin: 8,
    targetRepsMax: 12,
    restSeconds: 120,
  });

  revalidatePath(`/programs/${programId}`);
}

export async function updateWorkoutExercise(
  programId: string,
  workoutExerciseId: string,
  values: {
    targetSets: number;
    targetRepsMin: number | null;
    targetRepsMax: number | null;
    restSeconds: number | null;
  },
) {
  const user = await requireUser();

  const program = await getProgramById(programId);

  if (!program || program.creatorId !== user.id) {
    throw new Error("Program not found.");
  }

  const item = program.workouts
    .flatMap((workout) => workout.exercises)
    .find((exercise) => exercise.id === workoutExerciseId);

  if (!item) {
    throw new Error("Exercise not found.");
  }

  if (values.targetSets < 1) {
    throw new Error("Sets must be at least 1.");
  }

  if (
    values.targetRepsMin !== null &&
    values.targetRepsMin < 1
  ) {
    throw new Error("Minimum reps must be at least 1.");
  }

  if (
    values.targetRepsMax !== null &&
    values.targetRepsMax < 1
  ) {
    throw new Error("Maximum reps must be at least 1.");
  }

  if (
    values.targetRepsMin !== null &&
    values.targetRepsMax !== null &&
    values.targetRepsMax < values.targetRepsMin
  ) {
    throw new Error("Maximum reps cannot be below minimum reps.");
  }

  if (
    values.restSeconds !== null &&
    values.restSeconds < 0
  ) {
    throw new Error("Rest cannot be negative.");
  }

  await db
    .update(workoutExercises)
    .set({
      targetSets: values.targetSets,
      targetRepsMin: values.targetRepsMin,
      targetRepsMax: values.targetRepsMax,
      restSeconds: values.restSeconds,
    })
    .where(eq(workoutExercises.id, workoutExerciseId));

  revalidatePath(`/programs/${programId}`);
}

export async function removeExerciseFromWorkout(
  programId: string,
  workoutExerciseId: string,
) {
  const user = await requireUser();

  const program = await getProgramById(programId);

  if (!program || program.creatorId !== user.id) {
    throw new Error("Program not found.");
  }

  const item = program.workouts
    .flatMap((workout) => workout.exercises)
    .find((exercise) => exercise.id === workoutExerciseId);

  if (!item) {
    throw new Error("Exercise not found.");
  }

  await db
    .delete(workoutExercises)
    .where(eq(workoutExercises.id, workoutExerciseId));

  await db
    .update(workoutExercises)
    .set({
      orderIndex: sql`${workoutExercises.orderIndex} - 1`,
    })
    .where(
      sql`
        ${workoutExercises.workoutId} = ${item.workoutId}
        AND ${workoutExercises.orderIndex} > ${item.orderIndex}
      `,
    );

  revalidatePath(`/programs/${programId}`);
}

export async function moveWorkoutExercise(
  programId: string,
  workoutExerciseId: string,
  direction: "up" | "down",
) {
  const user = await requireUser();

  const program = await getProgramById(programId);

  if (!program || program.creatorId !== user.id) {
    throw new Error("Program not found.");
  }

  const currentWorkout = program.workouts.find((workout) =>
    workout.exercises.some(
      (exercise) => exercise.id === workoutExerciseId,
    ),
  );

  if (!currentWorkout) {
    throw new Error("Exercise not found.");
  }

  const exercises = [...currentWorkout.exercises].sort(
    (a, b) => a.orderIndex - b.orderIndex,
  );

  const currentIndex = exercises.findIndex(
    (exercise) => exercise.id === workoutExerciseId,
  );

  if (currentIndex === -1) {
    throw new Error("Exercise not found.");
  }

  const targetIndex =
    direction === "up"
      ? currentIndex - 1
      : currentIndex + 1;

  if (
    targetIndex < 0 ||
    targetIndex >= exercises.length
  ) {
    return;
  }

  const current = exercises[currentIndex];
  const target = exercises[targetIndex];

  await db.transaction(async (tx) => {
    await tx
      .update(workoutExercises)
      .set({ orderIndex: -1 })
      .where(eq(workoutExercises.id, current.id));

    await tx
      .update(workoutExercises)
      .set({ orderIndex: current.orderIndex })
      .where(eq(workoutExercises.id, target.id));

    await tx
      .update(workoutExercises)
      .set({ orderIndex: target.orderIndex })
      .where(eq(workoutExercises.id, current.id));
  });

  revalidatePath(`/programs/${programId}`);
}

export async function updateWorkoutDay(
  programId: string,
  workoutId: string,
  name: string,
) {
  const user = await requireUser();

  const program = await getProgramById(programId);

  if (!program || program.creatorId !== user.id) {
    throw new Error("Program not found.");
  }

  const workout = program.workouts.find(
    (item) => item.id === workoutId,
  );

  if (!workout) {
    throw new Error("Workout day not found.");
  }

  const cleanName = name.trim();

  if (!cleanName) {
    throw new Error("Workout day name is required.");
  }

  if (cleanName.length > 100) {
    throw new Error("Workout day name is too long.");
  }

  await db
    .update(programWorkouts)
    .set({
      name: cleanName,
    })
    .where(eq(programWorkouts.id, workoutId));

  revalidatePath(`/programs/${programId}`);
}

export async function moveWorkoutDay(
  programId: string,
  workoutId: string,
  direction: "up" | "down",
) {
  const user = await requireUser();

  const program = await getProgramById(programId);

  if (!program || program.creatorId !== user.id) {
    throw new Error("Program not found.");
  }

  const workouts = [...program.workouts].sort(
    (a, b) => a.dayNumber - b.dayNumber,
  );

  const currentIndex = workouts.findIndex(
    (workout) => workout.id === workoutId,
  );

  if (currentIndex === -1) {
    throw new Error("Workout day not found.");
  }

  const targetIndex =
    direction === "up"
      ? currentIndex - 1
      : currentIndex + 1;

  if (
    targetIndex < 0 ||
    targetIndex >= workouts.length
  ) {
    return;
  }

  const current = workouts[currentIndex];
  const target = workouts[targetIndex];

  await db.transaction(async (tx) => {
    await tx
      .update(programWorkouts)
      .set({ dayNumber: -1 })
      .where(eq(programWorkouts.id, current.id));

    await tx
      .update(programWorkouts)
      .set({ dayNumber: current.dayNumber })
      .where(eq(programWorkouts.id, target.id));

    await tx
      .update(programWorkouts)
      .set({ dayNumber: target.dayNumber })
      .where(eq(programWorkouts.id, current.id));
  });

  revalidatePath(`/programs/${programId}`);
}

export async function removeWorkoutDay(
  programId: string,
  workoutId: string,
) {
  const user = await requireUser();

  const program = await getProgramById(programId);

  if (!program || program.creatorId !== user.id) {
    throw new Error("Program not found.");
  }

  const workout = program.workouts.find(
    (item) => item.id === workoutId,
  );

  if (!workout) {
    throw new Error("Workout day not found.");
  }

  await db
    .delete(programWorkouts)
    .where(eq(programWorkouts.id, workoutId));

  await db
    .update(programWorkouts)
    .set({
      dayNumber: sql`${programWorkouts.dayNumber} - 1`,
    })
    .where(
      sql`
        ${programWorkouts.programId} = ${programId}
        AND ${programWorkouts.dayNumber} > ${workout.dayNumber}
      `,
    );

  revalidatePath(`/programs/${programId}`);
}
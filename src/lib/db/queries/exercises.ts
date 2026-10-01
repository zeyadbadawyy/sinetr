import { and, asc, eq, ilike } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  exerciseMuscles,
  exercises,
} from "@/lib/db/schema";

export async function getPublicExercises(search?: string) {
  const conditions = [eq(exercises.isPublic, true)];

  if (search?.trim()) {
    conditions.push(ilike(exercises.name, `%${search.trim()}%`));
  }

  return db
    .select()
    .from(exercises)
    .where(and(...conditions))
    .orderBy(asc(exercises.name));
}

export async function getExerciseBySlug(slug: string) {
  const exercise = await db
    .select()
    .from(exercises)
    .where(
      and(
        eq(exercises.slug, slug),
        eq(exercises.isPublic, true),
      ),
    )
    .limit(1);

  if (!exercise[0]) {
    return null;
  }

  const muscles = await db
    .select()
    .from(exerciseMuscles)
    .where(eq(exerciseMuscles.exerciseId, exercise[0].id));

  return {
    ...exercise[0],
    muscles,
  };
}
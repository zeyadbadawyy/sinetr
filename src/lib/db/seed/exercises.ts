import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { exercises, exerciseMuscles } from "@/lib/db/schema";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

const exerciseData = [
  {
    name: "Barbell Bench Press",
    slug: "barbell-bench-press",
    category: "strength" as const,
    equipment: "barbell" as const,
    description: "A horizontal pressing movement primarily training the chest.",
    instructions:
      "Set your position on the bench, grip the bar securely, lower it under control toward the chest, then press it upward while maintaining stable contact with the bench.",
    muscles: [
      { muscle: "chest" as const, isPrimary: true },
      { muscle: "triceps" as const, isPrimary: false },
      { muscle: "shoulders" as const, isPrimary: false },
    ],
  },
  {
    name: "Lat Pulldown",
    slug: "lat-pulldown",
    category: "strength" as const,
    equipment: "machine" as const,
    description: "A vertical pulling movement emphasizing the latissimus dorsi.",
    instructions:
      "Grip the bar, brace your torso, pull the bar toward the upper chest while driving the elbows down, then return the weight under control.",
    muscles: [
      { muscle: "back" as const, isPrimary: true },
      { muscle: "biceps" as const, isPrimary: false },
      { muscle: "forearms" as const, isPrimary: false },
    ],
  },
  {
    name: "Machine Chest Press",
    slug: "machine-chest-press",
    category: "strength" as const,
    equipment: "machine" as const,
    description: "A stable horizontal pressing movement targeting the chest.",
    instructions:
      "Set the seat and handles comfortably, brace your torso, press the handles forward, then return them under control.",
    muscles: [
      { muscle: "chest" as const, isPrimary: true },
      { muscle: "triceps" as const, isPrimary: false },
      { muscle: "shoulders" as const, isPrimary: false },
    ],
  },
  {
    name: "Cable Lateral Raise",
    slug: "cable-lateral-raise",
    category: "strength" as const,
    equipment: "cable" as const,
    description: "A shoulder isolation movement emphasizing the lateral deltoid.",
    instructions:
      "Stand beside the cable, grip the handle, raise the arm outward until approximately shoulder height, then lower it under control.",
    muscles: [
      { muscle: "shoulders" as const, isPrimary: true },
    ],
  },
  {
    name: "Seated Cable Row",
    slug: "seated-cable-row",
    category: "strength" as const,
    equipment: "cable" as const,
    description: "A horizontal pulling movement training the back.",
    instructions:
      "Brace your torso, pull the handle toward your body while driving the elbows back, then return under control.",
    muscles: [
      { muscle: "back" as const, isPrimary: true },
      { muscle: "biceps" as const, isPrimary: false },
      { muscle: "forearms" as const, isPrimary: false },
    ],
  },
  {
    name: "Leg Press",
    slug: "leg-press",
    category: "strength" as const,
    equipment: "machine" as const,
    description: "A machine-based lower-body compound movement.",
    instructions:
      "Position your feet securely on the platform, lower the sled under control, then press through the feet without losing your position.",
    muscles: [
      { muscle: "quadriceps" as const, isPrimary: true },
      { muscle: "glutes" as const, isPrimary: false },
      { muscle: "hamstrings" as const, isPrimary: false },
    ],
  },
];

async function seed() {
  for (const exercise of exerciseData) {
    const [inserted] = await db
      .insert(exercises)
      .values({
        name: exercise.name,
        slug: exercise.slug,
        category: exercise.category,
        equipment: exercise.equipment,
        description: exercise.description,
        instructions: exercise.instructions,
        isPublic: true,
      })
      .onConflictDoNothing()
      .returning({ id: exercises.id });

    if (!inserted) {
      continue;
    }

    await db.insert(exerciseMuscles).values(
      exercise.muscles.map((muscle) => ({
        exerciseId: inserted.id,
        muscle: muscle.muscle,
        isPrimary: muscle.isPrimary,
      })),
    );
  }

  await client.end();
}

seed();
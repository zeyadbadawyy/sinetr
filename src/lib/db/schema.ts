import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/* ----------------------------- */
/* Profiles                      */
/* ----------------------------- */

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/* ----------------------------- */
/* Exercises                     */
/* ----------------------------- */

export const exerciseCategoryEnum = pgEnum("exercise_category", [
  "strength",
  "cardio",
  "mobility",
  "stretching",
]);

export const exerciseEquipmentEnum = pgEnum("exercise_equipment", [
  "barbell",
  "dumbbell",
  "cable",
  "machine",
  "bodyweight",
  "kettlebell",
  "band",
  "other",
]);

export const muscleGroupEnum = pgEnum("muscle_group", [
  "chest",
  "back",
  "shoulders",
  "biceps",
  "triceps",
  "forearms",
  "quadriceps",
  "hamstrings",
  "glutes",
  "calves",
  "abdominals",
  "lower_back",
  "traps",
  "adductors",
  "abductors",
]);

export const exercises = pgTable("exercises", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),

  category: exerciseCategoryEnum("category").notNull(),
  equipment: exerciseEquipmentEnum("equipment").notNull(),

  description: text("description"),
  instructions: text("instructions"),

  isPublic: boolean("is_public").default(true).notNull(),

  createdBy: uuid("created_by").references(() => profiles.id, {
    onDelete: "set null",
  }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const exerciseMuscles = pgTable("exercise_muscles", {
  id: uuid("id").defaultRandom().primaryKey(),

  exerciseId: uuid("exercise_id")
    .notNull()
    .references(() => exercises.id, { onDelete: "cascade" }),

  muscle: muscleGroupEnum("muscle").notNull(),

  isPrimary: boolean("is_primary").default(false).notNull(),
});

/* ----------------------------- */
/* Programs                      */
/* ----------------------------- */

export const programs = pgTable("programs", {
  id: uuid("id").defaultRandom().primaryKey(),

  creatorId: uuid("creator_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),

  name: text("name").notNull(),
  description: text("description"),

  isPublic: boolean("is_public").default(false).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const programWorkouts = pgTable("program_workouts", {
  id: uuid("id").defaultRandom().primaryKey(),

  programId: uuid("program_id")
    .notNull()
    .references(() => programs.id, { onDelete: "cascade" }),

  name: text("name").notNull(),

  dayNumber: integer("day_number").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const workoutExercises = pgTable("workout_exercises", {
  id: uuid("id").defaultRandom().primaryKey(),

  workoutId: uuid("workout_id")
    .notNull()
    .references(() => programWorkouts.id, { onDelete: "cascade" }),

  exerciseId: uuid("exercise_id")
    .notNull()
    .references(() => exercises.id, { onDelete: "restrict" }),

  orderIndex: integer("order_index").notNull(),

  targetSets: integer("target_sets").notNull(),

  targetRepsMin: integer("target_reps_min"),
  targetRepsMax: integer("target_reps_max"),

  restSeconds: integer("rest_seconds"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/* ----------------------------- */
/* Workout Sessions               */
/* ----------------------------- */

export const workoutSessions = pgTable("workout_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: uuid("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  programWorkoutId: uuid("program_workout_id").references(
    () => programWorkouts.id,
    { onDelete: "set null" },
  ),
  startedAt: timestamp("started_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  notes: text("notes"),
});

/* ----------------------------- */
/* Sets                          */
/* ----------------------------- */

export const sets = pgTable("sets", {
  id: uuid("id").defaultRandom().primaryKey(),
  workoutSessionId: uuid("workout_session_id")
    .notNull()
    .references(() => workoutSessions.id, { onDelete: "cascade" }),
  exerciseId: uuid("exercise_id")
    .notNull()
    .references(() => exercises.id, { onDelete: "restrict" }),
  setNumber: integer("set_number").notNull(),
  weight: numeric("weight", { precision: 8, scale: 2 }),
  reps: integer("reps"),
  durationSeconds: integer("duration_seconds"),
  distance: integer("distance"),
  completed: boolean("completed").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
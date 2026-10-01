import type {
  InferInsertModel,
  InferSelectModel,
} from "drizzle-orm";

import {
  exercises,
  exerciseMuscles,
  profiles,
  programWorkouts,
  programs,
  sets,
  workoutExercises,
  workoutSessions,
} from "./schema";

export type Profile = InferSelectModel<typeof profiles>;
export type NewProfile = InferInsertModel<typeof profiles>;

export type Exercise = InferSelectModel<typeof exercises>;
export type NewExercise = InferInsertModel<typeof exercises>;

export type ExerciseMuscle = InferSelectModel<typeof exerciseMuscles>;
export type NewExerciseMuscle = InferInsertModel<typeof exerciseMuscles>;

export type Program = InferSelectModel<typeof programs>;
export type NewProgram = InferInsertModel<typeof programs>;

export type ProgramWorkout = InferSelectModel<typeof programWorkouts>;
export type NewProgramWorkout = InferInsertModel<typeof programWorkouts>;

export type WorkoutExercise = InferSelectModel<typeof workoutExercises>;
export type NewWorkoutExercise = InferInsertModel<typeof workoutExercises>;

export type WorkoutSession = InferSelectModel<typeof workoutSessions>;
export type NewWorkoutSession = InferInsertModel<typeof workoutSessions>;

export type Set = InferSelectModel<typeof sets>;
export type NewSet = InferInsertModel<typeof sets>;
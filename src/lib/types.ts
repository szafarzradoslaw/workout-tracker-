export type ID = string;

export type Exercise = {
  id: ID;
  name: string;
  muscleGroup?: string; // optional future filtering (chest, legs, etc.)
  createdAt: number;
  updatedAt: number;
};

/**
 * A workout session (a single day / workout instance)
 */
export type WorkoutSession = {
  id: ID;
  date: number; // store as timestamp for easier sorting/filtering
  title?: string; // optional ("Push Day", "Leg Day")
  createdAt: number;
};

/**
 * Links a session to an exercise
 * (many-to-many friendly structure)
 */
export type SessionExercise = {
  id: ID;
  sessionId: ID;
  exerciseId: ID;

  order: number; // ordering inside workout session
  notes?: string;
};

/**
 * Individual set performed in a session exercise
 */
export type ExerciseSet = {
  id: ID;
  sessionExerciseId: ID;

  reps: number;
  weight: number; // consider kg standard internally
  rpe?: number; // optional intensity tracking (1–10 scale)

  createdAt: number;
};
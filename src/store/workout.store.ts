import { create } from "zustand";
import type {
  Exercise,
  WorkoutSession,
  ExerciseSet,
  SessionExercise,
} from "@/lib/types";

import { createWorkoutActions } from "./workout.actions";

export type WorkoutState = {
  // -------------------------
  // ENTITIES
  // -------------------------
  exercises: Record<string, Exercise>;
  sessions: Record<string, WorkoutSession>;
  sessionExercises: Record<string, SessionExercise>;
  sets: Record<string, ExerciseSet>;

  // -------------------------
  // STATE
  // -------------------------
  hydrated: boolean;
  activeSessionId: string | null;

  // -------------------------
  // ACTIONS
  // -------------------------
  hydrate: () => Promise<void>;
  createSession: () => Promise<string>;

  startSession: () => Promise<string>;
  endSession: () => Promise<void>;

  addExerciseToSession: (
    sessionId: string,
    exerciseId: string
  ) => Promise<string>;

  addSet: (
    sessionExerciseId: string,
    reps: number,
    weight: number
  ) => Promise<string>;
};

// -------------------------
// STORE
// -------------------------
export const useWorkoutStore = create<WorkoutState>((set, get) => {
  const actions = createWorkoutActions(set, get);

  return {
    // -------------------------
    // STATE
    // -------------------------
    exercises: {},
    sessions: {},
    sessionExercises: {},
    sets: {},
    hydrated: false,
    activeSessionId: null,

    // -------------------------
    // ACTIONS
    // -------------------------
    ...actions,
  };
});
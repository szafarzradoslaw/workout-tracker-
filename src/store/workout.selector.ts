import type { WorkoutState } from "./workout.store";
import type { SessionExercise, ExerciseSet } from "@/lib/types";

// -------------------------
// BASIC SELECTORS
// -------------------------
export const selectSessionsArray = (state: WorkoutState) =>
  Object.values(state.sessions);

export const selectExercisesArray = (state: WorkoutState) =>
  Object.values(state.exercises);

// -------------------------
// SESSION DETAILS (HYDRATED VIEW MODEL)
// -------------------------
export const selectSessionDetails =
  (sessionId: string) => (state: WorkoutState) => {
    const session = state.sessions[sessionId];
    if (!session) return null;

    const sessionExercises = Object.values(
      state.sessionExercises
    ) as SessionExercise[];

    const sets = Object.values(
      state.sets
    ) as ExerciseSet[];

    const filteredSessionExercises = sessionExercises.filter(
      se => se.sessionId === sessionId
    );

    return {
      ...session,

      exercises: filteredSessionExercises.map(se => ({
        ...se,

        exercise: state.exercises[se.exerciseId] ?? null,

        sets: sets.filter(
          set => set.sessionExerciseId === se.id
        ),
      })),
    };
  };
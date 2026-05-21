import { create } from "zustand";
import type { WorkoutSession, ExerciseSet } from "@/lib/types";

type WorkoutState = {
  sessions: WorkoutSession[];
  createSession: () => void;
  addExercise: (sessionId: string, name: string) => void;
  addSet: (
    sessionId: string,
    exerciseId: string,
    exerciseSet: Omit<ExerciseSet, "id"> // Bug 2 fix: id is generated internally
  ) => void;
};

export const useWorkoutStore = create<WorkoutState>((set) => ({
  sessions: [],

  createSession: () =>
    set((state) => ({
      sessions: [
        {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          exercises: [],
        },
        ...state.sessions,
      ],
    })),

  addExercise: (sessionId, name) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              exercises: [
                ...session.exercises,
                {
                  id: crypto.randomUUID(),
                  name,
                  sets: [],
                },
              ],
            }
          : session
      ),
    })),

  // Bug 1 fix: renamed parameter from `set` to `exerciseSet`
  addSet: (sessionId, exerciseId, exerciseSet) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id !== sessionId
          ? session
          : {
              ...session,
              exercises: session.exercises.map((exercise) =>
                exercise.id === exerciseId
                  ? {
                      ...exercise,
                      sets: [
                        ...exercise.sets,
                        {
                          ...exerciseSet,
                          id: crypto.randomUUID(),
                        },
                      ],
                    }
                  : exercise
              ),
            }
      ),
    })),
}));
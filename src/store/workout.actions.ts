import { workoutDB } from "@/db/workoutDB";
import type { WorkoutState } from "./workout.store";
import type { SessionExercise } from "@/lib/types";

export const createWorkoutActions = (
  set: any,
  get: any
) => ({
  // -------------------------
  // HYDRATION
  // -------------------------
  hydrate: async () => {
    const [exercises, sessions, sessionExercises, sets] = await Promise.all([
      workoutDB.getExercises(),
      workoutDB.getSessions(),
      workoutDB.getSessionExercises(),
      workoutDB.getSets(),
    ]);

    set({
      exercises: Object.fromEntries(exercises.map(e => [e.id, e])),
      sessions: Object.fromEntries(sessions.map(s => [s.id, s])),
      sessionExercises: Object.fromEntries(sessionExercises.map(se => [se.id, se])),
      sets: Object.fromEntries(sets.map(s => [s.id, s])),
      hydrated: true,
    });
  },

  // -------------------------
  // CREATE SESSION (LEGACY - OPTIONAL)
  // -------------------------
  createSession: async () => {
    const id = crypto.randomUUID();

    const session = {
      id,
      date: Date.now(),
      createdAt: Date.now(),
    };

    await workoutDB.putSession(session);

    set((state: WorkoutState) => ({
      sessions: {
        ...state.sessions,
        [id]: session,
      },
    }));

    return id;
  },

  // -------------------------
  // START SESSION (RUNTIME ENTRY POINT)
  // -------------------------
  startSession: async () => {
    const id = crypto.randomUUID();

    const session = {
      id,
      date: Date.now(),
      createdAt: Date.now(),
      status: "active",
    };

    await workoutDB.putSession(session);

    set((state: WorkoutState) => ({
      sessions: {
        ...state.sessions,
        [id]: session,
      },
      activeSessionId: id,
    }));

    return id;
  },

  // -------------------------
  // END SESSION (RUNTIME EXIT)
  // -------------------------
  endSession: async () => {
    const id = get().activeSessionId;
    if (!id) return;

    const session = get().sessions[id];
    if (!session) return;

    const updated = {
      ...session,
      status: "completed",
      endedAt: Date.now(),
    };

    await workoutDB.putSession(updated);

    set((state: WorkoutState) => ({
      sessions: {
        ...state.sessions,
        [id]: updated,
      },
      activeSessionId: null,
    }));
  },

  // -------------------------
  // ADD EXERCISE TO SESSION
  // -------------------------
  addExerciseToSession: async (sessionId: string, exerciseId: string) => {
    const id = crypto.randomUUID();

    const sessionExercises = Object.values(
      get().sessionExercises
    ) as SessionExercise[];

    const existingForSession = sessionExercises.filter(
      se => se.sessionId === sessionId
    );

    const sessionExercise = {
      id,
      sessionId,
      exerciseId,
      order:
        existingForSession.reduce(
          (max, se) => Math.max(max, se.order ?? 0),
          0
        ) + 1,
    };

    await workoutDB.putSessionExercise(sessionExercise);

    set((state: WorkoutState) => ({
      sessionExercises: {
        ...state.sessionExercises,
        [id]: sessionExercise,
      },
    }));

    return id;
  },

  // -------------------------
  // ADD SET
  // -------------------------
  addSet: async (
    sessionExerciseId: string,
    reps: number,
    weight: number
  ) => {
    const id = crypto.randomUUID();

    const newSet = {
      id,
      sessionExerciseId,
      reps,
      weight,
      createdAt: Date.now(),
    };

    await workoutDB.putSet(newSet);

    set((state: WorkoutState) => ({
      sets: {
        ...state.sets,
        [id]: newSet,
      },
    }));

    return id;
  },
});
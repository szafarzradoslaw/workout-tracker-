import { openDB, DBSchema, IDBPDatabase } from "idb";
import type {
  Exercise,
  WorkoutSession,
  SessionExercise,
  ExerciseSet,
} from "@/lib/types";

/**
 * Centralized DB schema (prevents string mistakes)
 */
interface WorkoutDBSchema extends DBSchema {
  exercises: {
    key: string;
    value: Exercise;
  };
  sessions: {
    key: string;
    value: WorkoutSession;
  };
  sessionExercises: {
    key: string;
    value: SessionExercise;
  };
  sets: {
    key: string;
    value: ExerciseSet;
  };
}

const DB_NAME = "workout-db";
const DB_VERSION = 1;

let db: IDBPDatabase<WorkoutDBSchema> | null = null;

/**
 * Singleton DB connection
 */
export async function getDB() {
  if (db) return db;

  db = await openDB<WorkoutDBSchema>(DB_NAME, DB_VERSION, {
    upgrade(database) {
      if (!database.objectStoreNames.contains("exercises")) {
        database.createObjectStore("exercises", { keyPath: "id" });
      }

      if (!database.objectStoreNames.contains("sessions")) {
        database.createObjectStore("sessions", { keyPath: "id" });
      }

      if (!database.objectStoreNames.contains("sessionExercises")) {
        database.createObjectStore("sessionExercises", {
          keyPath: "id",
        });
      }

      if (!database.objectStoreNames.contains("sets")) {
        database.createObjectStore("sets", { keyPath: "id" });
      }
    },
  });

  return db;
}

export const workoutDB = {
  // -------------------
  // EXERCISES
  // -------------------
  async getExercises(): Promise<Exercise[]> {
    const db = await getDB();
    return db.getAll("exercises");
  },

  async putExercise(ex: Exercise) {
    const db = await getDB();
    return db.put("exercises", ex);
  },

  async deleteExercise(id: string) {
    const db = await getDB();
    return db.delete("exercises", id);
  },

  // -------------------
  // SESSIONS
  // -------------------
  async getSessions(): Promise<WorkoutSession[]> {
    const db = await getDB();
    return db.getAll("sessions");
  },

  async putSession(session: WorkoutSession) {
    const db = await getDB();
    return db.put("sessions", session);
  },

  async deleteSession(id: string) {
    const db = await getDB();
    return db.delete("sessions", id);
  },

  // -------------------
  // SESSION EXERCISES
  // -------------------
  async getSessionExercises(): Promise<SessionExercise[]> {
    const db = await getDB();
    return db.getAll("sessionExercises");
  },

  async putSessionExercise(se: SessionExercise) {
    const db = await getDB();
    return db.put("sessionExercises", se);
  },

  // -------------------
  // SETS
  // -------------------
  async getSets(): Promise<ExerciseSet[]> {
    const db = await getDB();
    return db.getAll("sets");
  },1

  async putSet(set: ExerciseSet) {
    const db = await getDB();11
    return db.put("sets", set);
  },

  async deleteSet(id: string) {
    const db = await getDB();
    return db.delete("sets", id);
  },
};1
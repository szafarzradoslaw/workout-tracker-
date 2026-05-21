export type ExerciseSet = {
  id: string;
  reps: number;
  weight: number;
};

export type Exercise = {
  id: string;
  name: string;
  sets: ExerciseSet[];
};

export type WorkoutSession = {
  id: string;
  date: string;
  exercises: Exercise[];
};
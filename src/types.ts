export interface UserProfile {
  name: string;
  weight: number; // kg
  height: number; // cm
  age: number;
  gender: 'male' | 'female';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goal: 'muscle_gain' | 'fat_loss' | 'strength' | 'endurance';
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  image?: string;
  sets: number;
  reps: number;
  weight: number; // kg
  isEasy: boolean;
  notes: string;
}

export interface WorkoutDay {
  id: string;
  name: string;
  dayOfWeek: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  days: WorkoutDay[];
  createdAt: string;
}

export interface EquipmentImage {
  id: string;
  name: string;
  imageUrl: string;
  muscleGroup: string;
}

export interface WeightLog {
  exerciseId: string;
  date: string;
  weight: number;
  wasEasy: boolean;
}

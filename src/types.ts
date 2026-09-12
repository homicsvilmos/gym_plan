export interface UserProfile {
  name: string;
  weight: number | '';
  height: number | '';
  age: number | '';
  gender: 'male' | 'female';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goal: 'muscle_gain' | 'fat_loss' | 'strength' | 'endurance';
  daysPerWeek: number;
  language: 'hu' | 'en' | 'system';
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  image?: string;
  sets: number;
  reps: number;
  weight: number;
  isEasy: boolean;
  isHard: boolean;
  notes: string;
  assignedEquipment?: string; // equipment id
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

export interface GymMachine {
  id: string;
  name: string;
  originalName: string;
  imageUrl: string;
  muscleGroup: string;
  isDefault: boolean;
  isCustom: boolean;
}

export interface WeightLog {
  exerciseId: string;
  date: string;
  weight: number;
  wasEasy: boolean;
  wasHard: boolean;
}

export type Language = 'hu' | 'en' | 'system';

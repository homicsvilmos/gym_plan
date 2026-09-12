import { Exercise, WorkoutDay, UserProfile } from './types';

const exerciseDatabase: Record<string, Omit<Exercise, 'weight' | 'isEasy'>[]> = {
  chest: [
    { id: 'bench-press', name: 'Fekvenyomás', muscleGroup: 'Mell', sets: 4, reps: 10, notes: '' },
    { id: 'incline-press', name: 'Ferdeknyomás', muscleGroup: 'Mell', sets: 3, reps: 12, notes: '' },
    { id: 'chest-fly', name: 'Tárogatás', muscleGroup: 'Mell', sets: 3, reps: 12, notes: '' },
    { id: 'cable-crossover', name: 'Kábel keresztezés', muscleGroup: 'Mell', sets: 3, reps: 15, notes: '' },
  ],
  back: [
    { id: 'deadlift', name: 'Felhúzás', muscleGroup: 'Hát', sets: 4, reps: 8, notes: '' },
    { id: 'lat-pulldown', name: 'Lehúzás csigán', muscleGroup: 'Hát', sets: 4, reps: 10, notes: '' },
    { id: 'barbell-row', name: 'Döntött törzsevezetés', muscleGroup: 'Hát', sets: 3, reps: 10, notes: '' },
    { id: 'seated-row', name: 'Ülő evezés', muscleGroup: 'Hát', sets: 3, reps: 12, notes: '' },
  ],
  legs: [
    { id: 'squat', name: 'Guggolás', muscleGroup: 'Láb', sets: 4, reps: 10, notes: '' },
    { id: 'leg-press', name: 'Lábtoló', muscleGroup: 'Láb', sets: 4, reps: 12, notes: '' },
    { id: 'leg-curl', name: 'Lábhajlítás', muscleGroup: 'Láb', sets: 3, reps: 12, notes: '' },
    { id: 'leg-extension', name: 'Lábnyújtás', muscleGroup: 'Láb', sets: 3, reps: 15, notes: '' },
    { id: 'calf-raise', name: 'Vádli emelés', muscleGroup: 'Láb', sets: 4, reps: 15, notes: '' },
  ],
  shoulders: [
    { id: 'overhead-press', name: 'Vállból nyomás', muscleGroup: 'Váll', sets: 4, reps: 10, notes: '' },
    { id: 'lateral-raise', name: 'Oldalemelés', muscleGroup: 'Váll', sets: 3, reps: 12, notes: '' },
    { id: 'front-raise', name: 'Előreemelés', muscleGroup: 'Váll', sets: 3, reps: 12, notes: '' },
    { id: 'face-pull', name: 'Face pull', muscleGroup: 'Váll', sets: 3, reps: 15, notes: '' },
  ],
  arms: [
    { id: 'bicep-curl', name: 'Bicepsz hajlítás', muscleGroup: 'Kar', sets: 3, reps: 12, notes: '' },
    { id: 'hammer-curl', name: 'Kalapács hajlítás', muscleGroup: 'Kar', sets: 3, reps: 12, notes: '' },
    { id: 'tricep-pushdown', name: 'Tricepsz letolás', muscleGroup: 'Kar', sets: 3, reps: 12, notes: '' },
    { id: 'skull-crusher', name: 'Francia nyomás', muscleGroup: 'Kar', sets: 3, reps: 10, notes: '' },
  ],
  core: [
    { id: 'plank', name: 'Plank', muscleGroup: 'Törzs', sets: 3, reps: 60, notes: 'másodperc' },
    { id: 'crunch', name: 'Hasprés', muscleGroup: 'Törzs', sets: 3, reps: 20, notes: '' },
    { id: 'leg-raise', name: 'Lábemelés', muscleGroup: 'Törzs', sets: 3, reps: 15, notes: '' },
    { id: 'russian-twist', name: 'Orosz csavarás', muscleGroup: 'Törzs', sets: 3, reps: 20, notes: '' },
  ],
};

function calculateBaseWeight(exerciseId: string, profile: UserProfile): number {
  const weightFactor = profile.weight * 0.4;
  
  const multipliers: Record<string, number> = {
    'bench-press': 0.6,
    'incline-press': 0.5,
    'chest-fly': 0.15,
    'cable-crossover': 0.2,
    'deadlift': 1.0,
    'lat-pulldown': 0.5,
    'barbell-row': 0.5,
    'seated-row': 0.4,
    'squat': 0.8,
    'leg-press': 1.2,
    'leg-curl': 0.3,
    'leg-extension': 0.25,
    'calf-raise': 0.5,
    'overhead-press': 0.4,
    'lateral-raise': 0.12,
    'front-raise': 0.1,
    'face-pull': 0.15,
    'bicep-curl': 0.2,
    'hammer-curl': 0.2,
    'tricep-pushdown': 0.25,
    'skull-crusher': 0.3,
    'plank': 0,
    'crunch': 0,
    'leg-raise': 0,
    'russian-twist': 5,
  };

  const multiplier = multipliers[exerciseId] || 0.3;
  let weight = Math.round(weightFactor * multiplier);
  
  // Fitness level adjustment
  if (profile.fitnessLevel === 'beginner') weight = Math.round(weight * 0.7);
  else if (profile.fitnessLevel === 'advanced') weight = Math.round(weight * 1.3);

  // Round to nearest 2.5kg
  weight = Math.round(weight / 2.5) * 2.5;
  if (weight < 5 && exerciseId !== 'plank' && exerciseId !== 'crunch' && exerciseId !== 'leg-raise') weight = 5;
  
  return weight;
}

export function generateWorkoutPlan(profile: UserProfile): WorkoutDay[] {
  const days: WorkoutDay[] = [];
  
  const splitOptions: Record<string, { name: string; groups: string[] }[]> = {
    beginner: [
      { name: 'A - Teljes test', groups: ['chest', 'back', 'legs', 'shoulders', 'core'] },
      { name: 'B - Teljes test', groups: ['back', 'legs', 'chest', 'arms', 'core'] },
      { name: 'C - Teljes test', groups: ['legs', 'shoulders', 'back', 'arms', 'core'] },
    ],
    intermediate: [
      { name: 'Hétfő - Mell + Tricepsz', groups: ['chest', 'arms'] },
      { name: 'Szerda - Hát + Bicepsz', groups: ['back', 'arms'] },
      { name: 'Péntek - Láb + Váll', groups: ['legs', 'shoulders'] },
    ],
    advanced: [
      { name: 'Hétfő - Mell', groups: ['chest', 'core'] },
      { name: 'Kedd - Hát', groups: ['back'] },
      { name: 'Szerda - Láb', groups: ['legs', 'core'] },
      { name: 'Csütörtök - Váll', groups: ['shoulders'] },
      { name: 'Péntek - Kar', groups: ['arms', 'core'] },
    ],
  };

  const split = splitOptions[profile.fitnessLevel] || splitOptions.intermediate;
  const dayNames = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'];

  split.forEach((daySplit, index) => {
    const exercises: Exercise[] = [];
    
    daySplit.groups.forEach(group => {
      const groupExercises = exerciseDatabase[group];
      if (groupExercises) {
        // Pick 2 exercises per group for beginner, 2 for intermediate, 2-3 for advanced
        const count = profile.fitnessLevel === 'advanced' ? 
          Math.min(3, groupExercises.length) : 2;
        
        const selected = groupExercises.slice(0, count);
        selected.forEach(ex => {
          exercises.push({
            ...ex,
            weight: calculateBaseWeight(ex.id, profile),
            isEasy: false,
          });
        });
      }
    });

    days.push({
      id: `day-${index}`,
      name: daySplit.name,
      dayOfWeek: dayNames[index],
      exercises,
    });
  });

  return days;
}

export function calibrateWeight(exercise: Exercise, profile: UserProfile): Exercise {
  // If the weight was easy, increase by 10-15%
  if (exercise.isEasy) {
    let newWeight = exercise.weight * 1.125;
    newWeight = Math.round(newWeight / 2.5) * 2.5;
    if (newWeight <= exercise.weight) newWeight = exercise.weight + 2.5;
    
    return {
      ...exercise,
      weight: newWeight,
      isEasy: false,
      notes: `⬆️ Felsúlyozva ${exercise.weight}kg → ${newWeight}kg`,
    };
  }
  return exercise;
}

export function getBMICategory(profile: UserProfile): { bmi: number; category: string; color: string } {
  const heightM = profile.height / 100;
  const bmi = profile.weight / (heightM * heightM);
  
  let category = '';
  let color = '';
  
  if (bmi < 18.5) { category = 'Sovány'; color = 'text-blue-400'; }
  else if (bmi < 25) { category = 'Normál'; color = 'text-green-400'; }
  else if (bmi < 30) { category = 'Túlsúlyos'; color = 'text-yellow-400'; }
  else { category = 'Elhízott'; color = 'text-red-400'; }
  
  return { bmi: Math.round(bmi * 10) / 10, category, color };
}

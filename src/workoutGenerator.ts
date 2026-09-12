import { Exercise, WorkoutDay, UserProfile } from './types';

const exerciseDatabase: Record<string, Omit<Exercise, 'weight' | 'isEasy' | 'isHard'>[]> = {
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
  const weight = typeof profile.weight === 'number' ? profile.weight : 75;
  const weightFactor = weight * 0.4;
  
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
  let calculated = Math.round(weightFactor * multiplier);
  
  // Fitness level adjustment
  if (profile.fitnessLevel === 'beginner') calculated = Math.round(calculated * 0.7);
  else if (profile.fitnessLevel === 'advanced') calculated = Math.round(calculated * 1.3);

  // Round to nearest 2.5kg
  calculated = Math.round(calculated / 2.5) * 2.5;
  if (calculated < 5 && exerciseId !== 'plank' && exerciseId !== 'crunch' && exerciseId !== 'leg-raise') calculated = 5;
  
  return calculated;
}

export function generateWorkoutPlan(profile: UserProfile): WorkoutDay[] {
  const days: WorkoutDay[] = [];
  const daysPerWeek = profile.daysPerWeek || 3;
  
  // Determine split based on days per week and fitness level
  let split: { name: string; groups: string[] }[];
  
  if (daysPerWeek <= 2) {
    split = [
      { name: 'A - Teljes test', groups: ['chest', 'back', 'legs', 'shoulders', 'core'] },
      { name: 'B - Teljes test', groups: ['back', 'legs', 'chest', 'arms', 'core'] },
    ];
  } else if (daysPerWeek === 3) {
    split = [
      { name: 'Hétfő - Mell + Tricepsz', groups: ['chest', 'arms'] },
      { name: 'Szerda - Hát + Bicepsz', groups: ['back', 'arms'] },
      { name: 'Péntek - Láb + Váll', groups: ['legs', 'shoulders'] },
    ];
  } else if (daysPerWeek === 4) {
    split = [
      { name: 'Hétfő - Mell + Váll', groups: ['chest', 'shoulders'] },
      { name: 'Kedd - Hát + Kar', groups: ['back', 'arms'] },
      { name: 'Csütörtök - Láb', groups: ['legs', 'core'] },
      { name: 'Péntek - Felsőtest', groups: ['chest', 'back', 'arms'] },
    ];
  } else if (daysPerWeek === 5) {
    split = [
      { name: 'Hétfő - Mell', groups: ['chest', 'core'] },
      { name: 'Kedd - Hát', groups: ['back'] },
      { name: 'Szerda - Láb', groups: ['legs', 'core'] },
      { name: 'Csütörtök - Váll', groups: ['shoulders'] },
      { name: 'Péntek - Kar', groups: ['arms', 'core'] },
    ];
  } else {
    // 6 days - PPL x2
    split = [
      { name: 'Hétfő - Toló (Mell, Váll, Tricepsz)', groups: ['chest', 'shoulders', 'arms'] },
      { name: 'Kedd - Húzó (Hát, Bicepsz)', groups: ['back', 'arms'] },
      { name: 'Szerda - Láb', groups: ['legs', 'core'] },
      { name: 'Csütörtök - Toló', groups: ['chest', 'shoulders', 'arms'] },
      { name: 'Péntek - Húzó', groups: ['back', 'arms'] },
      { name: 'Szombat - Láb + Törzs', groups: ['legs', 'core'] },
    ];
  }

  // Limit to daysPerWeek
  split = split.slice(0, daysPerWeek);

  split.forEach((daySplit, index) => {
    const exercises: Exercise[] = [];
    
    daySplit.groups.forEach(group => {
      const groupExercises = exerciseDatabase[group];
      if (groupExercises) {
        const count = profile.fitnessLevel === 'advanced' ? 
          Math.min(3, groupExercises.length) : 2;
        
        const selected = groupExercises.slice(0, count);
        selected.forEach(ex => {
          exercises.push({
            ...ex,
            weight: calculateBaseWeight(ex.id, profile),
            isEasy: false,
            isHard: false,
          });
        });
      }
    });

    days.push({
      id: `day-${index}`,
      name: daySplit.name,
      dayOfWeek: ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'][index],
      exercises,
    });
  });

  return days;
}

export function calibrateWeightEasy(exercise: Exercise, profile: UserProfile): Exercise {
  // If the weight was easy, increase by 10-15%
  let newWeight = exercise.weight * 1.125;
  newWeight = Math.round(newWeight / 2.5) * 2.5;
  if (newWeight <= exercise.weight) newWeight = exercise.weight + 2.5;
  
  return {
    ...exercise,
    weight: newWeight,
    isEasy: false,
    isHard: false,
    notes: `⬆️ Felsúlyozva ${exercise.weight}kg → ${newWeight}kg`,
  };
}

export function calibrateWeightHard(exercise: Exercise, profile: UserProfile): Exercise {
  // If the weight was hard, decrease by 10%
  let newWeight = exercise.weight * 0.9;
  newWeight = Math.round(newWeight / 2.5) * 2.5;
  if (newWeight >= exercise.weight) newWeight = exercise.weight - 2.5;
  if (newWeight < 2.5) newWeight = 2.5;
  
  return {
    ...exercise,
    weight: newWeight,
    isEasy: false,
    isHard: false,
    notes: `⬇️ Lesúlyozva ${exercise.weight}kg → ${newWeight}kg`,
  };
}

export function getBMICategory(profile: UserProfile): { bmi: number; category: string; color: string } {
  const weight = typeof profile.weight === 'number' ? profile.weight : 75;
  const height = typeof profile.height === 'number' ? profile.height : 175;
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  
  let category = '';
  let color = '';
  
  if (bmi < 18.5) { category = 'Sovány'; color = 'text-blue-400'; }
  else if (bmi < 25) { category = 'Normál'; color = 'text-green-400'; }
  else if (bmi < 30) { category = 'Túlsúlyos'; color = 'text-yellow-400'; }
  else { category = 'Elhízott'; color = 'text-red-400'; }
  
  return { bmi: Math.round(bmi * 10) / 10, category, color };
}

// Default gym machines
export const defaultGymMachines = [
  { id: 'default-bench', name: 'Pad', muscleGroup: 'Mell', isDefault: true, isCustom: false },
  { id: 'default-incline-bench', name: 'Döntött pad', muscleGroup: 'Mell', isDefault: true, isCustom: false },
  { id: 'default-cable-machine', name: 'Csiga gép', muscleGroup: 'Mell', isDefault: true, isCustom: false },
  { id: 'default-chest-fly-machine', name: 'Tárogató gép', muscleGroup: 'Mell', isDefault: true, isCustom: false },
  { id: 'default-lat-pulldown', name: 'Lehúzó csiga', muscleGroup: 'Hát', isDefault: true, isCustom: false },
  { id: 'default-seated-row', name: 'Ülő evező gép', muscleGroup: 'Hát', isDefault: true, isCustom: false },
  { id: 'default-t-bar-row', name: 'T-rúd evező', muscleGroup: 'Hát', isDefault: true, isCustom: false },
  { id: 'default-squat-rack', name: 'Guggoló állvány', muscleGroup: 'Láb', isDefault: true, isCustom: false },
  { id: 'default-leg-press', name: 'Lábtoló gép', muscleGroup: 'Láb', isDefault: true, isCustom: false },
  { id: 'default-leg-curl', name: 'Lábhajlító gép', muscleGroup: 'Láb', isDefault: true, isCustom: false },
  { id: 'default-leg-extension', name: 'Lábnyújtó gép', muscleGroup: 'Láb', isDefault: true, isCustom: false },
  { id: 'default-calf-machine', name: 'Vádli gép', muscleGroup: 'Láb', isDefault: true, isCustom: false },
  { id: 'default-hack-squat', name: 'Hackenschmidt gép', muscleGroup: 'Láb', isDefault: true, isCustom: false },
  { id: 'default-shoulder-press', name: 'Vállnyomó gép', muscleGroup: 'Váll', isDefault: true, isCustom: false },
  { id: 'default-smith-machine', name: 'Smith gép', muscleGroup: 'Váll', isDefault: true, isCustom: false },
  { id: 'default-bicep-machine', name: 'Bicepsz gép', muscleGroup: 'Kar', isDefault: true, isCustom: false },
  { id: 'default-tricep-machine', name: 'Tricepsz gép', muscleGroup: 'Kar', isDefault: true, isCustom: false },
  { id: 'default-preacher-curl', name: 'Prédikátor pad', muscleGroup: 'Kar', isDefault: true, isCustom: false },
  { id: 'default-ab-machine', name: 'Hasprés gép', muscleGroup: 'Törzs', isDefault: true, isCustom: false },
  { id: 'default-cable-crossover', name: 'Kábel crossover', muscleGroup: 'Mell', isDefault: true, isCustom: false },
  { id: 'default-dumbbell-rack', name: 'Kézsúlyzó állvány', muscleGroup: 'Kar', isDefault: true, isCustom: false },
  { id: 'default-barbell-rack', name: 'Rúdsúlyzó állvány', muscleGroup: 'Láb', isDefault: true, isCustom: false },
  { id: 'default-pull-up-bar', name: 'Húdzódkodó rúd', muscleGroup: 'Hát', isDefault: true, isCustom: false },
  { id: 'default-dip-bar', name: 'Tolódzkodó korlát', muscleGroup: 'Mell', isDefault: true, isCustom: false },
];

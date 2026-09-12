import { Exercise, WorkoutPlan, UserProfile } from './types';

// Tudományosan megalapozott gyakorlatok izomcsoportonként
const exerciseDatabase = {
  chest: [
    { id: 'bench-press', name: 'Fekvenyomás', muscleGroup: 'Mell', sets: 4, reps: '8-12', difficulty: 'intermediate' },
    { id: 'incline-bench', name: 'Ferdepados nyomás', muscleGroup: 'Mell', sets: 3, reps: '10-12', difficulty: 'intermediate' },
    { id: 'dumbbell-fly', name: 'Tárogatás kézisúlyzóval', muscleGroup: 'Mell', sets: 3, reps: '12-15', difficulty: 'beginner' },
    { id: 'cable-crossover', name: 'Kábel keresztezés', muscleGroup: 'Mell', sets: 3, reps: '12-15', difficulty: 'beginner' },
    { id: 'push-ups', name: 'Fekvőtámasz', muscleGroup: 'Mell', sets: 3, reps: '15-20', difficulty: 'beginner' },
  ],
  back: [
    { id: 'pull-ups', name: 'Húzódzkodás', muscleGroup: 'Hát', sets: 4, reps: '6-10', difficulty: 'intermediate' },
    { id: 'lat-pulldown', name: 'Széles lehúzás', muscleGroup: 'Hát', sets: 3, reps: '10-12', difficulty: 'beginner' },
    { id: 'barbell-row', name: 'Döntött törzsű evezés', muscleGroup: 'Hát', sets: 4, reps: '8-12', difficulty: 'intermediate' },
    { id: 'seated-row', name: 'Ülő evezés', muscleGroup: 'Hát', sets: 3, reps: '10-12', difficulty: 'beginner' },
    { id: 'face-pull', name: 'Face pull', muscleGroup: 'Hát', sets: 3, reps: '15-20', difficulty: 'beginner' },
  ],
  legs: [
    { id: 'squat', name: 'Guggolás', muscleGroup: 'Láb', sets: 4, reps: '6-10', difficulty: 'intermediate' },
    { id: 'leg-press', name: 'Lábtoló', muscleGroup: 'Láb', sets: 3, reps: '10-12', difficulty: 'beginner' },
    { id: 'romanian-deadlift', name: 'Román felhúzás', muscleGroup: 'Láb', sets: 3, reps: '8-12', difficulty: 'intermediate' },
    { id: 'leg-curl', name: 'Lábhajlítás', muscleGroup: 'Láb', sets: 3, reps: '12-15', difficulty: 'beginner' },
    { id: 'leg-extension', name: 'Lábnyújtás', muscleGroup: 'Láb', sets: 3, reps: '12-15', difficulty: 'beginner' },
    { id: 'calf-raise', name: 'Vádli emelés', muscleGroup: 'Láb', sets: 4, reps: '15-20', difficulty: 'beginner' },
  ],
  shoulders: [
    { id: 'overhead-press', name: 'Vállból nyomás', muscleGroup: 'Váll', sets: 4, reps: '8-12', difficulty: 'intermediate' },
    { id: 'lateral-raise', name: 'Oldalemelés', muscleGroup: 'Váll', sets: 3, reps: '12-15', difficulty: 'beginner' },
    { id: 'front-raise', name: 'Előre emelés', muscleGroup: 'Váll', sets: 3, reps: '12-15', difficulty: 'beginner' },
    { id: 'reverse-fly', name: 'Hátsó váll emelés', muscleGroup: 'Váll', sets: 3, reps: '12-15', difficulty: 'beginner' },
  ],
  arms: [
    { id: 'barbell-curl', name: 'Bicepsz hajlítás rúddal', muscleGroup: 'Kar', sets: 3, reps: '10-12', difficulty: 'beginner' },
    { id: 'hammer-curl', name: 'Kalapács bicepsz', muscleGroup: 'Kar', sets: 3, reps: '10-12', difficulty: 'beginner' },
    { id: 'tricep-pushdown', name: 'Tricepsz letolás', muscleGroup: 'Kar', sets: 3, reps: '10-12', difficulty: 'beginner' },
    { id: 'skull-crusher', name: 'Homlokhoz nyomás', muscleGroup: 'Kar', sets: 3, reps: '10-12', difficulty: 'intermediate' },
  ],
  core: [
    { id: 'plank', name: 'Plank', muscleGroup: 'Törzs', sets: 3, reps: '30-60mp', difficulty: 'beginner' },
    { id: 'crunches', name: 'Felülés', muscleGroup: 'Törzs', sets: 3, reps: '15-20', difficulty: 'beginner' },
    { id: 'leg-raise', name: 'Lábemelés', muscleGroup: 'Törzs', sets: 3, reps: '12-15', difficulty: 'intermediate' },
    { id: 'russian-twist', name: 'Orosz csavarás', muscleGroup: 'Törzs', sets: 3, reps: '20-30', difficulty: 'intermediate' },
  ],
};

// Edzésterv sablonok a tudományos kutatások alapján
const workoutTemplates = {
  // 1 nap: Teljes test
  fullBody1Day: {
    name: 'Teljes Test',
    exercises: [
      'bench-press', 'squat', 'barbell-row', 'overhead-press',
      'leg-curl', 'barbell-curl', 'tricep-pushdown', 'plank'
    ]
  },

  // 2 nap: A/B Teljes test
  fullBody2Day: {
    dayA: {
      name: 'A nap',
      exercises: ['bench-press', 'squat', 'barbell-row', 'lateral-raise', 'plank']
    },
    dayB: {
      name: 'B nap',
      exercises: ['overhead-press', 'romanian-deadlift', 'pull-ups', 'barbell-curl', 'crunches']
    }
  },

  // 3 nap: Full Body (8.1 pont - legjobb 3 napos)
  fullBody3Day: {
    dayA: {
      name: 'A nap',
      exercises: ['bench-press', 'squat', 'barbell-row', 'lateral-raise', 'barbell-curl']
    },
    dayB: {
      name: 'B nap',
      exercises: ['overhead-press', 'romanian-deadlift', 'pull-ups', 'tricep-pushdown', 'plank']
    },
    dayC: {
      name: 'C nap',
      exercises: ['incline-bench', 'leg-press', 'seated-row', 'front-raise', 'hammer-curl']
    }
  },

  // 3 nap: Push/Pull/Legs (6.7 pont)
  ppl3Day: {
    push: {
      name: 'Push (Toló)',
      exercises: ['bench-press', 'overhead-press', 'incline-bench', 'lateral-raise', 'tricep-pushdown']
    },
    pull: {
      name: 'Pull (Húzó)',
      exercises: ['pull-ups', 'barbell-row', 'lat-pulldown', 'face-pull', 'barbell-curl']
    },
    legs: {
      name: 'Lábak',
      exercises: ['squat', 'romanian-deadlift', 'leg-press', 'leg-curl', 'calf-raise']
    }
  },

  // 4 nap: Upper/Lower (8.4 pont)
  upperLower4Day: {
    upperA: {
      name: 'Felsőtest A',
      exercises: ['bench-press', 'barbell-row', 'overhead-press', 'lat-pulldown', 'barbell-curl', 'tricep-pushdown']
    },
    lowerA: {
      name: 'Alsótest A',
      exercises: ['squat', 'romanian-deadlift', 'leg-press', 'leg-curl', 'calf-raise', 'plank']
    },
    upperB: {
      name: 'Felsőtest B',
      exercises: ['incline-bench', 'seated-row', 'lateral-raise', 'pull-ups', 'hammer-curl', 'skull-crusher']
    },
    lowerB: {
      name: 'Alsótest B',
      exercises: ['squat', 'leg-curl', 'leg-extension', 'calf-raise', 'leg-raise', 'russian-twist']
    }
  },

  // 5 nap: Upper/Lower/PPL (9.0 pont)
  ulppl5Day: {
    upper: {
      name: 'Felsőtest',
      exercises: ['bench-press', 'barbell-row', 'overhead-press', 'lat-pulldown', 'barbell-curl', 'tricep-pushdown']
    },
    lower: {
      name: 'Alsótest',
      exercises: ['squat', 'romanian-deadlift', 'leg-press', 'leg-curl', 'calf-raise', 'plank']
    },
    push: {
      name: 'Push (Toló)',
      exercises: ['incline-bench', 'lateral-raise', 'cable-crossover', 'front-raise', 'skull-crusher']
    },
    pull: {
      name: 'Pull (Húzó)',
      exercises: ['pull-ups', 'seated-row', 'face-pull', 'hammer-curl', 'reverse-fly']
    },
    legs: {
      name: 'Lábak',
      exercises: ['squat', 'leg-extension', 'leg-curl', 'calf-raise', 'leg-raise']
    }
  },

  // 5 nap: Full Body (10.0 pont - LEGJOBB!)
  fullBody5Day: {
    dayA: {
      name: 'A nap',
      exercises: ['bench-press', 'squat', 'barbell-row', 'lateral-raise', 'barbell-curl']
    },
    dayB: {
      name: 'B nap',
      exercises: ['overhead-press', 'romanian-deadlift', 'pull-ups', 'tricep-pushdown', 'plank']
    },
    dayC: {
      name: 'C nap',
      exercises: ['incline-bench', 'leg-press', 'seated-row', 'front-raise', 'hammer-curl']
    },
    dayD: {
      name: 'D nap',
      exercises: ['bench-press', 'leg-curl', 'lat-pulldown', 'lateral-raise', 'skull-crusher']
    },
    dayE: {
      name: 'E nap',
      exercises: ['overhead-press', 'squat', 'barbell-row', 'cable-crossover', 'barbell-curl']
    }
  },

  // 6 nap: PPL x2 (9.7 pont)
  ppl6Day: {
    push1: {
      name: 'Push A (Toló)',
      exercises: ['bench-press', 'overhead-press', 'incline-bench', 'lateral-raise', 'tricep-pushdown']
    },
    pull1: {
      name: 'Pull A (Húzó)',
      exercises: ['pull-ups', 'barbell-row', 'lat-pulldown', 'face-pull', 'barbell-curl']
    },
    legs1: {
      name: 'Lábak A',
      exercises: ['squat', 'romanian-deadlift', 'leg-press', 'leg-curl', 'calf-raise']
    },
    push2: {
      name: 'Push B (Toló)',
      exercises: ['incline-bench', 'lateral-raise', 'cable-crossover', 'front-raise', 'skull-crusher']
    },
    pull2: {
      name: 'Pull B (Húzó)',
      exercises: ['seated-row', 'pull-ups', 'reverse-fly', 'hammer-curl', 'face-pull']
    },
    legs2: {
      name: 'Lábak B',
      exercises: ['squat', 'leg-extension', 'leg-curl', 'calf-raise', 'leg-raise']
    }
  }
};

// Súly kalkuláció a felhasználó adatai alapján
function calculateWeight(exercise: Exercise, profile: UserProfile): number {
  const baseWeight = profile.weight || 70;
  
  // Gyakorlat típusa alapján szorzó
  const exerciseMultipliers: Record<string, number> = {
    'bench-press': 0.6,
    'incline-bench': 0.5,
    'squat': 0.8,
    'deadlift': 1.0,
    'romanian-deadlift': 0.7,
    'overhead-press': 0.4,
    'barbell-row': 0.5,
    'pull-ups': 0, // Testsúlyos
    'lat-pulldown': 0.5,
    'leg-press': 1.2,
    'barbell-curl': 0.25,
    'tricep-pushdown': 0.25,
  };

  const multiplier = exerciseMultipliers[exercise.id] || 0.3;
  let weight = baseWeight * multiplier;

  // Edzettségi szint alapján módosítás
  if (profile.fitnessLevel === 'beginner') {
    weight *= 0.7;
  } else if (profile.fitnessLevel === 'advanced') {
    weight *= 1.3;
  }

  // Kerekítés 2.5 kg-ra
  weight = Math.round(weight / 2.5) * 2.5;
  
  return Math.max(5, weight); // Minimum 5 kg
}

export function generateWorkoutPlan(profile: UserProfile): WorkoutPlan {
  const daysPerWeek = profile.daysPerWeek || 3;
  let template: any;
  let planName: string;

  // Edzésterv sablon kiválasztása a napok száma alapján
  // Tudományos kutatások alapján (Built With Science, Eric Trexler PhD)
  switch (daysPerWeek) {
    case 1:
      template = workoutTemplates.fullBody1Day;
      planName = '1 Napos Teljes Test';
      break;
    
    case 2:
      template = workoutTemplates.fullBody2Day;
      planName = '2 Napos A/B Teljes Test';
      break;
    
    case 3:
      // 3 napra a Full Body a legjobb (8.1 pont a 6.7 helyett PPL)
      // Meta-analízis: 3x/hét edzés ~50%-kal erősebb erősödés
      template = workoutTemplates.fullBody3Day;
      planName = '3 Napos Teljes Test (Hypertrophy Score: 8.1)';
      break;
    
    case 4:
      // 4 napra az Upper/Lower a legjobb (8.4 pont)
      // Tökéletes egyensúly a volumen és frekvencia között
      template = workoutTemplates.upperLower4Day;
      planName = '4 Napos Felső/Alsó (Hypertrophy Score: 8.4)';
      break;
    
    case 5:
      // 5 napra az Upper/Lower/PPL a legjobb (9.0 pont)
      // Több volumen mint 4 napos, de kevesebb időráfordítás mint 6 napos
      template = workoutTemplates.ulppl5Day;
      planName = '5 Napos Felső/Alsó/PPL (Hypertrophy Score: 9.0)';
      break;
    
    case 6:
      // 6 napra a PPL x2 a legjobb (9.7 pont)
      // Maximális volumen, minden izom 2x/hét
      template = workoutTemplates.ppl6Day;
      planName = '6 Napos Push/Pull/Legs (Hypertrophy Score: 9.7)';
      break;
    
    default:
      template = workoutTemplates.fullBody3Day;
      planName = '3 Napos Teljes Test (Hypertrophy Score: 8.1)';
  }

  // Edzésterv létrehozása
  const workoutDays: any[] = [];
  const dayNames = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'];

  // Template feldolgozása
  const templateKeys = Object.keys(template);
  
  templateKeys.forEach((key, index) => {
    const dayTemplate = template[key];
    const exercises: Exercise[] = [];

    dayTemplate.exercises.forEach((exerciseId: string) => {
      // Gyakorlat keresése az adatbázisban
      let exerciseData: any = null;
      
      for (const category of Object.values(exerciseDatabase)) {
        const found = (category as any[]).find(ex => ex.id === exerciseId);
        if (found) {
          exerciseData = found;
          break;
        }
      }

      if (exerciseData) {
        const exercise: Exercise = {
          id: exerciseData.id,
          name: exerciseData.name,
          muscleGroup: exerciseData.muscleGroup,
          sets: exerciseData.sets,
          reps: exerciseData.reps,
          weight: calculateWeight(exerciseData, profile),
          isEasy: false,
          isHard: false,
          notes: '',
        };
        exercises.push(exercise);
      }
    });

    workoutDays.push({
      id: `day-${index}`,
      name: dayTemplate.name,
      dayOfWeek: dayNames[index],
      exercises,
    });
  });

  return {
    id: `plan-${Date.now()}`,
    name: planName,
    days: workoutDays,
    createdAt: new Date().toISOString(),
  };
}

// Kalibráló függvények
export function calibrateWeightEasy(exercise: Exercise): Exercise {
  const increase = exercise.weight * 0.125; // 12.5% növelés
  const newWeight = Math.round((exercise.weight + increase) / 2.5) * 2.5;
  
  return {
    ...exercise,
    weight: Math.max(5, newWeight),
    isEasy: false,
    notes: `Súly növelve: ${exercise.weight}kg → ${Math.max(5, newWeight)}kg`,
  };
}

export function calibrateWeightHard(exercise: Exercise): Exercise {
  const decrease = exercise.weight * 0.1; // 10% csökkentés
  const newWeight = Math.round((exercise.weight - decrease) / 2.5) * 2.5;
  
  return {
    ...exercise,
    weight: Math.max(5, newWeight),
    isHard: false,
    notes: `Súly csökkentve: ${exercise.weight}kg → ${Math.max(5, newWeight)}kg`,
  };
}

// BMI kalkuláció
export function getBMICategory(profile: UserProfile): { bmi: number; category: string; color: string } {
  const weight = profile.weight || 70;
  const height = (profile.height || 170) / 100;
  const bmi = weight / (height * height);

  let category: string;
  let color: string;

  if (bmi < 18.5) {
    category = 'Sovány';
    color = 'text-blue-400';
  } else if (bmi < 25) {
    category = 'Normál';
    color = 'text-green-400';
  } else if (bmi < 30) {
    category = 'Túlsúlyos';
    color = 'text-yellow-400';
  } else {
    category = 'Elhízott';
    color = 'text-red-400';
  }

  return { bmi: Math.round(bmi * 10) / 10, category, color };
}

// Alap gépek listája
export const defaultGymMachines = [
  { id: 'bench', name: 'Vízszintes pad', muscleGroup: 'Mell', originalName: 'Vízszintes pad', imageUrl: '', isDefault: true, isCustom: false },
  { id: 'incline-bench', name: 'Ferdekpad', muscleGroup: 'Mell', originalName: 'Ferdekpad', imageUrl: '', isDefault: true, isCustom: false },
  { id: 'squat-rack', name: 'Guggoló állvány', muscleGroup: 'Láb', originalName: 'Guggoló állvány', imageUrl: '', isDefault: true, isCustom: false },
  { id: 'cable-machine', name: 'Kábeles gép', muscleGroup: 'Teljes test', originalName: 'Kábeles gép', imageUrl: '', isDefault: true, isCustom: false },
  { id: 'lat-pulldown', name: 'Lehúzó gép', muscleGroup: 'Hát', originalName: 'Lehúzó gép', imageUrl: '', isDefault: true, isCustom: false },
  { id: 'leg-press', name: 'Lábtoló gép', muscleGroup: 'Láb', originalName: 'Lábtoló gép', imageUrl: '', isDefault: true, isCustom: false },
  { id: 'leg-curl', name: 'Lábhajlító gép', muscleGroup: 'Láb', originalName: 'Lábhajlító gép', imageUrl: '', isDefault: true, isCustom: false },
  { id: 'leg-extension', name: 'Lábnyújtó gép', muscleGroup: 'Láb', originalName: 'Lábnyújtó gép', imageUrl: '', isDefault: true, isCustom: false },
  { id: 'chest-fly', name: 'Tárogató gép', muscleGroup: 'Mell', originalName: 'Tárogató gép', imageUrl: '', isDefault: true, isCustom: false },
  { id: 'shoulder-press', name: 'Vállnyomó gép', muscleGroup: 'Váll', originalName: 'Vállnyomó gép', imageUrl: '', isDefault: true, isCustom: false },
  { id: 'bicep-curl', name: 'Bicepsz gép', muscleGroup: 'Kar', originalName: 'Bicepsz gép', imageUrl: '', isDefault: true, isCustom: false },
  { id: 'tricep-extension', name: 'Tricepsz gép', muscleGroup: 'Kar', originalName: 'Tricepsz gép', imageUrl: '', isDefault: true, isCustom: false },
  { id: 'ab-machine', name: 'Hasprés gép', muscleGroup: 'Törzs', originalName: 'Hasprés gép', imageUrl: '', isDefault: true, isCustom: false },
  { id: 'pull-up-bar', name: 'Húzódzkodó rúd', muscleGroup: 'Hát', originalName: 'Húzódzkodó rúd', imageUrl: '', isDefault: true, isCustom: false },
  { id: 'dumbbell-rack', name: 'Kézisúlyzó állvány', muscleGroup: 'Teljes test', originalName: 'Kézisúlyzó állvány', imageUrl: '', isDefault: true, isCustom: false },
  { id: 'barbell-rack', name: 'Rúdsúlyzó állvány', muscleGroup: 'Teljes test', originalName: 'Rúdsúlyzó állvány', imageUrl: '', isDefault: true, isCustom: false },
];

// Gyakorlat-gép hozzárendelési mappa
export const exerciseToMachineMap: Record<string, string> = {
  'bench-press': 'bench',
  'incline-bench': 'incline-bench',
  'squat': 'squat-rack',
  'cable-crossover': 'cable-machine',
  'lat-pulldown': 'lat-pulldown',
  'leg-press': 'leg-press',
  'leg-curl': 'leg-curl',
  'leg-extension': 'leg-extension',
  'dumbbell-fly': 'chest-fly',
  'overhead-press': 'shoulder-press',
  'barbell-curl': 'bicep-curl',
  'tricep-pushdown': 'tricep-extension',
  'crunches': 'ab-machine',
  'pull-ups': 'pull-up-bar',
};

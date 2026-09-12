import { useState, useEffect } from 'react';
import { UserProfile, WorkoutDay, GymMachine } from './types';
import { generateWorkoutPlan, calibrateWeightEasy, calibrateWeightHard, getBMICategory, exerciseToMachineMap } from './workoutGenerator';
import { t, getSystemLanguage, TranslationKey } from './i18n';
import ProfileSetup from './components/ProfileSetup';
import WorkoutPlanView from './components/WorkoutPlanView';
import EquipmentGallery from './components/EquipmentGallery';
import WeightCalibration from './components/WeightCalibration';

type Tab = 'profile' | 'workout' | 'equipment' | 'calibration';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);
  const [equipment, setEquipment] = useState<GymMachine[]>([]);
  const [planGenerated, setPlanGenerated] = useState(false);
  const [lang, setLang] = useState<'hu' | 'en'>('hu');

  useEffect(() => {
    const saved = localStorage.getItem('gymProfile');
    if (saved) {
      const parsed = JSON.parse(saved);
      setProfile(parsed);
      // Set language
      if (parsed.language === 'system') {
        setLang(getSystemLanguage());
      } else if (parsed.language === 'en') {
        setLang('en');
      } else {
        setLang('hu');
      }
    } else {
      // Default to system language
      setLang(getSystemLanguage());
    }
    const savedPlan = localStorage.getItem('gymWorkoutPlan');
    if (savedPlan) {
      setWorkoutDays(JSON.parse(savedPlan));
      setPlanGenerated(true);
    }
    const savedEquipment = localStorage.getItem('gymEquipment');
    if (savedEquipment) {
      setEquipment(JSON.parse(savedEquipment));
    }
  }, []);

  const handleProfileSave = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('gymProfile', JSON.stringify(newProfile));
    // Update language
    if (newProfile.language === 'system') {
      setLang(getSystemLanguage());
    } else if (newProfile.language === 'en') {
      setLang('en');
    } else {
      setLang('hu');
    }
    setActiveTab('workout');
  };

  const handleGeneratePlan = () => {
    if (profile) {
      const days = generateWorkoutPlan(profile);
      setWorkoutDays(days);
      setPlanGenerated(true);
      localStorage.setItem('gymWorkoutPlan', JSON.stringify(days));
    }
  };

  const handleMarkEasy = (dayId: string, exerciseId: string) => {
    if (!profile) return;
    const updated = workoutDays.map(day => {
      if (day.id === dayId) {
        const updatedExercises = day.exercises.map(ex => {
          if (ex.id === exerciseId) {
            return calibrateWeightEasy({ ...ex, isEasy: true }, profile);
          }
          return ex;
        });
        return { ...day, exercises: updatedExercises };
      }
      return day;
    });
    setWorkoutDays(updated);
    localStorage.setItem('gymWorkoutPlan', JSON.stringify(updated));
  };

  const handleMarkHard = (dayId: string, exerciseId: string) => {
    if (!profile) return;
    const updated = workoutDays.map(day => {
      if (day.id === dayId) {
        const updatedExercises = day.exercises.map(ex => {
          if (ex.id === exerciseId) {
            return calibrateWeightHard({ ...ex, isHard: true }, profile);
          }
          return ex;
        });
        return { ...day, exercises: updatedExercises };
      }
      return day;
    });
    setWorkoutDays(updated);
    localStorage.setItem('gymWorkoutPlan', JSON.stringify(updated));
  };

  const handleWeightUpdate = (dayId: string, exerciseId: string, newWeight: number) => {
    const updated = workoutDays.map(day => {
      if (day.id === dayId) {
        const updatedExercises = day.exercises.map(ex => {
          if (ex.id === exerciseId) {
            return { ...ex, weight: newWeight };
          }
          return ex;
        });
        return { ...day, exercises: updatedExercises };
      }
      return day;
    });
    setWorkoutDays(updated);
    localStorage.setItem('gymWorkoutPlan', JSON.stringify(updated));
  };

  const handleAssignEquipment = (dayId: string, exerciseId: string, equipmentId: string) => {
    const updated = workoutDays.map(day => {
      if (day.id === dayId) {
        const updatedExercises = day.exercises.map(ex => {
          if (ex.id === exerciseId) {
            return { ...ex, assignedEquipment: equipmentId };
          }
          return ex;
        });
        return { ...day, exercises: updatedExercises };
      }
      return day;
    });
    setWorkoutDays(updated);
    localStorage.setItem('gymWorkoutPlan', JSON.stringify(updated));
  };

  const handleAddEquipment = (item: GymMachine) => {
    const updated = [...equipment, item];
    setEquipment(updated);
    localStorage.setItem('gymEquipment', JSON.stringify(updated));

    // Auto-assign machine to exercises in workout plan
    if (workoutDays.length > 0) {
      const updatedDays = workoutDays.map(day => ({
        ...day,
        exercises: day.exercises.map(exercise => {
          // If this exercise matches the machine mapping and doesn't have equipment assigned yet
          const mappedMachineId = exerciseToMachineMap[exercise.id];
          if (mappedMachineId === item.id && !exercise.assignedEquipment) {
            return { ...exercise, assignedEquipment: item.id };
          }
          return exercise;
        }),
      }));
      setWorkoutDays(updatedDays);
      localStorage.setItem('gymWorkoutPlan', JSON.stringify(updatedDays));
    }
  };

  const handleRemoveEquipment = (id: string) => {
    const updated = equipment.filter(e => e.id !== id);
    setEquipment(updated);
    localStorage.setItem('gymEquipment', JSON.stringify(updated));
  };

  const handleRenameEquipment = (id: string, newName: string) => {
    const updated = equipment.map(e => e.id === id ? { ...e, name: newName } : e);
    setEquipment(updated);
    localStorage.setItem('gymEquipment', JSON.stringify(updated));
  };

  const handleResetEquipmentName = (id: string) => {
    const updated = equipment.map(e => e.id === id ? { ...e, name: e.originalName || e.name } : e);
    setEquipment(updated);
    localStorage.setItem('gymEquipment', JSON.stringify(updated));
  };

  const bmi = profile ? getBMICategory(profile) : null;

  const tabs: { id: Tab; labelKey: TranslationKey; icon: string }[] = [
    { id: 'profile', labelKey: 'profile', icon: '👤' },
    { id: 'workout', labelKey: 'workout', icon: '💪' },
    { id: 'equipment', labelKey: 'equipment', icon: '🏋️' },
    { id: 'calibration', labelKey: 'calibration', icon: '⚖️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏋️</span>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                {t('appName', lang)}
              </h1>
              <p className="text-xs text-gray-400">{t('appSubtitle', lang)}</p>
            </div>
          </div>
          {profile && (
            <div className="hidden sm:flex items-center gap-4 text-sm">
              <div className="text-gray-400">
                <span className="text-white font-semibold">{profile.weight || '—'}kg</span> / {profile.height || '—'}cm
              </div>
              {bmi && typeof profile.weight === 'number' && typeof profile.height === 'number' && (
                <div className={`font-semibold ${bmi.color}`}>
                  BMI: {bmi.bmi} ({bmi.category})
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{t(tab.labelKey, lang)}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'profile' && (
          <ProfileSetup
            profile={profile}
            onSave={handleProfileSave}
            lang={lang}
          />
        )}
        {activeTab === 'workout' && (
          <WorkoutPlanView
            days={workoutDays}
            planGenerated={planGenerated}
            profile={profile}
            onGenerate={handleGeneratePlan}
            onMarkEasy={handleMarkEasy}
            onMarkHard={handleMarkHard}
            onWeightUpdate={handleWeightUpdate}
            onAssignEquipment={handleAssignEquipment}
            equipment={equipment}
            lang={lang}
          />
        )}
        {activeTab === 'equipment' && (
          <EquipmentGallery
            equipment={equipment}
            onAdd={handleAddEquipment}
            onRemove={handleRemoveEquipment}
            onRename={handleRenameEquipment}
            onResetName={handleResetEquipmentName}
            lang={lang}
          />
        )}
        {activeTab === 'calibration' && (
          <WeightCalibration
            days={workoutDays}
            profile={profile}
            onWeightUpdate={handleWeightUpdate}
            onMarkEasy={handleMarkEasy}
            onMarkHard={handleMarkHard}
            lang={lang}
          />
        )}
      </main>
    </div>
  );
}

export default App;

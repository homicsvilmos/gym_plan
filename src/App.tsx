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
      if (parsed.language === 'system') {
        setLang(getSystemLanguage());
      } else if (parsed.language === 'en') {
        setLang('en');
      } else {
        setLang('hu');
      }
    } else {
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

    if (workoutDays.length > 0) {
      const updatedDays = workoutDays.map(day => ({
        ...day,
        exercises: day.exercises.map(exercise => {
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 animated-gradient bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900" />
      
      {/* Floating orbs for depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute top-[40%] right-[20%] w-[400px] h-[400px] rounded-full bg-orange-500/10 blur-[100px]" />
        <div className="absolute bottom-[20%] left-[30%] w-[350px] h-[350px] rounded-full bg-pink-500/10 blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="glass-strong sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-xl">
                🏋️
              </div>
              <div>
                <h1 className="text-xl font-bold text-white text-shadow bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  {t('appName', lang)}
                </h1>
                <p className="text-xs text-white/60">{t('appSubtitle', lang)}</p>
              </div>
            </div>
            {profile && (
              <div className="hidden sm:flex items-center gap-4 text-sm">
                <div className="glass-subtle rounded-full px-3 py-1.5 text-white/80">
                  <span className="text-white font-semibold">{profile.weight || '—'}kg</span>
                  <span className="text-white/40 mx-1">/</span>
                  <span>{profile.height || '—'}cm</span>
                </div>
                {bmi && typeof profile.weight === 'number' && typeof profile.height === 'number' && (
                  <div className={`glass-subtle rounded-full px-3 py-1.5 font-semibold ${bmi.color}`}>
                    BMI: {bmi.bmi}
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Navigation */}
        <nav className="glass-subtle border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex overflow-x-auto gap-1 py-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'glass text-white shadow-lg'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  <span>{t(tab.labelKey, lang)}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
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
    </div>
  );
}

export default App;

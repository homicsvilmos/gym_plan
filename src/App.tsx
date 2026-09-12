import { useState, useEffect } from 'react';
import { UserProfile, WorkoutDay, EquipmentImage } from './types';
import { generateWorkoutPlan, calibrateWeight, getBMICategory } from './workoutGenerator';
import ProfileSetup from './components/ProfileSetup';
import WorkoutPlanView from './components/WorkoutPlanView';
import EquipmentGallery from './components/EquipmentGallery';
import WeightCalibration from './components/WeightCalibration';

type Tab = 'profile' | 'workout' | 'equipment' | 'calibration';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);
  const [equipment, setEquipment] = useState<EquipmentImage[]>([]);
  const [planGenerated, setPlanGenerated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('gymProfile');
    if (saved) {
      setProfile(JSON.parse(saved));
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
    const updated = workoutDays.map(day => {
      if (day.id === dayId) {
        const updatedExercises = day.exercises.map(ex => {
          if (ex.id === exerciseId) {
            return calibrateWeight({ ...ex, isEasy: true }, profile!);
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

  const handleAddEquipment = (item: EquipmentImage) => {
    const updated = [...equipment, item];
    setEquipment(updated);
    localStorage.setItem('gymEquipment', JSON.stringify(updated));
  };

  const handleRemoveEquipment = (id: string) => {
    const updated = equipment.filter(e => e.id !== id);
    setEquipment(updated);
    localStorage.setItem('gymEquipment', JSON.stringify(updated));
  };

  const bmi = profile ? getBMICategory(profile) : null;

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'profile', label: 'Profil', icon: '👤' },
    { id: 'workout', label: 'Edzésterv', icon: '💪' },
    { id: 'equipment', label: 'Gépek', icon: '🏋️' },
    { id: 'calibration', label: 'Kalibrálás', icon: '⚖️' },
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
                GymPlan
              </h1>
              <p className="text-xs text-gray-400">Edzésterv Készítő</p>
            </div>
          </div>
          {profile && (
            <div className="hidden sm:flex items-center gap-4 text-sm">
              <div className="text-gray-400">
                <span className="text-white font-semibold">{profile.weight}kg</span> / {profile.height}cm
              </div>
              {bmi && (
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
                <span>{tab.label}</span>
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
          />
        )}
        {activeTab === 'workout' && (
          <WorkoutPlanView
            days={workoutDays}
            planGenerated={planGenerated}
            profile={profile}
            onGenerate={handleGeneratePlan}
            onMarkEasy={handleMarkEasy}
            onWeightUpdate={handleWeightUpdate}
          />
        )}
        {activeTab === 'equipment' && (
          <EquipmentGallery
            equipment={equipment}
            onAdd={handleAddEquipment}
            onRemove={handleRemoveEquipment}
          />
        )}
        {activeTab === 'calibration' && (
          <WeightCalibration
            days={workoutDays}
            profile={profile}
            onWeightUpdate={handleWeightUpdate}
            onMarkEasy={handleMarkEasy}
          />
        )}
      </main>
    </div>
  );
}

export default App;

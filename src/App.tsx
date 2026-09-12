import { useState, useEffect } from 'react';
import { UserProfile, WorkoutDay, GymMachine } from './types';
import { generateWorkoutPlan, calibrateWeightEasy, calibrateWeightHard, getBMICategory, exerciseToMachineMap } from './workoutGenerator';
import { t, getSystemLanguage } from './i18n';
import { User, getUsers, updateUser, saveUserData, loadUserData } from './auth';
import ProfileSetup from './components/ProfileSetup';
import WorkoutPlanView from './components/WorkoutPlanView';
import EquipmentGallery from './components/EquipmentGallery';
import WeightCalibration from './components/WeightCalibration';
import LoginScreen from './components/LoginScreen';
import AdminPanel from './components/AdminPanel';

type MainView = 'workout' | 'equipment' | 'calibration' | 'profile' | 'admin';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mainView, setMainView] = useState<MainView>('workout');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);
  const [equipment, setEquipment] = useState<GymMachine[]>([]);
  const [planGenerated, setPlanGenerated] = useState(false);
  const [planName, setPlanName] = useState<string>('');
  const [lang, setLang] = useState<'hu' | 'en'>('hu');
  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Initialize language
  useEffect(() => {
    const savedLang = localStorage.getItem('gymLang');
    if (savedLang) {
      setLang(savedLang as 'hu' | 'en');
    } else {
      setLang(getSystemLanguage());
    }
  }, []);

  // Load user data when user logs in
  useEffect(() => {
    if (currentUser) {
      const data = loadUserData(currentUser.id);
      if (data.profile) {
        setProfile(data.profile);
        if (data.profile.language === 'system') {
          setLang(getSystemLanguage());
        } else if (data.profile.language === 'en') {
          setLang('en');
        } else {
          setLang('hu');
        }
      }
      if (data.workoutPlan && data.workoutPlan.length > 0) {
        setWorkoutDays(data.workoutPlan);
        setPlanGenerated(true);
      }
      if (data.equipment) {
        setEquipment(data.equipment);
      }
    }
  }, [currentUser]);

  const handleLogin = (userId: string) => {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('gymCurrentUser', userId);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setProfile(null);
    setWorkoutDays([]);
    setEquipment([]);
    setPlanGenerated(false);
    setMainView('workout');
    localStorage.removeItem('gymCurrentUser');
  };

  // Check if user is already logged in
  useEffect(() => {
    const savedUserId = localStorage.getItem('gymCurrentUser');
    if (savedUserId) {
      const users = getUsers();
      const user = users.find(u => u.id === savedUserId);
      if (user) {
        setCurrentUser(user);
      }
    }
  }, []);

  const handleProfileSave = (newProfile: UserProfile) => {
    setProfile(newProfile);
    if (currentUser) {
      updateUser(currentUser.id, { profile: newProfile });
      saveUserData(currentUser.id, { profile: newProfile });
    }
    if (newProfile.language === 'system') {
      setLang(getSystemLanguage());
    } else if (newProfile.language === 'en') {
      setLang('en');
    } else {
      setLang('hu');
    }
    localStorage.setItem('gymLang', lang);
    setShowProfile(false);
    if (!planGenerated) {
      setMainView('workout');
    }
  };

  const handleGeneratePlan = () => {
    if (profile) {
      setIsRegenerating(true);
      setTimeout(() => {
        const plan = generateWorkoutPlan(profile);
        setWorkoutDays(plan.days);
        setPlanName(plan.name);
        setPlanGenerated(true);
        if (currentUser) {
          saveUserData(currentUser.id, { workoutPlan: plan.days });
        }
        setIsRegenerating(false);
      }, 600);
    }
  };

  const handleMarkEasy = (dayId: string, exerciseId: string) => {
    if (!profile) return;
    const updated = workoutDays.map(day => {
      if (day.id === dayId) {
        const updatedExercises = day.exercises.map(ex => {
          if (ex.id === exerciseId) {
            return calibrateWeightEasy({ ...ex, isEasy: true });
          }
          return ex;
        });
        return { ...day, exercises: updatedExercises };
      }
      return day;
    });
    setWorkoutDays(updated);
    if (currentUser) {
      saveUserData(currentUser.id, { workoutPlan: updated });
    }
  };

  const handleMarkHard = (dayId: string, exerciseId: string) => {
    if (!profile) return;
    const updated = workoutDays.map(day => {
      if (day.id === dayId) {
        const updatedExercises = day.exercises.map(ex => {
          if (ex.id === exerciseId) {
            return calibrateWeightHard({ ...ex, isHard: true });
          }
          return ex;
        });
        return { ...day, exercises: updatedExercises };
      }
      return day;
    });
    setWorkoutDays(updated);
    if (currentUser) {
      saveUserData(currentUser.id, { workoutPlan: updated });
    }
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
    if (currentUser) {
      saveUserData(currentUser.id, { workoutPlan: updated });
    }
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
    if (currentUser) {
      saveUserData(currentUser.id, { workoutPlan: updated });
    }
  };

  const handleAddEquipment = (item: GymMachine) => {
    const updated = [...equipment, item];
    setEquipment(updated);
    if (currentUser) {
      saveUserData(currentUser.id, { equipment: updated });
    }

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
      if (currentUser) {
        saveUserData(currentUser.id, { workoutPlan: updatedDays });
      }
    }
  };

  const handleRemoveEquipment = (id: string) => {
    const updated = equipment.filter(e => e.id !== id);
    setEquipment(updated);
    if (currentUser) {
      saveUserData(currentUser.id, { equipment: updated });
    }
  };

  const handleRenameEquipment = (id: string, newName: string) => {
    const updated = equipment.map(e => e.id === id ? { ...e, name: newName } : e);
    setEquipment(updated);
    if (currentUser) {
      saveUserData(currentUser.id, { equipment: updated });
    }
  };

  const handleResetEquipmentName = (id: string) => {
    const updated = equipment.map(e => e.id === id ? { ...e, name: e.originalName || e.name } : e);
    setEquipment(updated);
    if (currentUser) {
      saveUserData(currentUser.id, { equipment: updated });
    }
  };

  const bmi = profile ? getBMICategory(profile) : null;

  const getViewTitle = () => {
    switch (mainView) {
      case 'workout': return t('workout', lang);
      case 'equipment': return t('equipment', lang);
      case 'calibration': return t('calibration', lang);
      case 'profile': return t('profile', lang);
      case 'admin': return lang === 'hu' ? 'Admin' : 'Admin';
    }
  };

  // Show login screen if not authenticated
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} lang={lang} />;
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Subtle dark gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-900" />
      
      {/* Subtle ambient light */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-30%] left-[-20%] w-[800px] h-[800px] rounded-full bg-blue-900/5 blur-[150px]" />
        <div className="absolute bottom-[-30%] right-[-20%] w-[600px] h-[600px] rounded-full bg-blue-800/5 blur-[150px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 safe-area-top" style={{ background: 'rgba(10, 10, 10, 0.85)', backdropFilter: 'blur(40px) saturate(200%)', WebkitBackdropFilter: 'blur(40px) saturate(200%)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            {/* Left: Hamburger Menu */}
            <div className="relative">
              <button
                onClick={() => { setShowMenu(!showMenu); setShowProfile(false); }}
                className="w-10 h-10 rounded-xl glass flex items-center justify-center text-blue-400 hover:bg-blue-500/10 transition-all btn-press hover:scale-110"
              >
                <svg className="w-5 h-5 transition-transform duration-300" style={{ transform: showMenu ? 'rotate(90deg)' : 'rotate(0deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                  <div className="absolute top-12 left-0 rounded-2xl p-2 min-w-[200px] z-50 shadow-2xl animate-fade-in-down" style={{ background: 'rgba(10, 10, 10, 0.9)', backdropFilter: 'blur(40px) saturate(200%)', WebkitBackdropFilter: 'blur(40px) saturate(200%)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <button
                      onClick={() => { setMainView('workout'); setShowMenu(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all btn-press ${
                        mainView === 'workout' ? 'glass-blue text-blue-300' : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      <span className="font-medium">{t('workout', lang)}</span>
                    </button>
                    <button
                      onClick={() => { setMainView('equipment'); setShowMenu(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all btn-press ${
                        mainView === 'equipment' ? 'glass-blue text-blue-300' : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span className="font-medium">{t('equipment', lang)}</span>
                    </button>
                    <button
                      onClick={() => { setMainView('calibration'); setShowMenu(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all btn-press ${
                        mainView === 'calibration' ? 'glass-blue text-blue-300' : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                      <span className="font-medium">{t('calibration', lang)}</span>
                    </button>
                    {/* Admin Menu - Only visible for admins */}
                    {currentUser.isAdmin && (
                      <button
                        onClick={() => { setMainView('admin'); setShowMenu(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all btn-press ${
                          mainView === 'admin' ? 'glass-blue text-blue-300' : 'text-white/70 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span className="font-medium">{lang === 'hu' ? 'Admin Panel' : 'Admin Panel'}</span>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Center: Title */}
            <h1 className="text-lg font-bold text-white text-shadow absolute left-1/2 transform -translate-x-1/2">
              {getViewTitle()}
            </h1>

            {/* Right: Profile Button */}
            <div className="relative">
              <button
                onClick={() => { setShowProfile(!showProfile); setShowMenu(false); }}
                className="w-10 h-10 rounded-xl glass flex items-center justify-center text-blue-400 hover:bg-blue-500/10 transition-all btn-press hover:scale-110"
              >
                <svg className="w-5 h-5 transition-transform duration-300" style={{ transform: showProfile ? 'scale(1.1)' : 'scale(1)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              
              {/* Profile Dropdown */}
              {showProfile && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
                  <div className="absolute top-12 right-0 rounded-2xl p-4 min-w-[240px] z-50 shadow-2xl animate-fade-in-down" style={{ background: 'rgba(10, 10, 10, 0.9)', backdropFilter: 'blur(40px) saturate(200%)', WebkitBackdropFilter: 'blur(40px) saturate(200%)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="text-center mb-3 pb-3 border-b border-white/10">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-white font-bold">{currentUser.username}</span>
                        {currentUser.isAdmin && (
                          <span className="text-[10px] glass-blue px-1.5 py-0.5 rounded-full text-blue-300">
                            Admin
                          </span>
                        )}
                      </div>
                      {profile && (
                        <div className="text-white/50 text-sm mt-1">
                          {profile.weight || '—'}kg • {profile.height || '—'}cm
                        </div>
                      )}
                      {bmi && typeof profile?.weight === 'number' && typeof profile?.height === 'number' && (
                        <div className={`text-sm font-semibold mt-1 ${bmi.color}`}>
                          BMI: {bmi.bmi}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => { setMainView('profile'); setShowProfile(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-white/70 hover:bg-white/5 hover:text-white transition-all btn-press"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm font-medium">{t('profile', lang)}</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-red-400 hover:bg-red-500/10 transition-all btn-press mt-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="text-sm font-medium">{lang === 'hu' ? 'Kijelentkezés' : 'Logout'}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 w-full safe-area-bottom">
          <div key={mainView} className="page-transition">
            {mainView === 'workout' && (
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
                isGenerating={isRegenerating}
                planName={planName}
              />
            )}
            {mainView === 'equipment' && (
              <EquipmentGallery
                equipment={equipment}
                onAdd={handleAddEquipment}
                onRemove={handleRemoveEquipment}
                onRename={handleRenameEquipment}
                onResetName={handleResetEquipmentName}
                lang={lang}
              />
            )}
            {mainView === 'calibration' && (
              <WeightCalibration
                days={workoutDays}
                profile={profile}
                onWeightUpdate={handleWeightUpdate}
                onMarkEasy={handleMarkEasy}
                onMarkHard={handleMarkHard}
                lang={lang}
              />
            )}
            {mainView === 'profile' && (
              <ProfileSetup
                profile={profile}
                onSave={handleProfileSave}
                lang={lang}
              />
            )}
            {mainView === 'admin' && currentUser.isAdmin && (
              <AdminPanel
                currentUser={currentUser}
                lang={lang}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

import { useState } from 'react';
import { WorkoutDay, UserProfile } from '../types';
import { calibrateWeightEasy, calibrateWeightHard } from '../workoutGenerator';
import { t } from '../i18n';

interface Props {
  days: WorkoutDay[];
  profile: UserProfile | null;
  onWeightUpdate: (dayId: string, exerciseId: string, newWeight: number) => void;
  onMarkEasy: (dayId: string, exerciseId: string) => void;
  onMarkHard: (dayId: string, exerciseId: string) => void;
  lang: 'hu' | 'en';
}

export default function WeightCalibration({ days, profile, onWeightUpdate, onMarkEasy, onMarkHard, lang }: Props) {
  const [selectedDay, setSelectedDay] = useState<string>(days[0]?.id || '');
  const [showHistory, setShowHistory] = useState(false);
  const [calibrationLog, setCalibrationLog] = useState<{ exercise: string; from: number; to: number; date: string; type: 'easy' | 'hard' }[]>([]);

  const currentDay = days.find(d => d.id === selectedDay);

  const handleCalibrateEasy = (dayId: string, exerciseId: string, exerciseName: string, currentWeight: number) => {
    if (!profile) return;
    
    const exercise = currentDay?.exercises.find(e => e.id === exerciseId);
    if (!exercise) return;
    
    const calibrated = calibrateWeightEasy({ ...exercise, isEasy: true }, profile);
    onWeightUpdate(dayId, exerciseId, calibrated.weight);
    
    setCalibrationLog(prev => [
      { exercise: exerciseName, from: currentWeight, to: calibrated.weight, date: new Date().toLocaleDateString('hu-HU'), type: 'easy' },
      ...prev,
    ]);
  };

  const handleCalibrateHard = (dayId: string, exerciseId: string, exerciseName: string, currentWeight: number) => {
    if (!profile) return;
    
    const exercise = currentDay?.exercises.find(e => e.id === exerciseId);
    if (!exercise) return;
    
    const calibrated = calibrateWeightHard({ ...exercise, isHard: true }, profile);
    onWeightUpdate(dayId, exerciseId, calibrated.weight);
    
    setCalibrationLog(prev => [
      { exercise: exerciseName, from: currentWeight, to: calibrated.weight, date: new Date().toLocaleDateString('hu-HU'), type: 'hard' },
      ...prev,
    ]);
  };

  const handleManualWeight = (dayId: string, exerciseId: string, exerciseName: string, currentWeight: number, newWeight: number) => {
    onWeightUpdate(dayId, exerciseId, newWeight);
    setCalibrationLog(prev => [
      { exercise: exerciseName, from: currentWeight, to: newWeight, date: new Date().toLocaleDateString('hu-HU'), type: newWeight > currentWeight ? 'easy' : 'hard' },
      ...prev,
    ]);
  };

  if (!profile) {
    return (
      <div className="text-center py-16">
        <div className="glass-strong rounded-3xl p-12 max-w-lg mx-auto">
          <span className="text-7xl mb-4 block">⚖️</span>
          <h2 className="text-2xl font-bold mb-2 text-white text-shadow">{t('setupProfileFirst', lang)}</h2>
          <p className="text-white/60">{t('setupProfileHint', lang)}</p>
        </div>
      </div>
    );
  }

  if (days.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="glass-strong rounded-3xl p-12 max-w-lg mx-auto">
          <span className="text-7xl mb-4 block">⚖️</span>
          <h2 className="text-2xl font-bold mb-2 text-white text-shadow">{lang === 'hu' ? 'Még nincs edzésterved' : 'No workout plan yet'}</h2>
          <p className="text-white/60">{lang === 'hu' ? 'Generálj egy edzéstervet az Edzésterv fülön.' : 'Generate a workout plan in the Workout tab.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl glass-blue flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-white">{t('weightCalibration', lang)}</h2>
          <p className="text-white/40 text-xs sm:text-sm">{t('calibrationHint', lang)}</p>
        </div>
      </div>

      {/* Day Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {days.map(day => (
          <button
            key={day.id}
            onClick={() => setSelectedDay(day.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all btn-press ${
              selectedDay === day.id
                ? 'glass text-white shadow-lg'
                : 'glass-subtle text-white/50 hover:text-white/80'
            }`}
          >
            {day.name}
          </button>
        ))}
      </div>

      {/* Calibration Cards */}
      {currentDay && (
        <div className="space-y-3">
          {currentDay.exercises.map(exercise => (
            <CalibrationCard
              key={exercise.id}
              exercise={exercise}
              dayId={currentDay.id}
              onAutoEasy={handleCalibrateEasy}
              onAutoHard={handleCalibrateHard}
              onManualUpdate={handleManualWeight}
              lang={lang}
            />
          ))}
        </div>
      )}

      {/* Calibration History */}
      <div className="glass-strong rounded-2xl p-5">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center justify-between w-full"
        >
          <h3 className="font-bold flex items-center gap-2 text-white">
            <span>📊</span> {t('calibrationHistory', lang)}
          </h3>
          <span className={`text-white/40 transition-transform ${showHistory ? 'rotate-180' : ''}`}>▼</span>
        </button>
        
        {showHistory && (
          <div className="mt-4 space-y-2">
            {calibrationLog.length === 0 ? (
              <p className="text-white/40 text-sm text-center py-4">{t('noCalibration', lang)}</p>
            ) : (
              calibrationLog.map((log, i) => (
                <div key={i} className="glass-subtle rounded-xl p-3 text-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${log.type === 'easy' ? 'glass text-green-400' : 'glass text-red-400'}`}>
                      {log.type === 'easy' ? '⬆️' : '⬇️'}
                    </span>
                    <span className="font-medium text-white">{log.exercise}</span>
                    <span className="text-white/40 ml-2">{log.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/60">{log.from}kg</span>
                    <span className={log.type === 'easy' ? 'text-green-400' : 'text-red-400'}>→</span>
                    <span className={`font-bold ${log.type === 'easy' ? 'text-green-400' : 'text-red-400'}`}>{log.to}kg</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="glass rounded-2xl p-5 border border-orange-500/20">
        <h3 className="font-bold text-orange-300 flex items-center gap-2 mb-3">
          <span>💡</span> {t('tips', lang)}
        </h3>
        <ul className="text-sm text-white/70 space-y-2">
          <li>{t('tip1', lang)}</li>
          <li>{t('tip2', lang)}</li>
          <li>{t('tip3', lang)}</li>
          <li>{t('tip4', lang)}</li>
        </ul>
      </div>
    </div>
  );
}

interface CalibrationCardProps {
  exercise: { id: string; name: string; weight: number; sets: number; reps: number; muscleGroup: string };
  dayId: string;
  onAutoEasy: (dayId: string, exerciseId: string, name: string, currentWeight: number) => void;
  onAutoHard: (dayId: string, exerciseId: string, name: string, currentWeight: number) => void;
  onManualUpdate: (dayId: string, exerciseId: string, name: string, currentWeight: number, newWeight: number) => void;
  lang: 'hu' | 'en';
}

function CalibrationCard({ exercise, dayId, onAutoEasy, onAutoHard, onManualUpdate, lang }: CalibrationCardProps) {
  const [showManual, setShowManual] = useState(false);
  const [manualWeight, setManualWeight] = useState(exercise.weight);

  return (
    <div className="glass-strong rounded-2xl p-5 hover-lift">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-bold text-lg text-white">{exercise.name}</h4>
          <p className="text-xs text-white/50">{exercise.muscleGroup} • {exercise.sets}×{exercise.reps}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">{exercise.weight} kg</div>
        </div>
      </div>

      {/* Weight Slider */}
      <div className="mb-4">
        <input
          type="range"
          min={Math.max(0, exercise.weight - 20)}
          max={exercise.weight + 30}
          step={2.5}
          value={manualWeight}
          onChange={e => setManualWeight(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-white/30 mt-1">
          <span>{Math.max(0, exercise.weight - 20)}kg</span>
          <span>{exercise.weight + 30}kg</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onAutoEasy(dayId, exercise.id, exercise.name, exercise.weight)}
          className="flex-1 min-w-[120px] glass-subtle hover:bg-green-500/20 text-green-300 text-sm font-medium py-2.5 px-3 rounded-xl border border-green-500/20 transition-all btn-press"
        >
          {t('autoEasy', lang)}
        </button>
        <button
          onClick={() => onAutoHard(dayId, exercise.id, exercise.name, exercise.weight)}
          className="flex-1 min-w-[120px] glass-subtle hover:bg-red-500/20 text-red-300 text-sm font-medium py-2.5 px-3 rounded-xl border border-red-500/20 transition-all btn-press"
        >
          {t('autoHard', lang)}
        </button>
        <button
          onClick={() => setShowManual(!showManual)}
          className="glass-subtle hover:bg-white/10 text-white/80 text-sm font-medium py-2.5 px-3 rounded-xl transition-all btn-press"
        >
          {t('manual', lang)}
        </button>
      </div>

      {showManual && (
        <div className="mt-4 flex items-center gap-3">
          <input
            type="number"
            value={manualWeight}
            onChange={e => setManualWeight(Number(e.target.value))}
            className="w-24 glass-subtle rounded-xl px-3 py-2.5 text-white text-center focus:outline-none focus:ring-1 focus:ring-white/20"
            step={2.5}
            min={0}
          />
          <span className="text-white/60">kg</span>
          <button
            onClick={() => {
              onManualUpdate(dayId, exercise.id, exercise.name, exercise.weight, manualWeight);
              setShowManual(false);
            }}
            className="glass-strong hover:bg-white/15 text-white text-sm font-medium py-2.5 px-4 rounded-xl transition-all btn-press"
          >
            {t('set', lang)}
          </button>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { WorkoutDay, UserProfile } from '../types';
import { calibrateWeight } from '../workoutGenerator';

interface Props {
  days: WorkoutDay[];
  profile: UserProfile | null;
  onWeightUpdate: (dayId: string, exerciseId: string, newWeight: number) => void;
  onMarkEasy: (dayId: string, exerciseId: string) => void;
}

export default function WeightCalibration({ days, profile, onWeightUpdate, onMarkEasy }: Props) {
  const [selectedDay, setSelectedDay] = useState<string>(days[0]?.id || '');
  const [showHistory, setShowHistory] = useState(false);
  const [calibrationLog, setCalibrationLog] = useState<{ exercise: string; from: number; to: number; date: string }[]>([]);

  const currentDay = days.find(d => d.id === selectedDay);

  const handleCalibrate = (dayId: string, exerciseId: string, exerciseName: string, currentWeight: number) => {
    if (!profile) return;
    
    const exercise = currentDay?.exercises.find(e => e.id === exerciseId);
    if (!exercise) return;
    
    const calibrated = calibrateWeight({ ...exercise, isEasy: true }, profile);
    onWeightUpdate(dayId, exerciseId, calibrated.weight);
    
    setCalibrationLog(prev => [
      { exercise: exerciseName, from: currentWeight, to: calibrated.weight, date: new Date().toLocaleDateString('hu-HU') },
      ...prev,
    ]);
  };

  const handleManualWeight = (dayId: string, exerciseId: string, exerciseName: string, currentWeight: number, newWeight: number) => {
    onWeightUpdate(dayId, exerciseId, newWeight);
    setCalibrationLog(prev => [
      { exercise: exerciseName, from: currentWeight, to: newWeight, date: new Date().toLocaleDateString('hu-HU') },
      ...prev,
    ]);
  };

  if (!profile) {
    return (
      <div className="text-center py-16">
        <span className="text-6xl mb-4 block">⚖️</span>
        <h2 className="text-2xl font-bold mb-2">Először állítsd be a profilod!</h2>
        <p className="text-gray-400">A Profil fülön add meg az adataidat.</p>
      </div>
    );
  }

  if (days.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-6xl mb-4 block">⚖️</span>
        <h2 className="text-2xl font-bold mb-2">Még nincs edzésterved</h2>
        <p className="text-gray-400">Generálj egy edzéstervet az Edzésterv fülön.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span>⚖️</span> Súly Kalibrálás
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Állítsd be a súlyokat gyakorlatonként. Ha egy súly könnyű, automatikusan növeljük!
        </p>
      </div>

      {/* Day Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {days.map(day => (
          <button
            key={day.id}
            onClick={() => setSelectedDay(day.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              selectedDay === day.id
                ? 'bg-orange-500 text-white'
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white'
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
              onAutoCalibrate={handleCalibrate}
              onManualUpdate={handleManualWeight}
            />
          ))}
        </div>
      )}

      {/* Calibration History */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center justify-between w-full"
        >
          <h3 className="font-bold flex items-center gap-2">
            <span>📊</span> Kalibrációs előzmények
          </h3>
          <span className={`text-gray-400 transition-transform ${showHistory ? 'rotate-180' : ''}`}>▼</span>
        </button>
        
        {showHistory && (
          <div className="mt-4 space-y-2">
            {calibrationLog.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">Még nem volt kalibrálás</p>
            ) : (
              calibrationLog.map((log, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-700/30 rounded-lg p-3 text-sm">
                  <div>
                    <span className="font-medium">{log.exercise}</span>
                    <span className="text-gray-400 ml-2">{log.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">{log.from}kg</span>
                    <span className="text-orange-400">→</span>
                    <span className="text-green-400 font-semibold">{log.to}kg</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20 p-4">
        <h3 className="font-bold text-orange-300 flex items-center gap-2 mb-2">
          <span>💡</span> Tippek a kalibráláshoz
        </h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Ha 12+ ismétlést könnyen megcsináltál → jelöld "Könnyű volt"-nak</li>
          <li>• Ha 8-nál kevesebbet bírtál → csökkentsd a súlyt manuálisan</li>
          <li>• Az automatikus kalibrálás ~12.5%-kal növeli a súlyt</li>
          <li>• Hetente egyszer érdemes kalibrálni, ne minden edzésen</li>
        </ul>
      </div>
    </div>
  );
}

interface CalibrationCardProps {
  exercise: { id: string; name: string; weight: number; sets: number; reps: number; muscleGroup: string };
  dayId: string;
  onAutoCalibrate: (dayId: string, exerciseId: string, name: string, currentWeight: number) => void;
  onManualUpdate: (dayId: string, exerciseId: string, name: string, currentWeight: number, newWeight: number) => void;
}

function CalibrationCard({ exercise, dayId, onAutoCalibrate, onManualUpdate }: CalibrationCardProps) {
  const [showManual, setShowManual] = useState(false);
  const [manualWeight, setManualWeight] = useState(exercise.weight);

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-bold">{exercise.name}</h4>
          <p className="text-xs text-gray-400">{exercise.muscleGroup} • {exercise.sets}×{exercise.reps}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-orange-400">{exercise.weight} kg</div>
        </div>
      </div>

      {/* Weight Slider */}
      <div className="mb-3">
        <input
          type="range"
          min={Math.max(0, exercise.weight - 20)}
          max={exercise.weight + 30}
          step={2.5}
          value={manualWeight}
          onChange={e => setManualWeight(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{Math.max(0, exercise.weight - 20)}kg</span>
          <span>{exercise.weight + 30}kg</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onAutoCalibrate(dayId, exercise.id, exercise.name, exercise.weight)}
          className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 text-sm font-medium py-2 px-3 rounded-lg border border-green-500/30 transition-all"
        >
          ⬆️ Könnyű volt (+12.5%)
        </button>
        <button
          onClick={() => setShowManual(!showManual)}
          className="bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-medium py-2 px-3 rounded-lg transition-all"
        >
          ✏️ Manuális
        </button>
      </div>

      {showManual && (
        <div className="mt-3 flex items-center gap-2">
          <input
            type="number"
            value={manualWeight}
            onChange={e => setManualWeight(Number(e.target.value))}
            className="w-24 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-center"
            step={2.5}
            min={0}
          />
          <span className="text-gray-400">kg</span>
          <button
            onClick={() => {
              onManualUpdate(dayId, exercise.id, exercise.name, exercise.weight, manualWeight);
              setShowManual(false);
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all"
          >
            Beállítás
          </button>
        </div>
      )}
    </div>
  );
}

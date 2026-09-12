import { useState } from 'react';
import { WorkoutDay, UserProfile } from '../types';

interface Props {
  days: WorkoutDay[];
  planGenerated: boolean;
  profile: UserProfile | null;
  onGenerate: () => void;
  onMarkEasy: (dayId: string, exerciseId: string) => void;
  onWeightUpdate: (dayId: string, exerciseId: string, newWeight: number) => void;
}

export default function WorkoutPlanView({ days, planGenerated, profile, onGenerate, onMarkEasy, onWeightUpdate }: Props) {
  const [expandedDay, setExpandedDay] = useState<string | null>(days[0]?.id || null);
  const [editingWeight, setEditingWeight] = useState<{ dayId: string; exerciseId: string } | null>(null);
  const [tempWeight, setTempWeight] = useState(0);

  if (!profile) {
    return (
      <div className="text-center py-16">
        <span className="text-6xl mb-4 block">👤</span>
        <h2 className="text-2xl font-bold mb-2">Először állítsd be a profilod!</h2>
        <p className="text-gray-400">A Profil fülön add meg az adataidat az edzésterv generáláshoz.</p>
      </div>
    );
  }

  if (!planGenerated) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
          <span className="text-6xl mb-4 block">💪</span>
          <h2 className="text-2xl font-bold mb-2">Készen állsz az edzésre?</h2>
          <p className="text-gray-400 mb-6">
            Generálj egy személyre szabott edzéstervet a profilod alapján!
          </p>
          <div className="bg-gray-700/50 rounded-lg p-4 mb-6 text-left text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-400">Súly:</div>
              <div className="font-semibold">{profile.weight} kg</div>
              <div className="text-gray-400">Magasság:</div>
              <div className="font-semibold">{profile.height} cm</div>
              <div className="text-gray-400">Szint:</div>
              <div className="font-semibold capitalize">
                {profile.fitnessLevel === 'beginner' ? 'Kezdő' : profile.fitnessLevel === 'intermediate' ? 'Középhaladó' : 'Haladó'}
              </div>
              <div className="text-gray-400">Cél:</div>
              <div className="font-semibold">
                {profile.goal === 'muscle_gain' ? 'Izomépítés' : profile.goal === 'fat_loss' ? 'Zsírvesztés' : profile.goal === 'strength' ? 'Erőnövelés' : 'Állóképesség'}
              </div>
            </div>
          </div>
          <button
            onClick={onGenerate}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-500/20"
          >
            🏋️ Edzésterv generálása
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Edzésterved</h2>
          <p className="text-gray-400 text-sm">{days.length} napos edzésterv</p>
        </div>
        <button
          onClick={onGenerate}
          className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all"
        >
          🔄 Újragenerálás
        </button>
      </div>

      {days.map(day => (
        <div key={day.id} className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          {/* Day Header */}
          <button
            onClick={() => setExpandedDay(expandedDay === day.id ? null : day.id)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-700/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📅</span>
              <div className="text-left">
                <h3 className="font-bold text-lg">{day.name}</h3>
                <p className="text-gray-400 text-sm">{day.exercises.length} gyakorlat</p>
              </div>
            </div>
            <span className={`text-gray-400 transition-transform ${expandedDay === day.id ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {/* Exercises */}
          {expandedDay === day.id && (
            <div className="border-t border-gray-700 p-4 space-y-3">
              {day.exercises.map(exercise => (
                <div
                  key={exercise.id}
                  className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{exercise.name}</h4>
                        <span className="text-xs bg-gray-600/50 px-2 py-0.5 rounded-full text-gray-300">
                          {exercise.muscleGroup}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                        <span>{exercise.sets} sorozat</span>
                        <span>×</span>
                        <span>{exercise.reps} ismétlés</span>
                        <span>•</span>
                        {editingWeight?.dayId === day.id && editingWeight?.exerciseId === exercise.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={tempWeight}
                              onChange={e => setTempWeight(Number(e.target.value))}
                              className="w-16 bg-gray-600 border border-gray-500 rounded px-2 py-1 text-white text-sm"
                              step="2.5"
                              min="0"
                            />
                            <span className="text-gray-400">kg</span>
                            <button
                              onClick={() => {
                                onWeightUpdate(day.id, exercise.id, tempWeight);
                                setEditingWeight(null);
                              }}
                              className="text-green-400 hover:text-green-300 text-xs"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => setEditingWeight(null)}
                              className="text-red-400 hover:text-red-300 text-xs"
                            >
                              ✗
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingWeight({ dayId: day.id, exerciseId: exercise.id });
                              setTempWeight(exercise.weight);
                            }}
                            className="font-semibold text-orange-400 hover:text-orange-300"
                          >
                            {exercise.weight} kg
                          </button>
                        )}
                      </div>
                      {exercise.notes && (
                        <p className="text-xs text-green-400 mt-1">{exercise.notes}</p>
                      )}
                    </div>
                    <button
                      onClick={() => onMarkEasy(day.id, exercise.id)}
                      className="flex-shrink-0 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 text-xs font-medium py-2 px-3 rounded-lg border border-yellow-500/30 transition-all"
                      title="Jelöld ha könnyű volt - felsúlyozzuk!"
                    >
                      ⬆️ Könnyű volt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

import { useState } from 'react';
import { WorkoutDay, UserProfile, GymMachine } from '../types';
import { t, TranslationKey } from '../i18n';

interface Props {
  days: WorkoutDay[];
  planGenerated: boolean;
  profile: UserProfile | null;
  onGenerate: () => void;
  onMarkEasy: (dayId: string, exerciseId: string) => void;
  onMarkHard: (dayId: string, exerciseId: string) => void;
  onWeightUpdate: (dayId: string, exerciseId: string, newWeight: number) => void;
  onAssignEquipment: (dayId: string, exerciseId: string, equipmentId: string) => void;
  equipment: GymMachine[];
  lang: 'hu' | 'en';
}

export default function WorkoutPlanView({ days, planGenerated, profile, onGenerate, onMarkEasy, onMarkHard, onWeightUpdate, onAssignEquipment, equipment, lang }: Props) {
  const [expandedDay, setExpandedDay] = useState<string | null>(days[0]?.id || null);
  const [editingWeight, setEditingWeight] = useState<{ dayId: string; exerciseId: string } | null>(null);
  const [tempWeight, setTempWeight] = useState(0);

  if (!profile) {
    return (
      <div className="text-center py-16">
        <div className="glass-strong rounded-3xl p-12 max-w-lg mx-auto">
          <span className="text-7xl mb-4 block">👤</span>
          <h2 className="text-2xl font-bold mb-2 text-white text-shadow">{t('setupProfileFirst', lang)}</h2>
          <p className="text-white/60">{t('setupProfileHint', lang)}</p>
        </div>
      </div>
    );
  }

  if (!planGenerated) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="glass-strong rounded-3xl p-8">
          <span className="text-7xl mb-4 block">💪</span>
          <h2 className="text-2xl font-bold mb-2 text-white text-shadow">{t('readyToWorkout', lang)}</h2>
          <p className="text-white/60 mb-6">{t('generateHint', lang)}</p>
          <div className="glass-subtle rounded-2xl p-4 mb-6 text-left text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-white/60">{t('weight', lang)}:</div>
              <div className="font-semibold text-white">{profile.weight || '—'} kg</div>
              <div className="text-white/60">{t('height', lang)}:</div>
              <div className="font-semibold text-white">{profile.height || '—'} cm</div>
              <div className="text-white/60">{t('fitnessLevel', lang)}:</div>
              <div className="font-semibold text-white">
                {t((profile.fitnessLevel === 'beginner' ? 'beginner' : profile.fitnessLevel === 'intermediate' ? 'intermediate' : 'advanced') as TranslationKey, lang)}
              </div>
              <div className="text-white/60">{t('goal', lang)}:</div>
              <div className="font-semibold text-white">
                {t((profile.goal === 'muscle_gain' ? 'muscleGain' : profile.goal === 'fat_loss' ? 'fatLoss' : profile.goal === 'strength' ? 'strength' : 'endurance') as TranslationKey, lang)}
              </div>
              <div className="text-white/60">{t('daysPerWeek', lang)}:</div>
              <div className="font-semibold text-white">{profile.daysPerWeek}</div>
            </div>
          </div>
          <button
            onClick={onGenerate}
            className="w-full glass-strong text-white font-bold py-4 px-6 rounded-xl hover:bg-white/15 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl btn-press"
          >
            {t('generatePlan', lang)}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white text-shadow">{t('yourPlan', lang)}</h2>
          <p className="text-white/60 text-sm">{days.length} {t('dayPlan', lang)}</p>
        </div>
        <button
          onClick={onGenerate}
          className="glass-subtle hover:bg-white/10 text-white text-sm font-medium py-2 px-4 rounded-xl transition-all btn-press"
        >
          {t('regenerate', lang)}
        </button>
      </div>

      {days.map(day => (
        <div key={day.id} className="glass-strong rounded-2xl overflow-hidden hover-lift">
          {/* Day Header */}
          <button
            onClick={() => setExpandedDay(expandedDay === day.id ? null : day.id)}
            className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl glass flex items-center justify-center text-2xl">
                📅
              </div>
              <div className="text-left">
                <h3 className="font-bold text-lg text-white">{day.name}</h3>
                <p className="text-white/50 text-sm">{day.exercises.length} {lang === 'hu' ? 'gyakorlat' : 'exercises'}</p>
              </div>
            </div>
            <span className={`text-white/40 transition-transform text-xl ${expandedDay === day.id ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {/* Exercises */}
          {expandedDay === day.id && (
            <div className="border-t border-white/10 p-4 space-y-3">
              {day.exercises.map(exercise => {
                const assignedMachine = equipment.find(e => e.id === exercise.assignedEquipment);
                return (
                  <div
                    key={exercise.id}
                    className="glass-subtle rounded-xl p-4 hover-lift"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <h4 className="font-semibold text-white">{exercise.name}</h4>
                          <span className="text-xs glass-subtle px-2 py-0.5 rounded-full text-white/70">
                            {exercise.muscleGroup}
                          </span>
                          {assignedMachine && (
                            <span className="text-xs glass px-2 py-0.5 rounded-full text-orange-300">
                              🏋️ {assignedMachine.name}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-white/60">
                          <span>{exercise.sets} {t('sets', lang)}</span>
                          <span className="text-white/30">×</span>
                          <span>{exercise.reps} {t('reps', lang)}</span>
                          <span className="text-white/30">•</span>
                          {editingWeight?.dayId === day.id && editingWeight?.exerciseId === exercise.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={tempWeight}
                                onChange={e => setTempWeight(Number(e.target.value))}
                                className="w-20 glass-subtle rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
                                step="2.5"
                                min="0"
                              />
                              <span className="text-white/60">kg</span>
                              <button
                                onClick={() => {
                                  onWeightUpdate(day.id, exercise.id, tempWeight);
                                  setEditingWeight(null);
                                }}
                                className="text-green-400 hover:text-green-300"
                              >
                                ✓
                              </button>
                              <button
                                onClick={() => setEditingWeight(null)}
                                className="text-red-400 hover:text-red-300"
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
                              className="font-bold text-orange-400 hover:text-orange-300"
                            >
                              {exercise.weight} kg
                            </button>
                          )}
                        </div>
                        {exercise.notes && (
                          <p className="text-xs text-green-400 mt-2">{exercise.notes}</p>
                        )}
                        
                        {/* Equipment Assignment */}
                        <div className="mt-3">
                          <select
                            value={exercise.assignedEquipment || ''}
                            onChange={e => onAssignEquipment(day.id, exercise.id, e.target.value)}
                            className="glass-subtle rounded-lg px-3 py-1.5 text-xs text-white/80 focus:outline-none focus:ring-1 focus:ring-white/20"
                          >
                            <option value="" className="bg-gray-800">{t('assignMachine', lang)}</option>
                            {equipment.map(eq => (
                              <option key={eq.id} value={eq.id} className="bg-gray-800">{eq.name} ({eq.muscleGroup})</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button
                          onClick={() => onMarkEasy(day.id, exercise.id)}
                          className="glass-subtle hover:bg-yellow-500/20 text-yellow-300 text-xs font-medium py-2 px-3 rounded-xl border border-yellow-500/20 transition-all btn-press"
                          title={t('easyHint', lang)}
                        >
                          {t('easy', lang)}
                        </button>
                        <button
                          onClick={() => onMarkHard(day.id, exercise.id)}
                          className="glass-subtle hover:bg-red-500/20 text-red-300 text-xs font-medium py-2 px-3 rounded-xl border border-red-500/20 transition-all btn-press"
                          title={t('hardHint', lang)}
                        >
                          {t('hard', lang)}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

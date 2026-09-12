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
  isGenerating?: boolean;
  planName?: string;
}

export default function WorkoutPlanView({ days, planGenerated, profile, onGenerate, onMarkEasy, onMarkHard, onWeightUpdate, onAssignEquipment, equipment, lang, isGenerating, planName }: Props) {
  const [expandedDay, setExpandedDay] = useState<string | null>(days[0]?.id || null);
  const [editingWeight, setEditingWeight] = useState<{ dayId: string; exerciseId: string } | null>(null);
  const [tempWeight, setTempWeight] = useState(0);

  if (!profile) {
    return (
      <div className="text-center py-12 sm:py-16">
        <div className="glass-strong rounded-3xl p-8 sm:p-12 max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl glass-blue flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">{t('setupProfileFirst', lang)}</h2>
          <p className="text-white/50 text-sm">{t('setupProfileHint', lang)}</p>
        </div>
      </div>
    );
  }

  if (!planGenerated) {
    return (
      <div className="max-w-md mx-auto text-center py-8 sm:py-12">
        <div className="glass-strong rounded-3xl p-6 sm:p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl glass-blue flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">{t('readyToWorkout', lang)}</h2>
          <p className="text-white/50 mb-6 text-sm">{t('generateHint', lang)}</p>
          <div className="glass-subtle rounded-2xl p-4 mb-6 text-left text-sm">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="text-white/50">{t('weight', lang)}:</div>
              <div className="font-semibold text-white">{profile.weight || '—'} kg</div>
              <div className="text-white/50">{t('height', lang)}:</div>
              <div className="font-semibold text-white">{profile.height || '—'} cm</div>
              <div className="text-white/50">{t('fitnessLevel', lang)}:</div>
              <div className="font-semibold text-white">
                {t((profile.fitnessLevel === 'beginner' ? 'beginner' : profile.fitnessLevel === 'intermediate' ? 'intermediate' : 'advanced') as TranslationKey, lang)}
              </div>
              <div className="text-white/50">{t('goal', lang)}:</div>
              <div className="font-semibold text-white">
                {t((profile.goal === 'muscle_gain' ? 'muscleGain' : profile.goal === 'fat_loss' ? 'fatLoss' : profile.goal === 'strength' ? 'strength' : 'endurance') as TranslationKey, lang)}
              </div>
              <div className="text-white/50">{t('daysPerWeek', lang)}:</div>
              <div className="font-semibold text-white">{profile.daysPerWeek}</div>
            </div>
          </div>
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="w-full glass-blue text-blue-300 font-bold py-4 px-6 rounded-xl hover:bg-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.97] shadow-lg btn-press ripple-container disabled:opacity-50"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-rotate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {lang === 'hu' ? 'Generálás...' : 'Generating...'}
              </span>
            ) : (
              t('generatePlan', lang)
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white">{t('yourPlan', lang)}</h2>
          {planName && (
            <p className="text-blue-400 text-xs sm:text-sm font-medium">{planName}</p>
          )}
          <p className="text-white/40 text-xs sm:text-sm">{days.length} {t('dayPlan', lang)}</p>
        </div>
        <button
          onClick={onGenerate}
          className="glass-subtle hover:bg-white/5 text-white/70 text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-xl transition-all btn-press flex items-center gap-1.5"
        >
          <svg className="w-4 h-4 transition-transform duration-500" style={{ transform: 'rotate(0deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="hidden sm:inline">{t('regenerate', lang)}</span>
        </button>
      </div>

      {/* Tudományos háttérinformáció */}
      {planName && (
        <div className="glass-subtle rounded-xl p-3 sm:p-4 border border-blue-500/20">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-xs sm:text-sm text-white/70">
              {lang === 'hu' ? (
                <>
                  <p className="font-medium text-blue-300 mb-1">Tudományosan megalapozott edzésterv</p>
                  <p>Ez az edzésterv a legfrissebb kutatásokon alapul (Eric Trexler PhD, Built With Science). Az optimális hipertrofia score elérése érdekében a frekvencia és a volumen tökéletes egyensúlyára törekszik.</p>
                </>
              ) : (
                <>
                  <p className="font-medium text-blue-300 mb-1">Science-based workout plan</p>
                  <p>This workout plan is based on the latest research (Eric Trexler PhD, Built With Science). It aims for the perfect balance of frequency and volume to achieve optimal hypertrophy score.</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {days.map((day, index) => (
        <div key={day.id} className="glass-strong rounded-2xl overflow-hidden stagger-item hover-lift" style={{ animationDelay: `${index * 0.08}s` }}>
          {/* Day Header */}
          <button
            onClick={() => setExpandedDay(expandedDay === day.id ? null : day.id)}
            className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl glass-blue flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-bold text-sm sm:text-lg text-white">{day.name}</h3>
                <p className="text-white/40 text-xs sm:text-sm">{day.exercises.length} {lang === 'hu' ? 'gyakorlat' : 'exercises'}</p>
              </div>
            </div>
            <svg className={`w-5 h-5 text-white/30 transition-transform flex-shrink-0 ${expandedDay === day.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Exercises */}
          {expandedDay === day.id && (
            <div className="border-t border-white/5 p-3 sm:p-4 space-y-2 sm:space-y-3 animate-fade-in">
              {day.exercises.map((exercise, index) => {
                const assignedMachine = equipment.find(e => e.id === exercise.assignedEquipment);
                return (
                  <div
                    key={exercise.id}
                    className="glass-subtle rounded-xl p-3 sm:p-4 stagger-item spring-card"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-start justify-between gap-2 sm:gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-1.5 sm:mb-2">
                          <h4 className="font-semibold text-sm sm:text-base text-white truncate">{exercise.name}</h4>
                          <span className="text-[10px] sm:text-xs glass-subtle px-1.5 sm:px-2 py-0.5 rounded-full text-white/60 flex-shrink-0">
                            {exercise.muscleGroup}
                          </span>
                        </div>
                        {assignedMachine && (
                          <div className="flex items-center gap-1 mb-1.5">
                            <svg className="w-3 h-3 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <span className="text-[10px] sm:text-xs text-blue-300 truncate">{assignedMachine.name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/50">
                          <span>{exercise.sets} {t('sets', lang)}</span>
                          <span className="text-white/20">×</span>
                          <span>{exercise.reps} {t('reps', lang)}</span>
                          <span className="text-white/20">•</span>
                          {editingWeight?.dayId === day.id && editingWeight?.exerciseId === exercise.id ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                value={tempWeight}
                                onChange={e => setTempWeight(Number(e.target.value))}
                                className="w-16 sm:w-20 glass-subtle rounded-lg px-2 py-1 text-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30"
                                step="2.5"
                                min="0"
                              />
                              <span className="text-white/50 text-xs">kg</span>
                              <button onClick={() => { onWeightUpdate(day.id, exercise.id, tempWeight); setEditingWeight(null); }} className="text-green-400 hover:text-green-300">✓</button>
                              <button onClick={() => setEditingWeight(null)} className="text-red-400 hover:text-red-300">✗</button>
                            </div>
                          ) : (
                            <button
                              onClick={() => { setEditingWeight({ dayId: day.id, exerciseId: exercise.id }); setTempWeight(exercise.weight); }}
                              className="font-bold text-blue-400 hover:text-blue-300"
                            >
                              {exercise.weight} kg
                            </button>
                          )}
                        </div>
                        {exercise.notes && (
                          <p className="text-[10px] sm:text-xs text-green-400/80 mt-1">{exercise.notes}</p>
                        )}
                        
                        {/* Equipment Assignment */}
                        <div className="mt-2">
                          <select
                            value={exercise.assignedEquipment || ''}
                            onChange={e => onAssignEquipment(day.id, exercise.id, e.target.value)}
                            className="glass-subtle rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs text-white/70 focus:outline-none focus:ring-1 focus:ring-blue-500/30 max-w-full"
                          >
                            <option value="" className="bg-gray-900">{t('assignMachine', lang)}</option>
                            {equipment.map(eq => (
                              <option key={eq.id} value={eq.id} className="bg-gray-900">{eq.name} ({eq.muscleGroup})</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => onMarkEasy(day.id, exercise.id)}
                          className="glass-subtle hover:bg-green-500/10 text-green-400 text-[10px] sm:text-xs font-medium py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg border border-green-500/10 transition-all btn-press"
                          title={t('easyHint', lang)}
                        >
                          <span className="hidden sm:inline">{t('easy', lang)}</span>
                          <span className="sm:hidden">⬆️</span>
                        </button>
                        <button
                          onClick={() => onMarkHard(day.id, exercise.id)}
                          className="glass-subtle hover:bg-red-500/10 text-red-400 text-[10px] sm:text-xs font-medium py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg border border-red-500/10 transition-all btn-press"
                          title={t('hardHint', lang)}
                        >
                          <span className="hidden sm:inline">{t('hard', lang)}</span>
                          <span className="sm:hidden">⬇️</span>
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

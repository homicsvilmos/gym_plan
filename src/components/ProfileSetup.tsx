import { useState } from 'react';
import { UserProfile } from '../types';
import { t, TranslationKey } from '../i18n';

interface Props {
  profile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
  lang: 'hu' | 'en';
}

export default function ProfileSetup({ profile, onSave, lang }: Props) {
  const [form, setForm] = useState<UserProfile>(
    profile || {
      name: '',
      weight: '',
      height: '',
      age: '',
      gender: 'male',
      fitnessLevel: 'intermediate',
      goal: 'muscle_gain',
      daysPerWeek: 3,
      language: 'system',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const handleNumberChange = (field: 'weight' | 'height' | 'age', value: string) => {
    if (value === '') {
      setForm({ ...form, [field]: '' });
    } else {
      setForm({ ...form, [field]: Number(value) });
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="glass-strong rounded-3xl p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl glass-blue flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">{t('profileTitle', lang)}</h2>
            <p className="text-white/50 text-xs sm:text-sm">{t('profileSubtitle', lang)}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Név */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">{t('name', lang)}</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full glass-subtle rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              placeholder={t('namePlaceholder', lang)}
            />
          </div>

          {/* Súly és Magasság */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">{t('weight', lang)}</label>
              <input
                type="number"
                value={form.weight === '' ? '' : form.weight}
                onChange={e => handleNumberChange('weight', e.target.value)}
                className="w-full glass-subtle rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                placeholder="75"
                min="30"
                max="200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">{t('height', lang)}</label>
              <input
                type="number"
                value={form.height === '' ? '' : form.height}
                onChange={e => handleNumberChange('height', e.target.value)}
                className="w-full glass-subtle rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                placeholder="175"
                min="140"
                max="220"
              />
            </div>
          </div>

          {/* Életkor és Nem */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">{t('age', lang)}</label>
              <input
                type="number"
                value={form.age === '' ? '' : form.age}
                onChange={e => handleNumberChange('age', e.target.value)}
                className="w-full glass-subtle rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                placeholder="25"
                min="14"
                max="80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">{t('gender', lang)}</label>
              <select
                value={form.gender}
                onChange={e => setForm({ ...form, gender: e.target.value as 'male' | 'female' })}
                className="w-full glass-subtle rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="male" className="bg-gray-900">{t('male', lang)}</option>
                <option value="female" className="bg-gray-900">{t('female', lang)}</option>
              </select>
            </div>
          </div>

          {/* Heti edzésnapok */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-3">{t('daysPerWeek', lang)}</label>
            <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
              {[1, 2, 3, 4, 5, 6].map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setForm({ ...form, daysPerWeek: day })}
                  className={`py-3 rounded-xl text-center font-bold transition-all btn-press text-sm sm:text-base ${
                    form.daysPerWeek === day
                      ? 'glass-blue text-blue-300 shadow-lg animate-scale-in-bounce'
                      : 'glass-subtle text-white/40 hover:text-white/70 hover:scale-105'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            <p className="text-xs text-white/30 mt-2">
              {form.daysPerWeek <= 2 ? (lang === 'hu' ? 'Teljes test edzés' : 'Full body workout') : 
               form.daysPerWeek === 3 ? (lang === 'hu' ? 'Kar/Mell, Hát, Láb' : 'Arms/Chest, Back, Legs') :
               (lang === 'hu' ? 'Kar/Mell, Hát, Láb split' : 'Arms/Chest, Back, Legs split')}
            </p>
          </div>

          {/* Edzettségi szint */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-3">{t('fitnessLevel', lang)}</label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { value: 'beginner', labelKey: 'beginner' as TranslationKey, icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
                { value: 'intermediate', labelKey: 'intermediate' as TranslationKey, icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                { value: 'advanced', labelKey: 'advanced' as TranslationKey, icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z' },
              ].map(level => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setForm({ ...form, fitnessLevel: level.value as UserProfile['fitnessLevel'] })}
                  className={`p-3 sm:p-4 rounded-xl text-center transition-all btn-press ${
                    form.fitnessLevel === level.value
                      ? 'glass-blue text-blue-300 shadow-lg animate-scale-in-bounce'
                      : 'glass-subtle text-white/40 hover:text-white/70 hover:scale-105'
                  }`}
                >
                  <div className="w-8 h-8 mx-auto mb-2">
                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={level.icon} />
                    </svg>
                  </div>
                  <div className="text-[10px] sm:text-xs font-medium">{t(level.labelKey, lang)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Cél */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-3">{t('goal', lang)}</label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {[
                { value: 'muscle_gain', labelKey: 'muscleGain' as TranslationKey, icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
                { value: 'fat_loss', labelKey: 'fatLoss' as TranslationKey, icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z' },
                { value: 'strength', labelKey: 'strength' as TranslationKey, icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                { value: 'endurance', labelKey: 'endurance' as TranslationKey, icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
              ].map(goal => (
                <button
                  key={goal.value}
                  type="button"
                  onClick={() => setForm({ ...form, goal: goal.value as UserProfile['goal'] })}
                  className={`p-3 sm:p-4 rounded-xl text-center transition-all btn-press ${
                    form.goal === goal.value
                      ? 'glass-blue text-blue-300 shadow-lg animate-scale-in-bounce'
                      : 'glass-subtle text-white/40 hover:text-white/70 hover:scale-105'
                  }`}
                >
                  <div className="w-7 h-7 mx-auto mb-1.5">
                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={goal.icon} />
                    </svg>
                  </div>
                  <div className="text-[10px] sm:text-xs font-medium">{t(goal.labelKey, lang)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Nyelv */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-3">{t('language', lang)}</label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { value: 'hu', labelKey: 'hungarian' as TranslationKey, label: '🇭🇺 Magyar' },
                { value: 'en', labelKey: 'english' as TranslationKey, label: '🇬🇧 English' },
                { value: 'system', labelKey: 'systemLang' as TranslationKey, label: '🌐 Auto' },
              ].map(l => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => setForm({ ...form, language: l.value as UserProfile['language'] })}
                  className={`p-3 rounded-xl text-center transition-all btn-press ${
                    form.language === l.value
                      ? 'glass-blue text-blue-300 shadow-lg animate-scale-in-bounce'
                      : 'glass-subtle text-white/40 hover:text-white/70 hover:scale-105'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-medium">{l.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full glass-blue text-blue-300 font-bold py-4 px-6 rounded-xl hover:bg-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.97] shadow-lg btn-press ripple-container"
          >
            {profile ? t('updateProfile', lang) : t('saveProfile', lang)}
          </button>
        </form>
      </div>
    </div>
  );
}

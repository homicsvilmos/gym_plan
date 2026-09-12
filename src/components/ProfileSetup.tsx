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
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">👤</span>
          <div>
            <h2 className="text-2xl font-bold">{t('profileTitle', lang)}</h2>
            <p className="text-gray-400 text-sm">{t('profileSubtitle', lang)}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Név */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('name', lang)}</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder={t('namePlaceholder', lang)}
            />
          </div>

          {/* Súly és Magasság */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('weight', lang)}</label>
              <input
                type="number"
                value={form.weight === '' ? '' : form.weight}
                onChange={e => handleNumberChange('weight', e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="75"
                min="30"
                max="200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('height', lang)}</label>
              <input
                type="number"
                value={form.height === '' ? '' : form.height}
                onChange={e => handleNumberChange('height', e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="175"
                min="140"
                max="220"
              />
            </div>
          </div>

          {/* Életkor és Nem */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('age', lang)}</label>
              <input
                type="number"
                value={form.age === '' ? '' : form.age}
                onChange={e => handleNumberChange('age', e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="25"
                min="14"
                max="80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('gender', lang)}</label>
              <select
                value={form.gender}
                onChange={e => setForm({ ...form, gender: e.target.value as 'male' | 'female' })}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="male">{t('male', lang)}</option>
                <option value="female">{t('female', lang)}</option>
              </select>
            </div>
          </div>

          {/* Heti edzésnapok */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('daysPerWeek', lang)}</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6].map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setForm({ ...form, daysPerWeek: day })}
                  className={`flex-1 py-3 rounded-lg border text-center font-bold transition-all ${
                    form.daysPerWeek === day
                      ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                      : 'bg-gray-700/30 border-gray-600 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {form.daysPerWeek <= 2 ? (lang === 'hu' ? 'Teljes test edzés' : 'Full body workout') : 
               form.daysPerWeek === 3 ? (lang === 'hu' ? 'Push/Pull/Láb split' : 'Push/Pull/Legs split') :
               form.daysPerWeek === 4 ? (lang === 'hu' ? '4 napos felső/alsó split' : '4-day upper/lower split') :
               form.daysPerWeek === 5 ? (lang === 'hu' ? '5 napos izomcsoport split' : '5-day muscle group split') :
               (lang === 'hu' ? '6 napos PPL x2' : '6-day PPL x2')}
            </p>
          </div>

          {/* Edzettségi szint */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('fitnessLevel', lang)}</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'beginner', labelKey: 'beginner' as TranslationKey, emoji: '🌱' },
                { value: 'intermediate', labelKey: 'intermediate' as TranslationKey, emoji: '💪' },
                { value: 'advanced', labelKey: 'advanced' as TranslationKey, emoji: '🔥' },
              ].map(level => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setForm({ ...form, fitnessLevel: level.value as UserProfile['fitnessLevel'] })}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    form.fitnessLevel === level.value
                      ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                      : 'bg-gray-700/30 border-gray-600 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <div className="text-2xl mb-1">{level.emoji}</div>
                  <div className="text-xs font-medium">{t(level.labelKey, lang)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Cél */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('goal', lang)}</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'muscle_gain', labelKey: 'muscleGain' as TranslationKey, emoji: '🏋️' },
                { value: 'fat_loss', labelKey: 'fatLoss' as TranslationKey, emoji: '🔥' },
                { value: 'strength', labelKey: 'strength' as TranslationKey, emoji: '💪' },
                { value: 'endurance', labelKey: 'endurance' as TranslationKey, emoji: '🏃' },
              ].map(goal => (
                <button
                  key={goal.value}
                  type="button"
                  onClick={() => setForm({ ...form, goal: goal.value as UserProfile['goal'] })}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    form.goal === goal.value
                      ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                      : 'bg-gray-700/30 border-gray-600 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <div className="text-xl mb-1">{goal.emoji}</div>
                  <div className="text-xs font-medium">{t(goal.labelKey, lang)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Nyelv */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('language', lang)}</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'hu', labelKey: 'hungarian' as TranslationKey, emoji: '🇭🇺' },
                { value: 'en', labelKey: 'english' as TranslationKey, emoji: '🇬🇧' },
                { value: 'system', labelKey: 'systemLang' as TranslationKey, emoji: '🌐' },
              ].map(l => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => setForm({ ...form, language: l.value as UserProfile['language'] })}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    form.language === l.value
                      ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                      : 'bg-gray-700/30 border-gray-600 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <div className="text-xl mb-1">{l.emoji}</div>
                  <div className="text-xs font-medium">{t(l.labelKey, lang)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-500/20"
          >
            {profile ? t('updateProfile', lang) : t('saveProfile', lang)}
          </button>
        </form>
      </div>
    </div>
  );
}

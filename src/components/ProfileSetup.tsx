import { useState } from 'react';
import { UserProfile } from '../types';

interface Props {
  profile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
}

export default function ProfileSetup({ profile, onSave }: Props) {
  const [form, setForm] = useState<UserProfile>(
    profile || {
      name: '',
      weight: 75,
      height: 175,
      age: 25,
      gender: 'male',
      fitnessLevel: 'intermediate',
      goal: 'muscle_gain',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">👤</span>
          <div>
            <h2 className="text-2xl font-bold">Profil beállítások</h2>
            <p className="text-gray-400 text-sm">Add meg az adataidat a személyre szabott edzéstervhez</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Név */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Név</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="A te neved"
            />
          </div>

          {/* Súly és Magasság */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Testsúly (kg)</label>
              <input
                type="number"
                value={form.weight}
                onChange={e => setForm({ ...form, weight: Number(e.target.value) })}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min="30"
                max="200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Magasság (cm)</label>
              <input
                type="number"
                value={form.height}
                onChange={e => setForm({ ...form, height: Number(e.target.value) })}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min="140"
                max="220"
              />
            </div>
          </div>

          {/* Életkor és Nem */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Életkor</label>
              <input
                type="number"
                value={form.age}
                onChange={e => setForm({ ...form, age: Number(e.target.value) })}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min="14"
                max="80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nem</label>
              <select
                value={form.gender}
                onChange={e => setForm({ ...form, gender: e.target.value as 'male' | 'female' })}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="male">Férfi</option>
                <option value="female">Nő</option>
              </select>
            </div>
          </div>

          {/* Edzettségi szint */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Edzettségi szint</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'beginner', label: 'Kezdő', emoji: '🌱' },
                { value: 'intermediate', label: 'Középhaladó', emoji: '💪' },
                { value: 'advanced', label: 'Haladó', emoji: '🔥' },
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
                  <div className="text-xs font-medium">{level.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Cél */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Cél</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'muscle_gain', label: 'Izomépítés', emoji: '🏋️' },
                { value: 'fat_loss', label: 'Zsírvesztés', emoji: '🔥' },
                { value: 'strength', label: 'Erőnövelés', emoji: '💪' },
                { value: 'endurance', label: 'Állóképesség', emoji: '🏃' },
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
                  <div className="text-xs font-medium">{goal.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-500/20"
          >
            {profile ? 'Profil frissítése' : 'Profil mentése és folytatás →'}
          </button>
        </form>
      </div>
    </div>
  );
}

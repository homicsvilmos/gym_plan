import { useState } from 'react';
import { authenticateUser, createUser } from '../auth';
import { t } from '../i18n';

interface Props {
  onLogin: (userId: string) => void;
  lang: 'hu' | 'en';
}

export default function LoginScreen({ onLogin, lang }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const user = authenticateUser(username, password);
    if (user) {
      onLogin(user.id);
    } else {
      setError(lang === 'hu' ? 'Hibás felhasználónév vagy jelszó' : 'Invalid username or password');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim()) {
      setError(lang === 'hu' ? 'Add meg a felhasználónevet' : 'Please enter a username');
      return;
    }
    
    if (!password.trim()) {
      setError(lang === 'hu' ? 'Add meg a jelszót' : 'Please enter a password');
      return;
    }
    
    if (password.length < 6) {
      setError(lang === 'hu' ? 'A jelszónak legalább 6 karakter hosszúnak kell lennie' : 'Password must be at least 6 characters long');
      return;
    }
    
    const user = createUser(username, password, false);
    if (user) {
      onLogin(user.id);
    } else {
      setError(lang === 'hu' ? 'Ez a felhasználónév már foglalt' : 'This username is already taken');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-30%] left-[-20%] w-[800px] h-[800px] rounded-full bg-blue-900/5 blur-[150px]" />
        <div className="absolute bottom-[-30%] right-[-20%] w-[600px] h-[600px] rounded-full bg-blue-800/5 blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl glass-blue flex items-center justify-center animate-float">
            <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">GymPlan</h1>
          <p className="text-white/50 text-sm">
            {lang === 'hu' ? 'Személyre szabott edzésterv készítő' : 'Personalized workout planner'}
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-strong rounded-3xl p-6 sm:p-8 animate-scale-in">
          {/* Mode Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-3 rounded-xl font-medium transition-all btn-press ${
                mode === 'login'
                  ? 'glass-blue text-blue-300'
                  : 'glass-subtle text-white/50 hover:text-white/70'
              }`}
            >
              {lang === 'hu' ? 'Belépés' : 'Login'}
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-3 rounded-xl font-medium transition-all btn-press ${
                mode === 'register'
                  ? 'glass-blue text-blue-300'
                  : 'glass-subtle text-white/50 hover:text-white/70'
              }`}
            >
              {lang === 'hu' ? 'Regisztráció' : 'Register'}
            </button>
          </div>

          <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                {lang === 'hu' ? 'Felhasználónév' : 'Username'}
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full glass-subtle rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                placeholder={lang === 'hu' ? 'Felhasználónév' : 'Username'}
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                {lang === 'hu' ? 'Jelszó' : 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full glass-subtle rounded-xl px-4 py-3 pr-12 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  placeholder={lang === 'hu' ? 'Jelszó' : 'Password'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="glass-subtle rounded-xl p-3 border border-red-500/20 animate-fade-in">
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full glass-blue text-blue-300 font-bold py-4 px-6 rounded-xl hover:bg-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.97] shadow-lg btn-press ripple-container"
            >
              {mode === 'login' 
                ? (lang === 'hu' ? 'Belépés' : 'Login')
                : (lang === 'hu' ? 'Regisztráció' : 'Register')
              }
            </button>
          </form>

          {/* Hint */}
          {mode === 'login' && (
            <div className="mt-4 text-center">
              <p className="text-white/30 text-xs">
                {lang === 'hu' 
                  ? 'Demo admin: Vili / 123456'
                  : 'Demo admin: Vili / 123456'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

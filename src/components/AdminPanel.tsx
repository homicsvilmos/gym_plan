import { useState } from 'react';
import { User, getUsers, createUser, deleteUser, grantAdminRights, revokeAdminRights } from '../auth';
import { t } from '../i18n';

interface Props {
  currentUser: User;
  lang: 'hu' | 'en';
}

export default function AdminPanel({ currentUser, lang }: Props) {
  const [users, setUsers] = useState<User[]>(getUsers());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newIsAdmin, setNewIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ userId: string; username: string } | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const refreshUsers = () => {
    setUsers(getUsers());
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newUsername.trim()) {
      setError(lang === 'hu' ? 'Add meg a felhasználónevet' : 'Please enter a username');
      return;
    }

    if (!newPassword.trim()) {
      setError(lang === 'hu' ? 'Add meg a jelszót' : 'Please enter a password');
      return;
    }

    const user = createUser(newUsername, newPassword, newIsAdmin);
    if (user) {
      setSuccess(lang === 'hu' ? 'Felhasználó létrehozva!' : 'User created!');
      setNewUsername('');
      setNewPassword('');
      setNewIsAdmin(false);
      setShowCreateForm(false);
      refreshUsers();
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(lang === 'hu' ? 'Ez a felhasználónév már foglalt' : 'This username is already taken');
    }
  };

  const handleDeleteUser = (userId: string, username: string) => {
    setDeleteConfirm({ userId, username });
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteUser(deleteConfirm.userId);
      refreshUsers();
      setSuccess(lang === 'hu' ? 'Felhasználó törölve!' : 'User deleted!');
      setTimeout(() => setSuccess(''), 3000);
      setDeleteConfirm(null);
    }
  };

  const handleToggleAdmin = (userId: string, currentIsAdmin: boolean) => {
    if (currentIsAdmin) {
      revokeAdminRights(userId);
    } else {
      grantAdminRights(userId);
    }
    refreshUsers();
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl glass-blue flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {lang === 'hu' ? 'Admin Panel' : 'Admin Panel'}
            </h2>
            <p className="text-white/40 text-xs sm:text-sm">
              {lang === 'hu' ? 'Felhasználók kezelése' : 'User management'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="glass-blue hover:bg-blue-500/20 text-blue-300 font-medium py-2 px-4 rounded-xl transition-all text-sm btn-press flex items-center gap-2"
        >
          {showCreateForm ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>{lang === 'hu' ? 'Mégse' : 'Cancel'}</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>{lang === 'hu' ? 'Új felhasználó' : 'New user'}</span>
            </>
          )}
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="glass-subtle rounded-xl p-3 border border-green-500/20 animate-fade-in">
          <p className="text-green-400 text-sm flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {success}
          </p>
        </div>
      )}

      {/* Create User Form */}
      {showCreateForm && (
        <div className="glass-strong rounded-2xl p-5 animate-fade-in-down">
          <h3 className="font-bold text-lg text-white mb-4">
            {lang === 'hu' ? 'Új felhasználó létrehozása' : 'Create new user'}
          </h3>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                {lang === 'hu' ? 'Felhasználónév' : 'Username'}
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
                className="w-full glass-subtle rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                placeholder={lang === 'hu' ? 'Felhasználónév' : 'Username'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                {lang === 'hu' ? 'Jelszó' : 'Password'}
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full glass-subtle rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                placeholder={lang === 'hu' ? 'Jelszó' : 'Password'}
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setNewIsAdmin(!newIsAdmin)}
                className={`w-12 h-6 rounded-full transition-all btn-press ${
                  newIsAdmin ? 'bg-blue-500' : 'bg-white/10'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  newIsAdmin ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
              <span className="text-white/70 text-sm">
                {lang === 'hu' ? 'Admin jogosultság' : 'Admin rights'}
              </span>
            </div>

            {error && (
              <div className="glass-subtle rounded-xl p-3 border border-red-500/20">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full glass-blue text-blue-300 font-bold py-3 px-6 rounded-xl hover:bg-blue-500/20 transition-all btn-press ripple-container"
            >
              {lang === 'hu' ? 'Létrehozás' : 'Create'}
            </button>
          </form>
        </div>
      )}

      {/* Users List */}
      <div className="glass-strong rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h3 className="font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {lang === 'hu' ? 'Felhasználók' : 'Users'} ({users.length})
          </h3>
        </div>
        <div className="divide-y divide-white/5">
          {users.map((user, index) => (
            <div 
              key={user.id} 
              className="p-4 hover:bg-white/5 transition-colors stagger-item cursor-pointer"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => setSelectedUser(user)}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    user.isAdmin ? 'glass-blue' : 'glass-subtle'
                  }`}>
                    <span className="text-sm font-bold text-white">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-white truncate">{user.username}</span>
                      {user.isAdmin && (
                        <span className="text-[10px] glass-blue px-1.5 py-0.5 rounded-full text-blue-300 flex-shrink-0">
                          {lang === 'hu' ? 'Admin' : 'Admin'}
                        </span>
                      )}
                      {user.id === currentUser.id && (
                        <span className="text-[10px] glass-subtle px-1.5 py-0.5 rounded-full text-white/50 flex-shrink-0">
                          {lang === 'hu' ? 'Te' : 'You'}
                        </span>
                      )}
                    </div>
                    <p className="text-white/30 text-xs">ID: {user.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Toggle Admin */}
                  {user.id !== currentUser.id && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleAdmin(user.id, user.isAdmin); }}
                      className={`glass-subtle hover:bg-white/10 text-xs font-medium py-1.5 px-3 rounded-lg transition-all btn-press ${
                        user.isAdmin ? 'text-blue-300' : 'text-white/50'
                      }`}
                      title={user.isAdmin 
                        ? (lang === 'hu' ? 'Admin jogok elvétele' : 'Revoke admin rights')
                        : (lang === 'hu' ? 'Admin jog adása' : 'Grant admin rights')
                      }
                    >
                      {user.isAdmin 
                        ? (lang === 'hu' ? 'Admin' : 'Admin')
                        : (lang === 'hu' ? 'Admin?' : 'Admin?')
                      }
                    </button>
                  )}
                  {/* Delete */}
                  {user.id !== currentUser.id && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteUser(user.id, user.username); }}
                      className="glass-subtle hover:bg-red-500/20 text-red-400 w-8 h-8 rounded-lg flex items-center justify-center transition-all btn-press"
                      title={lang === 'hu' ? 'Törlés' : 'Delete'}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}>
          <div className="glass-strong rounded-2xl p-6 max-w-md w-full animate-scale-in-bounce">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {lang === 'hu' ? 'Felhasználó törlése' : 'Delete user'}
                </h3>
                <p className="text-white/60 text-sm">
                  {lang === 'hu' 
                    ? `Biztosan törlöd "${deleteConfirm.username}" felhasználót?`
                    : `Are you sure you want to delete "${deleteConfirm.username}"?`
                  }
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 glass-subtle hover:bg-white/10 text-white font-medium py-3 rounded-xl transition-all btn-press"
              >
                {lang === 'hu' ? 'Mégse' : 'Cancel'}
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium py-3 rounded-xl border border-red-500/30 transition-all btn-press"
              >
                {lang === 'hu' ? 'Törlés' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}>
          <div className="glass-strong rounded-2xl p-6 max-w-md w-full animate-scale-in-bounce">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {lang === 'hu' ? 'Felhasználó adatai' : 'User details'}
              </h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="glass-subtle hover:bg-white/10 w-8 h-8 rounded-lg flex items-center justify-center transition-all btn-press"
              >
                <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  selectedUser.isAdmin ? 'glass-blue' : 'glass-subtle'
                }`}>
                  <span className="text-2xl font-bold text-white">
                    {selectedUser.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-white">{selectedUser.username}</h4>
                    {selectedUser.isAdmin && (
                      <span className="text-xs glass-blue px-2 py-0.5 rounded-full text-blue-300">
                        {lang === 'hu' ? 'Admin' : 'Admin'}
                      </span>
                    )}
                  </div>
                  <p className="text-white/40 text-sm">ID: {selectedUser.id}</p>
                </div>
              </div>

              {/* Profile Data */}
              {selectedUser.profile ? (
                <div className="glass-subtle rounded-xl p-4 space-y-3">
                  <h5 className="font-medium text-white/80 text-sm">
                    {lang === 'hu' ? 'Profil adatok' : 'Profile data'}
                  </h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-white/40">{lang === 'hu' ? 'Név' : 'Name'}</p>
                      <p className="text-white font-medium">{selectedUser.profile.name || '—'}</p>
                    </div>
                    <div>
                      <p className="text-white/40">{lang === 'hu' ? 'Súly' : 'Weight'}</p>
                      <p className="text-white font-medium">{selectedUser.profile.weight || '—'} kg</p>
                    </div>
                    <div>
                      <p className="text-white/40">{lang === 'hu' ? 'Magasság' : 'Height'}</p>
                      <p className="text-white font-medium">{selectedUser.profile.height || '—'} cm</p>
                    </div>
                    <div>
                      <p className="text-white/40">{lang === 'hu' ? 'Életkor' : 'Age'}</p>
                      <p className="text-white font-medium">{selectedUser.profile.age || '—'}</p>
                    </div>
                    <div>
                      <p className="text-white/40">{lang === 'hu' ? 'Nem' : 'Gender'}</p>
                      <p className="text-white font-medium">
                        {selectedUser.profile.gender === 'male' 
                          ? (lang === 'hu' ? 'Férfi' : 'Male')
                          : (lang === 'hu' ? 'Nő' : 'Female')
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-white/40">{lang === 'hu' ? 'Edzésnapok' : 'Workout days'}</p>
                      <p className="text-white font-medium">{selectedUser.profile.daysPerWeek || '—'}</p>
                    </div>
                    <div>
                      <p className="text-white/40">{lang === 'hu' ? 'Szint' : 'Level'}</p>
                      <p className="text-white font-medium">
                        {selectedUser.profile.fitnessLevel === 'beginner' 
                          ? (lang === 'hu' ? 'Kezdő' : 'Beginner')
                          : selectedUser.profile.fitnessLevel === 'intermediate'
                          ? (lang === 'hu' ? 'Középhaladó' : 'Intermediate')
                          : (lang === 'hu' ? 'Haladó' : 'Advanced')
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-white/40">{lang === 'hu' ? 'Cél' : 'Goal'}</p>
                      <p className="text-white font-medium">
                        {selectedUser.profile.goal === 'muscle_gain'
                          ? (lang === 'hu' ? 'Izomépítés' : 'Muscle gain')
                          : selectedUser.profile.goal === 'fat_loss'
                          ? (lang === 'hu' ? 'Zsírvesztés' : 'Fat loss')
                          : selectedUser.profile.goal === 'strength'
                          ? (lang === 'hu' ? 'Erőnövelés' : 'Strength')
                          : (lang === 'hu' ? 'Állóképesség' : 'Endurance')
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-subtle rounded-xl p-4 text-center">
                  <p className="text-white/40 text-sm">
                    {lang === 'hu' ? 'Nincs profil adat' : 'No profile data'}
                  </p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-subtle rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-blue-400">
                    {selectedUser.workoutPlan?.length || 0}
                  </p>
                  <p className="text-white/40 text-xs">
                    {lang === 'hu' ? 'Edzésnap' : 'Workout days'}
                  </p>
                </div>
                <div className="glass-subtle rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-blue-400">
                    {selectedUser.equipment?.length || 0}
                  </p>
                  <p className="text-white/40 text-xs">
                    {lang === 'hu' ? 'Gép' : 'Machines'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

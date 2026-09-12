import { useState } from 'react';
import { GymMachine } from '../types';
import { defaultGymMachines } from '../workoutGenerator';
import { t } from '../i18n';

interface Props {
  equipment: GymMachine[];
  onAdd: (item: GymMachine) => void;
  onRemove: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onResetName: (id: string) => void;
  lang: 'hu' | 'en';
}

export default function EquipmentGallery({ equipment, onAdd, onRemove, onRename, onResetName, lang }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [showDefaults, setShowDefaults] = useState(false);
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const muscleGroups = lang === 'hu' 
    ? ['Mell', 'Hát', 'Láb', 'Váll', 'Kar', 'Törzs', 'Egyéb']
    : ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Other'];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    
    onAdd({
      id: `equip-${Date.now()}`,
      name,
      originalName: name,
      imageUrl,
      muscleGroup: muscleGroup || (lang === 'hu' ? 'Egyéb' : 'Other'),
      isDefault: false,
      isCustom: true,
    });
    
    setName('');
    setMuscleGroup('');
    setImageUrl('');
    setShowForm(false);
  };

  const handleAddDefault = (defaultMachine: typeof defaultGymMachines[0]) => {
    const alreadyAdded = equipment.some(e => e.id === defaultMachine.id);
    if (alreadyAdded) return;
    
    onAdd({
      ...defaultMachine,
      originalName: defaultMachine.name,
      imageUrl: '',
    });
  };

  const handleStartEdit = (machine: GymMachine) => {
    setEditingId(machine.id);
    setEditName(machine.name);
  };

  const handleSaveEdit = () => {
    if (editingId && editName.trim()) {
      onRename(editingId, editName.trim());
    }
    setEditingId(null);
    setEditName('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const isAdded = (id: string) => equipment.some(e => e.id === id);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white text-shadow">{t('gymMachines', lang)}</h2>
          <p className="text-white/60 text-sm">{t('gymMachinesSubtitle', lang)}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDefaults(!showDefaults)}
            className="glass-subtle hover:bg-white/10 text-white font-medium py-2 px-4 rounded-xl transition-all text-sm btn-press"
          >
            📋 {t('defaultMachines', lang)}
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="glass-strong hover:bg-white/15 text-white font-medium py-2 px-4 rounded-xl transition-all text-sm btn-press"
          >
            {showForm ? t('cancel', lang) : t('addNew', lang)}
          </button>
        </div>
      </div>

      {/* Default Machines Section */}
      {showDefaults && (
        <div className="glass-strong rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-white">
            <span>📋</span> {t('defaultMachines', lang)}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {defaultGymMachines.map(machine => (
              <button
                key={machine.id}
                onClick={() => handleAddDefault(machine)}
                disabled={isAdded(machine.id)}
                className={`p-3 rounded-xl text-left text-xs transition-all btn-press ${
                  isAdded(machine.id)
                    ? 'glass-subtle text-green-400 cursor-default border border-green-500/20'
                    : 'glass-subtle text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="font-medium">{machine.name}</div>
                <div className="text-white/40 text-[10px] mt-0.5">{machine.muscleGroup}</div>
                {isAdded(machine.id) && (
                  <div className="text-green-400 text-[10px] mt-1">{t('added', lang)}</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Form */}
      {showForm && (
        <div className="glass-strong rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-lg mb-1 text-white">{t('customMachine', lang)}</h3>
          <p className="text-white/60 text-sm mb-4">{t('customMachineHint', lang)}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">{t('machineName', lang)}</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full glass-subtle rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder={t('machineNamePlaceholder', lang)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">{t('muscleGroup', lang)}</label>
              <select
                value={muscleGroup}
                onChange={e => setMuscleGroup(e.target.value)}
                className="w-full glass-subtle rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <option value="" className="bg-gray-800">{t('chooseOne', lang)}</option>
                {muscleGroups.map(g => (
                  <option key={g} value={g} className="bg-gray-800">{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">{t('uploadImage', lang)}</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full glass-subtle rounded-xl px-4 py-3 text-white"
              />
              {imageUrl && (
                <div className="mt-3">
                  <img src={imageUrl} alt={t('preview', lang)} className="h-32 w-32 object-cover rounded-xl glass" />
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-full glass-strong text-white font-bold py-3 px-4 rounded-xl hover:bg-white/15 transition-all btn-press"
            >
              {t('add', lang)}
            </button>
          </form>
        </div>
      )}

      {/* Equipment Grid */}
      {equipment.length === 0 ? (
        <div className="text-center py-16 glass-subtle rounded-2xl border border-white/10 border-dashed">
          <span className="text-7xl mb-4 block">🏋️</span>
          <h3 className="text-xl font-bold mb-2 text-white">{t('noMachines', lang)}</h3>
          <p className="text-white/60">{t('noMachinesHint', lang)}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipment.map(item => {
            const isEditing = editingId === item.id;
            const originalName = item.originalName || item.name;
            const isRenamed = item.name !== originalName;
            
            return (
              <div key={item.id} className="glass-strong rounded-2xl overflow-hidden hover-lift group">
                <div className="relative h-40 overflow-hidden bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <span className="text-5xl">🏋️</span>
                      <p className="text-xs text-white/40 mt-2">{item.name}</p>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => isEditing ? handleSaveEdit() : handleStartEdit(item)}
                      className="glass w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all opacity-0 group-hover:opacity-100 hover:bg-white/20 btn-press"
                      title={t('rename', lang)}
                    >
                      {isEditing ? '✓' : '✏️'}
                    </button>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="glass w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all opacity-0 group-hover:opacity-100 hover:bg-red-500/30 btn-press"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs glass px-2 py-1 rounded-full text-white/90">
                        {item.muscleGroup}
                      </span>
                      {item.isCustom && (
                        <span className="text-xs glass px-2 py-1 rounded-full text-purple-300">
                          {lang === 'hu' ? 'Egyedi' : 'Custom'}
                        </span>
                      )}
                      {isRenamed && (
                        <span className="text-xs glass px-2 py-1 rounded-full text-blue-300">
                          {t('renamed', lang)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="flex-1 glass-subtle rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleSaveEdit();
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                      />
                      <button
                        onClick={handleCancelEdit}
                        className="text-white/40 hover:text-white text-sm px-2"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-bold text-white">{item.name}</h3>
                      {isRenamed && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-white/40">
                            {t('original', lang)}: {originalName}
                          </span>
                          <button
                            onClick={() => onResetName(item.id)}
                            className="text-xs text-blue-400 hover:text-blue-300 underline"
                          >
                            {t('reset', lang)}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

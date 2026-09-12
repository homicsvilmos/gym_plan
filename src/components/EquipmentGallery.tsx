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
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-bold">{t('gymMachines', lang)}</h2>
          <p className="text-gray-400 text-sm">{t('gymMachinesSubtitle', lang)}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDefaults(!showDefaults)}
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-all text-sm"
          >
            📋 {t('defaultMachines', lang)}
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium py-2 px-4 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all text-sm"
          >
            {showForm ? t('cancel', lang) : t('addNew', lang)}
          </button>
        </div>
      </div>

      {/* Default Machines Section */}
      {showDefaults && (
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4 mb-6">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <span>📋</span> {t('defaultMachines', lang)}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {defaultGymMachines.map(machine => (
              <button
                key={machine.id}
                onClick={() => handleAddDefault(machine)}
                disabled={isAdded(machine.id)}
                className={`p-2 rounded-lg border text-left text-xs transition-all ${
                  isAdded(machine.id)
                    ? 'bg-green-500/10 border-green-500/30 text-green-400 cursor-default'
                    : 'bg-gray-700/30 border-gray-600 text-gray-300 hover:border-orange-500 hover:bg-gray-700/50'
                }`}
              >
                <div className="font-medium">{machine.name}</div>
                <div className="text-gray-500 text-[10px]">{machine.muscleGroup}</div>
                {isAdded(machine.id) && (
                  <div className="text-green-400 text-[10px] mt-0.5">{t('added', lang)}</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Form */}
      {showForm && (
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 mb-6">
          <h3 className="font-bold text-lg mb-1">{t('customMachine', lang)}</h3>
          <p className="text-gray-400 text-sm mb-4">{t('customMachineHint', lang)}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t('machineName', lang)}</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder={t('machineNamePlaceholder', lang)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t('muscleGroup', lang)}</label>
              <select
                value={muscleGroup}
                onChange={e => setMuscleGroup(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">{t('chooseOne', lang)}</option>
                {muscleGroups.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t('uploadImage', lang)}</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
              />
              {imageUrl && (
                <div className="mt-2">
                  <img src={imageUrl} alt={t('preview', lang)} className="h-32 w-32 object-cover rounded-lg border border-gray-600" />
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-2 px-4 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all"
            >
              {t('add', lang)}
            </button>
          </form>
        </div>
      )}

      {/* Equipment Grid */}
      {equipment.length === 0 ? (
        <div className="text-center py-16 bg-gray-800/30 rounded-xl border border-gray-700 border-dashed">
          <span className="text-6xl mb-4 block">🏋️</span>
          <h3 className="text-xl font-bold mb-2">{t('noMachines', lang)}</h3>
          <p className="text-gray-400">{t('noMachinesHint', lang)}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipment.map(item => {
            const isEditing = editingId === item.id;
            const originalName = item.originalName || item.name;
            const isRenamed = item.name !== originalName;
            
            return (
              <div key={item.id} className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden group">
                <div className="relative h-40 overflow-hidden bg-gray-700/50 flex items-center justify-center">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <span className="text-4xl">🏋️</span>
                      <p className="text-xs text-gray-500 mt-1">{item.name}</p>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => isEditing ? handleSaveEdit() : handleStartEdit(item)}
                      className="bg-blue-500/80 hover:bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all opacity-0 group-hover:opacity-100"
                      title={lang === 'hu' ? 'Átnevezés' : 'Rename'}
                    >
                      {isEditing ? '✓' : '✏️'}
                    </button>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="bg-red-500/80 hover:bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all opacity-0 group-hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/90 to-transparent p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-orange-500/80 px-2 py-0.5 rounded-full">
                        {item.muscleGroup}
                      </span>
                      {item.isCustom && (
                        <span className="text-xs bg-purple-500/80 px-2 py-0.5 rounded-full">
                          {lang === 'hu' ? 'Egyedi' : 'Custom'}
                        </span>
                      )}
                      {isRenamed && (
                        <span className="text-xs bg-blue-500/80 px-2 py-0.5 rounded-full">
                          {lang === 'hu' ? 'Átnevezve' : 'Renamed'}
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
                        className="flex-1 bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleSaveEdit();
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                      />
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-400 hover:text-white text-sm px-2"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-bold">{item.name}</h3>
                      {isRenamed && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {t('original', lang)}: {item.originalName}
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

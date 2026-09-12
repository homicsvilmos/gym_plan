import { useState } from 'react';
import { EquipmentImage } from '../types';

interface Props {
  equipment: EquipmentImage[];
  onAdd: (item: EquipmentImage) => void;
  onRemove: (id: string) => void;
}

export default function EquipmentGallery({ equipment, onAdd, onRemove }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const muscleGroups = ['Mell', 'Hát', 'Láb', 'Váll', 'Kar', 'Törzs', 'Egyéb'];

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
    if (!name || !imageUrl) return;
    
    onAdd({
      id: `equip-${Date.now()}`,
      name,
      imageUrl,
      muscleGroup: muscleGroup || 'Egyéb',
    });
    
    setName('');
    setMuscleGroup('');
    setImageUrl('');
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Termi Gépek & Eszközök</h2>
          <p className="text-gray-400 text-sm">Add hozzá a teremben elérhető gépeket képpel</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium py-2 px-4 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all text-sm"
        >
          {showForm ? '✕ Mégse' : '+ Új gép'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 mb-6">
          <h3 className="font-bold text-lg mb-4">Új gép/eszköz hozzáadása</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Gép neve</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="pl. Smith gép, Hackenschmidt..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Izomcsoport</label>
              <select
                value={muscleGroup}
                onChange={e => setMuscleGroup(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Válassz...</option>
                {muscleGroups.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Kép feltöltése</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-orange-500 file:text-white file:font-medium file:cursor-pointer"
              />
              {imageUrl && (
                <div className="mt-2">
                  <img src={imageUrl} alt="Előnézet" className="h-32 w-32 object-cover rounded-lg border border-gray-600" />
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-2 px-4 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all"
            >
              Hozzáadás
            </button>
          </form>
        </div>
      )}

      {/* Equipment Grid */}
      {equipment.length === 0 ? (
        <div className="text-center py-16 bg-gray-800/30 rounded-xl border border-gray-700 border-dashed">
          <span className="text-6xl mb-4 block">🏋️</span>
          <h3 className="text-xl font-bold mb-2">Még nincs gép hozzáadva</h3>
          <p className="text-gray-400">Kattints a "+ Új gép" gombra és tölts fel képeket a teremben elérhető gépekről</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipment.map(item => (
            <div key={item.id} className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => onRemove(item.id)}
                    className="bg-red-500/80 hover:bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all opacity-0 group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/90 to-transparent p-3">
                  <span className="text-xs bg-orange-500/80 px-2 py-0.5 rounded-full">
                    {item.muscleGroup}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold">{item.name}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

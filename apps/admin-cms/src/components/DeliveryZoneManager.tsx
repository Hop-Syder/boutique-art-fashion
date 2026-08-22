import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { DeliveryZone } from '@ayele/shared';
import { Truck, Plus, Edit2, Trash2, Check, MapPin, DollarSign, Clock } from 'lucide-react';

export const DeliveryZoneManager: React.FC = () => {
  const { deliveryZones, addDeliveryZone, updateDeliveryZone, deleteDeliveryZone, formatFCFA } = useAdmin();

  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [name, setName] = useState('');
  const [fee, setFee] = useState(1000);
  const [description, setDescription] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('2h – 4h');

  const handleOpenCreate = () => {
    setName('');
    setFee(1000);
    setDescription('');
    setEstimatedTime('2h – 4h');
    setEditingZone(null);
    setIsCreating(true);
  };

  const handleEdit = (zone: DeliveryZone) => {
    setEditingZone(zone);
    setName(zone.name);
    setFee(zone.fee);
    setDescription(zone.description);
    setEstimatedTime(zone.estimated_time);
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: DeliveryZone = {
      id: editingZone ? editingZone.id : `zone-${Date.now()}`,
      name,
      fee,
      description,
      estimated_time: estimatedTime,
    };

    if (editingZone) {
      updateDeliveryZone(payload);
    } else {
      addDeliveryZone(payload);
    }

    setIsCreating(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-semibold text-slate-900">
            Gestion des Zones & Tarifs de Livraison ({deliveryZones.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Définissez les frais de transport et délais estimatifs pour les villes du Bénin.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-orange-400" />
          <span>Ajouter une Zone</span>
        </button>
      </div>

      {/* Form Modal */}
      {isCreating && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4 max-w-xl mx-auto">
          <h3 className="font-serif font-bold text-slate-900 text-base">
            {editingZone ? 'Modifier la Zone' : 'Nouvelle Zone de Livraison'}
          </h3>

          <div>
            <label className="text-xs font-semibold text-slate-800 block mb-1">Nom de la Zone / Quartiers *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Cotonou Centre (Ganhi, Haie Vive...)"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">Frais de livraison (FCFA) *</label>
              <input
                type="number"
                required
                value={fee}
                onChange={(e) => setFee(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">Délai estimé *</label>
              <input
                type="text"
                required
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                placeholder="Ex: 2h – 4h ou 24h"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-800 block mb-1">Description / Notes</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Livraison express par coursier"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl text-xs border border-slate-200 text-slate-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white"
            >
              Enregistrer
            </button>
          </div>
        </form>
      )}

      {/* Grid of zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {deliveryZones.map((z) => (
          <div key={z.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                  {z.name}
                </span>
                <span className="text-xs font-extrabold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200 shrink-0">
                  {z.fee === 0 ? 'GRATUIT' : formatFCFA(z.fee)}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">{z.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> {z.estimated_time}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEdit(z)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Supprimer la zone ${z.name} ?`)) deleteDeliveryZone(z.id);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

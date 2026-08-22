import React, { useState } from 'react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { AdminHeader } from './components/AdminHeader';
import { ProductManager } from './components/ProductManager';
import { FilterManager } from './components/FilterManager';
import { SectionImageManager } from './components/SectionImageManager';
import { OrderManager } from './components/OrderManager';
import { DeliveryZoneManager } from './components/DeliveryZoneManager';
import { Settings, Save, Check, Download, Upload, RefreshCw } from 'lucide-react';
import { StoreSettings, storageService } from '@ayele/shared';

const SettingsTab: React.FC = () => {
  const { settings, updateSettings, resetToDefaultData } = useAdmin();
  const [formData, setFormData] = useState<StoreSettings>(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExportBackup = () => {
    const json = storageService.exportDataJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `art_fashion_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = storageService.importDataJSON(content);
        if (success) {
          alert('Sauvegarde restaurée avec succès ! La page va se recharger.');
          window.location.reload();
        } else {
          alert('Erreur lors de l’importation du fichier de sauvegarde JSON.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-serif font-bold text-slate-900">Coordonnées & Paramètres Boutique</h3>
            <p className="text-xs text-slate-500">Mettez à jour vos numéros WhatsApp, adresses et horaires.</p>
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4 text-orange-400" />}
            <span>{saved ? 'Enregistré !' : 'Sauvegarder'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-800 block mb-1">Nom de la Boutique</label>
            <input
              type="text"
              value={formData.store_name}
              onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-800 block mb-1">Numéro WhatsApp Réception (Format Bénin)</label>
            <input
              type="text"
              value={formData.whatsapp_number}
              onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-semibold text-slate-800 block mb-1">Adresse Physiques Ateliers</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-800 block mb-1">Téléphones Affichés</label>
            <input
              type="text"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-800 block mb-1">Email Officiel</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
        </div>
      </form>

      {/* Backup & Restore Panel */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h4 className="text-base font-serif font-bold text-slate-900 border-b border-slate-100 pb-3">
          Sauvegarde & Sécurité des Données Magasin
        </h4>
        <p className="text-xs text-slate-500">
          Téléchargez une copie complète des produits, catégories et paramètres au format JSON ou réinitialisez les données d'origine.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleExportBackup}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Exporter Sauvegarde (.json)</span>
          </button>

          <label className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs">
            <Upload className="w-4 h-4" />
            <span>Restaurer un fichier JSON</span>
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>

          <button
            onClick={resetToDefaultData}
            className="px-4 py-2.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border border-slate-200 hover:border-red-200 cursor-pointer ml-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Réinitialiser Données</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminContent: React.FC = () => {
  const { activeTab } = useAdmin();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <AdminHeader />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'products' && <ProductManager />}
        {activeTab === 'filters' && <FilterManager />}
        {activeTab === 'cms-sections' && <SectionImageManager />}
        {activeTab === 'orders' && <OrderManager />}
        {activeTab === 'delivery-zones' && <DeliveryZoneManager />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AdminProvider>
      <AdminContent />
    </AdminProvider>
  );
}

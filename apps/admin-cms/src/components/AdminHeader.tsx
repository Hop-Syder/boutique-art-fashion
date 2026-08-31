import React from 'react';
import { useAdmin } from '../context/AdminContext';
import {
  ShoppingBag,
  Package,
  FolderTree,
  Sliders,
  Truck,
  Settings,
  Image as ImageIcon,
  RotateCcw,
  ExternalLink,
  LogOut,
  HelpCircle,
} from 'lucide-react';

interface AdminHeaderProps {
  onOpenHelp?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onOpenHelp }) => {
  const { activeTab, setActiveTab, products, categories, filters, orders } = useAdmin();

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'NOUVELLE' || o.status === 'CONTACTÉE' || o.status === 'CONFIRMÉE'
  ).length;

  const lowStockCount = products.filter((p) =>
    p.variants.some((v) => v.stock <= 2)
  ).length;

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Branding & Metrics Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-slate-800 gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo-art-fashion.png"
              alt="ART FASHION Logo"
              className="h-10 w-auto object-contain"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-white">Art Fashion Back-Office</span>

              </div>
              <p className="text-xs text-slate-400">Gestion du catalogue, des commandes et du contenu</p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 text-xs">
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <span className="text-slate-400 block text-[10px]">Alertes Stock</span>
              <span className="font-bold text-rose-400">{lowStockCount} produits bas</span>
            </div>
            <button
              onClick={onOpenHelp}
              className="min-h-[44px] px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/15"
              title="Ouvrir le guide de démarrage"
            >
              <HelpCircle className="w-4 h-4 text-orange-300" />
              <span>Aide</span>
            </button>
            <a
              href="https://www.artfashionhome.com/"
              target="_blank"
              rel="noreferrer"
              className="min-h-[44px] px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/15"
              title="Ouvrir le site vitrine client"
            >
              <span>Site Vitrine</span>
              <ExternalLink className="w-3.5 h-3.5 text-red-400" />
            </a>
          </div>
        </div>

        {/* Navigation Tabs (Desktop only) */}
        <div className="hidden md:flex items-center space-x-2 overflow-x-auto py-2.5">
          <button
            onClick={() => setActiveTab('products')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'products'
                ? 'bg-red-700 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <Package className="w-4 h-4" />
            <span>Produits ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('filters')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'filters'
                ? 'bg-red-700 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <Sliders className="w-4 h-4 text-red-300" />
            <span>Filtres ({filters.filter((f) => !f.is_archived).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('cms-sections')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'cms-sections'
                ? 'bg-red-700 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <ImageIcon className="w-4 h-4 text-red-300" />
            <span>Éditeur de Sections (CMS)</span>
          </button>

          <button
            onClick={() => setActiveTab('delivery-zones')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'delivery-zones'
                ? 'bg-red-700 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <Truck className="w-4 h-4" />
            <span>Zones de Livraison</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'settings'
                ? 'bg-red-700 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <Settings className="w-4 h-4" />
            <span>Paramètres Boutique</span>
          </button>

          <div className="ml-auto pl-4 border-l border-slate-800 flex items-center gap-2">
            <button
              onClick={() => {
                localStorage.removeItem('admin_auth');
                localStorage.removeItem('admin_token');
                window.location.reload();
              }}
              className="min-w-[44px] min-h-[44px] p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer flex items-center justify-center"
              title="Se déconnecter"
              aria-label="Se déconnecter"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { Package, Sliders, Image as ImageIcon, Truck, Settings } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useAdmin();

  const navItems = [
    { id: 'products', icon: Package, label: 'Produits' },
    { id: 'filters', icon: Sliders, label: 'Filtres' },
    { id: 'cms-sections', icon: ImageIcon, label: 'Éditeur' },
    { id: 'delivery-zones', icon: Truck, label: 'Livraison' },
    { id: 'settings', icon: Settings, label: 'Réglages' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center justify-center w-full py-1 gap-1 transition-colors ${
                isActive ? 'text-red-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className={`p-1.5 rounded-full transition-all ${isActive ? 'bg-red-50' : 'bg-transparent'}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              </div>
              <span className={`text-[10px] text-center leading-none ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

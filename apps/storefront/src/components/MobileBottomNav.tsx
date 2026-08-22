/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description MobileBottomNav — Barre de navigation mobile flottante haute couture : icônes modernes 21st UI, capsule glassmorphism, micro-interactions et badge panier dynamique
 * @created 2026-08-19
 * @updated 2026-08-22
 * 🌐 nexuspartners.xyz
 * 📧 daoudaabassichristian@gmail.com
 */
// ──────────────────────────────────
import React from 'react';
import { useStore, AppView } from '../context/StoreContext';
import { CartIcon } from './CartIcon';

// ─── ICÔNES MODERNES 21ST DEV UI STYLE ───────────────────────────────

const IconHome = ({ active }: { active: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className={`w-5 h-5 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-105'}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H15C14.4477 21 14 20.5523 14 20V15C14 14.4477 13.5523 14 13 14H11C10.4477 14 10 14.4477 10 15V20C10 20.5523 9.55228 21 9 21H4C3.44772 21 3 20.5523 3 20V10.5Z"
      fill={active ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={active ? '2' : '1.8'}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconCatalog = ({ active }: { active: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className={`w-5 h-5 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-105'}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="3"
      width="7.5"
      height="7.5"
      rx="2"
      fill={active ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={active ? '2' : '1.8'}
    />
    <rect
      x="13.5"
      y="3"
      width="7.5"
      height="7.5"
      rx="2"
      fill={active ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={active ? '2' : '1.8'}
    />
    <rect
      x="3"
      y="13.5"
      width="7.5"
      height="7.5"
      rx="2"
      fill={active ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={active ? '2' : '1.8'}
    />
    <rect
      x="13.5"
      y="13.5"
      width="7.5"
      height="7.5"
      rx="2"
      fill={active ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={active ? '2' : '1.8'}
    />
  </svg>
);

const IconTracking = ({ active }: { active: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className={`w-5 h-5 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-105'}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.5 9.4 7.55 4.24M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={active ? 'currentColor' : 'none'}
      fillOpacity={active ? '0.15' : '0'}
    />
    <polyline
      points="3.29 7 12 12 20.71 7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="12"
      y1="22"
      x2="12"
      y2="12"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconAbout = ({ active }: { active: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className={`w-5 h-5 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-105'}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={active ? 'currentColor' : 'none'}
    />
  </svg>
);

export const MobileBottomNav: React.FC = () => {
  const { currentView, setCurrentView, cartItemCount, setIsCartOpen, setIsTrackingOpen, language, t } = useStore();

  const handleNav = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className="lg:hidden fixed bottom-3 left-3 right-3 z-40 bg-slate-950/95 text-slate-300 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl px-2 py-1.5 transition-all duration-300"
      aria-label="Navigation mobile"
    >
      <div className="flex items-center justify-around relative">
        
        {/* 1. Accueil */}
        <button
          onClick={() => handleNav('home')}
          className={`min-w-[48px] min-h-[46px] flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all duration-200 cursor-pointer rounded-xl group relative ${
            currentView === 'home'
              ? 'text-red-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label={language === 'en' ? 'Home' : 'Accueil'}
          id="mobile-nav-home"
        >
          <IconHome active={currentView === 'home'} />
          <span className="tracking-tight">{t('nav.home')}</span>
          {currentView === 'home' && (
            <span className="absolute -bottom-1 w-4 h-0.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          )}
        </button>

        {/* 2. Rayons / Catalogue */}
        <button
          onClick={() => handleNav('catalog')}
          className={`min-w-[48px] min-h-[46px] flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all duration-200 cursor-pointer rounded-xl group relative ${
            currentView === 'catalog'
              ? 'text-red-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label={language === 'en' ? 'Catalog' : 'Catalogue'}
          id="mobile-nav-catalog"
        >
          <IconCatalog active={currentView === 'catalog'} />
          <span className="tracking-tight">{t('nav.catalog')}</span>
          {currentView === 'catalog' && (
            <span className="absolute -bottom-1 w-4 h-0.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          )}
        </button>

        {/* 3. Center Cart Trigger (Capsule Flottante Carmin) */}
        <div className="relative -mt-6">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center w-13 h-13 rounded-full bg-gradient-to-tr from-red-700 via-red-600 to-red-500 text-white shadow-[0_8px_20px_rgba(220,38,38,0.45)] border-2 border-slate-950 active:scale-95 transition-transform duration-200 cursor-pointer group"
            aria-label={language === 'en' ? 'Cart' : 'Panier'}
            id="mobile-nav-cart"
          >
            <CartIcon className="w-5 h-5 text-white drop-shadow-sm group-hover:scale-110 transition-transform" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-red-600 text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-lg border border-red-600 animate-pulse">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>

        {/* 4. Suivi de Commande */}
        <button
          onClick={() => setIsTrackingOpen(true)}
          className="min-w-[48px] min-h-[46px] flex flex-col items-center justify-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-200 transition-all duration-200 cursor-pointer rounded-xl group relative"
          aria-label="Suivre ma commande"
          id="mobile-nav-tracking"
        >
          <IconTracking active={false} />
          <span className="tracking-tight">{language === 'en' ? 'Track' : 'Suivi'}</span>
        </button>

        {/* 5. À Propos / Maison */}
        <button
          onClick={() => handleNav('about')}
          className={`min-w-[48px] min-h-[46px] flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all duration-200 cursor-pointer rounded-xl group relative ${
            currentView === 'about'
              ? 'text-red-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label={t('nav.about')}
          id="mobile-nav-about"
        >
          <IconAbout active={currentView === 'about'} />
          <span className="tracking-tight">{t('nav.about')}</span>
          {currentView === 'about' && (
            <span className="absolute -bottom-1 w-4 h-0.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          )}
        </button>

      </div>
    </nav>
  );
};

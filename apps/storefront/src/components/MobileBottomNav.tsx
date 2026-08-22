/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description MobileBottomNav — Barre de navigation mobile haute couture avec encoche courbée (Curved Notch), panier central grand format en relief et accès direct WhatsApp & Maison
 * @created 2026-08-19
 * @updated 2026-08-22
 * 🌐 nexus-partners.xyz
 * 📧 daoudaabassichristian@gmail.com
 */
// ──────────────────────────────────
import React from 'react';
import { useStore, AppView } from '../context/StoreContext';
import { CartIcon } from './CartIcon';

// ─── ICÔNES VECTORIELLES MODERNES STYLE 21ST DEV UI ─────────────────

const IconHome = ({ active }: { active: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className={`w-5 h-5 transition-all duration-300 ${active ? 'scale-110 text-red-500' : 'text-slate-400 group-hover:text-slate-200'}`}
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
    className={`w-5 h-5 transition-all duration-300 ${active ? 'scale-110 text-red-500' : 'text-slate-400 group-hover:text-slate-200'}`}
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

const IconAbout = ({ active }: { active: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className={`w-5 h-5 transition-all duration-300 ${active ? 'scale-110 text-red-500' : 'text-slate-400 group-hover:text-slate-200'}`}
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

const IconWhatsApp = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z" />
  </svg>
);

export const MobileBottomNav: React.FC = () => {
  const { currentView, setCurrentView, cartItemCount, setIsCartOpen, settings, language, t } = useStore();

  const handleNav = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappUrl = `https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Bonjour Maison Art Fashion, je souhaite être conseillé pour un article.'
  )}`;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 pointer-events-none pb-safe">
      <div className="relative max-w-lg mx-auto w-full pointer-events-auto">
        
        {/* ── 1. FOND AVEC ENCOCHE COURBÉE (Curved Notch SVG Background) ── */}
        <div className="relative w-full h-[72px] filter drop-shadow-[0_-8px_20px_rgba(0,0,0,0.45)]">
          <svg
            className="w-full h-full"
            viewBox="0 0 390 72"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Découpe géométrique concave au centre (de x=142 à x=248) */}
            <path
              d="M 0,16 
                 L 142,16 
                 C 156,16 160,54 195,54 
                 C 230,54 234,16 248,16 
                 L 390,16 
                 L 390,72 
                 L 0,72 
                 Z"
              fill="#090d16"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1.2"
            />
          </svg>
        </div>

        {/* ── 2. GROS BOUTON PANIER CENTRAL SURÉLEVÉ (Flottant dans l'encoche) ── */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-5 z-50 flex flex-col items-center">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center w-15 h-15 rounded-full bg-gradient-to-tr from-red-700 via-red-600 to-red-500 text-white shadow-[0_10px_25px_rgba(220,38,38,0.55)] border-[3.5px] border-[#090d16] active:scale-95 transition-all duration-200 cursor-pointer group hover:shadow-[0_12px_30px_rgba(239,68,68,0.7)]"
            aria-label={language === 'en' ? 'Cart' : 'Panier'}
            id="mobile-nav-cart"
          >
            <CartIcon className="w-6 h-6 text-white drop-shadow-md group-hover:scale-110 transition-transform" />
            
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-red-600 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-red-600 animate-bounce">
                {cartItemCount}
              </span>
            )}
          </button>
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-red-400 mt-1 font-mono">
            {language === 'en' ? 'Cart' : 'Panier'}
          </span>
        </div>

        {/* ── 3. ONGLETS DE NAVIGATION LATÉRAUX ── */}
        <div className="absolute inset-0 pt-3 px-3 flex items-center justify-between text-white">
          
          {/* Côté Gauche : Accueil & Catalogue */}
          <div className="flex items-center justify-around w-[40%]">
            
            {/* Accueil */}
            <button
              onClick={() => handleNav('home')}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-xl transition-all duration-200 cursor-pointer group relative ${
                currentView === 'home'
                  ? 'text-red-400 font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label={language === 'en' ? 'Home' : 'Accueil'}
              id="mobile-nav-home"
            >
              <IconHome active={currentView === 'home'} />
              <span className="text-[10px] tracking-tight">{t('nav.home')}</span>
              {currentView === 'home' && (
                <span className="w-3 h-0.5 bg-red-500 rounded-full shadow-[0_0_6px_rgba(239,68,68,0.8)] mt-0.5" />
              )}
            </button>

            {/* Catalogue */}
            <button
              onClick={() => handleNav('catalog')}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-xl transition-all duration-200 cursor-pointer group relative ${
                currentView === 'catalog'
                  ? 'text-red-400 font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label={language === 'en' ? 'Catalog' : 'Catalogue'}
              id="mobile-nav-catalog"
            >
              <IconCatalog active={currentView === 'catalog'} />
              <span className="text-[10px] tracking-tight">{t('nav.catalog')}</span>
              {currentView === 'catalog' && (
                <span className="w-3 h-0.5 bg-red-500 rounded-full shadow-[0_0_6px_rgba(239,68,68,0.8)] mt-0.5" />
              )}
            </button>

          </div>

          {/* Espace vide central réservé au panier */}
          <div className="w-[20%]" />

          {/* Côté Droit : À Propos & WhatsApp Direct */}
          <div className="flex items-center justify-around w-[40%]">
            
            {/* À Propos */}
            <button
              onClick={() => handleNav('about')}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-xl transition-all duration-200 cursor-pointer group relative ${
                currentView === 'about'
                  ? 'text-red-400 font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label={t('nav.about')}
              id="mobile-nav-about"
            >
              <IconAbout active={currentView === 'about'} />
              <span className="text-[10px] tracking-tight">{t('nav.about')}</span>
              {currentView === 'about' && (
                <span className="w-3 h-0.5 bg-red-500 rounded-full shadow-[0_0_6px_rgba(239,68,68,0.8)] mt-0.5" />
              )}
            </button>

            {/* WhatsApp Direct */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center gap-0.5 py-1 px-2 text-slate-400 hover:text-emerald-400 transition-all duration-200 cursor-pointer rounded-xl group relative"
              aria-label="Contacter sur WhatsApp"
              id="mobile-nav-whatsapp"
            >
              <IconWhatsApp />
              <span className="text-[10px] tracking-tight">WhatsApp</span>
            </a>

          </div>

        </div>
      </div>
    </div>
  );
};

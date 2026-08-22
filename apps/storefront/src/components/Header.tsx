/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description Header — Barre de navigation principale : logo, recherche, langues, panier, menu mobile Art Fashion Storefront
 * @created 2026-08-19
 * @updated 2026-08-22
 * 🌐 nexus-partners.xyz
 * 📧 daoudaabassichristian@gmail.com
 */
// ──────────────────────────────────
import React, { useState } from 'react';
import { useStore, AppView } from '../context/StoreContext';
import {
  Search,
  Truck,
  Package,
  Menu,
  X,
  Sparkles,
  Heart,
  Globe,
  Facebook,
  ChevronDown,
  MapPin,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { CartIcon } from './CartIcon';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartItemCount,
    cartSubtotal,
    setIsCartOpen,
    setIsTrackingOpen,
    settings,
    filters,
    setFilters,
    language,
    setLanguage,
    t,
    formatFCFA,
  } = useStore();

  const [searchOpen, setSearchOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  const handleNav = (view: AppView) => {
    setCurrentView(view);
    setMegaMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filters.searchQuery.trim()) {
      setCurrentView('catalog');
      setSearchOpen(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  const handleCategoryClick = (categoryId: string) => {
    setFilters((prev) => ({ ...prev, category: categoryId, gender: 'all' }));
    handleNav('catalog');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/90 shadow-md transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-slate-950 text-slate-300 py-2 px-4 text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2.5 font-medium tracking-wide">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-bold text-red-500">
              Art Fashion :
            </span>
            <span className="text-slate-200 font-semibold">
              {language === 'en'
                ? 'Prêt-à-Porter de Luxe • Cotonou'
                : 'Prêt-à-Porter de Luxe • Cotonou'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            <a
              href={`tel:${settings.phone_number}`}
              className="hidden md:flex items-center gap-1.5 hover:text-white transition-colors"
              title="Appeler la boutique Rue 403"
            >
              <Phone className="w-3.5 h-3.5 text-red-500" />
              <span className="font-mono text-[11px] font-bold">{settings.phone_number}</span>
            </a>

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-100 text-[11px] font-bold border border-slate-700 transition-all cursor-pointer min-h-[32px]"
              title="Changer de langue / Switch Language"
              aria-label="Changer de langue"
              id="header-lang-toggle"
            >
              <Globe className="w-3.5 h-3.5 text-red-500" />
              <span>{language === 'fr' ? 'FR 🇫🇷' : 'EN 🇬🇧'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">


          {/* Brand Logo Image replacing text badge */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNav('home')}
            role="button"
            tabIndex={0}
            aria-label="Accueil ART FASHION"
          >
            <img
              src="/logo-art-fashion.png"
              alt="ART FASHION Logo"
              className="h-12 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </div>

          {/* Desktop Navigation Links (Floating Over All Content) */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-bold tracking-wide">
            <button
              onClick={() => handleNav('home')}
              className={`transition-all relative py-1 cursor-pointer min-h-[44px] flex items-center ${currentView === 'home'
                  ? 'text-slate-950 font-extrabold after:absolute after:bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-red-600'
                  : 'text-slate-700 hover:text-slate-950'
                }`}
              id="nav-link-home"
            >
              {t('nav.home')}
            </button>

            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button
                onClick={() => {
                  setFilters((prev) => ({ ...prev, category: 'all', gender: 'all' }));
                  handleNav('catalog');
                }}
                className={`transition-all relative py-1 cursor-pointer min-h-[44px] flex items-center gap-1.5 ${currentView === 'catalog'
                    ? 'text-slate-950 font-extrabold after:absolute after:bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-red-600'
                    : 'text-slate-700 hover:text-slate-950'
                  }`}
                id="nav-link-catalog"
              >
                <span>{t('nav.catalog')}</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${megaMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {megaMenuOpen && (
                <div className="absolute top-full left-0 w-84 bg-white/98 backdrop-blur-2xl border border-slate-200 rounded-2xl shadow-2xl p-3.5 grid grid-cols-1 gap-1 animate-fadeIn z-50">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3 pt-1 pb-1 border-b border-slate-100">
                    {language === 'en' ? 'Default Universes & Categories' : 'Rayons & Catégories'}
                  </div>
                  <button
                    onClick={() => handleCategoryClick('hauts')}
                    className="p-2.5 text-left rounded-xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-900 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">👕 Hauts (Chemises, Boubous...)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => handleCategoryClick('bas')}
                    className="p-2.5 text-left rounded-xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-900 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">👖 Bas (Pantalons, Jeans...)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => handleCategoryClick('vestes-manteaux')}
                    className="p-2.5 text-left rounded-xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-900 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">🧥 Vestes & manteaux</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => handleCategoryClick('costumes-habille')}
                    className="p-2.5 text-left rounded-xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-900 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">🤵 Costumes & habillé</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => handleCategoryClick('sous-vetements')}
                    className="p-2.5 text-left rounded-xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-900 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">🩲 Sous-vêtements</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => handleCategoryClick('chaussures')}
                    className="p-2.5 text-left rounded-xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-900 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">👞 Chaussures</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => handleCategoryClick('accessoires')}
                    className="p-2.5 text-left rounded-xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-900 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">💼 Accessoires</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => handleCategoryClick('vetements-de-sport')}
                    className="p-2.5 text-left rounded-xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-900 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">🏋️ Vêtements de sport</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => handleCategoryClick('autre')}
                    className="p-2.5 text-left rounded-xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-900 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">🎁 Autre</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              )}
            </div>



            <button
              onClick={() => handleNav('about')}
              className={`transition-all flex items-center gap-1.5 cursor-pointer min-h-[44px] ${currentView === 'about'
                ? 'text-slate-900 font-bold after:absolute after:bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-red-600'
                : 'text-slate-700 hover:text-slate-900'
                }`}
              id="nav-link-about"
            >
              <span>{t('nav.about')}</span>
            </button>


          </nav>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="min-w-[44px] min-h-[44px] p-2.5 rounded-full text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors flex items-center justify-center cursor-pointer focus:ring-2 focus:ring-slate-900"
              aria-label="Rechercher des produits"
              id="header-search-btn"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative min-h-[44px] px-3.5 py-2 rounded-2xl bg-slate-950 text-white hover:bg-slate-900 transition-all flex items-center gap-2.5 shadow-md cursor-pointer focus:ring-2 focus:ring-slate-900 border border-slate-800"
              aria-label="Ouvrir le panier"
              id="header-cart-btn"
            >
              <div className="relative">
                <CartIcon className="w-5 h-5 text-red-500" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-[10px] text-slate-400 block leading-tight">Mon Panier</span>
                <span className="text-xs font-bold text-white block">
                  {cartItemCount > 0 ? formatFCFA(cartSubtotal) : '0 FCFA'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {searchOpen && (
          <form
            onSubmit={handleSearchSubmit}
            className="pb-4 pt-1 animate-fadeIn flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
                }
                placeholder={
                  language === 'en'
                    ? 'Search suits, linen shirts, bazin boubous, loafers...'
                    : 'Rechercher costumes, chemises lin, boubous bazin, mocassins...'
                }
                className="w-full min-h-[44px] pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                autoFocus
                id="header-search-input"
              />
              {filters.searchQuery && (
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              id="header-search-submit"
            >
              {language === 'en' ? 'Search' : 'Rechercher'}
            </button>
          </form>
        )}
      </div>

    </header>
  );
};

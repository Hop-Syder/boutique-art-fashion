/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description Footer — Pied de page du storefront Art Fashion : réseaux sociaux, liens rapides, contact Cotonou, crédits Nexus Partners
 * @created 2026-08-19
 * @updated 2026-08-24
 * 🌐 nexus-partners.xyz
 * 📧 daoudaabassichristian@gmail.com
 */
// ──────────────────────────────────
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  MapPin,
  Phone,
  Clock,
  Facebook,
  Navigation,
  ExternalLink,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export const Footer: React.FC = () => {
  const { settings, setCurrentView, setFilters, language } = useStore();
  const [newsletterPhone, setNewsletterPhone] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const handleNavCategory = (catId: string) => {
    setFilters((prev) => ({ ...prev, category: catId, gender: 'Homme' }));
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'ART FASHION Rue 403 Zongo Scoa Gbeto Cotonou Benin'
  )}`;

  const whatsappCleanPhone = settings.whatsapp_number.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappCleanPhone}`;

  return (
    <footer className="relative bg-gradient-to-b from-slate-950 via-slate-950 to-black text-slate-300 pt-16 pb-28 lg:pb-12 overflow-hidden border-t border-slate-900">
      {/* Top Glowing Crimson Accent Line */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent shadow-[0_0_20px_rgba(220,38,38,0.8)]" />

      {/* Ambient Background Spotlights */}
      <div className="absolute top-0 left-1/6 w-[550px] h-[550px] bg-red-950/25 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/5 w-[500px] h-[500px] bg-slate-900/90 rounded-full blur-[120px] pointer-events-none" />

      {/* Fine Grid Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 z-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* 1. Brand Info & Quick Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3 cursor-pointer group w-fit" onClick={() => setCurrentView('home')}>
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl group-hover:border-red-600/50 group-hover:shadow-red-900/20 transition-all duration-300">
                <img
                  src="/logo-art-fashion.jpg"
                  alt="ART FASHION Logo"
                  className="h-11 w-auto object-contain"
                />
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md font-normal">
              {language === 'en'
                ? 'Maison ART FASHION — Luxury Ready-to-Wear for Men in Cotonou, Benin. Exceptional tailoring, 3-piece suits, Bazin boubous & leather shoes.'
                : 'Maison ART FASHION — Prêt-à-Porter de Luxe pour Homme à Cotonou, Bénin. Costumes sur-mesure, boubous Bazin riches & chaussures cuir d’exception.'}
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {/* WhatsApp Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-emerald-600/90 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-950/40 hover:scale-105 active:scale-95 cursor-pointer"
                id="footer-whatsapp-btn"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current text-white" />
                <span>WhatsApp</span>
              </a>

              {/* Facebook Button */}
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-blue-600/90 hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-950/40 hover:scale-105 active:scale-95 cursor-pointer"
                id="footer-facebook-btn"
              >
                <Facebook className="w-3.5 h-3.5 fill-current" />
                <span>{language === 'en' ? 'Facebook' : 'Facebook'}</span>
              </a>

              {/* Google Maps GPS Button */}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border border-slate-800 hover:border-red-900/60 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                id="footer-maps-btn"
              >
                <Navigation className="w-3.5 h-3.5 text-red-500" />
                <span>Google Maps GPS</span>
              </a>
            </div>
          </div>

          {/* 2. Quick Links / Rayons */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.9)]" />
              {language === 'en' ? 'Men Collections' : 'Univers Prêt-à-Porter'}
            </h4>
            <ul className="space-y-3 text-xs font-medium">
              {[
                { id: 'costumes', label_fr: 'Costumes 3 Pièces & Blazers', label_en: '3-Piece Suits & Blazers' },
                { id: 'chemises', label_fr: 'Chemises de Luxe & Lin Brodé', label_en: 'Luxury Shirts & Linen' },
                { id: 'boubous', label_fr: 'Grands Boubous Bazin Riches', label_en: 'Rich Bazin Boubous' },
                { id: 'chaussures', label_fr: 'Chaussures & Mocassins Cuir', label_en: 'Leather Shoes & Loafers' },
                { id: 'accessoires', label_fr: 'Accessoires & Maroquinerie', label_en: 'Accessories & Leather' },
              ].map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleNavCategory(cat.id)}
                    className="text-slate-400 hover:text-slate-100 hover:translate-x-1.5 transition-all duration-200 flex items-center gap-2 cursor-pointer text-left group"
                  >
                    <span className="text-[10px] text-red-500/60 group-hover:text-red-500 transition-colors">→</span>
                    <span className="group-hover:underline decoration-red-600/40 underline-offset-4">{language === 'en' ? cat.label_en : cat.label_fr}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Boutique & Atelier Contact Box */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.9)]" />
              {language === 'en' ? 'Boutique & Tailoring Workshop' : 'Boutique & Atelier'}
            </h4>
            <div className="p-5 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-slate-800/90 hover:border-slate-700/80 transition-all duration-300 space-y-3.5 text-xs text-slate-400 shadow-xl">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 group hover:text-slate-200 transition-colors"
              >
                <div className="p-2 rounded-xl bg-red-950/40 border border-red-900/40 text-red-500 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-slate-200 block font-semibold group-hover:text-red-400 transition-colors">
                    Rue 403, Zongo / Scoa Gbéto
                  </strong>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {language === 'en'
                      ? 'Near Jean-Paul II Avenue & Fayola Gallery, Cotonou'
                      : 'Près Avenue Jean-Paul II & Galerie Fayola, Cotonou'}
                  </span>
                </div>
              </a>

              <div className="flex items-center gap-3 pt-2 border-t border-slate-800/80">
                <div className="p-1.5 rounded-lg bg-slate-800/80 text-red-400 shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <a
                  href={`tel:${settings.phone_number.replace(/\s/g, '')}`}
                  className="text-slate-300 hover:text-red-400 font-mono text-[11px] transition-colors"
                >
                  {settings.phone_number}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-slate-800/80 text-emerald-400 shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <span className="text-slate-300 text-[11px]">
                  {language === 'en' ? settings.opening_hours_en : settings.opening_hours}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Bottom Credits Bar */}
        <div className="pt-8 border-t border-slate-900/90 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 ART FASHION Cotonou — Maison de Prêt-à-Porter Masculin.</p>
          <p className="flex items-center gap-1.5">
            <span>{language === 'en' ? 'Conceived & Developed by' : 'Conçu & Développé par'}</span>
            <a
              href="https://nexus-partners.xyz/"
              target="_blank"
              rel="noreferrer"
              className="text-slate-300 font-bold hover:text-red-400 transition-colors flex items-center gap-1 group"
            >
              <span>Nexus Partners | @HOP-SYDER</span>
              <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

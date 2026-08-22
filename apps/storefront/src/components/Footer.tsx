/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description Footer — Pied de page du storefront Art Fashion : réseaux sociaux, liens rapides, SEO local Cotonou, crédits Nexus Partners
 * @created 2026-08-19
 * @updated 2026-08-22
 * 🌐 nexus-partners.xyz
 * 📧 daoudaabassichristian@gmail.com
 */
// ──────────────────────────────────
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Heart,
  Facebook,
  ShieldCheck,
  Truck,
  Scissors,
  Sparkles,
  Send,
  CheckCircle2,
  Navigation,
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

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterPhone.trim()) {
      setNewsletterSubmitted(true);
      setTimeout(() => setNewsletterSubmitted(false), 4000);
      setNewsletterPhone('');
    }
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'ART FASHION Rue 403 Zongo Scoa Gbeto Cotonou Benin'
  )}`;

  return (
    <footer className="relative bg-slate-950 text-slate-300 pt-16 pb-28 lg:pb-12 overflow-hidden border-t border-slate-900">
      {/* Top Glowing Crimson Line */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-red-600/80 to-transparent shadow-[0_0_15px_rgba(220,38,38,0.7)]" />

      {/* Ambient Background Spotlights */}
      <div className="absolute top-0 left-10 w-[500px] h-[500px] bg-red-950/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-slate-900/80 rounded-full blur-[100px] pointer-events-none" />

      {/* Fine Grid Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 z-10">


        {/* 3. Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentView('home')}>
              <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md group-hover:border-red-900/60 transition-colors">
                <img
                  src="/logo-art-fashion.jpg"
                  alt="ART FASHION Logo"
                  className="h-10 w-auto object-contain"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2.5 bg-blue-600/90 hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
                id="footer-facebook-btn"
              >
                <Facebook className="w-3.5 h-3.5 fill-current" />
                <span>Facebook Officiel</span>
              </a>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border border-slate-800 hover:border-slate-700 shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
                id="footer-maps-btn"
              >
                <Navigation className="w-3.5 h-3.5 text-red-500" />
                <span>Google Maps GPS</span>
              </a>
            </div>
          </div>

          {/* Quick Links / Rayons */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              {language === 'en' ? 'Men Collections' : 'Univers Prêt-à-Porter'}
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              {[
                { id: 'costumes', label: 'Costumes 3 Pièces & Blazers' },
                { id: 'chemises', label: 'Chemises de Luxe & Lin Brodé' },
                { id: 'boubous', label: 'Grands Boubous Bazin Riches' },
                { id: 'chaussures', label: 'Chaussures & Mocassins Cuir' },
                { id: 'accessoires', label: 'Accessoires & Maroquinerie' },
              ].map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleNavCategory(cat.id)}
                    className="text-slate-400 hover:text-red-400 hover:translate-x-1 transition-all duration-200 flex items-center gap-2 cursor-pointer text-left group"
                  >
                    <span className="text-[10px] text-red-500/60 group-hover:text-red-500">→</span>
                    <span>{cat.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              {language === 'en' ? 'Boutique Location' : 'Boutique Physionomique'}
            </h4>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs text-slate-400 shadow-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block font-semibold">Rue 403, Zongo / Scoa Gbéto</strong>
                  <span className="text-[11px] text-slate-500">Près Avenue Jean-Paul II & Galerie Fayola, Cotonou</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 pt-1.5 border-t border-slate-800/80">
                <Phone className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="text-slate-300 font-mono text-[11px]">{settings.phone_number}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="text-slate-300 text-[11px]">
                  {language === 'en' ? settings.opening_hours_en : settings.opening_hours}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits, Microdata & SEO Text */}
        <div className="pt-8 border-t border-slate-900/90 space-y-6">

          {/* Adresse Microdata Schema.org — crawlable par Google */}
          <address
            itemScope
            itemType="http://schema.org/ClothingStore"
            className="not-italic text-xs text-slate-500 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
          >
            <div itemProp="name" className="hidden">ART FASHION Cotonou</div>
            <div
              itemProp="address"
              itemScope
              itemType="http://schema.org/PostalAddress"
              className="flex items-start gap-2"
            >
              <span className="text-red-600 text-[10px] mt-0.5">📍</span>
              <div>
                <span itemProp="streetAddress" className="text-slate-400 font-medium">Rue 403, Zongo / Scoa Gbéto</span>
                {' — '}
                <span itemProp="addressLocality" className="text-slate-400">Cotonou</span>
                {', '}
                <span itemProp="addressCountry" className="text-slate-400">Bénin</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-600 text-[10px]">📞</span>
              <a
                itemProp="telephone"
                href={`tel:${settings.phone_number.replace(/\s/g, '')}`}
                className="text-slate-400 hover:text-red-400 transition-colors font-mono"
              >
                {settings.phone_number}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-600 text-[10px]">🕐</span>
              <span itemProp="openingHours" content="Mo-Sa 09:00-20:00" className="text-slate-400">
                {language === 'en' ? settings.opening_hours_en : settings.opening_hours}
              </span>
            </div>
          </address>

          {/* Texte SEO riche — mots-clés Bénin / Afrique de l'Ouest */}
          <p className="text-[10px] text-slate-600 leading-relaxed max-w-4xl">
            {language === 'en'
              ? 'ART FASHION is the leading men\'s fashion boutique in Cotonou, Benin. Specialists in luxury ready-to-wear: Italian crossed suits, bazin boubous, linen shirts and leather moccasins. Home delivery across Cotonou, Abomey-Calavi and Porto-Novo.'
              : 'ART FASHION est la boutique mode homme de référence à Cotonou, Bénin. Spécialiste du prêt-à-porter masculin haut de gamme en Afrique de l\'Ouest : costumes croisés italiens, grands boubous Bazin Getzner, chemises lin brodé, mocassins cuir. Livraison à domicile Cotonou, Abomey-Calavi, Porto-Novo. Paiement à la livraison ou Mobile Money.'
            }
          </p>

          {/* Crédits */}
          <div className="flex flex-col md:flex-row items-center justify-start gap-3 text-[10px] text-slate-600">
            <p>© 2026 ART FASHION Cotonou — Maison de Prêt-à-Porter Masculin.</p>
            <p className="flex items-center gap-1">
              Développé par{' '}
              <a
                href="https://nexus-partners.xyz/"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 font-bold hover:underline"
              >
                Nexus Partners | @HOP-SYDER
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};


/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description Footer — Pied de page haute couture du storefront Art Fashion : Univers, Services d'excellence, Boutique Rue 403, Réseaux & Crédits Nexus Partners
 * @created 2026-08-19
 * @updated 2026-08-31
 * 🌐 nexus-partners.xyz
 * 📧 daoudaabassichristian@gmail.com
 */
// ──────────────────────────────────
import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  MapPin,
  Phone,
  Clock,
  Facebook,
  Instagram,
  Navigation,
  ExternalLink,
  ShieldCheck,
  Truck,
  Scissors,
  Sparkles,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export const Footer: React.FC = () => {
  const { settings, setCurrentView, setFilters, language } = useStore();
  const fr = language !== 'en';

  const handleNavCategory = (catId: string) => {
    setFilters((prev) => ({ ...prev, category: catId, gender: 'Homme' }));
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'ART FASHION Rue 403 Zongo Scoa Gbeto Cotonou Benin'
  )}`;

  const whatsappCleanPhone = settings.whatsapp_number.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappCleanPhone}?text=${encodeURIComponent(
    fr
      ? 'Bonjour Maison ART FASHION 👋 Je vous contacte depuis votre site officiel pour un renseignement.'
      : 'Hello Maison ART FASHION 👋 I am contacting you from your official website for inquiry.'
  )}`;

  const instagramUrl = settings.instagram_handle
    ? `https://instagram.com/${settings.instagram_handle.replace('@', '')}`
    : 'https://instagram.com/artfashion_cotonou';

  return (
    <footer className="relative bg-gradient-to-b from-slate-950 via-slate-950 to-black text-slate-300 pt-14 sm:pt-16 pb-32 lg:pb-12 overflow-hidden border-t border-slate-900">
      {/* Ligne lumineuse supérieure Crimson Accent */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent shadow-[0_0_20px_rgba(220,38,38,0.8)]" />

      {/* Halo lumineux d'ambiance */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-950/20 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-slate-900/80 rounded-full blur-[120px] pointer-events-none" />

      {/* Texture de fond */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-14 z-10">
        {/* Grille principale 4 colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* 1. Marque & Réseaux Sociaux */}
          <div className="lg:col-span-4 space-y-5">
            <div
              className="flex items-center gap-3 cursor-pointer group w-fit"
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl group-hover:border-red-600/50 group-hover:shadow-red-900/20 transition-all duration-300">
                <img
                  src="/logo-art-fashion.jpg"
                  alt="ART FASHION Logo"
                  className="h-10 sm:h-11 w-auto object-contain"
                />
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-normal">
              {fr
                ? 'Maison ART FASHION — Référence du Prêt-à-Porter Masculin de Luxe à Cotonou, Bénin. Costumes italiens, boubous d\'apparat, souliers en cuir d\'exception et maroquinerie de prestige.'
                : 'Maison ART FASHION — Landmark of Luxury Men\'s Ready-to-Wear in Cotonou, Benin. Italian tailored suits, royal boubous, fine leather shoes and luxury accessories.'}
            </p>

            {/* Boutons Réseaux Sociaux & Accès Rapide */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-emerald-600/90 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-950/40 hover:scale-105 active:scale-95 cursor-pointer"
                title="Contacter sur WhatsApp"
                id="footer-whatsapp-btn"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current text-white" />
                <span>WhatsApp</span>
              </a>

              <a
                href={settings.facebook_url || 'https://www.facebook.com/artfashionbenin/'}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-blue-600/90 hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-950/40 hover:scale-105 active:scale-95 cursor-pointer"
                title="Page Facebook Officielle"
                id="footer-facebook-btn"
              >
                <Facebook className="w-3.5 h-3.5 fill-current" />
                <span>Facebook</span>
              </a>

              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:opacity-90 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                title="Instagram Officiel"
                id="footer-instagram-btn"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* 2. Univers & Collections */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.9)]" />
              {fr ? 'Univers & Rayons' : 'Menswear Universes'}
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              {[
                { id: 'elegance-ceremonie', label_fr: 'Élégance & Cérémonie', label_en: 'Elegance & Ceremony' },
                { id: 'casual-quotidien', label_fr: 'Casual & Quotidien', label_en: 'Casual & Everyday' },
                { id: 'saisonnier-exterieur', label_fr: 'Saisonnier & Extérieur', label_en: 'Seasonal & Outerwear' },
                { id: 'confort-detente', label_fr: 'Confort & Détente', label_en: 'Comfort & Loungewear' },
                { id: 'chaussures-souliers', label_fr: 'Chaussures & Souliers', label_en: 'Shoes & Footwear' },
                { id: 'prestige-exotique', label_fr: 'Prestige (Cuirs Exotiques)', label_en: 'Prestige (Exotic Leathers)' },
                { id: 'accessoires-maroquinerie', label_fr: 'Accessoires & Montres', label_en: 'Accessories & Watches' },
              ].map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleNavCategory(cat.id)}
                    className="text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center gap-2 cursor-pointer text-left group w-full py-0.5"
                  >
                    <span className="group-hover:underline decoration-red-600/40 underline-offset-4">
                      {fr ? cat.label_fr : cat.label_en}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Engagements & Services Privés */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.9)]" />
              {fr ? 'Services Maison' : 'House Services'}
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <div>
                  <strong className="text-slate-200 block font-semibold text-[11px]">
                    {fr ? 'Livraison Express' : 'Express Delivery'}
                  </strong>
                  <span className="text-[10px] text-slate-400">
                    {fr ? 'Cotonou, Calavi & tout le Bénin' : 'Cotonou, Calavi & all Benin'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div>
                  <strong className="text-slate-200 block font-semibold text-[11px]">
                    {fr ? 'Atelier & Sur-Mesure' : 'Custom Tailoring'}
                  </strong>
                  <span className="text-[10px] text-slate-400">
                    {fr ? 'Ajustements & retouches Rue 403' : 'Alterations at Rue 403'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div>
                  <strong className="text-slate-200 block font-semibold text-[11px]">
                    {fr ? 'Paiement Sécurisé' : 'Secure Payment'}
                  </strong>
                  <span className="text-[10px] text-slate-400">
                    {fr ? 'Espèces ou Mobile Money' : 'Cash or Mobile Money'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div>
                  <strong className="text-slate-200 block font-semibold text-[11px]">
                    {fr ? 'Conseiller Privé' : 'Private Advisor'}
                  </strong>
                  <span className="text-[10px] text-slate-400">
                    {fr ? 'Accompagnement WhatsApp 7j/7' : 'WhatsApp guidance 7d/7'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Boutique & Flagship Rue 403 Contact Box */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.9)]" />
              {fr ? 'Boutique & Atelier' : 'Flagship Boutique'}
            </h4>
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 hover:border-slate-700 transition-all duration-300 space-y-3.5 text-xs text-slate-400 shadow-xl">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 group hover:text-slate-200 transition-colors"
              >
                <div className="p-2 rounded-xl bg-red-950/50 border border-red-900/50 text-red-500 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-slate-200 block font-semibold group-hover:text-red-400 transition-colors text-xs">
                    Rue 403, Zongo / Scoa Gbéto
                  </strong>
                  <span className="text-[11px] text-slate-400 block mt-0.5 leading-snug">
                    {fr
                      ? 'Près Avenue Jean-Paul II & Galerie Fayola, Cotonou'
                      : 'Near Jean-Paul II Avenue & Fayola Gallery, Cotonou'}
                  </span>
                </div>
              </a>

              <div className="flex items-center gap-3 pt-2.5 border-t border-slate-800/80">
                <div className="p-1.5 rounded-lg bg-slate-800/80 text-red-400 shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <a
                  href={`tel:${settings.phone_number.replace(/\s/g, '')}`}
                  className="text-slate-300 hover:text-red-400 font-mono text-[11px] transition-colors font-semibold"
                >
                  {settings.phone_number}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-slate-800/80 text-emerald-400 shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <span className="text-slate-300 text-[11px] font-medium">
                  {fr
                    ? (settings.opening_hours || 'Lundi - Samedi : 09h00 - 22h00')
                    : (settings.opening_hours_en || 'Monday - Saturday: 09:00 AM - 10:00 PM')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Barre de crédits inférieure */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 text-center md:text-left">
          <p>© 2026 ART FASHION Cotonou — Maison de Prêt-à-Porter Masculin de Luxe.</p>
          <p className="flex items-center justify-center gap-1.5">
            <span>{fr ? 'Conçu & Développé par' : 'Conceived & Developed by'}</span>
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

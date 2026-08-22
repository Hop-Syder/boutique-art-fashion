/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description HeroSection — Section héro principale du storefront Art Fashion : titre, description, CTAs WhatsApp/Maps/Collection, badges de garanties
 * @created 2026-08-19
 * @updated 2026-08-22
 * 🌐 nexus-partners.xyz
 * 📧 daoudaabassichristian@gmail.com
 */
// ──────────────────────────────────
import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export const HeroSection: React.FC = () => {
  const { setCurrentView, setFilters, settings, sectionsConfig, language } = useStore();
  const hero = sectionsConfig.hero;

  const handleExplore = () => {
    setFilters((prev) => ({ ...prev, category: 'all', gender: 'all' }));
    setCurrentView('catalog');
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  const whatsappDirectUrl = `https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(
    language === 'en'
      ? 'Hello ART FASHION Cotonou 👋 I would like to inquire about your men suit & shirt collection.'
      : 'Bonjour ART FASHION Cotonou 👋 Je souhaite me renseigner sur la collection de costumes et chemises sur-mesure.'
  )}`;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'ART FASHION Rue 403 Zongo Scoa Gbeto Cotonou Benin'
  )}`;

  const renderStyledTitle = (titleText: string) => {
    if (titleText.includes('ART FASHION')) {
      const parts = titleText.split('ART FASHION');
      const cleanSubTitle = parts[1].replace(/^[—\s-]+/, '');
      return (
        <>
          {parts[0]}
          <span className="font-cloister-black text-slate-950 font-normal tracking-normal inline-block">
            Art Fashion
          </span>
          <br />
          <span className="inline-block mt-1 sm:mt-2">
            {cleanSubTitle}
          </span>
        </>
      );
    }
    return titleText;
  };

  const currentTitle = language === 'en' ? hero.title_en || hero.title : hero.title;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100/60 py-8 sm:py-14 border-b border-slate-200/80">
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-900/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal text-slate-900 leading-[1.15] tracking-tight">
              {renderStyledTitle(currentTitle)}
            </h1>

            {/* Description avec dernière phrase en gras */}
            {(() => {
              const raw = language === 'en' ? hero.description_en || hero.description : hero.description;
              const lastDot = raw.lastIndexOf('.', raw.length - 2); // dernier point avant la fin
              const body   = lastDot > 0 ? raw.slice(0, lastDot + 1) : raw;
              const tail   = lastDot > 0 ? raw.slice(lastDot + 1).trim() : '';
              return (
                <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  {body}{tail && <> <strong className="text-slate-900 font-semibold">{tail}</strong></>}
                </p>
              );
            })()}

            {/* CTAs */}
            <div className="pt-2">
              <div className="grid grid-cols-2 sm:flex sm:flex-row items-center justify-center lg:justify-start gap-3">
                <button
                  onClick={handleExplore}
                  className="col-span-1 min-h-[48px] px-4 sm:px-7 py-3 bg-slate-950 text-white rounded-xl font-bold text-xs sm:text-base hover:bg-red-700 transition-all shadow-sm flex items-center justify-center gap-1.5 sm:gap-2 group cursor-pointer focus:ring-2 focus:ring-red-600"
                  id="hero-explore-catalog-btn"
                >
                  <span>{language === 'en' ? hero.cta_primary_text_en : hero.cta_primary_text}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>

                <a
                  href={whatsappDirectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="col-span-1 min-h-[48px] px-4 sm:px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-xs sm:text-base transition-all shadow-sm flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer focus:ring-2 focus:ring-emerald-500"
                  id="hero-whatsapp-direct-btn"
                >
                  <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span>{language === 'en' ? 'WhatsApp Advisor' : 'Conseiller VIP'}</span>
                </a>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="col-span-2 sm:col-span-1 w-full sm:w-auto min-h-[48px] px-4 sm:px-5 py-3 bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 hover:border-red-400 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs group"
                  id="hero-maps-directions-btn"
                >
                  <img
                    src="/map.png"
                    alt="Google Maps Rue 403"
                    className="w-5 h-5 rounded-md object-cover shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <span>{language === 'en' ? 'Google Maps Directions' : 'Accès Google Maps'}</span>
                </a>
              </div>
            </div>

            {/* Value Guarantees */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-3 text-left">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {language === 'en' ? 'Boutique' : 'Boutique'}
                  </h4>
                  <p className="text-[11px] text-slate-500">{language === 'en' ? 'Zongo / Cotonou' : 'Zongo / Cotonou'}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {language === 'en' ? 'Fast Delivery' : 'Livraison Express'}
                  </h4>
                  <p className="text-[11px] text-slate-500">Cotonou & Calavi</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {language === 'en' ? 'Safe Payment' : 'Paiement Sûr'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {language === 'en' ? 'Cash / Mobile Money' : 'À la livraison / MoMo'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-slate-900 group">
                <img
                  src={hero.primary_image}
                  alt="ART FASHION Men Luxury Suit"
                  className="w-full h-[400px] sm:h-[460px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs font-bold uppercase tracking-widest text-red-400">
                    {language === 'en' ? 'Signature Piece' : 'Pièce Signature'}
                  </span>
                  <h3 className="text-xl font-serif font-semibold mt-1">
                    {language === 'en'
                      ? '"Zongo Prestige" Double-Breasted Suit'
                      : 'Costume Croisé "Zongo Prestige" Noir & Or'}
                  </h3>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
                    <span className="text-lg font-bold text-red-300">185 000 FCFA</span>
                    <span className="text-xs bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-white font-medium">
                      Tailles 48 • 50 • 52 • 54
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1 */}
              <div className="absolute -bottom-4 -left-4 sm:-left-6 bg-white p-3 sm:p-4 rounded-xl shadow-lg border border-slate-200 flex items-center gap-3 animate-bounce-subtle">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                  <WhatsAppIcon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {language === 'en' ? 'WhatsApp Direct Order' : 'Réserver sur WhatsApp'}
                  </p>
                </div>
              </div>

              {/* Floating Badge 2 */}
              <div className="hidden sm:flex absolute -top-4 -right-4 bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-800 items-center gap-2.5">
                <span className="text-lg">✨</span>
                <div>
                  <p className="text-xs font-bold text-red-400">
                    {language === 'en' ? "Men's Luxury Ready-to-Wear" : 'Prêt-à-Porter Masculin'}
                  </p>
                  <p className="text-[10px] text-slate-300">
                    {language === 'en' ? '3-Piece Suit' : 'Costume 3 Pièces'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description AboutView — Page À Propos ART FASHION Cotonou : Notre Maison, Vision, Engagements, Savoir-Faire, Carte & Carrousel Infini Preuves de Livraisons
 * @created 2026-08-19
 * @updated 2026-08-22
 * 🌐 nexus-partners.xyz
 * 📧 daoudaabassichristian@gmail.com
 */
// ──────────────────────────────────────────────────────────────────────

import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  MapPin,
  Navigation,
  Phone,
  Facebook,
  Award,
  Scissors,
  Truck,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  PackageCheck,
  Star,
  Sparkles,
  Crown,
  Eye,
  HeartHandshake,
  Clock,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('ART FASHION Rue 403 Zongo Scoa Gbeto Cotonou Benin');

const ICON_MAP: Record<string, React.FC<any>> = {
  Award,
  Scissors,
  Crown,
  HeartHandshake,
  Truck,
  ShieldCheck,
  CheckCircle2,
  PackageCheck,
  Star,
  Sparkles,
};

export const AboutView: React.FC = () => {
  const { settings, sectionsConfig, language, setCurrentView } = useStore();
  const about = sectionsConfig.about;
  const fr = language !== 'en';

  const waUrl = `https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(
    fr
      ? 'Bonjour ART FASHION Cotonou 👋 Je souhaite des informations sur votre maison et vos créations.'
      : 'Hello ART FASHION Cotonou 👋 I would like more information about your house and collections.'
  )}`;

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">

      {/* ── 1. HERO : NOTRE MAISON (Harmonisé avec HeroSection) ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100/60 py-10 sm:py-16 border-b border-slate-200/80">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-900/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Colonne Gauche : Histoire de la Maison */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950 text-red-400 text-[11px] font-bold uppercase tracking-widest border border-red-900/60 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-red-500" />
                <span>{fr ? 'Maison de Haute Élégance Masculine' : 'House of Men’s High Elegance'}</span>
              </div>

              <div className="space-y-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mb-4">
                  {fr ? about.hero_title : about.hero_title_en}
                </h1>
                <p>
                  {fr ? about.hero_subtitle : about.hero_subtitle_en}
                </p>
              </div>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <button
                  onClick={() => {
                    setCurrentView('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="min-h-[48px] px-6 py-3 bg-slate-950 text-white rounded-xl font-bold text-xs sm:text-base hover:bg-red-700 transition-all shadow-sm flex items-center justify-center gap-2 group cursor-pointer focus:ring-2 focus:ring-red-600"
                >
                  <span>{fr ? 'Découvrir la Collection' : 'Explore the Collection'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[48px] px-5 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-xs sm:text-base transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  <span>{fr ? 'Conseiller Privé' : 'Private Advisor'}</span>
                </a>

                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[48px] px-4 sm:px-5 py-3 bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 hover:border-red-400 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <Navigation className="w-4 h-4 text-red-600" />
                  <span>{fr ? 'Itinéraire Rue 403' : 'Rue 403 Map'}</span>
                </a>
              </div>
            </div>

            {/* Colonne Droite : Showcase Visuel */}
            {about.hero_image && (
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group">
                    <img
                      src={about.hero_image}
                      alt="ART FASHION Maison Cotonou"
                      className="w-full h-[420px] sm:h-[480px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                      <span className="text-xs font-bold uppercase tracking-widest text-red-400">
                        Rue 403 · Zongo Cotonou
                      </span>
                      <h3 className="text-xl font-serif font-semibold mt-1">
                        L’Atelier & Showroom ART FASHION
                      </h3>
                      <p className="text-xs text-slate-300 mt-1">
                        Un cadre intimiste dédié à l’essayage et au conseil sur-mesure.
                      </p>
                    </div>
                  </div>

                  {/* Badge Flottant Signature */}
                  <div className="absolute -bottom-4 -left-4 sm:-left-6 bg-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 border border-red-100">
                      <Crown className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {fr ? 'Haute Élégance Homme' : 'Men’s High Elegance'}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {fr ? 'Coupes Italiennes & Bazin' : 'Italian & Bazin Craft'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 2. NOTRE VISION & CITATION D'EXCEPTION ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-slate-950 text-white rounded-3xl p-8 sm:p-12 overflow-hidden border border-slate-800 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Vision */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-red-400 text-xs font-bold uppercase tracking-wider border border-white/10">
                <Eye className="w-3.5 h-3.5 text-red-500" />
                <span>{fr ? 'Notre Vision' : 'Our Vision'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-medium leading-snug">
                {fr
                  ? 'Faire de chaque client un ambassadeur de l’élégance masculine africaine.'
                  : 'Empowering every client as an ambassador of African masculine elegance.'}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                {fr
                  ? 'En lui offrant des pièces qui incarnent le prestige, la confiance et la réussite. Chez ART FASHION, le véritable luxe ne se mesure pas seulement à ce que l’on porte, mais à la manière dont il révèle votre personnalité et votre grandeur.'
                  : 'By offering garments that embody prestige, confidence, and achievement. At ART FASHION, true luxury is not just what you wear, but how it reveals your character and success.'}
              </p>
            </div>

            {/* Citation Signature Encadrée */}
            <div className="lg:col-span-6 bg-white/[0.04] backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 flex flex-col justify-center text-center space-y-3">
              <span className="text-3xl text-red-500 font-serif leading-none">“</span>
              <blockquote className="text-lg sm:text-xl font-serif font-normal italic text-slate-100 leading-relaxed">
                {fr
                  ? 'L’élégance est la signature silencieuse des hommes d’exception.'
                  : 'Elegance is the silent signature of exceptional gentlemen.'}
              </blockquote>
              <div className="pt-2 border-t border-white/10">
                <p className="text-xs font-bold text-red-400 tracking-widest uppercase">
                  Maison ART FASHION — Cotonou
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. SAVOIR-FAIRE & ENGAGEMENTS D'EXCELLENCE ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {about.craftsmanship_image && (
            <div className="order-2 lg:order-1 relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={about.craftsmanship_image}
                alt="Savoir-Faire"
                className="w-full h-[400px] object-cover"
              />
            </div>
          )}
          <div className="order-1 lg:order-2 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl font-serif font-normal text-slate-950 tracking-tight leading-tight">
                {fr ? about.craftsmanship_title : about.craftsmanship_title_en}
              </h2>
              <div className="w-12 h-0.5 bg-gradient-to-r from-red-600 to-red-400 rounded-full" />
            </div>
            <p className="text-slate-600 leading-relaxed">
              {fr ? about.craftsmanship_text : about.craftsmanship_text_en}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {about.engagements.map((item, idx) => {
            const Icon = ICON_MAP[item.icon] || Star;
            return (
              <div
                key={item.id || idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-red-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-red-50 text-slate-800 group-hover:text-red-600 border border-slate-200 group-hover:border-red-200 flex items-center justify-center mb-4 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {fr ? item.title : item.title_en}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {fr ? item.description : item.description_en}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-red-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{fr ? 'Garanti par la Maison' : 'Guaranteed by House'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 4. CHIFFRES CLÉS DE CONFIANCE ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center divide-x-0 sm:divide-x divide-slate-800">
            {about.stats.map((stat) => (
              <div key={stat.id} className="p-2">
                <p className="text-3xl sm:text-5xl font-serif font-normal text-red-500 tracking-tight">{stat.value}</p>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 font-medium">{fr ? stat.label : stat.label_en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. CARROUSEL INFINI : PREUVES DE LIVRAISONS CLIENTS ── */}
      {about.deliveries.length > 0 && (
        <section className="bg-slate-950 text-white py-16 lg:py-20 overflow-hidden border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-inner">
                  <PackageCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                  <span>{fr ? 'Preuves Réelles · 100% Livraisons Réussies' : 'Real Proof · 100% Completed Deliveries'}</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-serif font-medium text-white tracking-tight">
                  {fr ? 'Nos clients reçoivent à domicile' : 'Delivered directly to our clients'}
                </h2>
                <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                  {fr
                    ? 'Chaque jour, hommes d’affaires et personnalités de Cotonou, Calavi et Porto-Novo reçoivent leurs tenues d’exception avec essayage à domicile et paiement à la livraison.'
                    : 'Every day, business executives and VIPs across Cotonou, Calavi, and Porto-Novo receive their luxury attire with home fitting and cash/MoMo on delivery.'}
                </p>
              </div>

              <button
                onClick={() => {
                  setCurrentView('catalog');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm self-start md:self-auto"
              >
                <span>{fr ? 'Voir la collection' : 'Explore Collection'}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Carrousel Loop Marquee */}
          <div className="relative w-full overflow-hidden py-4">
            <div className="animate-marquee-left flex gap-6 px-4">
              {[...about.deliveries, ...about.deliveries, ...about.deliveries].map((d, i) => (
                <div
                  key={`${d.id}-${i}`}
                  className="w-[300px] sm:w-[360px] shrink-0 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-950/30 transition-all duration-300 group select-none"
                >
                  <div className="relative h-56 sm:h-64 overflow-hidden bg-slate-950">
                    <img
                      src={d.image}
                      alt={`${d.article} livré à ${d.location}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg border border-emerald-400/30">
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{fr ? 'Livré & Conforme' : 'Delivered & Approved'}</span>
                    </span>

                    <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-slate-200 text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border border-white/10">
                      ⚡ {d.time}
                    </span>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-xs font-semibold text-red-400 flex items-center gap-1.5 mb-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>{d.location}</span>
                      </p>
                      <h3 className="text-sm sm:text-base font-serif font-bold text-white leading-tight">
                        {d.article}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5 bg-slate-900/90 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium truncate max-w-[200px]">{d.client}</span>
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{d.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-800 text-[11px] text-emerald-400 font-medium">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span>{d.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 text-center mt-6">
            <p className="text-xs text-slate-500">
              {fr
                ? '💡 Survolez pour figer le défilement · Essayage et ajustements sur place par notre coursier à Cotonou & Calavi.'
                : '💡 Hover to pause scrolling · In-home fitting and alterations provided upon delivery in Benin.'}
            </p>
          </div>
        </section>
      )}

      {/* ── 6. ACCÈS BOUTIQUE & PLAN GOOGLE MAPS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

            {/* Infos Boutique */}
            <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">

                <h2 className="text-2xl sm:text-4xl font-serif font-normal text-white">
                  {fr ? 'Venez nous rendre visite Rue 403' : 'Visit our Flagship on Rue 403'}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  {fr
                    ? 'Située au cœur du quartier historique Zongo / Scoa Gbéto à Cotonou, notre boutique vous accueille dans un cadre feutré avec salon privé pour vos essayages.'
                    : 'Located in the historic Zongo / Scoa Gbeto district in Cotonou, our boutique welcomes you in a refined setting with private fitting lounges.'}
                </p>

                <div className="space-y-3 pt-2 text-sm text-slate-300">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                    <Clock className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{fr ? 'Du Lundi au Samedi : 8h30 – 19h30' : 'Monday to Saturday: 8:30 AM – 7:30 PM'}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{settings.phone} / {settings.whatsapp_number}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[44px] inline-flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md"
                >
                  <Navigation className="w-4 h-4" />
                  <span>{fr ? 'Ouvrir dans Google Maps' : 'Open Google Maps'}</span>
                </a>
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[44px] inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/15 transition-all cursor-pointer"
                >
                  <Facebook className="w-4 h-4 fill-current" />
                  <span>Facebook</span>
                </a>
              </div>
            </div>

            {/* Google Maps iFrame */}
            <div className="lg:col-span-6 relative min-h-[350px] lg:min-h-[460px] bg-slate-950">
              <iframe
                title="Plan ART FASHION Cotonou"
                src="https://maps.google.com/maps?q=ART+FASHION+Rue+403+Zongo+Scoa+Gbeto+Cotonou+Benin&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 absolute inset-0"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

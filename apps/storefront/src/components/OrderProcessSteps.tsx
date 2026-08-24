/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description OrderProcessSteps — Guide interactif des 6 étapes de commande WhatsApp avec support bilingue FR/EN
 * @created 2026-08-19
 * @updated 2026-08-23
 * 🌐 nexus-partners.xyz
 * 📧 daoudaabassichristian@gmail.com
 */
// ──────────────────────────────────
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  PackageCheck,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export interface ProcessStep {
  num: string;
  title_fr: string;
  title_en: string;
  desc_fr: string;
  desc_en: string;
  icon: React.FC<{ className?: string }>;
}

export const ORDER_STEPS: ProcessStep[] = [
  {
    num: '01',
    title_fr: 'Composez votre panier',
    title_en: 'Build your cart',
    desc_fr: 'Choisissez vos modèles, tailles et couleurs disponibles sur la boutique.',
    desc_en: 'Select your preferred styles, sizes, and colors directly from our catalog.',
    icon: ShoppingBag,
  },
  {
    num: '02',
    title_fr: 'Précisez votre adresse',
    title_en: 'Enter delivery location',
    desc_fr: 'Indiquez votre quartier et repère (Cotonou, Calavi, Porto-Novo, etc.).',
    desc_en: 'Specify your district and landmark (Cotonou, Calavi, Porto-Novo, etc.).',
    icon: Truck,
  },
  {
    num: '03',
    title_fr: 'Envoi sur WhatsApp',
    title_en: 'Submit via WhatsApp',
    desc_fr: 'Un message récapitulatif est automatiquement généré et transmis au conseiller.',
    desc_en: 'A pre-formatted order summary is generated and sent to our team.',
    icon: WhatsAppIcon,
  },
  {
    num: '04',
    title_fr: 'Validation immédiate',
    title_en: 'Instant confirmation',
    desc_fr: 'Le conseiller vérifie le stock disponible et valide la préparation de commande.',
    desc_en: 'Our advisor checks inventory and starts preparing your custom order.',
    icon: CheckCircle2,
  },
  {
    num: '05',
    title_fr: 'Livraison Express',
    title_en: 'Express Delivery',
    desc_fr: 'Expédition rapide et sécurisée directement à votre domicile ou bureau.',
    desc_en: 'Swift and secure door-to-door delivery to your home or office.',
    icon: PackageCheck,
  },
  {
    num: '06',
    title_fr: 'Paiement Réception',
    title_en: 'Pay upon Delivery',
    desc_fr: 'Essayez votre tenue et réglez en espèces, MTN Mobile Money ou Moov Money.',
    desc_en: 'Try on your outfit and pay with Cash, MTN Mobile Money or Moov Money.',
    icon: ShieldCheck,
  },
];

export const OrderProcessSteps: React.FC = () => {
  const { language } = useStore();
  const [mobilePage, setMobilePage] = useState<number>(0);

  const totalMobilePages = 3;

  const handleNextMobilePage = () => {
    setMobilePage((prev) => (prev + 1) % totalMobilePages);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-12 shadow-2xl border border-slate-800 relative overflow-hidden">
        {/* Ambient Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-8 sm:mb-12 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-serif font-medium text-white tracking-tight">
            {language === 'en' ? 'How to Place Your Order?' : 'Comment passer votre commande ?'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            {language === 'en'
              ? 'A smooth shopping journey combining the clarity of a digital catalog with the instant responsiveness of WhatsApp.'
              : 'Un parcours 100% pensé pour les habitudes béninoises, combinant la clarté du catalogue digital et la réactivité de WhatsApp.'}
          </p>
        </div>

        {/* DESKTOP VIEW: Grid with all 6 cards visible at once */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 relative z-10">
          {ORDER_STEPS.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={idx}
                className="group/step relative bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/10 hover:border-red-500/50 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:bg-white/[0.12] hover:-translate-y-1 transition-all duration-300 backdrop-blur-xs shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-red-700 text-white font-mono font-bold text-xs flex items-center justify-center shadow-md ring-2 ring-white/15">
                    {st.num}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-red-400 group-hover/step:bg-red-600/20 group-hover/step:text-red-300 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white leading-snug group-hover/step:text-red-300 transition-colors">
                    {language === 'en' ? st.title_en : st.title_fr}
                  </h4>
                  <p className="text-[11px] text-slate-300/80 mt-1.5 leading-relaxed">
                    {language === 'en' ? st.desc_en : st.desc_fr}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* MOBILE VIEW: Interactive 2-card pagination carousel */}
        <div className="md:hidden space-y-5 relative z-10">
          {/* Mobile Cards Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ORDER_STEPS.slice(mobilePage * 2, mobilePage * 2 + 2).map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={`mob-${st.num}`}
                  className="bg-gradient-to-b from-white/[0.10] to-white/[0.04] border border-white/15 p-5 rounded-2xl flex flex-col justify-between space-y-3.5 shadow-xl transition-all animate-fadeIn"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-white font-mono font-bold text-xs flex items-center justify-center shadow-md ring-2 ring-white/20">
                      {st.num}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white leading-snug">
                      {language === 'en' ? st.title_en : st.title_fr}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      {language === 'en' ? st.desc_en : st.desc_fr}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Bottom Navigation Controls */}
          <div className="flex flex-col items-center gap-3 pt-2">
            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-2">
              {[0, 1, 2].map((pageIdx) => (
                <button
                  key={pageIdx}
                  onClick={() => setMobilePage(pageIdx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    mobilePage === pageIdx
                      ? 'w-8 bg-red-500 shadow-sm'
                      : 'w-2 bg-slate-700 hover:bg-slate-600'
                  }`}
                  aria-label={`Go to step page ${pageIdx + 1}`}
                />
              ))}
            </div>

            {/* Interactive Bottom Action Button */}
            <button
              onClick={handleNextMobilePage}
              className="w-full py-3.5 px-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer border border-red-500/40"
              id="order-steps-next-btn-mobile"
            >
              <span>
                {language === 'en'
                  ? mobilePage === 0
                    ? 'View next steps 3 & 4'
                    : mobilePage === 1
                    ? 'View next steps 5 & 6'
                    : 'Back to steps 1 & 2'
                  : mobilePage === 0
                  ? 'Voir les étapes suivantes 3 & 4'
                  : mobilePage === 1
                  ? 'Voir les étapes suivantes 5 & 6'
                  : 'Revenir aux étapes 1 & 2'}
              </span>
              <ChevronDown className="w-4 h-4 text-white animate-bounce" />
            </button>

            <span className="text-[11px] text-slate-400 font-medium">
              {language === 'en'
                ? `Steps ${mobilePage * 2 + 1} & ${mobilePage * 2 + 2} of 6`
                : `Étape ${mobilePage * 2 + 1} & ${mobilePage * 2 + 2} sur 6`}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

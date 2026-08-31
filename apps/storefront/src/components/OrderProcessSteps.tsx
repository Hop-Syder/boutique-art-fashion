/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description OrderProcessSteps — Guide des 6 étapes de commande WhatsApp en liste verticale numérotée (Étape 1, 2, …), bilingue FR/EN
 * @created 2026-08-19
 * @updated 2026-08-31
 * 🌐 nexus-partners.xyz
 * 📧 daoudaabassichristian@gmail.com
 */
// ──────────────────────────────────
import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  PackageCheck,
  ShieldCheck,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface ProcessStep {
  num: string;
  title_fr: string;
  title_en: string;
  desc_fr: string;
  desc_en: string;
  icon: React.FC<{ className?: string }>;
}

const ORDER_STEPS: ProcessStep[] = [
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
  const fr = language !== 'en';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-12 shadow-2xl border border-slate-800 relative overflow-hidden">
        {/* Ambient Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-8 sm:mb-12 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-serif font-medium text-white tracking-tight">
            {fr ? 'Comment passer votre commande ?' : 'How to Place Your Order?'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            {fr
              ? 'Un parcours 100% pensé pour les habitudes béninoises, combinant la clarté du catalogue digital et la réactivité de WhatsApp.'
              : 'A smooth shopping journey combining the clarity of a digital catalog with the instant responsiveness of WhatsApp.'}
          </p>
        </div>

        {/* Liste verticale numérotée (Étape 1, 2, …) — style timeline */}
        <ol className="relative max-w-3xl mx-auto space-y-4 sm:space-y-5 z-10">
          {ORDER_STEPS.map((st, idx) => {
            const Icon = st.icon;
            const isLast = idx === ORDER_STEPS.length - 1;
            return (
              <li key={st.num} className="relative flex gap-4 sm:gap-5">
                {/* Colonne numéro + trait de liaison */}
                <div className="flex flex-col items-center shrink-0">
                  <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 text-white font-mono font-bold text-sm flex items-center justify-center shadow-md ring-2 ring-white/15 z-10">
                    {st.num}
                  </span>
                  {!isLast && (
                    <span className="w-px flex-1 min-h-6 bg-gradient-to-b from-red-500/40 to-white/5 my-1" />
                  )}
                </div>

                {/* Carte de l'étape */}
                <div className="flex-1 mb-1 bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/10 hover:border-red-500/50 rounded-2xl p-4 sm:p-5 flex items-start gap-4 hover:bg-white/[0.12] transition-all duration-300 backdrop-blur-xs shadow-lg">
                  <div className="flex-1">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-red-400">
                      {fr ? `Étape ${idx + 1}` : `Step ${idx + 1}`}
                    </span>
                    <h4 className="font-bold text-sm sm:text-base text-white leading-snug mt-0.5">
                      {fr ? st.title_fr : st.title_en}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300/80 mt-1.5 leading-relaxed">
                      {fr ? st.desc_fr : st.desc_en}
                    </p>
                  </div>
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-white/10 flex items-center justify-center text-red-400">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

      </div>
    </section>
  );
};

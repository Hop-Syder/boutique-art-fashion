/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description OrderProcessSteps — Les 6 étapes de commande WhatsApp en liste simple et fluide (Étape N + titre), bilingue FR/EN
 * @created 2026-08-19
 * @updated 2026-08-31
 * 🌐 nexus-partners.xyz
 * 📧 daoudaabassichristian@gmail.com
 */
// ──────────────────────────────────
import React from 'react';
import { useStore } from '../context/StoreContext';

interface ProcessStep {
  title_fr: string;
  title_en: string;
}

const ORDER_STEPS: ProcessStep[] = [
  { title_fr: 'Composez votre panier', title_en: 'Build your cart' },
  { title_fr: 'Précisez votre adresse', title_en: 'Enter delivery location' },
  { title_fr: 'Envoi sur WhatsApp', title_en: 'Submit via WhatsApp' },
  { title_fr: 'Validation immédiate', title_en: 'Instant confirmation' },
  { title_fr: 'Livraison Express', title_en: 'Express Delivery' },
  { title_fr: 'Paiement à la réception', title_en: 'Pay upon Delivery' },
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
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-8 sm:mb-10 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-serif font-medium text-white tracking-tight">
            {fr ? 'Comment passer votre commande ?' : 'How to Place Your Order?'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            {fr
              ? 'Un parcours simple et fluide, de la boutique à la livraison.'
              : 'A simple, smooth journey from catalog to doorstep.'}
          </p>
        </div>

        {/* Liste simple : Étape N + titre */}
        <ol className="max-w-2xl mx-auto space-y-3 relative z-10">
          {ORDER_STEPS.map((st, idx) => (
            <li
              key={idx}
              className="flex items-center gap-4 bg-white/[0.05] border border-white/10 rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 hover:bg-white/[0.1] hover:border-red-500/40 transition-all duration-300"
            >
              <span className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white font-mono font-bold text-sm flex items-center justify-center shadow ring-2 ring-white/15">
                {idx + 1}
              </span>
              <div className="min-w-0">
                <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-red-400">
                  {fr ? `Étape ${idx + 1}` : `Step ${idx + 1}`}
                </span>
                <h4 className="font-semibold text-sm sm:text-base text-white leading-snug">
                  {fr ? st.title_fr : st.title_en}
                </h4>
              </div>
            </li>
          ))}
        </ol>

      </div>
    </section>
  );
};

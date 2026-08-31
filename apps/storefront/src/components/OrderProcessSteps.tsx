/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description OrderProcessSteps — Les 6 étapes de commande en liste texte simple (Étape N + titre), sans carte ni couleur, bilingue FR/EN
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
      <div className="bg-slate-100 text-slate-900 rounded-3xl p-6 sm:p-12 shadow-sm border border-slate-200">
        {/* En-tête */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-4xl font-serif font-medium text-slate-900 tracking-tight">
            {fr ? 'Comment passer votre commande ?' : 'How to Place Your Order?'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
            {fr
              ? 'Un parcours simple et fluide, de la boutique à la livraison.'
              : 'A simple, smooth journey from catalog to doorstep.'}
          </p>
        </div>

        {/* Liste texte : Étape N + titre (sans carte, sans couleur) */}
        <ol className="max-w-xl mx-auto divide-y divide-slate-200">
          {ORDER_STEPS.map((st, idx) => (
            <li key={idx} className="flex items-baseline gap-3 py-3.5">
              <span className="text-sm font-semibold text-slate-400 tabular-nums shrink-0">
                {fr ? `Étape ${idx + 1}` : `Step ${idx + 1}`}
              </span>
              <span className="text-sm sm:text-base font-medium text-slate-800">
                {fr ? st.title_fr : st.title_en}
              </span>
            </li>
          ))}
        </ol>

      </div>
    </section>
  );
};

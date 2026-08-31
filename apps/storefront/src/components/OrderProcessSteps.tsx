/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description OrderProcessSteps — Les 6 étapes de commande réparties en 2 colonnes (Étape 1-3 et Étape 4-6), carte compacte gris noir et texte blanc
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

  const col1 = ORDER_STEPS.slice(0, 3);
  const col2 = ORDER_STEPS.slice(3, 6);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-slate-900 text-white rounded-3xl py-5 px-6 sm:py-7 sm:px-10 shadow-xl border border-slate-800">
        {/* En-tête compact */}
        <div className="text-center max-w-2xl mx-auto space-y-1.5 mb-5 sm:mb-6">
          <h2 className="text-xl sm:text-3xl font-serif font-medium text-white tracking-tight">
            {fr ? 'Comment passer votre commande ?' : 'How to Place Your Order?'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
            {fr
              ? 'Un parcours simple et fluide, de la boutique à la livraison.'
              : 'A simple, smooth journey from catalog to doorstep.'}
          </p>
        </div>

        {/* 2 Colonnes : Colonne 1 (Étapes 1-3) & Colonne 2 (Étapes 4-6) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 max-w-4xl mx-auto">
          {/* Colonne 1 */}
          <ol className="divide-y divide-slate-800">
            {col1.map((st, idx) => (
              <li key={idx} className="flex items-baseline gap-3 py-2 sm:py-2.5">
                <span className="text-base sm:text-lg font-bold text-white tabular-nums shrink-0">
                  {fr ? `Étape ${idx + 1}` : `Step ${idx + 1}`}
                </span>
                <span className="text-sm sm:text-base font-normal text-white">
                  {fr ? st.title_fr : st.title_en}
                </span>
              </li>
            ))}
          </ol>

          {/* Colonne 2 */}
          <ol className="divide-y divide-slate-800 border-t md:border-t-0 border-slate-800">
            {col2.map((st, idx) => (
              <li key={idx + 3} className="flex items-baseline gap-3 py-2 sm:py-2.5">
                <span className="text-base sm:text-lg font-bold text-white tabular-nums shrink-0">
                  {fr ? `Étape ${idx + 4}` : `Step ${idx + 4}`}
                </span>
                <span className="text-sm sm:text-base font-normal text-white">
                  {fr ? st.title_fr : st.title_en}
                </span>
              </li>
            ))}
          </ol>
        </div>

      </div>
    </section>
  );
};

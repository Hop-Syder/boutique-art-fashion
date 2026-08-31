/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description Tutorial — Guide d'accueil pas-à-pas du back-office Art Fashion.
 *              S'affiche à la première visite (mémorisé) et réouvrable via le bouton « Aide ».
 * @created 2026-08-31
 * 🌐 nexus-partners.xyz
 * 📧 daoudaabassichristian@gmail.com
 */
import React, { useState } from 'react';
import {
  Package,
  Sliders,
  Image as ImageIcon,
  ShoppingCart,
  Truck,
  Settings,
  Sparkles,
  X,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react';

export const TUTORIAL_SEEN_KEY = 'admin_tutorial_seen';

interface TutorialStep {
  icon: React.FC<{ className?: string }>;
  title: string;
  body: string;
}

const STEPS: TutorialStep[] = [
  {
    icon: Sparkles,
    title: 'Bienvenue dans votre Back-Office 👋',
    body: "Ce guide rapide vous montre comment gérer votre boutique : produits, filtres, contenu du site, livraisons et paramètres. Vous pouvez le rouvrir à tout moment via le bouton « Aide » en haut.",
  },
  {
    icon: Package,
    title: '1. Gérer les Produits',
    body: "Onglet « Produits » → « Ajouter un Nouveau Produit ». Renseignez le nom et le prix, choisissez la Catégorie (rayon) et le genre, ajoutez une image, puis créez les variantes (tailles, couleurs, stock). Cliquez sur Enregistrer.",
  },
  {
    icon: Sliders,
    title: '2. Filtres du Catalogue',
    body: "Onglet « Filtres » : gérez les critères que vos clients utilisent pour affiner leur recherche (taille, couleur, coupe, matière…). Activez, ajoutez ou archivez un filtre selon vos besoins.",
  },
  {
    icon: ImageIcon,
    title: '3. Éditeur de Sections (CMS)',
    body: "Onglet « Éditeur de Sections » : modifiez la bannière d'accueil (Hero), la barre d'annonces, le carrousel et la page À Propos. Pensez à cliquer sur « Publier » pour mettre à jour la vitrine.",
  },
  {
    icon: ShoppingCart,
    title: '4. Suivre les Commandes',
    body: "La section Commandes regroupe les demandes reçues. Suivez leur statut (Nouvelle, Confirmée, En livraison, Livrée) et contactez le client directement sur WhatsApp.",
  },
  {
    icon: Truck,
    title: '5. Zones de Livraison',
    body: "Onglet « Zones de Livraison » : définissez vos zones et tarifs (Cotonou, Calavi, Porto-Novo…). Ces frais s'appliquent automatiquement au moment de la commande.",
  },
  {
    icon: Settings,
    title: '6. Paramètres & Sauvegarde',
    body: "Onglet « Paramètres » : mettez à jour vos coordonnées (WhatsApp, téléphone, adresse). Pensez à Exporter une sauvegarde .json régulièrement pour protéger vos données.",
  },
];

interface TutorialProps {
  open: boolean;
  onClose: () => void;
}

export const Tutorial: React.FC<TutorialProps> = ({ open, onClose }) => {
  const [step, setStep] = useState(0);

  if (!open) return null;

  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];
  const Icon = current.icon;

  const handleClose = () => {
    try {
      localStorage.setItem(TUTORIAL_SEEN_KEY, 'true');
    } catch {
      /* ignore */
    }
    setStep(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600">
            <Sparkles className="w-4 h-4" />
            <span>Guide de démarrage</span>
          </div>
          <button
            onClick={handleClose}
            className="min-w-[40px] min-h-[40px] rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Fermer le guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-orange-400 flex items-center justify-center mx-auto shadow-inner">
            <Icon className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-serif font-bold text-slate-900">{current.title}</h3>
          <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">{current.body}</p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 pb-2">
          {STEPS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setStep(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === step ? 'w-6 bg-slate-900' : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Étape ${idx + 1}`}
            />
          ))}
        </div>

        {/* Footer navigation */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={isFirst}
            className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Précédent</span>
          </button>

          <span className="text-[11px] text-slate-400 font-medium">
            Étape {step + 1} / {STEPS.length}
          </span>

          {isLast ? (
            <button
              onClick={handleClose}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Terminer</span>
            </button>
          ) : (
            <button
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <span>Suivant</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

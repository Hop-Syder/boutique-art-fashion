import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Search,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  MapPin,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { OrderStatus } from '@ayele/shared';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_STEPS: { key: OrderStatus; label: string; desc: string }[] = [
  { key: 'NOUVELLE', label: 'Commande Transmise', desc: 'Réception du message WhatsApp par la boutique.' },
  { key: 'CONFIRMÉE', label: 'Stock Confirmé', desc: 'Vérification de la taille et préparation en caisse.' },
  { key: 'EN_PRÉPARATION', label: 'Ajustement & Préparation', desc: 'Repassage et housse de protection à l’atelier Rue 403.' },
  { key: 'EN_LIVRAISON', label: 'En cours de Livraison', desc: 'Le livreur est en route vers votre adresse à Cotonou/Calavi.' },
  { key: 'LIVRÉE', label: 'Livrée & Réglée', desc: 'Commande remise et paiement reçu avec succès.' },
];

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ isOpen, onClose }) => {
  const { trackingOrderId, setTrackingOrderId, findOrder, formatFCFA, settings } = useStore();
  const [searchQuery, setSearchQuery] = useState(trackingOrderId || '');
  const [hasSearched, setHasSearched] = useState(Boolean(trackingOrderId));
  // Tick pour forcer le re-render et relire le localStorage à intervalle régulier
  const [, setRefreshTick] = useState(0);

  // Polling : relit le localStorage toutes les 3s quand le modal est ouvert
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setRefreshTick((t) => t + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const foundOrder = searchQuery.trim() ? findOrder(searchQuery.trim()) : undefined;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };


  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'NOUVELLE':
      case 'CONTACTÉE':
        return 0;
      case 'CONFIRMÉE':
        return 1;
      case 'EN_PRÉPARATION':
        return 2;
      case 'EN_LIVRAISON':
        return 3;
      case 'LIVRÉE':
        return 4;
      case 'ANNULÉE':
        return -1;
      default:
        return 0;
    }
  };

  const currentStepIdx = foundOrder ? getStepIndex(foundOrder.status) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-1 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold uppercase tracking-wider">
              <Package className="w-3 h-3" />
              <span>Suivi de Commande en Direct</span>
            </div>
            <h3 className="text-xl font-serif font-medium text-white">
              Où en est votre tenue ?
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer relative z-10"
            aria-label="Fermer la fenêtre"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ex: #AF-2026-8921 ou votre téléphone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-red-600 shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95 shrink-0"
            >
              Rechercher
            </button>
          </form>
        </div>

        {/* Result Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {foundOrder ? (
            <div className="space-y-6">
              {/* Order Info Card */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] text-red-400 uppercase font-bold tracking-wider block">
                      Numéro de Commande
                    </span>
                    <strong className="text-sm font-mono font-bold text-white">
                      {foundOrder.order_number}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Total Commande</span>
                    <span className="text-xs font-extrabold text-amber-400">
                      {formatFCFA(foundOrder.total)}
                    </span>
                  </div>
                </div>

                <div className="text-xs space-y-1 text-slate-300">
                  <p>Client : <strong className="text-white">{foundOrder.customer_name}</strong> ({foundOrder.customer_phone})</p>
                  <p className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>{foundOrder.delivery_address}, {foundOrder.delivery_city}</span>
                  </p>
                </div>
              </div>

              {/* Status Timeline */}
              {foundOrder.status === 'ANNULÉE' ? (
                <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-200 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <div className="text-xs">
                    <strong className="font-bold block">Commande Annulée</strong>
                    <span>Veuillez contacter le conseiller sur WhatsApp pour plus de détails.</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Étapes de préparation & livraison
                  </h4>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {STATUS_STEPS.map((step, idx) => {
                      const isDone = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;

                      return (
                        <div key={step.key} className="relative flex items-start gap-3.5">
                          {/* Dot / Icon */}
                          <div
                            className={`absolute -left-6 w-5.5 h-5.5 rounded-full flex items-center justify-center border-2 transition-all ${
                              isDone
                                ? 'bg-red-600 border-red-600 text-white shadow-sm ring-2 ring-red-100'
                                : 'bg-white border-slate-300 text-transparent'
                            }`}
                          >
                            {isDone && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>

                          <div className="space-y-0.5">
                            <h5
                              className={`text-xs font-bold ${
                                isCurrent
                                  ? 'text-red-600 font-extrabold'
                                  : isDone
                                  ? 'text-slate-900'
                                  : 'text-slate-400'
                              }`}
                            >
                              {step.label}
                              {isCurrent && (
                                <span className="ml-2 text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-bold">
                                  En cours
                                </span>
                              )}
                            </h5>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : hasSearched ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center border border-amber-200">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Aucune commande trouvée</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Vérifiez le numéro de commande envoyé sur WhatsApp ou contactez directement l'atelier Rue 403.
              </p>
            </div>
          ) : (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Entrez votre référence</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Saisissez votre numéro de commande reçu par message WhatsApp pour suivre la livraison.
              </p>
            </div>
          )}
        </div>

        {/* Footer Contact WhatsApp Direct */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 text-xs">
          <span className="text-slate-500 font-medium">Une question sur votre livraison ?</span>
          <a
            href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-sm shrink-0"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
            <span>Contacter la Caisse</span>
          </a>
        </div>
      </div>
    </div>
  );
};

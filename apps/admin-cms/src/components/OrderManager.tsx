import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Order, OrderStatus } from '@ayele/shared';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  Phone,
  MessageCircle,
  Trash2,
  Edit,
  Eye,
  X,
  FileText,
  Truck,
  ChevronDown,
} from 'lucide-react';

const STATUS_LIST: OrderStatus[] = [
  'NOUVELLE',
  'CONTACTÉE',
  'CONFIRMÉE',
  'EN_PRÉPARATION',
  'EN_LIVRAISON',
  'LIVRÉE',
  'ANNULÉE',
];

export const OrderManager: React.FC = () => {
  const { orders, updateOrderStatus, addCashierNote, deleteOrder, formatFCFA, settings } = useAdmin();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (filterStatus !== 'all' && o.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_phone.includes(q) ||
        o.delivery_city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenWhatsAppClient = (order: Order) => {
    const cleanNum = order.customer_whatsapp || order.customer_phone.replace(/\D/g, '');
    const msg = `Bonjour *${order.customer_name}* 👋\nIci l'atelier *${settings.store_name}* concernant votre commande *${order.order_number}*.\n\nStatut actuel : *${order.status}*\nMontant total : *${formatFCFA(order.total)}*\n\nNous sommes à votre disposition pour toute précision !`;
    window.open(`https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-semibold text-slate-900">
            Gestion & Suivi des Commandes ({orders.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mettez à jour l'état des livraisons, ajoutez des notes et échangez directement avec les clients sur WhatsApp.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher réf, client, téléphone..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <label className="text-xs font-semibold text-slate-600 shrink-0">Filtrer par statut :</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
          >
            <option value="all">Tous les statuts</option>
            {STATUS_LIST.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">N° Commande</th>
                <th className="p-4">Client & Contact</th>
                <th className="p-4">Destination</th>
                <th className="p-4">Articles & Total</th>
                <th className="p-4">Statut Actuel</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <span className="font-mono font-bold text-slate-900 text-xs block">
                      {ord.order_number}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(ord.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{ord.customer_name}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" /> {ord.customer_phone}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-slate-800">{ord.delivery_city}</span>
                    <span className="block text-[10px] text-slate-500 line-clamp-1">{ord.delivery_zone}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-extrabold text-orange-600 text-sm block">{formatFCFA(ord.total)}</span>
                    <span className="text-[10px] text-slate-500">{ord.items.length} article(s)</span>
                  </td>
                  <td className="p-4">
                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 cursor-pointer"
                    >
                      {STATUS_LIST.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenWhatsAppClient(ord)}
                        className="p-2 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors cursor-pointer"
                        title="Relancer sur WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4 fill-current" />
                      </button>
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Supprimer la commande ${ord.order_number} ?`)) deleteOrder(ord.id);
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-4 sm:p-6 space-y-6 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900">
                  Détails Commande {selectedOrder.order_number}
                </h3>
                <span className="text-xs text-slate-400">
                  Du {new Date(selectedOrder.created_at).toLocaleString('fr-FR')}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl space-y-1.5">
                <p>
                  <strong>Client :</strong> {selectedOrder.customer_name}
                </p>
                <p>
                  <strong>Téléphone :</strong> {selectedOrder.customer_phone}
                </p>
                <p>
                  <strong>Adresse :</strong> {selectedOrder.delivery_address} ({selectedOrder.delivery_city})
                </p>
                {selectedOrder.delivery_landmark && (
                  <p>
                    <strong>Repère :</strong> {selectedOrder.delivery_landmark}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900">Articles commandés :</h4>
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl">
                    <div className="flex items-center gap-2">
                      <img src={it.image} alt="" className="w-8 h-10 object-cover rounded" />
                      <div>
                        <p className="font-bold text-slate-900">{it.product_name}</p>
                        <p className="text-[10px] text-slate-500">Taille: {it.size} • {it.color}</p>
                      </div>
                    </div>
                    <span className="font-bold">{it.quantity} x {formatFCFA(it.unit_price)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between text-sm font-bold">
                <span>Total à encaisser :</span>
                <span className="text-orange-600">{formatFCFA(selectedOrder.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

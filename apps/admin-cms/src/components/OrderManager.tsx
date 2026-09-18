/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description Advanced Order Management Component for Art Fashion Admin CMS
 * @created 2026-08-19
 * @updated 2026-09-18
 * 🌐 ceo.nexuspartners.xyz
 * 📧 daoudaabassichristian@gmail.com
 */

import React, { useState, useMemo } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Order, OrderStatus } from '@artfashion/shared';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  Phone,
  MessageCircle,
  Trash2,
  Eye,
  X,
  FileText,
  Truck,
  ChevronDown,
  Calendar,
  Download,
  Filter,
  TrendingUp,
  AlertCircle,
  Check,
  Printer,
  DollarSign,
  Package,
  RotateCcw,
} from 'lucide-react';

const STATUS_LIST: { id: OrderStatus; label: string; color: string; badgeBg: string }[] = [
  { id: 'NOUVELLE', label: 'Nouvelle', color: 'text-amber-700', badgeBg: 'bg-amber-100 border-amber-300' },
  { id: 'CONTACTÉE', label: 'Contactée', color: 'text-indigo-700', badgeBg: 'bg-indigo-100 border-indigo-300' },
  { id: 'CONFIRMÉE', label: 'Confirmée', color: 'text-sky-700', badgeBg: 'bg-sky-100 border-sky-300' },
  { id: 'EN_PRÉPARATION', label: 'En préparation', color: 'text-yellow-700', badgeBg: 'bg-yellow-100 border-yellow-300' },
  { id: 'EN_LIVRAISON', label: 'En livraison', color: 'text-orange-700', badgeBg: 'bg-orange-100 border-orange-300' },
  { id: 'LIVRÉE', label: 'Livrée', color: 'text-emerald-700', badgeBg: 'bg-emerald-100 border-emerald-300' },
  { id: 'ANNULÉE', label: 'Annulée', color: 'text-rose-700', badgeBg: 'bg-rose-100 border-rose-300' },
];

type DateFilterType = 'today' | 'yesterday' | '7days' | '30days' | 'this_month' | 'last_month' | 'all' | 'custom';

export const OrderManager: React.FC = () => {
  const { orders, updateOrderStatus, addCashierNote, deleteOrder, formatFCFA, settings } = useAdmin();

  // Filters State
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount_desc' | 'amount_asc'>('newest');

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingCashierNote, setEditingCashierNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [noteSavedAlert, setNoteSavedAlert] = useState(false);

  // Helper date filtering
  const isWithinDateFilter = (orderDateStr: string, filter: DateFilterType): boolean => {
    const orderDate = new Date(orderDateStr);
    if (isNaN(orderDate.getTime())) return true;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    switch (filter) {
      case 'today':
        return orderDate >= todayStart && orderDate <= todayEnd;

      case 'yesterday': {
        const yStart = new Date(todayStart);
        yStart.setDate(yStart.getDate() - 1);
        const yEnd = new Date(todayEnd);
        yEnd.setDate(yEnd.getDate() - 1);
        return orderDate >= yStart && orderDate <= yEnd;
      }

      case '7days': {
        const d7 = new Date(now);
        d7.setDate(d7.getDate() - 7);
        return orderDate >= d7 && orderDate <= now;
      }

      case '30days': {
        const d30 = new Date(now);
        d30.setDate(d30.getDate() - 30);
        return orderDate >= d30 && orderDate <= now;
      }

      case 'this_month': {
        const mStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
        return orderDate >= mStart && orderDate <= now;
      }

      case 'last_month': {
        const lmStart = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0);
        const lmEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        return orderDate >= lmStart && orderDate <= lmEnd;
      }

      case 'custom': {
        if (!customStartDate && !customEndDate) return true;
        const start = customStartDate ? new Date(`${customStartDate}T00:00:00`) : new Date(0);
        const end = customEndDate ? new Date(`${customEndDate}T23:59:59`) : new Date(8640000000000000);
        return orderDate >= start && orderDate <= end;
      }

      case 'all':
      default:
        return true;
    }
  };

  // Filtered & Sorted Orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        // Date filter
        if (!isWithinDateFilter(o.created_at, dateFilter)) return false;

        // Status filter
        if (statusFilter !== 'all' && o.status !== statusFilter) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchOrderNum = o.order_number.toLowerCase().includes(q);
          const matchCustomer = o.customer_name.toLowerCase().includes(q);
          const matchPhone = (o.customer_phone || '').includes(q) || (o.customer_whatsapp || '').includes(q);
          const matchCity = (o.delivery_city || '').toLowerCase().includes(q);
          const matchZone = (o.delivery_zone || '').toLowerCase().includes(q);
          const matchItems = o.items.some((it) => it.product_name.toLowerCase().includes(q));

          if (!matchOrderNum && !matchCustomer && !matchPhone && !matchCity && !matchZone && !matchItems) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        if (sortBy === 'amount_desc') return b.total - a.total;
        if (sortBy === 'amount_asc') return a.total - b.total;
        return 0;
      });
  }, [orders, dateFilter, customStartDate, customEndDate, statusFilter, searchQuery, sortBy]);

  // Key Metrics calculation for the selected period
  const metrics = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders
      .filter((o) => o.status !== 'ANNULÉE')
      .reduce((sum, o) => sum + (o.total || 0), 0);
    const pendingCount = filteredOrders.filter(
      (o) => o.status === 'NOUVELLE' || o.status === 'CONTACTÉE' || o.status === 'CONFIRMÉE'
    ).length;
    const deliveredCount = filteredOrders.filter((o) => o.status === 'LIVRÉE').length;
    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / (totalOrders - (filteredOrders.filter(o => o.status === 'ANNULÉE').length || 1))) : 0;

    return { totalOrders, totalRevenue, pendingCount, deliveredCount, averageOrderValue };
  }, [filteredOrders]);

  const handleOpenWhatsAppClient = (order: Order) => {
    const rawNum = order.customer_whatsapp || order.customer_phone || '';
    const cleanNum = rawNum.replace(/\D/g, '');
    const itemsSummary = order.items.map((it) => `• ${it.quantity}x ${it.product_name} (${it.size}, ${it.color})`).join('\n');
    const msg = `Bonjour *${order.customer_name}* 👋\n\nIci la maison de prêt-à-porter *${settings.store_name}* (Cotonou, Rue 403).\nNous faisons le suivi de votre commande *${order.order_number}* :\n\n${itemsSummary}\n\n📍 *Lieu de livraison :* ${order.delivery_city}, ${order.delivery_zone} (${order.delivery_address})\n💰 *Montant total :* ${formatFCFA(order.total)}\n📦 *Statut actuel :* ${order.status}\n\nUn livreur prendra contact avec vous avant le départ. Merci de votre confiance !`;
    window.open(`https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleSaveNote = async () => {
    if (!selectedOrder) return;
    setIsSavingNote(true);
    try {
      await addCashierNote(selectedOrder.id, editingCashierNote);
      setSelectedOrder({ ...selectedOrder, cashier_notes: editingCashierNote });
      setNoteSavedAlert(true);
      setTimeout(() => setNoteSavedAlert(false), 2500);
    } catch (e) {
      alert('Erreur lors de la sauvegarde de la note.');
    } finally {
      setIsSavingNote(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      alert('Aucune commande à exporter pour ces critères.');
      return;
    }

    const headers = ['N_Commande', 'Date', 'Client', 'Telephone', 'WhatsApp', 'Ville', 'Zone', 'Adresse', 'Total_FCFA', 'Statut', 'Articles'];
    const rows = filteredOrders.map((o) => [
      `"${o.order_number}"`,
      `"${new Date(o.created_at).toLocaleString('fr-FR')}"`,
      `"${(o.customer_name || '').replace(/"/g, '""')}"`,
      `"${o.customer_phone || ''}"`,
      `"${o.customer_whatsapp || ''}"`,
      `"${(o.delivery_city || '').replace(/"/g, '""')}"`,
      `"${(o.delivery_zone || '').replace(/"/g, '""')}"`,
      `"${(o.delivery_address || '').replace(/"/g, '""')}"`,
      o.total,
      `"${o.status}"`,
      `"${o.items.map((it) => `${it.quantity}x ${it.product_name}`).join(' | ').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `commandes_art_fashion_${dateFilter}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Order Receipt
  const handlePrintReceipt = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const itemsHtml = order.items
      .map(
        (it) => `
      <tr>
        <td style="padding: 6px 0; border-bottom: 1px dashed #eee;">
          <strong>${it.product_name}</strong><br>
          <small style="color: #666;">Taille: ${it.size} | Coul: ${it.color}</small>
        </td>
        <td style="padding: 6px 0; text-align: center; border-bottom: 1px dashed #eee;">${it.quantity}</td>
        <td style="padding: 6px 0; text-align: right; border-bottom: 1px dashed #eee;">${formatFCFA(it.total_price)}</td>
      </tr>
    `
      )
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bon de Commande ${order.order_number} - ART FASHION</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: #111; padding: 20px; max-width: 420px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 2px solid #111; padding-bottom: 12px; margin-bottom: 12px; }
          .title { font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
          .meta { margin-top: 4px; color: #666; font-size: 11px; }
          .section { margin-bottom: 12px; }
          .section-title { font-weight: bold; font-size: 11px; text-transform: uppercase; color: #666; margin-bottom: 4px; border-bottom: 1px solid #ddd; padding-bottom: 2px; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 6px; }
          .totals { margin-top: 12px; border-top: 2px solid #111; padding-top: 6px; text-align: right; }
          .total-row { font-size: 14px; font-weight: bold; }
          .footer { text-align: center; margin-top: 24px; font-size: 10px; color: #777; border-top: 1px dashed #ccc; padding-top: 12px; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${settings.store_name || 'ART FASHION'}</div>
          <div class="meta">Prêt-à-Porter Masculin d’Exception</div>
          <div class="meta">Rue 403, Zongo / Scoa Gbéto, Cotonou • Tél : ${settings.phone_number || ''}</div>
          <div style="margin-top: 8px; font-weight: bold; font-size: 13px;">BON DE LIVRAISON : ${order.order_number}</div>
          <div class="meta">Date : ${new Date(order.created_at).toLocaleString('fr-FR')}</div>
        </div>

        <div class="section">
          <div class="section-title">Informations Destinataire</div>
          <div><strong>Client :</strong> ${order.customer_name}</div>
          <div><strong>Téléphone :</strong> ${order.customer_phone}</div>
          <div><strong>Ville & Zone :</strong> ${order.delivery_city} — ${order.delivery_zone}</div>
          <div><strong>Adresse :</strong> ${order.delivery_address}</div>
          ${order.delivery_landmark ? `<div><strong>Repère :</strong> ${order.delivery_landmark}</div>` : ''}
        </div>

        <div class="section">
          <div class="section-title">Articles Commandés</div>
          <table>
            <thead>
              <tr style="border-bottom: 1px solid #111; text-align: left;">
                <th>Article</th>
                <th style="text-align: center;">Qté</th>
                <th style="text-align: right;">Prix</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
        </div>

        <div class="totals">
          <div>Sous-total : ${formatFCFA(order.subtotal || order.total - (order.delivery_fee || 0))}</div>
          <div>Livraison : ${order.delivery_fee ? formatFCFA(order.delivery_fee) : 'GRATUITE'}</div>
          <div class="total-row" style="margin-top: 4px;">TOTAL À PAYER : ${formatFCFA(order.total)}</div>
        </div>

        ${order.cashier_notes ? `<div class="section" style="margin-top: 12px; background: #f9f9f9; padding: 6px; border-radius: 4px;"><strong>Note atelier / livreur :</strong> ${order.cashier_notes}</div>` : ''}

        <div class="footer">
          Merci pour votre confiance chez ART FASHION !<br>
          Pour toute assistance : WhatsApp ${settings.whatsapp_number || '+229 01 97 00 00 00'}
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* ── Top Header Bar ── */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-50 text-red-600 rounded-2xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                Commandes Effectuées & Ventes
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Consultez, filtrez par date, suivez les livraisons et gérez le relationnel client WhatsApp.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            title="Télécharger l'historique au format CSV"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Exporter CSV</span>
          </button>
        </div>
      </div>

      {/* ── KPI Metric Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Commandes</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">{metrics.totalOrders}</span>
            <span className="text-[11px] text-slate-500 font-medium">pièce(s)</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Chiffre d'Affaires</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-lg sm:text-2xl font-serif font-extrabold text-red-600">
              {formatFCFA(metrics.totalRevenue)}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">En Attente</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-600">{metrics.pendingCount}</span>
            <span className="text-[11px] text-amber-700/70 font-medium">à traiter</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Livrées avec succès</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-emerald-700">{metrics.deliveredCount}</span>
            <span className="text-[11px] text-emerald-600/70 font-medium">honorées</span>
          </div>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Panier Moyen</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-lg sm:text-xl font-serif font-bold text-slate-800">
              {formatFCFA(metrics.averageOrderValue)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Filters & Time Selection Bar ── */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        {/* Date Filter Pills */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-red-600" />
            <span>Période d'affichage :</span>
          </label>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {[
              { id: 'today', label: "Aujourd'hui" },
              { id: 'yesterday', label: 'Hier' },
              { id: '7days', label: '7 derniers jours' },
              { id: '30days', label: '30 derniers jours' },
              { id: 'this_month', label: 'Ce mois-ci' },
              { id: 'last_month', label: 'Mois dernier' },
              { id: 'all', label: 'Tout l’historique' },
              { id: 'custom', label: 'Personnalisée...' },
            ].map((tab) => {
              const isSelected = dateFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setDateFilter(tab.id as DateFilterType)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Custom Date Pickers */}
          {dateFilter === 'custom' && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600">Du :</span>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600">Au :</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>
              {(customStartDate || customEndDate) && (
                <button
                  onClick={() => {
                    setCustomStartDate('');
                    setCustomEndDate('');
                  }}
                  className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
                >
                  Réinitialiser dates
                </button>
              )}
            </div>
          )}
        </div>

        {/* Search, Status & Sort Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par N° commande, nom client, contact, ville..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white cursor-pointer"
            >
              <option value="all">Tous les statuts ({orders.length})</option>
              {STATUS_LIST.map((st) => {
                const count = orders.filter((o) => o.status === st.id).length;
                return (
                  <option key={st.id} value={st.id}>
                    {st.label} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white cursor-pointer"
            >
              <option value="newest">Plus récentes en premier</option>
              <option value="oldest">Plus anciennes en premier</option>
              <option value="amount_desc">Montant le plus élevé</option>
              <option value="amount_asc">Montant le plus bas</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Orders Table ── */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-serif font-bold text-slate-800">Aucune commande trouvée</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Aucune commande ne correspond aux filtres de période ou de statut sélectionnés. Essayez d'élargir la période ou de réinitialiser vos critères.
            </p>
            <button
              onClick={() => {
                setDateFilter('all');
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Afficher tout l'historique
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-4">Réf & Date</th>
                  <th className="p-4">Client & Contact</th>
                  <th className="p-4">Destination</th>
                  <th className="p-4">Articles</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((ord) => {
                  const statusObj = STATUS_LIST.find((s) => s.id === ord.status) || STATUS_LIST[0];
                  const orderDate = new Date(ord.created_at);

                  return (
                    <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Ref & Date */}
                      <td className="p-4 align-top">
                        <span className="font-mono font-bold text-slate-900 text-xs block">
                          {ord.order_number}
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          {orderDate.toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {orderDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      {/* Client */}
                      <td className="p-4 align-top">
                        <span className="font-bold text-slate-900 block text-xs">{ord.customer_name}</span>
                        <a
                          href={`tel:${ord.customer_phone}`}
                          className="text-[11px] text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 mt-0.5"
                        >
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{ord.customer_phone}</span>
                        </a>
                      </td>

                      {/* Destination */}
                      <td className="p-4 align-top">
                        <span className="font-bold text-slate-800 block text-xs">{ord.delivery_city}</span>
                        <span className="text-[11px] text-slate-500 block">{ord.delivery_zone}</span>
                        <span className="text-[10px] text-slate-400 line-clamp-1 block mt-0.5">
                          {ord.delivery_address}
                        </span>
                      </td>

                      {/* Items */}
                      <td className="p-4 align-top">
                        <div className="space-y-1">
                          <span className="font-semibold text-slate-700 text-xs block">
                            {ord.items.length} article(s)
                          </span>
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {ord.items.slice(0, 2).map((it, i) => (
                              <span
                                key={i}
                                className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] truncate max-w-[180px] block"
                                title={`${it.quantity}x ${it.product_name} (${it.size})`}
                              >
                                {it.quantity}x {it.product_name}
                              </span>
                            ))}
                            {ord.items.length > 2 && (
                              <span className="text-[10px] text-slate-400 font-bold">
                                +{ord.items.length - 2} autre(s)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Total */}
                      <td className="p-4 align-top">
                        <span className="font-extrabold text-red-600 text-sm block">
                          {formatFCFA(ord.total)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {ord.delivery_fee ? `+ ${formatFCFA(ord.delivery_fee)} livr.` : 'Livr. offerte'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4 align-top">
                        <div className="space-y-1">
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className={`px-2 py-1 rounded-lg text-xs font-bold border cursor-pointer ${statusObj.badgeBg} ${statusObj.color}`}
                          >
                            {STATUS_LIST.map((st) => (
                              <option key={st.id} value={st.id}>
                                {st.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenWhatsAppClient(ord)}
                            className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
                            title="Relancer sur WhatsApp avec détails"
                          >
                            <MessageCircle className="w-4 h-4 fill-current" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedOrder(ord);
                              setEditingCashierNote(ord.cashier_notes || '');
                            }}
                            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all cursor-pointer"
                            title="Voir la fiche détaillée de la commande"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handlePrintReceipt(ord)}
                            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all cursor-pointer"
                            title="Imprimer le bon de livraison / reçu"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Supprimer définitivement la commande ${ord.order_number} ?`)) {
                                deleteOrder(ord.id);
                              }
                            }}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                            title="Supprimer la commande"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Order Detail Modal ── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative animate-scaleUp">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-50 text-red-600 rounded-2xl">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-slate-900">
                    Commande {selectedOrder.order_number}
                  </h3>
                  <span className="text-xs text-slate-500">
                    Passée le {new Date(selectedOrder.created_at).toLocaleString('fr-FR')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePrintReceipt(selectedOrder)}
                  className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                  title="Imprimer le reçu"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-full text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Status & Quick Change */}
            <div className="bg-slate-50 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Statut Actuel</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">{selectedOrder.status}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 font-semibold">Changer :</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    const newSt = e.target.value as OrderStatus;
                    updateOrderStatus(selectedOrder.id, newSt);
                    setSelectedOrder({ ...selectedOrder, status: newSt });
                  }}
                  className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 cursor-pointer"
                >
                  {STATUS_LIST.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Customer & Delivery Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1.5">
                  Client & Coordonnées
                </h4>
                <p>
                  <strong className="text-slate-700">Nom :</strong> {selectedOrder.customer_name}
                </p>
                <p>
                  <strong className="text-slate-700">Téléphone :</strong>{' '}
                  <a href={`tel:${selectedOrder.customer_phone}`} className="text-blue-600 hover:underline">
                    {selectedOrder.customer_phone}
                  </a>
                </p>
                {selectedOrder.customer_whatsapp && (
                  <p>
                    <strong className="text-slate-700">WhatsApp :</strong> {selectedOrder.customer_whatsapp}
                  </p>
                )}
                <div className="pt-2">
                  <button
                    onClick={() => handleOpenWhatsAppClient(selectedOrder)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Contacter sur WhatsApp</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1.5">
                  Lieu de Livraison (Cotonou)
                </h4>
                <p>
                  <strong className="text-slate-700">Ville :</strong> {selectedOrder.delivery_city}
                </p>
                <p>
                  <strong className="text-slate-700">Zone :</strong> {selectedOrder.delivery_zone}
                </p>
                <p>
                  <strong className="text-slate-700">Adresse :</strong> {selectedOrder.delivery_address}
                </p>
                {selectedOrder.delivery_landmark && (
                  <p>
                    <strong className="text-slate-700">Point de repère :</strong> {selectedOrder.delivery_landmark}
                  </p>
                )}
              </div>
            </div>

            {/* Ordered Items List */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                Articles commandés ({selectedOrder.items.length})
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="p-3 bg-white flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      {it.image ? (
                        <img src={it.image} alt="" className="w-12 h-14 object-cover rounded-lg border border-slate-100" />
                      ) : (
                        <div className="w-12 h-14 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                          <Package className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-900">{it.product_name}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Taille : <span className="font-semibold text-slate-700">{it.size}</span> • Couleur :{' '}
                          <span className="font-semibold text-slate-700">{it.color}</span>
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {it.quantity} unité(s) x {formatFCFA(it.unit_price)}
                        </p>
                      </div>
                    </div>
                    <span className="font-extrabold text-slate-900 text-sm">{formatFCFA(it.total_price)}</span>
                  </div>
                ))}
              </div>

              {/* Totals Summary */}
              <div className="bg-slate-50 p-4 rounded-2xl space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Sous-total articles :</span>
                  <span>{formatFCFA(selectedOrder.subtotal || selectedOrder.total - (selectedOrder.delivery_fee || 0))}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Frais de livraison ({selectedOrder.delivery_city}) :</span>
                  <span>{selectedOrder.delivery_fee ? formatFCFA(selectedOrder.delivery_fee) : 'Gratuit'}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                  <span>Total à encaisser :</span>
                  <span className="text-red-600 text-base font-extrabold">{formatFCFA(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Cashier Notes */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Notes internes / Instructions livreur :
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingCashierNote}
                  onChange={(e) => setEditingCashierNote(e.target.value)}
                  placeholder="Ex: Livrer impérativement après 17h, appeler le gardien..."
                  className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                />
                <button
                  onClick={handleSaveNote}
                  disabled={isSavingNote}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {isSavingNote ? '...' : noteSavedAlert ? 'Enregistré !' : 'Enregistrer'}
                </button>
              </div>
              {noteSavedAlert && (
                <p className="text-xs text-emerald-600 font-semibold">Note mise à jour avec succès.</p>
              )}
            </div>

            {/* Tracking Timeline */}
            {selectedOrder.tracking_history && selectedOrder.tracking_history.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Historique de Traitement
                </span>
                <div className="space-y-1.5">
                  {selectedOrder.tracking_history.map((ev, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px] text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
                      <span className="font-bold text-slate-800">{ev.status}</span>
                      <span className="text-slate-400">{new Date(ev.timestamp).toLocaleString('fr-FR')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

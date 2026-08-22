/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description helpers — Fonctions utilitaires : formatage monétaire FCFA, génération N° commande AF, message WhatsApp enrichi avec Lieu de Livraison explicite, persistance LocalStorage
 * @created 2026-08-19
 * @updated 2026-08-22
 * 🌐 nexus-partners.xyz
 * 📧 daoudaabassichristian@gmail.com
 */
// ──────────────────────────────────
import { CartItem, Order, Product, ProductVariant, SectionsConfig, StoreSettings } from '../types';

export const formatFCFA = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace('XOF', 'FCFA');
};

export const generateOrderNumber = (): string => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `AF-${randomNum}`;
};

export const calculateCartSubtotal = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => {
    const price = item.variant.price_override ?? item.product.price;
    return total + price * item.quantity;
  }, 0);
};

export const generateWhatsAppMessage = (
  order: Order,
  settings: StoreSettings
): { url: string; message: string } => {
  const itemsText = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.product_name}*\n   • Taille : ${item.size}\n   • Couleur : ${item.color}\n   • Qté : ${item.quantity} x ${formatFCFA(item.unit_price)} = *${formatFCFA(item.total_price)}*`
    )
    .join('\n\n');

  const rawMessage = `👑 *NOUVELLE COMMANDE EN LIGNE — ART FASHION COTONOU* 👑
🌐 *Provenance :* _Site Web Officiel (artfashion-cotonou.com)_
-----------------------------------------
🔖 *N° de Commande :* \`${order.order_number}\`
📅 *Date :* ${new Date(order.created_at).toLocaleDateString('fr-FR')}

👤 *INFORMATIONS DU CLIENT :*
• Nom & Prénom : *${order.customer_name}*
• Téléphone Appel / WhatsApp : *${order.customer_phone}*

📍 *LIEU & ADRESSE DE LIVRAISON :*
• Ville : *${order.delivery_city}*
• Quartier / Rue / Domicile : *${order.delivery_address}*
• Repère / Indication : *${order.delivery_landmark || 'Près de chez le client'}*
• Zone tarifaire : ${order.delivery_zone} (${formatFCFA(order.delivery_fee)})
${order.delivery_notes ? `• Note spéciale pour la livraison : ${order.delivery_notes}\n` : ''}
🛍️ *DÉTAIL DES ARTICLES COMMANDÉS :*
${itemsText}

-----------------------------------------
💰 *Sous-Total Articles :* ${formatFCFA(order.subtotal)}
🚚 *Frais de Livraison :* ${formatFCFA(order.delivery_fee)}
🔥 *TOTAL À PAYER À LA LIVRAISON :* *${formatFCFA(order.total)}*

Merci de me confirmer la disponibilité des articles et le créneau de livraison !`;

  const cleanPhone = settings.whatsapp_number.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(rawMessage);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

  return {
    url: whatsappUrl,
    message: rawMessage,
  };
};

export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Erreur lecture LocalStorage [${key}]:`, error);
    return defaultValue;
  }
};

export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('art_fashion_storage_change', { detail: { key, value } })
      );
    }
  } catch (error) {
    console.error(`Erreur écriture LocalStorage [${key}]:`, error);
  }
};

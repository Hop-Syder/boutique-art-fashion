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
  return `AY-${randomNum}`;
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

  const rawMessage = `✨ *NOUVELLE COMMANDE AYÉLÉ MAISON DE MODE* ✨
-----------------------------------------
🔖 *N° de Commande :* \`${order.order_number}\`
📅 *Date :* ${new Date(order.created_at).toLocaleDateString('fr-FR')}

👤 *INFORMATIONS CLIENT :*
• Nom : *${order.customer_name}*
• Téléphone : ${order.customer_phone}
• Ville : *${order.delivery_city}*
• Quartier / Adresse : ${order.delivery_address}
${order.delivery_landmark ? `• Repère : ${order.delivery_landmark}\n` : ''}${order.delivery_notes ? `• Note : ${order.delivery_notes}\n` : ''}
🚚 *ZONES DE LIVRAISON :*
• ${order.delivery_zone} (${formatFCFA(order.delivery_fee)})

🛍️ *DÉTAIL DE LA COMMANDE :*
${itemsText}

-----------------------------------------
💰 *Sous-Total :* ${formatFCFA(order.subtotal)}
🚚 *Frais de Livraison :* ${formatFCFA(order.delivery_fee)}
🔥 *TOTAL À PAYER :* *${formatFCFA(order.total)}*

Merci de me confirmer la disponibilité et les modalités de livraison !`;

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

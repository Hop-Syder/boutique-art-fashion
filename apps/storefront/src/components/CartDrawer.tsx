/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description CartDrawer — Tiroir panier latéral : liste articles, quantités, total, commande WhatsApp
 * @created 2026-08-19
 * @updated 2026-08-22
 * 🌐 nexus-partners.xyz
 * 📧 daoudaabassichristian@gmail.com
 */
// ──────────────────────────────────
import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import { CartIcon } from './CartIcon';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartTotal,
    selectedZone,
    setSelectedZone,
    deliveryZones,
    formatFCFA,
    setIsCheckoutOpen,
    language,
    t,
  } = useStore();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/65 backdrop-blur-xs animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200">
          {/* Top Cart Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-slate-900 text-red-500 flex items-center justify-center font-bold text-sm shadow-xs">
                <CartIcon className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-slate-900 text-lg">
                  {language === 'en' ? 'My Shopping Cart' : 'Mon Panier'}
                </h2>
                <p className="text-xs text-slate-500">
                  {cart.length} {language === 'en' ? 'item(s) selected' : 'article(s) sélectionné(s)'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="min-w-[44px] min-h-[44px] rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors flex items-center justify-center cursor-pointer focus:ring-2 focus:ring-slate-900"
              aria-label="Fermer le panier"
              id="cart-drawer-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-20 h-20 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-3xl shadow-inner">
                  🛍️
                </div>
                <div>
                  <h3 className="font-serif font-bold text-slate-900 text-lg">
                    {language === 'en' ? 'Your cart is empty' : 'Votre panier est vide'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                    {language === 'en'
                      ? 'Explore our men luxury suits, shirts, bazin boubous, and leather shoes.'
                      : 'Explorez notre catalogue de costumes, chemises en lin, boubous bazin et mocassins.'}
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {language === 'en' ? 'Explore Collection' : 'Découvrir la collection'}
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100 font-medium">
                  <span>{language === 'en' ? 'Selected Items' : 'Articles en commande'}</span>
                  <button
                    onClick={clearCart}
                    className="text-rose-600 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> {language === 'en' ? 'Clear' : 'Vider'}
                  </button>
                </div>

                {cart.map((item) => {
                  const unitPrice = item.variant.price_override ?? item.product.price;
                  const itemTotal = unitPrice * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex gap-3.5 relative group hover:border-slate-300 transition-colors"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-20 h-24 object-cover object-center rounded-xl bg-white border border-slate-200 shrink-0"
                        loading="lazy"
                        decoding="async"
                      />

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-serif text-slate-900 text-xs font-bold line-clamp-2">
                              {language === 'en' ? item.product.name_en || item.product.name : item.product.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors cursor-pointer"
                              title="Supprimer l'article"
                              aria-label={`Supprimer ${item.product.name}`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="mt-1 flex flex-wrap gap-1 text-[11px] text-slate-700 font-semibold">
                            <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">
                              Taille: <strong>{item.variant.size}</strong>
                            </span>
                            <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">
                              Couleur: {item.variant.color}
                            </span>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 mt-2">
                          <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-2xs">
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="min-w-[36px] min-h-[36px] flex items-center justify-center hover:bg-slate-100 text-slate-700 font-bold cursor-pointer"
                              aria-label="Diminuer la quantité"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2.5 text-xs font-bold text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="min-w-[36px] min-h-[36px] flex items-center justify-center hover:bg-slate-100 text-slate-700 font-bold cursor-pointer"
                              disabled={item.quantity >= item.variant.stock}
                              aria-label="Augmenter la quantité"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="text-sm font-bold text-slate-900">
                            {formatFCFA(itemTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Bottom Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-600" />
                    {language === 'en' ? 'Delivery Zone:' : 'Zone de livraison :'}
                  </span>
                  <span className="text-red-600 font-bold">
                    {selectedZone.fee === 0 ? 'GRATUIT' : formatFCFA(selectedZone.fee)}
                  </span>
                </label>
                <select
                  value={selectedZone.id}
                  onChange={(e) => {
                    const zone = deliveryZones.find((z) => z.id === e.target.value);
                    if (zone) setSelectedZone(zone);
                  }}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer min-h-[44px]"
                  id="cart-drawer-zone-select"
                  aria-label="Sélectionner la zone de livraison"
                >
                  {deliveryZones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {language === 'en' && z.name_en ? z.name_en : z.name} — {z.fee === 0 ? 'GRATUIT' : formatFCFA(z.fee)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 text-xs pt-2 border-t border-slate-200/80">
                <div className="flex justify-between text-slate-600">
                  <span>{language === 'en' ? 'Subtotal:' : 'Sous-total articles :'}</span>
                  <span className="font-bold text-slate-900">{formatFCFA(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{language === 'en' ? 'Delivery fee:' : 'Frais de livraison :'}</span>
                  <span className="font-bold text-slate-900">
                    {selectedZone.fee === 0 ? 'GRATUIT' : formatFCFA(selectedZone.fee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>{language === 'en' ? 'Total Amount:' : 'Total Estimé :'}</span>
                  <span className="text-red-600 font-extrabold">{formatFCFA(cartTotal)}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full min-h-[48px] py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer focus:ring-2 focus:ring-slate-900"
                id="cart-drawer-checkout-btn"
              >
                <span>{language === 'en' ? 'Proceed to Order' : 'Valider ma commande'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-slate-600 font-medium flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {language === 'en' ? 'Direct validation on WhatsApp' : 'Validation sans frais sur WhatsApp'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

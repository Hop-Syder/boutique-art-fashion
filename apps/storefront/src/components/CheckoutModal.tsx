import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import confetti from 'canvas-confetti';
import {
  X,
  Truck,
  MapPin,
  User,
  ShieldCheck,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { Order } from '@ayele/shared';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    formatFCFA,
    deliveryZones,
    selectedZone,
    setSelectedZone,
    createOrder,
    setTrackingOrderId,
    setCurrentView,
    language,
    t,
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('Cotonou');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryLandmark, setDeliveryLandmark] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  const [createdOrderData, setCreatedOrderData] = useState<{
    order: Order;
    whatsappUrl: string;
    message: string;
  } | null>(null);

  if (!isCheckoutOpen) return null;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      alert(
        language === 'en'
          ? 'Please enter your name, phone number, and delivery address.'
          : 'Veuillez remplir votre nom, numéro de téléphone et adresse de livraison.'
      );
      return;
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');

    const result = createOrder({
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_whatsapp: cleanPhone,
      delivery_city: deliveryCity,
      delivery_zone: selectedZone.name,
      delivery_address: deliveryAddress,
      delivery_landmark: deliveryLandmark,
      delivery_notes: deliveryNotes,
    });

    setCreatedOrderData(result);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleOpenWhatsApp = () => {
    if (createdOrderData) {
      window.open(createdOrderData.whatsappUrl, '_blank');
    }
  };

  const handleFinish = () => {
    setIsCheckoutOpen(false);
    setCreatedOrderData(null);
    setCurrentView('home');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 relative max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-red-500 flex items-center justify-center font-bold shadow-xs">
              <Truck className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-slate-900 text-lg sm:text-xl">
                {createdOrderData
                  ? language === 'en'
                    ? 'Order Confirmed!'
                    : 'Commande Confirmée !'
                  : language === 'en'
                  ? 'Complete Your Order'
                  : 'Finaliser ma Commande'}
              </h2>
              <p className="text-xs text-slate-500">
                {createdOrderData
                  ? language === 'en'
                    ? 'Send your order summary via WhatsApp'
                    : 'Transmettez votre bon de commande sur WhatsApp'
                  : language === 'en'
                  ? 'Doorstep delivery & secure cash on delivery in Benin'
                  : 'Livraison à domicile & paiement sécurisé au Bénin'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="min-w-[44px] min-h-[44px] rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors flex items-center justify-center cursor-pointer focus:ring-2 focus:ring-slate-900"
            aria-label="Fermer la modale"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {createdOrderData ? (
            /* SUCCESS STEP */
            <div className="text-center space-y-6 animate-fadeIn py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-inner">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {language === 'en' ? 'Order Ref:' : 'Numéro de Commande :'} {createdOrderData.order.order_number}
                </span>
                <h3 className="text-2xl font-serif font-bold text-slate-900 mt-3">
                  {language === 'en' ? 'Your Order Voucher is Ready!' : 'Votre Bon de Commande est Prêt !'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed font-normal">
                  {language === 'en'
                    ? 'Click below to send your pre-filled order directly to ART FASHION workshop on WhatsApp. An advisor will confirm dispatch in a few minutes.'
                    : 'Cliquez ci-dessous pour envoyer directement le récapitulatif pré-rempli à notre atelier sur WhatsApp. Un conseiller confirmera l’expédition sous quelques minutes.'}
                </p>
              </div>

              {/* Order summary card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-500">{language === 'en' ? 'Customer:' : 'Client :'}</span>
                  <span className="font-bold text-slate-900">{createdOrderData.order.customer_name}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-slate-500">{language === 'en' ? 'Phone:' : 'Téléphone :'}</span>
                  <span className="font-mono font-bold text-slate-900">{createdOrderData.order.customer_phone}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-slate-500">{language === 'en' ? 'Zone:' : 'Zone :'}</span>
                  <span className="font-bold text-slate-900">{createdOrderData.order.delivery_zone}</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t border-slate-200 text-sm">
                  <span className="font-bold text-slate-900">{language === 'en' ? 'Total Amount:' : 'Total à payer :'}</span>
                  <span className="font-extrabold text-red-600">{formatFCFA(createdOrderData.order.total)}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2 max-w-md mx-auto">
                <button
                  onClick={handleOpenWhatsApp}
                  className="w-full min-h-[48px] py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-2xl font-bold text-base flex items-center justify-center gap-3 shadow-xl transition-all cursor-pointer focus:ring-2 focus:ring-emerald-500"
                  id="checkout-success-whatsapp-btn"
                >
                  <WhatsAppIcon className="w-6 h-6" />
                  <span>{language === 'en' ? 'Send Order on WhatsApp' : 'Envoyer ma commande sur WhatsApp'}</span>
                </button>

                <button
                  onClick={handleFinish}
                  className="w-full min-h-[44px] py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>{language === 'en' ? 'Close & Continue Shopping' : 'Fermer & Poursuivre les achats'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* FORM STEP */
            <form onSubmit={handleSubmitOrder} className="space-y-5">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block">
                    {language === 'en' ? `Order total (${cart.length} items):` : `Total de la commande (${cart.length} articles) :`}
                  </span>
                  <span className="text-base font-extrabold text-slate-900">{formatFCFA(cartTotal)}</span>
                </div>
                <span className="text-[11px] bg-red-100 text-red-800 font-bold px-2.5 py-1 rounded-full border border-red-200">
                  {language === 'en' ? 'Delivery fee:' : 'Frais livraison :'} {selectedZone.fee === 0 ? (language === 'en' ? 'FREE' : 'GRATUIT') : formatFCFA(selectedZone.fee)}
                </span>
              </div>

              {/* Personal Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-red-600" /> {language === 'en' ? 'Contact Information' : 'Vos Coordonnées'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      {language === 'en' ? 'Full Name *' : 'Nom & Prénom *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={language === 'en' ? 'E.g. Mr. David Mensah' : 'Ex: M. Serge Koudou'}
                      className="w-full min-h-[44px] p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
                      id="checkout-name-input"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      {language === 'en' ? 'Phone / WhatsApp *' : 'Téléphone (Appel & WhatsApp) *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+229 01 97 23 44 66"
                      className="w-full min-h-[44px] p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
                      id="checkout-phone-input"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-600" /> {language === 'en' ? 'Delivery Address (Benin)' : 'Adresse de Livraison (Bénin)'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      {language === 'en' ? 'City *' : 'Ville de destination *'}
                    </label>
                    <select
                      value={deliveryCity}
                      onChange={(e) => setDeliveryCity(e.target.value)}
                      className="w-full min-h-[44px] p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer font-bold"
                      id="checkout-city-select"
                    >
                      <option value="Cotonou">Cotonou</option>
                      <option value="Abomey-Calavi">Abomey-Calavi</option>
                      <option value="Porto-Novo">Porto-Novo</option>
                      <option value="Sèmè-Kpodji">Sèmè-Kpodji</option>
                      <option value="Parakou">Parakou</option>
                      <option value="Bohicon / Abomey">Bohicon / Abomey</option>
                      <option value="Ouidah">Ouidah</option>
                      <option value="Natitingou">Natitingou</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      {language === 'en' ? 'Delivery Zone & Fee *' : 'Zone & Tarifs de Livraison *'}
                    </label>
                    <select
                      value={selectedZone.id}
                      onChange={(e) => {
                        const z = deliveryZones.find((zone) => zone.id === e.target.value);
                        if (z) setSelectedZone(z);
                      }}
                      className="w-full min-h-[44px] p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer font-bold"
                      id="checkout-zone-select"
                    >
                      {deliveryZones.map((z) => (
                        <option key={z.id} value={z.id}>
                          {language === 'en' && z.name_en ? z.name_en : z.name} — {z.fee === 0 ? (language === 'en' ? 'FREE' : 'GRATUIT') : formatFCFA(z.fee)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {language === 'en' ? 'District & Address *' : 'Quartier & Adresse exacte *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder={language === 'en' ? 'E.g. Scoa Gbeto, Rue 403, near Fayola Gallery' : 'Ex: Scoa Gbéto, Rue 403, près Galerie Fayola'}
                    className="w-full min-h-[44px] p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
                    id="checkout-address-input"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      {language === 'en' ? 'Known Landmark (Optional)' : 'Point de repère (Facultatif)'}
                    </label>
                    <input
                      type="text"
                      value={deliveryLandmark}
                      onChange={(e) => setDeliveryLandmark(e.target.value)}
                      placeholder={language === 'en' ? 'E.g. Jean-Paul II Avenue' : 'Ex: Avenue Jean-Paul II'}
                      className="w-full min-h-[44px] p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
                      id="checkout-landmark-input"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      {language === 'en' ? 'Notes for Courier (Optional)' : 'Instructions pour le livreur'}
                    </label>
                    <input
                      type="text"
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      placeholder={language === 'en' ? 'E.g. Call 15 min before arrival' : "Ex: Appeler à l'arrivée Rue 403"}
                      className="w-full min-h-[44px] p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
                      id="checkout-notes-input"
                    />
                  </div>
                </div>
              </div>

              {/* Total & Submit Button */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="bg-red-50 p-3.5 rounded-2xl border border-red-200 flex items-center justify-between text-xs text-red-950 font-medium">
                  <span>{language === 'en' ? 'Total Amount on Delivery:' : 'Montant Total à payer à la livraison :'}</span>
                  <span className="text-base font-extrabold text-red-600">
                    {formatFCFA(cartTotal)}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[48px] py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer focus:ring-2 focus:ring-slate-900"
                  id="checkout-submit-btn"
                >
                  <WhatsAppIcon className="w-5 h-5 text-emerald-400" />
                  <span>{language === 'en' ? 'Generate WhatsApp Order' : 'Générer ma Commande WhatsApp'}</span>
                </button>

                <p className="text-[11px] text-center text-slate-500 font-medium flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {language === 'en' ? 'No bank card required • Cash on delivery' : 'Aucune carte bancaire requise • Paiement à la livraison'}
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

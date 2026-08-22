import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, ArrowUp } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export const WhatsAppFloatingButton: React.FC = () => {
  const { settings, language, cartItemCount, setIsCartOpen, formatFCFA, cartSubtotal } = useStore();
  const [showScrollCart, setShowScrollCart] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setShowScrollCart(true);
      } else {
        setShowScrollCart(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const cleanNum = settings.whatsapp_number.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanNum}?text=${encodeURIComponent(
    language === 'en'
      ? 'Hello ART FASHION Cotonou 👋 I would like to inquire or place an order.'
      : 'Bonjour ART FASHION Cotonou 👋 Je souhaite avoir un renseignement ou passer une commande.'
  )}`;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-5 z-40 flex flex-col items-end gap-3 pointer-events-none">
      {/* Floating Cart Button (Appears above WhatsApp when scrolling) */}
      <button
        onClick={() => setIsCartOpen(true)}
        className={`pointer-events-auto min-h-[48px] bg-slate-950 hover:bg-red-700 text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-300 transform border border-slate-800 hover:border-red-600/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900 group ${showScrollCart
          ? 'translate-y-0 opacity-100 scale-100'
          : 'translate-y-6 opacity-0 scale-95 pointer-events-none'
          }`}
        aria-label="Accéder au panier"
        id="floating-scroll-cart-btn"
      >
        <div className="relative flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-red-400 group-hover:text-white transition-colors" />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-slate-950 shadow-xs">
              {cartItemCount}
            </span>
          )}
        </div>
        <div className="flex flex-col text-left">
          <span className="font-bold text-xs leading-none">
            {language === 'en' ? 'My Cart' : 'Mon Panier'}
          </span>
          {cartItemCount > 0 ? (
            <span className="text-[10px] text-red-300 font-mono font-semibold mt-0.5">
              {formatFCFA(cartSubtotal)}
            </span>
          ) : (
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">
              {language === 'en' ? '0 item' : '0 article'}
            </span>
          )}
        </div>
      </button>

      {/* Floating WhatsApp Contact Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="pointer-events-auto min-w-[48px] min-h-[48px] bg-[#25D366] hover:bg-[#20bd5a] text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-2xl flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer border border-emerald-400/30 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        aria-label="Contacter ART FASHION sur WhatsApp"
        id="floating-whatsapp-btn"
      >
        <WhatsAppIcon className="w-6 h-6 shrink-0" />
        <span className="hidden sm:inline font-bold text-xs">
          {language === 'en' ? 'Need Help? ' : 'Besoin d’aide?'}
        </span>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping absolute top-1 right-1 sm:static sm:animate-none" />
      </a>
    </div>
  );
};

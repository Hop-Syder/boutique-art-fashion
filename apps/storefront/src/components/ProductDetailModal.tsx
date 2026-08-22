import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductVariant } from '@ayele/shared';
import {
  X,
  ShoppingBag,
  Share2,
  Check,
  Truck,
  ShieldCheck,
  Sparkles,
  Info,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    formatFCFA,
    settings,
    setIsCartOpen,
    language,
    t,
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (selectedProduct && selectedProduct.variants.length > 0) {
      const firstVariant = selectedProduct.variants[0];
      setSelectedSize(firstVariant.size);
      setSelectedColor(firstVariant.color);
      setActiveImageIndex(0);
      setQuantity(1);
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const availableSizes = Array.from(new Set(selectedProduct.variants.map((v) => v.size)));
  const availableColors = Array.from(new Set(selectedProduct.variants.map((v) => v.color)));

  const currentVariant: ProductVariant | undefined = selectedProduct.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  ) || selectedProduct.variants.find((v) => v.size === selectedSize) || selectedProduct.variants[0];

  const currentStock = currentVariant ? currentVariant.stock : 0;
  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = () => {
    if (!currentVariant || isOutOfStock) return;
    addToCart(selectedProduct, currentVariant, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      setIsCartOpen(true);
      setSelectedProduct(null);
    }, 500);
  };

  const handleDirectWhatsApp = () => {
    if (!currentVariant) return;
    const cleanNum = settings.whatsapp_number.replace(/\D/g, '');
    const priceText = formatFCFA((currentVariant.price_override || selectedProduct.price) * quantity);

    const msg =
      language === 'en'
        ? `Hello *${settings.store_name}* 👋\n\nI would like to order immediately:\n\n• *${selectedProduct.name}*\n• Size: *${currentVariant.size}*\n• Color: *${currentVariant.color}*\n• Quantity: *${quantity}*\n• Total: *${priceText}*\n\nFor delivery in Cotonou / Calavi.\nPlease confirm availability!`
        : `Bonjour *${settings.store_name}* 👋\n\nJe souhaite commander immédiatement :\n\n• *${selectedProduct.name}*\n• Taille : *${currentVariant.size}*\n• Couleur : *${currentVariant.color}*\n• Quantité : *${quantity}*\n• Prix : *${priceText}*\n\nPour une livraison à Cotonou / Calavi.\nMerci de me confirmer la disponibilité !`;

    window.open(`https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: selectedProduct.name,
          text: `Découvrez ${selectedProduct.name} chez ART FASHION Cotonou`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 relative flex flex-col md:flex-row max-h-[92vh]">
        {/* Close button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 min-w-[44px] min-h-[44px] rounded-full bg-white/90 text-slate-800 hover:bg-slate-100 shadow-md transition-colors flex items-center justify-center cursor-pointer focus:ring-2 focus:ring-slate-900"
          aria-label="Fermer la modale"
          id="modal-close-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Images Gallery */}
        <div className="md:w-1/2 bg-slate-50 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto border-b md:border-b-0 md:border-r border-slate-100">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white shadow-inner border border-slate-200">
            <img
              src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
              alt={selectedProduct.name}
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
            {selectedProduct.is_promo && selectedProduct.compare_price && (
              <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                {language === 'en' ? 'Special Offer' : 'Offre Spéciale'}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {selectedProduct.images.length > 1 && (
            <div className="flex items-center gap-2.5 mt-4 overflow-x-auto pb-1">
              {selectedProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-slate-900 shadow-md scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`Afficher vue ${idx + 1}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Quick reassurance */}
          <div className="mt-4 p-3 rounded-xl bg-white border border-slate-200/80 flex items-center justify-around text-[11px] text-slate-700 shadow-xs font-medium">
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-red-600" /> Cotonou Express
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Rue 403 Zongo
            </span>
          </div>
        </div>

        {/* Right: Details & Purchase Form */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span className="uppercase tracking-wider text-red-600 font-bold">
                {selectedProduct.gender} • {selectedProduct.subcategory || 'Prêt-à-Porter'}
              </span>
              <span className="font-mono">Réf: {selectedProduct.sku}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-slate-900 leading-tight">
              {language === 'en' ? selectedProduct.name_en || selectedProduct.name : selectedProduct.name}
            </h2>

            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                {formatFCFA(currentVariant?.price_override || selectedProduct.price)}
              </span>
              {selectedProduct.compare_price && (
                <span className="text-sm text-slate-400 line-through">
                  {formatFCFA(selectedProduct.compare_price)}
                </span>
              )}
            </div>

            {/* Stock status */}
            <div className="text-xs font-medium">
              {currentStock > 3 ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {language === 'en'
                    ? `In Stock at Rue 403 (${currentStock} items)`
                    : `Disponible en stock Rue 403 (${currentStock} pièces)`}
                </span>
              ) : currentStock > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-red-800 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                  <Sparkles className="w-3.5 h-3.5 text-red-600" />
                  {language === 'en'
                    ? `Limited stock: ${currentStock} left!`
                    : `Stock limité : plus que ${currentStock} pièces disponibles !`}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                  {language === 'en' ? 'Sold out in this variant' : 'Épuisé dans cette variante'}
                </span>
              )}
            </div>

            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              {language === 'en'
                ? selectedProduct.long_description_en || selectedProduct.description_en || selectedProduct.description
                : selectedProduct.long_description || selectedProduct.description}
            </p>

            {/* Size Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                <span>{language === 'en' ? 'Select Size / Shoe Size:' : 'Sélectionner la Taille / Pointure :'}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[44px] min-h-[44px] px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer focus:ring-2 focus:ring-slate-900 ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'bg-white border border-slate-200 text-slate-800 hover:border-slate-300'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Selector */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-800 block">
                {language === 'en' ? 'Color:' : 'Couleur sélectionnée :'}{' '}
                <span className="font-normal text-slate-600">{selectedColor}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((col) => {
                  const isSelected = selectedColor === col;
                  return (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs border transition-all flex items-center justify-center cursor-pointer focus:ring-2 focus:ring-slate-900 ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {col}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs font-semibold text-slate-800">{language === 'en' ? 'Quantity:' : 'Quantité :'}</span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-700 hover:bg-slate-100 text-base font-bold cursor-pointer"
                  aria-label="Diminuer la quantité"
                >
                  -
                </button>
                <span className="px-4 text-sm font-bold text-slate-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(currentStock || 10, q + 1))}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-700 hover:bg-slate-100 text-base font-bold cursor-pointer"
                  disabled={quantity >= currentStock}
                  aria-label="Augmenter la quantité"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full min-h-[48px] py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer focus:ring-2 focus:ring-slate-900 ${
                addedSuccess
                  ? 'bg-emerald-600 text-white'
                  : isOutOfStock
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
              id="modal-add-to-cart-btn"
            >
              {addedSuccess ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>{language === 'en' ? 'Added to Cart!' : 'Ajouté au panier !'}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>{language === 'en' ? 'Add to Cart' : 'Ajouter au panier'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleDirectWhatsApp}
              className="w-full min-h-[48px] py-3.5 rounded-xl font-bold text-sm bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer focus:ring-2 focus:ring-emerald-500"
              id="modal-direct-whatsapp-btn"
            >
              <WhatsAppIcon className="w-5 h-5" />
              <span>{language === 'en' ? 'Order Directly on WhatsApp' : 'Commander directement sur WhatsApp'}</span>
            </button>

            <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
              <button
                onClick={handleShare}
                className="flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-slate-500" />
                <span>{copiedLink ? 'Lien copié !' : language === 'en' ? 'Share item' : 'Partager cet article'}</span>
              </button>
              <span className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-slate-400" /> {language === 'en' ? 'Boutique Rue 403 Cotonou' : 'Essayage possible boutique Rue 403'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

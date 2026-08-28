import React, { useState } from 'react';
import { Product, ProductVariant } from '@ayele/shared';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Eye, Check, Sparkles, MapPin } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, addToCart, formatFCFA, settings, setIsCartOpen, language } = useStore();
  const [selectedVariant] = useState<ProductVariant>(
    product.variants[0] || {
      id: 'default',
      product_id: product.id,
      size: 'Unique',
      color: 'Standard',
      sku: product.sku,
      stock: 1,
    }
  );
  const [justAdded, setJustAdded] = useState(false);

  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  const isOutOfStock = totalStock <= 0;
  const isLowStock = totalStock > 0 && totalStock <= 3;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, selectedVariant, 1);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      setIsCartOpen(true);
    }, 400);
  };

  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanNum = settings.whatsapp_number.replace(/\D/g, '');
    const msg =
      language === 'en'
        ? `Hello Maison ART FASHION 👋\nI am contacting you from your official website (artfashionhome.com) regarding the item:\n• *${product.name}* (${formatFCFA(product.price)})\n• Size: ${selectedVariant.size} (${selectedVariant.color})\n\nIs this piece available for delivery in Cotonou?`
        : `Bonjour Maison ART FASHION 👋\nJe vous contacte depuis votre site web officiel (artfashionhome.com) pour commander cet article :\n• *${product.name}* (${formatFCFA(product.price)})\n• Taille : ${selectedVariant.size} (${selectedVariant.color})\n\nEst-il disponible pour une livraison à Cotonou ?`;

    window.open(`https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const availableSizes = Array.from(new Set(product.variants.map((v) => v.size)));
  const discountPercent = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-red-600/30 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col cursor-pointer relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-slate-900/20 shadow-xs"
      id={`product-card-${product.id}`}
      tabIndex={0}
      role="button"
      aria-label={`${product.name} - ${formatFCFA(product.price)}`}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
        <img
          src={product.images[0] || '/placeholder.webp'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '/placeholder.webp';
          }}
        />

        {/* Ambient Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.is_promo && product.compare_price && (
            <span className="bg-gradient-to-r from-red-600 to-red-700 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase shadow-md tracking-wider border border-red-500/30">
              -{discountPercent}% OFF
            </span>
          )}
          {product.is_new && (
            <span className="bg-slate-950/90 text-amber-400 border border-amber-400/30 backdrop-blur-xs text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              {language === 'en' ? 'New 2026' : 'Nouveau 2026'}
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-slate-900/95 backdrop-blur-xs text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
              {language === 'en' ? 'Sold Out' : 'Épuisé'}
            </span>
          )}
        </div>

        {/* Hover Quick Action Buttons Overlay */}
        <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex flex-col justify-end p-4 z-20">
          <div className="flex items-center gap-2 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-250">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProduct(product);
              }}
              className="flex-1 min-h-[44px] px-3 py-2 bg-white/95 text-slate-900 hover:bg-white rounded-xl text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer focus:ring-2 focus:ring-slate-900 active:scale-95"
              title="Aperçu rapide"
              aria-label={`Aperçu rapide ${product.name}`}
            >
              <Eye className="w-4 h-4 text-slate-900" />
              <span>{language === 'en' ? 'Quick View' : 'Aperçu Rapide'}</span>
            </button>

            <button
              onClick={handleWhatsAppInquiry}
              className="min-h-[44px] px-3.5 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer focus:ring-2 focus:ring-emerald-500 active:scale-95"
              title="Commander sur WhatsApp"
              aria-label={`Commander ${product.name} sur WhatsApp`}
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Available Sizes & Low Stock Overlay Tag */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5 text-white text-[11px] font-medium drop-shadow-md">
            <span className="text-slate-300 text-[10px] uppercase tracking-wider font-semibold">
              {language === 'en' ? 'Sizes:' : 'Tailles:'}
            </span>
            <span className="font-bold text-red-400">
              {availableSizes.slice(0, 4).join(' • ')}
              {availableSizes.length > 4 ? ' +' : ''}
            </span>
          </div>

          {isLowStock && (
            <span className="text-[10px] bg-red-600/90 text-white font-extrabold px-2 py-0.5 rounded-md backdrop-blur-xs shadow-xs">
              ⚡ {totalStock} {language === 'en' ? 'left' : 'restant'}
            </span>
          )}
        </div>
      </div>

      {/* Product Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Rayon & SKU */}
          <div className="flex items-center justify-between text-[11px] font-medium">
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">
              {product.gender} • {product.category_id}
            </span>
            <span className="font-mono text-[10px] text-slate-400">Réf: {product.sku}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-serif font-medium text-slate-950 text-base line-clamp-1 group-hover:text-red-700 transition-colors duration-200">
            {language === 'en' ? product.name_en || product.name : product.name}
          </h3>

          {/* Available Colors Tags */}
          {product.variants.length > 0 && (
            <div className="flex items-center gap-1 mt-1 flex-wrap">
              {Array.from(new Set(product.variants.map((v) => (language === 'en' && v.color_en ? v.color_en : v.color))))
                .slice(0, 3)
                .map((colorName, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200/70"
                  >
                    {colorName}
                  </span>
                ))}
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                {formatFCFA(product.price)}
              </span>
              {product.compare_price && (
                <span className="text-xs text-slate-400 line-through font-normal">
                  {formatFCFA(product.compare_price)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium mt-0.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="truncate">{language === 'en' ? 'In Stock Rue 403' : 'Stock Rue 403'}</span>
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`shrink-0 min-h-[42px] px-3 sm:px-3.5 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer focus:ring-2 focus:ring-slate-900 ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-slate-950 text-white hover:bg-red-700 active:scale-95'
            }`}
            title="Ajouter au panier"
            aria-label={`Ajouter ${product.name} au panier`}
            id={`btn-add-cart-${product.id}`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 shrink-0" />
                <span>{language === 'en' ? 'Added' : 'Ajouté'}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 shrink-0 text-red-400" />
                <span>{language === 'en' ? 'Add' : 'Panier'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

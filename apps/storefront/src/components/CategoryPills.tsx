/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description CategoryPills — Carousel 3D Coverflow des univers de catégories du storefront Art Fashion
 * @created 2026-08-19
 * @updated 2026-08-22
 * 🌐 nexus-partners.xyz
 * 📧 daoudaabassichristian@gmail.com
 */
// ──────────────────────────────────
import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowRight } from 'lucide-react';
import { CoverflowCarousel } from './ui/coverflow-carousel';

export const CategoryPills: React.FC = () => {
  const { setFilters, setCurrentView, language, categories, products } = useStore();

  // Priorise les vraies catégories (avec une photo uploadée par l'admin) au
  // lieu d'un carrousel figé — une catégorie sans photo n'apparaît simplement
  // pas ici tant qu'elle n'en a pas une.
  const categorySlides = categories
    .filter((c) => c.is_active && !c.parent_id && c.image)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((c) => {
      const itemCount = products.filter((p) => p.category_id === c.id).length;
      return {
        src: c.image,
        alt: language === 'en' ? c.name_en : c.name,
        title: language === 'en' ? c.name_en : c.name,
        subtitle: language === 'en' ? c.description_en : c.description,
        meta: [
          { label: language === 'en' ? 'Items' : 'Pièces', value: String(itemCount) },
          { label: 'Boutique', value: 'Rue 403 Cotonou' },
        ],
      };
    });

  if (categorySlides.length === 0) return null;

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-7 bg-gradient-to-b from-slate-900/5 via-slate-900/[0.02] to-transparent rounded-3xl p-6 sm:p-8 border border-slate-200/60 shadow-2xs">
      {/* Header section with Luxury Onyx & Crimson Badge */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="space-y-2">

          <h2 className="text-2xl sm:text-4xl font-serif font-normal text-slate-950 tracking-tight leading-tight">
            {language === 'en' ? 'Exclusive Menswear Universes' : 'Découvrez nos Rayons Sur-Mesure'}
          </h2>

          <div className="flex items-center gap-3 pt-0.5">
            <div className="w-12 h-0.5 bg-gradient-to-r from-red-600 to-red-400 rounded-full" />
            <p className="text-xs sm:text-sm text-slate-600 font-normal">
              {language === 'en'
                ? 'Crafted for the modern gentleman'
                : 'Façonnés pour l\'homme d\'exception'}
            </p>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={() => {
            setFilters((prev) => ({ ...prev, category: 'all', onlyPromo: false, onlyNew: false }));
            setCurrentView('catalog');
          }}
          className="self-start md:self-end px-5 py-2.5 bg-slate-950 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer group"
          id="btn-category-view-all"
        >
          <span>{language === 'en' ? 'Full Collection' : 'Tout le Catalogue'}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 3D Coverflow Carousel Section */}
      <div className="py-2 overflow-hidden">
        <CoverflowCarousel
          slides={categorySlides}
          showCaption
          showNavigation
          showPagination
          cardWidth="clamp(210px, 30vw, 290px)"
        />
      </div>
    </section>
  );
};

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
import { CoverflowCarousel, CoverflowSlide } from './ui/coverflow-carousel';

const CATEGORY_SLIDES: (CoverflowSlide & { categoryId: string })[] = [
  {
    categoryId: 'costumes-habille',
    src: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
    alt: "Costumes & Habillé",
    title: "Costumes & Habillé",
    subtitle: "Costumes 2 & 3 Pièces • Smokings",
    meta: [
      { label: "Rayon", value: "Haute-Couture" },
      { label: "Matière", value: "Laine Super 140" },
      { label: "Boutique", value: "Rue 403 Cotonou" },
    ],
  },
  {
    categoryId: 'hauts',
    src: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    alt: "Hauts — Chemises & Boubous",
    title: "Hauts & Chemiserie",
    subtitle: "Chemises Lin, Polos & Boubous Bazin",
    meta: [
      { label: "Rayon", value: "Hauts Sur-Mesure" },
      { label: "Matière", value: "Lin & Bazin 5 Étoiles" },
      { label: "Boutique", value: "Rue 403 Cotonou" },
    ],
  },
  {
    categoryId: 'bas',
    src: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
    alt: "Bas — Pantalons & Jeans",
    title: "Pantalons & Bas",
    subtitle: "Pantalons Sur-Mesure & Chinos",
    meta: [
      { label: "Rayon", value: "Pantalons Chic" },
      { label: "Matière", value: "Coton & Laine Légère" },
      { label: "Boutique", value: "Rue 403 Cotonou" },
    ],
  },
  {
    categoryId: 'vestes-manteaux',
    src: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
    alt: "Vestes & Manteaux",
    title: "Vestes & Manteaux",
    subtitle: "Blazers, Cuir & Pardessus",
    meta: [
      { label: "Rayon", value: "Outwear Prestige" },
      { label: "Matière", value: "Cuir & Laine Italienne" },
      { label: "Boutique", value: "Rue 403 Cotonou" },
    ],
  },
  {
    categoryId: 'chaussures',
    src: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80",
    alt: "Chaussures & Mocassins",
    title: "Chaussures & Souliers",
    subtitle: "Mocassins Cuir Patiné & Sneakers",
    meta: [
      { label: "Rayon", value: "Souliers de Luxe" },
      { label: "Matière", value: "Cuir Italien Blake" },
      { label: "Boutique", value: "Rue 403 Cotonou" },
    ],
  },
  {
    categoryId: 'accessoires',
    src: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=800&q=80",
    alt: "Accessoires & Maroquinerie",
    title: "Accessoires",
    subtitle: "Ceintures, Portefeuilles & Boutons",
    meta: [
      { label: "Rayon", value: "Maroquinerie d'Art" },
      { label: "Matière", value: "Cuir Reptile & Soie" },
      { label: "Boutique", value: "Rue 403 Cotonou" },
    ],
  },
  {
    categoryId: 'vetements-de-sport',
    src: "https://images.unsplash.com/photo-1483721074573-579847178808?auto=format&fit=crop&w=800&q=80",
    alt: "Vêtements de Sport",
    title: "Vêtements de Sport",
    subtitle: "Survêtements & Ensembles Sport",
    meta: [
      { label: "Rayon", value: "Sportswear Luxury" },
      { label: "Matière", value: "Textile Respirant" },
      { label: "Boutique", value: "Rue 403 Cotonou" },
    ],
  },
];

export const CategoryPills: React.FC = () => {
  const { setFilters, setCurrentView, language } = useStore();

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
          slides={CATEGORY_SLIDES}
          showCaption
          showNavigation
          showPagination
          cardWidth="clamp(210px, 30vw, 290px)"
        />
      </div>
    </section>
  );
};

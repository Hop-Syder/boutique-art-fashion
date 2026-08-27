/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description HomeView — Vue principale du storefront : Hero, Catégories, Nouveautés, Promos, Avis clients
 * @created 2026-08-19
 * @updated 2026-08-22
 * 🌐 nexus-partners.xyz
 * 📧 daoudaabassichristian@gmail.com
 */
// ──────────────────────────────────
import React from 'react';
import { useStore } from '../context/StoreContext';
import { HeroSection } from './HeroSection';
import { CategoryPills } from './CategoryPills';
import { ProductCard } from './ProductCard';
import { CoverflowCarousel } from './ui/coverflow-carousel';
import {
  Zap,
  ArrowRight,
  ShoppingBag,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Star,
  MapPin,
  PackageCheck,
  Navigation,
  Compass,
  Clock,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

import { ReviewsCarousel } from './ReviewsCarousel';
import { OrderProcessSteps } from './OrderProcessSteps';

export const HomeView: React.FC = () => {
  const { products, setCurrentView, setFilters, settings, language, sectionsConfig } = useStore();
  const [mapTab, setMapTab] = React.useState<'interactive' | 'visual'>('interactive');

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'ART FASHION Rue 403 Zongo Scoa Gbeto Cotonou Benin'
  )}`;

  const newProducts = products.filter((p) => p.is_new).slice(0, 3);
  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 6);

  const handleViewAllNew = () => {
    setFilters((prev) => ({ ...prev, category: 'all', onlyNew: true, onlyPromo: false }));
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewAllFeatured = () => {
    setFilters((prev) => ({ ...prev, category: 'all', onlyNew: false, onlyPromo: false }));
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Categories Pills */}
      <CategoryPills />

      {/* 3. Nouveautés 2026 Section avec Coverflow Carousel 3D */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              {language === 'en' ? sectionsConfig.collections?.newArrivals?.title_en : sectionsConfig.collections?.newArrivals?.title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'en'
                ? sectionsConfig.collections?.newArrivals?.description_en
                : sectionsConfig.collections?.newArrivals?.description}
            </p>
          </div>

          <button
            onClick={handleViewAllNew}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer min-h-[44px]"
          >
            <span>{language === 'en' ? 'View all new arrivals' : 'Voir toutes les nouveautés'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Carousel 3D */}
        {(sectionsConfig.carousel3D?.length ?? 0) > 0 && (
          <div className="mb-12 mt-8">
            <CoverflowCarousel
              slides={sectionsConfig.carousel3D.map(slide => ({
                src: slide.image,
                alt: slide.title,
                title: language === 'en' ? slide.title_en : slide.title,
                subtitle: language === 'en' ? slide.subtitle_en : slide.subtitle,
                meta: slide.meta?.map(m => ({
                  label: language === 'en' && m.label_en ? m.label_en : m.label,
                  value: language === 'en' && m.value_en ? m.value_en : m.value
                }))
              }))}
              showCaption
              showPagination
              showNavigation
            />
          </div>
        )}



        {/* Product Cards Grid below Carousel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {newProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 4. The 6-Step Mobile-Optimized WhatsApp Purchasing Experience Guide */}
      <OrderProcessSteps />

      {/* 5. Incontournables & Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-slate-900">
              {language === 'en' ? sectionsConfig.collections?.signaturePieces?.title_en : sectionsConfig.collections?.signaturePieces?.title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'en'
                ? sectionsConfig.collections?.signaturePieces?.description_en
                : sectionsConfig.collections?.signaturePieces?.description}
            </p>
          </div>

          <button
            onClick={handleViewAllFeatured}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer min-h-[44px]"
          >
            <span>{language === 'en' ? 'Explore entire catalog' : 'Explorer tout le catalogue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 5. Section Avis Clients Réels Google Maps (Carrousel 2 Lignes Sens Opposés) */}
      <ReviewsCarousel />
    </div>
  );
};

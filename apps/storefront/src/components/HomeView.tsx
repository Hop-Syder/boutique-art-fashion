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
import { CoverflowCarousel, CoverflowSlide } from './ui/coverflow-carousel';
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

const COVERFLOW_SLIDES: CoverflowSlide[] = [
  {
    src: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
    alt: "Costume Croisé Zongo Prestige",
    title: "Costume Croisé \"Zongo Prestige\"",
    subtitle: "185 000 FCFA • Série Limitée",
    meta: [
      { label: "Collection", value: "Haute-Couture 2026" },
      { label: "Matière", value: "Laine Vierge & Soie" },
      { label: "Atelier", value: "Rue 403 Cotonou" },
    ],
  },
  {
    src: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    alt: "Chemise Lin Égyptien Scoa Gbéto",
    title: "Chemise Lin Égyptien Brodé",
    subtitle: "45 000 FCFA • Collection Lin",
    meta: [
      { label: "Collection", value: "Été 2026" },
      { label: "Matière", value: "100% Lin Égyptien" },
      { label: "Atelier", value: "Rue 403 Cotonou" },
    ],
  },
  {
    src: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    alt: "Grand Boubou Bazin Riche Or Imperial",
    title: "Grand Boubou Bazin Imperial",
    subtitle: "210 000 FCFA • Bazin Getzner",
    meta: [
      { label: "Collection", value: "Prestige Royal" },
      { label: "Matière", value: "Bazin Riche 5 étoiles" },
      { label: "Atelier", value: "Rue 403 Cotonou" },
    ],
  },
  {
    src: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80",
    alt: "Mocassins Cuir Italien Zongo",
    title: "Mocassins Cuir Italien Patiné",
    subtitle: "65 000 FCFA • Chaussures",
    meta: [
      { label: "Collection", value: "Souliers Luxe" },
      { label: "Matière", value: "Cuir Pleine Fleur" },
      { label: "Atelier", value: "Finition Main" },
    ],
  },
  {
    src: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80",
    alt: "Blazer 3 Pièces Prince de Galles",
    title: "Blazer Prince de Galles Noir & Doré",
    subtitle: "135 000 FCFA • Tailleur",
    meta: [
      { label: "Collection", value: "Gentleman 2026" },
      { label: "Matière", value: "Laine italienne Super 140" },
      { label: "Atelier", value: "Rue 403 Cotonou" },
    ],
  },
];

export const HomeView: React.FC = () => {
  const { products, setCurrentView, setFilters, settings, language } = useStore();
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
              Les Nouveautés de l'Atelier
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Des pièces exclusives confectionnées en séries limitées dans notre atelier à Cotonou.
            </p>
          </div>

          <button
            onClick={handleViewAllNew}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer min-h-[44px]"
          >
            <span>Voir toutes les nouveautés</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>



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
              Les Pièces Signature
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Les modèles les plus plébiscités par nos clientes et clients à Cotonou, Calavi et Porto-Novo.
            </p>
          </div>

          <button
            onClick={handleViewAllFeatured}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer min-h-[44px]"
          >
            <span>Explorer tout le catalogue</span>
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

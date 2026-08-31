import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { CatalogView } from './components/CatalogView';
import { AboutView } from './components/AboutView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { currentView, filters, categories, selectedProduct, isTrackingOpen, setIsTrackingOpen } = useStore();

  // ── Gestionnaire SEO dynamique ─────────────────────────────────────────────
  // Met à jour : title, description, OG, Twitter Card, canonical
  // Optimisé marché Bénin / Afrique de l'Ouest
  React.useEffect(() => {
    const BRAND = 'ART FASHION Cotonou';
    const SUFFIX_FR = 'Livraison à domicile · Cotonou, Bénin';

    // Données SEO par vue / contexte
    type SeoData = { title: string; description: string; canonical?: string };
    let seo: SeoData;

    if (selectedProduct) {
      const descClean = selectedProduct.description.substring(0, 140);
      seo = {
        title: `${selectedProduct.name} — ${BRAND} | Boutique Mode Homme`,
        description: `${selectedProduct.name} chez ART FASHION Cotonou. ${descClean}. Achat en ligne avec livraison rapide au Bénin. Paiement à la livraison.`,
        canonical: `https://artfashionhome.com/?view=catalog`,
      };
    } else if (currentView === 'catalog') {
      if (filters.category && filters.category !== 'all') {
        const cat = categories.find((c) => c.id === filters.category);
        const catName = cat ? cat.name : filters.category;
        const catSeo: Record<string, { title: string; desc: string }> = {
          costumes: {
            title: `Costumes Homme Cotonou — Blazers & Costumes Croisés | ${BRAND}`,
            desc: `Découvrez notre collection de costumes 3 pièces croisés italiens, blazers et costumes de cérémonie pour homme à Cotonou. ${SUFFIX_FR}.`,
          },
          hauts: {
            title: `Chemises & Hauts Homme Bénin — Lin Brodé & Coton | ${BRAND}`,
            desc: `Chemises de luxe en lin égyptien, coton brodé et bazin pour homme. Boutique ART FASHION Rue 403 Zongo, Cotonou. ${SUFFIX_FR}.`,
          },
          boubous: {
            title: `Grands Boubous Bazin Getzner Cotonou — Bénin | ${BRAND}`,
            desc: `Les plus beaux grands boubous en bazin riche Getzner 5 étoiles à Cotonou. Broderie traditionnelle, qualité premium. ${SUFFIX_FR}.`,
          },
          chaussures: {
            title: `Chaussures & Mocassins Cuir Homme Cotonou | ${BRAND}`,
            desc: `Mocassins italiens, richelieus et chaussures de luxe pour homme à Cotonou, Bénin. ART FASHION Rue 403 Zongo. ${SUFFIX_FR}.`,
          },
          accessoires: {
            title: `Accessoires Mode Homme Cotonou — Ceintures & Maroquinerie | ${BRAND}`,
            desc: `Ceintures cuir, porte-monnaie, portefeuilles et accessoires mode homme de luxe à Cotonou. ${SUFFIX_FR}.`,
          },
          bas: {
            title: `Pantalons & Bas Homme Luxe Cotonou | ${BRAND}`,
            desc: `Pantalons de costume, pantalons chino et bas mode homme haut de gamme. ART FASHION Cotonou, Bénin. ${SUFFIX_FR}.`,
          },
          vestes: {
            title: `Vestes & Manteaux Homme Cotonou | ${BRAND}`,
            desc: `Vestes blazer, gilets de costume et manteaux pour homme à Cotonou. Collection ART FASHION. ${SUFFIX_FR}.`,
          },
        };
        const catData = catSeo[filters.category];
        seo = catData
          ? { title: catData.title, description: catData.desc, canonical: `https://artfashionhome.com/?view=catalog&category=${filters.category}` }
          : {
              title: `${catName} — Collection Mode Homme | ${BRAND}`,
              description: `Collection ${catName} pour homme chez ART FASHION, boutique de référence à Cotonou, Bénin. ${SUFFIX_FR}.`,
              canonical: `https://artfashionhome.com/?view=catalog`,
            };
      } else {
        seo = {
          title: `Catalogue Vêtements Homme Luxe — Costumes, Boubous, Chaussures | ${BRAND}`,
          description: `Parcourez tout le catalogue ART FASHION Cotonou : costumes croisés, grands boubous Bazin Getzner, chemises lin, mocassins cuir. Livraison rapide au Bénin.`,
          canonical: `https://artfashionhome.com/?view=catalog`,
        };
      }
    } else if (currentView === 'about') {
      seo = {
        title: `À Propos & Contact — Boutique ART FASHION Rue 403 Zongo, Cotonou | Bénin`,
        description: `Découvrez ART FASHION, votre boutique mode homme de référence à Cotonou (Rue 403 Zongo / Scoa Gbéto). Histoire, valeurs, horaires et itinéraire. Tél : +229 01 97 23 44 66.`,
        canonical: `https://artfashionhome.com/?view=about`,
      };
    } else {
      seo = {
        title: `ART FASHION Cotonou — Boutique Prêt-à-Porter Homme Luxe | Bénin & Afrique de l'Ouest`,
        description: `ART FASHION, boutique mode homme haut de gamme à Cotonou (Rue 403 Zongo). Costumes, boubous Bazin Getzner, chemises lin, mocassins cuir. Livraison à domicile Cotonou, Calavi, Porto-Novo. Paiement à la livraison.`,
        canonical: `https://artfashionhome.com/`,
      };
    }

    // Application des balises SEO
    document.title = seo.title;

    const setMeta = (sel: string, attr: string, val: string) => {
      const el = document.querySelector(sel);
      if (el) el.setAttribute(attr, val);
    };

    setMeta('meta[name="description"]', 'content', seo.description);
    setMeta('meta[property="og:title"]', 'content', seo.title);
    setMeta('meta[property="og:description"]', 'content', seo.description);
    setMeta('meta[name="twitter:title"]', 'content', seo.title);
    setMeta('meta[name="twitter:description"]', 'content', seo.description);

    // Mise à jour du lien canonique
    if (seo.canonical) {
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = seo.canonical;
    }
  }, [currentView, filters.category, selectedProduct, categories]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A1816] overflow-x-hidden w-full max-w-full relative">
      {/* Top Header Navigation */}
      <Header />

      {/* Main Content Router */}
      <main className="flex-1 overflow-x-hidden w-full max-w-full">
        {currentView === 'home' && <HomeView />}
        {currentView === 'catalog' && <CatalogView />}
        {currentView === 'about' && <AboutView />}
      </main>

      {/* Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal isOpen={isTrackingOpen} onClose={() => setIsTrackingOpen(false)} />

      {/* Global Bottom Navigation */}
      <MobileBottomNav />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

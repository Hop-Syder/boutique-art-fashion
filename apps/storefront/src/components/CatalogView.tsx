import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import {
  SlidersHorizontal,
  Search,
  RotateCcw,
  Sparkles,
  Tag,
  Check,
  ChevronDown,
  X,
  Filter,
  PackageCheck,
} from 'lucide-react';

export const CatalogView: React.FC = () => {
  const { products, categories, filtersConfig, filters, setFilters, resetFilters, language, t } = useStore();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Active categories tree
  const activeCategories = useMemo(
    () => categories.filter((c) => c.is_active !== false && !c.is_archived),
    [categories]
  );

  const mainCategories = useMemo(
    () => activeCategories.filter((c) => !c.parent_id),
    [activeCategories]
  );

  const getSubcategories = (parentId: string) => {
    return activeCategories.filter((c) => c.parent_id === parentId);
  };

  // Selected Category & Allowed Filters
  const selectedCategoryObj = useMemo(
    () => activeCategories.find((c) => c.id === filters.category),
    [activeCategories, filters.category]
  );

  const allowedFilterIds = useMemo(() => {
    if (filters.category === 'all' || !selectedCategoryObj) return null;
    return selectedCategoryObj.allowed_filter_ids || [];
  }, [filters.category, selectedCategoryObj]);

  const visibleFilterGroups = useMemo(() => {
    return filtersConfig.filter((fGroup) => {
      if (!fGroup.is_active || fGroup.is_archived) return false;
      if (['matiere', 'marque', 'coupe'].includes(fGroup.id)) return false;
      if (allowedFilterIds === null) return true; // Show all if "all" categories selected
      return allowedFilterIds.includes(fGroup.id);
    });
  }, [filtersConfig, allowedFilterIds]);

  const allSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.variants.forEach((v) => set.add(v.size)));
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category & Subcategory matching
        if (filters.category !== 'all') {
          const isDirectMatch = p.category_id === filters.category || p.subcategory === filters.category;
          const isSubcategoryMatch = activeCategories
            .filter((c) => c.parent_id === filters.category)
            .some((sub) => sub.id === p.category_id || sub.id === p.subcategory);
          if (!isDirectMatch && !isSubcategoryMatch) return false;
        }

        if (filters.gender !== 'all' && p.gender !== filters.gender) return false;
        if (filters.onlyPromo && !p.is_promo) return false;
        if (filters.onlyNew && !p.is_new) return false;

        if (filters.inStockOnly) {
          const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
          if (totalStock <= 0) return false;
        }

        if (filters.size !== 'all') {
          const hasSizeInVariant = p.variants.some((v) => v.size === filters.size);
          const hasSizeInAttr = p.attributes?.taille === filters.size || p.attributes?.pointure === filters.size;
          if (!hasSizeInVariant && !hasSizeInAttr) return false;
        }

        if (filters.color !== 'all') {
          const hasColorInVariant = p.variants.some((v) =>
            v.color.toLowerCase().includes(filters.color.toLowerCase())
          );
          const hasColorInAttr = String(p.attributes?.couleur || '').toLowerCase().includes(filters.color.toLowerCase());
          if (!hasColorInVariant && !hasColorInAttr) return false;
        }

        if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;

        if (filters.searchQuery.trim()) {
          const normalizeText = (text: string) =>
            text
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '');

          const searchTerms = normalizeText(filters.searchQuery).trim().split(/\s+/);

          const matchesAllTerms = searchTerms.every((term) => {
            const matchName = normalizeText(p.name).includes(term) || (p.name_en && normalizeText(p.name_en).includes(term));
            const matchDesc = normalizeText(p.description).includes(term) || (p.description_en && normalizeText(p.description_en).includes(term));
            const matchCategory = normalizeText(p.category_id).includes(term);
            const matchCatObj = categories.some(
              (c) => c.id === p.category_id && (normalizeText(c.name).includes(term) || (c.name_en && normalizeText(c.name_en).includes(term)))
            );
            const matchTags = p.tags.some((t) => normalizeText(t).includes(term));
            const matchSku = normalizeText(p.sku).includes(term);
            const matchGender = normalizeText(p.gender).includes(term);
            const matchVariants = p.variants.some(
              (v) => normalizeText(v.color).includes(term) || normalizeText(v.size).includes(term) || normalizeText(v.sku).includes(term)
            );
            const matchAttrs = Object.entries(p.attributes || {}).some(
              ([k, v]) => normalizeText(k).includes(term) || normalizeText(String(v)).includes(term)
            );

            return matchName || matchDesc || matchCategory || matchCatObj || matchTags || matchSku || matchGender || matchVariants || matchAttrs;
          });

          if (!matchesAllTerms) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') return a.price - b.price;
        if (filters.sortBy === 'price-desc') return b.price - a.price;
        if (filters.sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        if (filters.sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, filters, activeCategories]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.gender !== 'all') count++;
    if (filters.size !== 'all') count++;
    if (filters.color !== 'all') count++;
    if (filters.onlyPromo) count++;
    if (filters.onlyNew) count++;
    if (filters.inStockOnly) count++;
    if (filters.searchQuery.trim()) count++;
    if (filters.maxPrice < 300000) count++;
    return count;
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900">
            {language === 'en' ? "Men's Luxury Catalog" : 'Catalogue Prêt-à-Porter'}
          </h1>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
              placeholder={language === 'en' ? 'Search suits, shirts, boubous...' : 'Rechercher costumes, chemises...'}
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
              id="catalog-search-input"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Effacer recherche"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
              className="appearance-none pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 cursor-pointer transition-all min-h-[44px]"
              id="catalog-sort-select"
              aria-label="Trier les résultats"
            >
              <option value="featured">✨ {language === 'en' ? 'Featured' : 'En vedette'}</option>
              <option value="price-asc">{language === 'en' ? 'Price: Low to High' : 'Prix : Croissant'}</option>
              <option value="price-desc">{language === 'en' ? 'Price: High to Low' : 'Prix : Décroissant'}</option>
              <option value="newest">{language === 'en' ? 'Newest' : 'Plus récents'}</option>
              <option value="name">{language === 'en' ? 'Alphabetical' : 'Ordre alphabétique'}</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden min-h-[44px] px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5 hover:bg-slate-50 cursor-pointer"
            id="catalog-mobile-filters-btn"
          >
            <SlidersHorizontal className="w-4 h-4 text-red-600" />
            <span>Filtres</span>
            {activeFilterCount > 0 && (
              <span className="bg-slate-900 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        
        {/* ── Desktop Filter Sidebar (Sticky & Scrollable) ── */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-red-600" />
              <h3 className="font-serif font-bold text-slate-900 text-sm">
                {language === 'en' ? 'Search Filters' : 'Filtres de recherche'}
              </h3>
            </div>
            {activeFilterCount > 0 && (
              <span className="bg-red-50 text-red-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-red-200">
                {activeFilterCount}
              </span>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              {language === 'en' ? 'Category' : 'Rayons & Catégories'}
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setFilters((p) => ({ ...p, category: 'all' }))}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between min-h-[40px] cursor-pointer ${filters.category === 'all'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
                  }`}
              >
                <span>{language === 'en' ? 'All Categories' : 'Toutes les pièces'}</span>
                {filters.category === 'all' && <Check className="w-3.5 h-3.5 text-red-500" />}
              </button>

              {mainCategories.map((cat) => {
                const subs = getSubcategories(cat.id);
                const isCatSelected = filters.category === cat.id;

                const categoryLabels: Record<string, string> = {
                  'hauts': '👕 Hauts (Chemises, Boubous...)',
                  'bas': '👖 Bas (Pantalons, Jeans...)',
                  'vestes-manteaux': '🧥 Vestes & manteaux',
                  'costumes-habille': '🤵 Costumes & habillé',
                  'sous-vetements': '🩲 Sous-vêtements',
                  'chaussures': '👞 Chaussures',
                  'accessoires': '💼 Accessoires',
                  'vetements-de-sport': '🏋️ Vêtements de sport',
                  'autre': '🎁 Autre',
                };

                const displayName = categoryLabels[cat.id] || (language === 'en' && cat.name_en ? cat.name_en : cat.name);

                return (
                  <div key={cat.id} className="space-y-1">
                    <button
                      onClick={() => setFilters((p) => ({ ...p, category: cat.id }))}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between min-h-[40px] cursor-pointer ${isCatSelected
                        ? 'bg-slate-900 text-white font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      <span>{displayName}</span>
                      {isCatSelected && <Check className="w-3.5 h-3.5 text-red-500" />}
                    </button>

                    {/* Render Subcategories */}
                    {subs.length > 0 && (
                      <div className="ml-3 pl-2 border-l-2 border-slate-100 space-y-1">
                        {subs.map((sub) => {
                          const isSubSelected = filters.category === sub.id;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => setFilters((p) => ({ ...p, category: sub.id }))}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors flex items-center justify-between cursor-pointer ${isSubSelected
                                ? 'bg-red-50 text-red-700 font-bold'
                                : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                              <span>{sub.name}</span>
                              {isSubSelected && <Check className="w-3 h-3 text-red-600" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* DYNAMIC FILTER GROUPS */}
          {visibleFilterGroups.map((fGroup) => {
            if (fGroup.id === 'taille' || fGroup.id === 'pointure') {
              return (
                <div key={fGroup.id} className="space-y-2 pt-3 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    {fGroup.name}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setFilters((p) => ({ ...p, size: 'all' }))}
                      className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-semibold border cursor-pointer ${filters.size === 'all'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                    >
                      Toutes
                    </button>
                    {fGroup.options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setFilters((p) => ({ ...p, size: opt.value }))}
                        className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-semibold border cursor-pointer ${filters.size === opt.value
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }

            if (fGroup.type === 'color') {
              return (
                <div key={fGroup.id} className="space-y-2 pt-3 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    {fGroup.name}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilters((p) => ({ ...p, color: 'all' }))}
                      className={`min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer ${filters.color === 'all'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white border-slate-200 text-slate-700'
                        }`}
                    >
                      Toutes
                    </button>
                    {fGroup.options.map((opt) => {
                      const isSel = filters.color === opt.value;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setFilters((p) => ({ ...p, color: opt.value }))}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${isSel
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                          {opt.color_hex && (
                            <span
                              className="w-3 h-3 rounded-full border border-slate-300 shrink-0"
                              style={{ backgroundColor: opt.color_hex }}
                            />
                          )}
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <div key={fGroup.id} className="space-y-2 pt-3 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  {fGroup.name}
                </label>
                <div className="space-y-1">
                  {fGroup.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() =>
                        setFilters((p) => ({
                          ...p,
                          color: p.color === opt.value ? 'all' : opt.value,
                        }))
                      }
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${filters.color === opt.value
                        ? 'bg-red-50 text-red-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      <span>{opt.label}</span>
                      {filters.color === opt.value && <Check className="w-3.5 h-3.5 text-red-600" />}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Special Flags */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              {language === 'en' ? 'Special Selection' : 'Sélections Spéciales'}
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer min-h-[36px]">
                <input
                  type="checkbox"
                  checked={filters.onlyPromo}
                  onChange={(e) => setFilters((p) => ({ ...p, onlyPromo: e.target.checked }))}
                  className="rounded text-red-600 focus:ring-slate-900 w-4 h-4"
                />
                <span className="flex items-center gap-1 font-medium">
                  <Tag className="w-3.5 h-3.5 text-rose-600" />
                  {language === 'en' ? 'Special Offers' : 'Articles en promotion'}
                </span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer min-h-[36px]">
                <input
                  type="checkbox"
                  checked={filters.onlyNew}
                  onChange={(e) => setFilters((p) => ({ ...p, onlyNew: e.target.checked }))}
                  className="rounded text-red-600 focus:ring-slate-900 w-4 h-4"
                />
                <span className="flex items-center gap-1 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-red-600" />
                  {language === 'en' ? 'New Arrivals' : 'Nouveautés 2026'}
                </span>
              </label>
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-800 uppercase tracking-wider">
                {language === 'en' ? 'Max Price' : 'Prix Maximum'}
              </label>
              <span className="font-bold text-red-600">
                {new Intl.NumberFormat('fr-FR').format(filters.maxPrice)} FCFA
              </span>
            </div>
            <input
              type="range"
              min={20000}
              max={300000}
              step={5000}
              value={filters.maxPrice}
              onChange={(e) => setFilters((p) => ({ ...p, maxPrice: Number(e.target.value) }))}
              className="w-full accent-slate-900 cursor-pointer"
            />
          </div>

          {/* Reset Filters */}
          <div className="pt-4 border-t border-slate-100 pb-2">
            <button
              onClick={() => resetFilters()}
              className="w-full min-h-[44px] py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>{language === 'en' ? 'Reset Filters' : 'Réinitialiser les filtres'}</span>
            </button>
          </div>
        </aside>

        {/* ── Mobile Filter Modal Drawer (Full Screen, Scrollable & Fixed Controls) ── */}
        {mobileFilterOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
            <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-slideInRight">
              
              {/* Header Fixe */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-red-600" />
                  <h3 className="font-serif font-bold text-slate-900 text-base">
                    {language === 'en' ? 'Filters' : 'Filtres de recherche'}
                  </h3>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 cursor-pointer"
                  aria-label="Fermer filtres"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Corps Défilant (Scrollable Body avec padding bas pour le confort) */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-28">
                
                {/* Catégories */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    {language === 'en' ? 'Category' : 'Rayons & Catégories'}
                  </label>
                  <div className="space-y-1">
                    <button
                      onClick={() => setFilters((p) => ({ ...p, category: 'all' }))}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between min-h-[42px] cursor-pointer ${
                        filters.category === 'all'
                          ? 'bg-slate-900 text-white font-bold'
                          : 'text-slate-700 bg-slate-50'
                      }`}
                    >
                      <span>{language === 'en' ? 'All Categories' : 'Toutes les pièces'}</span>
                      {filters.category === 'all' && <Check className="w-4 h-4 text-red-500" />}
                    </button>

                    {mainCategories.map((cat) => {
                      const isCatSelected = filters.category === cat.id;
                      const subs = getSubcategories(cat.id);
                      return (
                        <div key={cat.id} className="space-y-1">
                          <button
                            onClick={() => setFilters((p) => ({ ...p, category: cat.id }))}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between min-h-[42px] cursor-pointer ${
                              isCatSelected ? 'bg-slate-900 text-white font-bold' : 'text-slate-700 bg-slate-50'
                            }`}
                          >
                            <span>{cat.name}</span>
                            {isCatSelected && <Check className="w-4 h-4 text-red-500" />}
                          </button>
                          {subs.length > 0 && (
                            <div className="ml-3 pl-2 border-l-2 border-slate-200 space-y-1">
                              {subs.map((sub) => (
                                <button
                                  key={sub.id}
                                  onClick={() => setFilters((p) => ({ ...p, category: sub.id }))}
                                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer ${
                                    filters.category === sub.id ? 'bg-red-50 text-red-700 font-bold' : 'text-slate-600 bg-white border border-slate-100'
                                  }`}
                                >
                                  <span>{sub.name}</span>
                                  {filters.category === sub.id && <Check className="w-3.5 h-3.5 text-red-600" />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Filtres de tailles */}
                {visibleFilterGroups
                  .filter((f) => f.id === 'taille' || f.id === 'pointure')
                  .map((fGroup) => (
                    <div key={fGroup.id} className="space-y-2 pt-3 border-t border-slate-100">
                      <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                        {fGroup.name}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setFilters((p) => ({ ...p, size: 'all' }))}
                          className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                            filters.size === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          Toutes
                        </button>
                        {fGroup.options.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setFilters((p) => ({ ...p, size: opt.value }))}
                            className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                              filters.size === opt.value ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                {/* Filtres de couleurs */}
                {visibleFilterGroups
                  .filter((f) => f.type === 'color')
                  .map((fGroup) => (
                    <div key={fGroup.id} className="space-y-2 pt-3 border-t border-slate-100">
                      <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                        {fGroup.name}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setFilters((p) => ({ ...p, color: 'all' }))}
                          className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                            filters.color === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          Toutes
                        </button>
                        {fGroup.options.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setFilters((p) => ({ ...p, color: opt.value }))}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer min-h-[38px] ${
                              filters.color === opt.value ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            {opt.color_hex && (
                              <span className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" style={{ backgroundColor: opt.color_hex }} />
                            )}
                            <span>{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                {/* Sélections spéciales */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    {language === 'en' ? 'Special Selection' : 'Sélections Spéciales'}
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer min-h-[40px] p-2 bg-slate-50 rounded-xl">
                      <input
                        type="checkbox"
                        checked={filters.onlyPromo}
                        onChange={(e) => setFilters((p) => ({ ...p, onlyPromo: e.target.checked }))}
                        className="rounded text-red-600 focus:ring-slate-900 w-5 h-5"
                      />
                      <span className="flex items-center gap-1.5 font-bold">
                        <Tag className="w-4 h-4 text-rose-600" />
                        {language === 'en' ? 'Special Offers' : 'Articles en promotion'}
                      </span>
                    </label>

                    <label className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer min-h-[40px] p-2 bg-slate-50 rounded-xl">
                      <input
                        type="checkbox"
                        checked={filters.onlyNew}
                        onChange={(e) => setFilters((p) => ({ ...p, onlyNew: e.target.checked }))}
                        className="rounded text-red-600 focus:ring-slate-900 w-5 h-5"
                      />
                      <span className="flex items-center gap-1.5 font-bold">
                        <Sparkles className="w-4 h-4 text-red-600" />
                        {language === 'en' ? 'New Arrivals' : 'Nouveautés 2026'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Prix Max */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-slate-800 uppercase tracking-wider">
                      {language === 'en' ? 'Max Price' : 'Prix Maximum'}
                    </label>
                    <span className="font-bold text-red-600">
                      {new Intl.NumberFormat('fr-FR').format(filters.maxPrice)} FCFA
                    </span>
                  </div>
                  <input
                    type="range"
                    min={20000}
                    max={300000}
                    step={5000}
                    value={filters.maxPrice}
                    onChange={(e) => setFilters((p) => ({ ...p, maxPrice: Number(e.target.value) }))}
                    className="w-full accent-slate-900 cursor-pointer h-2"
                  />
                </div>

              </div>

              {/* Footer Fixe avec bouton d'action */}
              <div className="p-4 bg-white/95 backdrop-blur-md border-t border-slate-100 flex gap-3 shadow-lg">
                <button
                  onClick={() => resetFilters()}
                  className="px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-slate-500" />
                  <span>Réinitialiser</span>
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-3 px-4 bg-slate-950 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md text-center"
                >
                  Voir les articles ({filteredProducts.length})
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Product Cards Grid */}
        <main className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 max-w-lg mx-auto shadow-sm">
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto text-2xl">
                👔
              </div>
              <h3 className="text-xl font-serif font-medium text-slate-900">
                {language === 'en' ? 'No items match your criteria' : 'Aucun modèle ne correspond à votre recherche'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {language === 'en'
                  ? 'Try expanding price range or resetting active filters.'
                  : 'Essayez d’élargir vos critères de recherche ou de réinitialiser vos filtres.'}
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-red-400" />
                <span>{language === 'en' ? 'Show Full Catalog' : 'Afficher tout le catalogue'}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

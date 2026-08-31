/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description Product Management Component for Art Fashion Admin CMS
 * @created 2026-08-19
 * @updated 2026-08-19
 * 🌐 ceo.nexus-partners.xyz
 * 📧 daoudaabassichristian@gmail.com
 */

import React, { useState, useMemo } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Product, ProductVariant } from '@ayele/shared';
import { ImageUploadInput } from './ImageUploadInput';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  Check,
  X,
  Sparkles,
  Layers,
  Tag,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';

// Emoji décoratif optionnel pour les grandes catégories et sous-rayons.
// Le VRAI nom de la catégorie (issu de vos données) est toujours utilisé —
// cette table ne fait qu'ajouter un emoji devant quand l'identifiant est connu.
const CATEGORY_EMOJI: Record<string, string> = {
  // ── 1. Univers : Prêt-à-porter Masculin ──
  'pret-a-porter-masculin': '👔',
  'elegance-ceremonie': '🤵',
  'casual-quotidien': '👕',
  'saisonnier-exterieur': '🧥',
  'confort-detente': '🏋️',

  // ── 2. Univers : Chaussures & Souliers Homme ──
  'chaussures-souliers': '👞',
  'ville-habille': '👞',
  'casual-tendance': '👟',
  'legerete': '🩴',
  'prestige-exotique': '🐊',

  // ── 3. Univers : Accessoires & Maroquinerie ──
  'accessoires-maroquinerie': '💼',
  'montres': '⌚',
  'ceintures-cuir': '👖',
  'petite-maroquinerie-divers': '👛',

  // ── Rétrocompatibilité ──
  hauts: '👕',
  bas: '👖',
  'vestes-manteaux': '🧥',
  'costumes-habille': '🤵',
  'sous-vetements': '🩲',
  chaussures: '👞',
  accessoires: '💼',
  'vetements-de-sport': '🏋️',
  autre: '🎁',
};

export const ProductManager: React.FC = () => {
  const { products, categories, filters, addProduct, updateProduct, deleteProduct, updateVariantStock, formatFCFA } = useAdmin();

  // Arbre des catégories réelles : grandes catégories (parents) suivies de leurs
  // sous-catégories indentées. Les identifiants (id) sont ceux du storefront, ce
  // qui garantit que le produit s'affiche bien dans le catalogue et ses filtres.
  const categoryTree = useMemo(() => {
    const visible = categories.filter((c) => !c.is_archived);
    const byOrder = (a: typeof visible[number], b: typeof visible[number]) =>
      (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name);
    const roots = visible.filter((c) => !c.parent_id).sort(byOrder);
    const rows: { id: string; name: string; depth: number }[] = [];
    roots.forEach((root) => {
      rows.push({ id: root.id, name: root.name, depth: 0 });
      visible
        .filter((c) => c.parent_id === root.id)
        .sort(byOrder)
        .forEach((child) => rows.push({ id: child.id, name: child.name, depth: 1 }));
    });
    // Catégories orphelines (parent introuvable) : ajoutées à plat.
    visible
      .filter((c) => c.parent_id && !roots.some((r) => r.id === c.parent_id))
      .filter((c) => !rows.some((r) => r.id === c.id))
      .sort(byOrder)
      .forEach((c) => rows.push({ id: c.id, name: c.name, depth: 0 }));
    return rows;
  }, [categories]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [comparePrice, setComparePrice] = useState<number | ''>('');
  const [category, setCategory] = useState('');
  const [gender, setGender] = useState<'Femme' | 'Homme' | 'Enfant' | 'Unisexe'>('Homme');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sku, setSku] = useState('');
  const [isNew, setIsNew] = useState(true);
  const [isFeatured, setIsFeatured] = useState(true);
  const [isPromo, setIsPromo] = useState(false);
  const [attributes, setAttributes] = useState<Record<string, string | string[]>>({});

  // Variants state
  const [variants, setVariants] = useState<(Omit<ProductVariant, 'stock'> & { stock: number | '' })[]>([
    { id: 'v1', product_id: '', size: 'M', color: 'Bleu Indigo', color_hex: '#1E3A8A', stock: '', sku: 'VAR-1' },
    { id: 'v2', product_id: '', size: 'L', color: 'Bleu Indigo', color_hex: '#1E3A8A', stock: '', sku: 'VAR-2' },
  ]);

  const resetForm = () => {
    setName('');
    setPrice('');
    setComparePrice('');
    setCategory(categoryTree[0]?.id || '');
    setGender('Homme');
    setDescription('');
    setImageUrl('');
    setSku(`AYE-PRD-${Math.floor(100 + Math.random() * 900)}`);
    setIsNew(true);
    setIsFeatured(true);
    setIsPromo(false);
    setAttributes({});
    setVariants([
      { id: 'v1', product_id: '', size: 'M', color: 'Bleu Indigo', color_hex: '#1E3A8A', stock: '', sku: 'VAR-1' },
      { id: 'v2', product_id: '', size: 'L', color: 'Bleu Indigo', color_hex: '#1E3A8A', stock: '', sku: 'VAR-2' },
    ]);
  };

  const handleOpenCreate = () => {
    resetForm();
    setEditingProduct(null);
    setIsCreating(true);
  };

  const handleEdit = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setPrice(prod.price !== undefined && prod.price !== null ? prod.price : '');
    setComparePrice(prod.compare_price || '');
    setCategory(prod.category_id);
    setGender(prod.gender);
    setDescription(prod.description);
    setImageUrl(prod.images[0] || '');
    setSku(prod.sku);
    setIsNew(Boolean(prod.is_new));
    setIsFeatured(Boolean(prod.is_featured));
    setIsPromo(Boolean(prod.is_promo));
    setAttributes(prod.attributes || {});
    setVariants(
      (prod.variants || []).map((v) => ({
        ...v,
        stock: v.stock === 0 || v.stock === undefined || v.stock === null ? '' : v.stock,
      }))
    );
    setIsCreating(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = typeof price === 'number' ? price : (price !== '' ? Number(price) : 0);
    const numericComparePrice = typeof comparePrice === 'number' ? comparePrice : (comparePrice !== '' ? Number(comparePrice) : 0);

    if (!name.trim() || numericPrice <= 0) {
      alert('Veuillez entrer un nom valide et un prix supérieur à 0.');
      return;
    }

    const productId = editingProduct ? editingProduct.id : `prod-${Date.now()}`;

    const formattedVariants: ProductVariant[] = variants.map((v, idx) => ({
      ...v,
      id: v.id || `var-${productId}-${idx}`,
      product_id: productId,
      stock: typeof v.stock === 'number' ? v.stock : (v.stock !== '' ? Number(v.stock) : 0),
    }));

    const productPayload: Product = {
      id: productId,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      long_description: description,
      price: numericPrice,
      compare_price: numericComparePrice > numericPrice ? numericComparePrice : undefined,
      category_id: category,
      gender,
      status: 'active',
      images: imageUrl ? [imageUrl] : [],
      tags: ['Afro-Chic', category, gender],
      attributes,
      is_new: isNew,
      is_featured: isFeatured,
      is_promo: isPromo,
      sku: sku || `AYE-${productId}`,
      variants: formattedVariants,
      created_at: editingProduct ? editingProduct.created_at : new Date().toISOString(),
    };

    setIsSaving(true);
    try {
      if (editingProduct) {
        await updateProduct(productPayload);
      } else {
        await addProduct(productPayload);
      }
      setIsCreating(false);
      resetForm();
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la sauvegarde du produit.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddVariantRow = () => {
    setVariants((prev) => [
      ...prev,
      {
        id: `v-${Date.now()}`,
        product_id: '',
        size: '',
        color: '',
        color_hex: '#000000',
        stock: '',
        sku: `SKU-${Date.now()}`,
      },
    ]);
  };

  const handleRemoveVariantRow = (index: number) => {
    setVariants((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Filtered products
  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all') {
      const isDirect = p.category_id === selectedCategory;
      const isSub = categories
        .filter((c) => c.parent_id === selectedCategory)
        .some((sub) => sub.id === p.category_id);
      if (!isDirect && !isSub) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Action Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-semibold text-slate-900">
            Gestion du Catalogue Produits
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ajoutez de nouvelles pièces, modifiez les variantes, ajustez les prix et gérez les stocks.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
          id="admin-add-product-btn"
        >
          <Plus className="w-4 h-4 text-orange-400" />
          <span>Ajouter un Nouveau Produit</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom ou SKU..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-semibold text-slate-600">Catégorie :</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Edit / Create Modal Form */}
      {isCreating && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveProduct}
            className="bg-white rounded-3xl max-w-3xl w-full p-4 sm:p-8 space-y-6 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-serif font-bold text-slate-900">
                {editingProduct ? 'Modifier le Produit' : 'Ajouter une Nouvelle Pièce'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-800 block mb-1">Nom de l'article *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Robe Wax Prestige Ankara"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-800 block mb-1">Prix de Vente (FCFA) *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Ex: 25000"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-800 block mb-1">Prix Barré Promo (FCFA)</label>
                <input
                  type="number"
                  value={comparePrice}
                  onChange={(e) => setComparePrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Ex: 30000"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-800 block mb-1">Catégorie *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  {categoryTree.length === 0 && <option value="">Aucune catégorie disponible</option>}
                  {categoryTree.map((c) => {
                    const emoji = CATEGORY_EMOJI[c.id] ? `${CATEGORY_EMOJI[c.id]} ` : '';
                    return (
                      <option key={c.id} value={c.id}>
                        {c.depth > 0 ? '  — ' : ''}
                        {emoji}
                        {c.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-800 block mb-1">Rayon / Genre *</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="Femme">Femme</option>
                  <option value="Homme">Homme</option>
                  <option value="Enfant">Enfant</option>
                  <option value="Unisexe">Unisexe</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <ImageUploadInput
                  value={imageUrl}
                  onChange={setImageUrl}
                  label="Image Principale du Produit (PNG / JPG / WEBP max 3 Mo)"
                  placeholder="/images/products/vêtement.jpg ou téléverser..."
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-800 block mb-1">Description détaillée</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Dynamic Attributes Form Section */}
            {(() => {
              const activeCatObj = categories.find((c) => c.id === category);
              const allowedFilterIds = activeCatObj?.allowed_filter_ids || [];
              const categoryFilters = filters.filter(
                (f) =>
                  allowedFilterIds.includes(f.id) &&
                  f.is_active &&
                  !f.is_archived &&
                  !['matiere', 'marque', 'coupe'].includes(f.id)
              );

              if (categoryFilters.length === 0) return null;

              return (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-red-600" />
                    <span className="font-serif font-bold text-slate-900 text-sm">
                      Caractéristiques Dynamiques ({activeCatObj?.name})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Sélectionnez les valeurs des filtres associés à cette catégorie pour alimenter la recherche client :
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {categoryFilters.map((fGroup) => {
                      const currentValue = attributes[fGroup.id] || '';

                      return (
                        <div key={fGroup.id} className="bg-white p-3 rounded-xl border border-slate-200">
                          <label className="font-bold text-slate-800 text-xs block mb-1">
                            {fGroup.name}
                          </label>

                          <select
                            value={typeof currentValue === 'string' ? currentValue : ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setAttributes((prev) => ({
                                ...prev,
                                [fGroup.id]: val,
                              }));
                            }}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
                          >
                            <option value="">-- Choisir ({fGroup.name}) --</option>
                            {fGroup.options.map((opt) => (
                              <option key={opt.id} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Manage Variants */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Variantes (Tailles & Couleurs)
                </label>
                <button
                  type="button"
                  onClick={handleAddVariantRow}
                  className="text-xs text-orange-600 font-bold hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Ajouter une variante
                </button>
              </div>

              <div className="space-y-2">
                {variants.map((v, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                    <input
                      type="text"
                      placeholder="Taille (S, M, 38...)"
                      value={v.size}
                      onChange={(e) => {
                        const updated = [...variants];
                        updated[idx].size = e.target.value;
                        setVariants(updated);
                      }}
                      className="w-20 p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                    />
                    <input
                      type="text"
                      placeholder="Couleur (Bleu Indigo...)"
                      value={v.color}
                      onChange={(e) => {
                        const updated = [...variants];
                        updated[idx].color = e.target.value;
                        setVariants(updated);
                      }}
                      className="flex-1 p-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Quantité / Stock"
                      value={v.stock}
                      onChange={(e) => {
                        const updated = [...variants];
                        updated[idx].stock = e.target.value === '' ? '' : Number(e.target.value);
                        setVariants(updated);
                      }}
                      className="w-28 p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveVariantRow(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? 'Enregistrement...' : 'Enregistrer le Produit'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">Produit</th>
                <th className="p-4">Catégorie / Genre</th>
                <th className="p-4">Prix</th>
                <th className="p-4">Variantes & Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => {
                const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {p.images[0] ? (
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-12 h-14 object-cover rounded-xl border border-slate-200"
                          />
                        ) : (
                          <div className="w-12 h-14 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
                            <Package className="w-4 h-4 text-slate-300" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs">{p.name}</h4>
                          <span className="font-mono text-[10px] text-slate-400">SKU: {p.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-700">
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                        {p.category_id}
                      </span>
                      <span className="ml-2 text-slate-500">{p.gender}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-900">{formatFCFA(p.price)}</span>
                      {p.compare_price && (
                        <span className="block text-[10px] text-slate-400 line-through">
                          {formatFCFA(p.compare_price)}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <span
                          className={`font-bold px-2 py-0.5 rounded-md text-[10px] ${
                            totalStock > 3
                              ? 'bg-emerald-50 text-emerald-700'
                              : totalStock > 0
                              ? 'bg-orange-50 text-orange-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          Total : {totalStock} en stock
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {p.variants.map((v) => (
                            <span key={v.id} className="text-[10px] bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                              {v.size}: {v.stock}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                          title="Éditer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm(`Supprimer ${p.name} ?`)) {
                              try {
                                await deleteProduct(p.id);
                              } catch (e: any) {
                                alert(e.message || 'Erreur lors de la suppression.');
                              }
                            }
                          }}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

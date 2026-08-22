/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description Dynamic Category & Subcategory Management Component for ART FASHION Admin CMS
 * @created 2026-08-19
 * @updated 2026-08-19
 * 🌐 ceo.nexuspartners.xyz
 * 📧 daoudaabassichristian@gmail.com
 */

import React, { useState, useMemo } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Category, FilterGroup } from '@ayele/shared';
import { ImageUploadInput } from './ImageUploadInput';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  ChevronRight,
  ChevronDown,
  MoveUp,
  MoveDown,
  Sliders,
  Layers,
  Archive,
  Eye,
  EyeOff,
  Image as ImageIcon,
} from 'lucide-react';

export const CategoryManager: React.FC = () => {
  const {
    categories,
    filters,
    products,
    addCategory,
    updateCategory,
    archiveCategory,
    deleteCategory,
    reorderCategories,
  } = useAdmin();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    name_en: '',
    slug: '',
    image: '',
    description: '',
    description_en: '',
    parent_id: null,
    is_active: true,
    allowed_filter_ids: ['taille', 'couleur', 'coupe', 'matiere'],
  });

  const activeCategories = useMemo(
    () => categories.filter((c) => !c.is_archived),
    [categories]
  );

  const mainCategories = useMemo(
    () =>
      activeCategories
        .filter((c) => !c.parent_id)
        .sort((a, b) => (a.order || 0) - (b.order || 0)),
    [activeCategories]
  );

  const getSubcategories = (parentId: string) => {
    return activeCategories
      .filter((c) => c.parent_id === parentId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  const getItemCount = (categoryId: string) => {
    return products.filter(
      (p) => p.category_id === categoryId || p.subcategory === categoryId
    ).length;
  };

  const handleOpenAddModal = (parentId: string | null = null) => {
    setEditingCategory(null);
    setSelectedParentId(parentId);
    setFormData({
      name: '',
      name_en: '',
      slug: '',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
      description: '',
      description_en: '',
      parent_id: parentId,
      is_active: true,
      allowed_filter_ids: ['taille', 'couleur', 'coupe', 'matiere'],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setSelectedParentId(cat.parent_id || null);
    setFormData({ ...cat });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    const slug =
      formData.slug?.trim() ||
      formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const categoryData: Category = {
      id: editingCategory ? editingCategory.id : `cat-${Date.now()}`,
      name: formData.name.trim(),
      name_en: formData.name_en?.trim() || formData.name.trim(),
      slug,
      image:
        formData.image?.trim() ||
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
      description: formData.description?.trim() || '',
      description_en: formData.description_en?.trim() || '',
      parent_id: formData.parent_id || null,
      order: editingCategory ? editingCategory.order || 1 : activeCategories.length + 1,
      is_active: formData.is_active !== undefined ? formData.is_active : true,
      is_archived: false,
      allowed_filter_ids: formData.allowed_filter_ids || [],
      item_count: getItemCount(editingCategory?.id || ''),
    };

    if (editingCategory) {
      updateCategory(categoryData);
    } else {
      addCategory(categoryData);
    }

    setIsModalOpen(false);
  };

  const toggleFilterAssociation = (filterId: string) => {
    setFormData((prev) => {
      const current = prev.allowed_filter_ids || [];
      const updated = current.includes(filterId)
        ? current.filter((id) => id !== filterId)
        : [...current, filterId];
      return { ...prev, allowed_filter_ids: updated };
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-serif font-bold text-slate-900">
              Gestionnaire des Catégories & Sous-catégories
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Organisez le catalogue produit et associez les filtres spécifiques (Coupe, Matière, Pointure...) à chaque catégorie.
          </p>
        </div>

        <button
          onClick={() => handleOpenAddModal(null)}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-red-500" />
          <span>Nouvelle Catégorie</span>
        </button>
      </div>

      {/* Main Categories Tree List */}
      <div className="space-y-4">
        {mainCategories.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">Aucune catégorie créée pour le moment</p>
            <p className="text-xs text-slate-500 mt-1">Cliquez sur le bouton ci-dessus pour ajouter votre première catégorie.</p>
          </div>
        ) : (
          mainCategories.map((mainCat) => {
            const subs = getSubcategories(mainCat.id);
            const count = getItemCount(mainCat.id);

            return (
              <div
                key={mainCat.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs transition-all hover:border-slate-300"
              >
                {/* Main Category Row */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/70 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <img
                      src={mainCat.image}
                      alt={mainCat.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-base text-slate-900">{mainCat.name}</span>
                        {!mainCat.is_active && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                            <EyeOff className="w-3 h-3" /> Inactive
                          </span>
                        )}
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                          {count} produit(s)
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{mainCat.description}</p>
                      
                      {/* Filter badges */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="text-[10px] font-semibold text-slate-400">Filtres associés :</span>
                        {(mainCat.allowed_filter_ids || []).map((fId) => {
                          const fGroup = filters.find((f) => f.id === fId);
                          return (
                            <span key={fId} className="px-2 py-0.5 bg-slate-200/80 text-slate-700 rounded-md text-[10px] font-bold">
                              {fGroup ? fGroup.name : fId}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleOpenAddModal(mainCat.id)}
                      className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                      title="Ajouter une sous-catégorie"
                    >
                      <Plus className="w-3.5 h-3.5 text-red-600" />
                      <span className="hidden md:inline">Sous-catégorie</span>
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(mainCat)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-all cursor-pointer"
                      title="Modifier la catégorie"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => archiveCategory(mainCat.id)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all cursor-pointer"
                      title="Archiver (Soft-delete)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subcategories List */}
                {subs.length > 0 && (
                  <div className="p-4 bg-white space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-2 mb-2">
                      Sous-catégories de {mainCat.name} ({subs.length})
                    </span>
                    {subs.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 ml-4 sm:ml-8 hover:bg-slate-100/70 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                          <div>
                            <span className="font-bold text-xs text-slate-800">{sub.name}</span>
                            <span className="ml-2 text-[10px] text-slate-400">({getItemCount(sub.id)} modèles)</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(sub)}
                            className="p-1.5 bg-white hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => archiveCategory(sub.id)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Category Creation / Edition Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-slate-100 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-serif font-bold text-slate-900">
                {editingCategory ? 'Modifier la Catégorie' : selectedParentId ? 'Nouvelle Sous-catégorie' : 'Nouvelle Catégorie'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Nom de la Catégorie (FR) *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ex: Chemises de Luxe"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Catégorie Parente (Optionnel pour sous-catégorie)</label>
                <select
                  value={formData.parent_id || ''}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value || null })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-slate-900"
                >
                  <option value="">Aucune (Catégorie Principale)</option>
                  {mainCategories
                    .filter((c) => c.id !== editingCategory?.id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <ImageUploadInput
                  value={formData.image || ''}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  label="Image Représentative de la Catégorie (PNG / JPG / WEBP max 3 Mo)"
                  placeholder="/images/categories/vêtement.jpg ou téléverser..."
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Description courte</label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description affichée sur le catalogue..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              {/* FILTER ASSOCIATION CHECKBOXES */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-red-600" />
                  <span className="font-serif font-bold text-slate-900 text-sm">
                    Filtres associés à cette Catégorie
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Cochez les filtres qui doivent s'afficher dans la barre latérale du catalogue lorsque le client sélectionne cette catégorie :
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {filters
                    .filter((f) => f.is_active && !f.is_archived)
                    .map((fGroup) => {
                      const isChecked = (formData.allowed_filter_ids || []).includes(fGroup.id);
                      return (
                        <label
                          key={fGroup.id}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-red-50 border-red-300 text-red-900 font-bold'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleFilterAssociation(fGroup.id)}
                            className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                          />
                          <span>{fGroup.name}</span>
                        </label>
                      );
                    })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active !== false}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded border-slate-300 text-slate-900"
                  />
                  <span className="font-bold text-slate-800">Afficher sur la boutique (Active)</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Enregistrer</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

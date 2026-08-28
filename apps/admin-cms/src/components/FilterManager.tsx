/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description Dynamic Filter & Attribute Manager Component for ART FASHION Admin CMS
 * @created 2026-08-19
 * @updated 2026-08-19
 * 🌐 ceo.nexus-partners.xyz
 * 📧 daoudaabassichristian@gmail.com
 */

import React, { useState, useMemo } from 'react';
import { useAdmin } from '../context/AdminContext';
import { FilterGroup, FilterOption } from '@ayele/shared';
import {
  Sliders,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Palette,
  Tag,
  Layers,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';

export const FilterManager: React.FC = () => {
  const { filters, categories, addFilter, updateFilter, archiveFilter, deleteFilter } = useAdmin();

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<FilterGroup | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Group Form State
  const [groupFormData, setGroupFormData] = useState<Partial<FilterGroup>>({
    name: '',
    name_en: '',
    type: 'checkbox',
    is_active: true,
    options: [],
  });

  // Option Form inside Modal
  const [newOptionLabel, setNewOptionLabel] = useState('');
  const [newOptionValue, setNewOptionValue] = useState('');
  const [newOptionColor, setNewOptionColor] = useState('#000000');

  const activeFilters = useMemo(
    () => filters.filter((f) => !f.is_archived),
    [filters]
  );

  const handleOpenAddGroupModal = () => {
    setEditingGroup(null);
    setGroupFormData({
      name: '',
      name_en: '',
      type: 'checkbox',
      is_active: true,
      options: [],
    });
    setNewOptionLabel('');
    setNewOptionValue('');
    setIsGroupModalOpen(true);
  };

  const handleOpenEditGroupModal = (group: FilterGroup) => {
    setEditingGroup(group);
    setGroupFormData({ ...group, options: [...group.options] });
    setNewOptionLabel('');
    setNewOptionValue('');
    setIsGroupModalOpen(true);
  };

  const handleAddOption = () => {
    if (!newOptionLabel.trim()) return;
    const value = newOptionValue.trim() || newOptionLabel.trim();
    const newOpt: FilterOption = {
      id: `opt-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      label: newOptionLabel.trim(),
      label_en: newOptionLabel.trim(),
      value,
      color_hex: groupFormData.type === 'color' ? newOptionColor : undefined,
    };

    setGroupFormData((prev) => ({
      ...prev,
      options: [...(prev.options || []), newOpt],
    }));

    setNewOptionLabel('');
    setNewOptionValue('');
  };

  const handleRemoveOption = (optionId: string) => {
    setGroupFormData((prev) => ({
      ...prev,
      options: (prev.options || []).filter((opt) => opt.id !== optionId),
    }));
  };

  const handleSaveGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupFormData.name?.trim()) return;

    const id = editingGroup
      ? editingGroup.id
      : groupFormData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');

    const groupData: FilterGroup = {
      id,
      name: groupFormData.name.trim(),
      name_en: groupFormData.name_en?.trim() || groupFormData.name.trim(),
      type: groupFormData.type || 'checkbox',
      is_active: groupFormData.is_active !== undefined ? groupFormData.is_active : true,
      is_archived: false,
      options: groupFormData.options || [],
    };

    setIsSaving(true);
    try {
      if (editingGroup) {
        await updateFilter(groupData);
      } else {
        await addFilter(groupData);
      }
      setIsGroupModalOpen(false);
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la sauvegarde du filtre.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchive = async (filterId: string) => {
    try {
      await archiveFilter(filterId);
    } catch (error: any) {
      alert(error.message || "Erreur lors de l'archivage du filtre.");
    }
  };

  const getAssociatedCategoriesCount = (filterId: string) => {
    return categories.filter(
      (c) => !c.is_archived && (c.allowed_filter_ids || []).includes(filterId)
    ).length;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-serif font-bold text-slate-900">
              Gestionnaire des Filtres & Attributs Merchandising
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Créez et configurez les filtres dynamiques (Taille, Pointure, Couleur, Coupe, Matière, Marque) affichés sur le Storefront.
          </p>
        </div>

        <button
          onClick={handleOpenAddGroupModal}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-red-500" />
          <span>Nouveau Groupe de Filtres</span>
        </button>
      </div>

      {/* Filter Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeFilters.length === 0 ? (
          <div className="md:col-span-2 bg-white p-12 text-center rounded-3xl border border-slate-200">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">Aucun groupe de filtres configuré</p>
            <p className="text-xs text-slate-500 mt-1">Cliquez sur le bouton pour créer votre premier filtre (ex: Coupe, Matière...)</p>
          </div>
        ) : (
          activeFilters.map((fGroup) => {
            const catCount = getAssociatedCategoriesCount(fGroup.id);

            return (
              <div
                key={fGroup.id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      {fGroup.type === 'color' ? (
                        <Palette className="w-5 h-5 text-amber-500 shrink-0" />
                      ) : (
                        <Tag className="w-5 h-5 text-red-600 shrink-0" />
                      )}
                      <div>
                        <h3 className="font-serif font-bold text-slate-900 text-base">{fGroup.name}</h3>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {fGroup.id}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {!fGroup.is_active && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          Inactif
                        </span>
                      )}
                      <button
                        onClick={() => handleOpenEditGroupModal(fGroup)}
                        className="p-2 hover:bg-slate-100 text-slate-700 rounded-xl transition-all cursor-pointer"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleArchive(fGroup.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-xl transition-all cursor-pointer"
                        title="Archiver (Soft-delete)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>Format d'affichage : <strong className="text-slate-800 font-semibold">{fGroup.type}</strong></span>
                    <span className="bg-slate-100 px-2.5 py-0.5 rounded-full font-bold text-slate-700 text-[10px]">
                      Lié à {catCount} catégorie(s)
                    </span>
                  </div>

                  {/* Options Pills */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Valeurs & Options ({fGroup.options.length})
                    </span>

                    <div className="flex flex-wrap gap-2">
                      {fGroup.options.length === 0 ? (
                        <span className="text-xs text-slate-400 italic">Aucune option définie</span>
                      ) : (
                        fGroup.options.map((opt) => (
                          <span
                            key={opt.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-xl text-xs font-bold border border-slate-200/80"
                          >
                            {opt.color_hex && (
                              <span
                                className="w-3 h-3 rounded-full border border-slate-300 shrink-0"
                                style={{ backgroundColor: opt.color_hex }}
                              />
                            )}
                            <span>{opt.label}</span>
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Filter Group Creation / Edition Modal */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-4 sm:p-8 space-y-6 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-slate-100 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-serif font-bold text-slate-900">
                {editingGroup ? 'Modifier le Groupe de Filtres' : 'Nouveau Groupe de Filtres'}
              </h3>
              <button
                onClick={() => setIsGroupModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGroup} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Nom du Filtre (FR) *</label>
                <input
                  type="text"
                  required
                  value={groupFormData.name || ''}
                  onChange={(e) => setGroupFormData({ ...groupFormData, name: e.target.value })}
                  placeholder="ex: Coupe, Matière, Marque..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Type d'Affichage Storefront</label>
                <select
                  value={groupFormData.type || 'checkbox'}
                  onChange={(e) =>
                    setGroupFormData({ ...groupFormData, type: e.target.value as FilterGroup['type'] })
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-slate-900"
                >
                  <option value="checkbox">Cases à cocher (Multiple)</option>
                  <option value="select">Menu Déroulant (Sélection Unique)</option>
                  <option value="color">Pastilles de Couleur (Visual Color)</option>
                </select>
              </div>

              {/* OPTIONS BUILDER */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="font-serif font-bold text-slate-900 text-sm block">
                  Valeurs / Options du Filtre
                </span>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newOptionLabel}
                    onChange={(e) => setNewOptionLabel(e.target.value)}
                    placeholder="ex: Slim Fit, Lin, Bazin..."
                    className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                  {groupFormData.type === 'color' && (
                    <input
                      type="color"
                      value={newOptionColor}
                      onChange={(e) => setNewOptionColor(e.target.value)}
                      className="w-10 h-10 p-1 bg-white border border-slate-200 rounded-xl cursor-pointer"
                      title="Choisir la couleur hex"
                    />
                  )}
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Ajouter
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {(groupFormData.options || []).map((opt) => (
                    <span
                      key={opt.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-slate-800 rounded-xl text-xs font-bold border border-slate-200 shadow-xs"
                    >
                      {opt.color_hex && (
                        <span
                          className="w-3 h-3 rounded-full border border-slate-300 shrink-0"
                          style={{ backgroundColor: opt.color_hex }}
                        />
                      )}
                      <span>{opt.label}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(opt.id)}
                        className="text-slate-400 hover:text-red-600 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={groupFormData.is_active !== false}
                    onChange={(e) => setGroupFormData({ ...groupFormData, is_active: e.target.checked })}
                    className="rounded border-slate-300 text-slate-900"
                  />
                  <span className="font-bold text-slate-800">Activer ce filtre sur le Storefront</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsGroupModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{isSaving ? 'Enregistrement...' : 'Enregistrer'}</span>
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

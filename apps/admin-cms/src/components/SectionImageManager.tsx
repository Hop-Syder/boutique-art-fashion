import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Image as ImageIcon, Save, Check, Plus, Trash2, Sparkles, RefreshCw, Eye } from 'lucide-react';
import { SectionsConfig, SectionMedia } from '@ayele/shared';
import { ImageUploadInput } from './ImageUploadInput';

export const SectionImageManager: React.FC = () => {
  const { sectionsConfig, updateSectionsConfig } = useAdmin();
  const [formData, setFormData] = useState<SectionsConfig>(sectionsConfig);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSectionsConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handlePromoChange = (index: number, field: keyof SectionMedia, value: string) => {
    const updatedPromos = [...formData.promos];
    updatedPromos[index] = { ...updatedPromos[index], [field]: value };
    setFormData((prev) => ({ ...prev, promos: updatedPromos }));
  };

  const handleAddPromo = () => {
    const newPromo: SectionMedia = {
      id: `promo-${Date.now()}`,
      title: 'Nouvelle Bannière Promo',
      subtitle: 'Description de la promotion',
      image_url: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80',
      button_text: 'Découvrir',
      button_link: 'catalog',
      badge: 'Exclusivité',
    };
    setFormData((prev) => ({ ...prev, promos: [...prev.promos, newPromo] }));
  };

  const handleRemovePromo = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      promos: prev.promos.filter((_, idx) => idx !== index),
    }));
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-orange-600 font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Gestionnaire de Contenu Visuel CMS</span>
          </div>
          <h2 className="text-2xl font-serif font-semibold text-slate-900 mt-1">
            Éditeur des Sections & Images du Site Vitrine
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Modifiez en temps réel les bannières, titres, descriptions et images d'illustration du site.
          </p>
        </div>

        <button
          type="submit"
          className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
            savedSuccess
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
          id="cms-save-sections-btn"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Sections enregistrées !</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-orange-400" />
              <span>Publier les Modifications</span>
            </>
          )}
        </button>
      </div>

      {/* 1. SECTION HERO (ACCUEIL) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <ImageIcon className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-serif font-bold text-slate-900">
            1. Section Hero (Bannière Principale d'Accueil)
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Text Fields */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">
                Badge Supérieur
              </label>
              <input
                type="text"
                value={formData.hero.badge}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, badge: e.target.value },
                  }))
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">
                Titre Principal de la Bannière
              </label>
              <textarea
                rows={2}
                value={formData.hero.title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, title: e.target.value },
                  }))
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">
                Description d'Accroche
              </label>
              <textarea
                rows={3}
                value={formData.hero.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, description: e.target.value },
                  }))
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">
                Texte du Bouton d'Action (CTA)
              </label>
              <input
                type="text"
                value={formData.hero.cta_primary_text}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, cta_primary_text: e.target.value },
                  }))
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
          </div>

          {/* Image URLs & Previews */}
          <div className="space-y-4">
            <div>
              <ImageUploadInput
                value={formData.hero.primary_image}
                onChange={(url) =>
                  setFormData((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, primary_image: url },
                  }))
                }
                label="Image Hero Principale (PNG / JPG max 3 Mo)"
                placeholder="/images/hero.jpg ou téléverser..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECTION À PROPOS & HISTOIRE */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <ImageIcon className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-serif font-bold text-slate-900">
            2. Section "À Propos" & Atelier Cotonou
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">
                Titre de Présentation de la Maison
              </label>
              <input
                type="text"
                value={formData.about.hero_title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    about: { ...prev.about, hero_title: e.target.value },
                  }))
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">
                Sous-titre / Vision
              </label>
              <textarea
                rows={2}
                value={formData.about.hero_subtitle}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    about: { ...prev.about, hero_subtitle: e.target.value },
                  }))
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">
                Image Principale de l'Atelier Cotonou (URL)
              </label>
              <input
                type="text"
                value={formData.about.hero_image}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    about: { ...prev.about, hero_image: e.target.value },
                  }))
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
              />
              <div className="mt-2 relative aspect-[16/9] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src={formData.about.hero_image}
                  alt="Aperçu Atelier"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">
                Titre Savoir-Faire & Confection
              </label>
              <input
                type="text"
                value={formData.about.craftsmanship_title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    about: { ...prev.about, craftsmanship_title: e.target.value },
                  }))
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">
                Texte explicatif du Savoir-Faire
              </label>
              <textarea
                rows={3}
                value={formData.about.craftsmanship_text}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    about: { ...prev.about, craftsmanship_text: e.target.value },
                  }))
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div>
              <ImageUploadInput
                value={formData.about.craftsmanship_image}
                onChange={(url) =>
                  setFormData((prev) => ({
                    ...prev,
                    about: { ...prev.about, craftsmanship_image: url },
                  }))
                }
                label="Image d'Illustration de l'Artisanat (PNG / JPG max 3 Mo)"
                placeholder="/images/craftsmanship.jpg ou téléverser..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. GESTION DES BANNIÈRES PROMOTIONNELLES */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-serif font-bold text-slate-900">
              3. Bannières Promotionnelles & Offres Spéciales
            </h3>
          </div>
          <button
            type="button"
            onClick={handleAddPromo}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-orange-400" />
            <span>Ajouter une Bannière</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formData.promos.map((promo, idx) => (
            <div key={promo.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 relative group">
              <button
                type="button"
                onClick={() => handleRemovePromo(idx)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white transition-colors cursor-pointer"
                title="Supprimer cette bannière"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Bannière n°{idx + 1}
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Titre</label>
                <input
                  type="text"
                  value={promo.title}
                  onChange={(e) => handlePromoChange(idx, 'title', e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Sous-titre</label>
                <input
                  type="text"
                  value={promo.subtitle || ''}
                  onChange={(e) => handlePromoChange(idx, 'subtitle', e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div>
                <ImageUploadInput
                  value={promo.image_url}
                  onChange={(url) => handlePromoChange(idx, 'image_url', url)}
                  label="Image de la Bannière (PNG / JPG max 3 Mo)"
                  placeholder="/images/promos/banniere.jpg ou téléverser..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};

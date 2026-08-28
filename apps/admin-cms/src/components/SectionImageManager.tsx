import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Image as ImageIcon, Save, Check, Plus, Trash2, Sparkles, RefreshCw, Eye, MessageSquare, LayoutTemplate, ShieldCheck, Box, CheckCircle2, PackageCheck } from 'lucide-react';
import { SectionsConfig, TrustBadge, CarouselSlide, AboutDelivery } from '@ayele/shared';
import { ImageUploadInput } from './ImageUploadInput';

export const SectionImageManager: React.FC = () => {
  const { sectionsConfig, updateSectionsConfig } = useAdmin();
  const [formData, setFormData] = useState<SectionsConfig>(sectionsConfig);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSectionsConfig(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la publication des sections.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTopBarMessage = () => {
    setFormData((prev) => ({
      ...prev,
      topBar: {
        ...prev.topBar,
        messages: [...prev.topBar.messages, 'Nouveau message'],
        messages_en: [...prev.topBar.messages_en, 'New message'],
      }
    }));
  };

  const handleRemoveTopBarMessage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      topBar: {
        messages: prev.topBar.messages.filter((_, idx) => idx !== index),
        messages_en: prev.topBar.messages_en.filter((_, idx) => idx !== index),
      }
    }));
  };

  const handleTopBarMessageChange = (index: number, lang: 'fr' | 'en', value: string) => {
    setFormData((prev) => {
      const messages = [...prev.topBar.messages];
      const messages_en = [...prev.topBar.messages_en];
      if (lang === 'fr') messages[index] = value;
      else messages_en[index] = value;
      return { ...prev, topBar: { messages, messages_en } };
    });
  };

  const handleAddCarouselSlide = () => {
    const newSlide: CarouselSlide = {
      id: `slide-${Date.now()}`,
      image: '',
      title: 'Nouveau Produit',
      title_en: 'New Product',
      subtitle: 'Description courte',
      subtitle_en: 'Short description',
      meta: []
    };
    setFormData((prev) => ({
      ...prev,
      carousel3D: [...prev.carousel3D, newSlide]
    }));
  };

  const handleRemoveCarouselSlide = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      carousel3D: prev.carousel3D.filter((_, idx) => idx !== index),
    }));
  };

  const handleAddEngagement = () => {
    setFormData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        engagements: [
          ...(prev.about.engagements || []),
          {
            id: `eng-${Date.now()}`,
            icon: 'Award',
            title: 'Nouveau',
            title_en: 'New',
            description: 'Description',
            description_en: 'Description',
          }
        ]
      }
    }));
  };

  const handleRemoveEngagement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        engagements: (prev.about.engagements || []).filter((_, idx) => idx !== index),
      }
    }));
  };

  const handleAddStat = () => {
    setFormData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        stats: [
          ...(prev.about.stats || []),
          {
            id: `st-${Date.now()}`,
            value: '0',
            label: 'Nouveau',
            label_en: 'New',
          }
        ]
      }
    }));
  };

  const handleRemoveStat = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        stats: (prev.about.stats || []).filter((_, idx) => idx !== index),
      }
    }));
  };

  const handleAddDelivery = () => {
    const newDelivery: AboutDelivery = {
      id: `del-${Date.now()}`,
      image: '',
      location: 'Lieu',
      time: 'Temps',
      article: 'Article',
      client: 'Client',
      status: 'Statut',
      rating: '5.0'
    };
    setFormData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        deliveries: [...(prev.about.deliveries || []), newDelivery]
      }
    }));
  };

  const handleRemoveDelivery = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        deliveries: (prev.about.deliveries || []).filter((_, idx) => idx !== index),
      }
    }));
  };


  const SaveButton = () => (
    <button
      type="submit"
      disabled={isSaving}
      className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-60 ${
        savedSuccess
          ? 'bg-emerald-600 text-white'
          : 'bg-slate-900 hover:bg-slate-800 text-white'
      }`}
    >
      {isSaving ? (
        <span className="hidden sm:inline">Publication...</span>
      ) : savedSuccess ? (
        <>
          <Check className="w-4 h-4" />
          <span className="hidden sm:inline">Publié</span>
        </>
      ) : (
        <>
          <Save className="w-4 h-4 text-orange-400" />
          <span className="hidden sm:inline">Publier</span>
        </>
      )}
    </button>
  );

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
            Modifiez en temps réel les bannières, annonces, carrousels et textes de la page À Propos.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-60 ${
            savedSuccess
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
          id="cms-save-sections-btn"
        >
          {isSaving ? (
            <span>Publication en cours...</span>
          ) : savedSuccess ? (
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

      {/* 1. TOP BAR */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-serif font-bold text-slate-900">
              1. Barre d'Annonce (Top Bar)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddTopBarMessage}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Ajouter</span>
            </button>
            <SaveButton />
          </div>
        </div>

        <div className="space-y-4">
          {formData.topBar.messages.map((msg, idx) => (
            <div key={idx} className="flex gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  value={msg}
                  onChange={(e) => handleTopBarMessageChange(idx, 'fr', e.target.value)}
                  placeholder="Message FR"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-slate-900/10"
                />
                <input
                  type="text"
                  value={formData.topBar.messages_en[idx] || ''}
                  onChange={(e) => handleTopBarMessageChange(idx, 'en', e.target.value)}
                  placeholder="Message EN"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-slate-900/10"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveTopBarMessage(idx)}
                className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. SECTION HERO */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-serif font-bold text-slate-900">
              2. Hero Section
            </h3>
          </div>
          <SaveButton />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">Titre Principal</label>
              <textarea
                rows={2}
                value={formData.hero.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }))
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">Description</label>
              <textarea
                rows={3}
                value={formData.hero.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, hero: { ...prev.hero, description: e.target.value } }))
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-800 block mb-1">Texte Bouton Explorer (FR)</label>
                <input
                  type="text"
                  value={formData.hero.cta_primary_text}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, hero: { ...prev.hero, cta_primary_text: e.target.value } }))
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-slate-900/10"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-800 block mb-1">Texte Bouton Explorer (EN)</label>
                <input
                  type="text"
                  value={formData.hero.cta_primary_text_en}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, hero: { ...prev.hero, cta_primary_text_en: e.target.value } }))
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-slate-900/10"
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
             <ImageUploadInput
                value={formData.hero.primary_image}
                onChange={(url) =>
                  setFormData((prev) => ({ ...prev, hero: { ...prev.hero, primary_image: url } }))
                }
                label="Image Hero Principale"
                placeholder="URL ou uploader..."
              />
          </div>
        </div>
        
        {/* Badges */}
        <div className="pt-4 border-t border-slate-100">
           <h4 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
             <ShieldCheck className="w-4 h-4 text-orange-500" /> Badges de Confiance
           </h4>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {formData.hero.trust_badges?.map((badge, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase">Badge {idx + 1}</div>
                  <input
                    type="text"
                    value={badge.title}
                    onChange={(e) => setFormData(prev => {
                      const newBadges = [...(prev.hero.trust_badges || [])];
                      newBadges[idx] = { ...newBadges[idx], title: e.target.value };
                      return { ...prev, hero: { ...prev.hero, trust_badges: newBadges } };
                    })}
                    placeholder="Titre"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    value={badge.description}
                    onChange={(e) => setFormData(prev => {
                      const newBadges = [...(prev.hero.trust_badges || [])];
                      newBadges[idx] = { ...newBadges[idx], description: e.target.value };
                      return { ...prev, hero: { ...prev.hero, trust_badges: newBadges } };
                    })}
                    placeholder="Description"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
             ))}
           </div>
        </div>
      </div>

      {/* 3. COLLECTIONS HEADERS */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-serif font-bold text-slate-900">
              3. En-têtes de Collections
            </h3>
          </div>
          <SaveButton />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
             <h4 className="text-sm font-semibold text-slate-800">Nouveautés de l'Atelier</h4>
             <input type="text" value={formData.collections.newArrivals.title} onChange={(e) => setFormData(prev => ({...prev, collections: {...prev.collections, newArrivals: {...prev.collections.newArrivals, title: e.target.value}}}))} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs" placeholder="Titre" />
             <textarea rows={2} value={formData.collections.newArrivals.description} onChange={(e) => setFormData(prev => ({...prev, collections: {...prev.collections, newArrivals: {...prev.collections.newArrivals, description: e.target.value}}}))} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs" placeholder="Description" />
          </div>
          <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
             <h4 className="text-sm font-semibold text-slate-800">Les Pièces Signature</h4>
             <input type="text" value={formData.collections.signaturePieces.title} onChange={(e) => setFormData(prev => ({...prev, collections: {...prev.collections, signaturePieces: {...prev.collections.signaturePieces, title: e.target.value}}}))} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs" placeholder="Titre" />
             <textarea rows={2} value={formData.collections.signaturePieces.description} onChange={(e) => setFormData(prev => ({...prev, collections: {...prev.collections, signaturePieces: {...prev.collections.signaturePieces, description: e.target.value}}}))} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs" placeholder="Description" />
          </div>
        </div>
      </div>

      {/* 4. CAROUSEL 3D */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-serif font-bold text-slate-900">
              4. Carrousel 3D (Produits Phares)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddCarouselSlide}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Ajouter</span>
            </button>
            <SaveButton />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formData.carousel3D.map((slide, idx) => (
            <div key={slide.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 relative group">
              <button type="button" onClick={() => handleRemoveCarouselSlide(idx)} className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white transition-colors cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="text-xs font-bold text-slate-400 uppercase">Slide n°{idx + 1}</div>
              <input type="text" value={slide.title} onChange={(e) => setFormData(prev => { const n = [...prev.carousel3D]; n[idx] = {...n[idx], title: e.target.value}; return {...prev, carousel3D: n} })} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold" placeholder="Titre" />
              <input type="text" value={slide.subtitle} onChange={(e) => setFormData(prev => { const n = [...prev.carousel3D]; n[idx] = {...n[idx], subtitle: e.target.value}; return {...prev, carousel3D: n} })} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs" placeholder="Sous-titre" />
              <ImageUploadInput value={slide.image} onChange={(url) => setFormData(prev => { const n = [...prev.carousel3D]; n[idx] = {...n[idx], image: url}; return {...prev, carousel3D: n} })} label="Image (PNG / JPG)" placeholder="URL..." />
            </div>
          ))}
        </div>
      </div>

      {/* 5. A PROPOS */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-serif font-bold text-slate-900">
              5. Page À Propos
            </h3>
          </div>
          <SaveButton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="space-y-4">
              <label className="text-xs font-semibold text-slate-800 block mb-1">Titre Hero About (FR)</label>
              <input type="text" value={formData.about.hero_title} onChange={(e) => setFormData(prev => ({...prev, about: {...prev.about, hero_title: e.target.value}}))} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
              <label className="text-xs font-semibold text-slate-800 block mb-1">Titre Hero About (EN)</label>
              <input type="text" value={formData.about.hero_title_en} onChange={(e) => setFormData(prev => ({...prev, about: {...prev.about, hero_title_en: e.target.value}}))} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
              
              <label className="text-xs font-semibold text-slate-800 block mb-1">Sous-titre Hero About (FR)</label>
              <textarea rows={3} value={formData.about.hero_subtitle} onChange={(e) => setFormData(prev => ({...prev, about: {...prev.about, hero_subtitle: e.target.value}}))} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
              <label className="text-xs font-semibold text-slate-800 block mb-1">Sous-titre Hero About (EN)</label>
              <textarea rows={3} value={formData.about.hero_subtitle_en} onChange={(e) => setFormData(prev => ({...prev, about: {...prev.about, hero_subtitle_en: e.target.value}}))} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
              
              <ImageUploadInput value={formData.about.hero_image} onChange={(url) => setFormData(prev => ({...prev, about: {...prev.about, hero_image: url}}))} label="Image Hero About" placeholder="URL..." />
           </div>
           <div className="space-y-4">
              <label className="text-xs font-semibold text-slate-800 block mb-1">Savoir-Faire Titre (FR)</label>
              <input type="text" value={formData.about.craftsmanship_title} onChange={(e) => setFormData(prev => ({...prev, about: {...prev.about, craftsmanship_title: e.target.value}}))} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
              <label className="text-xs font-semibold text-slate-800 block mb-1">Savoir-Faire Titre (EN)</label>
              <input type="text" value={formData.about.craftsmanship_title_en} onChange={(e) => setFormData(prev => ({...prev, about: {...prev.about, craftsmanship_title_en: e.target.value}}))} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
              
              <label className="text-xs font-semibold text-slate-800 block mb-1">Savoir-Faire Description (FR)</label>
              <textarea rows={4} value={formData.about.craftsmanship_text} onChange={(e) => setFormData(prev => ({...prev, about: {...prev.about, craftsmanship_text: e.target.value}}))} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
              <label className="text-xs font-semibold text-slate-800 block mb-1">Savoir-Faire Description (EN)</label>
              <textarea rows={4} value={formData.about.craftsmanship_text_en} onChange={(e) => setFormData(prev => ({...prev, about: {...prev.about, craftsmanship_text_en: e.target.value}}))} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
              
              <ImageUploadInput value={formData.about.craftsmanship_image} onChange={(url) => setFormData(prev => ({...prev, about: {...prev.about, craftsmanship_image: url}}))} label="Savoir-Faire Image" placeholder="URL..." />
           </div>
        </div>
      </div>

      {/* 6. PREUVES DE LIVRAISON */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-serif font-bold text-slate-900">
              6. Preuves de Livraison ("Preuves Réelles · 100% Livraisons Réussies")
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddDelivery}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Ajouter</span>
            </button>
            <SaveButton />
          </div>
        </div>
        <p className="text-xs text-slate-500 -mt-2">
          Cette section n'apparaît sur le site que si au moins une preuve est ajoutée ici.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(formData.about.deliveries || []).map((delivery, idx) => (
            <div key={delivery.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 relative group">
              <button
                type="button"
                onClick={() => handleRemoveDelivery(idx)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="text-xs font-bold text-slate-400 uppercase">Preuve n°{idx + 1}</div>

              <ImageUploadInput
                value={delivery.image}
                onChange={(url) => setFormData(prev => {
                  const n = [...(prev.about.deliveries || [])];
                  n[idx] = { ...n[idx], image: url };
                  return { ...prev, about: { ...prev.about, deliveries: n } };
                })}
                label="Photo"
                placeholder="URL..."
              />
              <input
                type="text"
                value={delivery.article}
                onChange={(e) => setFormData(prev => {
                  const n = [...(prev.about.deliveries || [])];
                  n[idx] = { ...n[idx], article: e.target.value };
                  return { ...prev, about: { ...prev.about, deliveries: n } };
                })}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                placeholder="Article livré (ex: Costume Croisé Zongo Prestige)"
              />
              <input
                type="text"
                value={delivery.location}
                onChange={(e) => setFormData(prev => {
                  const n = [...(prev.about.deliveries || [])];
                  n[idx] = { ...n[idx], location: e.target.value };
                  return { ...prev, about: { ...prev.about, deliveries: n } };
                })}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                placeholder="Lieu (ex: Haie Vive, Cotonou)"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={delivery.time}
                  onChange={(e) => setFormData(prev => {
                    const n = [...(prev.about.deliveries || [])];
                    n[idx] = { ...n[idx], time: e.target.value };
                    return { ...prev, about: { ...prev.about, deliveries: n } };
                  })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  placeholder="Délai (ex: 45 min)"
                />
                <input
                  type="text"
                  value={delivery.rating}
                  onChange={(e) => setFormData(prev => {
                    const n = [...(prev.about.deliveries || [])];
                    n[idx] = { ...n[idx], rating: e.target.value };
                    return { ...prev, about: { ...prev.about, deliveries: n } };
                  })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  placeholder="Note (ex: 5.0)"
                />
              </div>
              <input
                type="text"
                value={delivery.client}
                onChange={(e) => setFormData(prev => {
                  const n = [...(prev.about.deliveries || [])];
                  n[idx] = { ...n[idx], client: e.target.value };
                  return { ...prev, about: { ...prev.about, deliveries: n } };
                })}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                placeholder="Client (ex: Directeur Général — Société Immobilière)"
              />
              <input
                type="text"
                value={delivery.status}
                onChange={(e) => setFormData(prev => {
                  const n = [...(prev.about.deliveries || [])];
                  n[idx] = { ...n[idx], status: e.target.value };
                  return { ...prev, about: { ...prev.about, deliveries: n } };
                })}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                placeholder="Statut (ex: Livré & Essayé à domicile)"
              />
            </div>
          ))}
        </div>
        {(formData.about.deliveries || []).length === 0 && (
          <p className="text-xs text-slate-400 text-center py-4">
            Aucune preuve pour l'instant — cliquez sur "Ajouter" pour en créer une.
          </p>
        )}
      </div>

      {/* Pro Save Notification Toast */}
      {savedSuccess && (
        <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-50 animate-slide-up border border-slate-800">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100">Modifications Publiées</h4>
            <p className="text-xs text-slate-400 mt-0.5">La vitrine a été mise à jour avec succès.</p>
          </div>
        </div>
      )}

    </form>
  );
};

/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description ImageUploadInput — Upload réel vers /api/upload (VPS) avec
 *              fallback base64 si le serveur est indisponible (dev local).
 * @created 2026-08-19
 * @updated 2026-08-21
 * 🌐 ceo.nexus-partners.xyz
 * 📧 daoudaabassichristian@gmail.com
 */

import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X, Loader2, AlertCircle } from 'lucide-react';

interface ImageUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  id?: string;
}

const MAX_SIZE_MB  = 8;
const MAX_SIZE_B   = MAX_SIZE_MB * 1024 * 1024;
const UPLOAD_API   = '/api/upload.php';

const getOrRefreshToken = async (): Promise<string | null> => {
  let token = localStorage.getItem('admin_token');
  if (token) return token;
  try {
    const res = await fetch('/api/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: '1admin@artfashion.com', password: 'ArtFasq12345@.com' }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('admin_token', data.token);
        return data.token;
      }
    }
  } catch {
    // Mode hors ligne ou backend inaccessible
  }
  return null;
};

/**
 * Compresse et redimensionne une image côté client pour éviter la saturation réseau ou mémoire.
 */
const compressImage = (file: File, maxWidth = 1600, quality = 0.85): Promise<File> => {
  return new Promise((resolve) => {
    if (file.type === 'image/gif' || file.type === 'image/svg+xml') {
      return resolve(file);
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(file);
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            const compressed = new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            resolve(compressed);
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  value,
  onChange,
  label = 'Image produit (PNG / JPG / WEBP — max 8 Mo)',
  placeholder = 'URL publique ou chemin /uploads/…',
  id,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg,    setErrorMsg]    = useState<string | null>(null);

  // ── Tente un upload via l'API serveur ──────────────────────────────────────
  const uploadToServer = async (file: File): Promise<string | null> => {
    let token = await getOrRefreshToken();
    const formData = new FormData();
    formData.append('image', file);

    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    let res = await fetch(UPLOAD_API, { method: 'POST', headers, body: formData });

    // Si le token a expiré côté serveur, on régénère et on retente une fois
    if (res.status === 401) {
      localStorage.removeItem('admin_token');
      token = await getOrRefreshToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
        res = await fetch(UPLOAD_API, { method: 'POST', headers, body: formData });
      }
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Erreur HTTP ${res.status}`);
    }
    const json = await res.json();
    return json.url as string; // ex: "/uploads/1789742098_abc123.webp"
  };

  // ── Fallback local : encodage base64 optimisé (dev local sans serveur) ─────
  const encodeBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror  = reject;
      reader.readAsDataURL(file);
    });

  // ── Handler principal ──────────────────────────────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);

    if (file.size > MAX_SIZE_B) {
      setErrorMsg(`Fichier trop volumineux (${(file.size / 1_048_576).toFixed(1)} Mo). Max : ${MAX_SIZE_MB} Mo.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploading(true);

    try {
      // 0. Optimisation et compression de l'image (WebP)
      const optimizedFile = await compressImage(file, 1600, 0.85);

      // 1. Essai upload serveur (production OVH)
      const serverUrl = await uploadToServer(optimizedFile);
      if (serverUrl) {
        onChange(serverUrl);
        return;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      console.warn('[ImageUpload] Serveur upload échec:', message);

      const isProduction =
        typeof window !== 'undefined' &&
        window.location.hostname !== 'localhost' &&
        window.location.hostname !== '127.0.0.1';

      if (isProduction) {
        // En production, on affiche l'erreur clairement pour éviter de saturer le localStorage
        setErrorMsg(`Échec du téléversement (${message}). Veuillez vérifier votre connexion et réessayer.`);
      } else {
        // En développement local sans PHP, on compresse fortement avant le base64 fallback
        try {
          const miniFile = await compressImage(file, 800, 0.7);
          const b64 = await encodeBase64(miniFile);
          onChange(b64);
        } catch {
          setErrorMsg('Impossible de traiter cette image.');
        }
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ── Suppression ────────────────────────────────────────────────────────────
  const handleRemove = async () => {
    // Si c'est une URL serveur, on peut notifier l'API (optionnel)
    if (value && value.startsWith('/uploads/')) {
      const filename = value.replace('/uploads/', '');
      fetch(`/api/upload.php?filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE',
        headers: authHeaders(),
      }).catch(() => {});
    }
    onChange('');
  };

  // ── Rendu ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-semibold text-slate-800 block mb-1">{label}</label>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

        {/* Miniature aperçu */}
        {value ? (
          <div className="relative w-16 h-16 rounded-xl border border-slate-200 overflow-hidden shrink-0 bg-slate-100 group">
            <img src={value} alt="Aperçu produit" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={handleRemove}
              disabled={isUploading}
              className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              title="Supprimer l'image"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center shrink-0 bg-slate-50 text-slate-400">
            {isUploading
              ? <Loader2 className="w-5 h-5 animate-spin text-red-500" />
              : <ImageIcon className="w-6 h-6" />
            }
          </div>
        )}

        <div className="flex-1 space-y-2">
          {/* Bouton upload */}
          <div className="flex items-center gap-2 flex-wrap">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
              id={id ? `${id}-file` : undefined}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer border border-slate-200"
            >
              {isUploading
                ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Envoi en cours…</span></>
                : <><Upload className="w-4 h-4 text-slate-600" /><span>Téléverser (PNG / JPG / WEBP)</span></>
              }
            </button>
            <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">Max {MAX_SIZE_MB} Mo</span>
          </div>

          {/* Saisie URL manuelle */}
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
            id={id}
          />

          {/* Message d'erreur */}
          {errorMsg && (
            <p className="flex items-center gap-1.5 text-[11px] text-red-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errorMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

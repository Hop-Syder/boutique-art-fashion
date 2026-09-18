/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description Universal Persistent Local Storage Engine with Real-Time BroadcastChannel for ART FASHION Cotonou
 * @created 2026-08-19
 * @updated 2026-08-28
 * 🌐 ceo.nexus-partners.xyz
 * 📧 daoudaabassichristian@gmail.com
 */

import { Product, Category, StoreSettings, FilterGroup, SectionsConfig, DeliveryZone } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_STORE_SETTINGS, INITIAL_FILTERS, INITIAL_SECTIONS_CONFIG, INITIAL_DELIVERY_ZONES } from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'art_fashion_products_v1',
  CATEGORIES: 'art_fashion_categories_v1',
  FILTERS: 'art_fashion_filters_v1',
  SETTINGS: 'art_fashion_settings_v1',
  ORDERS: 'art_fashion_orders_v1',
  SECTIONS_CONFIG: 'art_fashion_sections_config_v1',
  DELIVERY_ZONES: 'art_fashion_delivery_zones_v1',
};

const CHANNEL_NAME = 'art_fashion_store_sync_channel';

export interface StorageSyncMessage {
  type:
    | 'PRODUCTS_UPDATED'
    | 'SETTINGS_UPDATED'
    | 'CATEGORIES_UPDATED'
    | 'FILTERS_UPDATED'
    | 'ORDERS_UPDATED'
    | 'SECTIONS_UPDATED'
    | 'ZONES_UPDATED'
    | 'FULL_RESET';
  timestamp: number;
}

const DATA_API_URL = '/api/data.php';

// Empêche hydrateFromServer() d'écraser une modification locale pas encore
// confirmée par le serveur (race condition : sync en cours + reload/autre
// appareil qui hydrate entre-temps depuis une version plus ancienne).
const SYNC_PENDING_AT_KEY = 'art_fashion_sync_pending_at';
const LAST_SYNCED_AT_KEY = 'art_fashion_last_synced_at';
const SYNC_PENDING_STALE_MS = 30_000; // onglet fermé pendant la requête : on ne bloque pas indéfiniment

class StorageEngine {
  private broadcastChannel: BroadcastChannel | null = null;
  private syncListeners: Array<(msg: StorageSyncMessage) => void> = [];

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
        this.broadcastChannel.onmessage = (event) => {
          const data = event.data as StorageSyncMessage;
          this.notifyListeners(data);
        };
      } catch (err) {
        console.warn('BroadcastChannel initialization fallback:', err);
      }
    }
  }

  public subscribe(listener: (msg: StorageSyncMessage) => void): () => void {
    this.syncListeners.push(listener);
    return () => {
      this.syncListeners = this.syncListeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(msg: StorageSyncMessage): void {
    this.syncListeners.forEach((listener) => listener(msg));
  }

  private broadcast(type: StorageSyncMessage['type']): void {
    const msg: StorageSyncMessage = { type, timestamp: Date.now() };
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(msg);
      } catch (e) {
        console.warn('Broadcast error:', e);
      }
    }
    this.notifyListeners(msg);
  }

  // ─── TAMPON MÉMOIRE HAUTE CAPACITÉ (In-Memory Buffer RAM) ───────────────────
  // Ce tampon mémoire en RAM stocke l'intégralité des données en direct.
  // Contrairement à localStorage (limité à ~5 Mo par le navigateur), la mémoire
  // RAM n'a aucune restriction de quota et reste disponible instantanément pour
  // tous les composants React de toutes les sections.
  private memoryBuffer: Map<string, string> = new Map();

  /**
   * Récupère une valeur en priorité depuis le tampon mémoire RAM,
   * puis depuis localStorage avec clé de secours optionnelle.
   */
  private safeGetItem(key: string, fallbackKey?: string): string | null {
    if (this.memoryBuffer.has(key)) {
      return this.memoryBuffer.get(key) || null;
    }
    if (typeof window === 'undefined') return null;

    let val: string | null = null;
    try {
      val = localStorage.getItem(key);
      if (!val && fallbackKey) {
        val = localStorage.getItem(fallbackKey);
      }
    } catch (e) {
      console.warn(`[storageService] Lecture localStorage (${key}) impossible:`, e);
    }

    if (val !== null) {
      this.memoryBuffer.set(key, val);
    }
    return val;
  }

  /**
   * Purge les anciennes clés obsolètes du domaine pour libérer du quota.
   */
  private cleanObsoleteStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const obsoletePrefixes = ['ayele_', 'temp_', 'debug_', 'test_'];
      const toRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && obsoletePrefixes.some((p) => k.startsWith(p))) {
          toRemove.push(k);
        }
      }
      toRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.warn('[storageService] Erreur purge clés obsolètes:', e);
    }
  }

  /**
   * Écrit dans le tampon mémoire RAM et dans localStorage de manière résiliente.
   * Si une section dépasse le quota de 5 Mo de localStorage, les données restent
   * 100% préservées dans le tampon mémoire et sont synchronisées vers le serveur OVH.
   */
  private safeSetItem(key: string, value: string): void {
    // 1. Toujours enregistrer immédiatement dans le tampon mémoire RAM (sans limite de quota)
    this.memoryBuffer.set(key, value);

    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(key, value);
    } catch (err: unknown) {
      const isQuotaError =
        (err instanceof DOMException && (err.name === 'QuotaExceededError' || err.code === 22)) ||
        (typeof err === 'object' && err !== null && 'name' in err && (err as { name: string }).name === 'QuotaExceededError');

      if (isQuotaError) {
        console.warn(`[storageService] Quota localStorage dépassé pour "${key}". Libération d'espace...`);
        this.cleanObsoleteStorage();

        try {
          localStorage.setItem(key, value);
        } catch {
          // Si le quota local reste saturé, le tampon mémoire RAM prend le relais
          // sans aucune alerte bloquante pour l'utilisateur.
          console.info(`[storageService] Recours au tampon mémoire RAM pour "${key}" (protection quota active).`);
        }
      } else {
        console.error(`[storageService] Erreur d'écriture localStorage (${key}):`, err);
      }
    }
  }

  // --- SERVER PERSISTENCE (survives cache clears / new browsers, via VPS db.json) ---

  // Direct sync to server, throws if error
  private async syncToServer(): Promise<void> {
    if (typeof window === 'undefined') return;

    const syncedAt = new Date().toISOString();
    const payload = {
      version: '1.0.0',
      syncedAt,
      products: this.getProducts(),
      categories: this.getCategories(),
      filters: this.getFilters(),
      settings: this.getSettings(),
      orders: this.getOrders(),
      sectionsConfig: this.getSectionsConfig(),
      deliveryZones: this.getDeliveryZones(),
    };

    this.safeSetItem(SYNC_PENDING_AT_KEY, String(Date.now()));
    try {
      const response = await fetch(DATA_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status} ${response.statusText}`);
      }
      this.safeSetItem(LAST_SYNCED_AT_KEY, syncedAt);
    } finally {
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem(SYNC_PENDING_AT_KEY);
        } catch {}
      }
      this.memoryBuffer.delete(SYNC_PENDING_AT_KEY);
    }
  }

  // Pulls the VPS-persisted snapshot once at startup and applies it locally.
  // Refuse d'écraser le local si : (1) une synchronisation vers le serveur est
  // en cours (évite qu'un hydrate concurrent efface une modif pas encore
  // confirmée), ou (2) le serveur n'a rien de plus récent que ce qu'on a déjà
  // nous-même confirmé lors d'un précédent syncToServer().
  public async hydrateFromServer(): Promise<void> {
    if (typeof window === 'undefined') return;

    const pendingAt = Number(localStorage.getItem(SYNC_PENDING_AT_KEY) || 0);
    if (pendingAt && Date.now() - pendingAt < SYNC_PENDING_STALE_MS) {
      console.warn('Hydrate ignoré : une synchronisation locale est en cours.');
      return;
    }

    try {
      const timestamp = Date.now();
      const response = await fetch(`${DATA_API_URL}?t=${timestamp}`, {
        cache: 'no-store'
      });
      if (!response.ok) return;

      const data = await response.json();
      if (!data) return;

      const localLastSynced = localStorage.getItem(LAST_SYNCED_AT_KEY);
      if (data.syncedAt && localLastSynced && data.syncedAt <= localLastSynced) {
        // Le serveur n'a rien de plus récent que ce qu'on a déjà confirmé — ne rien écraser.
        return;
      }

      // Update localStorage WITHOUT triggering save methods to avoid re-POSTing
      if (Array.isArray(data.products)) this.safeSetItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(data.products));
      if (Array.isArray(data.categories)) {
        const mergedCategories = this.mergeWithInitialCategories(data.categories);
        this.safeSetItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(mergedCategories));
        // Si le serveur a fourni une liste tronquée, auto-réparer le snapshot serveur
        if (mergedCategories.length > data.categories.length) {
          setTimeout(() => {
            this.syncToServer().catch((err) =>
              console.warn('[storageService] Auto-réparation des catégories sur le serveur différée:', err)
            );
          }, 1500);
        }
      }
      if (Array.isArray(data.filters)) this.safeSetItem(STORAGE_KEYS.FILTERS, JSON.stringify(data.filters));
      if (data.settings && typeof data.settings === 'object') this.safeSetItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
      if (Array.isArray(data.orders)) this.safeSetItem(STORAGE_KEYS.ORDERS, JSON.stringify(data.orders));
      if (data.sectionsConfig && typeof data.sectionsConfig === 'object') this.safeSetItem(STORAGE_KEYS.SECTIONS_CONFIG, JSON.stringify(data.sectionsConfig));
      if (Array.isArray(data.deliveryZones)) this.safeSetItem(STORAGE_KEYS.DELIVERY_ZONES, JSON.stringify(data.deliveryZones));
      if (data.syncedAt) this.safeSetItem(LAST_SYNCED_AT_KEY, data.syncedAt);

      // Broadcast changes to UI
      this.broadcast('FULL_RESET');
    } catch (err) {
      console.warn('Server hydration skipped (offline?):', err);
    }
  }

  // --- PRODUCTS ---
  public getProducts(): Product[] {
    if (typeof window === 'undefined') return INITIAL_PRODUCTS;
    const raw = this.safeGetItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) return INITIAL_PRODUCTS;
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PRODUCTS;
    }
  }

  public async saveProducts(products: Product[]): Promise<void> {
    if (typeof window === 'undefined') return;
    this.safeSetItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    await this.syncToServer();
    this.broadcast('PRODUCTS_UPDATED');
  }

  // --- CATEGORIES ---
  /**
   * Consolide et fusionne les catégories sauvegardées avec INITIAL_CATEGORIES.
   * Garantit que toutes les catégories officielles du catalogue Art Fashion
   * (Prêt-à-porter, Souliers, Accessoires et sous-rayons) restent toujours
   * complètes et sélectionnables dans l'admin, même si un instantané distant
   * ou local était incomplet ou tronqué.
   */
  public mergeWithInitialCategories(saved: Category[]): Category[] {
    if (!Array.isArray(saved) || saved.length === 0) {
      return [...INITIAL_CATEGORIES];
    }

    const savedMap = new Map<string, Category>();
    saved.forEach((c) => {
      if (c && c.id) savedMap.set(c.id, c);
    });

    const result: Category[] = [];
    const processedIds = new Set<string>();

    // 1. Réintégrer toutes les catégories de base en préservant les modifications
    INITIAL_CATEGORIES.forEach((initCat) => {
      const existing = savedMap.get(initCat.id);
      if (existing) {
        result.push({
          ...initCat,
          ...existing,
          parent_id: existing.parent_id !== undefined ? existing.parent_id : initCat.parent_id,
          is_active: existing.is_active !== undefined ? existing.is_active : true,
          is_archived: existing.is_archived || false,
        });
      } else {
        result.push({ ...initCat });
      }
      processedIds.add(initCat.id);
    });

    // 2. Conserver les catégories additionnelles créées par l'utilisateur
    saved.forEach((c) => {
      if (c && c.id && !processedIds.has(c.id)) {
        result.push(c);
        processedIds.add(c.id);
      }
    });

    return result;
  }

  public getCategories(): Category[] {
    if (typeof window === 'undefined') return INITIAL_CATEGORIES;
    const raw = this.safeGetItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) return INITIAL_CATEGORIES;
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_CATEGORIES;
      const merged = this.mergeWithInitialCategories(parsed);
      // Auto-réparation du cache local si des catégories manquaient
      if (merged.length !== parsed.length) {
        this.safeSetItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(merged));
      }
      return merged;
    } catch {
      return INITIAL_CATEGORIES;
    }
  }

  public async saveCategories(categories: Category[]): Promise<void> {
    if (typeof window === 'undefined') return;
    const consolidated = this.mergeWithInitialCategories(categories);
    this.safeSetItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(consolidated));
    await this.syncToServer();
    this.broadcast('CATEGORIES_UPDATED');
  }

  // --- FILTERS ---
  public getFilters(): FilterGroup[] {
    if (typeof window === 'undefined') return INITIAL_FILTERS;
    const raw = this.safeGetItem(STORAGE_KEYS.FILTERS);
    if (!raw) return INITIAL_FILTERS;
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_FILTERS;
    }
  }

  public async saveFilters(filters: FilterGroup[]): Promise<void> {
    if (typeof window === 'undefined') return;
    this.safeSetItem(STORAGE_KEYS.FILTERS, JSON.stringify(filters));
    await this.syncToServer();
    this.broadcast('FILTERS_UPDATED');
  }

  // --- SETTINGS ---
  public getSettings(): StoreSettings {
    if (typeof window === 'undefined') return INITIAL_STORE_SETTINGS;
    const raw = this.safeGetItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return INITIAL_STORE_SETTINGS;
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_STORE_SETTINGS;
    }
  }

  public async saveSettings(settings: StoreSettings): Promise<void> {
    if (typeof window === 'undefined') return;
    this.safeSetItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    await this.syncToServer();
    this.broadcast('SETTINGS_UPDATED');
  }

  // --- ORDERS ---
  public getOrders(): any[] {
    if (typeof window === 'undefined') return [];
    const raw = this.safeGetItem(STORAGE_KEYS.ORDERS, 'ayele_orders');
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public async saveOrders(orders: any[]): Promise<void> {
    if (typeof window === 'undefined') return;
    this.safeSetItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    await this.syncToServer();
    this.broadcast('ORDERS_UPDATED');
  }

  // --- SECTIONS CONFIG ---
  public getSectionsConfig(): SectionsConfig {
    if (typeof window === 'undefined') return INITIAL_SECTIONS_CONFIG;
    const raw = this.safeGetItem(STORAGE_KEYS.SECTIONS_CONFIG, 'ayele_sections_config');
    if (!raw) return INITIAL_SECTIONS_CONFIG;
    try {
      const parsed = JSON.parse(raw);
      return {
        ...INITIAL_SECTIONS_CONFIG,
        ...parsed,
        topBar: { ...INITIAL_SECTIONS_CONFIG.topBar, ...(parsed.topBar || {}) },
        hero: { 
          ...INITIAL_SECTIONS_CONFIG.hero, 
          ...(parsed.hero || {}),
          trust_badges: parsed.hero?.trust_badges || INITIAL_SECTIONS_CONFIG.hero.trust_badges 
        },
        collections: { ...INITIAL_SECTIONS_CONFIG.collections, ...(parsed.collections || {}) },
        carousel3D: parsed.carousel3D || INITIAL_SECTIONS_CONFIG.carousel3D,
        about: { ...INITIAL_SECTIONS_CONFIG.about, ...(parsed.about || {}) },
      };
    } catch {
      return INITIAL_SECTIONS_CONFIG;
    }
  }

  public async saveSectionsConfig(config: SectionsConfig): Promise<void> {
    if (typeof window === 'undefined') return;
    this.safeSetItem(STORAGE_KEYS.SECTIONS_CONFIG, JSON.stringify(config));
    await this.syncToServer();
    this.broadcast('SECTIONS_UPDATED');
  }

  // --- DELIVERY ZONES ---
  public getDeliveryZones(): DeliveryZone[] {
    if (typeof window === 'undefined') return INITIAL_DELIVERY_ZONES;
    const raw = this.safeGetItem(STORAGE_KEYS.DELIVERY_ZONES, 'ayele_delivery_zones');
    if (!raw) return INITIAL_DELIVERY_ZONES;
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_DELIVERY_ZONES;
    }
  }

  public async saveDeliveryZones(zones: DeliveryZone[]): Promise<void> {
    if (typeof window === 'undefined') return;
    this.safeSetItem(STORAGE_KEYS.DELIVERY_ZONES, JSON.stringify(zones));
    await this.syncToServer();
    this.broadcast('ZONES_UPDATED');
  }

  // --- BACKUP & RESTORE ---
  public exportDataJSON(): string {
    const data = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      products: this.getProducts(),
      categories: this.getCategories(),
      filters: this.getFilters(),
      settings: this.getSettings(),
      sectionsConfig: this.getSectionsConfig(),
      deliveryZones: this.getDeliveryZones(),
    };
    return JSON.stringify(data, null, 2);
  }

  public async importDataJSON(jsonString: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(jsonString);
      
      if (parsed.products && Array.isArray(parsed.products)) this.safeSetItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(parsed.products));
      if (parsed.categories && Array.isArray(parsed.categories)) this.safeSetItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(parsed.categories));
      if (parsed.filters && Array.isArray(parsed.filters)) this.safeSetItem(STORAGE_KEYS.FILTERS, JSON.stringify(parsed.filters));
      if (parsed.settings && typeof parsed.settings === 'object') this.safeSetItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed.settings));
      
      await this.syncToServer();
      this.broadcast('FULL_RESET');
      return true;
    } catch (err) {
      console.error('Failed to import JSON data:', err);
      return false;
    }
  }

  public async resetToDefault(): Promise<void> {
    this.memoryBuffer.clear();
    this.safeSetItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    this.safeSetItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    this.safeSetItem(STORAGE_KEYS.FILTERS, JSON.stringify(INITIAL_FILTERS));
    this.safeSetItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_STORE_SETTINGS));
    this.safeSetItem(STORAGE_KEYS.SECTIONS_CONFIG, JSON.stringify(INITIAL_SECTIONS_CONFIG));
    this.safeSetItem(STORAGE_KEYS.DELIVERY_ZONES, JSON.stringify(INITIAL_DELIVERY_ZONES));
    
    await this.syncToServer();
    this.broadcast('FULL_RESET');
  }
}

export const storageService = new StorageEngine();

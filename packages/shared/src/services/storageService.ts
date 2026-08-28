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
  ORDERS: 'ayele_orders',
  SECTIONS_CONFIG: 'ayele_sections_config',
  DELIVERY_ZONES: 'ayele_delivery_zones',
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

    localStorage.setItem(SYNC_PENDING_AT_KEY, String(Date.now()));
    try {
      const response = await fetch(DATA_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status} ${response.statusText}`);
      }
      localStorage.setItem(LAST_SYNCED_AT_KEY, syncedAt);
    } finally {
      localStorage.removeItem(SYNC_PENDING_AT_KEY);
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
      if (Array.isArray(data.products)) localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(data.products));
      if (Array.isArray(data.categories)) localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(data.categories));
      if (Array.isArray(data.filters)) localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(data.filters));
      if (data.settings && typeof data.settings === 'object') localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
      if (Array.isArray(data.orders)) localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(data.orders));
      if (data.sectionsConfig && typeof data.sectionsConfig === 'object') localStorage.setItem(STORAGE_KEYS.SECTIONS_CONFIG, JSON.stringify(data.sectionsConfig));
      if (Array.isArray(data.deliveryZones)) localStorage.setItem(STORAGE_KEYS.DELIVERY_ZONES, JSON.stringify(data.deliveryZones));
      if (data.syncedAt) localStorage.setItem(LAST_SYNCED_AT_KEY, data.syncedAt);

      // Broadcast changes to UI
      this.broadcast('FULL_RESET');
    } catch (err) {
      console.warn('Server hydration skipped (offline?):', err);
    }
  }

  // --- PRODUCTS ---
  public getProducts(): Product[] {
    if (typeof window === 'undefined') return INITIAL_PRODUCTS;
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) return INITIAL_PRODUCTS;
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PRODUCTS;
    }
  }

  public async saveProducts(products: Product[]): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    await this.syncToServer();
    this.broadcast('PRODUCTS_UPDATED');
  }

  // --- CATEGORIES ---
  public getCategories(): Category[] {
    if (typeof window === 'undefined') return INITIAL_CATEGORIES;
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) return INITIAL_CATEGORIES;
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CATEGORIES;
    }
  }

  public async saveCategories(categories: Category[]): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    await this.syncToServer();
    this.broadcast('CATEGORIES_UPDATED');
  }

  // --- FILTERS ---
  public getFilters(): FilterGroup[] {
    if (typeof window === 'undefined') return INITIAL_FILTERS;
    const raw = localStorage.getItem(STORAGE_KEYS.FILTERS);
    if (!raw) return INITIAL_FILTERS;
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_FILTERS;
    }
  }

  public async saveFilters(filters: FilterGroup[]): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(filters));
    await this.syncToServer();
    this.broadcast('FILTERS_UPDATED');
  }

  // --- SETTINGS ---
  public getSettings(): StoreSettings {
    if (typeof window === 'undefined') return INITIAL_STORE_SETTINGS;
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return INITIAL_STORE_SETTINGS;
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_STORE_SETTINGS;
    }
  }

  public async saveSettings(settings: StoreSettings): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    await this.syncToServer();
    this.broadcast('SETTINGS_UPDATED');
  }

  // --- ORDERS ---
  public getOrders(): any[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public async saveOrders(orders: any[]): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    await this.syncToServer();
    this.broadcast('ORDERS_UPDATED');
  }

  // --- SECTIONS CONFIG ---
  public getSectionsConfig(): SectionsConfig {
    if (typeof window === 'undefined') return INITIAL_SECTIONS_CONFIG;
    const raw = localStorage.getItem(STORAGE_KEYS.SECTIONS_CONFIG);
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
    localStorage.setItem(STORAGE_KEYS.SECTIONS_CONFIG, JSON.stringify(config));
    await this.syncToServer();
    this.broadcast('SECTIONS_UPDATED');
  }

  // --- DELIVERY ZONES ---
  public getDeliveryZones(): DeliveryZone[] {
    if (typeof window === 'undefined') return INITIAL_DELIVERY_ZONES;
    const raw = localStorage.getItem(STORAGE_KEYS.DELIVERY_ZONES);
    if (!raw) return INITIAL_DELIVERY_ZONES;
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_DELIVERY_ZONES;
    }
  }

  public async saveDeliveryZones(zones: DeliveryZone[]): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.DELIVERY_ZONES, JSON.stringify(zones));
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
      
      if (parsed.products && Array.isArray(parsed.products)) localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(parsed.products));
      if (parsed.categories && Array.isArray(parsed.categories)) localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(parsed.categories));
      if (parsed.filters && Array.isArray(parsed.filters)) localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(parsed.filters));
      if (parsed.settings && typeof parsed.settings === 'object') localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed.settings));
      
      await this.syncToServer();
      this.broadcast('FULL_RESET');
      return true;
    } catch (err) {
      console.error('Failed to import JSON data:', err);
      return false;
    }
  }

  public async resetToDefault(): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(INITIAL_FILTERS));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_STORE_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.SECTIONS_CONFIG, JSON.stringify(INITIAL_SECTIONS_CONFIG));
    localStorage.setItem(STORAGE_KEYS.DELIVERY_ZONES, JSON.stringify(INITIAL_DELIVERY_ZONES));
    
    await this.syncToServer();
    this.broadcast('FULL_RESET');
  }
}

export const storageService = new StorageEngine();

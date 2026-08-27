/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description Universal Persistent Local Storage Engine with Real-Time BroadcastChannel for ART FASHION Cotonou
 * @created 2026-08-19
 * @updated 2026-08-19
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
const SERVER_SYNC_DEBOUNCE_MS = 800;

class StorageEngine {
  private broadcastChannel: BroadcastChannel | null = null;
  private syncListeners: Array<(msg: StorageSyncMessage) => void> = [];
  private isHydrating = false;
  private serverSyncTimer: ReturnType<typeof setTimeout> | null = null;

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
    this.scheduleServerSync();
  }

  // --- SERVER PERSISTENCE (survives cache clears / new browsers, via VPS db.json) ---

  // Debounced: avoids one request per keystroke when several save*() calls fire in a row.
  private scheduleServerSync(): void {
    if (typeof window === 'undefined' || this.isHydrating) return;
    if (this.serverSyncTimer) clearTimeout(this.serverSyncTimer);
    this.serverSyncTimer = setTimeout(() => {
      const payload = {
        version: '1.0.0',
        syncedAt: new Date().toISOString(),
        products: this.getProducts(),
        categories: this.getCategories(),
        filters: this.getFilters(),
        settings: this.getSettings(),
        orders: this.getOrders(),
        sectionsConfig: this.getSectionsConfig(),
        deliveryZones: this.getDeliveryZones(),
      };
      fetch(DATA_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch((err) => console.warn('Server sync unavailable (offline?):', err));
    }, SERVER_SYNC_DEBOUNCE_MS);
  }

  // Pulls the VPS-persisted snapshot once at startup and applies it locally.
  // Guarded by isHydrating so applying it doesn't immediately re-POST it back.
  public async hydrateFromServer(): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      const timestamp = Date.now();
      const response = await fetch(`${DATA_API_URL}?t=${timestamp}`, {
        cache: 'no-store'
      });
      if (!response.ok) return;
      const data = await response.json();
      if (!data) return;

      this.isHydrating = true;
      if (Array.isArray(data.products)) this.saveProducts(data.products);
      if (Array.isArray(data.categories)) this.saveCategories(data.categories);
      if (Array.isArray(data.filters)) this.saveFilters(data.filters);
      if (data.settings && typeof data.settings === 'object') this.saveSettings(data.settings);
      if (Array.isArray(data.orders)) this.saveOrders(data.orders);
      if (data.sectionsConfig && typeof data.sectionsConfig === 'object') this.saveSectionsConfig(data.sectionsConfig);
      if (Array.isArray(data.deliveryZones)) this.saveDeliveryZones(data.deliveryZones);
    } catch (err) {
      console.warn('Server hydration skipped (offline?):', err);
    } finally {
      this.isHydrating = false;
    }
  }

  // --- PRODUCTS ---
  public getProducts(): Product[] {
    if (typeof window === 'undefined') return INITIAL_PRODUCTS;
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      this.saveProducts(INITIAL_PRODUCTS);
      return INITIAL_PRODUCTS;
    }
    try {
      const parsed = JSON.parse(raw);
      return parsed;
    } catch {
      return INITIAL_PRODUCTS;
    }
  }

  public saveProducts(products: Product[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.broadcast('PRODUCTS_UPDATED');
  }

  // --- CATEGORIES ---
  public getCategories(): Category[] {
    if (typeof window === 'undefined') return INITIAL_CATEGORIES;
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) {
      this.saveCategories(INITIAL_CATEGORIES);
      return INITIAL_CATEGORIES;
    }
    try {
      const parsed = JSON.parse(raw);
      return parsed;
    } catch {
      return INITIAL_CATEGORIES;
    }
  }

  public saveCategories(categories: Category[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    this.broadcast('CATEGORIES_UPDATED');
  }

  // --- FILTERS ---
  public getFilters(): FilterGroup[] {
    if (typeof window === 'undefined') return INITIAL_FILTERS;
    const raw = localStorage.getItem(STORAGE_KEYS.FILTERS);
    if (!raw) {
      this.saveFilters(INITIAL_FILTERS);
      return INITIAL_FILTERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_FILTERS;
    }
  }

  public saveFilters(filters: FilterGroup[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(filters));
    this.broadcast('FILTERS_UPDATED');
  }

  // --- SETTINGS ---
  public getSettings(): StoreSettings {
    if (typeof window === 'undefined') return INITIAL_STORE_SETTINGS;
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      this.saveSettings(INITIAL_STORE_SETTINGS);
      return INITIAL_STORE_SETTINGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_STORE_SETTINGS;
    }
  }

  public saveSettings(settings: StoreSettings): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
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

  public saveOrders(orders: any[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.broadcast('ORDERS_UPDATED');
  }

  // --- SECTIONS CONFIG ---
  public getSectionsConfig(): SectionsConfig {
    if (typeof window === 'undefined') return INITIAL_SECTIONS_CONFIG;
    const raw = localStorage.getItem(STORAGE_KEYS.SECTIONS_CONFIG);
    if (!raw) {
      this.saveSectionsConfig(INITIAL_SECTIONS_CONFIG);
      return INITIAL_SECTIONS_CONFIG;
    }
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

  public saveSectionsConfig(config: SectionsConfig): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SECTIONS_CONFIG, JSON.stringify(config));
    this.broadcast('SECTIONS_UPDATED');
  }

  // --- DELIVERY ZONES ---
  public getDeliveryZones(): DeliveryZone[] {
    if (typeof window === 'undefined') return INITIAL_DELIVERY_ZONES;
    const raw = localStorage.getItem(STORAGE_KEYS.DELIVERY_ZONES);
    if (!raw) {
      this.saveDeliveryZones(INITIAL_DELIVERY_ZONES);
      return INITIAL_DELIVERY_ZONES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_DELIVERY_ZONES;
    }
  }

  public saveDeliveryZones(zones: DeliveryZone[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.DELIVERY_ZONES, JSON.stringify(zones));
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

  public importDataJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.products && Array.isArray(parsed.products)) {
        this.saveProducts(parsed.products);
      }
      if (parsed.categories && Array.isArray(parsed.categories)) {
        this.saveCategories(parsed.categories);
      }
      if (parsed.filters && Array.isArray(parsed.filters)) {
        this.saveFilters(parsed.filters);
      }
      if (parsed.settings && typeof parsed.settings === 'object') {
        this.saveSettings(parsed.settings);
      }
      this.broadcast('FULL_RESET');
      return true;
    } catch (err) {
      console.error('Failed to import JSON data:', err);
      return false;
    }
  }

  public resetToDefault(): void {
    this.saveProducts(INITIAL_PRODUCTS);
    this.saveCategories(INITIAL_CATEGORIES);
    this.saveFilters(INITIAL_FILTERS);
    this.saveSettings(INITIAL_STORE_SETTINGS);
    this.saveSectionsConfig(INITIAL_SECTIONS_CONFIG);
    this.saveDeliveryZones(INITIAL_DELIVERY_ZONES);
    this.broadcast('FULL_RESET');
  }
}

export const storageService = new StorageEngine();

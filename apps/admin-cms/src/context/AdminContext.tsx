import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Category,
  DeliveryZone,
  FilterGroup,
  Order,
  OrderStatus,
  Product,
  ProductVariant,
  SectionsConfig,
  StoreSettings,
  INITIAL_CATEGORIES,
  INITIAL_DELIVERY_ZONES,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_SECTIONS_CONFIG,
  INITIAL_STORE_SETTINGS,
  INITIAL_FILTERS,
  formatFCFA,
  getStorageItem,
  setStorageItem,
  storageService,
} from '@ayele/shared';

export type AdminTab =
  | 'products'
  | 'filters'
  | 'cms-sections'
  | 'orders'
  | 'delivery-zones'
  | 'settings';

interface AdminContextType {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;

  products: Product[];
  categories: Category[];
  filters: FilterGroup[];
  deliveryZones: DeliveryZone[];
  orders: Order[];
  settings: StoreSettings;
  sectionsConfig: SectionsConfig;

  // Product Operations
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  updateVariantStock: (productId: string, variantId: string, newStock: number) => Promise<void>;

  // Category Operations
  addCategory: (category: Category) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  archiveCategory: (categoryId: string) => Promise<void>;
  reorderCategories: (newOrderedCategories: Category[]) => Promise<void>;

  // Filter Operations
  addFilter: (filter: FilterGroup) => Promise<void>;
  updateFilter: (filter: FilterGroup) => Promise<void>;
  deleteFilter: (filterId: string) => Promise<void>;
  archiveFilter: (filterId: string) => Promise<void>;

  // CMS Section & Image Operations
  updateSectionsConfig: (newConfig: SectionsConfig) => Promise<void>;

  // Order Operations
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => Promise<void>;
  addCashierNote: (orderId: string, note: string) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;

  // Delivery Zone Operations
  addDeliveryZone: (zone: DeliveryZone) => Promise<void>;
  updateDeliveryZone: (zone: DeliveryZone) => Promise<void>;
  deleteDeliveryZone: (zoneId: string) => Promise<void>;

  // Store Settings
  updateSettings: (newSettings: StoreSettings) => Promise<void>;

  // System
  resetToDefaultData: () => Promise<void>;
  formatFCFA: (amount: number) => string;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('products');

  const [products, setProducts] = useState<Product[]>(() => storageService.getProducts());
  const [categories, setCategories] = useState<Category[]>(() => storageService.getCategories());
  const [filters, setFilters] = useState<FilterGroup[]>(() => storageService.getFilters());
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(() => storageService.getDeliveryZones());
  const [orders, setOrders] = useState<Order[]>(() => getStorageItem('ayele_orders', INITIAL_ORDERS));
  const [settings, setSettings] = useState<StoreSettings>(() => storageService.getSettings());
  const [sectionsConfig, setSectionsConfig] = useState<SectionsConfig>(() => storageService.getSectionsConfig());

  // Pull the VPS-persisted snapshot once at startup (survives cache clears / new browsers),
  // then reflect it into local state.
  useEffect(() => {
    storageService.hydrateFromServer().then(() => {
      setProducts(storageService.getProducts());
      setCategories(storageService.getCategories());
      setFilters(storageService.getFilters());
      setSettings(storageService.getSettings());
      setOrders(storageService.getOrders());
      setSectionsConfig(storageService.getSectionsConfig());
      setDeliveryZones(storageService.getDeliveryZones());
    });
  }, []);

  // Product CRUD
  const addProduct = async (newProduct: Product) => {
    const newList = [newProduct, ...products];
    await storageService.saveProducts(newList);
    setProducts(newList);
  };

  const updateProduct = async (updatedProduct: Product) => {
    const newList = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
    await storageService.saveProducts(newList);
    setProducts(newList);
  };

  const deleteProduct = async (productId: string) => {
    const newList = products.filter((p) => p.id !== productId);
    await storageService.saveProducts(newList);
    setProducts(newList);
  };

  const updateVariantStock = async (productId: string, variantId: string, newStock: number) => {
    const newList = products.map((p) => {
      if (p.id === productId) {
        const updatedVariants = p.variants.map((v) =>
          v.id === variantId ? { ...v, stock: Math.max(0, newStock) } : v
        );
        return { ...p, variants: updatedVariants };
      }
      return p;
    });
    await storageService.saveProducts(newList);
    setProducts(newList);
  };

  // Category CRUD
  const addCategory = async (newCategory: Category) => {
    const newList = [...categories, newCategory];
    await storageService.saveCategories(newList);
    setCategories(newList);
  };

  const updateCategory = async (updatedCategory: Category) => {
    const newList = categories.map((c) => (c.id === updatedCategory.id ? updatedCategory : c));
    await storageService.saveCategories(newList);
    setCategories(newList);
  };

  const archiveCategory = async (categoryId: string) => {
    const newList = categories.map((c) => (c.id === categoryId ? { ...c, is_archived: true, is_active: false } : c));
    await storageService.saveCategories(newList);
    setCategories(newList);
  };

  const deleteCategory = async (categoryId: string) => {
    const newList = categories.filter((c) => c.id !== categoryId);
    await storageService.saveCategories(newList);
    setCategories(newList);
  };

  const reorderCategories = async (newOrderedCategories: Category[]) => {
    await storageService.saveCategories(newOrderedCategories);
    setCategories(newOrderedCategories);
  };

  // Filter Group CRUD
  const addFilter = async (newFilter: FilterGroup) => {
    const newList = [...filters, newFilter];
    await storageService.saveFilters(newList);
    setFilters(newList);
  };

  const updateFilter = async (updatedFilter: FilterGroup) => {
    const newList = filters.map((f) => (f.id === updatedFilter.id ? updatedFilter : f));
    await storageService.saveFilters(newList);
    setFilters(newList);
  };

  const archiveFilter = async (filterId: string) => {
    const newList = filters.map((f) => (f.id === filterId ? { ...f, is_archived: true, is_active: false } : f));
    await storageService.saveFilters(newList);
    setFilters(newList);
  };

  const deleteFilter = async (filterId: string) => {
    const newList = filters.filter((f) => f.id !== filterId);
    await storageService.saveFilters(newList);
    setFilters(newList);
  };

  // CMS Section & Image Updates
  const updateSectionsConfig = async (newConfig: SectionsConfig) => {
    await storageService.saveSectionsConfig(newConfig);
    setSectionsConfig(newConfig);
  };

  // Order Management
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus, note?: string) => {
    const newList = orders.map((ord) => {
      if (ord.id === orderId) {
        const now = new Date().toISOString();
        const newEvent = {
          status: newStatus,
          timestamp: now,
          note: note || `Statut mis à jour vers ${newStatus}`,
        };
        return {
          ...ord,
          status: newStatus,
          tracking_history: [...ord.tracking_history, newEvent],
          updated_at: now,
        };
      }
      return ord;
    });
    await storageService.saveOrders(newList);
    setOrders(newList);
  };

  const addCashierNote = async (orderId: string, note: string) => {
    const newList = orders.map((ord) => (ord.id === orderId ? { ...ord, cashier_notes: note } : ord));
    await storageService.saveOrders(newList);
    setOrders(newList);
  };

  const deleteOrder = async (orderId: string) => {
    const newList = orders.filter((o) => o.id !== orderId);
    await storageService.saveOrders(newList);
    setOrders(newList);
  };

  // Delivery Zone CRUD
  const addDeliveryZone = async (zone: DeliveryZone) => {
    const newList = [...deliveryZones, zone];
    await storageService.saveDeliveryZones(newList);
    setDeliveryZones(newList);
  };

  const updateDeliveryZone = async (updatedZone: DeliveryZone) => {
    const newList = deliveryZones.map((z) => (z.id === updatedZone.id ? updatedZone : z));
    await storageService.saveDeliveryZones(newList);
    setDeliveryZones(newList);
  };

  const deleteDeliveryZone = async (zoneId: string) => {
    const newList = deliveryZones.filter((z) => z.id !== zoneId);
    await storageService.saveDeliveryZones(newList);
    setDeliveryZones(newList);
  };

  // Settings
  const updateSettings = async (newSettings: StoreSettings) => {
    await storageService.saveSettings(newSettings);
    setSettings(newSettings);
  };

  // Reset System
  const resetToDefaultData = async () => {
    if (window.confirm('Voulez-vous vraiment réinitialiser toutes les données aux valeurs par défaut ?')) {
      // Assuming storageService has a resetToDefault method or we just save initial states
      await storageService.saveProducts(INITIAL_PRODUCTS);
      await storageService.saveDeliveryZones(INITIAL_DELIVERY_ZONES);
      await storageService.saveOrders(INITIAL_ORDERS);
      await storageService.saveSettings(INITIAL_STORE_SETTINGS);
      await storageService.saveSectionsConfig(INITIAL_SECTIONS_CONFIG);
      setProducts(INITIAL_PRODUCTS);
      setDeliveryZones(INITIAL_DELIVERY_ZONES);
      setOrders(INITIAL_ORDERS);
      setSettings(INITIAL_STORE_SETTINGS);
      setSectionsConfig(INITIAL_SECTIONS_CONFIG);
      window.location.reload();
    }
  };

  return (
    <AdminContext.Provider
      value={{
        activeTab,
        setActiveTab,
        products,
        categories,
        filters,
        deliveryZones,
        orders,
        settings,
        sectionsConfig,
        addProduct,
        updateProduct,
        deleteProduct,
        updateVariantStock,
        addCategory,
        updateCategory,
        deleteCategory,
        archiveCategory,
        reorderCategories,
        addFilter,
        updateFilter,
        deleteFilter,
        archiveFilter,
        updateSectionsConfig,
        updateOrderStatus,
        addCashierNote,
        deleteOrder,
        addDeliveryZone,
        updateDeliveryZone,
        deleteDeliveryZone,
        updateSettings,
        resetToDefaultData,
        formatFCFA,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin doit être utilisé à l’intérieur de AdminProvider');
  }
  return context;
};

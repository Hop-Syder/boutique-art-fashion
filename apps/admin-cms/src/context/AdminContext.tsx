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
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  updateVariantStock: (productId: string, variantId: string, newStock: number) => void;

  // Category Operations
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  archiveCategory: (categoryId: string) => void;
  reorderCategories: (newOrderedCategories: Category[]) => void;

  // Filter Operations
  addFilter: (filter: FilterGroup) => void;
  updateFilter: (filter: FilterGroup) => void;
  deleteFilter: (filterId: string) => void;
  archiveFilter: (filterId: string) => void;

  // CMS Section & Image Operations
  updateSectionsConfig: (newConfig: SectionsConfig) => void;

  // Order Operations
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  addCashierNote: (orderId: string, note: string) => void;
  deleteOrder: (orderId: string) => void;

  // Delivery Zone Operations
  addDeliveryZone: (zone: DeliveryZone) => void;
  updateDeliveryZone: (zone: DeliveryZone) => void;
  deleteDeliveryZone: (zoneId: string) => void;

  // Store Settings
  updateSettings: (newSettings: StoreSettings) => void;

  // System
  resetToDefaultData: () => void;
  formatFCFA: (amount: number) => string;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('products');

  const [products, setProducts] = useState<Product[]>(() => storageService.getProducts());
  const [categories, setCategories] = useState<Category[]>(() => storageService.getCategories());
  const [filters, setFilters] = useState<FilterGroup[]>(() => storageService.getFilters());
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(() =>
    getStorageItem('ayele_delivery_zones', INITIAL_DELIVERY_ZONES)
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    getStorageItem('ayele_orders', INITIAL_ORDERS)
  );
  const [settings, setSettings] = useState<StoreSettings>(() => storageService.getSettings());
  const [sectionsConfig, setSectionsConfig] = useState<SectionsConfig>(() =>
    getStorageItem('ayele_sections_config', INITIAL_SECTIONS_CONFIG)
  );

  // Pull the VPS-persisted snapshot once at startup (survives cache clears / new browsers),
  // then reflect it into local state — this context doesn't subscribe() to sync messages.
  useEffect(() => {
    storageService.hydrateFromServer().then(() => {
      setProducts(storageService.getProducts());
      setCategories(storageService.getCategories());
      setFilters(storageService.getFilters());
      setSettings(storageService.getSettings());
      setOrders(storageService.getOrders());
    });
  }, []);

  // Sync state changes to storageService
  useEffect(() => {
    storageService.saveProducts(products);
  }, [products]);

  useEffect(() => {
    storageService.saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    storageService.saveFilters(filters);
  }, [filters]);

  useEffect(() => {
    storageService.saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    storageService.saveOrders(orders);
  }, [orders]);

  useEffect(() => {
    setStorageItem('ayele_delivery_zones', deliveryZones);
  }, [deliveryZones]);

  useEffect(() => {
    setStorageItem('ayele_sections_config', sectionsConfig);
  }, [sectionsConfig]);

  // Product CRUD
  const addProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const updateVariantStock = (productId: string, variantId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedVariants = p.variants.map((v) =>
            v.id === variantId ? { ...v, stock: Math.max(0, newStock) } : v
          );
          return { ...p, variants: updatedVariants };
        }
        return p;
      })
    );
  };

  // Category CRUD
  const addCategory = (newCategory: Category) => {
    setCategories((prev) => [...prev, newCategory]);
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === updatedCategory.id ? updatedCategory : c))
    );
  };

  const archiveCategory = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, is_archived: true, is_active: false } : c))
    );
  };

  const deleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
  };

  const reorderCategories = (newOrderedCategories: Category[]) => {
    setCategories(newOrderedCategories);
  };

  // Filter Group CRUD
  const addFilter = (newFilter: FilterGroup) => {
    setFilters((prev) => [...prev, newFilter]);
  };

  const updateFilter = (updatedFilter: FilterGroup) => {
    setFilters((prev) =>
      prev.map((f) => (f.id === updatedFilter.id ? updatedFilter : f))
    );
  };

  const archiveFilter = (filterId: string) => {
    setFilters((prev) =>
      prev.map((f) => (f.id === filterId ? { ...f, is_archived: true, is_active: false } : f))
    );
  };

  const deleteFilter = (filterId: string) => {
    setFilters((prev) => prev.filter((f) => f.id !== filterId));
  };

  // CMS Section & Image Updates
  const updateSectionsConfig = (newConfig: SectionsConfig) => {
    setSectionsConfig(newConfig);
  };

  // Order Management
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
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
      })
    );
  };

  const addCashierNote = (orderId: string, note: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, cashier_notes: note } : ord))
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  // Delivery Zone CRUD
  const addDeliveryZone = (zone: DeliveryZone) => {
    setDeliveryZones((prev) => [...prev, zone]);
  };

  const updateDeliveryZone = (updatedZone: DeliveryZone) => {
    setDeliveryZones((prev) =>
      prev.map((z) => (z.id === updatedZone.id ? updatedZone : z))
    );
  };

  const deleteDeliveryZone = (zoneId: string) => {
    setDeliveryZones((prev) => prev.filter((z) => z.id !== zoneId));
  };

  // Settings
  const updateSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
  };

  // Reset System
  const resetToDefaultData = () => {
    if (window.confirm('Voulez-vous vraiment réinitialiser toutes les données aux valeurs par défaut ?')) {
      setProducts(INITIAL_PRODUCTS);
      setDeliveryZones(INITIAL_DELIVERY_ZONES);
      setOrders(INITIAL_ORDERS);
      setSettings(INITIAL_STORE_SETTINGS);
      setSectionsConfig(INITIAL_SECTIONS_CONFIG);
      localStorage.clear();
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

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CartItem,
  Category,
  DeliveryZone,
  FilterGroup,
  Language,
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
  TRANSLATIONS_EN,
  TRANSLATIONS_FR,
  formatFCFA,
  generateOrderNumber,
  generateWhatsAppMessage,
  getStorageItem,
  setStorageItem,
  storageService,
} from '@ayele/shared';

export type AppView = 'home' | 'catalog' | 'tracking' | 'about';

interface FilterState {
  category: string;
  gender: string;
  size: string;
  color: string;
  minPrice: number;
  maxPrice: number;
  searchQuery: string;
  onlyNew: boolean;
  onlyPromo: boolean;
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'name';
}

interface StoreContextType {
  // Navigation & UI state
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;
  trackingOrderId: string;
  setTrackingOrderId: (id: string) => void;

  // Language & i18n
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;

  // Data State
  products: Product[];
  categories: Category[];
  filtersConfig: FilterGroup[];
  deliveryZones: DeliveryZone[];
  orders: Order[];
  settings: StoreSettings;
  sectionsConfig: SectionsConfig;
  cart: CartItem[];
  selectedZone: DeliveryZone;
  setSelectedZone: (zone: DeliveryZone) => void;

  // Filters
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;

  // Cart operations
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTotal: number;
  cartItemCount: number;

  // Order Operations
  createOrder: (orderData: {
    customer_name: string;
    customer_phone: string;
    customer_whatsapp: string;
    delivery_city: string;
    delivery_zone: string;
    delivery_address: string;
    delivery_landmark?: string;
    delivery_notes?: string;
  }) => { order: Order; whatsappUrl: string; message: string };
  findOrder: (query: string) => Order | undefined;

  // Formatters
  formatFCFA: (amount: number) => string;
}

const initialFilterState: FilterState = {
  category: 'all',
  gender: 'all',
  size: 'all',
  color: 'all',
  minPrice: 0,
  maxPrice: 300000,
  searchQuery: '',
  onlyNew: false,
  onlyPromo: false,
  inStockOnly: false,
  sortBy: 'featured',
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Modals
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState('');

  // Language & i18n
  const [language, setLanguageState] = useState<Language>(() =>
    getStorageItem('artfashion_lang', 'fr')
  );

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setStorageItem('artfashion_lang', lang);
  };

  const t = (key: string): string => {
    const dict = language === 'en' ? TRANSLATIONS_EN : TRANSLATIONS_FR;
    return dict[key] || TRANSLATIONS_FR[key] || key;
  };

  // Persisted Storage Data
  const [products, setProducts] = useState<Product[]>(() => storageService.getProducts());
  const [categories, setCategories] = useState<Category[]>(() => storageService.getCategories());
  const [filtersConfig, setFiltersConfig] = useState<FilterGroup[]>(() => storageService.getFilters());
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(() => storageService.getDeliveryZones());
  const [orders, setOrders] = useState<Order[]>(() =>
    getStorageItem('ayele_orders', INITIAL_ORDERS)
  );
  const [settings, setSettings] = useState<StoreSettings>(() => storageService.getSettings());
  const [sectionsConfig, setSectionsConfig] = useState<SectionsConfig>(() => storageService.getSectionsConfig());
  const [cart, setCart] = useState<CartItem[]>(() =>
    getStorageItem('ayele_cart', [])
  );
  const [selectedZone, setSelectedZone] = useState<DeliveryZone>(
    () => deliveryZones[0] || INITIAL_DELIVERY_ZONES[0]
  );
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  // Pull the VPS-persisted snapshot once at startup (survives cache clears / new browsers).
  // Resulting broadcasts are picked up by the subscribe() listener below.
  useEffect(() => {
    storageService.hydrateFromServer();
  }, []);

  // Real-time synchronization listener across tabs & CMS updates
  useEffect(() => {
    const unsubscribe = storageService.subscribe((msg) => {
      setProducts(storageService.getProducts());
      setCategories(storageService.getCategories());
      setFiltersConfig(storageService.getFilters());
      setSettings(storageService.getSettings());
      setSectionsConfig(storageService.getSectionsConfig());
      setDeliveryZones(storageService.getDeliveryZones());
      if (msg.type === 'ORDERS_UPDATED' || msg.type === 'FULL_RESET') {
        const freshOrders = storageService.getOrders();
        if (freshOrders && freshOrders.length > 0) {
          setOrders(freshOrders);
        }
      }
    });

    // Écoute les changements de localStorage depuis d'autres onglets (même origine)
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === 'ayele_orders' && e.newValue) {
        try {
          const freshOrders = JSON.parse(e.newValue);
          if (Array.isArray(freshOrders) && freshOrders.length > 0) {
            setOrders(freshOrders);
          }
        } catch {
          // ignore JSON parse errors
        }
      }
    };
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  // Sync cart & orders state to LocalStorage
  useEffect(() => {
    setStorageItem('ayele_cart', cart);
  }, [cart]);

  useEffect(() => {
    setStorageItem('ayele_orders', orders);
  }, [orders]);

  // Cart operations
  const addToCart = (product: Product, variant: ProductVariant, quantity: number = 1) => {
    setCart((prevCart) => {
      const cartItemId = `${product.id}-${variant.id}`;
      const existingItemIndex = prevCart.findIndex((item) => item.id === cartItemId);

      if (existingItemIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingItemIndex].quantity + quantity;
        updated[existingItemIndex] = {
          ...updated[existingItemIndex],
          quantity: Math.min(newQty, variant.stock),
        };
        return updated;
      }

      return [
        ...prevCart,
        {
          id: cartItemId,
          product,
          variant,
          quantity: Math.min(quantity, variant.stock),
        },
      ];
    });

    setIsCartOpen(true);
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === cartItemId) {
          return {
            ...item,
            quantity: Math.min(quantity, item.variant.stock),
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((total, item) => {
    const unitPrice = item.variant.price_override ?? item.product.price;
    return total + unitPrice * item.quantity;
  }, 0);

  const cartTotal = cartSubtotal + (selectedZone ? selectedZone.fee : 0);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const resetFilters = () => {
    setFilters(initialFilterState);
  };

  // Order Operations
  const createOrder = (orderData: {
    customer_name: string;
    customer_phone: string;
    customer_whatsapp: string;
    delivery_city: string;
    delivery_zone: string;
    delivery_address: string;
    delivery_landmark?: string;
    delivery_notes?: string;
  }) => {
    const orderNumber = generateOrderNumber();
    const now = new Date().toISOString();

    const orderItems = cart.map((item) => ({
      product_id: item.product.id,
      product_name: item.product.name,
      variant_id: item.variant.id,
      size: item.variant.size,
      color: item.variant.color,
      quantity: item.quantity,
      unit_price: item.variant.price_override ?? item.product.price,
      total_price: (item.variant.price_override ?? item.product.price) * item.quantity,
      image: item.product.images[0] || '',
    }));

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      customer_name: orderData.customer_name,
      customer_phone: orderData.customer_phone,
      customer_whatsapp: orderData.customer_whatsapp,
      delivery_city: orderData.delivery_city,
      delivery_zone: orderData.delivery_zone,
      delivery_address: orderData.delivery_address,
      delivery_landmark: orderData.delivery_landmark,
      delivery_notes: orderData.delivery_notes,
      items: orderItems,
      subtotal: cartSubtotal,
      delivery_fee: selectedZone.fee,
      total: cartTotal,
      status: 'NOUVELLE',
      payment_status: 'En attente',
      tracking_history: [
        {
          status: 'NOUVELLE',
          timestamp: now,
          note: 'Commande initiée sur le site ART FASHION Cotonou',
        },
      ],
      created_at: now,
      updated_at: now,
    };

    setOrders((prev) => [newOrder, ...prev]);

    const { url: whatsappUrl, message } = generateWhatsAppMessage(newOrder, settings);

    clearCart();

    return { order: newOrder, whatsappUrl, message };
  };

  const findOrder = (query: string): Order | undefined => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return undefined;

    const freshOrders = storageService.getOrders();
    const activeOrdersList = freshOrders && freshOrders.length > 0 ? freshOrders : orders;

    return activeOrdersList.find(
      (o: Order) =>
        o.order_number.toLowerCase() === cleanQuery ||
        o.customer_phone.replace(/[^0-9]/g, '').includes(cleanQuery.replace(/[^0-9]/g, '')) ||
        o.customer_name.toLowerCase().includes(cleanQuery)
    );
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProduct,
        setSelectedProduct,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isTrackingOpen,
        setIsTrackingOpen,
        trackingOrderId,
        setTrackingOrderId,
        language,
        setLanguage,
        t,
        products,
        categories,
        filtersConfig,
        deliveryZones,
        orders,
        settings,
        sectionsConfig,
        cart,
        selectedZone,
        setSelectedZone,
        filters,
        setFilters,
        resetFilters,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartTotal,
        cartItemCount,
        createOrder,
        findOrder,
        formatFCFA,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore doit être utilisé à l’intérieur de StoreProvider');
  }
  return context;
};

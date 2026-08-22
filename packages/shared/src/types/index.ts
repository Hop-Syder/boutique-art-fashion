export type OrderStatus =
  | 'NOUVELLE'
  | 'CONTACTÉE'
  | 'CONFIRMÉE'
  | 'EN_PRÉPARATION'
  | 'EN_LIVRAISON'
  | 'LIVRÉE'
  | 'ANNULÉE';

export type Language = 'fr' | 'en';

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string; // S, M, L, XL, XXL ou 38, 39, 40, etc.
  color: string; // "Bleu Indigo", "Noir Ébène", "Bazin Chocolat"
  color_en?: string;
  color_hex?: string;
  sku: string;
  stock: number;
  price_override?: number;
}

export interface FilterOption {
  id: string;
  label: string;
  label_en?: string;
  value: string;
  color_hex?: string;
}

export interface FilterGroup {
  id: string; // ex: 'taille', 'couleur', 'coupe', 'matiere', 'marque', 'pointure', 'prix'
  name: string;
  name_en?: string;
  type: 'checkbox' | 'select' | 'color' | 'range';
  is_active: boolean;
  is_archived?: boolean;
  options: FilterOption[];
}

export interface Product {
  id: string;
  name: string;
  name_en?: string;
  slug: string;
  description: string;
  description_en?: string;
  long_description?: string;
  long_description_en?: string;
  price: number; // en FCFA
  compare_price?: number; // ancien prix si promo
  category_id: string;
  subcategory?: string;
  gender: 'Femme' | 'Homme' | 'Enfant' | 'Unisexe';
  status: 'active' | 'draft' | 'archived';
  images: string[];
  tags: string[];
  attributes?: Record<string, string | string[]>; // Map dynamique filter_id -> string/array de valeurs
  is_new?: boolean;
  is_featured?: boolean;
  is_promo?: boolean;
  sku: string;
  variants: ProductVariant[];
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  name_en?: string;
  slug: string;
  image: string;
  description: string;
  description_en?: string;
  parent_id?: string | null; // Support pour arborescence de sous-catégories
  order?: number; // Ordre d'affichage
  is_active?: boolean;
  is_archived?: boolean;
  allowed_filter_ids?: string[]; // IDs des filtres associés (ex: ['taille', 'couleur', 'coupe', 'matiere', 'prix'])
  item_count?: number;
}

export interface CartItem {
  id: string; // combinaison product_id + variant_id
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  name_en?: string;
  fee: number; // en FCFA
  description: string;
  description_en?: string;
  estimated_time: string;
  estimated_time_en?: string;
}

export interface TrackingEvent {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  variant_id: string;
  size: string;
  color: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  image: string;
}

export interface Order {
  id: string;
  order_number: string; // ex: "AF-84920"
  customer_name: string;
  customer_phone: string;
  customer_whatsapp: string;
  delivery_city: string; // ex: "Cotonou", "Abomey-Calavi"
  delivery_zone: string; // ex: "Cotonou Zongo / Scoa Gbéto"
  delivery_address: string; // Quartier + point de repère
  delivery_landmark?: string;
  delivery_notes?: string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  payment_status?: 'En attente' | 'Payé à la livraison' | 'Mobile Money reçu';
  cashier_notes?: string;
  tracking_history: TrackingEvent[];
  created_at: string;
  updated_at: string;
}

export interface StoreSettings {
  store_name: string;
  tagline: string;
  tagline_en: string;
  whatsapp_number: string; // Format Bénin ex: +229 97 00 00 00
  phone_number: string;
  email: string;
  address: string;
  address_en: string;
  neighborhood: string; // Zongo / Scoa Gbéto
  landmark: string; // Rue 403, près Avenue Jean-Paul II & Galerie Fayola
  landmark_en: string;
  city: string;
  country: string;
  currency: string;
  opening_hours: string;
  opening_hours_en: string;
  facebook_url: string;
  instagram_handle: string;
  tiktok_handle: string;
}

export interface SectionMedia {
  id: string;
  title: string;
  title_en?: string;
  subtitle?: string;
  subtitle_en?: string;
  image_url: string;
  button_text?: string;
  button_text_en?: string;
  button_link?: string;
  badge?: string;
  badge_en?: string;
}

export interface SectionsConfig {
  hero: {
    badge?: string;
    badge_en?: string;
    title: string;
    title_en: string;
    description: string;
    description_en: string;
    primary_image: string;
    secondary_image: string;
    cta_primary_text: string;
    cta_primary_text_en: string;
    cta_secondary_text: string;
    cta_secondary_text_en: string;
  };
  about: {
    hero_title: string;
    hero_title_en: string;
    hero_subtitle: string;
    hero_subtitle_en: string;
    hero_image: string;
    craftsmanship_title: string;
    craftsmanship_title_en: string;
    craftsmanship_text: string;
    craftsmanship_text_en: string;
    craftsmanship_image: string;
    values_banner_image: string;
  };
  promos: SectionMedia[];
}

export interface TranslationDictionary {
  [key: string]: string;
}

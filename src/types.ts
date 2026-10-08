export interface Product {
  id: string;
  title: string;
  slug: string;
  sku: string;
  price: number; // in FCFA
  compareAtPrice?: number; // Old price before promo
  discountPercentage?: number;
  category: string;
  brand: string;
  images: string[];
  description: string;
  features: string[];
  specs: Record<string, string>;
  inStock: boolean;
  stockCount: number;
  isFeatured?: boolean;
  isFlashSale?: boolean;
  flashSaleEnds?: string; // ISO string
  rating: number;
  reviewCount: number;
  tags: string[];
  warranty?: string;
  createdAt: string;
  shopifyHandle?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  description: string;
  itemCount: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
}

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verifiedBuyer: boolean;
  city?: string;
  helpfulCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export type PaymentMethod = 'wave' | 'orange_money' | 'om' | 'cod';
export type PaymentStatus = 'pending' | 'verified' | 'paid' | 'failed';
export type OrderStatus = 'en_attente' | 'confirmee' | 'en_livraison' | 'livree' | 'annulee';

export interface OrderCustomer {
  fullName: string;
  phone: string;
  email?: string;
  region: string;
  city: string;
  district: string; // Quartier
  address: string;
  deliveryNotes?: string;
}

export interface TrackingEvent {
  date: string;
  status: string;
  description: string;
  location?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. TME-2026-8942
  date: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber: string;
  trackingEvents: TrackingEvent[];
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  fixedDiscount?: number;
  minAmount?: number;
  expiresAt?: string;
  isActive: boolean;
  description: string;
}

export interface SenegalZone {
  id: string;
  name: string;
  fee: number;
  deliveryTime: string;
  districts: string[];
}

export interface StoreSettings {
  name: string;
  slogan: string;
  phone: string;
  contactPhone?: string;
  whatsappNumber: string; // e.g. 221775363437
  email: string;
  address: string;
  mapsLandmark?: string;
  mapsCoordinates?: string;
  mapsOpeningHours?: string;
  announcementText: string;
  freeShippingMinAmount: number;
  promoBannerActive?: boolean;
  promoBannerTitle?: string;
  promoBannerSubtitle?: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    tiktok: string;
    whatsapp: string;
  };
}

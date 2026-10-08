import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Product,
  Category,
  Article,
  CustomPage,
  Review,
  CartItem,
  Order,
  Coupon,
  SenegalZone,
  StoreSettings,
  PaymentMethod
} from '../types';
import {
  initialProducts,
  initialCategories,
  initialArticles,
  initialPages,
  initialReviews,
  initialCoupons,
  initialSenegalZones,
  initialStoreSettings,
  initialOrders
} from '../data/initialData';
import {
  db,
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
  writeBatch,
  sanitizeForFirestore,
  deleteField
} from '../firebase';

export type ActiveView =
  | 'home'
  | 'shop'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'order-tracking'
  | 'account'
  | 'delivery'
  | 'articles'
  | 'article-detail'
  | 'page-detail'
  | 'admin'
  | 'contact';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface StoreContextType {
  // Store Data
  settings: StoreSettings;
  updateSettings: (newSettings: StoreSettings) => void;
  products: Product[];
  categories: Category[];
  articles: Article[];
  pages: CustomPage[];
  reviews: Review[];
  coupons: Coupon[];
  deliveryZones: SenegalZone[];

  // Database Connection Status
  isCloudConnected: boolean;
  cloudSyncStatus: 'connected' | 'syncing' | 'offline';
  lastCloudSync: Date | null;
  isSyncingNow: boolean;
  forceSyncAllToFirestore: () => Promise<boolean>;

  // Navigation / View State
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedCategorySlug: string | null;
  setSelectedCategorySlug: (slug: string | null) => void;
  selectedArticleId: string | null;
  setSelectedArticleId: (id: string | null) => void;
  selectedPageSlug: string | null;
  setSelectedPageSlug: (slug: string | null) => void;
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchFilterCategory: string;
  setSearchFilterCategory: (cat: string) => void;

  // Cart State
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedVariant?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Coupons
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  discountAmount: number;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'trackingNumber' | 'trackingEvents'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => void;
  updatePaymentStatus: (orderId: string, status: Order['paymentStatus']) => void;
  deleteOrder: (orderId: string) => Promise<void>;
  deleteAllOrders: () => Promise<void>;
  restoreInitialOrders: () => void;
  findOrderByReferenceOrPhone: (query: string) => Order | undefined;

  // Reviews
  addReview: (review: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => void;
  getProductReviews: (productId: string) => Review[];

  // Admin Catalog CRUD Operations
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  addArticle: (article: Omit<Article, 'id' | 'date'>) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  deleteArticle: (id: string) => void;

  addPage: (page: Omit<CustomPage, 'id' | 'updatedAt'>) => void;
  updatePage: (id: string, page: Partial<CustomPage>) => void;
  deletePage: (id: string) => void;
  restoreInitialPages: () => Promise<void>;

  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (code: string, coupon: Partial<Coupon>) => void;
  toggleCouponStatus: (code: string) => void;
  deleteCoupon: (code: string) => void;
  applyBulkDiscount: (categorySlug: string | 'all', percent: number) => void;
  removeBulkDiscount: (categorySlug: string | 'all') => void;
  toggleProductFlashSale: (productId: string) => void;

  // Marketing & Notifications
  isWelcomeModalOpen: boolean;
  setIsWelcomeModalOpen: (open: boolean) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  formatFCFA: (amount: number) => string;

  // Admin Authentication & Security
  isAdminAuthenticated: boolean;
  loginAdmin: (username: string, pass: string) => boolean;
  logoutAdmin: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Quick Buy (Opens direct 1-step checkout with product)
  quickBuyProduct: (product: Product) => void;
  quickWhatsAppOrder: (product: Product) => void;

  // Reset to initial
  resetToDefaultData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // LocalStorage initialization helper (used as instant cache & fallback)
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`tme_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  // State Declarations
  const [settings, setSettings] = useState<StoreSettings>(() => {
    const stored = loadStored('settings', initialStoreSettings);
    if (stored.whatsappNumber === '221778901234' || !stored.whatsappNumber) {
      return {
        ...stored,
        whatsappNumber: '221775363437',
        phone: '+221 77 536 34 37',
        contactPhone: '77 536 34 37',
        waveMerchantNumber: '77 536 34 37',
        omMerchantNumber: '77 536 34 37',
        socialLinks: {
          ...stored.socialLinks,
          whatsapp: 'https://wa.me/221775363437'
        }
      };
    }
    return stored;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const stored = loadStored<Product[]>('products', initialProducts);
    if (stored && Array.isArray(stored)) {
      const existingIds = new Set(stored.map((p) => p.id));
      const missing = initialProducts.filter((p) => !existingIds.has(p.id));
      if (missing.length > 0) {
        const merged = [...stored, ...missing];
        localStorage.setItem('tme_products', JSON.stringify(merged));
        return merged;
      }
    }
    return stored;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const stored = loadStored<Category[]>('categories', initialCategories);
    if (stored && Array.isArray(stored)) {
      const existingIds = new Set(stored.map((c) => c.id));
      const missing = initialCategories.filter((c) => !existingIds.has(c.id));
      if (missing.length > 0) {
        const merged = [...stored, ...missing];
        localStorage.setItem('tme_categories', JSON.stringify(merged));
        return merged;
      }
    }
    return stored;
  });
  const [articles, setArticles] = useState<Article[]>(() => loadStored('articles', initialArticles));
  const [pages, setPages] = useState<CustomPage[]>(() => loadStored('pages', initialPages));
  const [reviews, setReviews] = useState<Review[]>(() => loadStored('reviews', initialReviews));
  const [coupons, setCoupons] = useState<Coupon[]>(() => loadStored('coupons', initialCoupons));
  const [deliveryZones] = useState<SenegalZone[]>(initialSenegalZones);

  // Cart & Orders
  const [cart, setCart] = useState<CartItem[]>(() => loadStored('cart', []));
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => loadStored('coupon', null));
  const [orders, setOrders] = useState<Order[]>(() => {
    const stored = loadStored<Order[]>('orders', []);
    return Array.isArray(stored) ? stored : [];
  });
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);

  // Cloud Database Sync Status
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(true);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'connected' | 'syncing' | 'offline'>('connected');
  const [lastCloudSync, setLastCloudSync] = useState<Date | null>(new Date());
  const [isSyncingNow, setIsSyncingNow] = useState<boolean>(false);
  const isInitialLoadDone = useRef(false);

  // Active View & Navigation
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedPageSlug, setSelectedPageSlug] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchFilterCategory, setSearchFilterCategory] = useState<string>('all');

  // Marketing & Toasts
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('tme_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const formatFCFA = (amount: number): string => {
    return new Intl.NumberFormat('fr-SN', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0
    })
      .format(amount)
      .replace('XOF', 'FCFA');
  };

  // ============================================================================
  // FIRESTORE CLOUD REAL-TIME SYNCHRONIZATION (SINGLE SOURCE OF TRUTH)
  // ============================================================================
  useEffect(() => {
    setCloudSyncStatus('syncing');

    // 1. Listen to Centralized ORDERS in real-time
    const unsubscribeOrders = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        const cloudOrders: Order[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Order;
          cloudOrders.push({ ...data, id: docSnap.id });
        });

        cloudOrders.sort((a, b) => {
          const timeA = new Date(a.date).getTime() || 0;
          const timeB = new Date(b.date).getTime() || 0;
          return timeB - timeA;
        });

        setOrders(cloudOrders);
        localStorage.setItem('tme_orders', JSON.stringify(cloudOrders));
        setIsCloudConnected(true);
        setCloudSyncStatus('connected');
        setLastCloudSync(new Date());
      },
      (error) => {
        console.warn('Firestore Orders sync fallback to local cache:', error);
        setIsCloudConnected(false);
        setCloudSyncStatus('offline');
      }
    );

    // 2. Listen to PRODUCTS in real-time
    const unsubscribeProducts = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudProducts: Product[] = [];
          snapshot.forEach((docSnap) => {
            cloudProducts.push({ ...(docSnap.data() as Product), id: docSnap.id });
          });
          // Sort stably so newly added articles appear first across all devices
          cloudProducts.sort((a, b) => {
            const timeA = new Date(a.createdAt || 0).getTime() || 0;
            const timeB = new Date(b.createdAt || 0).getTime() || 0;
            if (timeB !== timeA) return timeB - timeA;
            return a.title.localeCompare(b.title);
          });
          setProducts(cloudProducts);
          localStorage.setItem('tme_products', JSON.stringify(cloudProducts));
        } else if (!isInitialLoadDone.current) {
          // Seed cloud database if empty on first boot
          seedInitialFirestoreData();
        }
        setIsCloudConnected(true);
        setCloudSyncStatus('connected');
        setLastCloudSync(new Date());
      },
      (error) => {
        console.warn('Firestore Products sync error:', error);
      }
    );

    // 3. Listen to COUPONS in real-time
    const unsubscribeCoupons = onSnapshot(
      collection(db, 'coupons'),
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudCoupons: Coupon[] = [];
          snapshot.forEach((docSnap) => {
            cloudCoupons.push({ ...(docSnap.data() as Coupon), code: docSnap.id });
          });
          setCoupons(cloudCoupons);
          localStorage.setItem('tme_coupons', JSON.stringify(cloudCoupons));
        }
      },
      (error) => console.warn('Firestore Coupons sync error:', error)
    );

    // 4. Listen to SETTINGS in real-time
    const unsubscribeSettings = onSnapshot(
      doc(db, 'settings', 'store_config'),
      (docSnap) => {
        if (docSnap.exists()) {
          const cloudSettings = docSnap.data() as StoreSettings;
          setSettings(cloudSettings);
          localStorage.setItem('tme_settings', JSON.stringify(cloudSettings));
        }
      },
      (error) => console.warn('Firestore Settings sync error:', error)
    );

    // 5. Listen to CATEGORIES in real-time
    const unsubscribeCategories = onSnapshot(
      collection(db, 'categories'),
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudCategories: Category[] = [];
          snapshot.forEach((docSnap) => {
            cloudCategories.push({ ...(docSnap.data() as Category), id: docSnap.id });
          });
          setCategories(cloudCategories);
          localStorage.setItem('tme_categories', JSON.stringify(cloudCategories));
        }
      },
      (error) => console.warn('Firestore Categories sync error:', error)
    );

    // 6. Listen to REVIEWS in real-time
    const unsubscribeReviews = onSnapshot(
      collection(db, 'reviews'),
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudReviews: Review[] = [];
          snapshot.forEach((docSnap) => {
            cloudReviews.push({ ...(docSnap.data() as Review), id: docSnap.id });
          });
          setReviews(cloudReviews);
          localStorage.setItem('tme_reviews', JSON.stringify(cloudReviews));
        }
      },
      (error) => console.warn('Firestore Reviews sync error:', error)
    );

    // 7. Listen to ARTICLES in real-time
    const unsubscribeArticles = onSnapshot(
      collection(db, 'articles'),
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudArticles: Article[] = [];
          snapshot.forEach((docSnap) => {
            cloudArticles.push({ ...(docSnap.data() as Article), id: docSnap.id });
          });
          setArticles(cloudArticles);
          localStorage.setItem('tme_articles', JSON.stringify(cloudArticles));
        }
      },
      (error) => console.warn('Firestore Articles sync error:', error)
    );

    // 8. Listen to PAGES in real-time
    const unsubscribePages = onSnapshot(
      collection(db, 'pages'),
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudPages: CustomPage[] = [];
          snapshot.forEach((docSnap) => {
            cloudPages.push({ ...(docSnap.data() as CustomPage), id: docSnap.id });
          });
          setPages(cloudPages);
          localStorage.setItem('tme_pages', JSON.stringify(cloudPages));
        }
      },
      (error) => console.warn('Firestore Pages sync error:', error)
    );

    isInitialLoadDone.current = true;

    return () => {
      unsubscribeOrders();
      unsubscribeProducts();
      unsubscribeCoupons();
      unsubscribeSettings();
      unsubscribeCategories();
      unsubscribeReviews();
      unsubscribeArticles();
      unsubscribePages();
    };
  }, []);

  // Helper to Seed Firestore in chunked batches
  const seedInitialFirestoreData = async () => {
    try {
      // Chunk helper for Firestore (safe batch size <= 400)
      const chunkSize = 350;
      
      // Seed settings
      await setDoc(doc(db, 'settings', 'store_config'), sanitizeForFirestore(initialStoreSettings), { merge: true });

      // Seed categories
      for (let i = 0; i < initialCategories.length; i += chunkSize) {
        const batch = writeBatch(db);
        const chunk = initialCategories.slice(i, i + chunkSize);
        chunk.forEach((cat) => {
          batch.set(doc(db, 'categories', cat.id), sanitizeForFirestore(cat), { merge: true });
        });
        await batch.commit();
      }

      // Seed coupons
      for (let i = 0; i < initialCoupons.length; i += chunkSize) {
        const batch = writeBatch(db);
        const chunk = initialCoupons.slice(i, i + chunkSize);
        chunk.forEach((cp) => {
          batch.set(doc(db, 'coupons', cp.code), sanitizeForFirestore(cp), { merge: true });
        });
        await batch.commit();
      }

      // Seed products in chunked batches
      for (let i = 0; i < initialProducts.length; i += chunkSize) {
        const batch = writeBatch(db);
        const chunk = initialProducts.slice(i, i + chunkSize);
        chunk.forEach((p) => {
          batch.set(doc(db, 'products', p.id), sanitizeForFirestore(p), { merge: true });
        });
        await batch.commit();
      }

      // Seed initial reviews
      for (let i = 0; i < initialReviews.length; i += chunkSize) {
        const batch = writeBatch(db);
        const chunk = initialReviews.slice(i, i + chunkSize);
        chunk.forEach((r) => {
          batch.set(doc(db, 'reviews', r.id), sanitizeForFirestore(r), { merge: true });
        });
        await batch.commit();
      }

      // Seed initial articles
      for (let i = 0; i < initialArticles.length; i += chunkSize) {
        const batch = writeBatch(db);
        const chunk = initialArticles.slice(i, i + chunkSize);
        chunk.forEach((a) => {
          batch.set(doc(db, 'articles', a.id), sanitizeForFirestore(a), { merge: true });
        });
        await batch.commit();
      }

      // Seed initial pages
      for (let i = 0; i < initialPages.length; i += chunkSize) {
        const batch = writeBatch(db);
        const chunk = initialPages.slice(i, i + chunkSize);
        chunk.forEach((pg) => {
          batch.set(doc(db, 'pages', pg.id), sanitizeForFirestore(pg), { merge: true });
        });
        await batch.commit();
      }

      console.log('Centralized Firestore fully initialized.');
    } catch (e) {
      console.warn('Initial Firestore seed error:', e);
    }
  };

  // Full manual force sync to push current state into Firestore
  const forceSyncAllToFirestore = async (): Promise<boolean> => {
    setIsSyncingNow(true);
    setCloudSyncStatus('syncing');
    try {
      const chunkSize = 350;

      // 1. Settings
      await setDoc(doc(db, 'settings', 'store_config'), sanitizeForFirestore(settings), { merge: true });

      // 2. Categories
      for (let i = 0; i < categories.length; i += chunkSize) {
        const batch = writeBatch(db);
        categories.slice(i, i + chunkSize).forEach((cat) => {
          batch.set(doc(db, 'categories', cat.id), sanitizeForFirestore(cat), { merge: true });
        });
        await batch.commit();
      }

      // 3. Products
      for (let i = 0; i < products.length; i += chunkSize) {
        const batch = writeBatch(db);
        products.slice(i, i + chunkSize).forEach((p) => {
          batch.set(doc(db, 'products', p.id), sanitizeForFirestore(p), { merge: true });
        });
        await batch.commit();
      }

      // 4. Coupons
      for (let i = 0; i < coupons.length; i += chunkSize) {
        const batch = writeBatch(db);
        coupons.slice(i, i + chunkSize).forEach((cp) => {
          batch.set(doc(db, 'coupons', cp.code), sanitizeForFirestore(cp), { merge: true });
        });
        await batch.commit();
      }

      // 5. Reviews
      for (let i = 0; i < reviews.length; i += chunkSize) {
        const batch = writeBatch(db);
        reviews.slice(i, i + chunkSize).forEach((r) => {
          batch.set(doc(db, 'reviews', r.id), sanitizeForFirestore(r), { merge: true });
        });
        await batch.commit();
      }

      // 6. Articles
      for (let i = 0; i < articles.length; i += chunkSize) {
        const batch = writeBatch(db);
        articles.slice(i, i + chunkSize).forEach((a) => {
          batch.set(doc(db, 'articles', a.id), sanitizeForFirestore(a), { merge: true });
        });
        await batch.commit();
      }

      // 7. Pages
      for (let i = 0; i < pages.length; i += chunkSize) {
        const batch = writeBatch(db);
        pages.slice(i, i + chunkSize).forEach((pg) => {
          batch.set(doc(db, 'pages', pg.id), sanitizeForFirestore(pg), { merge: true });
        });
        await batch.commit();
      }

      setIsCloudConnected(true);
      setCloudSyncStatus('connected');
      setLastCloudSync(new Date());
      addToast(
        `Synchronisation réussie ! ${products.length} produits, ${categories.length} catégories et ${orders.length} commandes synchronisés avec la base Cloud Firestore.`,
        'success'
      );
      return true;
    } catch (error) {
      console.error('Error during forced Firestore synchronization:', error);
      setCloudSyncStatus('offline');
      addToast('Erreur lors de la synchronisation avec Firestore. Vérifiez votre connexion.', 'error');
      return false;
    } finally {
      setIsSyncingNow(false);
    }
  };

  // Admin Auth
  const loginAdmin = (username: string, pass: string): boolean => {
    const cleanUsername = username.trim();
    const cleanPass = pass.trim();
    if (
      (cleanUsername === 'Toubamadiyana' || cleanUsername.toLowerCase() === 'toubamadiyana') &&
      cleanPass === 'Lahat2112'
    ) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem('tme_admin_auth', 'true');
      } catch (e) {
        console.error(e);
      }
      addToast('Authentification réussie. Base de données centralisée connectée en temps réel.', 'success');
      return true;
    } else {
      addToast('Identifiant ou mot de passe incorrect.', 'error');
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('tme_admin_auth');
    } catch (e) {
      console.error(e);
    }
    setActiveView('home');
    addToast('Session administrateur déconnectée.', 'info');
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, selectedVariant?: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.selectedVariant === selectedVariant
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedVariant === selectedVariant
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedVariant }];
    });
    addToast(`"${product.title}" ajouté au panier`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    addToast('Article retiré du panier', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    localStorage.removeItem('tme_cart');
    localStorage.removeItem('tme_coupon');
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  // Apply Coupon
  const applyCoupon = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    const foundCoupon = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!foundCoupon) {
      addToast('Code promo invalide ou expiré', 'error');
      return false;
    }

    if (foundCoupon.minAmount && cartSubtotal < foundCoupon.minAmount) {
      addToast(
        `Ce code nécessite un montant minimum de ${formatFCFA(foundCoupon.minAmount)}`,
        'warning'
      );
      return false;
    }

    setAppliedCoupon(foundCoupon);
    addToast(`Code promo "${foundCoupon.code}" appliqué avec succès !`, 'success');
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Code promo retiré', 'info');
  };

  const discountAmount = appliedCoupon
    ? appliedCoupon.discountPercent
      ? Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100)
      : appliedCoupon.fixedDiscount || 0
    : 0;

  // ============================================================================
  // ORDERS MANAGEMENT: CENTRALIZED DATABASE (PHONE 1, 2, 3 + PC -> 1 TABLE)
  // ============================================================================
  const createOrder = (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'trackingNumber' | 'trackingEvents'>
  ): Order => {
    const now = new Date();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `TME-${now.getFullYear()}-${randomSuffix}`;
    const trackingNumber = `SN-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      ...orderData,
      id: `ord_${Date.now()}_${randomSuffix}`,
      orderNumber,
      date: now.toISOString(),
      trackingNumber,
      trackingEvents: [
        {
          date: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          status: 'Commande enregistrée',
          description: 'Votre commande a été reçue et est en cours de traitement par notre équipe à Dakar.',
          location: 'Dakar Sandaga / Médina'
        }
      ]
    };

    // 1. Optimistic Local State
    setOrders((prev) => [newOrder, ...prev.filter((o) => o.id !== newOrder.id)]);
    setSelectedOrder(newOrder);
    clearCart();
    setActiveView('order-confirmation');

    // 2. Persist to Cloud Firestore (Single Central Database)
    // When saved, Firestore distributes this order to all connected phones/PCs in real time!
    setDoc(doc(db, 'orders', newOrder.id), newOrder)
      .then(() => {
        console.log(`Order ${newOrder.orderNumber} synchronized to Central Firestore.`);
      })
      .catch((err) => {
        console.error('Error saving order to Firestore:', err);
      });

    addToast(`Commande ${orderNumber} enregistrée dans la base centrale !`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['orderStatus']) => {
    const existingOrder = orders.find((o) => o.id === orderId);
    if (!existingOrder) return;

    const updatedEvents = [...existingOrder.trackingEvents];
    const timeStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    if (status === 'confirmee') {
      updatedEvents.push({
        date: timeStr,
        status: 'Commande confirmée',
        description: 'Votre commande a été validée par notre service client.',
        location: 'Dakar'
      });
    } else if (status === 'en_livraison') {
      updatedEvents.push({
        date: timeStr,
        status: 'En cours de livraison',
        description: 'Le coursier est en route vers votre adresse à Dakar / Région.',
        location: "En cours d'acheminement"
      });
    } else if (status === 'livree') {
      updatedEvents.push({
        date: timeStr,
        status: 'Livrée avec succès',
        description: 'Colis remis en main propre au client. Merci de votre confiance !',
        location: existingOrder.customer.district || existingOrder.customer.city
      });
    }

    const updatedOrder: Order = {
      ...existingOrder,
      orderStatus: status,
      trackingEvents: updatedEvents
    };

    // Optimistic Update
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));

    // Firestore Sync
    setDoc(doc(db, 'orders', orderId), updatedOrder, { merge: true }).catch((err) =>
      console.error('Error updating order status in Firestore:', err)
    );

    addToast(`Statut de la commande mis à jour (${status})`, 'info');
  };

  const updatePaymentStatus = (orderId: string, status: Order['paymentStatus']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, paymentStatus: status } : ord))
    );

    // Firestore Sync
    setDoc(doc(db, 'orders', orderId), { paymentStatus: status }, { merge: true }).catch((err) =>
      console.error('Error updating payment status in Firestore:', err)
    );

    addToast(`Statut de paiement mis à jour : ${status.toUpperCase()}`, 'info');
  };

  const deleteOrder = async (orderId: string) => {
    // Update local state immediately
    setOrders((prev) => {
      const updated = prev.filter((o) => o.id !== orderId);
      localStorage.setItem('tme_orders', JSON.stringify(updated));
      return updated;
    });

    try {
      await deleteDoc(doc(db, 'orders', orderId));
      addToast('Commande supprimée définitivement avec succès', 'info');
    } catch (err) {
      console.error('Error deleting order in Firestore:', err);
      addToast('Commande supprimée du cache', 'info');
    }
  };

  const deleteAllOrders = async () => {
    setOrders([]);
    localStorage.setItem('tme_orders', JSON.stringify([]));
    try {
      const snap = await getDocs(collection(db, 'orders'));
      const deletePromises: Promise<void>[] = [];
      snap.forEach((docSnap) => {
        deletePromises.push(deleteDoc(doc(db, 'orders', docSnap.id)).catch(() => {}));
      });
      await Promise.all(deletePromises);
      addToast('Toutes les commandes ont été supprimées définitivement', 'info');
    } catch (err) {
      console.error('Error deleting all orders in Firestore:', err);
      addToast('Commandes effacées localement', 'info');
    }
  };

  const restoreInitialOrders = async () => {
    setOrders(initialOrders);
    localStorage.setItem('tme_orders', JSON.stringify(initialOrders));
    try {
      const snap = await getDocs(collection(db, 'orders'));
      const initialIds = new Set(initialOrders.map((o) => o.id));
      const deletePromises: Promise<void>[] = [];
      snap.forEach((docSnap) => {
        if (!initialIds.has(docSnap.id)) {
          deletePromises.push(deleteDoc(doc(db, 'orders', docSnap.id)).catch(() => {}));
        }
      });
      await Promise.all(deletePromises);
      const setPromises = initialOrders.map((ord) =>
        setDoc(doc(db, 'orders', ord.id), ord).catch(() => {})
      );
      await Promise.all(setPromises);
      addToast('Toutes les commandes ont été réinitialisées avec succès !', 'success');
    } catch (err) {
      console.warn('Error resetting orders in Firestore:', err);
      initialOrders.forEach((ord) => {
        setDoc(doc(db, 'orders', ord.id), ord, { merge: true }).catch(() => {});
      });
      addToast('Commandes réinitialisées avec succès !', 'success');
    }
  };

  const findOrderByReferenceOrPhone = (queryStr: string): Order | undefined => {
    const clean = queryStr.trim().toLowerCase();
    return orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === clean ||
        o.trackingNumber.toLowerCase() === clean ||
        o.customer.phone.replace(/\s+/g, '').includes(clean.replace(/\s+/g, ''))
    );
  };

  // Reviews
  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => {
    const id = `rev-${Date.now()}`;
    const newRev: Review = {
      ...reviewData,
      id,
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      helpfulCount: 1
    };
    setReviews((prev) => [newRev, ...prev]);

    // Firestore Sync
    setDoc(doc(db, 'reviews', id), newRev).catch((err) => console.error(err));

    // Recalculate product rating
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === reviewData.productId) {
          const currentReviews = reviews.filter((r) => r.productId === p.id);
          const allRatings = [...currentReviews.map((r) => r.rating), reviewData.rating];
          const avg = allRatings.reduce((a, b) => a + b, 0) / allRatings.length;
          const updatedProduct = {
            ...p,
            rating: Number(avg.toFixed(1)),
            reviewCount: p.reviewCount + 1
          };
          // Sync product rating
          setDoc(doc(db, 'products', p.id), updatedProduct, { merge: true }).catch((err) => console.error(err));
          return updatedProduct;
        }
        return p;
      })
    );
    addToast('Merci ! Votre avis a été publié.', 'success');
  };

  const getProductReviews = (productId: string) => {
    return reviews.filter((r) => r.productId === productId);
  };

  // CRUD for Products
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const id = `prod-${Date.now()}`;
    const newProd: Product = {
      ...productData,
      id,
      createdAt: new Date().toISOString()
    };
    // Optimistic update
    setProducts((prev) => [newProd, ...prev.filter((p) => p.id !== id)]);
    
    // Cloud sync with sanitized payload
    const cleanPayload = sanitizeForFirestore(newProd);
    setDoc(doc(db, 'products', id), cleanPayload)
      .then(() => {
        setLastCloudSync(new Date());
        setIsCloudConnected(true);
      })
      .catch((err) => {
        console.error('Erreur Firestore addProduct:', err);
        addToast(`Erreur cloud : ${err?.message || 'Échec de synchronisation'}`, 'error');
      });
    addToast(`Article "${newProd.title}" ajouté et synchronisé en temps réel`, 'success');
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updatedFields };
          const cleanPayload = sanitizeForFirestore(updated);
          setDoc(doc(db, 'products', id), cleanPayload, { merge: true })
            .then(() => {
              setLastCloudSync(new Date());
              setIsCloudConnected(true);
            })
            .catch((err) => {
              console.error('Erreur Firestore updateProduct:', err);
              addToast(`Erreur synchronisation cloud : ${err?.message || 'Échec'}`, 'error');
            });
          return updated;
        }
        return p;
      })
    );
    addToast('Article mis à jour et synchronisé en direct', 'info');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    deleteDoc(doc(db, 'products', id))
      .then(() => {
        setLastCloudSync(new Date());
        setIsCloudConnected(true);
      })
      .catch((err) => {
        console.error('Erreur Firestore deleteProduct:', err);
        addToast(`Erreur suppression cloud : ${err?.message || 'Échec'}`, 'error');
      });
    addToast('Article supprimé de la base de données', 'info');
  };

  // CRUD for Categories
  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const id = categoryData.slug || `cat-${Date.now()}`;
    const newCat: Category = {
      ...categoryData,
      id
    };
    setCategories((prev) => [...prev, newCat]);
    const cleanCat = sanitizeForFirestore(newCat);
    setDoc(doc(db, 'categories', id), cleanCat)
      .then(() => {
        setLastCloudSync(new Date());
        setIsCloudConnected(true);
      })
      .catch((err) => console.error(err));
    addToast(`Catégorie "${newCat.name}" créée et synchronisée`, 'success');
  };

  const updateCategory = (id: string, updated: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updatedCat = { ...c, ...updated };
          const cleanCat = sanitizeForFirestore(updatedCat);
          setDoc(doc(db, 'categories', id), cleanCat, { merge: true })
            .then(() => {
              setLastCloudSync(new Date());
              setIsCloudConnected(true);
            })
            .catch((err) => console.error(err));
          return updatedCat;
        }
        return c;
      })
    );
    addToast('Catégorie mise à jour et synchronisée', 'info');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    deleteDoc(doc(db, 'categories', id))
      .then(() => {
        setLastCloudSync(new Date());
        setIsCloudConnected(true);
      })
      .catch((err) => console.error(err));
    addToast('Catégorie supprimée de la base partagée', 'info');
  };

  // CRUD for Articles (Blog & Guides)
  const addArticle = (art: Omit<Article, 'id' | 'date'>) => {
    const id = `art-${Date.now()}`;
    const newArticle: Article = {
      ...art,
      id,
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    setArticles((prev) => [newArticle, ...prev.filter((a) => a.id !== id)]);
    const cleanPayload = sanitizeForFirestore(newArticle);
    setDoc(doc(db, 'articles', id), cleanPayload)
      .then(() => {
        setLastCloudSync(new Date());
        setIsCloudConnected(true);
      })
      .catch((err) => {
        console.error('Erreur Firestore addArticle:', err);
        addToast(`Erreur cloud : ${err?.message || 'Échec'}`, 'error');
      });
    addToast('Article de conseil publié et synchronisé en temps réel', 'success');
  };

  const updateArticle = (id: string, updated: Partial<Article>) => {
    setArticles((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const updatedArticle = { ...a, ...updated };
          const cleanPayload = sanitizeForFirestore(updatedArticle);
          setDoc(doc(db, 'articles', id), cleanPayload, { merge: true })
            .then(() => {
              setLastCloudSync(new Date());
              setIsCloudConnected(true);
            })
            .catch((err) => {
              console.error('Erreur Firestore updateArticle:', err);
              addToast(`Erreur cloud : ${err?.message || 'Échec'}`, 'error');
            });
          return updatedArticle;
        }
        return a;
      })
    );
    addToast('Article de conseil mis à jour et synchronisé', 'info');
  };

  const deleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    deleteDoc(doc(db, 'articles', id))
      .then(() => {
        setLastCloudSync(new Date());
        setIsCloudConnected(true);
      })
      .catch((err) => {
        console.error('Erreur Firestore deleteArticle:', err);
        addToast(`Erreur suppression cloud : ${err?.message || 'Échec'}`, 'error');
      });
    addToast('Article supprimé de la base de données partagée', 'info');
  };

  // CRUD for Pages
  const addPage = (page: Omit<CustomPage, 'id' | 'updatedAt'>) => {
    const id = page.slug || `page-${Date.now()}`;
    const newPage: CustomPage = {
      ...page,
      id,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setPages((prev) => [...prev, newPage]);
    setDoc(doc(db, 'pages', id), newPage).catch((err) => console.error(err));
    addToast('Page créée et synchronisée', 'success');
  };

  const updatePage = (id: string, updated: Partial<CustomPage>) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updatedPage = { ...p, ...updated, updatedAt: new Date().toISOString().split('T')[0] };
          setDoc(doc(db, 'pages', id), updatedPage, { merge: true }).catch((err) => console.error(err));
          return updatedPage;
        }
        return p;
      })
    );
    addToast('Page mise à jour', 'info');
  };

  const deletePage = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
    deleteDoc(doc(db, 'pages', id)).catch((err) => console.error(err));
    addToast('Page supprimée', 'info');
  };

  const restoreInitialPages = async () => {
    try {
      const batch = writeBatch(db);
      initialPages.forEach((p) => {
        batch.set(doc(db, 'pages', p.id), p, { merge: true });
      });
      await batch.commit();
      setPages(initialPages);
      localStorage.setItem('tme_pages', JSON.stringify(initialPages));
      addToast('Pages restaurées aux versions officielles (À Propos, CGU, Confidentialité, CGV)', 'success');
    } catch (e) {
      console.error(e);
      setPages(initialPages);
      localStorage.setItem('tme_pages', JSON.stringify(initialPages));
      addToast('Pages restaurées localement', 'info');
    }
  };

  // Coupons
  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev.filter((c) => c.code !== coupon.code)]);
    const cleanCoupon = sanitizeForFirestore(coupon);
    setDoc(doc(db, 'coupons', coupon.code), cleanCoupon)
      .then(() => {
        setLastCloudSync(new Date());
        setIsCloudConnected(true);
      })
      .catch((err) => console.error(err));
    addToast(`Code promo "${coupon.code}" créé et synchronisé`, 'success');
  };

  const updateCoupon = (code: string, updated: Partial<Coupon>) => {
    setCoupons((prev) =>
      prev.map((c) => {
        if (c.code.toUpperCase() === code.toUpperCase()) {
          const updatedCoupon = { ...c, ...updated };
          const cleanCoupon = sanitizeForFirestore(updatedCoupon);
          setDoc(doc(db, 'coupons', code), cleanCoupon, { merge: true })
            .then(() => {
              setLastCloudSync(new Date());
              setIsCloudConnected(true);
            })
            .catch((err) => console.error(err));
          return updatedCoupon;
        }
        return c;
      })
    );
    addToast(`Code promo "${code}" mis à jour`, 'success');
  };

  const toggleCouponStatus = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => {
        if (c.code.toUpperCase() === code.toUpperCase()) {
          const newStatus = !c.isActive;
          const updatedCoupon = { ...c, isActive: newStatus };
          setDoc(doc(db, 'coupons', code), { isActive: newStatus }, { merge: true })
            .then(() => {
              setLastCloudSync(new Date());
              setIsCloudConnected(true);
            })
            .catch((err) => console.error(err));
          addToast(`Code promo "${c.code}" ${newStatus ? 'activé' : 'désactivé'}`, newStatus ? 'success' : 'info');
          return updatedCoupon;
        }
        return c;
      })
    );
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    deleteDoc(doc(db, 'coupons', code))
      .then(() => {
        setLastCloudSync(new Date());
        setIsCloudConnected(true);
      })
      .catch((err) => console.error(err));
    addToast('Code promo supprimé', 'info');
  };

  // Bulk Promotions Management
  const applyBulkDiscount = (categorySlug: string | 'all', percent: number) => {
    if (percent <= 0 || percent > 90) {
      addToast('Le pourcentage doit être compris entre 1% et 90%', 'warning');
      return;
    }

    setProducts((prev) =>
      prev.map((p) => {
        const matchesCategory = categorySlug === 'all' || p.category === categorySlug;
        if (!matchesCategory) return p;

        const originalBasePrice = p.compareAtPrice && p.compareAtPrice > p.price ? p.compareAtPrice : p.price;
        const newDiscountedPrice = Math.round(originalBasePrice * (1 - percent / 100));

        const updatedProd = {
          ...p,
          compareAtPrice: originalBasePrice,
          price: newDiscountedPrice,
          discountPercentage: percent,
          isFlashSale: true
        };

        const cleanProd = sanitizeForFirestore(updatedProd);
        setDoc(doc(db, 'products', p.id), cleanProd, { merge: true })
          .then(() => {
            setLastCloudSync(new Date());
            setIsCloudConnected(true);
          })
          .catch((err) => console.error(err));
        return updatedProd;
      })
    );

    addToast(`Remise de -${percent}% appliquée et synchronisée sur tous les appareils !`, 'success');
  };

  const removeBulkDiscount = (categorySlug: string | 'all') => {
    setProducts((prev) =>
      prev.map((p) => {
        const matchesCategory = categorySlug === 'all' || p.category === categorySlug;
        if (!matchesCategory) return p;

        const restoredPrice = p.compareAtPrice && p.compareAtPrice > p.price ? p.compareAtPrice : p.price;
        const updatedProd: Product = {
          ...p,
          price: restoredPrice,
          isFlashSale: false
        };
        delete updatedProd.compareAtPrice;
        delete updatedProd.discountPercentage;

        // In Firestore, delete compareAtPrice and discountPercentage fields
        setDoc(
          doc(db, 'products', p.id),
          {
            price: restoredPrice,
            isFlashSale: false,
            compareAtPrice: deleteField(),
            discountPercentage: deleteField()
          },
          { merge: true }
        )
          .then(() => {
            setLastCloudSync(new Date());
            setIsCloudConnected(true);
          })
          .catch((err) => console.error(err));

        return updatedProd;
      })
    );

    addToast('Promotions réinitialisées et synchronisées sur tous les appareils', 'info');
  };

  const toggleProductFlashSale = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const nextStatus = !p.isFlashSale;
          let newPrice = p.price;
          let newCompare = p.compareAtPrice;
          let newDiscount = p.discountPercentage;

          if (nextStatus && (!p.discountPercentage || p.discountPercentage === 0)) {
            newCompare = p.price;
            newPrice = Math.round(p.price * 0.9);
            newDiscount = 10;
          }

          const updatedProd = {
            ...p,
            isFlashSale: nextStatus,
            price: newPrice,
            compareAtPrice: newCompare,
            discountPercentage: newDiscount
          };

          const cleanProd = sanitizeForFirestore(updatedProd);
          setDoc(doc(db, 'products', productId), cleanProd, { merge: true })
            .then(() => {
              setLastCloudSync(new Date());
              setIsCloudConnected(true);
            })
            .catch((err) => console.error(err));

          addToast(
            `Mode promo ${nextStatus ? 'activé' : 'désactivé'} pour "${p.title}"`,
            nextStatus ? 'success' : 'info'
          );

          return updatedProd;
        }
        return p;
      })
    );
  };

  // Store Settings
  const updateSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    const cleanSettings = sanitizeForFirestore(newSettings);
    setDoc(doc(db, 'settings', 'store_config'), cleanSettings, { merge: true })
      .then(() => {
        setLastCloudSync(new Date());
        setIsCloudConnected(true);
      })
      .catch((err) => console.error(err));
    addToast('Paramètres de la boutique sauvegardés et synchronisés en direct', 'success');
  };

  // Quick Buy
  const quickBuyProduct = (product: Product) => {
    addToCart(product, 1);
    setActiveView('checkout');
  };

  const quickWhatsAppOrder = (product: Product) => {
    const phone = settings.whatsappNumber || '221775363437';
    const message = encodeURIComponent(
      `Bonjour TOUBA MADIYINA ELECTRONIC,\n\nJe souhaite commander :\n- Produit : ${product.title}\n- Prix : ${formatFCFA(product.price)}\n- Réf/SKU : ${product.sku}\n\nMerci de me donner la disponibilité pour une livraison à Dakar.`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  // Reset to default
  const resetToDefaultData = () => {
    setSettings(initialStoreSettings);
    setProducts(initialProducts);
    setCategories(initialCategories);
    setArticles(initialArticles);
    setPages(initialPages);
    setReviews(initialReviews);
    setCoupons(initialCoupons);
    setCart([]);
    setOrders([]);
    localStorage.clear();
    seedInitialFirestoreData();
    addToast("Boutique réinitialisée avec les données d'origine", 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        settings,
        updateSettings,
        products,
        categories,
        articles,
        pages,
        reviews,
        coupons,
        deliveryZones,

        isCloudConnected,
        cloudSyncStatus,
        lastCloudSync,
        isSyncingNow,
        forceSyncAllToFirestore,

        activeView,
        setActiveView,
        selectedProductId,
        setSelectedProductId,
        selectedCategorySlug,
        setSelectedCategorySlug,
        selectedArticleId,
        setSelectedArticleId,
        selectedPageSlug,
        setSelectedPageSlug,
        selectedOrder,
        setSelectedOrder,

        searchQuery,
        setSearchQuery,
        searchFilterCategory,
        setSearchFilterCategory,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartDrawerOpen,
        setIsCartDrawerOpen,

        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,

        orders,
        createOrder,
        updateOrderStatus,
        updatePaymentStatus,
        deleteOrder,
        deleteAllOrders,
        restoreInitialOrders,
        findOrderByReferenceOrPhone,

        addReview,
        getProductReviews,

        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addArticle,
        updateArticle,
        deleteArticle,
        addPage,
        updatePage,
        deletePage,
        restoreInitialPages,
        addCoupon,
        updateCoupon,
        toggleCouponStatus,
        deleteCoupon,
        applyBulkDiscount,
        removeBulkDiscount,
        toggleProductFlashSale,

        isWelcomeModalOpen,
        setIsWelcomeModalOpen,
        isLocationModalOpen,
        setIsLocationModalOpen,
        toasts,
        addToast,
        removeToast,
        formatFCFA,

        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        isAuthModalOpen,
        setIsAuthModalOpen,

        quickBuyProduct,
        quickWhatsAppOrder,
        resetToDefaultData
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

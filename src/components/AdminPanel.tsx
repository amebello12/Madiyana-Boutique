import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Logo } from './Logo';
import { AdminPromotions } from './AdminPromotions';
import { AdminPagesTab } from './AdminPagesTab';
import { AdminArticlesTab } from './AdminArticlesTab';
import { Product, Category, SenegalZone, Order } from '../types';
import { generateShopifyThemeZip } from '../utils/shopifyThemeGenerator';
import { exportProductsToShopifyCSV } from '../utils/shopifyCsvExporter';
import {
  Package,
  FolderPlus,
  ShoppingBag,
  Download,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  FileCode,
  FileSpreadsheet,
  FileText,
  AlertCircle,
  Truck,
  ExternalLink,
  Save,
  RotateCcw,
  Sparkles,
  Lock,
  LogOut,
  KeyRound,
  RefreshCw,
  BookOpen,
  Eye,
  EyeOff,
  Store,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Flame,
  Tag,
  Percent,
  Upload,
  UploadCloud,
  Image as ImageIcon,
  MessageCircle,
  Search,
  X,
  MapPin,
  CreditCard,
  Star,
  Camera,
  Layers,
  ArrowLeftRight,
  MoveUp,
  MoveDown,
  Check
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    products,
    categories,
    articles,
    orders,
    coupons,
    pages,
    deliveryZones,
    settings,
    updateSettings,
    addProduct,
    updateProduct,
    deleteProduct,
    createOrder,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder,
    restoreInitialOrders,
    formatFCFA,
    addToast,
    isCloudConnected,
    cloudSyncStatus,
    lastCloudSync,
    isSyncingNow,
    forceSyncAllToFirestore,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    setActiveView
  } = useStore();

  // Login form state (if not authenticated)
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  const [activeTab, setActiveTab] = useState<'products' | 'promotions' | 'categories' | 'articles' | 'orders' | 'pages' | 'shopify' | 'settings'>('products');
  const [isExportingTheme, setIsExportingTheme] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'en_attente' | 'confirmee' | 'en_livraison' | 'livree' | 'annulee'>('all');

  // New Product Modal/Form state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);

  // Order Deletion Warning & Confirmation Modal state
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [isDeletingOrder, setIsDeletingOrder] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    title: '',
    brand: 'Samsung',
    price: 50000,
    compareAtPrice: 65000,
    category: 'telephones-accessoires',
    inStock: true,
    stockCount: 15,
    rating: 4.8,
    reviewCount: 12,
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=700&auto=format&fit=crop&q=80'],
    description: '',
    features: ['Garantie officielle 12 mois', 'Livraison rapide à Dakar'],
    specs: { 'Marque': 'Samsung', 'État': 'Neuf scellé' },
    sku: 'TME-' + Math.floor(1000 + Math.random() * 9000),
    isFeatured: true,
    isFlashSale: false,
    warranty: 'Garantie 12 Mois Dakar'
  });

  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [draggedSlotIndex, setDraggedSlotIndex] = useState<number | null>(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [useManualUrl, setUseManualUrl] = useState(false);

  // Handle single or multiple image uploads (2 to 4 photos)
  const handleProcessImageFiles = (files: FileList | File[], targetSlotIndex?: number) => {
    const fileArray = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (fileArray.length === 0) {
      setImageUploadError('Veuillez sélectionner un ou plusieurs fichiers image valides (PNG, JPG, WEBP).');
      return;
    }

    // Limit file size to 5MB
    for (const file of fileArray) {
      if (file.size > 5 * 1024 * 1024) {
        setImageUploadError(`L'image "${file.name}" est trop volumineuse (maximum 5 Mo recommandé).`);
        return;
      }
    }

    setImageUploadError(null);

    const readPromises = fileArray.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            resolve(e.target.result as string);
          } else {
            reject(new Error('Erreur de lecture'));
          }
        };
        reader.onerror = () => reject(new Error('Erreur de lecture'));
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises)
      .then((base64Urls) => {
        setProductForm((prev) => {
          const currentImages = [...(prev.images || [])];

          // If target slot is specified (replacing or filling specific slot 0, 1, 2, 3)
          if (targetSlotIndex !== undefined) {
            if (base64Urls.length === 1) {
              const updated = [...currentImages];
              // Ensure array has enough elements
              while (updated.length < targetSlotIndex) {
                updated.push('');
              }
              updated[targetSlotIndex] = base64Urls[0];
              return {
                ...prev,
                images: updated.filter((url, idx) => url || idx <= targetSlotIndex)
              };
            }
          }

          // Global upload: merge or append up to 4+ photos
          let merged: string[] = [];
          if (currentImages.length === 0) {
            merged = base64Urls.slice(0, 4);
          } else {
            // Fill empty slots or append
            merged = [...currentImages];
            for (const url of base64Urls) {
              if (merged.length < 4) {
                merged.push(url);
              }
            }
          }

          return {
            ...prev,
            images: merged
          };
        });
      })
      .catch(() => {
        setImageUploadError('Erreur lors du traitement des images.');
      });
  };

  const handleGlobalImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImage(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessImageFiles(e.dataTransfer.files);
    }
  };

  const handleSlotImageDrop = (e: React.DragEvent, slotIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedSlotIndex(null);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessImageFiles(e.dataTransfer.files, slotIdx);
    }
  };

  const handleSetMainImage = (index: number) => {
    setProductForm((prev) => {
      const current = [...(prev.images || [])];
      if (index <= 0 || index >= current.length) return prev;
      const selected = current[index];
      current.splice(index, 1);
      current.unshift(selected);
      return {
        ...prev,
        images: current
      };
    });
  };

  const handleRemoveImageAt = (index: number) => {
    setProductForm((prev) => {
      const current = [...(prev.images || [])];
      current.splice(index, 1);
      return {
        ...prev,
        images: current
      };
    });
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    setProductForm((prev) => {
      const current = [...(prev.images || [])];
      const targetIndex = direction === 'left' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= current.length) return prev;
      const temp = current[index];
      current[index] = current[targetIndex];
      current[targetIndex] = temp;
      return {
        ...prev,
        images: current
      };
    });
  };

  const handleUpdateImageUrl = (index: number, url: string) => {
    setProductForm((prev) => {
      const current = [...(prev.images || [])];
      while (current.length <= index) {
        current.push('');
      }
      current[index] = url;
      return {
        ...prev,
        images: current
      };
    });
  };

  // Settings local state
  const [localSettings, setLocalSettings] = useState(settings);

  // Handle direct login from Admin view
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmittingAuth(true);

    setTimeout(() => {
      const ok = loginAdmin(loginUsername, loginPassword);
      setIsSubmittingAuth(false);
      if (ok) {
        setLoginUsername('');
        setLoginPassword('');
        setAuthError(null);
      } else {
        setAuthError('Identifiant ou mot de passe incorrect.');
      }
    }, 300);
  };

  // IF NOT AUTHENTICATED: Show secure authentication screen
  if (!isAdminAuthenticated) {
    return (
      <div className="bg-slate-950 min-h-screen py-12 px-4 flex items-center justify-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 text-white text-center">
            <div className="mb-4 flex justify-center">
              <Logo variant="full" theme="dark" size="md" />
            </div>
            <h2 className="text-lg font-black tracking-tight text-white">
              Connexion Espace Administrateur
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Accès protégé — Gestion & Exports Shopify
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="p-6 sm:p-8 space-y-5">
            {authError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Identifiant
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Entrez votre identifiant"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                  autoFocus
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Mot de Passe
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                  className="w-full pl-10 pr-12 py-3 rounded-2xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={isSubmittingAuth}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-600/30 transition-all transform active:scale-98 flex items-center justify-center gap-2"
              >
                {isSubmittingAuth ? (
                  <span>Authentification en cours...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Se connecter à l'espace Admin</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveView('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-colors flex items-center justify-center gap-2"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Retourner à la boutique publique</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    );
  }

  // Handle Shopify Theme ZIP generation
  const handleDownloadShopifyTheme = async () => {
    setIsExportingTheme(true);
    try {
      await generateShopifyThemeZip(products, categories, settings);
      addToast('Thème Shopify compatible généré et téléchargé avec succès !', 'success');
    } catch (err) {
      addToast('Erreur lors de la génération de l\'archive du thème', 'error');
    } finally {
      setIsExportingTheme(false);
    }
  };

  // Handle Shopify CSV export
  const handleDownloadShopifyCsv = () => {
    try {
      exportProductsToShopifyCSV(products);
      addToast('Fichier CSV compatible Shopify téléchargé !', 'success');
    } catch (err) {
      addToast('Erreur lors de l\'exportation CSV', 'error');
    }
  };

  // Product save
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title || !productForm.price) {
      addToast('Le titre et le prix sont obligatoires', 'warning');
      return;
    }

    // Clean and filter non-empty images (support 1 to 4 photos)
    const validImages = (productForm.images || [])
      .map((img) => (typeof img === 'string' ? img.trim() : ''))
      .filter((img) => img.length > 0);

    const finalImages = validImages.length > 0 
      ? validImages 
      : ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=700&auto=format&fit=crop&q=80'];

    const numPrice = Number(productForm.price) || 0;
    const numComparePrice = productForm.compareAtPrice ? Number(productForm.compareAtPrice) : 0;
    const hasDiscount = numComparePrice > numPrice;
    const discountPercentage = hasDiscount
      ? Math.round(((numComparePrice - numPrice) / numComparePrice) * 100)
      : undefined;

    const payload: any = {
      title: (productForm.title || '').trim(),
      brand: (productForm.brand || 'Générique').trim(),
      price: numPrice,
      category: productForm.category || 'autres',
      inStock: Boolean(productForm.inStock),
      stockCount: Number(productForm.stockCount) || 0,
      rating: Number(productForm.rating) || 4.9,
      reviewCount: Number(productForm.reviewCount) || 5,
      images: finalImages,
      description: productForm.description || '',
      features: Array.isArray(productForm.features) ? productForm.features : ['Garantie officielle', 'Livraison 2h à 4h Dakar'],
      specs: productForm.specs || { 'État': 'Neuf' },
      sku: productForm.sku || `TME-${Math.floor(1000 + Math.random() * 9000)}`,
      slug: (productForm.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      isFeatured: Boolean(productForm.isFeatured),
      isFlashSale: Boolean(productForm.isFlashSale)
    };

    if (numComparePrice > 0) {
      payload.compareAtPrice = numComparePrice;
    }
    if (discountPercentage) {
      payload.discountPercentage = discountPercentage;
    }
    if (productForm.warranty) {
      payload.warranty = productForm.warranty;
    }
    if (productForm.flashSaleEnds) {
      payload.flashSaleEnds = productForm.flashSaleEnds;
    }
    if (productForm.shopifyHandle) {
      payload.shopifyHandle = productForm.shopifyHandle;
    }

    if (editingProductId) {
      updateProduct(editingProductId, payload);
      addToast(`Article mis à jour avec succès (${finalImages.length} photo${finalImages.length > 1 ? 's' : ''})`, 'success');
    } else {
      addProduct(payload);
      addToast(`Nouvel article ajouté au catalogue et synchronisé en temps réel sur tous les appareils !`, 'success');
    }

    setShowAddProductModal(false);
    setEditingProductId(null);
  };

  const handleEditProductClick = (product: Product) => {
    setEditingProductId(product.id);
    setProductForm({ ...product });
    setShowAddProductModal(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Authenticated Banner with Logout */}
        <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm text-xs font-bold">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-500">Connecté en tant que :</span>
            <span className="text-blue-700 font-extrabold px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200">
              Toubamadiyana
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5 text-blue-600" />
              <span>Voir la boutique en direct</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors flex items-center gap-1.5 font-bold"
              title="Fermer la session"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Back-Office & Centre Shopify</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Gestion de TOUBA MADIYINA
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Gérez votre catalogue, vos commandes sénégalaises et téléversez directement sur Shopify.
            </p>
          </div>

          {/* Direct Shopify Export Actions in Header */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadShopifyTheme}
              disabled={isExportingTheme}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{isExportingTheme ? 'Génération ZIP...' : 'Télécharger Thème Shopify (.ZIP)'}</span>
            </button>

            <button
              onClick={handleDownloadShopifyCsv}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export CSV Produits Shopify</span>
            </button>
          </div>
        </div>

        {/* Real-time Cloud Synchronization Bar */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-4 sm:p-5 rounded-3xl shadow-lg border border-blue-700/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  Base Cloud Firestore Unique & Synchronisée en Direct
                </span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-blue-200 font-mono">
                  ai-studio-toubamadiyinaele
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Tous les appareils connectés (smartphones, ordinateurs, tablettes) partagent ce même catalogue centralisé. Tout ajout ou modification s'applique instantanément partout en temps réel.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-right">
              <span className="block text-[10px] text-slate-400 uppercase font-black">État Cloud</span>
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                {lastCloudSync ? `Synchro : ${new Date(lastCloudSync).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : 'Connecté'}
              </span>
            </div>
            <button
              onClick={() => forceSyncAllToFirestore()}
              disabled={isSyncingNow}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
              title="Forcer un rafraîchissement complet vers le Cloud Firestore"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingNow ? 'animate-spin' : ''}`} />
              <span>{isSyncingNow ? 'Synchronisation...' : 'Forcer la Synchro'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'products' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Catalogue Produits ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'articles' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Articles & Guides ({articles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('promotions')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'promotions'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-rose-50 hover:text-rose-700'
            }`}
          >
            <Flame className="w-4 h-4 text-rose-500 fill-current" />
            <span>🔥 Promotions & Ventes Flash ({coupons.length} codes / {products.filter(p => p.isFlashSale).length} promos)</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Commandes Sénégal ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pages')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'pages' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Pages & Mentions ({pages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('shopify')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'shopify' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Compatibilité Shopify & Déploiement</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'settings' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Paramètres de la Boutique</span>
          </button>
        </div>

        {/* ========================================================== */}
        {/* TAB 1: PRODUITS                                             */}
        {/* ========================================================== */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">Articles en vente à Dakar</h2>
                <p className="text-xs text-slate-500">Ajoutez, modifiez le prix FCFA, ajustez les stocks ou créez des ventes flash.</p>
              </div>
              <button
                onClick={() => {
                  setEditingProductId(null);
                  setProductForm({
                    title: '',
                    brand: 'Samsung',
                    price: 50000,
                    compareAtPrice: 65000,
                    category: 'telephones-accessoires',
                    inStock: true,
                    stockCount: 10,
                    rating: 4.9,
                    reviewCount: 5,
                    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=700&auto=format&fit=crop&q=80'],
                    description: 'Description détaillée du produit.',
                    features: ['Garantie officielle', 'Livraison 2h à 4h Dakar'],
                    specs: { 'État': 'Neuf' },
                    sku: 'TME-' + Math.floor(1000 + Math.random() * 9000),
                    isFeatured: true,
                    isFlashSale: false,
                    warranty: 'Garantie 12 Mois'
                  });
                  setShowAddProductModal(true);
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black flex items-center gap-2 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un Produit</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase font-black tracking-wider text-[10px]">
                    <th className="p-3">Produit</th>
                    <th className="p-3">Catégorie</th>
                    <th className="p-3">Prix (FCFA)</th>
                    <th className="p-3">Stock Dakar</th>
                    <th className="p-3">Statut</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-12 h-12 rounded-xl object-contain bg-slate-100 border border-slate-200 p-1 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 line-clamp-1">{p.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{p.sku} • {p.brand}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-3 font-black text-slate-900">
                        {formatFCFA(p.price)}
                        {p.compareAtPrice && (
                          <span className="block text-[10px] text-slate-400 line-through">
                            {formatFCFA(p.compareAtPrice)}
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-bold text-slate-700">
                        {p.stockCount} unités
                      </td>
                      <td className="p-3">
                        {p.inStock ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            En stock
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">
                            Rupture
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditProductClick(p)}
                            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            title="Modifier ce produit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setProductToDelete(p)}
                            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all group"
                            title="Supprimer ce produit (demande confirmation)"
                          >
                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform text-rose-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 2: COMMANDES SÉNÉGAL (BASE DE DONNÉES CENTRALISÉE)     */}
        {/* ========================================================== */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            
            {/* CENTRALIZED DATABASE BANNER */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white shadow-md border border-blue-800/40 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                      <span>Base de Données Unique & Centralisée</span>
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        En Direct (Temps Réel)
                      </span>
                    </h3>
                    <p className="text-xs text-blue-200 mt-0.5">
                      Cloud Firestore &bull; Synchronisation multi-appareils automatique &bull; 0 doublon de tableau
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (restoreInitialOrders) {
                        restoreInitialOrders();
                      }
                    }}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow border border-slate-700 cursor-pointer"
                    title="Réinitialiser toutes les commandes"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Réinitialiser les Commandes</span>
                  </button>

                  <button
                    onClick={() => {
                      const samplePhones = ['77 123 45 67', '78 456 78 90', '76 890 12 34', '70 999 88 77'];
                      const sampleNames = ['Mamadou Diallo', 'Fatou Sow', 'Cheikh Ndiaye', 'Awa Fall', 'Ibrahima Ba'];
                      const sampleQuarters = ['Médina', 'Almadies', 'Mermoz', 'Parcelles Assainies', 'Guédiawaye'];
                      const randomProduct = products[Math.floor(Math.random() * products.length)] || products[0];

                      createOrder({
                        customer: {
                          fullName: sampleNames[Math.floor(Math.random() * sampleNames.length)],
                          phone: samplePhones[Math.floor(Math.random() * samplePhones.length)],
                          region: 'Dakar & Région',
                          city: 'Dakar',
                          district: sampleQuarters[Math.floor(Math.random() * sampleQuarters.length)],
                          address: 'Rue 10 x Avenue principale'
                        },
                        items: [{ product: randomProduct, quantity: 1 }],
                        subtotal: randomProduct.price,
                        shippingFee: 2000,
                        discount: 0,
                        total: randomProduct.price + 2000,
                        paymentMethod: Math.random() > 0.5 ? 'wave' : 'cod',
                        paymentStatus: 'pending',
                        orderStatus: 'en_attente'
                      });
                    }}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow"
                    title="Simule un achat effectué depuis un autre téléphone"
                  >
                    <span>⚡ Simuler Achat Téléphone</span>
                  </button>
                </div>
              </div>

              {/* ARCHITECTURE SCHEMA VISUALIZER */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-blue-900/40 text-xs font-mono text-blue-200">
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs">
                  <div className="space-y-0.5 text-slate-300">
                    <div>📱 Téléphone 1 (Client Dakar) ──┐</div>
                    <div>📱 Téléphone 2 (Client Thiès) ──┼──▶ <strong className="text-emerald-400">Base Unique Cloud</strong> ──▶ <strong className="text-white">Ce Tableau Admin</strong></div>
                    <div>💻 Ordinateur / Autre Appareil ─┘</div>
                  </div>
                  <div className="text-right text-[11px] text-slate-400 hidden md:block">
                    <div>Total Commandes : <strong className="text-white">{(orders || []).length}</strong></div>
                    <div>Dernière Sync : <span className="text-emerald-300">{lastCloudSync ? lastCloudSync.toLocaleTimeString('fr-FR') : 'En direct'}</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Tab Header with Metrics */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Déroulement & Gestion Complète des Commandes ({(orders || []).length})
                </h2>
                <p className="text-xs text-slate-500">
                  Tableau de bord administrateur exclusif pour le suivi, la préparation et la livraison des commandes à Dakar.
                </p>
              </div>

              {/* Revenue Pill */}
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 px-4 py-2 rounded-2xl text-xs">
                <span className="text-slate-500 font-medium">Chiffre d'Affaires Total :</span>
                <span className="font-black text-blue-900 text-sm">
                  {formatFCFA((orders || []).reduce((acc, o) => acc + (o && o.orderStatus !== 'annulee' ? (o.total || 0) : 0), 0))}
                </span>
              </div>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col md:flex-row gap-3">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Rechercher par client, téléphone (+221...), N° commande ou quartier..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 bg-white"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>

                {/* Filter Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
                  {[
                    { key: 'all', label: 'Toutes', count: (orders || []).length },
                    { key: 'en_attente', label: '⏳ En attente', count: (orders || []).filter(o => o?.orderStatus === 'en_attente').length },
                    { key: 'confirmee', label: '📦 Préparation', count: (orders || []).filter(o => o?.orderStatus === 'confirmee').length },
                    { key: 'en_livraison', label: '🚚 En livraison', count: (orders || []).filter(o => o?.orderStatus === 'en_livraison').length },
                    { key: 'livree', label: '✅ Livrées', count: (orders || []).filter(o => o?.orderStatus === 'livree').length },
                    { key: 'annulee', label: '❌ Annulées', count: (orders || []).filter(o => o?.orderStatus === 'annulee').length },
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setOrderStatusFilter(filter.key as any)}
                      className={`px-3 py-2 rounded-xl border transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        orderStatusFilter === filter.key
                          ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{filter.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        orderStatusFilter === filter.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {filter.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {(() => {
                const currentOrders = orders || [];
                const filteredOrders = currentOrders.filter((ord) => {
                  if (!ord) return false;
                  const matchesFilter = orderStatusFilter === 'all' || ord.orderStatus === orderStatusFilter;
                  const query = orderSearchQuery.toLowerCase().trim();
                  if (!query) return matchesFilter;

                  const orderNum = (ord.orderNumber || ord.id || '').toLowerCase();
                  const custName = (ord.customer?.fullName || '').toLowerCase();
                  const custPhone = (ord.customer?.phone || '');
                  const custDistrict = (ord.customer?.district || '').toLowerCase();
                  const custRegion = (ord.customer?.region || '').toLowerCase();
                  const hasMatchingItem = Boolean(ord.items && ord.items.some(it => it?.product?.title?.toLowerCase().includes(query)));

                  const matchesSearch = 
                    orderNum.includes(query) ||
                    custName.includes(query) ||
                    custPhone.includes(query) ||
                    custDistrict.includes(query) ||
                    custRegion.includes(query) ||
                    hasMatchingItem;

                  return matchesFilter && matchesSearch;
                });

                if (filteredOrders.length === 0) {
                  return (
                    <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl space-y-4 bg-slate-50/50">
                      <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-800">
                          {orderSearchQuery ? 'Aucune commande ne correspond à votre recherche' : 'Aucune commande pour le moment'}
                        </h4>
                        <p className="text-xs text-slate-500 max-w-md mx-auto">
                          {orderSearchQuery
                            ? 'Essayez avec un autre terme (nom client, numéro de téléphone, quartier).'
                            : 'Vous pouvez recharger les exemples de commandes ou simuler un achat pour tester le déroulement en direct.'}
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-3 pt-2">
                        {restoreInitialOrders && (
                          <button
                            type="button"
                            onClick={() => restoreInitialOrders()}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Charger les Commandes Exemples</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                }

                return filteredOrders.map((ord) => {
                  const cleanPhone = (ord.customer?.phone || '').replace(/[^0-9]/g, '');
                  const waUrl = cleanPhone 
                    ? `https://wa.me/221${cleanPhone}?text=${encodeURIComponent(`Bonjour ${ord.customer?.fullName || 'Client'}, nous vous contactons depuis TOUBA MADIYINA ELECTRONIC concernant votre commande ${ord.orderNumber || ''}.`)}`
                    : '#';

                  return (
                    <div key={ord.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all space-y-3 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                              {ord.orderNumber || ord.id}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              ID: {ord.id}
                            </span>
                          </div>
                          <h4 className="font-black text-sm text-slate-900 mt-1">
                            Client : {ord.customer?.fullName || 'Client Anonyme'} (+221 {ord.customer?.phone || 'Non renseigné'})
                          </h4>
                          <p className="text-xs text-slate-500">
                            Zone : {ord.customer?.region || 'Dakar'} &bull; Quartier : {ord.customer?.district || 'Non spécifié'} &bull; Date : {new Date(ord.date).toLocaleString('fr-FR')}
                          </p>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                          <div className="text-left sm:text-right">
                            <span className="text-xs text-slate-400 block">Total Commande</span>
                            <span className="text-lg font-black text-blue-900">{formatFCFA(ord.total || 0)}</span>
                          </div>
                          {deleteOrder && (
                            <button
                              type="button"
                              onClick={() => setOrderToDelete(ord)}
                              className="text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-50 border border-rose-200/80 hover:border-rose-600 px-2.5 py-1 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs group"
                              title="Supprimer cette commande (demande confirmation)"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-500 group-hover:text-white transition-colors" />
                              <span>Supprimer</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Items Purchased in this order */}
                      {ord.items && ord.items.length > 0 && (
                        <div className="py-1 flex flex-wrap gap-2 text-xs">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-700">
                              <span className="font-bold">{item?.product?.title || 'Article'}</span>
                              <span className="text-blue-600 font-extrabold">x{item?.quantity || 1}</span>
                              <span className="text-slate-400 text-[10px]">
                                ({formatFCFA((item?.product?.price || 0) * (item?.quantity || 1))})
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Status Modifiers & Visual Déroulement Stepper */}
                      <div className="space-y-3 pt-2">
                        
                        {/* Visual Stepper Lifecycle */}
                        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                            <span className="flex items-center gap-1.5 text-blue-900">
                              <Truck className="w-3.5 h-3.5 text-blue-600" />
                              <span>Déroulement du Cycle de Commande :</span>
                            </span>
                            <span className="font-extrabold text-blue-600 uppercase text-[10px]">
                              Étape actuelle : {(ord.orderStatus || 'en_attente').replace('_', ' ')}
                            </span>
                          </div>

                          {/* Quick 1-Click Action Stage Buttons */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px]">
                            <button
                              type="button"
                              onClick={() => updateOrderStatus(ord.id, 'en_attente')}
                              className={`py-1.5 px-2 rounded-lg font-bold border transition-all text-center ${
                                ord.orderStatus === 'en_attente'
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50'
                              }`}
                            >
                              1. ⏳ Reçue
                            </button>
                            <button
                              type="button"
                              onClick={() => updateOrderStatus(ord.id, 'confirmee')}
                              className={`py-1.5 px-2 rounded-lg font-bold border transition-all text-center ${
                                ord.orderStatus === 'confirmee'
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50'
                              }`}
                            >
                              2. 📦 Préparation
                            </button>
                            <button
                              type="button"
                              onClick={() => updateOrderStatus(ord.id, 'en_livraison')}
                              className={`py-1.5 px-2 rounded-lg font-bold border transition-all text-center ${
                                ord.orderStatus === 'en_livraison'
                                  ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50'
                              }`}
                            >
                              3. 🚚 En Livraison
                            </button>
                            <button
                              type="button"
                              onClick={() => updateOrderStatus(ord.id, 'livree')}
                              className={`py-1.5 px-2 rounded-lg font-bold border transition-all text-center ${
                                ord.orderStatus === 'livree'
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50'
                              }`}
                            >
                              4. ✅ Livrée
                            </button>
                          </div>
                        </div>

                        {/* Payment & Status Box */}
                        <div className="p-3 bg-slate-100/80 rounded-xl border border-slate-200 text-xs space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-slate-600" />
                              <span className="font-extrabold text-slate-900">
                                Mode : {ord.paymentMethod === 'wave' ? '🌊 Wave' : ord.paymentMethod === 'orange_money' ? '🟠 Orange Money' : '💵 Espèces à la livraison'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-500">Statut paiement :</span>
                              <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                                ord.paymentStatus === 'paid'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.paymentStatus === 'failed'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {ord.paymentStatus === 'paid' ? '🟢 Payé' : ord.paymentStatus === 'failed' ? '🔴 Échoué' : '🟡 En attente'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status Dropdowns & Contact Link */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              Statut de la Livraison :
                            </label>
                            <select
                              value={ord.orderStatus || 'en_attente'}
                              onChange={(e: any) => updateOrderStatus(ord.id, e.target.value)}
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-800 focus:outline-none focus:border-blue-600"
                            >
                              <option value="en_attente">⏳ En attente de validation</option>
                              <option value="confirmee">📦 Confirmée / En préparation</option>
                              <option value="en_livraison">🚚 En cours de livraison Dakar</option>
                              <option value="livree">✅ Livrée avec succès</option>
                              <option value="annulee">❌ Annulée</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              Statut du Règlement :
                            </label>
                            <select
                              value={ord.paymentStatus || 'pending'}
                              onChange={(e: any) => updatePaymentStatus(ord.id, e.target.value)}
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-800 focus:outline-none focus:border-blue-600"
                            >
                              <option value="pending">🟡 En attente de paiement</option>
                              <option value="paid">🟢 Payé (Wave / OM / Espèces)</option>
                              <option value="failed">🔴 Paiement échoué</option>
                            </select>
                          </div>

                          <div className="flex items-end">
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp Client</span>
                            </a>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 3: SHOPIFY COMPATIBILITY & THEME EXPORT                 */}
        {/* ========================================================== */}
        {activeTab === 'shopify' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-700">
                100% Compatible Shopify
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                Téléversement Direct sur votre Boutique Shopify
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Ce site a été conçu selon les standards d'architecture Shopify Liquid & Dawn. Vous pouvez exporter l'intégralité du thème en ZIP et vos produits en CSV pour les installer en 2 minutes sur Shopify.
              </p>
            </div>

            {/* Two Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* CARD 1: ZIP THEME */}
              <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl">
                    📦
                  </div>
                  <h3 className="text-lg font-black">Archive Thème Shopify (.ZIP)</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Contient l'arborescence officielle Shopify : <code>layout/theme.liquid</code>, <code>templates/</code>, <code>sections/</code>, <code>locales/fr.json</code> et <code>config/settings_schema.json</code>.
                  </p>
                </div>

                <button
                  onClick={handleDownloadShopifyTheme}
                  disabled={isExportingTheme}
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExportingTheme ? 'Création de l\'archive ZIP...' : 'TÉLÉCHARGER LE THÈME SHOPIFY'}</span>
                </button>
              </div>

              {/* CARD 2: CSV PRODUCTS */}
              <div className="p-6 rounded-3xl bg-blue-950 text-white space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center text-xl">
                    📊
                  </div>
                  <h3 className="text-lg font-black">Catalogue Produits Shopify (CSV)</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Fichier tableur structuré avec tous les champs requis par Shopify : Titres, Descriptions HTML, Prix en XOF, Stocks, Images et Variantes.
                  </p>
                </div>

                <button
                  onClick={handleDownloadShopifyCsv}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>TÉLÉCHARGER LE CSV SHOPIFY</span>
                </button>
              </div>

            </div>

            {/* Step-by-Step Shopify Guide */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Guide d'installation sur votre compte Shopify en 3 étapes :</span>
              </h4>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">1</span>
                  <div>
                    <strong className="text-slate-900">Installer le Thème :</strong> Rendez-vous dans votre admin Shopify &rarr; <em>Boutique en ligne</em> &rarr; <em>Thèmes</em> &rarr; <em>Ajouter un thème</em> &rarr; <em>Téléverser le fichier ZIP</em>.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">2</span>
                  <div>
                    <strong className="text-slate-900">Importer vos Produits :</strong> Dans votre admin Shopify &rarr; <em>Produits</em> &rarr; <em>Importer</em> &rarr; Sélectionnez le fichier CSV téléchargé.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">3</span>
                  <div>
                    <strong className="text-slate-900">Activer le Thème & Publier :</strong> Cliquez sur <em>Publier</em>. Votre boutique TOUBA MADIYINA ELECTRONIC est opérationnelle et prête à vendre à Dakar !
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================== */}
        {/* TAB: ARTICLES & GUIDES CONSEILS                           */}
        {/* ========================================================== */}
        {activeTab === 'articles' && <AdminArticlesTab />}

        {/* ========================================================== */}
        {/* TAB 2: PROMOTIONS & VENTES FLASH                           */}
        {/* ========================================================== */}
        {activeTab === 'promotions' && <AdminPromotions />}

        {/* ========================================================== */}
        {/* TAB 3: GESTION DES PAGES & MENTIONS LÉGALES               */}
        {/* ========================================================== */}
        {activeTab === 'pages' && <AdminPagesTab />}

        {/* ========================================================== */}
        {/* TAB 4: PARAMÈTRES BOUTIQUE & CODES MARCHANDS SÉNÉGAL        */}
        {/* ========================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            
            {/* GENERAL STORE CONFIG */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Configuration Générale du Magasin</h2>
                  <p className="text-xs text-slate-500">Coordonnées, adresse et politique de livraison à Dakar et au Sénégal.</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  🇸🇳 Boutique Sénégal
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nom de la Boutique</label>
                  <input
                    type="text"
                    value={localSettings.name}
                    onChange={(e) => setLocalSettings({ ...localSettings, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Slogan Commercial</label>
                  <input
                    type="text"
                    value={localSettings.slogan}
                    onChange={(e) => setLocalSettings({ ...localSettings, slogan: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Numéro WhatsApp Client (Format international)</label>
                  <input
                    type="text"
                    value={localSettings.whatsappNumber}
                    onChange={(e) => setLocalSettings({ ...localSettings, whatsappNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone Principal Magasin Dakar</label>
                  <input
                    type="text"
                    value={localSettings.contactPhone}
                    onChange={(e) => setLocalSettings({ ...localSettings, contactPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Seuil Livraison Gratuite (FCFA)</label>
                  <input
                    type="number"
                    value={localSettings.freeShippingMinAmount}
                    onChange={(e) => setLocalSettings({ ...localSettings, freeShippingMinAmount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Adresse Physique Magasin Sandaga / Médina (Utilisée pour Google Maps)</label>
                  <input
                    type="text"
                    value={localSettings.address}
                    onChange={(e) => setLocalSettings({ ...localSettings, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-semibold"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Cette adresse est automatiquement transmise à Google Maps pour générer la carte interactive et l'itinéraire client.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Repères & Précisions Magasin Dakar</label>
                  <input
                    type="text"
                    value={localSettings.mapsLandmark || ''}
                    onChange={(e) => setLocalSettings({ ...localSettings, mapsLandmark: e.target.value })}
                    placeholder="Ex: Angle Rue 22 x Boulevard Général de Gaulle (Face Marché Sandaga & Médina)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Horaires d'Ouverture Showroom</label>
                  <input
                    type="text"
                    value={localSettings.mapsOpeningHours || ''}
                    onChange={(e) => setLocalSettings({ ...localSettings, mapsOpeningHours: e.target.value })}
                    placeholder="Du Lundi au Samedi : 08h30 - 20h30"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* LIVE GOOGLE MAPS PREVIEW */}
              <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Aperçu de la Carte Google Maps en Direct
                    </h4>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(localSettings.address || 'Boulevard Général de Gaulle, Dakar')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                  >
                    <span>Tester le lien itinéraire Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="w-full h-56 rounded-xl overflow-hidden border border-slate-200 bg-white">
                  <iframe
                    title="Aperçu Google Maps"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(localSettings.address || 'Boulevard Général de Gaulle, Dakar, Sénégal')}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                </div>
              </div>

              {/* SAVE BUTTON */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    updateSettings(localSettings);
                    addToast('Paramètres de la boutique enregistrés avec succès !', 'success');
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all transform active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer les Paramètres</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================== */}
        {/* MODAL: ADD / EDIT PRODUCT                                  */}
        {/* ========================================================== */}
        {showAddProductModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900">
                  {editingProductId ? 'Modifier le Produit' : 'Ajouter un Produit au Catalogue'}
                </h3>
                <button
                  onClick={() => setShowAddProductModal(false)}
                  className="text-slate-400 hover:text-slate-700 p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Titre du Produit *</label>
                    <input
                      type="text"
                      value={productForm.title}
                      onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                      placeholder="Ex: Smart TV Samsung 55 Pouces 4K"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Marque</label>
                    <input
                      type="text"
                      value={productForm.brand}
                      onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                      placeholder="Samsung, Apple, TCL..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Prix de Vente (FCFA) *</label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Ancien Prix Barré (FCFA)</label>
                    <input
                      type="number"
                      value={productForm.compareAtPrice || ''}
                      onChange={(e) => setProductForm({ ...productForm, compareAtPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Catégorie</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold bg-white"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Quantité en Stock</label>
                    <input
                      type="number"
                      value={productForm.stockCount}
                      onChange={(e) => setProductForm({ ...productForm, stockCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold"
                    />
                  </div>
                </div>

                {/* UPLOAD & GESTION MULTI-PHOTOS DU PRODUIT (2 À 4 PHOTOS) */}
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <Camera className="w-5 h-5 text-blue-600" />
                      <label className="font-extrabold text-slate-900 text-sm">
                        Photos du Produit (2 à 4 photos)
                      </label>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                        (productForm.images?.filter(Boolean).length || 0) >= 2
                          ? 'bg-emerald-100 text-emerald-800'
                          : (productForm.images?.filter(Boolean).length || 0) === 1
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {(productForm.images?.filter(Boolean).length || 0)} / 4 photos
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setUseManualUrl(!useManualUrl)}
                      className="text-xs text-blue-600 hover:text-blue-700 underline font-bold self-start sm:self-auto"
                    >
                      {useManualUrl ? '📁 Mode Fichiers / Téléversement' : '🔗 Mode Liens URL directes'}
                    </button>
                  </div>

                  <p className="text-xs text-slate-500">
                    Ajoutez entre 2 et 4 photos sous différents angles (Face, Côté, Arrière, Accessoires) pour rassurer vos clients et booster vos ventes à Dakar.
                  </p>

                  {imageUploadError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span className="font-semibold">{imageUploadError}</span>
                    </div>
                  )}

                  {!useManualUrl ? (
                    <div className="space-y-4">
                      {/* Global Multi-file Dropzone / Selector */}
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDraggingImage(true);
                        }}
                        onDragLeave={() => setIsDraggingImage(false)}
                        onDrop={handleGlobalImageDrop}
                        className={`relative border-2 border-dashed rounded-2xl p-4 transition-all text-center ${
                          isDraggingImage
                            ? 'border-blue-500 bg-blue-100/60 scale-[1.01]'
                            : 'border-slate-300 hover:border-blue-400 bg-white'
                        }`}
                      >
                        <input
                          id="product-multi-image-upload"
                          type="file"
                          multiple
                          accept="image/png, image/jpeg, image/webp, image/gif, image/jpg"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              handleProcessImageFiles(e.target.files);
                            }
                          }}
                          className="sr-only"
                        />

                        <label
                          htmlFor="product-multi-image-upload"
                          className="cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-3 py-1"
                        >
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                            <UploadCloud className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="text-center sm:text-left">
                            <span className="font-extrabold text-blue-700 text-xs sm:text-sm hover:underline block">
                              Sélectionner 2 à 4 photos d'un coup (Galerie / PC)
                            </span>
                            <span className="text-[11px] text-slate-500 block">
                              Glissez-déposez vos photos ici ou cliquez pour choisir plusieurs fichiers
                            </span>
                          </div>
                        </label>
                      </div>

                      {/* 4 Dedicated Visual Photo Slots */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[0, 1, 2, 3].map((slotIdx) => {
                          const slotImage = productForm.images?.[slotIdx];
                          const slotTitles = [
                            '★ Photo 1 (Principale)',
                            'Photo 2 (Profil / Face)',
                            'Photo 3 (Arrière / Détail)',
                            'Photo 4 (Accessoires / Boîte)'
                          ];
                          const isMainSlot = slotIdx === 0;

                          return (
                            <div
                              key={slotIdx}
                              onDragOver={(e) => {
                                e.preventDefault();
                                setDraggedSlotIndex(slotIdx);
                              }}
                              onDragLeave={() => setDraggedSlotIndex(null)}
                              onDrop={(e) => handleSlotImageDrop(e, slotIdx)}
                              className={`relative rounded-2xl border-2 transition-all p-2 flex flex-col justify-between ${
                                draggedSlotIndex === slotIdx
                                  ? 'border-blue-500 bg-blue-50/80 ring-2 ring-blue-400'
                                  : isMainSlot
                                  ? slotImage
                                    ? 'border-blue-400 bg-blue-50/30'
                                    : 'border-blue-300 border-dashed bg-blue-50/20'
                                  : slotImage
                                  ? 'border-slate-200 bg-white'
                                  : 'border-slate-200 border-dashed bg-white hover:border-slate-300'
                              }`}
                            >
                              {/* Slot Header Tag */}
                              <div className="flex items-center justify-between gap-1 mb-1.5">
                                <span className={`text-[10px] font-black truncate ${
                                  isMainSlot ? 'text-blue-700' : 'text-slate-600'
                                }`}>
                                  {slotTitles[slotIdx]}
                                </span>
                                {slotImage && (
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Photo active"></span>
                                )}
                              </div>

                              {/* Slot Image or Placeholder */}
                              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100/80 border border-slate-200/80 flex items-center justify-center">
                                {slotImage ? (
                                  <>
                                    <img
                                      src={slotImage}
                                      alt={`Aperçu ${slotIdx + 1}`}
                                      className="w-full h-full object-contain p-1"
                                    />
                                    {isMainSlot && (
                                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-blue-600 text-white font-extrabold text-[9px] shadow-sm">
                                        Couverture
                                      </span>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveImageAt(slotIdx)}
                                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow hover:bg-rose-700 transition-colors"
                                      title="Supprimer cette photo"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                ) : (
                                  <label
                                    htmlFor={`slot-file-input-${slotIdx}`}
                                    className="w-full h-full cursor-pointer flex flex-col items-center justify-center gap-1 p-2 text-center text-slate-400 hover:text-blue-600 hover:bg-blue-50/30 transition-colors"
                                  >
                                    <Plus className="w-6 h-6" />
                                    <span className="text-[10px] font-bold">
                                      + Ajouter Photo {slotIdx + 1}
                                    </span>
                                  </label>
                                )}
                              </div>

                              {/* Hidden specific file input for this slot */}
                              <input
                                id={`slot-file-input-${slotIdx}`}
                                type="file"
                                accept="image/png, image/jpeg, image/webp, image/gif, image/jpg"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files.length > 0) {
                                    handleProcessImageFiles(e.target.files, slotIdx);
                                  }
                                }}
                                className="sr-only"
                              />

                              {/* Slot Actions Toolbar */}
                              <div className="pt-2 flex items-center justify-between gap-1 mt-auto">
                                <label
                                  htmlFor={`slot-file-input-${slotIdx}`}
                                  className="flex-1 py-1 px-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold text-center cursor-pointer transition-colors"
                                >
                                  {slotImage ? 'Changer' : 'Parcourir'}
                                </label>

                                {slotImage && !isMainSlot && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetMainImage(slotIdx)}
                                    className="p-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold transition-colors"
                                    title="Mettre en photo principale (Couverture)"
                                  >
                                    <Star className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                {slotImage && slotIdx > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleMoveImage(slotIdx, 'left')}
                                    className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px]"
                                    title="Déplacer à gauche"
                                  >
                                    ◀
                                  </button>
                                )}

                                {slotImage && slotIdx < (productForm.images?.length || 0) - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleMoveImage(slotIdx, 'right')}
                                    className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px]"
                                    title="Déplacer à droite"
                                  >
                                    ▶
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Manual URL Inputs for 4 Photos */
                    <div className="space-y-3">
                      {[0, 1, 2, 3].map((slotIdx) => {
                        const urlValue = productForm.images?.[slotIdx] || '';
                        const slotTitles = [
                          'Photo 1 - URL Principale (Couverture)',
                          'Photo 2 - URL Angle / Profil',
                          'Photo 3 - URL Arrière / Détail',
                          'Photo 4 - URL Accessoires / Boîte'
                        ];

                        return (
                          <div key={slotIdx} className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1">
                            <label className="block text-[11px] font-extrabold text-slate-700">
                              {slotTitles[slotIdx]} {slotIdx === 0 && '*'}
                            </label>
                            <div className="flex items-center gap-2">
                              {urlValue ? (
                                <img
                                  src={urlValue}
                                  alt={`Aperçu ${slotIdx + 1}`}
                                  className="w-10 h-10 rounded-lg object-contain bg-slate-100 border border-slate-200 shrink-0 p-0.5"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200&auto=format&fit=crop&q=80';
                                  }}
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0 text-xs font-bold">
                                  #{slotIdx + 1}
                                </div>
                              )}
                              <input
                                type="url"
                                value={urlValue}
                                onChange={(e) => handleUpdateImageUrl(slotIdx, e.target.value)}
                                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder={`https://images.unsplash.com/... (Photo ${slotIdx + 1})`}
                              />
                              {urlValue && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateImageUrl(slotIdx, '')}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                                  title="Effacer"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      <p className="text-[11px] text-slate-400">
                        Saisissez les liens Web directs (hébergés sur Unsplash, CDN ou votre propre serveur) pour chacune des photos.
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                    placeholder="Caractéristiques, avantages, livraison..."
                  ></textarea>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={productForm.isFeatured}
                      onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                    <span>Afficher en Vedette</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-rose-700">
                    <input
                      type="checkbox"
                      checked={productForm.isFlashSale}
                      onChange={(e) => setProductForm({ ...productForm, isFlashSale: e.target.checked })}
                      className="rounded text-rose-600"
                    />
                    <span>Vente Flash / Promo Spéciale</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black shadow-md"
                  >
                    Enregistrer le Produit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* MODAL: AVERTISSEMENT ET CONFIRMATION DE SUPPRESSION        */}
        {/* ========================================================== */}
        {productToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
            <div
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95"
              role="alertdialog"
              aria-modal="true"
            >
              {/* Header with Alert Icon */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-xs">
                  <AlertTriangle className="w-6 h-6 text-rose-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900">
                    Avertissement de Suppression
                  </h3>
                  <p className="text-xs text-rose-600 font-bold">
                    Cette action est irréversible
                  </p>
                </div>
              </div>

              {/* Product details card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <img
                  src={productToDelete.images[0] || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=700&auto=format&fit=crop&q=80'}
                  alt={productToDelete.title}
                  className="w-14 h-14 rounded-xl object-contain bg-white border border-slate-200 p-1 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-xs text-slate-900 truncate">
                    {productToDelete.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 font-mono">
                    <span>{productToDelete.sku}</span>
                    <span>&bull;</span>
                    <span className="font-bold text-slate-900">{formatFCFA(productToDelete.price)}</span>
                  </div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[9px] font-bold">
                    {productToDelete.category}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Êtes-vous absolument certain de vouloir supprimer <strong className="text-slate-900 font-black">"{productToDelete.title}"</strong> ? 
                L'article sera retiré immédiatement du catalogue client et supprimé de la base de données centrale Cloud Firestore.
              </p>

              {/* Modal Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={isDeletingProduct}
                  onClick={() => setProductToDelete(null)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  disabled={isDeletingProduct}
                  onClick={async () => {
                    setIsDeletingProduct(true);
                    try {
                      deleteProduct(productToDelete.id);
                      setProductToDelete(null);
                    } finally {
                      setIsDeletingProduct(false);
                    }
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isDeletingProduct ? 'Suppression en cours...' : 'Oui, Supprimer définitivement'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* MODAL: AVERTISSEMENT ET CONFIRMATION DE SUPPRESSION COMMANDE */}
        {/* ========================================================== */}
        {orderToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
            <div
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95"
              role="alertdialog"
              aria-modal="true"
            >
              {/* Header with Alert Icon */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-xs">
                  <AlertTriangle className="w-6 h-6 text-rose-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900">
                    Avertissement de Suppression de Commande
                  </h3>
                  <p className="text-xs text-rose-600 font-bold">
                    Cette action est irréversible et supprimera la commande de la base de données
                  </p>
                </div>
              </div>

              {/* Order Details Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block uppercase">Numéro de Commande</span>
                    <span className="font-mono font-black text-sm text-blue-900">
                      {orderToDelete.orderNumber || orderToDelete.id}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Montant Total</span>
                    <span className="font-black text-base text-slate-950">
                      {formatFCFA(orderToDelete.total || 0)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Client Destinataire</span>
                    <span className="font-extrabold text-slate-900">
                      {orderToDelete.customer?.fullName || 'Client Anonyme'}
                    </span>
                    <span className="text-[11px] text-slate-500 block font-mono">
                      +221 {orderToDelete.customer?.phone || 'Non renseigné'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Zone & Quartier</span>
                    <span className="font-bold text-slate-800">
                      {orderToDelete.customer?.district || 'Quartier non spécifié'}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {orderToDelete.customer?.region || 'Dakar'}
                    </span>
                  </div>
                </div>

                {orderToDelete.items && orderToDelete.items.length > 0 && (
                  <div className="pt-2.5 border-t border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1 uppercase">
                      Articles commandés ({orderToDelete.items.length}) :
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                      {orderToDelete.items.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 shadow-2xs"
                        >
                          {item?.product?.title || 'Article'} <span className="text-blue-600">x{item?.quantity || 1}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Mode de règlement :</span>
                  <span className="font-bold text-slate-800 uppercase">
                    {orderToDelete.paymentMethod === 'wave'
                      ? '🌊 Wave (Code Marchand)'
                      : orderToDelete.paymentMethod === 'orange_money'
                      ? '🟠 Orange Money'
                      : '💵 Espèces à la livraison'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Êtes-vous certain de vouloir supprimer définitivement la commande <strong className="text-slate-900 font-black">{orderToDelete.orderNumber || orderToDelete.id}</strong> ? 
                Elle sera effacée de votre panneau d'administration et synchronisée avec la base Cloud Firestore.
              </p>

              {/* Modal Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isDeletingOrder}
                  onClick={() => setOrderToDelete(null)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  disabled={isDeletingOrder}
                  onClick={async () => {
                    setIsDeletingOrder(true);
                    try {
                      deleteOrder(orderToDelete.id);
                      setOrderToDelete(null);
                    } finally {
                      setIsDeletingOrder(false);
                    }
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isDeletingOrder ? 'Suppression en cours...' : 'Oui, Supprimer définitivement'}</span>
                </button>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

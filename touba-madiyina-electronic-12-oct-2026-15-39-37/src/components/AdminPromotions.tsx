import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Coupon, Product } from '../types';
import {
  Flame,
  Tag,
  Percent,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  Copy,
  Search,
  Sparkles,
  Sliders,
  RefreshCw,
  Eye,
  EyeOff,
  Save,
  Check,
  X,
  Zap,
  TrendingDown,
  Gift,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export const AdminPromotions: React.FC = () => {
  const {
    coupons,
    addCoupon,
    updateCoupon,
    toggleCouponStatus,
    deleteCoupon,
    products,
    updateProduct,
    applyBulkDiscount,
    removeBulkDiscount,
    toggleProductFlashSale,
    categories,
    settings,
    updateSettings,
    formatFCFA,
    addToast
  } = useStore();

  const [promoSubTab, setPromoSubTab] = useState<'coupons' | 'flash_products' | 'banners'>('coupons');

  // ==================== COUPON FORM STATE ====================
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingCouponCode, setEditingCouponCode] = useState<string | null>(null);
  const [couponForm, setCouponForm] = useState<{
    code: string;
    discountType: 'percent' | 'fixed';
    discountValue: number;
    minAmount: number;
    expiresAt: string;
    isActive: boolean;
    description: string;
  }>({
    code: '',
    discountType: 'percent',
    discountValue: 10,
    minAmount: 20000,
    expiresAt: '',
    isActive: true,
    description: ''
  });

  // ==================== BULK DISCOUNT STATE ====================
  const [bulkCategory, setBulkCategory] = useState<string | 'all'>('all');
  const [bulkPercent, setBulkPercent] = useState<number>(15);

  // ==================== PRODUCT SEARCH & FILTER STATE ====================
  const [productSearch, setProductSearch] = useState('');
  const [productFilterCategory, setProductFilterCategory] = useState('all');
  const [productFilterPromo, setProductFilterPromo] = useState<'all' | 'on_sale' | 'regular'>('all');

  // Quick edit single product modal/popover state
  const [editingPromoProduct, setEditingPromoProduct] = useState<Product | null>(null);
  const [quickPromoPercent, setQuickPromoPercent] = useState<number>(15);
  const [quickPromoPrice, setQuickPromoPrice] = useState<number>(0);
  const [quickComparePrice, setQuickComparePrice] = useState<number>(0);

  // ==================== BANNER SETTINGS STATE ====================
  const [bannerSettings, setBannerSettings] = useState({
    announcementText: settings.announcementText || '🚚 Livraison express à Dakar (Même Jour) | 💳 Paiement à la livraison | 📱 Wave & Orange Money 100% Sécurisé',
    promoBannerActive: settings.promoBannerActive !== false,
    promoBannerTitle: settings.promoBannerTitle || '🔥 GRANDES PROMOTIONS',
    promoBannerSubtitle: settings.promoBannerSubtitle || "Profitez de nos offres exceptionnelles avant la fin du stock disponible à Dakar. Jusqu'à -45% sur les smartphones, TV et climatiseurs.",
    freeShippingMinAmount: settings.freeShippingMinAmount || 150000
  });

  // KPI Calculations
  const activeCouponsCount = coupons.filter((c) => c.isActive).length;
  const promoProducts = products.filter(
    (p) => p.isFlashSale || (p.discountPercentage && p.discountPercentage > 0) || (p.compareAtPrice && p.compareAtPrice > p.price)
  );
  const promoProductsCount = promoProducts.length;
  const averageDiscount =
    promoProductsCount > 0
      ? Math.round(
          promoProducts.reduce((acc, p) => acc + (p.discountPercentage || 0), 0) / promoProductsCount
        )
      : 0;

  // Handle open create coupon
  const handleOpenCreateCoupon = () => {
    setEditingCouponCode(null);
    setCouponForm({
      code: '',
      discountType: 'percent',
      discountValue: 10,
      minAmount: 25000,
      expiresAt: '',
      isActive: true,
      description: '10% de réduction immédiate'
    });
    setShowCouponModal(true);
  };

  // Handle open edit coupon
  const handleOpenEditCoupon = (c: Coupon) => {
    setEditingCouponCode(c.code);
    setCouponForm({
      code: c.code,
      discountType: c.discountPercent ? 'percent' : 'fixed',
      discountValue: c.discountPercent || c.fixedDiscount || 10,
      minAmount: c.minAmount || 0,
      expiresAt: c.expiresAt || '',
      isActive: c.isActive,
      description: c.description
    });
    setShowCouponModal(true);
  };

  // Save Coupon
  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponForm.code.trim().toUpperCase();

    if (!cleanCode) {
      addToast('Le code promotionnel est obligatoire', 'warning');
      return;
    }

    if (couponForm.discountValue <= 0) {
      addToast('La valeur de la réduction doit être supérieure à 0', 'warning');
      return;
    }

    const couponData: Coupon = {
      code: cleanCode,
      discountPercent: couponForm.discountType === 'percent' ? Number(couponForm.discountValue) : undefined,
      fixedDiscount: couponForm.discountType === 'fixed' ? Number(couponForm.discountValue) : undefined,
      minAmount: couponForm.minAmount ? Number(couponForm.minAmount) : undefined,
      expiresAt: couponForm.expiresAt || undefined,
      isActive: couponForm.isActive,
      description: couponForm.description || (couponForm.discountType === 'percent' ? `${couponForm.discountValue}% de remise` : `${formatFCFA(couponForm.discountValue)} de remise`)
    };

    if (editingCouponCode) {
      updateCoupon(editingCouponCode, couponData);
    } else {
      // Check duplicate
      if (coupons.some((c) => c.code.toUpperCase() === cleanCode)) {
        addToast(`Le code "${cleanCode}" existe déjà`, 'warning');
        return;
      }
      addCoupon(couponData);
    }

    setShowCouponModal(false);
  };

  // Copy coupon code to clipboard
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    addToast(`Code "${code}" copié dans le presse-papier`, 'success');
  };

  // Handle quick edit product promo
  const handleStartEditProductPromo = (p: Product) => {
    setEditingPromoProduct(p);
    const baseCompare = p.compareAtPrice && p.compareAtPrice > p.price ? p.compareAtPrice : p.price;
    setQuickComparePrice(baseCompare);
    setQuickPromoPrice(p.price);
    setQuickPromoPercent(p.discountPercentage || 15);
  };

  const handleApplySingleProductPromo = () => {
    if (!editingPromoProduct) return;

    if (quickPromoPrice >= quickComparePrice) {
      addToast('Le prix promo doit être inférieur au prix normal barré', 'warning');
      return;
    }

    const calculatedDiscount = Math.round(((quickComparePrice - quickPromoPrice) / quickComparePrice) * 100);

    updateProduct(editingPromoProduct.id, {
      price: Number(quickPromoPrice),
      compareAtPrice: Number(quickComparePrice),
      discountPercentage: calculatedDiscount,
      isFlashSale: true
    });

    addToast(`Promotion de -${calculatedDiscount}% enregistrée pour "${editingPromoProduct.title}"`, 'success');
    setEditingPromoProduct(null);
  };

  // Save Banners & Promo Settings
  const handleSaveBannerSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...settings,
      announcementText: bannerSettings.announcementText,
      promoBannerActive: bannerSettings.promoBannerActive,
      promoBannerTitle: bannerSettings.promoBannerTitle,
      promoBannerSubtitle: bannerSettings.promoBannerSubtitle,
      freeShippingMinAmount: Number(bannerSettings.freeShippingMinAmount)
    });
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase());

    const matchesCat = productFilterCategory === 'all' || p.category === productFilterCategory;

    const isPromo = p.isFlashSale || (p.discountPercentage && p.discountPercentage > 0) || (p.compareAtPrice && p.compareAtPrice > p.price);
    const matchesPromo =
      productFilterPromo === 'all' ? true : productFilterPromo === 'on_sale' ? isPromo : !isPromo;

    return matchesSearch && matchesCat && matchesPromo;
  });

  return (
    <div className="space-y-6">
      
      {/* ========================================================== */}
      {/* TOP KPI CARDS                                              */}
      {/* ========================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Active Coupons */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
              Codes Promo Actifs
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900 font-mono">
                {activeCouponsCount}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                / {coupons.length} totaux
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
            <Tag className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Promo Products */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
              Produits en Promotion
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-rose-600 font-mono">
                {promoProductsCount}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                / {products.length} articles
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Avg Discount */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
              Remise Moyenne Active
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-600 font-mono">
                -{averageDiscount}%
              </span>
              <span className="text-xs text-slate-400 font-medium">
                sur le catalogue
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
            <Percent className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Flash Banner Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
              Bannière Flash Accueil
            </span>
            <div className="flex items-center gap-2 mt-1.5">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  bannerSettings.promoBannerActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
                }`}
              />
              <span className="text-sm font-black text-slate-800">
                {bannerSettings.promoBannerActive ? 'En Ligne (Active)' : 'Masquée'}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* ========================================================== */}
      {/* PROMO SUB-NAVIGATION                                       */}
      {/* ========================================================== */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-2">
        <button
          onClick={() => setPromoSubTab('coupons')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
            promoSubTab === 'coupons'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Codes Promo & Coupons ({coupons.length})</span>
        </button>

        <button
          onClick={() => setPromoSubTab('flash_products')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
            promoSubTab === 'flash_products'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Ventes Flash & Remises Produits ({promoProductsCount})</span>
        </button>

        <button
          onClick={() => setPromoSubTab('banners')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
            promoSubTab === 'banners'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Bannières & Messages Promotionnels</span>
        </button>
      </div>

      {/* ========================================================== */}
      {/* SUB-TAB 1: CODES PROMO & COUPONS                           */}
      {/* ========================================================== */}
      {promoSubTab === 'coupons' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-600" />
                <span>Gestion des Codes Promo & Réductions</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Créez des codes promotionnels pour vos campagnes WhatsApp, Facebook, TikTok ou offres de bienvenue.
              </p>
            </div>

            <button
              onClick={handleOpenCreateCoupon}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Code Promo</span>
            </button>
          </div>

          {/* List of Coupons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map((coupon) => (
              <div
                key={coupon.code}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                  coupon.isActive
                    ? 'bg-slate-50/60 border-slate-200 hover:border-blue-300 hover:shadow-md'
                    : 'bg-slate-100/60 border-slate-200 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-sm font-black font-mono tracking-wider text-slate-900 shadow-2xs">
                        {coupon.code}
                      </span>
                      <button
                        onClick={() => handleCopyCode(coupon.code)}
                        className="p-1 text-slate-400 hover:text-blue-600 hover:bg-white rounded transition-colors"
                        title="Copier le code"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => toggleCouponStatus(coupon.code)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                        coupon.isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-200 text-slate-600 border-slate-300'
                      }`}
                    >
                      {coupon.isActive ? 'Actif' : 'Inactif'}
                    </button>
                  </div>

                  <div className="space-y-1.5 mt-3">
                    <div className="text-base font-black text-slate-900 flex items-center gap-1.5">
                      <span className="text-blue-600">
                        {coupon.discountPercent
                          ? `-${coupon.discountPercent}% de réduction`
                          : `-${formatFCFA(coupon.fixedDiscount || 0)}`}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {coupon.description}
                    </p>

                    {coupon.minAmount ? (
                      <p className="text-[11px] text-slate-500 font-semibold">
                        🛒 Min. d'achat requis :{' '}
                        <strong className="text-slate-800">{formatFCFA(coupon.minAmount)}</strong>
                      </p>
                    ) : (
                      <p className="text-[11px] text-emerald-600 font-semibold">
                        ✓ Sans minimum d'achat
                      </p>
                    )}

                    {coupon.expiresAt && (
                      <p className="text-[11px] text-rose-600 font-semibold">
                        ⏳ Expire le : {coupon.expiresAt}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200/80">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Applicable au panier
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditCoupon(coupon)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
                      title="Modifier ce code"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => deleteCoupon(coupon.code)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-rose-200"
                      title="Supprimer ce code"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================== */}
      {/* SUB-TAB 2: VENTES FLASH & REMISES PRODUITS                 */}
      {/* ========================================================== */}
      {promoSubTab === 'flash_products' && (
        <div className="space-y-6">
          
          {/* BULK DISCOUNT CARD */}
          <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-900/40">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>Outil de Remise en Masse (Bulk Promo)</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Appliquer une réduction globale en 1 clic
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Appliquez instantanément un pourcentage de remise promotionnelle sur tous les articles d'une catégorie (ex: Téléphones, TV ou Climatiseurs). Les prix barrés et badges promo seront automatiquement calculés.
              </p>

              <div className="pt-2 flex flex-wrap items-end gap-3">
                {/* Category selector */}
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Catégorie Ciblée
                  </label>
                  <select
                    value={bulkCategory}
                    onChange={(e) => setBulkCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white font-medium focus:outline-none focus:border-rose-500"
                  >
                    <option value="all">🌟 Tous les produits du catalogue</option>
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Percentage selector */}
                <div className="w-36">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Remise (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="90"
                      value={bulkPercent}
                      onChange={(e) => setBulkPercent(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white font-mono font-bold focus:outline-none focus:border-rose-500 pl-8"
                    />
                    <Percent className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => applyBulkDiscount(bulkCategory, bulkPercent)}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2"
                >
                  <Flame className="w-4 h-4" />
                  <span>Appliquer -{bulkPercent}%</span>
                </button>

                {/* Reset Button */}
                <button
                  onClick={() => removeBulkDiscount(bulkCategory)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Réinitialiser</span>
                </button>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-400 font-semibold">Raccourcis :</span>
                {[5, 10, 15, 20, 25, 30].map((val) => (
                  <button
                    key={val}
                    onClick={() => setBulkPercent(val)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-colors ${
                      bulkPercent === val
                        ? 'bg-rose-500/30 border-rose-400 text-rose-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    -{val}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* INDIVIDUAL PRODUCTS LIST */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Contrôle Promo Article par Article
                </h3>
                <p className="text-xs text-slate-500">
                  Activez les ventes flash et ajustez les prix barrés pour chaque produit.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Search */}
                <div className="relative min-w-[200px]">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Rechercher un article..."
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>

                {/* Promo filter */}
                <select
                  value={productFilterPromo}
                  onChange={(e: any) => setProductFilterPromo(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="on_sale">🔥 En promo uniquement</option>
                  <option value="regular">Prix standard</option>
                </select>

                {/* Cat filter */}
                <select
                  value={productFilterCategory}
                  onChange={(e) => setProductFilterCategory(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium"
                >
                  <option value="all">Toutes catégories</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Produit</th>
                    <th className="py-3 px-4">Prix Normal</th>
                    <th className="py-3 px-4">Prix Promo Actuel</th>
                    <th className="py-3 px-4">Remise</th>
                    <th className="py-3 px-4">Statut Vente Flash</th>
                    <th className="py-3 px-4 text-right">Action Rapide</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product) => {
                    const isPromo =
                      product.isFlashSale ||
                      (product.discountPercentage && product.discountPercentage > 0) ||
                      (product.compareAtPrice && product.compareAtPrice > product.price);

                    return (
                      <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Title & Image */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                            />
                            <div>
                              <p className="font-bold text-slate-900 line-clamp-1 max-w-[220px]">
                                {product.title}
                              </p>
                              <span className="text-[10px] text-slate-400 font-mono">
                                SKU: {product.sku} | {product.brand}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Regular / Compare Price */}
                        <td className="py-3 px-4 font-mono font-medium text-slate-600">
                          {product.compareAtPrice && product.compareAtPrice > product.price ? (
                            <span className="line-through text-slate-400">
                              {formatFCFA(product.compareAtPrice)}
                            </span>
                          ) : (
                            formatFCFA(product.price)
                          )}
                        </td>

                        {/* Current Selling Price */}
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          <span className={isPromo ? 'text-rose-600 font-black' : ''}>
                            {formatFCFA(product.price)}
                          </span>
                        </td>

                        {/* Discount Badge */}
                        <td className="py-3 px-4">
                          {product.discountPercentage && product.discountPercentage > 0 ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-700">
                              -{product.discountPercentage}%
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">—</span>
                          )}
                        </td>

                        {/* Flash Sale Toggle */}
                        <td className="py-3 px-4">
                          <button
                            onClick={() => toggleProductFlashSale(product.id)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                              product.isFlashSale
                                ? 'bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <Flame
                              className={`w-3.5 h-3.5 ${
                                product.isFlashSale ? 'text-rose-600 fill-current' : 'text-slate-400'
                              }`}
                            />
                            <span>{product.isFlashSale ? 'En Vente Flash' : 'Standard'}</span>
                          </button>
                        </td>

                        {/* Action: Quick Edit */}
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleStartEditProductPromo(product)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                          >
                            Régler le Prix
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================== */}
      {/* SUB-TAB 3: BANNIÈRES & MESSAGES PROMOTIONNELS             */}
      {/* ========================================================== */}
      {promoSubTab === 'banners' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-600" />
              <span>Configuration des Bannières & Alertes Promo</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Personnalisez les textes de la barre d'annonce en haut du site et la section Ventes Flash de la page d'accueil.
            </p>
          </div>

          <form onSubmit={handleSaveBannerSettings} className="space-y-6 max-w-3xl">
            
            {/* Announcement Top Bar */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Bandeau d'Annonce Supérieur (Barre défilante en haut du site)
              </label>
              <textarea
                rows={2}
                value={bannerSettings.announcementText}
                onChange={(e) =>
                  setBannerSettings({ ...bannerSettings, announcementText: e.target.value })
                }
                className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 leading-relaxed font-medium"
                placeholder="Message visible tout en haut de la boutique..."
              />
              <p className="text-[11px] text-slate-400">
                Idéal pour annoncer la livraison gratuite, les offres spéciales du moment ou les facilités Wave / Orange Money.
              </p>
            </div>

            {/* Flash Sale Banner on Homepage */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-slate-900 block">
                    Bannière "Ventes Flash Sénégal" sur la page d'accueil
                  </span>
                  <span className="text-xs text-slate-500">
                    Affiche la grande section sombre avec compte à rebours 24h et bouton direct vers les promos.
                  </span>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bannerSettings.promoBannerActive}
                    onChange={(e) =>
                      setBannerSettings({
                        ...bannerSettings,
                        promoBannerActive: e.target.checked
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {bannerSettings.promoBannerActive && (
                <div className="space-y-4 pt-3 border-t border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Titre de la Bannière Flash
                    </label>
                    <input
                      type="text"
                      value={bannerSettings.promoBannerTitle}
                      onChange={(e) =>
                        setBannerSettings({
                          ...bannerSettings,
                          promoBannerTitle: e.target.value
                        })
                      }
                      className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 font-bold focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Sous-titre / Explication de l'offre
                    </label>
                    <textarea
                      rows={2}
                      value={bannerSettings.promoBannerSubtitle}
                      onChange={(e) =>
                        setBannerSettings({
                          ...bannerSettings,
                          promoBannerSubtitle: e.target.value
                        })
                      }
                      className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 font-medium focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Free shipping threshold */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Seuil de Livraison Gratuite (Montant Panier en FCFA)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="5000"
                  min="0"
                  value={bannerSettings.freeShippingMinAmount}
                  onChange={(e) =>
                    setBannerSettings({
                      ...bannerSettings,
                      freeShippingMinAmount: Number(e.target.value)
                    })
                  }
                  className="w-48 p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 font-mono font-bold focus:outline-none focus:border-blue-600"
                />
                <span className="text-xs font-bold text-slate-600">FCFA</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Actuellement : Livraison offerte automatiquement dès{' '}
                <strong className="text-slate-700 font-mono">
                  {formatFCFA(bannerSettings.freeShippingMinAmount)}
                </strong>{' '}
                d'achat.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer les paramètres de promotion</span>
              </button>
            </div>

          </form>

        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL: CREATE / EDIT COUPON                                */}
      {/* ========================================================== */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="bg-gradient-to-r from-blue-900 to-slate-900 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 text-blue-300 flex items-center justify-center">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black">
                    {editingCouponCode ? `Modifier le code ${editingCouponCode}` : 'Créer un Code Promo'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Réductions pour les clients de TOUBA MADIYINA
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCouponModal(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Code Promotionnel (Majuscules) *
                </label>
                <input
                  type="text"
                  required
                  value={couponForm.code}
                  onChange={(e) =>
                    setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })
                  }
                  placeholder="EX: RAMADAN20, WAVE10, BIENVENUE"
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 font-mono font-bold uppercase tracking-wider focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Type de Remise
                  </label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e: any) =>
                      setCouponForm({ ...couponForm, discountType: e.target.value })
                    }
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:outline-none focus:border-blue-600"
                  >
                    <option value="percent">Pourcentage (%)</option>
                    <option value="fixed">Montant Fixe (FCFA)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Valeur de la Remise *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={couponForm.discountValue}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, discountValue: Number(e.target.value) })
                    }
                    placeholder={couponForm.discountType === 'percent' ? 'ex: 10 (%)' : 'ex: 5000 (FCFA)'}
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 font-mono font-bold focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Montant Minimum d'Achat (FCFA)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={couponForm.minAmount}
                  onChange={(e) =>
                    setCouponForm({ ...couponForm, minAmount: Number(e.target.value) })
                  }
                  placeholder="0 pour aucun minimum"
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 font-mono focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description / Libellé Affiché au Panier
                </label>
                <input
                  type="text"
                  value={couponForm.description}
                  onChange={(e) =>
                    setCouponForm({ ...couponForm, description: e.target.value })
                  }
                  placeholder="ex: 10% de réduction immédiate dès 25 000 FCFA"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="couponIsActive"
                  checked={couponForm.isActive}
                  onChange={(e) =>
                    setCouponForm({ ...couponForm, isActive: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="couponIsActive" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Activer immédiatement ce code pour les clients
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md"
                >
                  {editingCouponCode ? 'Enregistrer les modifications' : 'Créer le Code'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL: QUICK PRODUCT PROMO PRICE ADJUSTMENT                */}
      {/* ========================================================== */}
      {editingPromoProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="bg-gradient-to-r from-rose-900 to-slate-900 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={editingPromoProduct.images[0]}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover border border-white/20"
                />
                <div>
                  <h3 className="text-sm font-black line-clamp-1">
                    {editingPromoProduct.title}
                  </h3>
                  <span className="text-[11px] text-rose-300 font-mono">
                    SKU: {editingPromoProduct.sku}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setEditingPromoProduct(null)}
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Prix Normal Original Barré (FCFA)
                </label>
                <input
                  type="number"
                  step="500"
                  value={quickComparePrice}
                  onChange={(e) => {
                    const comp = Number(e.target.value);
                    setQuickComparePrice(comp);
                    if (quickPromoPercent > 0) {
                      setQuickPromoPrice(Math.round(comp * (1 - quickPromoPercent / 100)));
                    }
                  }}
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 font-mono font-bold focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Prix Vente Promotionnelle (FCFA) *
                </label>
                <input
                  type="number"
                  step="500"
                  value={quickPromoPrice}
                  onChange={(e) => {
                    const pr = Number(e.target.value);
                    setQuickPromoPrice(pr);
                    if (quickComparePrice > 0) {
                      setQuickPromoPercent(Math.round(((quickComparePrice - pr) / quickComparePrice) * 100));
                    }
                  }}
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 font-mono font-black text-rose-600 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Calculated reduction banner */}
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs text-rose-800">
                <span className="font-bold">Remise calculée :</span>
                <span className="font-black font-mono text-sm text-rose-700">
                  {quickComparePrice > quickPromoPrice
                    ? `-${Math.round(((quickComparePrice - quickPromoPrice) / quickComparePrice) * 100)}%`
                    : 'Aucune remise'}
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPromoProduct(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleApplySingleProductPromo}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md"
                >
                  Appliquer la Promo
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Logo } from './Logo';
import { WaveLogo, OrangeMoneyLogo } from './PaymentLogos';
import {
  Search,
  ShoppingCart,
  Phone,
  Truck,
  ShieldCheck,
  Menu,
  X,
  SlidersHorizontal,
  Package,
  Settings,
  Sparkles,
  ArrowRight,
  ExternalLink,
  MapPin
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    settings,
    products,
    categories,
    cartCount,
    setIsCartDrawerOpen,
    setActiveView,
    activeView,
    searchQuery,
    setSearchQuery,
    selectedCategorySlug,
    setSelectedProductId,
    setSelectedCategorySlug,
    formatFCFA,
    setIsLocationModalOpen
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Filter search results dynamically
  const searchResults = searchQuery.trim() === ''
    ? []
    : products.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);

  // Close search suggestion popup on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    setActiveView('product-detail');
    setIsSearchFocused(false);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (slug: string) => {
    setSelectedCategorySlug(slug);
    setActiveView('shop');
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white text-xs font-semibold py-2 px-3 tracking-wide shadow-inner border-b border-blue-950/40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 overflow-x-auto whitespace-nowrap scrollbar-none">
            <span className="flex items-center gap-1.5 text-blue-200">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Livraison express à Dakar (2h-4h)</span>
            </span>
            <span className="hidden sm:inline text-blue-400">•</span>
            <span className="flex items-center gap-1.5 text-blue-200">
              <span className="text-blue-300">Paiement :</span>
              <WaveLogo size="xs" />
              <OrangeMoneyLogo size="xs" />
              <span className="text-emerald-300 font-bold">ou à la livraison</span>
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[11px] text-blue-200">
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="hover:text-white flex items-center gap-1 transition-colors text-amber-300 font-bold bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-md"
              title="Localisation de notre magasin à Dakar"
            >
              <MapPin className="w-3 h-3 text-amber-400" />
              <span>Magasin Dakar (Google Maps)</span>
            </button>
            <span className="text-blue-400 hidden sm:inline">|</span>
            <button
              onClick={() => {
                setActiveView('order-tracking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white flex items-center gap-1 transition-colors hidden sm:flex"
            >
              <Package className="w-3.5 h-3.5 text-amber-400" />
              <span className="underline decoration-blue-400 underline-offset-2">Suivre un colis</span>
            </button>
            <span className="text-blue-400">|</span>
            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white flex items-center gap-1 text-emerald-300 font-bold"
            >
              <span>WhatsApp : 77 536 34 37</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-3 md:gap-8">
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 rounded-xl text-slate-700 hover:text-blue-700 hover:bg-slate-100 md:hidden focus:outline-none"
              aria-label="Menu Mobile"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* BRAND LOGO */}
            <div
              onClick={() => {
                setActiveView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center cursor-pointer group shrink-0 py-1"
            >
              <Logo variant="full" size="md" className="group-hover:opacity-95 transition-opacity" />
            </div>

            {/* SMART SEARCH BAR */}
            <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-xl relative">
              <div className="w-full relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Que recherchez-vous ? (ex: Samsung S24, Climatiseur Inverter, Air Fryer...)"
                  className="w-full pl-11 pr-24 py-2.5 rounded-full border-2 border-slate-200 bg-slate-50/80 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3 pointer-events-none" />

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-20 top-2.5 p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => {
                    setActiveView('shop');
                    setIsSearchFocused(false);
                  }}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold transition-colors shadow-sm flex items-center gap-1"
                >
                  Chercher
                </button>
              </div>

              {/* SEARCH SUGGESTIONS DROPDOWN */}
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Résultats suggérés ({searchResults.length})</span>
                    <span className="text-blue-600 font-semibold cursor-pointer" onClick={() => setActiveView('shop')}>
                      Voir tout le catalogue &rarr;
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product.id)}
                        className="p-3 hover:bg-blue-50/60 cursor-pointer flex items-center gap-3 transition-colors"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{product.title}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-extrabold text-blue-700">{formatFCFA(product.price)}</span>
                            {product.compareAtPrice && (
                              <span className="text-[10px] text-slate-400 line-through">
                                {formatFCFA(product.compareAtPrice)}
                              </span>
                            )}
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-semibold">
                              En stock Dakar
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS & ICONS */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* WHATSAPP QUICK BUTTON */}
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Bonjour TOUBA MADIYINA ELECTRONIC, je souhaite des conseils pour mes achats.')}`}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold transition-all shadow-sm"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span>WhatsApp Dakar</span>
              </a>

              {/* CART DRAWER BUTTON */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/25 transition-all transform active:scale-95"
                aria-label="Voir le Panier"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:inline">Panier</span>
                <span className="min-w-[20px] h-5 px-1 rounded-full bg-white text-blue-800 text-xs font-black flex items-center justify-center">
                  {cartCount}
                </span>
              </button>
            </div>

          </div>

          {/* MOBILE SEARCH BAR (Visible on small screens) */}
          <div className="pb-3 md:hidden">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher Samsung, TV, Climatiseur..."
                className="w-full pl-10 pr-10 py-2.5 rounded-full border border-slate-300 bg-slate-50 text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* DESKTOP CATEGORY NAVIGATION MENU */}
          <nav className="hidden md:flex items-center justify-center gap-1 lg:gap-3 py-2.5 border-t border-slate-100 text-xs font-bold text-slate-700">
            <button
              onClick={() => {
                setActiveView('home');
                setSelectedCategorySlug(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeView === 'home' ? 'bg-blue-50 text-blue-700 font-extrabold' : 'hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              Accueil
            </button>

            <button
              onClick={() => {
                setActiveView('shop');
                setSelectedCategorySlug(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeView === 'shop' && !categories.some(c => c.slug === selectedCategorySlug && c.slug === 'promotions-flash')
                  ? 'bg-blue-50 text-blue-700 font-extrabold'
                  : 'hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              Boutique
            </button>

            <button
              onClick={() => handleSelectCategory('telephones-accessoires')}
              className="px-3 py-1.5 rounded-lg hover:text-blue-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              <span>📱</span> Téléphones
            </button>

            <button
              onClick={() => handleSelectCategory('electromenager')}
              className="px-3 py-1.5 rounded-lg hover:text-blue-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              <span>❄️</span> Électroménager
            </button>

            <button
              onClick={() => handleSelectCategory('tv-audio')}
              className="px-3 py-1.5 rounded-lg hover:text-blue-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              <span>📺</span> TV & Audio
            </button>

            <button
              onClick={() => handleSelectCategory('informatique')}
              className="px-3 py-1.5 rounded-lg hover:text-blue-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              <span>💻</span> Informatique
            </button>

            <button
              onClick={() => handleSelectCategory('promotions-flash')}
              className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors font-extrabold flex items-center gap-1 border border-rose-200"
            >
              <span>🔥</span> Promotions
            </button>

            <button
              onClick={() => {
                setActiveView('delivery');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-lg hover:text-blue-700 hover:bg-slate-50 transition-colors text-slate-600"
            >
              🚚 Livraison Dakar
            </button>

            <button
              onClick={() => {
                setActiveView('order-tracking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 font-bold ${
                activeView === 'order-tracking'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-amber-500" />
              <span>Suivi Colis</span>
            </button>
          </nav>
        </div>
      </header>

      {/* 3. MOBILE DRAWER NAVIGATION */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-4/5 max-w-sm h-full bg-white shadow-2xl flex flex-col p-6 overflow-y-auto animate-in slide-in-from-left duration-200">
            
            {/* Header in Drawer */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div
                onClick={() => {
                  setActiveView('home');
                  setIsMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cursor-pointer"
              >
                <Logo variant="full" size="sm" />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Links */}
            <div className="space-y-1 py-2 font-semibold text-slate-800 text-sm">
              <button
                onClick={() => {
                  setActiveView('home');
                  setIsMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 flex items-center gap-3"
              >
                <span>🏠</span> Accueil
              </button>

              <button
                onClick={() => {
                  setActiveView('shop');
                  setIsMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 flex items-center gap-3"
              >
                <span>🛍️</span> Toute la Boutique
              </button>

              <div className="pt-2 pb-1 px-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Catégories au Sénégal
              </div>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.slug)}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-50 text-xs font-semibold flex items-center justify-between text-slate-700"
                >
                  <span className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">({cat.itemCount})</span>
                </button>
              ))}

              <div className="pt-4 pb-1 px-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Services & Informations
              </div>

              <button
                onClick={() => {
                  setIsLocationModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-xs font-bold flex items-center gap-2 text-blue-900 border border-blue-200/60"
              >
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>Boutique Dakar (Google Maps)</span>
              </button>

              <button
                onClick={() => {
                  setActiveView('order-tracking');
                  setIsMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 text-xs font-semibold flex items-center gap-2 text-slate-700"
              >
                <Package className="w-4 h-4 text-amber-500" />
                Suivre mon colis
              </button>

              <button
                onClick={() => {
                  setActiveView('delivery');
                  setIsMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 text-xs font-semibold flex items-center gap-2 text-slate-700"
              >
                <Truck className="w-4 h-4 text-blue-500" />
                Tarifs de Livraison Dakar
              </button>

              <button
                onClick={() => {
                  setActiveView('articles');
                  setIsMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 text-xs font-semibold flex items-center gap-2 text-slate-700"
              >
                <Sparkles className="w-4 h-4 text-indigo-500" />
                Guides d'achat & Conseils
              </button>
            </div>

            {/* Direct Contact in Mobile Drawer */}
            <div className="mt-auto pt-6 border-t border-slate-100 space-y-3">
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md"
              >
                <span>Commander sur WhatsApp</span>
              </a>
              <div className="text-center text-[11px] text-slate-400">
                Service client : {settings.phone}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

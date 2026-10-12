import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import {
  SlidersHorizontal,
  Search,
  X,
  Filter,
  Check,
  ChevronDown,
  RotateCcw
} from 'lucide-react';

export const ShopCatalogPage: React.FC = () => {
  const {
    products,
    categories,
    selectedCategorySlug,
    setSelectedCategorySlug,
    searchQuery,
    setSearchQuery,
    formatFCFA
  } = useStore();

  // Filters State
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount'>('featured');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Available brands
  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.brand));
    return Array.from(set);
  }, [products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategorySlug === 'promotions-flash') {
          if (!p.isFlashSale && (!p.discountPercentage || p.discountPercentage <= 0)) return false;
        } else if (selectedCategorySlug && p.category !== selectedCategorySlug) {
          return false;
        }

        // Brand filter
        if (selectedBrand !== 'all' && p.brand !== selectedBrand) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          if (!matchTitle && !matchBrand && !matchCat && !matchSku) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'discount') return (b.discountPercentage || 0) - (a.discountPercentage || 0);
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategorySlug, selectedBrand, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategorySlug(null);
    setSelectedBrand('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Catalogue & Produits TOUBA MADIYINA
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Affichage de <strong className="text-slate-900 font-black">{filteredProducts.length}</strong> articles disponibles à Dakar.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="md:hidden px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-2 shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Filtres</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 shadow-sm">
              <span className="text-slate-400 font-normal">Trier :</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent focus:outline-none font-bold text-slate-900 cursor-pointer"
              >
                <option value="featured">Recommandés / Vedettes</option>
                <option value="price-asc">Prix croissant (FCFA)</option>
                <option value="price-desc">Prix décroissant (FCFA)</option>
                <option value="rating">Meilleures notes (★)</option>
                <option value="discount">Plus fortes promos (%)</option>
              </select>
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT: Sidebar (Filters) + Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* SIDEBAR FILTERS (Left 3 cols) */}
          <div className={`md:col-span-3 space-y-6 ${showMobileFilter ? 'block' : 'hidden md:block'}`}>
            
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-600" />
                  <span>Filtres de recherche</span>
                </span>
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-rose-600 font-bold hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Réinitialiser</span>
                </button>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  Catégories
                </label>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => setSelectedCategorySlug(null)}
                    className={`w-full text-left px-3 py-2 rounded-xl font-bold transition-colors flex items-center justify-between ${
                      selectedCategorySlug === null
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>Tous les rayons</span>
                    <span className="text-[10px] opacity-80">{products.length}</span>
                  </button>

                  {categories.map((cat) => {
                    const count = cat.slug === 'promotions-flash'
                      ? products.filter((p) => p.isFlashSale || (p.discountPercentage && p.discountPercentage > 0)).length
                      : products.filter((p) => p.category === cat.slug).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategorySlug(cat.slug)}
                        className={`w-full text-left px-3 py-2 rounded-xl font-bold transition-colors flex items-center justify-between ${
                          selectedCategorySlug === cat.slug
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate flex items-center gap-1.5">
                          <span>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </span>
                        <span className="text-[10px] opacity-80">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <label className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  Marques
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                >
                  <option value="all">Toutes les marques ({brands.length})</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

            </div>

          </div>

          {/* PRODUCTS GRID (Right 9 cols) */}
          <div className="md:col-span-9 space-y-6">
            
            {/* Active search filter badge tag */}
            {(searchQuery || selectedCategorySlug || selectedBrand !== 'all') && (
              <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200 text-xs">
                <span className="text-slate-400 font-semibold">Filtres actifs :</span>
                {searchQuery && (
                  <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-bold flex items-center gap-1">
                    Recherche : "{searchQuery}"
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                  </span>
                )}
                {selectedCategorySlug && (
                  <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-bold flex items-center gap-1 capitalize">
                    Rayon : {selectedCategorySlug.replace('-', ' ')}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategorySlug(null)} />
                  </span>
                )}
                {selectedBrand !== 'all' && (
                  <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-bold flex items-center gap-1">
                    Marque : {selectedBrand}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedBrand('all')} />
                  </span>
                )}
              </div>
            )}

            {/* Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-3xl">
                  🔍
                </div>
                <h3 className="text-base font-black text-slate-900">Aucun produit ne correspond à ces critères</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Essayez de modifier votre recherche ou de réinitialiser les filtres de prix et de catégorie.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-blue-700"
                >
                  Réinitialiser tous les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

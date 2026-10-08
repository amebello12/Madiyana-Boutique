import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Flame, Sparkles, ArrowRight } from 'lucide-react';

export const FeaturedProducts: React.FC = () => {
  const { products, setActiveView, setSelectedCategorySlug } = useStore();
  const [activeTab, setActiveTab] = useState<'all' | 'promos' | 'telephones' | 'electromenager' | 'tv'>('all');

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'promos') return p.isFlashSale || (p.discountPercentage && p.discountPercentage > 0);
    if (activeTab === 'telephones') return p.category === 'telephones-accessoires';
    if (activeTab === 'electromenager') return p.category === 'electromenager' || p.category === 'maison-cuisine';
    if (activeTab === 'tv') return p.category === 'tv-audio';
    return true;
  });

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-black uppercase tracking-wider mb-2 border border-rose-200">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Sélection Spéciale Dakar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              🔥 NOS PRODUITS VEDETTES
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Les articles les plus demandés au Sénégal, 100% authentiques avec garantie et livraison rapide.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Tous ({products.length})
            </button>

            <button
              onClick={() => setActiveTab('promos')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'promos'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              <span>🔥 En Promo</span>
            </button>

            <button
              onClick={() => setActiveTab('telephones')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'telephones'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              📱 Téléphones
            </button>

            <button
              onClick={() => setActiveTab('electromenager')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'electromenager'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              ❄️ Électroménager
            </button>

            <button
              onClick={() => setActiveTab('tv')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'tv'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              📺 TV & Audio
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom CTA to Shop */}
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setActiveView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-blue-700 text-white rounded-2xl text-sm font-black shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <span>Voir tout le catalogue TOUBA MADIYINA</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};

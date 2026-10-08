import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Flame } from 'lucide-react';

export const CategoriesGrid: React.FC = () => {
  const { categories, products, setSelectedCategorySlug, setActiveView } = useStore();

  const getCategoryCount = (slug: string) => {
    if (slug === 'promotions-flash') {
      return products.filter((p) => p.isFlashSale || (p.discountPercentage && p.discountPercentage > 0)).length;
    }
    return products.filter((p) => p.category === slug).length;
  };

  const handleCategoryClick = (slug: string) => {
    setSelectedCategorySlug(slug);
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-12 md:py-16 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center gap-2 text-blue-700 font-extrabold text-xs uppercase tracking-wider">
              <span>Rayons & Collections</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Explorez par Catégorie
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Tous nos univers électroniques et électroménagers disponibles immédiatement à Dakar.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setActiveView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 group"
          >
            <span>Voir tout le catalogue</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {categories.map((cat) => {
            const isPromo = cat.slug === 'promotions-flash';
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${
                  isPromo
                    ? 'border-rose-300 bg-gradient-to-b from-rose-500 to-rose-700 text-white shadow-rose-200'
                    : 'border-slate-200 bg-white hover:border-blue-400 shadow-sm'
                }`}
              >
                {/* Image Aspect Box */}
                <div className="h-32 sm:h-44 w-full relative overflow-hidden bg-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div
                    className={`absolute inset-0 ${
                      isPromo
                        ? 'bg-gradient-to-t from-rose-950/80 via-transparent to-transparent'
                        : 'bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent'
                    }`}
                  />
                  
                  {/* Category Emoji Badge */}
                  <div className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-lg">
                    {cat.icon}
                  </div>

                  {isPromo && (
                    <div className="absolute top-3 right-3 bg-white text-rose-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                      <Flame className="w-3 h-3 text-rose-600 fill-current" />
                      <span>Jusqu'à -45%</span>
                    </div>
                  )}

                  {/* Title and Count on Bottom of image */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-extrabold text-sm sm:text-base leading-snug drop-shadow-sm">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-slate-200 mt-0.5 flex items-center justify-between font-medium">
                      <span>{getCategoryCount(cat.slug)} articles</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-xs font-bold text-blue-300">
                        Découvrir &rarr;
                      </span>
                    </p>
                  </div>
                </div>

                {/* Sub Description */}
                <div className="p-3 bg-white border-t border-slate-100">
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {cat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

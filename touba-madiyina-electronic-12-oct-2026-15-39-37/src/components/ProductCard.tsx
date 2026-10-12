import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Star, ShoppingCart, Zap, Eye, Check, MessageCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    formatFCFA,
    addToCart,
    quickBuyProduct,
    quickWhatsAppOrder,
    setSelectedProductId,
    setActiveView
  } = useStore();

  const handleCardClick = () => {
    setSelectedProductId(product.id);
    setActiveView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* 1. IMAGE CONTAINER */}
      <div 
        onClick={handleCardClick}
        className="relative h-44 sm:h-56 w-full bg-slate-50 overflow-hidden cursor-pointer flex items-center justify-center p-3"
      >
        {/* Main Image */}
        <img
          src={product.images[0]}
          alt={product.title}
          className={`max-h-full max-w-full object-contain transition-all duration-500 ${
            product.images[1] ? 'group-hover:opacity-0 group-hover:scale-95' : 'group-hover:scale-105'
          }`}
          loading="lazy"
        />

        {/* Secondary Image on Hover (if available) */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.title} - angle 2`}
            className="absolute max-h-[85%] max-w-[85%] object-contain opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
            loading="lazy"
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.discountPercentage && product.discountPercentage > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-black text-[10px] sm:text-xs shadow-sm uppercase">
              -{product.discountPercentage}% PROMO
            </span>
          )}
          {product.isFeatured && (
            <span className="px-2 py-0.5 rounded-md bg-blue-700 text-white font-bold text-[10px] shadow-sm uppercase">
              Vedette
            </span>
          )}
        </div>

        {/* Stock status badge & photos count */}
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
          {product.images.length > 1 && (
            <span className="px-1.5 py-0.5 rounded-md bg-slate-900/60 backdrop-blur-xs text-white font-bold text-[9px]">
              {product.images.length} photos
            </span>
          )}
          {product.inStock ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              En stock
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-bold text-[10px]">
              Épuisé
            </span>
          )}
        </div>

        {/* Quick View Overlay button on hover */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="px-3 py-1.5 rounded-xl bg-white text-slate-800 font-bold text-xs shadow-lg flex items-center gap-1 hover:bg-slate-50 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Détails</span>
          </button>
        </div>
      </div>

      {/* 2. CARD CONTENT */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        
        <div className="space-y-1.5">
          {/* Brand & SKU */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
            <span className="text-blue-700 uppercase tracking-wider font-extrabold">{product.brand}</span>
            <span className="text-[10px] font-mono">{product.sku}</span>
          </div>

          {/* Title */}
          <h3
            onClick={handleCardClick}
            className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 hover:text-blue-700 cursor-pointer transition-colors leading-snug"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs text-amber-500">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-slate-200 text-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="font-extrabold text-slate-800 text-[11px]">{product.rating}</span>
            <span className="text-[10px] text-slate-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-base sm:text-lg font-black text-slate-950">
              {formatFCFA(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-slate-400 line-through font-medium">
                {formatFCFA(product.compareAtPrice)}
              </span>
            )}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
            🚚 Livraison Dakar en 2h à 4h
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Add to Cart */}
          <button
            onClick={() => addToCart(product, 1)}
            className="w-full py-2.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
            title="Ajouter au panier"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-slate-600" />
            <span className="truncate">Panier</span>
          </button>

          {/* Buy Now Direct */}
          <button
            onClick={() => quickBuyProduct(product)}
            className="w-full py-2.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-sm transition-all flex items-center justify-center gap-1 active:scale-95"
            title="Commander immédiatement"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="truncate">Acheter</span>
          </button>
        </div>

        {/* Direct WhatsApp button on card */}
        <button
          onClick={() => quickWhatsAppOrder(product)}
          className="w-full py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
        >
          <MessageCircle className="w-3 h-3 text-emerald-600" />
          <span>Commander sur WhatsApp</span>
        </button>

      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { WaveLogo, OrangeMoneyLogo } from './PaymentLogos';
import {
  Star,
  ShoppingCart,
  Zap,
  MessageCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle,
  Clock,
  Share2,
  Heart,
  ChevronRight,
  ChevronLeft,
  UserCheck,
  Send
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    products,
    selectedProductId,
    addToCart,
    quickBuyProduct,
    quickWhatsAppOrder,
    formatFCFA,
    setActiveView,
    setSelectedCategorySlug,
    addReview,
    getProductReviews,
    addToast,
    settings
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'delivery' | 'warranty' | 'reviews'>('description');

  // Review Form state
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerCity, setReviewerCity] = useState('Dakar');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState('');

  const productReviews = getProductReviews(product.id);

  // Related products from same category or random
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.isFeatured))
    .slice(0, 4);

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerComment.trim()) {
      addToast('Veuillez renseigner votre nom et votre avis', 'warning');
      return;
    }
    addReview({
      productId: product.id,
      author: reviewerName.trim(),
      city: reviewerCity,
      rating: reviewerRating,
      comment: reviewerComment.trim(),
      verifiedBuyer: true
    });
    setReviewerName('');
    setReviewerComment('');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Découvrez ${product.title} chez TOUBA MADIYINA ELECTRONIC au prix de ${formatFCFA(product.price)} !`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Lien du produit copié dans le presse-papiers !', 'info');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-6 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 overflow-x-auto whitespace-nowrap">
          <button onClick={() => setActiveView('home')} className="hover:text-blue-600">Accueil</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => { setSelectedCategorySlug(null); setActiveView('shop'); }} className="hover:text-blue-600">Boutique</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => { setSelectedCategorySlug(product.category); setActiveView('shop'); }} className="hover:text-blue-600 capitalize">
            {product.category.replace('-', ' ')}
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-bold truncate max-w-xs">{product.title}</span>
        </nav>

        {/* MAIN PRODUCT BOX */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-8 lg:p-10 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* 1. PRODUCT GALLERY (Left 6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              {/* Main Image Box */}
              <div className="relative h-72 sm:h-96 md:h-[420px] rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center p-4 group">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain transition-all duration-300 select-none"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {product.discountPercentage && (
                    <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-black text-xs shadow-md">
                      -{product.discountPercentage}% PROMO
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-lg bg-blue-700 text-white font-bold text-xs shadow-md">
                    Garantie Officielle
                  </span>
                </div>

                {/* Top Right Controls: Share + Photo Counter */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  {product.images.length > 1 && (
                    <span className="px-2.5 py-1 rounded-xl bg-slate-900/75 backdrop-blur-sm text-white font-extrabold text-xs shadow-md">
                      {activeImageIndex + 1} / {product.images.length}
                    </span>
                  )}
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-xl bg-white/90 text-slate-700 hover:text-blue-600 shadow-md transition-colors"
                    title="Partager"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Prev / Next Navigation Arrows (when multiple photos) */}
                {product.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg border border-slate-200 transition-all opacity-80 group-hover:opacity-100 hover:scale-105"
                      title="Photo précédente"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg border border-slate-200 transition-all opacity-80 group-hover:opacity-100 hover:scale-105"
                      title="Photo suivante"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails (2 à 4 photos) */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-20 rounded-xl bg-slate-50 border-2 overflow-hidden shrink-0 transition-all p-1 ${
                        activeImageIndex === idx
                          ? 'border-blue-600 shadow-md ring-2 ring-blue-200 scale-105'
                          : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300'
                      }`}
                    >
                      <img src={img} alt={`Aperçu ${idx + 1}`} className="w-full h-full object-contain" />
                      <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-slate-900/70 text-white text-[9px] font-bold">
                        #{idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Dakar Quick Highlights */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-blue-950">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Livraison disponible aujourd'hui à Dakar</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Commandez maintenant et recevez votre colis sous 2h à 4h à Plateau, Almadies, Mermoz, Maristes, Parcelles et Banlieue.
                </p>
              </div>
            </div>

            {/* 2. PRODUCT DETAILS & ACTIONS (Right 6 cols) */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                {/* Brand & Reference */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-blue-700 px-2.5 py-1 rounded bg-blue-50">
                    {product.brand}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Réf : {product.sku}
                  </span>
                </div>

                {/* Product Title */}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-950 leading-tight">
                  {product.title}
                </h1>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-black text-slate-800">{product.rating} / 5</span>
                  <span className="text-slate-400">•</span>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="text-blue-600 hover:underline text-xs font-semibold"
                  >
                    {product.reviewCount} avis vérifiés à Dakar
                  </button>
                </div>

                {/* Pricing Block */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-2xl sm:text-3xl font-black text-slate-950">
                      {formatFCFA(product.price)}
                    </span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="text-base text-slate-400 line-through font-bold">
                        {formatFCFA(product.compareAtPrice)}
                      </span>
                    )}
                    {product.discountPercentage && (
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-extrabold text-xs">
                        Économisez {formatFCFA(product.compareAtPrice! - product.price)}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">
                    Prix TTC en Francs CFA (XOF) • Facture et garantie incluses
                  </div>
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2">
                  {product.inStock !== false ? (
                    <>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-xs font-bold text-emerald-700">
                        En stock disponible en magasin à Dakar
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      <span className="text-xs font-bold text-rose-700">
                        Rupture de stock temporaire
                      </span>
                    </>
                  )}
                </div>

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {product.description}
                </p>

                {/* Key Bullet Features */}
                <ul className="space-y-1.5 pt-1 text-xs text-slate-700">
                  {product.features.slice(0, 3).map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ACTIONS AREA */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                
                {/* Quantity selector */}
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-700">Quantité :</span>
                  <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-200 font-bold transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 font-black text-xs text-slate-900 min-w-[36px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(99, quantity + 1))}
                      className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-200 font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs font-black text-slate-900">
                    Total : {formatFCFA(product.price * quantity)}
                  </span>
                </div>

                {/* CTA Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* BUY NOW */}
                  <button
                    onClick={() => {
                      addToCart(product, quantity);
                      setActiveView('checkout');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 transform active:scale-95"
                  >
                    <Zap className="w-4 h-4" />
                    <span>ACHETER MAINTENANT</span>
                  </button>

                  {/* ADD TO CART */}
                  <button
                    onClick={() => addToCart(product, quantity)}
                    className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 transform active:scale-95"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>AJOUTER AU PANIER</span>
                  </button>
                </div>

                {/* WHATSAPP DIRECT ORDER */}
                <button
                  onClick={() => quickWhatsAppOrder(product)}
                  className="w-full py-3.5 px-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 transform active:scale-95"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Commander sur WhatsApp (Conseiller en direct)</span>
                </button>

                {/* Payment Badges under CTAs */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <WaveLogo size="xs" />
                    <OrangeMoneyLogo size="xs" />
                  </div>
                  <span className="flex items-center gap-1 text-slate-600 font-medium">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>À la livraison</span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-600 font-medium">
                    <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                    <span>Garantie 7j</span>
                  </span>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* 3. PRODUCT INFORMATION TABS */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-12">
          
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none mb-6">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                activeTab === 'description'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Description Complète
            </button>

            <button
              onClick={() => setActiveTab('specs')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                activeTab === 'specs'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Fiche Technique
            </button>

            <button
              onClick={() => setActiveTab('delivery')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                activeTab === 'delivery'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              🚚 Livraison Sénégal
            </button>

            <button
              onClick={() => setActiveTab('warranty')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                activeTab === 'warranty'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Garantie & Retours
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'reviews'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>Avis Clients ({productReviews.length})</span>
            </button>
          </div>

          {/* TAB 1: DESCRIPTION */}
          {activeTab === 'description' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Présentation détaillée de {product.title}
              </h3>
              <p>{product.description}</p>
              <div className="pt-3 space-y-2">
                <h4 className="font-bold text-slate-900">Points forts du produit :</h4>
                <ul className="space-y-1.5 list-disc pl-5">
                  {product.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: SPECS TABLE */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Caractéristiques Techniques
              </h3>
              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200 text-xs sm:text-sm">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="grid grid-cols-1 sm:grid-cols-3 p-3 sm:p-4 hover:bg-slate-50">
                    <span className="font-bold text-slate-900">{key}</span>
                    <span className="sm:col-span-2 text-slate-600">{val}</span>
                  </div>
                ))}
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3 sm:p-4 hover:bg-slate-50">
                  <span className="font-bold text-slate-900">Garantie</span>
                  <span className="sm:col-span-2 text-emerald-700 font-bold">{product.warranty || 'Garantie 12 Mois'}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DELIVERY DETAILS */}
          {activeTab === 'delivery' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Tarifs et Délais de Livraison à Dakar et au Sénégal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2">
                  <div className="font-black text-blue-900">Dakar Centre & Plateau</div>
                  <div className="text-xl font-extrabold text-blue-700">1 500 FCFA</div>
                  <p className="text-xs text-slate-600">Délai : 2h à 4h chrono. Gratuit dès 150 000 FCFA d'achat.</p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <div className="font-black text-emerald-900">Banlieue (Pikine, Guédiawaye, Keur Massar)</div>
                  <div className="text-xl font-extrabold text-emerald-700">2 000 FCFA</div>
                  <p className="text-xs text-slate-600">Délai : Le jour même ou sous 24h.</p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2">
                  <div className="font-black text-indigo-900">Régions (Touba, Thiès, St-Louis, etc.)</div>
                  <div className="text-xl font-extrabold text-indigo-700">3 500 - 4 500 FCFA</div>
                  <p className="text-xs text-slate-600">Expédition sécurisée sous 24h à 48h via GP Express.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WARRANTY */}
          {activeTab === 'warranty' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Conditions de Garantie & Retour
              </h3>
              <p>
                Tous nos articles électroniques et électroménagers bénéficient d'une garantie constructeur officielle avec SAV basé à Dakar.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Satisfait ou remboursé sous 7 jours</strong> : Échange immédiat si le produit présente une anomalie.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Facture normalisée délivrée</strong> : Conservez votre reçu pour faire valoir votre garantie au magasin.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Avis des Clients ({productReviews.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Avis authentiques de clients livrés à Dakar et dans les régions.
                  </p>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {productReviews.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">Aucun avis pour le moment. Soyez le premier à donner votre avis !</p>
                ) : (
                  productReviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-slate-900">{rev.author}</span>
                          {rev.verifiedBuyer && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                              <UserCheck className="w-3 h-3" />
                              Acheteur Vérifié
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">{rev.date}</span>
                      </div>

                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'
                            }`}
                          />
                        ))}
                        {rev.city && <span className="text-[11px] text-slate-500 ml-2 font-medium">📍 {rev.city}</span>}
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Submit Review Form */}
              <form onSubmit={handleAddReviewSubmit} className="p-6 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-4">
                <h4 className="font-extrabold text-sm text-slate-900">
                  Laisser un avis sur ce produit
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Votre Prénom & Nom</label>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="Ex: Babacar Diagne"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Votre Ville / Quartier</label>
                    <input
                      type="text"
                      value={reviewerCity}
                      onChange={(e) => setReviewerCity(e.target.value)}
                      placeholder="Ex: Dakar (Point E)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Votre Note</label>
                    <select
                      value={reviewerRating}
                      onChange={(e) => setReviewerRating(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-bold"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5/5) Excellent</option>
                      <option value={4}>⭐⭐⭐⭐ (4/5) Très Bon</option>
                      <option value={3}>⭐⭐⭐ (3/5) Moyen</option>
                      <option value={2}>⭐⭐ (2/5) Décevant</option>
                      <option value={1}>⭐ (1/5) Mauvais</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Votre Commentaire</label>
                  <textarea
                    value={reviewerComment}
                    onChange={(e) => setReviewerComment(e.target.value)}
                    placeholder="Partagez votre expérience sur la qualité, la livraison et le service..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publier mon avis</span>
                </button>
              </form>

            </div>
          )}

        </div>

        {/* 4. YOU MIGHT ALSO LIKE (Cross-selling) */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Vous pourriez aussi aimer
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

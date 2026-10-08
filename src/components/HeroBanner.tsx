import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Truck, CheckCircle2, MessageCircle } from 'lucide-react';
import { WaveLogo, OrangeMoneyLogo } from './PaymentLogos';

export const HeroBanner: React.FC = () => {
  const { setActiveView, setSelectedCategorySlug, setSelectedProductId, settings } = useStore();

  const handleHeroShopNow = () => {
    setSelectedCategorySlug(null);
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeroPromos = () => {
    setSelectedCategorySlug('promotions-flash');
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white py-12 md:py-20 lg:py-24">
      {/* Background Decorative Mesh Pattern */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Senegal Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs md:text-sm font-semibold backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>🇸🇳 Boutique High-Tech N°1 & Maison à Dakar</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
              Les bons produits <br />
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
                au bon prix.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Découvrez nos produits tendance et profitez de nos meilleures offres au Sénégal. Téléphones, TV, Climatiseurs , Sonorisation, Electronique et Électroménager livrés directement chez vous.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={handleHeroShopNow}
                className="px-7 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base flex items-center gap-2.5 tracking-wide"
              >
                <span>ACHETER MAINTENANT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleHeroPromos}
                className="px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-2xl backdrop-blur-sm transition-all text-sm sm:text-base flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>VOIR LES PROMOTIONS</span>
              </button>

              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Bonjour TOUBA MADIYINA ELECTRONIC, je souhaite voir vos offres du jour à Dakar.')}`}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-4 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold rounded-2xl text-sm transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Express</span>
              </a>
            </div>

            {/* Trust Metric Counters */}
            <div className="pt-6 grid grid-cols-3 gap-3 sm:gap-6 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0 text-center">
              <div className="p-2 sm:p-3 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-xl sm:text-2xl font-black text-blue-400">+5 000</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Clients à Dakar</div>
              </div>
              <div className="p-2 sm:p-3 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-xl sm:text-2xl font-black text-emerald-400">2h à 4h</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Livraison Express</div>
              </div>
              <div className="p-2 sm:p-3 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-xl sm:text-2xl font-black text-amber-400">100%</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Garantie & SAV</div>
              </div>
            </div>

          </div>

          {/* RIGHT FEATURED VISUAL CARD */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-slate-900 group">
              <img
                src="https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=900&auto=format&fit=crop&q=80"
                alt="TOUBA MADIYINA ELECTRONIC Flagship"
                className="w-full h-[360px] sm:h-[420px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Floating Top Tag */}
              <div className="absolute top-4 left-4 bg-blue-600 text-white font-extrabold text-xs uppercase px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nouveauté 2026</span>
              </div>

              {/* Bottom Card Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">
                    Samsung Galaxy S24 Ultra
                  </span>
                  <span className="text-xs font-black text-emerald-400">En stock à Dakar</span>
                </div>
                <div className="text-white font-bold text-sm line-clamp-1">
                  Galaxy AI, Écran 6.8" 120Hz & 512 Go
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                  <div>
                    <span className="text-xs text-slate-400">Prix spécial : </span>
                    <span className="text-sm font-extrabold text-white">685 000 FCFA</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedProductId('prod-samsung-s24-ultra');
                      setActiveView('product-detail');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Voir l'offre
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Trust Pills */}
            <div className="absolute -bottom-4 -left-4 sm:left-2 bg-white text-slate-900 px-3.5 py-2 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-2 text-xs font-bold hidden sm:flex">
              <div className="flex items-center gap-1.5">
                <WaveLogo size="xs" />
                <OrangeMoneyLogo size="xs" />
              </div>
              <span className="text-slate-800">100% Sécurisé</span>
            </div>
            <div className="absolute -top-3 -right-3 bg-emerald-500 text-white px-3 py-1.5 rounded-2xl shadow-xl flex items-center gap-1.5 text-xs font-black hidden sm:flex">
              <Truck className="w-4 h-4" />
              <span>Dakar 24h</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

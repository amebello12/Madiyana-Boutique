import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Flame, ArrowRight, Zap, Clock } from 'lucide-react';

export const FlashSaleBanner: React.FC = () => {
  const { setActiveView, setSelectedCategorySlug, settings } = useStore();

  // If merchant disabled the flash promo banner in Admin, do not render
  if (settings.promoBannerActive === false) {
    return null;
  }

  // Real-time countdown
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 18
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 24, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDiscoverPromos = () => {
    setSelectedCategorySlug('promotions-flash');
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-10 md:py-16 bg-slate-950 text-white relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-900 border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left Text */}
          <div className="space-y-3 text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-extrabold text-xs uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-rose-400 fill-current animate-bounce" />
              <span>Ventes Flash Sénégal</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              {settings.promoBannerTitle || '🔥 GRANDES PROMOTIONS'}
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {settings.promoBannerSubtitle || "Profitez de nos offres exceptionnelles avant la fin du stock disponible à Dakar. Jusqu'à -45% sur les smartphones, TV et climatiseurs."}
            </p>
          </div>

          {/* Right Countdown & Button */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            
            {/* Timer boxes */}
            <div className="flex items-center gap-2 sm:gap-3 text-center">
              <div className="bg-slate-800/90 border border-slate-700/80 px-3.5 sm:px-4 py-3 rounded-2xl min-w-[65px] sm:min-w-[75px] shadow-lg">
                <span className="block text-2xl sm:text-3xl font-black text-blue-400 font-mono">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-wider">Heures</span>
              </div>

              <span className="text-xl font-bold text-slate-500">:</span>

              <div className="bg-slate-800/90 border border-slate-700/80 px-3.5 sm:px-4 py-3 rounded-2xl min-w-[65px] sm:min-w-[75px] shadow-lg">
                <span className="block text-2xl sm:text-3xl font-black text-blue-400 font-mono">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-wider">Minutes</span>
              </div>

              <span className="text-xl font-bold text-slate-500">:</span>

              <div className="bg-slate-800/90 border border-slate-700/80 px-3.5 sm:px-4 py-3 rounded-2xl min-w-[65px] sm:min-w-[75px] shadow-lg">
                <span className="block text-2xl sm:text-3xl font-black text-rose-400 font-mono animate-pulse">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-wider">Secondes</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleDiscoverPromos}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base flex items-center gap-2 whitespace-nowrap"
            >
              <span>DÉCOUVRIR LES OFFRES</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </section>
  );
};

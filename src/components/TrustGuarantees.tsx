import React from 'react';
import { Truck, CreditCard, ShieldCheck, CheckCircle, Clock, Award, MapPin, Navigation, Building2 } from 'lucide-react';
import { WaveLogo, OrangeMoneyLogo, FreeMoneyLogo, CashDeliveryBadge } from './PaymentLogos';
import { useStore } from '../context/StoreContext';

export const TrustGuarantees: React.FC = () => {
  const { settings, setIsLocationModalOpen } = useStore();

  return (
    <section className="py-12 md:py-16 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h3 className="text-xs font-black uppercase tracking-widest text-blue-700">
            Pourquoi Choisir TOUBA MADIYINA ?
          </h3>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Vos Garanties de Confiance au Sénégal
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Un service pensé sur-mesure pour les acheteurs de Dakar et de toutes les régions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Item 1: Livraison rapide */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-blue-300 hover:shadow-md transition-all space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-100/80 text-blue-700 flex items-center justify-center text-2xl shadow-inner">
              🚚
            </div>
            <h4 className="font-extrabold text-slate-900 text-base">Livraison rapide</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Livraison à Dakar (en 2h à 4h) et expédition sécurisée partout au Sénégal (24h-48h).
            </p>
            <div className="text-[11px] font-bold text-blue-700 pt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Dakar, Banlieue & Régions</span>
            </div>
          </div>

          {/* Item 2: Paiement sécurisé */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-emerald-300 hover:shadow-md transition-all space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center text-2xl shadow-inner">
              💳
            </div>
            <h4 className="font-extrabold text-slate-900 text-base">Paiement sécurisé</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Wave, Orange Money et paiement en espèces à la livraison. Zéro risque pour l'acheteur.
            </p>
            <div className="flex items-center gap-1.5 pt-1 flex-wrap">
              <WaveLogo size="xs" />
              <OrangeMoneyLogo size="xs" />
              <FreeMoneyLogo size="xs" />
            </div>
          </div>

          {/* Item 3: Achat sécurisé */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-indigo-300 hover:shadow-md transition-all space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100/80 text-indigo-700 flex items-center justify-center text-2xl shadow-inner">
              🔒
            </div>
            <h4 className="font-extrabold text-slate-900 text-base">Achat 100% sécurisé</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vos informations personnelles sont protégées. Service client joignable 7j/7 sur WhatsApp.
            </p>
            <div className="text-[11px] font-bold text-indigo-700 pt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Assistance client réactive</span>
            </div>
          </div>

          {/* Item 4: Produits vérifiés */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-amber-300 hover:shadow-md transition-all space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-100/80 text-amber-700 flex items-center justify-center text-2xl shadow-inner">
              ✅
            </div>
            <h4 className="font-extrabold text-slate-900 text-base">Produits vérifiés</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nous sélectionnons uniquement des produits neufs, scellés avec garantie constructeur de 6 à 24 mois.
            </p>
            <div className="text-[11px] font-bold text-amber-700 pt-1 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>SAV & Garantie à Dakar</span>
            </div>
          </div>

        </div>

        {/* SHOWROOM & GOOGLE MAPS CARD */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl border border-blue-900/40">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block mb-0.5">
                Boutique Physique & Retrait Express
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white">
                Venez découvrir nos produits au showroom de Dakar
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl flex items-center gap-1.5 flex-wrap">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{settings.address}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="w-full md:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105"
            >
              <Navigation className="w-4 h-4 text-amber-300" />
              <span>Voir sur Google Maps</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

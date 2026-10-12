import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  User,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { Order } from '../types';

export const OrderTracking: React.FC = () => {
  const { findOrderByReferenceOrPhone, formatFCFA, settings, addToast, setActiveView } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      addToast('Entrez un numéro de commande (ex: TME-2026-8942) ou un numéro de téléphone (+221...)', 'warning');
      return;
    }
    const found = findOrderByReferenceOrPhone(searchQuery);
    if (found) {
      setSelectedOrder(found);
      addToast(`Commande ${found.orderNumber} trouvée !`, 'success');
    } else {
      addToast('Aucune commande trouvée pour cette référence. Vérifiez votre numéro.', 'error');
    }
  };

  const getStepProgress = (status: Order['orderStatus']) => {
    switch (status) {
      case 'en_attente':
        return { percentage: 25, label: 'En attente de validation', step: 1 };
      case 'confirmee':
        return { percentage: 50, label: 'En préparation à l\'entrepôt', step: 2 };
      case 'en_livraison':
        return { percentage: 75, label: 'En cours de livraison express', step: 3 };
      case 'livree':
        return { percentage: 100, label: 'Commande livrée avec succès', step: 4 };
      case 'annulee':
        return { percentage: 0, label: 'Commande annulée', step: 0 };
      default:
        return { percentage: 25, label: 'Enregistrée', step: 1 };
    }
  };

  const currentProgress = selectedOrder ? getStepProgress(selectedOrder.orderStatus) : null;

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-bold border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Suivi Sécurisé de Commande Dakar</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Suivi de Votre Colis en Temps Réel
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Entrez votre référence de commande ou votre numéro de téléphone pour consulter l'état d'acheminement et la livraison à Dakar.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par N° de commande (ex: TME-2026-8942) ou Téléphone"
              className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-slate-200 bg-white text-xs sm:text-sm text-slate-900 font-bold focus:border-blue-600 focus:outline-none shadow-xs"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs sm:text-sm font-black shadow-md transition-all whitespace-nowrap"
          >
            Vérifier
          </button>
        </form>

        {/* Result Card: DÉROULEMENT COMPLET DE LA COMMANDE */}
        {selectedOrder ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8 animate-in fade-in duration-200">
            
            {/* 1. Header Metadata & Live Status */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-black text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg">
                    {selectedOrder.orderNumber}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    N° Suivi : {selectedOrder.trackingNumber || selectedOrder.orderNumber}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 pt-1">
                  Client : {selectedOrder.customer.fullName}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
                  <span>📅 Passée le {isNaN(Date.parse(selectedOrder.date)) ? selectedOrder.date : new Date(selectedOrder.date).toLocaleString('fr-FR')}</span>
                  <span>•</span>
                  <span>📍 {selectedOrder.customer.region} ({selectedOrder.customer.district || 'Dakar'})</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left md:text-right space-y-1 min-w-[200px]">
                <span className="text-[11px] text-slate-400 font-bold block uppercase tracking-wider">Montant total TTC</span>
                <span className="text-2xl font-black text-blue-900 block">{formatFCFA(selectedOrder.total)}</span>
                <div className="flex items-center md:justify-end gap-1.5 text-xs font-extrabold text-emerald-700">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span className="capitalize">{selectedOrder.paymentMethod}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                    {selectedOrder.paymentStatus === 'paid' ? 'Payé' : 'À la livraison'}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. PROGRESS BAR & DÉROULEMENT VISUEL */}
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-black text-base text-slate-900 flex items-center gap-2">
                    <span>Déroulement du Traitement & Livraison</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                      {currentProgress?.label}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Mise à jour automatique en temps réel à chaque étape du colis.
                  </p>
                </div>
                <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-xl self-start sm:self-auto">
                  Progression : {currentProgress?.percentage}%
                </span>
              </div>

              {/* Progress Track */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${currentProgress?.percentage || 0}%` }}
                ></div>
              </div>

              {/* 4 STAGES STEPPER */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                
                {/* Étape 1 : Commande Reçue */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  (currentProgress?.step || 0) >= 1
                    ? 'bg-blue-50/80 border-blue-200 text-blue-950 ring-1 ring-blue-200'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                      (currentProgress?.step || 0) > 1
                        ? 'bg-emerald-500 text-white'
                        : (currentProgress?.step || 0) === 1
                        ? 'bg-blue-600 text-white animate-pulse'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {(currentProgress?.step || 0) > 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
                    </div>
                    <span className="text-xs font-black">1. Reçue & Validée</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Commande enregistrée dans notre système central à Dakar.
                  </p>
                </div>

                {/* Étape 2 : Préparation */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  (currentProgress?.step || 0) >= 2
                    ? 'bg-blue-50/80 border-blue-200 text-blue-950 ring-1 ring-blue-200'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                      (currentProgress?.step || 0) > 2
                        ? 'bg-emerald-500 text-white'
                        : (currentProgress?.step || 0) === 2
                        ? 'bg-blue-600 text-white animate-pulse'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {(currentProgress?.step || 0) > 2 ? <CheckCircle className="w-4 h-4" /> : '2'}
                    </div>
                    <span className="text-xs font-black">2. Préparation</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Emballage soigné & vérification technique en entrepôt Dakar.
                  </p>
                </div>

                {/* Étape 3 : En cours de livraison */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  (currentProgress?.step || 0) >= 3
                    ? 'bg-amber-50/80 border-amber-200 text-amber-950 ring-1 ring-amber-200'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                      (currentProgress?.step || 0) > 3
                        ? 'bg-emerald-500 text-white'
                        : (currentProgress?.step || 0) === 3
                        ? 'bg-amber-500 text-white animate-bounce'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {(currentProgress?.step || 0) > 3 ? <CheckCircle className="w-4 h-4" /> : '3'}
                    </div>
                    <span className="text-xs font-black">3. En Livraison</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Colis confié au livreur express pour remise à votre quartier.
                  </p>
                </div>

                {/* Étape 4 : Livrée */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  (currentProgress?.step || 0) === 4
                    ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 ring-1 ring-emerald-300'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                      (currentProgress?.step || 0) === 4
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black">4. Livrée</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Remise en main propre avec vérification & règlement.
                  </p>
                </div>

              </div>
            </div>

            {/* 3. ARTICLES COMMANDÉS & ADRESSE DE LIVRAISON */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
              
              {/* Left 2 Cols: Purchased Items */}
              <div className="lg:col-span-2 space-y-3">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500">
                  Articles de la commande ({selectedOrder.items?.length || 0})
                </h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200'}
                          alt={item.product.title}
                          className="w-12 h-12 rounded-xl object-contain bg-white border border-slate-200 p-1 shrink-0"
                        />
                        <div className="min-w-0">
                          <h5 className="font-bold text-slate-900 truncate">{item.product.title}</h5>
                          <span className="text-[10px] text-slate-400 font-mono">{item.product.brand} • Qté : {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-black text-slate-900 block">{formatFCFA(item.product.price * item.quantity)}</span>
                        <span className="text-[10px] text-slate-400">({formatFCFA(item.product.price)} / u)</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal & Delivery Fee Breakdown */}
                <div className="p-3.5 rounded-2xl bg-slate-100/70 border border-slate-200/80 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Sous-total articles :</span>
                    <span className="font-bold text-slate-900">{formatFCFA(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frais de livraison Dakar :</span>
                    <span className="font-bold text-slate-900">
                      {selectedOrder.shippingFee === 0 ? 'Gratuit' : formatFCFA(selectedOrder.shippingFee)}
                    </span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Remise code promo :</span>
                      <span>-{formatFCFA(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black text-blue-900 pt-1.5 border-t border-slate-200">
                    <span>Net à payer :</span>
                    <span>{formatFCFA(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Right Col: Delivery Address & Assistance */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <h4 className="font-black text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>Lieu de Livraison</span>
                  </h4>
                  <div className="text-xs space-y-1 text-slate-700">
                    <p className="font-bold text-slate-900">{selectedOrder.customer.fullName}</p>
                    <p>Téléphone : <strong className="text-blue-700">+221 {selectedOrder.customer.phone}</strong></p>
                    <p>Quartier : <strong className="text-slate-900">{selectedOrder.customer.district || 'Dakar'}</strong></p>
                    <p className="text-[11px] text-slate-500">{selectedOrder.customer.address}</p>
                    {selectedOrder.customer.deliveryNotes && (
                      <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded-lg border border-slate-200">
                        Note : {selectedOrder.customer.deliveryNotes}
                      </p>
                    )}
                  </div>
                </div>

                {/* WhatsApp Driver Support */}
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-black text-emerald-950">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Support Livraison Dakar</span>
                  </div>
                  <p className="text-[11px] text-emerald-900 leading-relaxed">
                    Besoin de modifier l'adresse ou d'une livraison urgente ? Écrivez-nous directement sur WhatsApp.
                  </p>
                  <a
                    href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(`Bonjour TOUBA MADIYINA ELECTRONIC, je vous contacte au sujet du déroulement de ma commande ${selectedOrder.orderNumber} pour ${selectedOrder.customer.fullName}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <span>Contacter le livreur WhatsApp</span>
                  </a>
                </div>
              </div>

            </div>

            {/* 4. JOURNAL D'ACHEMINEMENT (EVENTS TIMELINE) */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Journal d'Acheminement & Événements</span>
              </h4>
              
              <div className="space-y-3">
                {selectedOrder.trackingEvents && selectedOrder.trackingEvents.length > 0 ? (
                  selectedOrder.trackingEvents.map((event, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1 shrink-0"></div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{event.status}</span>
                          <span className="text-[11px] text-slate-400 font-mono">({event.date})</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">{event.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-start gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1 shrink-0"></div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">Commande prise en charge</span>
                        <span className="text-[11px] text-slate-400 font-mono">({selectedOrder.date})</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        La commande a été enregistrée et transmise à l'équipe logistique de Dakar.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-800">Aucune commande sélectionnée</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Entrez votre numéro de commande ou numéro de téléphone ci-dessus pour afficher le déroulement en direct.
              </p>
            </div>
            <button
              onClick={() => setActiveView('shop')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-md"
            >
              Parcourir la Boutique
            </button>
          </div>
        )}

      </div>
    </div>
  );
};


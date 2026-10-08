import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PaymentMethod, SenegalZone } from '../types';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Phone,
  User,
  MapPin,
  FileText,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Tag,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WaveLogo, OrangeMoneyLogo, FreeMoneyLogo, CashDeliveryBadge } from './PaymentLogos';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    discountAmount,
    appliedCoupon,
    deliveryZones,
    formatFCFA,
    createOrder,
    setActiveView,
    settings,
    addToast
  } = useStore();

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState<string>(deliveryZones[0]?.id || 'dakar-centre');
  const [city, setCity] = useState('Dakar');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wave');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedZone = deliveryZones.find((z) => z.id === selectedZoneId) || deliveryZones[0];
  
  // Free delivery over threshold for Dakar zones
  const isFreeDelivery = cartSubtotal >= (settings.freeShippingMinAmount || 150000) && selectedZone.id.startsWith('dakar');
  const effectiveShippingFee = isFreeDelivery ? 0 : selectedZone.fee;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + effectiveShippingFee);

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl mb-4">
          🛒
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2">Votre panier est vide</h2>
        <p className="text-xs text-slate-500 max-w-sm mb-6">
          Ajoutez des articles à votre panier pour finaliser votre commande.
        </p>
        <button
          onClick={() => setActiveView('shop')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
        >
          Parcourir la boutique
        </button>
      </div>
    );
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!fullName.trim()) {
      addToast('Veuillez entrer votre nom complet', 'warning');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      addToast('Veuillez entrer un numéro de téléphone valide (ex: 77 123 45 67)', 'warning');
      return;
    }
    if (!district.trim()) {
      addToast('Veuillez préciser votre quartier à Dakar ou votre ville', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      const order = createOrder({
        customer: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          region: selectedZone.name,
          city: city.trim(),
          district: district.trim(),
          address: address.trim(),
          deliveryNotes: deliveryNotes.trim()
        },
        items: [...cart],
        subtotal: cartSubtotal,
        shippingFee: effectiveShippingFee,
        discount: discountAmount,
        total: finalTotal,
        paymentMethod,
        paymentStatus: 'pending',
        orderStatus: 'en_attente'
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      addToast('Une erreur est survenue lors de la création de votre commande', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="mb-8 text-center sm:text-left">
          <span className="text-xs font-black uppercase tracking-widest text-blue-700">
            Finalisation de Commande
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-1">
            Caisse & Paiement Sécurisé
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Réglez par Wave, Orange Money ou en espèces à la livraison.
          </p>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT 7 COLS: Customer & Delivery & Payment Form */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. INFORMATIONS CLIENT */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm pb-3 border-b border-slate-100">
                <User className="w-4 h-4 text-blue-600" />
                <span>1. Vos Coordonnées</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nom & Prénom <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Modou Fall"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600 bg-slate-50/50 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Téléphone (WhatsApp / Appel) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">🇸🇳 +221</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="77 123 45 67"
                      className="w-full pl-18 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-600 bg-slate-50/50 focus:bg-white"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email (Facultatif - pour recevoir la facture)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600 bg-slate-50/50 focus:bg-white"
                />
              </div>
            </div>

            {/* 2. ADRESSE DE LIVRAISON AU SÉNÉGAL */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm pb-3 border-b border-slate-100">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>2. Adresse de Livraison au Sénégal</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Zone de Livraison & Tarification <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedZoneId}
                  onChange={(e) => setSelectedZoneId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 bg-white"
                >
                  {deliveryZones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} &mdash; {formatFCFA(zone.fee)} ({zone.deliveryTime})
                    </option>
                  ))}
                </select>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <Truck className="w-3 h-3 text-blue-600" />
                  <span>Délai estimé : {selectedZone.deliveryTime}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ville <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Dakar, Thiès, Touba..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Quartier <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Ex: Almadies, Point E, Parcelles..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Repère / Adresse précise (Important pour le livreur)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Près de la Mosquée, Immeuble bleu en face pharmacie..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Instructions particulières pour le livreur
                </label>
                <textarea
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="Ex: Appeler avant de venir, livrer après 14h..."
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                ></textarea>
              </div>
            </div>

            {/* 3. MODE DE PAIEMENT */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>3. Mode de Paiement</span>
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  🇸🇳 100% Sécurisé
                </span>
              </div>

              <div className="space-y-3">
                {/* WAVE SÉNÉGAL */}
                <div
                  onClick={() => setPaymentMethod('wave')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'wave'
                      ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'wave'}
                      onChange={() => setPaymentMethod('wave')}
                      className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <WaveLogo size="sm" />
                          <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                            Wave Sénégal
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-black">
                          Instantané 0% Frais
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Paiement rapide et sécurisé via votre compte Wave Sénégal (Code Marchand ou au livreur).
                      </p>
                    </div>
                  </div>
                </div>

                {/* ORANGE MONEY SÉNÉGAL */}
                <div
                  onClick={() => setPaymentMethod('orange_money')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'orange_money'
                      ? 'border-orange-500 bg-orange-50/50 shadow-md ring-2 ring-orange-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'orange_money'}
                      onChange={() => setPaymentMethod('orange_money')}
                      className="text-orange-600 focus:ring-orange-500 w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <OrangeMoneyLogo size="sm" />
                          <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                            Orange Money Sénégal
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 text-[10px] font-black">
                          #144# / App Max it
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Règlement mobile sécurisé par Orange Money Sénégal directement à la validation ou à la réception.
                      </p>
                    </div>
                  </div>
                </div>

                {/* CASH ON DELIVERY */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <CashDeliveryBadge size="sm" />
                        </div>
                        <span className="text-[11px] font-bold text-emerald-700">Dakar & Régions</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Inspectez votre colis et réglez en espèces ou par Wave / Orange Money directement au coursier.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 text-xs flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px]">
                  <strong>Paiement 100% garanti :</strong> Tous les règlements font l'objet d'un reçu numérique et d'un bon de garantie officiel délivré avec votre colis.
                </p>
              </div>

            </div>

          </div>

          {/* RIGHT 5 COLS: Order Summary Card */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-24 space-y-4">
              <h3 className="font-black text-sm text-slate-950 pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>Récapitulatif ({cart.reduce((t, i) => t + i.quantity, 0)} articles)</span>
                <span className="text-xs text-blue-600 cursor-pointer font-bold" onClick={() => setActiveView('shop')}>
                  Modifier
                </span>
              </h3>

              {/* Items List */}
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="py-3 flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 object-contain p-1 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.product.title}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-0.5">
                        <span>Qté : {item.quantity}</span>
                        <span className="font-extrabold text-slate-900">
                          {formatFCFA(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price calculations */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Sous-total articles</span>
                  <span className="font-bold text-slate-900">{formatFCFA(cartSubtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Réduction promo ({appliedCoupon?.code})</span>
                    <span>-{formatFCFA(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Frais de livraison ({selectedZone.name})</span>
                  <span className={`font-bold ${isFreeDelivery ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {isFreeDelivery ? 'OFFERTE (Gratuit)' : formatFCFA(effectiveShippingFee)}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">TOTAL À PAYER :</span>
                  <span className="text-2xl font-black text-blue-700">{formatFCFA(finalTotal)}</span>
                </div>
              </div>

              {/* Selected Payment Method Notice */}
              <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-[11px] text-blue-950 flex items-center justify-between">
                <span className="font-semibold">Règlement :</span>
                <div className="flex items-center gap-1.5">
                  {paymentMethod === 'wave' && (
                    <>
                      <WaveLogo size="xs" />
                      <span className="font-black text-slate-900">Code Marchand Wave</span>
                    </>
                  )}
                  {paymentMethod === 'orange_money' && (
                    <>
                      <OrangeMoneyLogo size="xs" />
                      <span className="font-black text-slate-900">Orange Money (#144#)</span>
                    </>
                  )}
                  {paymentMethod === 'cod' && (
                    <>
                      <CashDeliveryBadge size="xs" />
                    </>
                  )}
                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Enregistrement de la commande...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>CONFIRMER LA COMMANDE ({formatFCFA(finalTotal)})</span>
                  </>
                )}
              </button>

              <div className="space-y-2 pt-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Livraison express partout à Dakar & envoi en région</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Facture d'achat et garantie 1 an inclus</span>
                </div>
              </div>

            </div>

          </div>

        </form>

      </div>
    </div>
  );
};


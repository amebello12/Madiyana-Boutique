import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  CheckCircle,
  Truck,
  MessageCircle,
  Package,
  ArrowRight,
  ShieldCheck,
  FileText,
  Clock,
  Printer
} from 'lucide-react';
import { WaveLogo, OrangeMoneyLogo, FreeMoneyLogo, CashDeliveryBadge } from './PaymentLogos';

export const OrderConfirmation: React.FC = () => {
  const { selectedOrder, formatFCFA, setActiveView, settings } = useStore();

  if (!selectedOrder) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Aucune commande récente trouvée</h2>
        <button
          onClick={() => setActiveView('home')}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const whatsappMessage = `Bonjour TOUBA MADIYINA ELECTRONIC,\nJe viens de valider ma commande *${selectedOrder.orderNumber}* pour un montant de *${formatFCFA(selectedOrder.total)}*.\nDestinataire : ${selectedOrder.customer.fullName} (${selectedOrder.customer.phone})\nAdresse de livraison : ${selectedOrder.customer.district}, ${selectedOrder.customer.city}.\nMode de paiement : ${selectedOrder.paymentMethod.toUpperCase()}.\nMerci de me confirmer la prise en charge pour la livraison !`;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SUCCESS HERO BANNER */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 text-center space-y-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-inner">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">
              Commande Enregistrée avec Succès !
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
              Merci pour votre confiance, {selectedOrder.customer.fullName} !
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Votre commande est en cours de préparation par l'équipe TOUBA MADIYINA ELECTRONIC à Dakar.
            </p>
          </div>

          {/* Reference Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto pt-2">
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
              <span className="block text-[11px] text-blue-700 font-bold uppercase">N° de Commande</span>
              <span className="text-lg font-black text-blue-950 font-mono">{selectedOrder.orderNumber}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200">
              <span className="block text-[11px] text-slate-500 font-bold uppercase">N° de Suivi Express</span>
              <span className="text-lg font-black text-slate-900 font-mono">{selectedOrder.trackingNumber}</span>
            </div>
          </div>

          {/* Action WhatsApp */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Confirmer sur WhatsApp</span>
            </a>

            <button
              onClick={() => setActiveView('order-tracking')}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span>Suivre l'acheminement en direct</span>
            </button>
          </div>
        </div>

        {/* ORDER DETAILS SUMMARY CARD */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-black text-sm text-slate-900">Détails de la Commande</h3>
            <button
              onClick={handlePrint}
              className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 font-semibold"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer le reçu</span>
            </button>
          </div>

          {/* Items Table */}
          <div className="divide-y divide-slate-100">
            {selectedOrder.items.map((item) => (
              <div key={item.product.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-12 h-12 object-contain rounded-lg bg-slate-50 border border-slate-200 p-1"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 line-clamp-1">{item.product.title}</h4>
                    <span className="text-[11px] text-slate-400">Quantité : {item.quantity}</span>
                  </div>
                </div>
                <span className="font-black text-slate-900">
                  {formatFCFA(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Sous-total articles</span>
              <span className="font-bold">{formatFCFA(selectedOrder.subtotal)}</span>
            </div>
            {selectedOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Remise appliquée</span>
                <span>-{formatFCFA(selectedOrder.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Frais de livraison</span>
              <span className="font-bold">{formatFCFA(selectedOrder.shippingFee)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm">
              <span className="font-bold text-slate-900">Total :</span>
              <span className="text-xl font-black text-blue-700">{formatFCFA(selectedOrder.total)}</span>
            </div>
          </div>

          {/* Customer & Shipping Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <span className="font-extrabold text-slate-900 block">Adresse de Livraison :</span>
              <p className="text-slate-600"><strong>Destinataire :</strong> {selectedOrder.customer.fullName}</p>
              <p className="text-slate-600"><strong>Téléphone :</strong> +221 {selectedOrder.customer.phone}</p>
              <p className="text-slate-600"><strong>Zone :</strong> {selectedOrder.customer.region}</p>
              <p className="text-slate-600"><strong>Quartier :</strong> {selectedOrder.customer.district}, {selectedOrder.customer.city}</p>
              {selectedOrder.customer.address && (
                <p className="text-slate-600"><strong>Repère :</strong> {selectedOrder.customer.address}</p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="font-extrabold text-slate-900 block">Mode de Règlement :</span>
              <div className="flex items-center gap-2">
                {selectedOrder.paymentMethod === 'wave' && (
                  <>
                    <WaveLogo size="sm" />
                    <span className="font-bold text-slate-900">Wave Sénégal</span>
                  </>
                )}
                {selectedOrder.paymentMethod === 'orange_money' && (
                  <>
                    <OrangeMoneyLogo size="sm" />
                    <span className="font-bold text-slate-900">Orange Money Sénégal</span>
                  </>
                )}
                {selectedOrder.paymentMethod === 'cod' && (
                  <>
                    <CashDeliveryBadge size="sm" />
                  </>
                )}
              </div>
              <p className="text-slate-600 text-[11px]">
                Statut du paiement : <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold uppercase text-[10px]">{selectedOrder.paymentStatus}</span>
              </p>
              <p className="text-[11px] text-slate-500 pt-1">
                Le reçu officiel et le bon de garantie vous seront remis avec le colis par le coursier.
              </p>
            </div>
          </div>

          {/* Continue shopping button */}
          <div className="text-center pt-4">
            <button
              onClick={() => setActiveView('shop')}
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 hover:text-blue-800"
            >
              <span>Continuer mes achats sur TOUBA MADIYINA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

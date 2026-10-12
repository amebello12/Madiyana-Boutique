import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  MapPin,
  Navigation,
  ExternalLink,
  Copy,
  Check,
  Clock,
  Phone,
  MessageCircle,
  Truck,
  ShieldCheck,
  X,
  Compass,
  Building2,
  Share2
} from 'lucide-react';

interface StoreLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoreLocationModal: React.FC<StoreLocationModalProps> = ({
  isOpen,
  onClose
}) => {
  const { settings, addToast } = useStore();
  const [copied, setCopied] = useState(false);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');

  if (!isOpen) return null;

  const fullAddress = settings.address || 'Boulevard Général de Gaulle, Angle Rue 22, Sandaga / Médina, Dakar, Sénégal';
  const landmark = settings.mapsLandmark || 'Angle Rue 22 x Boulevard Général de Gaulle (Proche Marché Sandaga & Médina)';
  const openingHours = settings.mapsOpeningHours || 'Du Lundi au Samedi : 08h30 - 20h30';

  // Google Maps URLs
  const encodedAddress = encodeURIComponent(fullAddress);
  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
  const embedMapUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=${mapType === 'satellite' ? 'k' : ''}&z=16&ie=UTF8&iwloc=&output=embed`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    addToast('Adresse copiée dans le presse-papier !', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareLocation = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: settings.name + ' - Showroom Dakar',
          text: `Retrouvez ${settings.name} à l'adresse : ${fullAddress}`,
          url: googleMapsDirectionsUrl
        });
      } catch (err) {
        // Fallback copy
        handleCopyAddress();
      }
    } else {
      handleCopyAddress();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-5 sm:p-6 flex items-center justify-between gap-4 border-b border-blue-950/50 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0 text-blue-200 shadow-inner">
              <MapPin className="w-6 h-6 text-amber-400" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                <Building2 className="w-3 h-3" />
                <span>Showroom & Boutique Physique</span>
              </span>
              <h2 className="text-lg sm:text-xl font-black truncate text-white">
                Localisation Google Maps
              </h2>
              <p className="text-xs text-blue-200 truncate">
                {settings.name} à Dakar, Sénégal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* 1. INTERACTIVE GOOGLE MAPS EMBED */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-300 shadow-md bg-slate-100 flex flex-col">
            {/* Map Top Bar */}
            <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-400 animate-spin" style={{ animationDuration: '8s' }} />
                <span>Google Maps en direct • Dakar Sandaga / Médina</span>
              </div>
              
              <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg text-[11px]">
                <button
                  onClick={() => setMapType('roadmap')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    mapType === 'roadmap' ? 'bg-blue-600 text-white font-black' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Plan
                </button>
                <button
                  onClick={() => setMapType('satellite')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    mapType === 'satellite' ? 'bg-blue-600 text-white font-black' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Satellite
                </button>
              </div>
            </div>

            {/* Map Iframe */}
            <div className="relative w-full h-72 sm:h-96 bg-slate-200">
              <iframe
                title="Google Maps Location - TOUBA MADIYINA ELECTRONIC Dakar"
                src={embedMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />

              {/* Floating Quick Action Overlay */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-xl flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <Navigation className="w-4 h-4 text-amber-300" />
                  <span>Obtenir l'itinéraire</span>
                </a>
              </div>
            </div>
          </div>

          {/* 2. SHOWROOM DETAILS & ACTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Left Box: Full Address & Repères */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5">
              <div className="flex items-center gap-2 text-blue-900 font-black text-sm">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Adresse & Repères de la Boutique</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-semibold">
                {fullAddress}
              </div>

              <div className="text-xs text-slate-600 space-y-1.5">
                <div className="flex items-start gap-2">
                  <strong className="text-slate-900 shrink-0">Repère :</strong>
                  <span>{landmark}</span>
                </div>
                <div className="flex items-center gap-2">
                  <strong className="text-slate-900 shrink-0">Ville :</strong>
                  <span>Dakar, Sénégal (Zone Sandaga / Boulevard Général de Gaulle)</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copied ? 'Adresse copiée !' : 'Copier l\'adresse'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareLocation}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Partager la position</span>
                </button>
              </div>
            </div>

            {/* Right Box: Hours, Phone & WhatsApp */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Horaires d'Ouverture & Service Client</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-600">Magasin Ouvert :</span>
                    <span className="font-black text-slate-900">08h30 - 20h30</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Jours :</span>
                    <span>Lundi au Samedi sans interruption</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-emerald-700 font-bold border-t border-slate-100 pt-1.5">
                    <span>Livraison le Jour Même :</span>
                    <span>Dakar & Banlieue (2h à 4h)</span>
                  </div>
                </div>
              </div>

              {/* Direct Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <a
                  href={`tel:${settings.contactPhone || '775363437'}`}
                  className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm text-center"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Appeler Magasin</span>
                </a>

                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(`Bonjour ${settings.name}, je souhaite me rendre à votre boutique physique située au Boulevard Général de Gaulle, Dakar. Pouvez-vous me guider ?`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm text-center"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Direct</span>
                </a>
              </div>

            </div>

          </div>

          {/* 3. SENNEGAL DELIVERY & SHOWROOM ADVANTAGES */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-blue-900">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold block">Achetez en boutique ou faites-vous livrer</span>
                <span className="text-blue-700 text-[11px]">
                  Venez tester vos appareils sur place à Sandaga ou commandez en ligne avec paiement à la livraison (Wave, Orange Money ou Espèces).
                </span>
              </div>
            </div>

            <a
              href={googleMapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white font-black rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <span>Ouvrir sur Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <p className="text-[11px] text-slate-500 text-center sm:text-left">
            📍 {fullAddress}
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-black transition-colors"
            >
              Fermer
            </button>
            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <Navigation className="w-4 h-4 text-amber-300" />
              <span>Itinéraire GPS</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

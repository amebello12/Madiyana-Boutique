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
  Compass,
  Building
} from 'lucide-react';

interface StoreMapCardProps {
  title?: string;
  className?: string;
}

export const StoreMapCard: React.FC<StoreMapCardProps> = ({
  title = "Showroom & Boutique Dakar",
  className = ""
}) => {
  const { settings, addToast } = useStore();
  const [copied, setCopied] = useState(false);

  const fullAddress = settings.address || 'Boulevard Général de Gaulle, Angle Rue 22, Sandaga / Médina, Dakar, Sénégal';
  const landmark = settings.mapsLandmark || 'Angle Rue 22 x Boulevard Général de Gaulle (Face Marché Sandaga & Médina)';
  const openingHours = settings.mapsOpeningHours || 'Du Lundi au Samedi : 08h30 - 20h30';

  const encodedAddress = encodeURIComponent(fullAddress);
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  const embedMapUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    addToast('Adresse du magasin copiée !', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={`rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {/* Header */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-amber-400 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-300 block">
              Google Maps Location
            </span>
            <h3 className="text-base sm:text-lg font-black text-white">
              {title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/10"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
            <span>{copied ? 'Copié' : 'Copier l\'adresse'}</span>
          </button>

          <a
            href={googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5 text-amber-300" />
            <span>Itinéraire GPS</span>
          </a>
        </div>
      </div>

      {/* Interactive Google Map Frame */}
      <div className="relative w-full h-64 sm:h-80 bg-slate-100 border-y border-slate-200">
        <iframe
          title="Google Map Showroom Dakar"
          src={embedMapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />

        {/* Floating Quick Action */}
        <div className="absolute top-3 right-3">
          <a
            href={googleMapsSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-sm hover:bg-white text-slate-900 text-xs font-bold flex items-center gap-1.5 shadow-md border border-slate-200 transition-all hover:scale-105"
          >
            <span>Agrandir le plan</span>
            <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
          </a>
        </div>
      </div>

      {/* Info & Details Grid */}
      <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 text-xs">
        
        {/* Address */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
          <span className="font-black text-slate-900 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-blue-600" />
            <span>Adresse Physique</span>
          </span>
          <p className="text-slate-600 leading-relaxed font-semibold">
            {fullAddress}
          </p>
          <p className="text-[11px] text-slate-500 pt-1">
            📍 {landmark}
          </p>
        </div>

        {/* Horaires */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
          <span className="font-black text-slate-900 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Horaires Showroom</span>
          </span>
          <p className="text-slate-700 font-bold">
            {openingHours}
          </p>
          <p className="text-[11px] text-emerald-700 font-semibold pt-1">
            ✓ Ouvert du Lundi au Samedi sans interruption
          </p>
        </div>

        {/* Contact direct */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2 flex flex-col justify-between">
          <div>
            <span className="font-black text-slate-900 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>Contact Showroom</span>
            </span>
            <p className="text-slate-700 font-bold">
              +221 {settings.contactPhone || '77 536 34 37'}
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <a
              href={`tel:${settings.contactPhone || '775363437'}`}
              className="flex-1 py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold text-center transition-colors"
            >
              Appeler
            </a>
            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-bold text-center flex items-center justify-center gap-1 transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

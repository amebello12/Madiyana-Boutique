import React from 'react';
import { useStore } from '../context/StoreContext';
import { Logo } from './Logo';
import { WaveLogo, OrangeMoneyLogo, FreeMoneyLogo, CashDeliveryBadge } from './PaymentLogos';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Truck,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Lock,
  FileText,
  Scale,
  Building2,
  ScrollText,
  HelpCircle,
  Navigation,
  ExternalLink
} from 'lucide-react';

export const Footer: React.FC = () => {
  const {
    setActiveView,
    setSelectedCategorySlug,
    setSelectedPageSlug,
    settings,
    pages,
    setIsLocationModalOpen
  } = useStore();

  const handleOpenPage = (slug: string) => {
    setSelectedPageSlug(slug);
    setActiveView('page-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-white pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Column 1: Store Bio */}
          <div className="space-y-4">
            <div
              onClick={() => {
                setActiveView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer inline-block"
            >
              <Logo variant="full" theme="dark" size="md" />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Votre référence e-commerce au Sénégal pour l'achat de smartphones, téléviseurs, électroménagers et produits high-tech de qualité supérieure.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Magasin ouvert à Dakar 7j/7</span>
              </span>

              <button
                onClick={() => handleOpenPage('a-propos')}
                className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 transition-colors text-left"
              >
                <span>En savoir plus sur notre histoire & showroom &rarr;</span>
              </button>
            </div>
          </div>

          {/* Column 2: Navigation Rapide */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">
              Rayons & Collections
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategorySlug('telephones-accessoires');
                    setActiveView('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-blue-400 transition-colors"
                >
                  📱 Téléphones & Accessoires
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategorySlug('electromenager');
                    setActiveView('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-blue-400 transition-colors"
                >
                  ❄️ Électroménager & Frigos
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategorySlug('tv-audio');
                    setActiveView('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-blue-400 transition-colors"
                >
                  📺 Smart TV & Barres de son
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategorySlug('solaire-energie');
                    setActiveView('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-blue-400 transition-colors"
                >
                  ☀️ Kits Solaires & Onduleurs
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategorySlug('promotions-flash');
                    setActiveView('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-rose-400 hover:text-rose-300 font-bold transition-colors"
                >
                  🔥 Ventes Flash & Promos
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => {
                    setActiveView('order-tracking');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-amber-300/90 font-bold"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Suivre ma commande en direct</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Pages & Mentions Légales */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">
              Informations & Légal
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => handleOpenPage('a-propos')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>À Propos de nous</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOpenPage('cgu-mentions-legales')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <Scale className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>CGU & Mentions Légales</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOpenPage('politique-confidentialite')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Politique de Confidentialité</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOpenPage('conditions-generales-vente')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <ScrollText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Conditions Générales de Vente (CGV)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOpenPage('livraison')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <Truck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>Tarifs & Délais de Livraison</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOpenPage('retours-garantie')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Garanties & Retours (7 Jours)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOpenPage('faq')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Foire Aux Questions (FAQ)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Dakar & Google Maps Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-300 flex items-center justify-between">
              <span>Boutique & Google Maps</span>
              <span className="text-[10px] text-amber-400 font-bold bg-amber-400/10 px-1.5 py-0.5 rounded">Dakar</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(true)}
                  className="text-left group flex items-start gap-2 text-slate-300 hover:text-white transition-colors"
                >
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="underline decoration-slate-600 underline-offset-4 group-hover:decoration-amber-400">
                    {settings.address}
                  </span>
                </button>
              </li>

              {/* Quick Google Maps Button */}
              <li className="pt-1">
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(true)}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-[1.02]"
                >
                  <Navigation className="w-3.5 h-3.5 text-amber-300" />
                  <span>Voir la Localisation Google Maps</span>
                </button>
              </li>

              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`tel:${settings.contactPhone}`} className="hover:text-white font-bold">
                  +221 {settings.contactPhone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline font-bold"
                >
                  WhatsApp : +221 77 536 34 37
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>contact@toubamadiyina.sn</span>
              </li>
              <li className="pt-2 text-slate-400 leading-relaxed text-[11px] border-t border-slate-800">
                <strong className="text-white block mb-0.5">Horaires Showroom :</strong>
                Du Lundi au Samedi : 08h30 - 20h30 <br />
                <span className="text-emerald-400 font-semibold">Livraison express le jour même partout à Dakar</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Payments & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          
          <div className="flex items-center gap-3">
            <span>
              © {new Date().getFullYear()} {settings.name} — Tous droits réservés. Vente en ligne & boutique physique au Sénégal.
            </span>
            <button
              onClick={() => {
                setActiveView('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-slate-700 hover:text-slate-400 transition-colors p-1 rounded"
              title="Accès Administrateur Sécurisé"
            >
              <Lock className="w-3.5 h-3.5 opacity-50 hover:opacity-100" />
            </button>
          </div>

          {/* Quick Legal Links in Footer Bottom */}
          <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
            <button
              onClick={() => handleOpenPage('a-propos')}
              className="hover:text-slate-300 transition-colors"
            >
              À Propos
            </button>
            <span>•</span>
            <button
              onClick={() => handleOpenPage('cgu-mentions-legales')}
              className="hover:text-slate-300 transition-colors"
            >
              Mentions Légales
            </button>
            <span>•</span>
            <button
              onClick={() => handleOpenPage('politique-confidentialite')}
              className="hover:text-slate-300 transition-colors"
            >
              Confidentialité
            </button>
            <span>•</span>
            <button
              onClick={() => handleOpenPage('conditions-generales-vente')}
              className="hover:text-slate-300 transition-colors"
            >
              CGV
            </button>
          </div>

          {/* Payment Badges in Senegal */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-400">Paiements acceptés :</span>
            <WaveLogo size="xs" theme="dark" />
            <OrangeMoneyLogo size="xs" theme="dark" />
            <FreeMoneyLogo size="xs" />
            <CashDeliveryBadge size="xs" theme="dark" />
          </div>

        </div>

      </div>
    </footer>
  );
};


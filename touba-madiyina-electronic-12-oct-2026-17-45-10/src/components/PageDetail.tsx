import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  FileText,
  Clock,
  ChevronRight,
  Home,
  Phone,
  MessageCircle,
  MapPin,
  ShieldCheck,
  Building2,
  Scale,
  Lock,
  ScrollText,
  Truck,
  HelpCircle,
  Share2,
  ArrowLeft,
  Calendar,
  Navigation
} from 'lucide-react';
import { StoreMapCard } from './StoreMapCard';

export const PageDetail: React.FC = () => {
  const {
    pages,
    selectedPageSlug,
    setSelectedPageSlug,
    setActiveView,
    settings,
    addToast,
    setIsLocationModalOpen
  } = useStore();

  // Find the selected page or fallback to the first one / a-propos
  const currentPage =
    pages.find((p) => p.slug === selectedPageSlug || p.id === selectedPageSlug) ||
    pages.find((p) => p.slug === 'a-propos') ||
    pages[0];

  const getPageIcon = (slug: string) => {
    switch (slug) {
      case 'a-propos':
        return <Building2 className="w-5 h-5 text-blue-600" />;
      case 'cgu-mentions-legales':
        return <Scale className="w-5 h-5 text-purple-600" />;
      case 'politique-confidentialite':
        return <Lock className="w-5 h-5 text-emerald-600" />;
      case 'conditions-generales-vente':
        return <ScrollText className="w-5 h-5 text-amber-600" />;
      case 'livraison':
        return <Truck className="w-5 h-5 text-sky-600" />;
      case 'retours-garantie':
        return <ShieldCheck className="w-5 h-5 text-teal-600" />;
      case 'faq':
        return <HelpCircle className="w-5 h-5 text-indigo-600" />;
      default:
        return <FileText className="w-5 h-5 text-blue-600" />;
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${currentPage?.title || 'Page'} - ${settings.name}`,
          text: `Découvrez ${currentPage?.title} sur TOUBA MADIYINA ELECTRONIC Dakar`,
          url: window.location.href
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      addToast('Lien de la page copié dans le presse-papiers !', 'info');
    }
  };

  if (!currentPage) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-800">Page introuvable</h2>
        <p className="text-slate-500 text-sm">La page demandée n'existe pas ou a été déplacée.</p>
        <button
          onClick={() => setActiveView('home')}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  // Parse markdown content into structured JSX
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      if (!trimmed) {
        return <div key={idx} className="h-4" />;
      }

      if (trimmed.startsWith('### ')) {
        return (
          <h2
            key={idx}
            className="text-xl sm:text-2xl font-black text-slate-900 mt-6 mb-3 tracking-tight border-b border-slate-100 pb-2"
          >
            {trimmed.replace('### ', '')}
          </h2>
        );
      }

      if (trimmed.startsWith('#### ')) {
        return (
          <h3
            key={idx}
            className="text-base sm:text-lg font-extrabold text-blue-900 mt-5 mb-2 flex items-center gap-2"
          >
            <span className="w-1.5 h-4 rounded-full bg-blue-600 inline-block"></span>
            <span>{trimmed.replace('#### ', '')}</span>
          </h3>
        );
      }

      if (trimmed.startsWith('- ')) {
        const itemText = trimmed.replace('- ', '');
        return (
          <li key={idx} className="flex items-start gap-2.5 text-slate-700 text-sm leading-relaxed mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0"></span>
            <span>
              {renderFormattedText(itemText)}
            </span>
          </li>
        );
      }

      if (trimmed.startsWith('**Q :') || trimmed.startsWith('**Q:')) {
        return (
          <div key={idx} className="bg-blue-50/80 border-l-4 border-blue-600 p-3.5 rounded-r-xl my-3 text-sm font-bold text-blue-950">
            {renderFormattedText(trimmed)}
          </div>
        );
      }

      if (trimmed.startsWith('R :') || trimmed.startsWith('R:')) {
        return (
          <div key={idx} className="pl-4 text-slate-700 text-sm leading-relaxed mb-4">
            {renderFormattedText(trimmed)}
          </div>
        );
      }

      return (
        <p key={idx} className="text-slate-700 text-sm sm:text-base leading-relaxed mb-3">
          {renderFormattedText(trimmed)}
        </p>
      );
    });
  };

  // Helper to handle bold (**text**) and code tags in lines
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-bold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
          <button
            onClick={() => setActiveView('home')}
            className="hover:text-blue-600 flex items-center gap-1 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Accueil</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Informations & Légal</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-slate-800 truncate max-w-xs">{currentPage.title}</span>
        </nav>

        {/* Main Grid: Content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left / Main Content Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            <article className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6">
              
              {/* Header */}
              <div className="border-b border-slate-100 pb-6 space-y-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold">
                    {getPageIcon(currentPage.slug)}
                    <span className="uppercase tracking-wider">Page Officielle</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShare}
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors text-xs flex items-center gap-1.5 border border-slate-200"
                      title="Partager cette page"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Partager</span>
                    </button>
                    <button
                      onClick={() => setActiveView('home')}
                      className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors text-xs flex items-center gap-1.5 border border-slate-200"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Boutique</span>
                    </button>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  {currentPage.title}
                </h1>

                <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <span>Mise à jour : <strong>{currentPage.updatedAt || 'Août 2026'}</strong></span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Lecture : ~3 minutes</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                    <span>Conforme réglementation Sénégal</span>
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <div className="prose prose-slate max-w-none text-slate-700 space-y-2">
                {renderContent(currentPage.content)}
              </div>

              {/* Footer Trust Callout */}
              <div className="mt-10 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-blue-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>TOUBA MADIYINA ELECTRONIC Dakar</span>
                  </h4>
                  <p className="text-xs text-slate-600">
                    Des questions sur nos mentions, CGV ou votre commande ? Notre équipe sénégalaise vous répond en direct.
                  </p>
                </div>

                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all shrink-0"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp 7j/7</span>
                </a>
              </div>

            </article>

            {/* Google Maps Location Section */}
            <StoreMapCard title={`Localisation du Magasin ${settings.name} à Dakar`} />

          </div>

          {/* Right Column: Menu Pages + Store Contact Info (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Other Legal & Info Pages navigation */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  Pages & Informations
                </h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {pages.length} pages
                </span>
              </div>

              <div className="space-y-1.5">
                {pages.map((page) => {
                  const isActive = (selectedPageSlug === page.slug || selectedPageSlug === page.id) ||
                    (!selectedPageSlug && page.slug === 'a-propos');

                  return (
                    <button
                      key={page.id || page.slug}
                      onClick={() => {
                        setSelectedPageSlug(page.slug);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between gap-3 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                          : 'bg-slate-50 hover:bg-blue-50/80 text-slate-700 hover:text-blue-900 border border-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={isActive ? 'text-white' : ''}>
                          {getPageIcon(page.slug)}
                        </span>
                        <span className="truncate">{page.title}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-200' : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Senegal Customer Service Box */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                  Magasin Dakar & Google Maps
                </span>
                <h3 className="text-base font-black">
                  Visitez Notre Showroom
                </h3>
                <p className="text-xs text-slate-400">
                  Notre boutique physique à Sandaga vous accueille du Lundi au Samedi.
                </p>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{settings.address}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                  <a href={`tel:${settings.contactPhone}`} className="hover:text-white font-bold text-white">
                    +221 {settings.contactPhone}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Lun - Sam: 08h30 - 20h30</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(true)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <Navigation className="w-4 h-4 text-amber-300" />
                  <span>Voir l'Itinéraire Google Maps</span>
                </button>

                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(`Bonjour TOUBA MADIYINA, j'ai une question concernant la boutique physique ou la page "${currentPage.title}"`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs flex items-center justify-center gap-2 transition-colors shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Discuter sur WhatsApp</span>
                </a>
              </div>
            </div>

            {/* 3. Quick Shopping Link */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-700 to-indigo-900 text-white space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">
                Catalogue 100% Neuf & Garanti
              </span>
              <h4 className="text-base font-black">
                Découvrez nos Téléphones, Smart TV & Électroménager
              </h4>
              <button
                onClick={() => {
                  setActiveView('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-2.5 bg-white text-blue-900 hover:bg-blue-50 rounded-xl text-xs font-black transition-colors"
              >
                Explorer le catalogue
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

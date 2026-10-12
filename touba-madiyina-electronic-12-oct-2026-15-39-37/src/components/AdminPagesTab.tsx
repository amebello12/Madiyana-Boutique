import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { CustomPage } from '../types';
import {
  FileText,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  RotateCcw,
  Eye,
  EyeOff,
  Building2,
  Scale,
  Lock,
  ScrollText,
  Truck,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Copy
} from 'lucide-react';

export const AdminPagesTab: React.FC = () => {
  const {
    pages,
    addPage,
    updatePage,
    deletePage,
    restoreInitialPages,
    setSelectedPageSlug,
    setActiveView,
    addToast
  } = useStore();

  const [selectedPageId, setSelectedPageId] = useState<string>('');
  const [isEditingNew, setIsEditingNew] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<CustomPage | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<CustomPage, 'id'>>({
    title: '',
    slug: '',
    content: '',
    updatedAt: new Date().toISOString().split('T')[0]
  });

  // Select initial page or update form when selectedPageId changes
  useEffect(() => {
    if (pages.length > 0 && !isEditingNew) {
      const active = pages.find((p) => p.id === selectedPageId) || pages[0];
      if (active) {
        setSelectedPageId(active.id);
        setFormData({
          title: active.title,
          slug: active.slug,
          content: active.content,
          updatedAt: active.updatedAt || new Date().toISOString().split('T')[0]
        });
      }
    }
  }, [pages, selectedPageId, isEditingNew]);

  const getPageIcon = (slug: string) => {
    switch (slug) {
      case 'a-propos':
        return <Building2 className="w-4 h-4 text-blue-600" />;
      case 'cgu-mentions-legales':
        return <Scale className="w-4 h-4 text-purple-600" />;
      case 'politique-confidentialite':
        return <Lock className="w-4 h-4 text-emerald-600" />;
      case 'conditions-generales-vente':
        return <ScrollText className="w-4 h-4 text-amber-600" />;
      case 'livraison':
        return <Truck className="w-4 h-4 text-sky-600" />;
      case 'retours-garantie':
        return <ShieldCheck className="w-4 h-4 text-teal-600" />;
      case 'faq':
        return <HelpCircle className="w-4 h-4 text-indigo-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleSelectPage = (page: CustomPage) => {
    setIsEditingNew(false);
    setSelectedPageId(page.id);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      updatedAt: page.updatedAt || new Date().toISOString().split('T')[0]
    });
  };

  const handleCreateNewClick = () => {
    setIsEditingNew(true);
    setSelectedPageId('new');
    setFormData({
      title: 'Nouvelle Page Informative',
      slug: 'nouvelle-page',
      content: `### Titre de la Section\n\nDécrivez ici les informations ou engagements pour vos clients au Sénégal.\n\n#### Sous-titre ou Point Clé\n- Point important 1\n- Point important 2`,
      updatedAt: new Date().toISOString().split('T')[0]
    });
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      addToast('Veuillez saisir un titre pour la page', 'error');
      return;
    }

    if (!formData.slug.trim()) {
      addToast('Veuillez spécifier un identifiant URL (slug)', 'error');
      return;
    }

    setIsSaving(true);

    // Clean slug
    const cleanSlug = formData.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-');

    if (isEditingNew) {
      addPage({
        title: formData.title,
        slug: cleanSlug,
        content: formData.content
      });
      setIsEditingNew(false);
      addToast(`Page "${formData.title}" créée et enregistrée avec succès !`, 'success');
    } else {
      updatePage(selectedPageId, {
        title: formData.title,
        slug: cleanSlug,
        content: formData.content,
        updatedAt: new Date().toISOString().split('T')[0]
      });
      addToast(`Page "${formData.title}" mise à jour avec succès dans Firestore !`, 'success');
    }

    setIsSaving(false);
  };

  const handleInsertHelper = (snippet: string) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content ? `${prev.content}\n${snippet}` : snippet
    }));
  };

  const handleViewLive = (slug: string) => {
    setSelectedPageSlug(slug);
    setActiveView('page-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteConfirm = () => {
    if (!pageToDelete) return;
    deletePage(pageToDelete.id);
    setPageToDelete(null);
    if (selectedPageId === pageToDelete.id) {
      setIsEditingNew(false);
      const remaining = pages.filter((p) => p.id !== pageToDelete.id);
      if (remaining.length > 0) {
        setSelectedPageId(remaining[0].id);
      }
    }
  };

  // Preview renderer helper
  const renderPreviewContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-3" />;
      if (trimmed.startsWith('### ')) {
        return (
          <h2 key={idx} className="text-lg font-black text-slate-900 mt-4 mb-2 border-b border-slate-100 pb-1">
            {trimmed.replace('### ', '')}
          </h2>
        );
      }
      if (trimmed.startsWith('#### ')) {
        return (
          <h3 key={idx} className="text-sm font-extrabold text-blue-900 mt-3 mb-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-3 bg-blue-600 rounded-full inline-block"></span>
            <span>{trimmed.replace('#### ', '')}</span>
          </h3>
        );
      }
      if (trimmed.startsWith('- ')) {
        return (
          <li key={idx} className="text-slate-700 text-xs flex items-start gap-2 mb-1.5 ml-2">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 shrink-0"></span>
            <span>{trimmed.replace('- ', '')}</span>
          </li>
        );
      }
      return (
        <p key={idx} className="text-slate-700 text-xs leading-relaxed mb-2">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Fast Actions */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
              <FileText className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-black text-slate-900">
              Gestionnaire de Pages & Mentions Légales
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Modifiez et personnalisez les pages légales : <strong>À Propos de nous</strong>, <strong>CGU & Mentions Légales</strong>, <strong>Politique de Confidentialité</strong>, <strong>Conditions Générales de Vente</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => restoreInitialPages()}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200"
            title="Rétablir les textes légaux conformes Sénégal (À propos, CGU, Confidentialité, CGV)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
            <span>Restaurer modèles officiels</span>
          </button>

          <button
            onClick={handleCreateNewClick}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Créer une Page</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Page List + Right Form / Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: List of Pages (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Pages de la Boutique ({pages.length})
              </h3>
              <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                Synchronisé Firestore
              </span>
            </div>

            <div className="space-y-2">
              {pages.map((page) => {
                const isSelected = selectedPageId === page.id && !isEditingNew;
                const isRequiredPage = [
                  'a-propos',
                  'cgu-mentions-legales',
                  'politique-confidentialite',
                  'conditions-generales-vente'
                ].includes(page.slug);

                return (
                  <div
                    key={page.id}
                    onClick={() => handleSelectPage(page)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all border text-left flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-300 shadow-sm'
                        : 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {getPageIcon(page.slug)}
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {page.title}
                        </span>
                      </div>
                      {isRequiredPage && (
                        <span className="text-[9px] font-black uppercase tracking-wider bg-blue-600 text-white px-1.5 py-0.5 rounded shrink-0">
                          Requis
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pl-6">
                      <span className="font-mono text-[10px] text-slate-500">/{page.slug}</span>
                      <span>{page.updatedAt || 'Août 2026'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-950">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Conformité & Commerce Sénégal</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Toutes vos modifications sont immédiatement appliquées sur la boutique et consultables dans le pied de page (Footer).
            </p>
          </div>
        </div>

        {/* Right Column: Editor & Preview (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
            
            {/* Header Form Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                  {isEditingNew ? 'Création de Page' : 'Édition de Page en Direct'}
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {formData.title || 'Page sans titre'}
                </h3>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200"
                >
                  {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPreview ? 'Masquer aperçu' : 'Voir aperçu'}</span>
                </button>

                {!isEditingNew && (
                  <button
                    onClick={() => handleViewLive(formData.slug)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-blue-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-blue-200"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Ouvrir sur le site</span>
                  </button>
                )}

                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Enregistrement...' : 'Enregistrer'}</span>
                </button>
              </div>
            </div>

            {/* Inputs: Title & Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Titre de la Page <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex : À Propos de TOUBA MADIYINA"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Slug URL (Identifiant) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="Ex : a-propos"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Formatting Toolbar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Contenu de la Page (Formatage Markdown structuré)
                </label>
                <span className="text-[11px] text-slate-400">
                  {formData.content.length} caractères • ~{formData.content.split(/\s+/).filter(Boolean).length} mots
                </span>
              </div>

              <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl flex-wrap text-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase px-2">Ajouter :</span>
                <button
                  type="button"
                  onClick={() => handleInsertHelper('### Titre de Section')}
                  className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-[11px] border border-slate-200 shadow-xs"
                >
                  ### Titre H2
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertHelper('#### Sous-titre ou Avantage')}
                  className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-[11px] border border-slate-200 shadow-xs"
                >
                  #### Titre H3
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertHelper('**Texte en gras**')}
                  className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-[11px] border border-slate-200 shadow-xs"
                >
                  **Gras**
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertHelper('- Point clé 1\n- Point clé 2')}
                  className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-[11px] border border-slate-200 shadow-xs"
                >
                  • Liste
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertHelper('**Q : Comment nous contacter ?**\nR : Par WhatsApp au +221 77 536 34 37.')}
                  className="px-2.5 py-1 bg-white hover:bg-slate-200 text-blue-800 rounded-lg font-bold text-[11px] border border-blue-200 shadow-xs"
                >
                  Q/R FAQ
                </button>
              </div>

              {/* Textarea */}
              <textarea
                rows={12}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Rédigez ici le contenu de la page..."
                className="w-full p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono leading-relaxed text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-inner resize-y"
              />
            </div>

            {/* Live Preview Box */}
            {showPreview && (
              <div className="border border-blue-200 rounded-2xl p-5 bg-gradient-to-b from-blue-50/30 to-slate-50 space-y-4">
                <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-blue-950">
                      Aperçu en Direct pour le Client
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Mise en page automatique
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm max-w-none">
                  <h1 className="text-xl font-black text-slate-900 mb-4 pb-2 border-b border-slate-100">
                    {formData.title || 'Titre de la page'}
                  </h1>
                  <div className="space-y-1">
                    {renderPreviewContent(formData.content)}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions: Delete custom page */}
            {!isEditingNew && (
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Dernière mise à jour enregistrée : {formData.updatedAt}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    const found = pages.find((p) => p.id === selectedPageId);
                    if (found) setPageToDelete(found);
                  }}
                  className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-rose-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Supprimer cette page</span>
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {pageToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900">
                Supprimer la page "{pageToDelete.title}" ?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Cette action supprimera définitivement cette page de votre catalogue en ligne et de Firestore.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setPageToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-500/20"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

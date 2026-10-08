import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Article } from '../types';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Clock,
  Sparkles,
  ExternalLink,
  CheckCircle,
  Eye,
  RotateCcw,
  Tag
} from 'lucide-react';

export const AdminArticlesTab: React.FC = () => {
  const {
    articles,
    addArticle,
    updateArticle,
    deleteArticle,
    setActiveView,
    setSelectedArticleId,
    addToast
  } = useStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);

  const [form, setForm] = useState<Omit<Article, 'id' | 'date'>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
    author: 'TOUBA MADIYINA Conseils',
    category: 'Guide d\'achat',
    readTime: '4 min'
  });

  const handleOpenAdd = () => {
    setEditingArticleId(null);
    setForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
      author: 'TOUBA MADIYINA Conseils',
      category: 'Guide d\'achat',
      readTime: '4 min'
    });
    setShowAddModal(true);
  };

  const handleEditClick = (art: Article) => {
    setEditingArticleId(art.id);
    setForm({
      title: art.title,
      slug: art.slug,
      excerpt: art.excerpt,
      content: art.content,
      image: art.image,
      author: art.author,
      category: art.category,
      readTime: art.readTime
    });
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      addToast('Le titre et le contenu sont obligatoires', 'warning');
      return;
    }

    const slug = form.slug.trim() || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (editingArticleId) {
      updateArticle(editingArticleId, {
        ...form,
        slug
      });
      addToast('Article de conseil mis à jour et synchronisé', 'success');
    } else {
      addArticle({
        ...form,
        slug
      });
      addToast('Nouvel article de conseil publié et synchronisé en temps réel sur tous les appareils', 'success');
    }

    setShowAddModal(false);
    setEditingArticleId(null);
  };

  const handleDeleteConfirm = () => {
    if (!articleToDelete) return;
    deleteArticle(articleToDelete.id);
    setArticleToDelete(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900">Articles & Guides de Conseil Dakar</h2>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black">
              {articles.length} publiés
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Publiez des conseils d'utilisation électroménager et guides d'achat synchronisés en direct sur tous les appareils.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black flex items-center gap-2 shadow-md transition-transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un Article</span>
        </button>
      </div>

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((art) => (
          <div
            key={art.id}
            className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col hover:shadow-md transition-shadow"
          >
            <div className="relative h-44 bg-slate-200">
              <img
                src={art.image}
                alt={art.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md">
                {art.category}
              </span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {art.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {art.readTime}
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-900 line-clamp-2">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-medium">
                  Par {art.author}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEditClick(art)}
                    className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Modifier l'article"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setArticleToDelete(art)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                    title="Supprimer l'article"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-12 text-slate-400 text-xs">
          Aucun article de conseil pour le moment. Cliquez sur "Ajouter un Article".
        </div>
      )}

      {/* MODAL: ADD / EDIT ARTICLE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-black text-slate-900">
                {editingArticleId ? 'Modifier l\'Article de Conseil' : 'Publier un Nouvel Article de Conseil'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Titre de l'article *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex: Comment bien choisir son réfrigérateur inverter à Dakar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Catégorie</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600"
                  >
                    <option value="Guide d'achat">Guide d'achat</option>
                    <option value="Économie d'énergie">Économie d'énergie</option>
                    <option value="Entretien & Astuces">Entretien & Astuces</option>
                    <option value="Nouveautés & Tech">Nouveautés & Tech</option>
                    <option value="Installation Dakar">Installation Dakar</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Temps de lecture estimé</label>
                  <input
                    type="text"
                    value={form.readTime}
                    onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                    placeholder="Ex: 4 min"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL de l'image de couverture</label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600"
                />
                {form.image && (
                  <div className="mt-2 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Résumé / Extrait court</label>
                <textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="Bref résumé accrocheur pour le catalogue..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Contenu complet de l'article *</label>
                <textarea
                  rows={8}
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Rédigez ici votre article, guide ou conseil..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Auteur</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  placeholder="TOUBA MADIYINA Conseils"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md"
                >
                  {editingArticleId ? 'Enregistrer les modifications' : 'Publier et synchroniser en direct'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {articleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black text-slate-900">
              Supprimer cet article ?
            </h4>
            <p className="text-xs text-slate-500">
              "{articleToDelete.title}" sera supprimé de la base de données cloud et retiré de tous les appareils.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setArticleToDelete(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md"
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

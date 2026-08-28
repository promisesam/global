import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileEdit, Plus, Trash2, CheckCircle2, HelpCircle, Newspaper, Save } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export const AdminCms: React.FC = () => {
  const { cmsContent, updateCmsContent, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'faq' | 'news'>('faq');

  // New FAQ form
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');
  const [newFaqCategory, setNewFaqCategory] = useState('Logistics');

  // New Post form
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Logistics & Cargo');
  const [newPostSummary, setNewPostSummary] = useState('');
  const [newPostAuthor, setNewPostAuthor] = useState('Senior Operations Desk');

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;

    const updatedFaqs = [
      ...cmsContent.faqs,
      {
        id: `faq-${Date.now()}`,
        question: newFaqQuestion,
        answer: newFaqAnswer,
        category: newFaqCategory,
      }
    ];

    await updateCmsContent({ faqs: updatedFaqs });
    setNewFaqQuestion('');
    setNewFaqAnswer('');
    showToast('success', 'FAQ Item Published', 'The question is now live on the public FAQ page.');
  };

  const handleDeleteFaq = async (id: string) => {
    const updated = cmsContent.faqs.filter(f => f.id !== id);
    await updateCmsContent({ faqs: updated });
    showToast('info', 'FAQ Item Removed', 'Item deleted from database.');
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostSummary.trim()) return;

    const updatedPosts = [
      {
        id: `blog-${Date.now()}`,
        title: newPostTitle,
        category: newPostCategory,
        summary: newPostSummary,
        content: newPostSummary,
        author: newPostAuthor,
        publishedAt: new Date().toISOString(),
      },
      ...cmsContent.blogPosts,
    ];

    await updateCmsContent({ blogPosts: updatedPosts });
    setNewPostTitle('');
    setNewPostSummary('');
    showToast('success', 'Article Published', 'New intelligence bulletin published to public site.');
  };

  const handleDeletePost = async (id: string) => {
    const updated = cmsContent.blogPosts.filter(p => p.id !== id);
    await updateCmsContent({ blogPosts: updated });
    showToast('info', 'Article Removed', 'Post deleted from database.');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Content Management & Knowledge Base</h1>
          <p className="text-xs text-slate-500">Author intelligence bulletins, curate customer FAQs, and manage public notices.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('faq')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'faq' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Customer FAQs ({cmsContent.faqs.length})
        </button>
        <button
          onClick={() => setActiveTab('news')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'news' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Articles & Bulletins ({cmsContent.blogPosts.length})
        </button>
      </div>

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form */}
          <form onSubmit={handleAddFaq} className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" /> Add FAQ Item
            </h3>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={newFaqCategory}
                onChange={(e) => setNewFaqCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              >
                <option>Logistics</option>
                <option>Recruitment</option>
                <option>Visa</option>
                <option>Payments & Security</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Question</label>
              <input
                type="text"
                value={newFaqQuestion}
                onChange={(e) => setNewFaqQuestion(e.target.value)}
                placeholder="e.g. How does cold-chain telemetry work?"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Answer</label>
              <textarea
                rows={4}
                value={newFaqAnswer}
                onChange={(e) => setNewFaqAnswer(e.target.value)}
                placeholder="Detailed regulatory or logistical explanation..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
            >
              Publish Question
            </button>
          </form>

          {/* List */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Existing Questions ({cmsContent.faqs.length})</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {cmsContent.faqs.map((faq) => (
                <div key={faq.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-blue-600 font-mono">{faq.category}</span>
                    <button
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="font-bold text-slate-900">{faq.question}</h4>
                  <p className="text-slate-600 line-clamp-2 text-[11px]">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* News Tab */}
      {activeTab === 'news' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form */}
          <form onSubmit={handleAddPost} className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" /> Publish Intelligence Bulletin
            </h3>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Headline Title</label>
              <input
                type="text"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                placeholder="e.g. GCC Visa Framework Overhaul"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                >
                  <option>Logistics & Cargo</option>
                  <option>Visa & Immigration</option>
                  <option>Global Talent</option>
                  <option>Trade Regulatory</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Author Byline</label>
                <input
                  type="text"
                  value={newPostAuthor}
                  onChange={(e) => setNewPostAuthor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Executive Summary / Content</label>
              <textarea
                rows={4}
                value={newPostSummary}
                onChange={(e) => setNewPostSummary(e.target.value)}
                placeholder="Write the article summary and key policy takeaways..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
            >
              Publish Article
            </button>
          </form>

          {/* List */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Published Articles ({cmsContent.blogPosts.length})</h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {cmsContent.blogPosts.map((post) => (
                <div key={post.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-blue-600 font-mono">{post.category}</span>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{post.title}</h4>
                  <p className="text-slate-600 line-clamp-2 text-xs">{post.summary}</p>
                  <div className="text-[10px] text-slate-400 pt-1">
                    By {post.author} • {formatDate(post.publishedAt)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

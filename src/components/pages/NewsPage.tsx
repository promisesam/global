import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Newspaper, Calendar, ArrowRight, User, Tag, Sparkles } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export const NewsPage: React.FC = () => {
  const { cmsContent } = useApp();
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const posts = cmsContent.blogPosts || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Official Insights & Regulatory Bulletins
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          Global Trade & Mobility Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Stay informed with our latest updates on transatlantic air freight corridors, GCC visa policy reforms, and cross-border tech recruitment trends.
        </p>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full font-mono uppercase">
                  {post.category}
                </span>
                <span className="text-slate-400 flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5" /> {formatDate(post.publishedAt)}
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 font-display line-clamp-2">
                {post.title}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {post.summary}
              </p>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">{post.author}</span>
              <button
                onClick={() => setSelectedPost(post)}
                className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
              >
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Article Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 my-8">
            <div className="bg-slate-900 text-white p-6 flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-blue-400 uppercase font-mono">{selectedPost.category}</span>
                <h3 className="text-xl font-bold font-display">{selectedPost.title}</h3>
                <div className="text-xs text-slate-400">By {selectedPost.author} • {formatDate(selectedPost.publishedAt)}</div>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-8 space-y-4 text-xs leading-relaxed text-slate-700">
              <p className="text-sm font-semibold text-slate-900 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {selectedPost.summary}
              </p>
              <div className="space-y-3">
                <p>
                  As global commerce continues to accelerate, organizations require synchronized logistics infrastructure and swift human capital deployment. Our quarterly review analyzes key logistical KPIs, customs wait-times, and consular turnaround windows.
                </p>
                <p>
                  Specialized corridors between London, Frankfurt, and Dubai have experienced a 34% increase in temperature-sensitive biological transport, driven by advancements in cold-chain sensor technology and direct belly-hold priority routing.
                </p>
                <p>
                  Furthermore, updated visa frameworks in the GCC and the United Kingdom are facilitating smoother transitions for technical experts and corporate leadership. Our dedicated immigration desk remains in continuous liaison with consular representatives to ensure compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

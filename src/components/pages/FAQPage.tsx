import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageSquare, Phone, Calendar } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const { cmsContent, setCurrentView, setAppointmentModalOpen } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');

  const faqs = cmsContent.faqs || [];

  const categories = ['all', 'Logistics', 'Recruitment', 'Visa', 'Payments & Security'];

  const filteredFaqs = faqs.filter(f => {
    const matchesSearch = f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || f.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCat;
  });

  const toggleAccordion = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Everything you need to know regarding air waybill tracking, cross-border talent relocation, and consular visa requirements.
        </p>
      </div>

      {/* Search & Categories */}
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search questions (e.g. customs clearance, golden visa, interview process)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat === 'all' ? 'All Topics' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
            No matching questions found. Please adjust your search criteria or contact our support team.
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition"
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/50 transition cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider font-mono">
                      {faq.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{faq.question}</h3>
                  </div>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/30">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Still need help CTA */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm">Still have unanswered questions?</h4>
          <p className="text-xs text-slate-400 mt-0.5">Our 24/7 client operations desk is ready to assist you.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentView('contact')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition"
          >
            Contact Desk
          </button>
          <button
            onClick={() => setAppointmentModalOpen(true)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition border border-slate-700"
          >
            Book Slot
          </button>
        </div>
      </div>
    </div>
  );
};

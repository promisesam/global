import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LifeBuoy, Send, Plus, MessageSquare, Clock, User, CheckCircle2, X } from 'lucide-react';
import { formatStatus, formatDate, getStatusBadgeColor } from '../../lib/utils';

export const CustomerTickets: React.FC = () => {
  const { tickets, currentUser, createSupportTicket, sendTicketMessage } = useApp();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(tickets[0]?.id || null);
  const [replyText, setReplyText] = useState('');
  const [newTicketModal, setNewTicketModal] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState<'logistics' | 'recruitment' | 'visa' | 'billing' | 'general'>('logistics');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [newInitialMsg, setNewInitialMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userTickets = tickets.filter(t => t.userId === currentUser.id);
  const activeTicket = tickets.find(t => t.id === selectedTicketId) || userTickets[0];

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await createSupportTicket({
        subject: newSubject,
        category: newCategory,
        priority: newPriority,
        initialMessage: newInitialMsg,
      });
      setIsSubmitting(false);
      setNewTicketModal(false);
      setSelectedTicketId(created.id);
      setNewSubject('');
      setNewInitialMsg('');
    } catch {
      setIsSubmitting(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;
    await sendTicketMessage(activeTicket.id, replyText);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Client Support & Inquiries</h1>
          <p className="text-xs text-slate-500">Real-time messaging with assigned logistics managers, visa officers, and billing agents.</p>
        </div>

        <button
          onClick={() => setNewTicketModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Open New Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Ticket List Column */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
            My Support Tickets ({userTickets.length})
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
            {userTickets.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">No support tickets found.</div>
            ) : (
              userTickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer text-xs space-y-1.5 ${
                    activeTicket?.id === t.id
                      ? 'bg-blue-50/80 border-blue-500 ring-1 ring-blue-400'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-slate-500">#{t.ticketNumber}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadgeColor(t.status)}`}>
                      {formatStatus(t.status)}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 line-clamp-1">{t.subject}</h4>
                  <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                    <span className="uppercase font-semibold text-blue-600">{t.category}</span>
                    <span>{formatDate(t.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Thread Column */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-[500px]">
          {activeTicket ? (
            <>
              {/* Thread Header */}
              <div className="p-5 border-b border-slate-200 bg-slate-50/50 rounded-t-2xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-600">Ticket #{activeTicket.ticketNumber}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getStatusBadgeColor(activeTicket.status)}`}>
                    {formatStatus(activeTicket.status)}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{activeTicket.subject}</h3>
                <div className="text-[11px] text-slate-500">
                  Assigned Staff: <strong className="text-slate-800">{activeTicket.assignedStaffName || 'Support Desk Lead'}</strong>
                </div>
              </div>

              {/* Message Bubbles */}
              <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-96">
                {activeTicket.messages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id || msg.senderRole === 'customer';
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className="text-[10px] text-slate-400 mb-1 flex items-center gap-1.5">
                        <span className="font-semibold text-slate-700">{msg.senderName}</span>
                        <span>•</span>
                        <span>{formatDate(msg.timestamp)}</span>
                      </div>
                      <div className={`p-3.5 rounded-2xl text-xs max-w-sm sm:max-w-md leading-relaxed whitespace-pre-wrap ${
                        isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex gap-2">
                <input
                  type="text"
                  placeholder="Type your response message..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
              </form>
            </>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400 my-auto">
              Select or open a ticket to start messaging with support.
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {newTicketModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900">Open Priority Support Ticket</h3>
              <button onClick={() => setNewTicketModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Flight delay query for APX-98241"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="logistics">Courier & Cargo</option>
                    <option value="visa">Visa & Consular</option>
                    <option value="recruitment">Recruitment & Interview</option>
                    <option value="billing">Invoices & Payments</option>
                    <option value="general">General Support</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority Level</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Standard Medium</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent Escalation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Initial Message Description</label>
                <textarea
                  rows={4}
                  value={newInitialMsg}
                  onChange={(e) => setNewInitialMsg(e.target.value)}
                  placeholder="Provide reference numbers, details or specific questions..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs leading-relaxed"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewTicketModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
                >
                  {isSubmitting ? 'Transmitting...' : 'Dispatch Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

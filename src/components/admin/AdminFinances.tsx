import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreditCard, FileText, CheckCircle2, Clock, Search, DollarSign, Download, Plus } from 'lucide-react';
import { formatStatus, formatDate, getStatusBadgeColor } from '../../lib/utils';
import { formatPrice } from '../../lib/currencies';

export const AdminFinances: React.FC = () => {
  const { invoices, updateInvoice, setSelectedInvoice, currency, showToast, openCreateInvoiceModal } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const totalInvoiced = invoices.reduce((sum, i) => sum + i.total, 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0);
  const totalUnpaid = invoices.filter(i => i.status === 'unpaid').reduce((sum, i) => sum + i.total, 0);

  const filteredInvoices = invoices.filter(i => {
    return i.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
           i.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           i.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleMarkPaid = async (invId: string) => {
    await updateInvoice(invId, {
      status: 'paid',
      paymentMethod: 'Manual Wire / Corporate Credit Recon',
      paymentDate: new Date().toISOString(),
    });
    showToast('success', 'Invoice Settled', 'Invoice marked as paid and reconciled.');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.04] backdrop-blur-2xl p-6 rounded-2xl border border-white/10 shadow-sm text-white">
        <div>
          <h1 className="text-xl font-bold text-white font-display">Invoicing & Financial Ledger</h1>
          <p className="text-xs text-slate-400">Corporate accounts receivable, VAT tax reporting, hotel stays, flight receipts, and Stripe/PayPal reconciliation.</p>
        </div>

        <button
          onClick={() => openCreateInvoiceModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/25 border border-white/10 transition"
        >
          <Plus className="w-4 h-4" /> Create Custom Invoice
        </button>
      </div>

      {/* Summary Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-500 font-bold uppercase text-[10px]">Total Billed Volume</span>
          <div className="text-2xl font-black text-slate-900 font-display">{formatPrice(totalInvoiced, currency)}</div>
          <div className="text-slate-400 text-[11px]">{invoices.length} Total invoices generated</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-500 font-bold uppercase text-[10px]">Settled & Reconciled</span>
          <div className="text-2xl font-black text-emerald-600 font-display">{formatPrice(totalPaid, currency)}</div>
          <div className="text-emerald-700 text-[11px] font-medium">Bank transfer & card payments</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-500 font-bold uppercase text-[10px]">Accounts Receivable (Unpaid)</span>
          <div className="text-2xl font-black text-amber-600 font-display">{formatPrice(totalUnpaid, currency)}</div>
          <div className="text-amber-700 text-[11px] font-medium">
            {invoices.filter(i => i.status === 'unpaid').length} Invoices pending settlement
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by invoice #, customer name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Service Description</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{inv.customerName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{inv.customerEmail}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <div>{inv.serviceType}</div>
                    {inv.trackingNumber && (
                      <div className="text-[10px] text-blue-600 font-mono">Ref: {inv.trackingNumber}</div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {formatDate(inv.issueDate)}
                  </td>
                  <td className="py-3.5 px-4 font-black text-slate-900 text-sm font-display">
                    {formatPrice(inv.total, currency)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getStatusBadgeColor(inv.status)}`}>
                      {formatStatus(inv.status)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition inline-flex"
                      title="Inspect Tax Invoice"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                    {inv.status === 'unpaid' && (
                      <button
                        onClick={() => handleMarkPaid(inv.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg transition inline-flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Reconcile Paid</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

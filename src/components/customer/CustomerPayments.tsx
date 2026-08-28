import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Download, 
  DollarSign, 
  ShieldCheck 
} from 'lucide-react';
import { formatStatus, formatDate, getStatusBadgeColor } from '../../lib/utils';
import { formatPrice } from '../../lib/currencies';

export const CustomerPayments: React.FC = () => {
  const { 
    invoices, 
    currentUser, 
    setSelectedInvoice, 
    openCheckout, 
    currency 
  } = useApp();

  const userInvoices = invoices.filter(i => i.customerEmail === currentUser.email || i.id);

  const totalBilled = userInvoices.reduce((sum, i) => sum + i.total, 0);
  const totalPaid = userInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0);
  const totalUnpaid = userInvoices.filter(i => i.status === 'unpaid').reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
        <h1 className="text-xl font-bold text-slate-900 font-display">Invoices & Financial Ledger</h1>
        <p className="text-xs text-slate-500">View detailed commercial tax invoices, check transaction status, and process instant electronic payments.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-500 font-bold uppercase text-[10px]">Total Invoiced</span>
          <div className="text-2xl font-black text-slate-900 font-display">{formatPrice(totalBilled, currency)}</div>
          <div className="text-slate-400 text-[11px]">{userInvoices.length} Invoices generated</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-500 font-bold uppercase text-[10px]">Settled / Paid</span>
          <div className="text-2xl font-black text-emerald-600 font-display">{formatPrice(totalPaid, currency)}</div>
          <div className="text-emerald-700 text-[11px] font-medium">Reconciled with bank</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-500 font-bold uppercase text-[10px]">Pending Due</span>
          <div className="text-2xl font-black text-amber-600 font-display">{formatPrice(totalUnpaid, currency)}</div>
          <div className="text-amber-700 text-[11px] font-medium">
            {userInvoices.filter(i => i.status === 'unpaid').length} Invoices awaiting checkout
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Service Category</th>
                <th className="py-3.5 px-4">Issued / Due</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    <div>{inv.serviceType}</div>
                    {inv.trackingNumber && (
                      <div className="text-[10px] text-blue-600 font-mono">Ref: {inv.trackingNumber}</div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                    <div>Issued: {formatDate(inv.issueDate)}</div>
                    <div>Due: {formatDate(inv.dueDate)}</div>
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
                      title="View Printable Tax Invoice"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                    {inv.status === 'unpaid' && (
                      <button
                        onClick={() => openCheckout({
                          serviceType: inv.serviceType,
                          amount: inv.total,
                          description: `Payment for Invoice #${inv.invoiceNumber}`,
                          invoiceId: inv.id,
                        })}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg transition inline-flex items-center gap-1 shadow-sm"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay Now</span>
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

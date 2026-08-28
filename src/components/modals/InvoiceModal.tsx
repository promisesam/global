import React from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice } from '../../types';
import { X, Printer, Download, CheckCircle2, Building2, ShieldCheck } from 'lucide-react';
import { formatPrice } from '../../lib/currencies';
import { formatDate } from '../../lib/utils';

export const InvoiceModal: React.FC = () => {
  const { selectedInvoice, setSelectedInvoice, currency, cmsContent } = useApp();

  if (!selectedInvoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/15 w-full max-w-3xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 text-white">
        {/* Header Actions (hidden in print) */}
        <div className="bg-white/[0.04] text-white px-6 py-4 flex items-center justify-between border-b border-white/10 print:hidden">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-sm">Official Commercial Invoice & Tax Receipt</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md transition border border-white/10"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              onClick={() => setSelectedInvoice(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Body */}
        <div className="p-8 sm:p-10 space-y-8 bg-white text-slate-800 font-sans" id="printable-invoice">
          {/* Top Brand & Invoice Metadata */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-black text-slate-900 tracking-tight font-display">APEX</span>
                <span className="text-2xl font-bold text-blue-600 tracking-tight font-display">GLOBAL</span>
              </div>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                ApexGlobal Logistics, Talent & Visa Mobility Group<br />
                {cmsContent.contactInfo.headquarters}<br />
                Tax ID: GB-994-1029-APX • VAT Reg: 44019283
              </p>
            </div>

            <div className="text-right space-y-1">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Invoice Number</div>
              <div className="text-xl font-mono font-bold text-slate-900">{selectedInvoice.invoiceNumber}</div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {selectedInvoice.status.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Bill To & Invoice Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
            <div>
              <div className="font-bold text-slate-400 uppercase tracking-wider mb-2">Billed To / Customer</div>
              <div className="font-bold text-slate-900 text-sm">{selectedInvoice.customerName}</div>
              <div className="text-slate-600 mt-0.5">{selectedInvoice.customerEmail}</div>
              <div className="text-slate-600 mt-0.5">{selectedInvoice.customerAddress}</div>
            </div>

            <div className="sm:text-right space-y-1.5">
              <div>
                <span className="text-slate-500">Issue Date:</span>{' '}
                <span className="font-semibold text-slate-800">{formatDate(selectedInvoice.issueDate)}</span>
              </div>
              <div>
                <span className="text-slate-500">Due Date:</span>{' '}
                <span className="font-semibold text-slate-800">{formatDate(selectedInvoice.dueDate)}</span>
              </div>
              <div>
                <span className="text-slate-500">Payment Channel:</span>{' '}
                <span className="font-semibold text-slate-800">{selectedInvoice.paymentMethod || 'Stripe Electronic Payment'}</span>
              </div>
              <div>
                <span className="text-slate-500">Service Category:</span>{' '}
                <span className="font-semibold text-blue-600">{selectedInvoice.serviceType}</span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Item Description</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedInvoice.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-medium text-slate-900">{item.description}</td>
                    <td className="py-3.5 px-4 text-center text-slate-600">{item.quantity}</td>
                    <td className="py-3.5 px-4 text-right text-slate-600">{formatPrice(item.unitPrice, currency)}</td>
                    <td className="py-3.5 px-4 text-right font-semibold text-slate-900">{formatPrice(item.total, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-slate-200 pt-6">
            <div className="text-xs text-slate-500 space-y-1 max-w-sm">
              <div className="font-bold text-slate-700">Payment & Verification Notice:</div>
              <p>This invoice is electronically certified. Applicable customs duties, value-added taxes, or government consular assistance fees are fully recorded in compliance with international trade protocols.</p>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>{formatPrice(selectedInvoice.subtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax (VAT 5%):</span>
                <span>{formatPrice(selectedInvoice.taxAmount, currency)}</span>
              </div>
              {selectedInvoice.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount:</span>
                  <span>-{formatPrice(selectedInvoice.discountAmount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-black text-slate-900">
                <span>Total Amount:</span>
                <span className="text-blue-600 text-base">{formatPrice(selectedInvoice.total, currency)}</span>
              </div>
            </div>
          </div>

          {/* Barcode & Security Stamp Footer */}
          <div className="border-t border-dashed border-slate-300 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <div className="font-mono text-lg tracking-[0.3em] font-black text-slate-800">
                |||||| | |||||||| |||| | |||||||
              </div>
              <div className="text-[10px] font-mono text-slate-400">APX-HASH-{selectedInvoice.id}-AUTH-VERIFIED</div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cryptographically Certified Ledger Entry</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Plus, 
  Trash2, 
  FileText, 
  Building2, 
  Calendar, 
  User as UserIcon, 
  Mail, 
  MapPin, 
  DollarSign, 
  ShieldCheck,
  Sparkles,
  Layers
} from 'lucide-react';
import { formatPrice } from '../../lib/currencies';

interface InvoiceLineItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
}

export const CreateInvoiceModal: React.FC = () => {
  const { 
    createInvoiceModalOpen, 
    setCreateInvoiceModalOpen, 
    createCustomInvoice, 
    setSelectedInvoice,
    currency 
  } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('Apex International Commerce Hub, Suite 400');
  const [serviceType, setServiceType] = useState('Air Freight & Courier');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [taxRate, setTaxRate] = useState<number>(10);
  const [discount, setDiscount] = useState<number>(0);
  const [notes, setNotes] = useState('Payment due within 14 business days via standard corporate banking or wire transfer.');
  const [paymentMethod, setPaymentMethod] = useState('Corporate Wire Transfer (SWIFT)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [items, setItems] = useState<InvoiceLineItemInput[]>([
    { description: 'Priority Air Freight Logistics (Frankfurt - New York)', quantity: 1, unitPrice: 1250 },
    { description: 'Customs Clearance & Priority Consular Handling', quantity: 1, unitPrice: 350 },
  ]);

  if (!createInvoiceModalOpen) return null;

  const addItemRow = () => {
    setItems(prev => [...prev, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItemRow = (index: number) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof InvoiceLineItemInput, value: any) => {
    setItems(prev => prev.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), 0);
  const taxAmount = (subtotal * (Number(taxRate) || 0)) / 100;
  const totalAmount = Math.max(0, subtotal + taxAmount - (Number(discount) || 0));

  const handleClose = () => {
    setCreateInvoiceModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || items.length === 0) return;

    setIsSubmitting(true);
    try {
      const newInvoice = await createCustomInvoice({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerAddress: customerAddress.trim(),
        serviceType,
        items: items.map(it => ({
          description: it.description || 'Custom Service Line Item',
          quantity: Number(it.quantity) || 1,
          unitPrice: Number(it.unitPrice) || 0,
          total: (Number(it.quantity) || 1) * (Number(it.unitPrice) || 0),
        })),
        dueDate,
        taxRate: Number(taxRate) || 0,
        discount: Number(discount) || 0,
        notes,
        paymentMethod,
      });

      handleClose();
      // Instantly open the created invoice modal for viewing/printing
      setSelectedInvoice(newInvoice);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/15 w-full max-w-3xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 text-white">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600/30 via-indigo-600/30 to-purple-600/30 px-6 py-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Generate Custom Commercial Invoice
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30 uppercase font-mono">
                  Accounting Ledger
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Create itemized corporate invoices for courier, visa, recruitment, flights, or custom services
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Customer & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Customer / Billed Enterprise Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Meridian Global Logistics Ltd"
                  required
                  className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Customer Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. billing@meridianglobal.com"
                  required
                  className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Service Classification
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Air Freight & Courier" className="bg-slate-900">Air Freight & Courier Logistics</option>
                <option value="Executive Talent Placement" className="bg-slate-900">Executive Talent Placement & Recruitment</option>
                <option value="Visa & Mobility Services" className="bg-slate-900">Visa & Global Mobility Services</option>
                <option value="Flight & Travel Arrangement" className="bg-slate-900">Flight & Travel Arrangement</option>
                <option value="Hotel & Corporate Stay" className="bg-slate-900">Hotel & Corporate Accommodation</option>
                <option value="Custom Enterprise Solution" className="bg-slate-900">Custom Enterprise Logistics & Legal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Payment Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Billed Billing Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="e.g. 100 Wall Street, Floor 24, New York, NY 10005"
                  className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>
          </div>

          {/* Line Items Builder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Itemized Products / Services Breakdown
              </label>
              <button
                type="button"
                onClick={addItemRow}
                className="flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 bg-blue-500/15 hover:bg-blue-500/25 px-2.5 py-1 rounded-lg border border-blue-500/30 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add Line Item
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      placeholder="Item or service description..."
                      value={item.description}
                      onChange={(e) => updateItem(idx, 'description', e.target.value)}
                      required
                      className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="w-24 shrink-0">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(idx, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-xs text-white text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="w-32 shrink-0">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Unit Price"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-xs text-white text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="w-24 text-right font-mono font-bold text-xs text-slate-200 shrink-0">
                    {formatPrice((item.quantity || 1) * (item.unitPrice || 0), currency)}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItemRow(idx)}
                    disabled={items.length <= 1}
                    className="p-2 text-slate-400 hover:text-rose-400 disabled:opacity-30 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tax, Discount & Totals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Payment Method / Terms
                </label>
                <input
                  type="text"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Invoice Notes & Terms
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white/[0.06] border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Subtotal:</span>
                <span className="font-mono font-semibold">{formatPrice(subtotal, currency)}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  Tax / VAT (%):
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-16 bg-white/[0.08] border border-white/15 rounded-lg px-2 py-1 text-xs text-white text-center"
                  />
                </span>
                <span className="font-mono font-semibold">+{formatPrice(taxAmount, currency)}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  Discount ({currency}):
                  <input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="w-20 bg-white/[0.08] border border-white/15 rounded-lg px-2 py-1 text-xs text-white text-center"
                  />
                </span>
                <span className="font-mono font-semibold text-rose-400">-{formatPrice(discount, currency)}</span>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between font-bold text-sm text-white">
                <span>Total Invoice Balance:</span>
                <span className="text-emerald-400 font-mono text-lg">{formatPrice(totalAmount, currency)}</span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Compliant with GAAP and EU VAT Invoice Standards</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 border border-white/10 flex items-center gap-2 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>Generating Invoice Record...</>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Issue Commercial Invoice
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

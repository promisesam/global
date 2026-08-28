import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CreditCard, ShieldCheck, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatPrice } from '../../lib/currencies';
import confetti from 'canvas-confetti';

export const CheckoutModal: React.FC = () => {
  const { checkoutModalData, closeCheckout, processPayment, currency } = useApp();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!checkoutModalData.open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate Stripe Gateway API request latency
    setTimeout(async () => {
      try {
        await processPayment({
          serviceType: checkoutModalData.serviceType,
          amount: checkoutModalData.amount,
          currency: 'USD',
          paymentMethod: paymentMethod === 'card' ? 'Credit/Debit Card (Stripe)' : 'PayPal',
          invoiceId: checkoutModalData.invoiceId,
          relatedEntityId: checkoutModalData.relatedEntityId,
        });

        setIsProcessing(false);
        setPaymentSuccess(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });

        setTimeout(() => {
          setPaymentSuccess(false);
          closeCheckout();
        }, 2200);
      } catch {
        setIsProcessing(false);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900/90 backdrop-blur-2xl text-white rounded-2xl shadow-2xl border border-white/15 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-white/[0.04] text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-sm">Secure Payment Gateway (PCI-DSS)</span>
          </div>
          <button onClick={closeCheckout} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white">Payment Confirmed!</h3>
            <p className="text-xs text-slate-300">
              Your transaction has been recorded. Commercial invoice and service receipt are generated.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Amount Summary */}
            <div className="bg-white/[0.05] p-4 rounded-xl border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase font-bold text-slate-400">{checkoutModalData.serviceType}</div>
                <div className="text-xs text-slate-200 mt-0.5 line-clamp-1">{checkoutModalData.description}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-blue-400 font-display">
                  {formatPrice(checkoutModalData.amount, currency)}
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                  paymentMethod === 'card'
                    ? 'border-blue-500/50 bg-blue-600/30 text-blue-300 shadow-md backdrop-blur-md'
                    : 'border-white/10 text-slate-300 hover:bg-white/5'
                }`}
              >
                <CreditCard className="w-4 h-4" /> Credit / Debit (Stripe)
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('paypal')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                  paymentMethod === 'paypal'
                    ? 'border-blue-500/50 bg-blue-600/30 text-blue-300 shadow-md backdrop-blur-md'
                    : 'border-white/10 text-slate-300 hover:bg-white/5'
                }`}
              >
                <span>PayPal Express</span>
              </button>
            </div>

            {/* Card Inputs */}
            {paymentMethod === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-white/[0.07] border border-white/15 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="4242 4242 4242 4242"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Expires (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-white/[0.07] border border-white/15 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                      placeholder="12/28"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">CVC / CVV</label>
                    <input
                      type="password"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full bg-white/[0.07] border border-white/15 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                      placeholder="•••"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="p-4 bg-sky-500/10 rounded-xl border border-sky-500/20 text-xs text-sky-200 space-y-1">
                <p className="font-semibold text-sky-300">PayPal One-Touch Active</p>
                <p className="text-[11px] text-slate-300">Click below to authorize instantaneous checkout via connected PayPal account.</p>
              </div>
            )}

            {/* Security Badge */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>256-bit TLS encrypted transaction with instant webhook reconciliation.</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 border border-white/10 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>Processing Payment with Bank...</>
              ) : (
                <>
                  <span>Authorize {formatPrice(checkoutModalData.amount, currency)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

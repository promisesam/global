import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, Mail, User, Phone, Globe2, ShieldCheck, X, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, loginUser, registerUser, switchPersona } = useApp();
  const [isRegister, setIsRegister] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const [role, setRole] = useState<'customer' | 'staff' | 'admin'>('customer');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isRegister) {
        await registerUser({
          name,
          email,
          phone,
          country,
          role,
        });
      } else {
        await loginUser(email || 'customer@apexglobal.com', password || 'password123');
      }
      setIsSubmitting(false);
      setAuthModalOpen(false);
    } catch {
      setIsSubmitting(false);
    }
  };

  const handleQuickPersona = (personaRole: 'customer' | 'admin' | 'staff') => {
    switchPersona(personaRole);
    setAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900/90 backdrop-blur-2xl text-white rounded-3xl border border-white/15 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 my-8 text-xs">
        {/* Header */}
        <div className="p-6 relative border-b border-white/10 bg-white/[0.03]">
          <button
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider font-mono">
            <Lock className="w-4 h-4" /> Secure Enterprise Access
          </div>
          <h2 className="text-xl font-bold text-white font-display mt-1">
            {isRegister ? 'Create ApexGlobal Account' : 'Sign In to Portal'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access real-time air cargo waybills, recruitment dossiers, and consular visa portals.
          </p>
        </div>

        {/* Demo Fast Login Switcher */}
        <div className="p-5 bg-white/[0.02] border-b border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-slate-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Instant Demo Role Switcher:
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[11px] font-semibold">
            <button
              onClick={() => handleQuickPersona('customer')}
              className="py-1.5 px-2 rounded-xl bg-white/10 border border-white/15 hover:bg-blue-600/30 hover:border-blue-400 text-slate-200 shadow-sm transition"
            >
              Customer
            </button>
            <button
              onClick={() => handleQuickPersona('admin')}
              className="py-1.5 px-2 rounded-xl bg-white/10 border border-white/15 hover:bg-amber-600/30 hover:border-amber-400 text-slate-200 shadow-sm transition"
            >
              Super Admin
            </button>
            <button
              onClick={() => handleQuickPersona('staff')}
              className="py-1.5 px-2 rounded-xl bg-white/10 border border-white/15 hover:bg-purple-600/30 hover:border-purple-400 text-slate-200 shadow-sm transition"
            >
              Staff Officer
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isRegister && (
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Full Legal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alexander Wright"
                className="w-full bg-white/[0.07] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alexander.wright@company.com"
              className="w-full bg-white/[0.07] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          {isRegister && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+44 7911 123456"
                  className="w-full bg-white/[0.07] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="United Kingdom"
                  className="w-full bg-white/[0.07] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-white/[0.07] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 border border-white/15 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isSubmitting ? 'Authenticating...' : isRegister ? 'Complete Registration' : 'Sign In Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs font-semibold text-blue-400 hover:underline"
            >
              {isRegister
                ? 'Already have an account? Sign In'
                : "Don't have an account? Register Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

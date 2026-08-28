import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';
import { UserRole } from '../../types';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, loginUser, registerUser, switchUserRole } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('ApexSecurePass2026!');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (isRegister) {
      await registerUser(name, email, phone);
    } else {
      await loginUser(email, password);
    }
    setIsSubmitting(false);
  };

  const handleQuickRole = (role: UserRole) => {
    switchUserRole(role);
    setAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-sm">
              {isRegister ? 'Create ApexGlobal Account' : 'Sign In to Customer & Staff Hub'}
            </span>
          </div>
          <button onClick={() => setAuthModalOpen(false)} className="p-1 text-slate-400 hover:text-white rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isRegister && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alexander Wright"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition"
            >
              {isSubmitting ? 'Authenticating...' : isRegister ? 'Complete Registration' : 'Sign In'}
            </button>
          </form>

          {/* Toggle */}
          <div className="text-center pt-2 border-t border-slate-100">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-blue-600 font-semibold hover:underline"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
            </button>
          </div>

          {/* 1-Click Demo Profiles */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Instant Test Switch (1-Click Login):</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleQuickRole('customer')}
                className="text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-500 transition text-[11px]"
              >
                <div className="font-semibold text-slate-900">Alexander W.</div>
                <div className="text-slate-500 text-[10px]">Customer Portal</div>
              </button>
              <button
                onClick={() => handleQuickRole('super_admin')}
                className="text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-500 transition text-[11px]"
              >
                <div className="font-semibold text-slate-900">Eleanor Vance</div>
                <div className="text-blue-600 text-[10px] font-bold">Super Admin</div>
              </button>
              <button
                onClick={() => handleQuickRole('logistics_manager')}
                className="text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-500 transition text-[11px]"
              >
                <div className="font-semibold text-slate-900">Marcus Chen</div>
                <div className="text-slate-500 text-[10px]">Logistics Manager</div>
              </button>
              <button
                onClick={() => handleQuickRole('visa_officer')}
                className="text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-500 transition text-[11px]"
              >
                <div className="font-semibold text-slate-900">Claire Dupont</div>
                <div className="text-slate-500 text-[10px]">Visa Officer</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

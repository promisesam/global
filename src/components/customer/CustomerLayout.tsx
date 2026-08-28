import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Package, 
  Briefcase, 
  FileCheck2, 
  Plane,
  FolderLock, 
  CreditCard, 
  Calendar, 
  LifeBuoy, 
  Settings, 
  Plus, 
  ShieldCheck, 
  User, 
  Sparkles,
  ArrowRight,
  LogOut,
  PlayCircle
} from 'lucide-react';
import { CustomerOnboardingModal } from './CustomerOnboardingModal';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const { currentView, setCurrentView, currentUser, t, setAppointmentModalOpen, logoutUser } = useApp();
  const [tourModalOpen, setTourModalOpen] = useState(false);

  const customerNavItems = [
    { key: 'customer-overview', label: 'Account Overview', icon: LayoutDashboard },
    { key: 'customer-travel', label: 'Flights & Hotels', icon: Plane },
    { key: 'customer-shipments', label: 'My Consignments', icon: Package },
    { key: 'customer-jobs', label: 'Job Applications', icon: Briefcase },
    { key: 'customer-visas', label: 'Visa Dossiers', icon: FileCheck2 },
    { key: 'customer-documents', label: 'Encrypted Vault', icon: FolderLock },
    { key: 'customer-payments', label: 'Invoices & Ledger', icon: CreditCard },
    { key: 'customer-appointments', label: 'Consultations', icon: Calendar },
    { key: 'customer-tickets', label: 'Support Desk', icon: LifeBuoy },
    { key: 'customer-settings', label: 'Account Settings', icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
      
      {/* Onboarding Tour Modal */}
      <CustomerOnboardingModal
        isOpen={tourModalOpen}
        onClose={() => setTourModalOpen(false)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Customer Sidebar Navigation */}
        <aside className="lg:col-span-3 bg-white/[0.04] backdrop-blur-2xl rounded-3xl border border-white/10 p-5 shadow-2xl space-y-6">
          {/* User Profile Capsule */}
          <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 text-white space-y-3 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30 border border-white/20">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 backdrop-blur-sm">
                <ShieldCheck className="w-3 h-3" /> KYC Verified
              </span>
            </div>

            <div>
              <div className="font-bold text-sm text-white line-clamp-1">{currentUser.name}</div>
              <div className="text-[11px] text-slate-400 font-mono truncate">{currentUser.email}</div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1 text-xs font-semibold">
            {customerNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setCurrentView(item.key)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40 shadow-lg shadow-blue-500/10 font-bold backdrop-blur-md'
                      : 'text-slate-300 hover:bg-white/[0.07] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Tour & Actions */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <button
              onClick={() => setTourModalOpen(true)}
              className="w-full py-2.5 bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 border border-amber-400/30 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Guided Portal Tour</span>
            </button>

            <button
              onClick={() => setAppointmentModalOpen(true)}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 border border-white/10"
            >
              <Calendar className="w-3.5 h-3.5 text-sky-200" />
              <span>Book Consultation</span>
            </button>

            <button
              onClick={logoutUser}
              className="w-full py-2 text-slate-400 hover:text-rose-400 text-xs font-medium transition flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-9 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};

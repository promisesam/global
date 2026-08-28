import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, 
  BarChart3, 
  PackageCheck, 
  Briefcase, 
  FileCheck2, 
  Users, 
  CreditCard, 
  Calendar, 
  History, 
  FileEdit, 
  Settings, 
  ArrowLeft,
  Lock,
  Globe2,
  Sparkles,
  LogOut
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { currentView, setCurrentView, currentUser, logoutUser } = useApp();

  const adminNav = [
    { key: 'admin-dashboard', label: 'Analytics & Reporting', icon: BarChart3 },
    { key: 'admin-shipments', label: 'Consignments & Waypoints', icon: PackageCheck },
    { key: 'admin-jobs', label: 'Recruitment & Candidates', icon: Briefcase },
    { key: 'admin-visas', label: 'Consular & Visa Station', icon: FileCheck2 },
    { key: 'admin-finances', label: 'Invoicing & Revenue', icon: CreditCard },
    { key: 'admin-users', label: 'Users & RBAC Directory', icon: Users },
    { key: 'admin-audit', label: 'Security & Audit Trail', icon: History },
    { key: 'admin-cms', label: 'CMS & Intelligence Posts', icon: FileEdit },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Admin Navigation Sidebar */}
        <aside className="lg:col-span-3 bg-white/[0.04] backdrop-blur-2xl text-white rounded-3xl p-5 border border-white/10 shadow-2xl space-y-6">
          {/* Admin Header */}
          <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 space-y-2 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-mono flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Operations HQ
              </span>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-mono font-bold border border-rose-500/30">
                SUPERADMIN
              </span>
            </div>
            <div className="font-bold text-sm text-white">{currentUser.name}</div>
            <div className="text-[11px] text-slate-400 font-mono truncate">{currentUser.email}</div>
          </div>

          {/* Nav items */}
          <nav className="space-y-1 text-xs font-semibold">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setCurrentView(item.key)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/40 shadow-lg shadow-blue-500/15 backdrop-blur-md'
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

          {/* Quick exit and switcher */}
          <div className="pt-3 border-t border-white/10 space-y-2 text-xs">
            <button
              onClick={() => setCurrentView('customer-overview')}
              className="w-full py-2.5 px-3 bg-white/10 hover:bg-white/15 text-blue-300 font-semibold rounded-xl transition flex items-center justify-center gap-2 border border-white/10 backdrop-blur-md"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Customer View
            </button>
            <button
              onClick={logoutUser}
              className="w-full py-2 text-slate-400 hover:text-rose-400 transition flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Terminate Session
            </button>
          </div>
        </aside>

        {/* Main Content View */}
        <main className="lg:col-span-9 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};

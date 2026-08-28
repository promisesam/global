import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  Globe2, 
  Plane, 
  Briefcase, 
  FileCheck2, 
  Search, 
  Bell, 
  User as UserIcon, 
  ShieldAlert, 
  Menu, 
  X, 
  DollarSign, 
  ChevronDown, 
  LogOut, 
  ExternalLink,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';
import { CURRENCIES, CurrencyCode } from '../../lib/currencies';
import { Language } from '../../i18n/translations';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    language, 
    setLanguage, 
    currency, 
    setCurrency, 
    t, 
    currentUser, 
    switchUserRole, 
    logoutUser, 
    setAuthModalOpen,
    trackShipmentByNumber,
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [personaMenuOpen, setPersonaMenuOpen] = useState(false);
  const [quickTrackInput, setQuickTrackInput] = useState('');

  const handleQuickTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTrackInput.trim()) return;
    await trackShipmentByNumber(quickTrackInput);
    setCurrentView('tracking');
    setQuickTrackInput('');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { key: 'home', label: t.nav.home },
    { key: 'travel', label: 'Flights & Hotels', icon: Plane },
    { key: 'tracking', label: t.nav.tracking, icon: Package },
    { key: 'jobs', label: t.nav.jobs, icon: Briefcase },
    { key: 'visa', label: t.nav.visa, icon: FileCheck2 },
    { key: 'services', label: t.nav.services },
    { key: 'pricing', label: t.nav.pricing },
    { key: 'about', label: t.nav.about },
    { key: 'faq', label: t.nav.faq },
    { key: 'blog', label: t.nav.news },
    { key: 'contact', label: t.nav.contact },
  ];

  const rolesList: { role: UserRole; label: string; badge: string; desc: string }[] = [
    { role: 'customer', label: 'Alexander Wright', badge: 'Customer', desc: 'Manage personal shipments, jobs & visa filings' },
    { role: 'super_admin', label: 'Eleanor Vance', badge: 'Super Admin', desc: 'Full enterprise control & system management' },
    { role: 'logistics_manager', label: 'Marcus Chen', badge: 'Logistics Mgr', desc: 'Air/sea cargo, checkpoints & tracking' },
    { role: 'recruitment_manager', label: 'Sophia Al-Mansoor', badge: 'Recruitment Lead', desc: 'Vacancies, candidates & interviews' },
    { role: 'visa_officer', label: 'Claire Dupont', badge: 'Visa Officer', desc: 'Dossier reviews & consular schedules' },
    { role: 'finance_staff', label: 'David Sterling', badge: 'Finance Staff', desc: 'Ledger, invoices, refunds & Stripe' },
    { role: 'customer_support', label: 'Fatima Zahra', badge: 'Support Agent', desc: 'Live ticket desk & customer queries' },
    { role: 'content_manager', label: 'Liam O’Connor', badge: 'CMS Editor', desc: 'Homepage banners, news & FAQs' },
  ];

  const isStaffOrAdmin = currentUser.role !== 'customer';

  return (
    <header className="sticky top-0 z-50 bg-slate-950/70 backdrop-blur-xl border-b border-white/10 transition-all text-slate-100">
      {/* Top Utility Bar */}
      <div className="bg-slate-950/80 backdrop-blur-md text-slate-300 text-xs py-1.5 px-4 sm:px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Global Cargo & Consular Operations 24/7 Active
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400">Hubs: London • Frankfurt • Dubai • New York • Singapore • Paris</span>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Quick Demo Persona Switcher */}
            <div className="relative">
              <button
                id="persona-switch-btn"
                onClick={() => setPersonaMenuOpen(!personaMenuOpen)}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-slate-200 px-2.5 py-1 rounded-lg border border-white/10 text-xs font-medium backdrop-blur-md transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Role Persona:</span>
                <span className="text-blue-400 font-semibold">{currentUser.role.replace('_', ' ').toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {personaMenuOpen && (
                <div 
                  id="persona-dropdown-menu"
                  className="absolute right-0 mt-2 w-72 bg-slate-900/95 backdrop-blur-2xl text-white rounded-2xl shadow-2xl border border-white/15 py-2 z-[999]"
                >
                  <div className="px-3 py-2 border-b border-white/10 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Test Persona (1-Click Switch)
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
                    {rolesList.map(item => (
                      <button
                        key={item.role}
                        onClick={() => {
                          switchUserRole(item.role);
                          setPersonaMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 hover:bg-white/10 transition flex items-start gap-2.5 ${
                          currentUser.role === item.role ? 'bg-blue-600/20 border-l-4 border-blue-400' : ''
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-white">{item.label}</span>
                            <span className="text-[10px] bg-white/10 text-blue-300 px-1.5 py-0.5 rounded font-mono border border-white/10">{item.badge}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Currency Selector */}
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-slate-400" />
              <select
                id="currency-selector"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="bg-transparent text-slate-200 hover:text-white text-xs border-none focus:ring-0 cursor-pointer font-medium"
              >
                {Object.keys(CURRENCIES).map((c) => (
                  <option key={c} value={c} className="bg-slate-900 text-white">
                    {c} ({CURRENCIES[c as CurrencyCode].symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1">
              <Globe2 className="w-3 h-3 text-slate-400" />
              <select
                id="language-selector"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-slate-200 hover:text-white text-xs border-none focus:ring-0 cursor-pointer font-medium"
              >
                <option value="en" className="bg-slate-900 text-white">English (EN)</option>
                <option value="ar" className="bg-slate-900 text-white">العربية (AR - RTL)</option>
                <option value="fr" className="bg-slate-900 text-white">Français (FR)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand */}
          <div 
            id="brand-logo-btn"
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 border border-white/20 group-hover:scale-105 transition-transform">
              <Plane className="w-6 h-6 transform -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white font-display">APEX</span>
                <span className="text-xl font-bold tracking-tight text-blue-400 font-display">GLOBAL</span>
              </div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 -mt-1">
                Logistics • Talent • Visas
              </div>
            </div>
          </div>

          {/* Quick Tracking Search in Header */}
          <form 
            onSubmit={handleQuickTrackSubmit} 
            className="hidden lg:flex items-center relative max-w-xs w-full"
          >
            <input
              id="header-quick-track-input"
              type="text"
              placeholder={t.nav.trackPlaceholder}
              value={quickTrackInput}
              onChange={(e) => setQuickTrackInput(e.target.value)}
              className="w-full bg-white/[0.07] hover:bg-white/10 focus:bg-white/[0.12] border border-white/15 focus:border-blue-400 rounded-xl pl-9 pr-14 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 backdrop-blur-md transition shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <button
              id="header-quick-track-submit-btn"
              type="submit"
              className="absolute right-1.5 top-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg transition shadow-md shadow-blue-600/30 border border-white/10"
            >
              {t.nav.trackBtn}
            </button>
          </form>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1 text-sm font-medium text-slate-300">
            {navLinks.slice(0, 7).map((item) => (
              <button
                key={item.key}
                id={`nav-link-${item.key}`}
                onClick={() => setCurrentView(item.key)}
                className={`px-3 py-2 rounded-xl transition-all duration-150 ${
                  currentView === item.key
                    ? 'text-blue-400 bg-blue-500/15 border border-blue-500/30 font-semibold shadow-sm shadow-blue-500/10'
                    : 'hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action Icons & Auth Profile */}
          <div className="flex items-center gap-3">
            {/* Notification Drawer Button */}
            <div className="relative">
              <button
                id="notifications-bell-btn"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition backdrop-blur-md"
                title="Real-time Alerts"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce shadow-md shadow-rose-500/50">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {notifDropdownOpen && (
                <div 
                  id="notifications-dropdown"
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/15 py-3 z-[999]"
                >
                  <div className="px-4 py-2 flex items-center justify-between border-b border-white/10">
                    <span className="font-bold text-sm text-white">Notifications ({unreadNotificationCount} new)</span>
                    <button 
                      onClick={markAllNotificationsRead}
                      className="text-xs text-blue-400 hover:underline font-medium"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">No notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3 hover:bg-white/10 transition cursor-pointer flex gap-3 ${!n.read ? 'bg-blue-500/10' : ''}`}
                        >
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-blue-400 shadow-sm shadow-blue-400' : 'bg-slate-600'}`} />
                          <div className="flex-1">
                            <div className="font-semibold text-xs text-white">{n.title}</div>
                            <div className="text-xs text-slate-300 mt-0.5">{n.message}</div>
                            <div className="text-[10px] text-slate-400 mt-1">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Portal Navigation Button */}
            {isStaffOrAdmin ? (
              <button
                id="header-admin-hub-btn"
                onClick={() => setCurrentView('admin-overview')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs shadow-lg transition border border-white/15 ${
                  currentView.startsWith('admin')
                    ? 'bg-blue-600 text-white ring-2 ring-blue-400 shadow-blue-600/30'
                    : 'bg-white/10 hover:bg-white/15 text-white backdrop-blur-md'
                }`}
              >
                <Layers className="w-4 h-4 text-amber-400" />
                <span>{t.nav.adminPortal}</span>
              </button>
            ) : (
              <button
                id="header-customer-dashboard-btn"
                onClick={() => setCurrentView('customer-overview')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs shadow-lg transition border border-white/15 ${
                  currentView.startsWith('customer')
                    ? 'bg-blue-600 text-white ring-2 ring-blue-400 shadow-blue-600/30'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/30'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span>{t.nav.dashboard}</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-300 hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="xl:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur-2xl px-4 py-4 space-y-3">
          <form onSubmit={handleQuickTrackSubmit} className="relative w-full">
            <input
              type="text"
              placeholder={t.nav.trackPlaceholder}
              value={quickTrackInput}
              onChange={(e) => setQuickTrackInput(e.target.value)}
              className="w-full bg-white/10 border border-white/15 rounded-xl pl-9 pr-14 py-2 text-xs text-white placeholder-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bg-blue-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg"
            >
              {t.nav.trackBtn}
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
            {navLinks.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setCurrentView(item.key);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition ${
                  currentView === item.key ? 'bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30' : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                setCurrentView(isStaffOrAdmin ? 'admin-overview' : 'customer-overview');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs text-center shadow-lg shadow-blue-600/30 border border-white/15"
            >
              {isStaffOrAdmin ? t.nav.adminPortal : t.nav.dashboard}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Package, 
  Briefcase, 
  FileCheck2, 
  CreditCard, 
  ArrowRight, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Plus, 
  AlertCircle, 
  Printer, 
  FileText,
  Calendar,
  Sparkles,
  PlayCircle,
  HelpCircle,
  ShieldCheck,
  Plane,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { formatStatus, formatDate, getStatusBadgeColor } from '../../lib/utils';
import { formatPrice } from '../../lib/currencies';
import { CustomerOnboardingModal } from './CustomerOnboardingModal';

export const CustomerOverview: React.FC = () => {
  const { 
    currentUser, 
    shipments, 
    jobApplications, 
    visaApplications, 
    invoices, 
    setCurrentView, 
    setSelectedLabelShipment, 
    setSelectedInvoice, 
    currency,
    setAppointmentModalOpen,
    trackShipmentByNumber
  } = useApp();

  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const userShipments = shipments.filter(s => s.userId === currentUser.id || s.customerEmail === currentUser.email);
  const userJobApps = jobApplications.filter(a => a.userId === currentUser.id);
  const userVisas = visaApplications.filter(v => v.userId === currentUser.id);
  const userInvoices = invoices.filter(i => i.customerEmail === currentUser.email || i.id);

  const activeShipmentsCount = userShipments.filter(s => s.status !== 'delivered').length;
  const unpaidInvoices = userInvoices.filter(i => i.status === 'unpaid');
  const unpaidTotal = unpaidInvoices.reduce((sum, i) => sum + i.total, 0);

  const latestShipment = userShipments[0] || shipments[0];

  return (
    <div className="space-y-6">
      
      {/* Onboarding Interactive Modal */}
      <CustomerOnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
      />

      {/* Welcome Card & Guided Tour Launcher */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden border border-white/15">
        <div className="space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
              Customer Workspace • Active 24/7
            </span>
            <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> KYC Verified
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
            Welcome Back, {currentUser.name}
          </h1>
          <p className="text-xs text-blue-100 max-w-xl leading-relaxed">
            Monitor real-time air cargo waybills, track international career applications, and manage sovereign consular visa dossiers in one secure portal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10 w-full sm:w-auto">
          <button
            onClick={() => setOnboardingOpen(true)}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2 shrink-0 border border-amber-300"
          >
            <PlayCircle className="w-4 h-4 text-slate-950 fill-amber-300" />
            <span>Take Guided Tour</span>
          </button>
          
          <button
            onClick={() => setCurrentView('customer-shipments')}
            className="px-4 py-2.5 bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4 text-blue-700" />
            <span>New Shipment</span>
          </button>
        </div>
      </div>

      {/* Onboarding Interactive Step-by-Step Navigation Guide Card */}
      <div className="bg-white/[0.04] backdrop-blur-2xl rounded-3xl border border-white/10 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-white/10 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Portal Feature Tour & Quick Actions
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white font-display mt-0.5">
              Essential Customer Sections & Service Launchers
            </h3>
          </div>
          <button
            onClick={() => setOnboardingOpen(true)}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>Launch Step-by-Step Walkthrough</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Section 1: Shipments */}
          <div 
            onClick={() => setCurrentView('customer-shipments')}
            className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/40 hover:bg-white/[0.06] transition cursor-pointer space-y-2.5 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center">
                  <Package className="w-4 h-4 text-blue-400" />
                </div>
                <span className="font-bold text-white group-hover:text-blue-300 transition">My Shipments</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">Step 1</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Track active air waybills, inspect live flight coordinates, and print 4x6 courier labels.
            </p>
            <div className="text-[11px] font-semibold text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition">
              <span>Go to Consignments</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Section 2: Job Applications */}
          <div 
            onClick={() => setCurrentView('customer-jobs')}
            className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.06] transition cursor-pointer space-y-2.5 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="font-bold text-white group-hover:text-indigo-300 transition">Job Applications</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">Step 2</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Monitor interview milestones, submit resumes, and browse open international roles.
            </p>
            <div className="text-[11px] font-semibold text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition">
              <span>Go to Career Applications</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Section 3: Visa Dossiers */}
          <div 
            onClick={() => setCurrentView('customer-visas')}
            className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 hover:bg-white/[0.06] transition cursor-pointer space-y-2.5 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center">
                  <FileCheck2 className="w-4 h-4 text-purple-400" />
                </div>
                <span className="font-bold text-white group-hover:text-purple-300 transition">Visa Applications</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">Step 3</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Check sovereign embassy milestones, upload biometrics, and schedule legal reviews.
            </p>
            <div className="text-[11px] font-semibold text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition">
              <span>Go to Consular Dossiers</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => setCurrentView('customer-shipments')}
          className="bg-white/[0.04] backdrop-blur-2xl p-5 rounded-2xl border border-white/10 shadow-lg hover:border-blue-500/40 transition cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-blue-400">Consignments</span>
            <Package className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-display">{activeShipmentsCount} Active</div>
          <div className="text-[11px] text-slate-400">{userShipments.length} Total registered</div>
        </div>

        <div 
          onClick={() => setCurrentView('customer-jobs')}
          className="bg-white/[0.04] backdrop-blur-2xl p-5 rounded-2xl border border-white/10 shadow-lg hover:border-indigo-500/40 transition cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-indigo-400">Job Applications</span>
            <Briefcase className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-display">{userJobApps.length} Filed</div>
          <div className="text-[11px] text-emerald-400 font-semibold">1 Interview scheduled</div>
        </div>

        <div 
          onClick={() => setCurrentView('customer-visas')}
          className="bg-white/[0.04] backdrop-blur-2xl p-5 rounded-2xl border border-white/10 shadow-lg hover:border-purple-500/40 transition cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-purple-400">Visa Dossiers</span>
            <FileCheck2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-display">{userVisas.length} Active</div>
          <div className="text-[11px] text-purple-300 font-medium">Compliance review in progress</div>
        </div>

        <div 
          onClick={() => setCurrentView('customer-payments')}
          className="bg-white/[0.04] backdrop-blur-2xl p-5 rounded-2xl border border-white/10 shadow-lg hover:border-amber-500/40 transition cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-amber-400">Pending Dues</span>
            <CreditCard className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-display">
            {formatPrice(unpaidTotal, currency)}
          </div>
          <div className="text-[11px] text-slate-400">{unpaidInvoices.length} Invoices pending</div>
        </div>
      </div>

      {/* Priority Active Shipment Focus */}
      {latestShipment && (
        <div className="bg-white/[0.04] backdrop-blur-2xl rounded-3xl border border-white/10 p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-400 font-mono">Priority Active Shipment Telemetry</span>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-lg font-black font-mono text-white">{latestShipment.trackingNumber}</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${getStatusBadgeColor(latestShipment.status)}`}>
                  {formatStatus(latestShipment.status)}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={async () => {
                  await trackShipmentByNumber(latestShipment.trackingNumber);
                  setCurrentView('tracking');
                }}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
              >
                <span>Inspect Live Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setSelectedLabelShipment(latestShipment)}
                className="p-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200"
                title="Print 4x6 Air Waybill"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-white/[0.03] p-4 rounded-2xl border border-white/10">
            <div>
              <span className="text-slate-400">Origin Dispatch:</span>
              <div className="font-bold text-white mt-0.5">{latestShipment.origin}</div>
            </div>
            <div>
              <span className="text-slate-400">Current Checkpoint:</span>
              <div className="font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {latestShipment.currentLocation}
              </div>
            </div>
            <div>
              <span className="text-slate-400">Destination Delivery:</span>
              <div className="font-bold text-white mt-0.5">{latestShipment.destination}</div>
            </div>
          </div>
        </div>
      )}

      {/* Split Cards: Visas & Job Applications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visa Applications Summary */}
        <div className="bg-white/[0.04] backdrop-blur-2xl rounded-3xl border border-white/10 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-purple-400" /> Active Visa Dossiers
            </h3>
            <button
              onClick={() => setCurrentView('customer-visas')}
              className="text-xs font-semibold text-purple-300 hover:underline"
            >
              View All ({userVisas.length})
            </button>
          </div>

          <div className="space-y-3">
            {userVisas.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">No active visa applications.</div>
            ) : (
              userVisas.map(v => (
                <div key={v.id} className="p-3.5 bg-white/[0.03] rounded-2xl border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{v.country} - {v.visaType}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadgeColor(v.status)}`}>
                      {formatStatus(v.status)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Dossier #{v.applicationNumber}</span>
                    <span>Submitted: {formatDate(v.submittedAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Job Applications Summary */}
        <div className="bg-white/[0.04] backdrop-blur-2xl rounded-3xl border border-white/10 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" /> Job Applications
            </h3>
            <button
              onClick={() => setCurrentView('customer-jobs')}
              className="text-xs font-semibold text-indigo-300 hover:underline"
            >
              View All ({userJobApps.length})
            </button>
          </div>

          <div className="space-y-3">
            {userJobApps.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">No active job applications.</div>
            ) : (
              userJobApps.map(app => (
                <div key={app.id} className="p-3.5 bg-white/[0.03] rounded-2xl border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{app.jobTitle}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadgeColor(app.status)}`}>
                      {formatStatus(app.status)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{app.companyName}</span>
                    <span>Applied: {formatDate(app.appliedAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

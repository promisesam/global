import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Package, 
  Briefcase, 
  FileCheck2, 
  PlusCircle, 
  Bell, 
  ShieldCheck, 
  Settings, 
  ExternalLink, 
  CheckCircle2, 
  ArrowRight, 
  Plane, 
  FileText, 
  Calendar,
  Globe2,
  DollarSign,
  Lock,
  Layers,
  Search
} from 'lucide-react';

interface CustomerOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerOnboardingModal: React.FC<CustomerOnboardingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { setCurrentView, setAppointmentModalOpen, currentUser } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to Apex Global Portal',
      badge: 'Getting Started',
      subtitle: 'Your unified platform for cross-border logistics, executive talent, and consular mobility.',
      icon: Sparkles,
      iconColor: 'from-blue-600 to-indigo-600',
      description: 'Apex Global unites high-security air freight logistics, global executive recruitment, and sovereign consular visa dossiers in one encrypted command center. Everything you need is accessible from this customer workspace.',
      keyPoints: [
        'Real-time tracking of air cargo waybills with interactive map waypoints.',
        'Direct tracking of your international job applications and interview stages.',
        'Step-by-step progress tracking for consular visa compliance dossiers.',
        'Encrypted document vault and instant invoicing with multiple currency support.'
      ],
      mockupType: 'overview',
      actionLabel: 'Begin Guided Tour',
    },
    {
      id: 'shipments',
      title: 'My Consignments & Air Freight',
      badge: 'Section 1: Logistics',
      subtitle: 'Track live flights, customs clearance status, and download 4x6 courier air waybills.',
      icon: Package,
      iconColor: 'from-blue-600 to-cyan-600',
      description: 'The "My Consignments" tab gives you full visibility over your cross-border shipments. View real-time status updates from origin airport departure to final destination delivery.',
      keyPoints: [
        'Inspect live flight telemetry, GPS coordinates, and customs checkpoints.',
        'Download official 4x6 courier air waybill labels ready for thermal printing.',
        'Generate and review commercial customs invoices and payment receipts.',
        'Create new express air or standard freight bookings anytime.'
      ],
      mockupType: 'shipment',
      actionLabel: 'Next: Job Applications',
      navTarget: 'customer-shipments',
    },
    {
      id: 'jobs',
      title: 'My Job Applications & Careers',
      badge: 'Section 2: Talent Mobility',
      subtitle: 'Manage recruitment stages, interview invitations, and explore global vacancies.',
      icon: Briefcase,
      iconColor: 'from-indigo-600 to-purple-600',
      description: 'Track your career applications across top international employment markets including London, Dubai, Frankfurt, Singapore, and New York.',
      keyPoints: [
        'Monitor hiring stages: Applied → Screening → Technical Interview → Executive Offer.',
        'Accept video interview invitations directly with integrated Google Meet links.',
        'Upload updated CVs, portfolio links, and professional certifications.',
        'Browse open executive, engineering, and logistics vacancies.'
      ],
      mockupType: 'jobs',
      actionLabel: 'Next: Visa Dossiers',
      navTarget: 'customer-jobs',
    },
    {
      id: 'visas',
      title: 'My Visa Applications & Consular Dossiers',
      badge: 'Section 3: Immigrations',
      subtitle: 'Track sovereign embassy compliance, biometrics, and immigration clearances.',
      icon: FileCheck2,
      iconColor: 'from-purple-600 to-pink-600',
      description: 'The "Visa Dossiers" module simplifies complex consular paperwork. Track every milestone from initial document legalizations to embassy interview dates and visa issuance.',
      keyPoints: [
        'Check embassy dossier review progress with clear milestone indicators.',
        'Upload required biometric slips, passport scans, and sponsor invitations.',
        'Receive instant notifications when consular decisions or RFEs are issued.',
        'Book 1-on-1 consular legal consultation sessions with immigration attorneys.'
      ],
      mockupType: 'visas',
      actionLabel: 'Next: Initiating Services',
      navTarget: 'customer-visas',
    },
    {
      id: 'services',
      title: 'Initiating New Services in 1-Click',
      badge: 'Section 4: Fast Actions',
      subtitle: 'How to quickly book a shipment, apply for a role, or start a visa assessment.',
      icon: PlusCircle,
      iconColor: 'from-emerald-600 to-teal-600',
      description: 'You can initiate any Apex Global service directly from your dashboard or top navigation bar at any time without waiting in queues.',
      keyPoints: [
        'Click "+ New Shipment" to generate a waybill with automated freight quote calculator.',
        'Visit "Global Careers" to apply for open international vacancies with 1 click.',
        'Start an official Visa Assessment to calculate approval eligibility score.',
        'Click "Book Consultation" to schedule a video call with a dedicated specialist.'
      ],
      mockupType: 'services',
      actionLabel: 'Next: Notifications & Settings',
    },
    {
      id: 'settings',
      title: 'Notification Center & Profile Settings',
      badge: 'Section 5: Security & Preferences',
      subtitle: 'Stay notified on status changes and keep your KYC credentials verified.',
      icon: Bell,
      iconColor: 'from-amber-600 to-orange-600',
      description: 'Customize how and when you receive operational alerts and manage your global identity credentials.',
      keyPoints: [
        'Notification Bell: Live updates on cargo customs release, interview requests, and invoice receipts.',
        'KYC Identity Verification: Upload passport/ID to unlock high-tier freight & visa services.',
        'Currency & Language: Toggle between USD, EUR, GBP, AED, CAD, SAR with live currency conversion.',
        'Two-Factor Authentication: Enable 2FA for banking-grade security on your account.'
      ],
      mockupType: 'settings',
      actionLabel: 'Finish & Go to Workspace',
      navTarget: 'customer-overview',
    },
  ];

  const current = steps[currentStep];
  const totalSteps = steps.length;
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('apex_onboarding_completed', 'true');
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleJumpToSection = (targetView?: string) => {
    localStorage.setItem('apex_onboarding_completed', 'true');
    if (targetView) {
      setCurrentView(targetView);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900/95 backdrop-blur-2xl text-white rounded-3xl border border-white/15 shadow-2xl w-full max-w-4xl overflow-hidden my-6 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Modal Top Bar */}
        <div className="p-5 sm:px-8 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${current.iconColor} flex items-center justify-center shadow-lg shadow-blue-500/20 border border-white/10`}>
              <current.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 font-mono bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                  {current.badge}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Step {currentStep + 1} of {totalSteps}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black font-display text-white mt-0.5">
                {current.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl hover:bg-white/10 transition flex items-center gap-1 font-medium"
            >
              <span>Skip Tour</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1 relative overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Navigation Step Pills */}
        <div className="px-6 py-2.5 bg-white/[0.02] border-b border-white/5 overflow-x-auto flex items-center gap-2 text-xs no-scrollbar">
          {steps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(idx)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                currentStep === idx
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40 shadow-sm'
                  : idx < currentStep
                  ? 'bg-white/5 text-emerald-300 border border-emerald-500/20 hover:bg-white/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {idx < currentStep ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <span className="w-4 h-4 rounded-full bg-white/10 text-[10px] flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
              )}
              <span>{step.id.charAt(0).toUpperCase() + step.id.slice(1)}</span>
            </button>
          ))}
        </div>

        {/* Step Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left: Text & Guidance */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <p className="text-sm font-semibold text-blue-200">
                  {current.subtitle}
                </p>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {current.description}
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Key Features & Capabilities:
                </h4>
                <div className="space-y-2">
                  {current.keyPoints.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2.5 bg-white/[0.04] p-2.5 rounded-xl border border-white/10 text-xs text-slate-200">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                      <span className="leading-snug">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {current.navTarget && (
                <div className="pt-2">
                  <button
                    onClick={() => handleJumpToSection(current.navTarget)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    <span>Jump directly to {current.title}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Right: Visual Aid Mockup */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-white/15 bg-slate-950/60 p-5 shadow-inner space-y-4 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                
                {/* Mockup Card Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="text-[11px] font-mono font-bold text-slate-400 ml-2">Apex UI Interactive Preview</span>
                  </div>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-mono font-semibold">
                    Live Demo
                  </span>
                </div>

                {/* Specific Mockup Types */}
                {current.mockupType === 'overview' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">AW</div>
                        <div>
                          <div className="font-bold text-white">{currentUser.name}</div>
                          <div className="text-[10px] text-blue-200 font-mono">KYC Verified Customer Account</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        Active 24/7
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                        <Package className="w-4 h-4 text-blue-400 mx-auto" />
                        <div className="font-bold text-white">Air Cargo</div>
                        <div className="text-[10px] text-slate-400">Live Telemetry</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                        <Briefcase className="w-4 h-4 text-indigo-400 mx-auto" />
                        <div className="font-bold text-white">Careers</div>
                        <div className="text-[10px] text-slate-400">Global Roles</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                        <FileCheck2 className="w-4 h-4 text-purple-400 mx-auto" />
                        <div className="font-bold text-white">Consular</div>
                        <div className="text-[10px] text-slate-400">Visa Dossiers</div>
                      </div>
                    </div>
                  </div>
                )}

                {current.mockupType === 'shipment' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-blue-400 text-sm">APX-98241</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          In Transit (Flight APX-302)
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-300">
                        <span>Frankfurt (FRA) ✈️ New York (JFK)</span>
                        <span className="font-semibold text-emerald-400">ETA: Tomorrow 14:00</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <span className="font-medium text-slate-200">Thermal 4x6 Courier Waybill Label</span>
                      </div>
                      <span className="text-[10px] bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded font-bold border border-blue-500/30">
                        Print Label
                      </span>
                    </div>
                  </div>
                )}

                {current.mockupType === 'jobs' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">Senior Cloud Solutions Architect</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          Interview Scheduled
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300">Location: London HQ / Hybrid • $160,000 / yr</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-indigo-400" />
                        <span className="font-medium text-indigo-200">Executive Panel Interview (Google Meet)</span>
                      </div>
                      <span className="text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded">
                        Join Call
                      </span>
                    </div>
                  </div>
                )}

                {current.mockupType === 'visas' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">UK Skilled Worker (Tech Specialist)</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Compliance Review
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300">Dossier ID: VSA-8812 • Biometrics Completed</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-center">
                        <div className="text-slate-400">Embassy Queue</div>
                        <div className="font-bold text-emerald-400 mt-0.5">Estimated 10 Days</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-center">
                        <div className="text-slate-400">Sovereign Fee</div>
                        <div className="font-bold text-blue-400 mt-0.5">Paid & Reconciled</div>
                      </div>
                    </div>
                  </div>
                )}

                {current.mockupType === 'services' && (
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-cyan-400" />
                        <span className="font-bold text-white">Book Air Cargo Consignment</span>
                      </div>
                      <span className="text-[10px] text-blue-400 font-bold">1-Click Dispatch →</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-indigo-400" />
                        <span className="font-bold text-white">Submit Global Vacancy CV</span>
                      </div>
                      <span className="text-[10px] text-indigo-400 font-bold">Direct Match →</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-white">Book Expert Video Consultation</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold">Schedule Slot →</span>
                    </div>
                  </div>
                )}

                {current.mockupType === 'settings' && (
                  <div className="space-y-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-amber-400" />
                        <span className="font-medium text-slate-200">Real-time Customs & Visa Push Alerts</span>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        <span className="font-medium text-slate-200">Currency: USD / EUR / GBP / AED / CAD / SAR</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-blue-300">
                        USD ($)
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-purple-400" />
                        <span className="font-medium text-slate-200">2-Factor Hardware Authentication</span>
                      </div>
                      <span className="text-[10px] font-bold text-purple-300">
                        Enabled
                      </span>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-5 sm:px-8 border-t border-white/10 bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition flex items-center gap-1.5 border border-white/10"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={() => setCurrentStep(0)}
              className="px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition border border-white/10"
              title="Restart Tutorial from Step 1"
            >
              Restart
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleNext}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 border border-white/15 transition flex items-center justify-center gap-2"
            >
              <span>{current.actionLabel}</span>
              {currentStep < totalSteps - 1 ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

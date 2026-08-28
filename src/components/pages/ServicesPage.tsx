import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plane, 
  Truck, 
  Anchor, 
  ThermometerSnowflake, 
  ShieldCheck, 
  Briefcase, 
  FileCheck2, 
  Building2, 
  ArrowRight, 
  CheckCircle2,
  Lock,
  Headphones,
  Globe2
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { setCurrentView, setAppointmentModalOpen } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
          Comprehensive Cross-Border Solutions
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 font-display">
          Full-Spectrum Global Services Suite
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          From express air freight corridors and bonded warehousing to elite human capital recruitment and high-touch consular visa representation.
        </p>
      </div>

      {/* Section 1: Logistics & Supply Chain */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <Plane className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">Logistics, Freight & Courier Operations</h2>
            <p className="text-xs text-slate-500">IATA & FIATA certified multi-modal global transportation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Next-Flight-Out Air Cargo</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Guaranteed priority air freight routing with transit times between 24-48 hours across Transatlantic, Transpacific, and Gulf corridors.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Real-time GPS waypoints</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Direct airline belly-hold access</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Cold Chain & Pharma Logistics</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Active temperature-controlled containers (-20°C, 2°C-8°C, 15°C-25°C) with continuous thermal telemetry logging for vaccines and biologics.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> GDP compliant operations</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Dry ice replenishment stations</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Customs Brokerage & Clearance</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              In-house licensed customs brokers handling automated tariff classification, import declarations, and duty optimization in 80+ ports.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Electronic EDI customs pre-filing</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Bonded transit escort</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 2: Recruitment & Executive Headhunting */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">International Talent Acquisition & Headhunting</h2>
            <p className="text-xs text-slate-500">Cross-border executive search and engineering relocation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Executive C-Suite Search</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Retained executive headhunting for CEOs, CTOs, and Regional VPs across EMEA, North America, and APAC.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Specialized Technical Engineering</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fast-track placement for AI/ML architects, cloud engineers, supply chain data scientists, and clinical researchers.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">End-to-End Relocation Linking</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every job placement is immediately synchronized with our visa department to manage employee immigration and family relocation.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Visa Assistance */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">Regulated Visa & Consular Assistance</h2>
            <p className="text-xs text-slate-500">Official legal preparation, dossier legalization and biometric coordination</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">UAE Golden & Green Residency</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              10-year residency pathways for investors, entrepreneurs, scientists, and outstanding specialists in Dubai and Abu Dhabi.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">UK Skilled Worker & Scale-Up</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Certificate of Sponsorship (CoS) validation, points-based scoring audit, and Home Office priority appointment scheduling.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Canada GTS & Work Permits</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Global Talent Stream 2-week processing facilitation and LMIA compliance dossiers for tech transferees.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <h3 className="text-2xl font-bold font-display">Need a tailored multi-service enterprise contract?</h3>
          <p className="text-xs text-slate-300 mt-1">Our dedicated corporate advisors will structure a custom SLA.</p>
        </div>
        <button
          onClick={() => setAppointmentModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-lg transition flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <span>Schedule Corporate Briefing</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

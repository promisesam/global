import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plane, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, t, cmsContent } = useApp();

  return (
    <footer className="bg-slate-950/80 backdrop-blur-2xl text-slate-400 border-t border-white/10 text-sm mt-auto relative z-10">
      {/* Official Government Visa Disclaimer Banner */}
      <div className="bg-slate-900/60 backdrop-blur-md border-b border-white/10 py-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-start gap-3.5 text-xs text-slate-300">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300 uppercase tracking-wide mr-2">
              {t.disclaimer.title}:
            </span>
            <span className="text-slate-300 leading-relaxed">
              {t.disclaimer.text}
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand & Mission */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 border border-white/20">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white font-display">APEX</span>
              <span className="text-xl font-bold tracking-tight text-blue-400 font-display">GLOBAL</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            Unified multi-service enterprise infrastructure powering global freight forwarding, high-touch talent placement, and regulated visa preparation across 140+ countries.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 font-medium backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              ISO 9001:2026 Certified
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 font-medium backdrop-blur-md">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              PCI-DSS & GDPR Compliant
            </span>
          </div>
        </div>

        {/* Courier & Freight */}
        <div>
          <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3.5">
            Logistics & Freight
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => setCurrentView('tracking')} className="hover:text-white transition flex items-center gap-1">
                Shipment Live Tracking <ArrowUpRight className="w-3 h-3 text-slate-500" />
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentView('pricing')} className="hover:text-white transition">
                Express Air Freight Rates
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentView('services')} className="hover:text-white transition">
                Temperature-Controlled Cargo
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentView('services')} className="hover:text-white transition">
                Customs Clearance Brokerage
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentView('contact')} className="hover:text-white transition">
                Charter Cargo Solutions
              </button>
            </li>
          </ul>
        </div>

        {/* Talent & Visas */}
        <div>
          <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3.5">
            Mobility & Careers
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => setCurrentView('jobs')} className="hover:text-white transition flex items-center gap-1">
                Global Vacancies <ArrowUpRight className="w-3 h-3 text-slate-500" />
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentView('visa')} className="hover:text-white transition">
                UAE Green & Work Visas
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentView('visa')} className="hover:text-white transition">
                UK Skilled Worker Assistance
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentView('visa')} className="hover:text-white transition">
                Schengen Business Dossiers
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentView('visa')} className="hover:text-white transition">
                Canada GTS Work Permits
              </button>
            </li>
          </ul>
        </div>

        {/* Headquarters & Support */}
        <div>
          <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3.5">
            Global Headquarters
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>{cmsContent.contactInfo.headquarters}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{cmsContent.contactInfo.phone}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{cmsContent.contactInfo.supportEmail}</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400 shrink-0" />
              <span>{cmsContent.contactInfo.businessHours}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-slate-950/90 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} ApexGlobal Enterprise Logistics & Mobility Group Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setCurrentView('about')} className="hover:text-white transition">About Company</button>
            <button onClick={() => setCurrentView('faq')} className="hover:text-white transition">FAQ & Support</button>
            <button onClick={() => setCurrentView('contact')} className="hover:text-white transition">Contact Hubs</button>
            <span className="text-slate-700">|</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

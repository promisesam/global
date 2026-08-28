import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Globe2, 
  ShieldCheck, 
  Award, 
  Users, 
  Plane, 
  Briefcase, 
  FileCheck2, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setCurrentView, setAppointmentModalOpen } = useApp();

  const milestones = [
    { year: '2016', title: 'Foundation & Air Charter Ops', desc: 'ApexGlobal founded in London & Frankfurt focusing on express cross-border aerospace courier networks.' },
    { year: '2019', title: 'Global Mobility & Talent Division', desc: 'Expanded into international talent recruitment and executive engineering placement across EMEA.' },
    { year: '2022', title: 'Regulated Consular Advisory', desc: 'Achieved certified consular liaison status across GCC, UK, Schengen, and North American jurisdictions.' },
    { year: '2026', title: 'Unified Enterprise Platform', desc: 'Launched integrated digital infrastructure powering real-time logistics telemetry, talent matching & automated visa filing.' },
  ];

  const leadership = [
    { name: 'Eleanor Vance', role: 'Chief Executive Officer', location: 'London Headquarters', bio: 'Former senior director at international logistics conglomerates with 20+ years in multimodal freight.' },
    { name: 'Marcus Chen', role: 'VP of Global Logistics & Cold Chain', location: 'Frankfurt Air Cargo Hub', bio: 'Specialist in IATA regulations, temperature-controlled pharma transport, and customs clearance.' },
    { name: 'Sophia Al-Mansoor', role: 'Head of Global Talent & Executive Placement', location: 'Dubai International Financial Centre', bio: 'Lead recruitment advisor placing over 4,000 executive technology and engineering specialists.' },
    { name: 'Claire Dupont', role: 'Director of Consular & Immigration Affairs', location: 'Paris & Geneva Office', bio: 'Former diplomatic attache with expertise in investor dossiers, Golden Visas, and intra-company transfers.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-16">
      {/* Hero */}
      <div className="bg-slate-900 rounded-3xl p-8 sm:p-14 text-white shadow-xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 text-blue-400 text-xs font-semibold">
          <Globe2 className="w-4 h-4 text-emerald-400" /> Operational in 140+ Countries
        </div>
        <div className="max-w-3xl space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-display">
            Pioneering the Synergy of Freight, Human Capital & Global Mobility
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            ApexGlobal was established to eliminate the friction of international trade and migration. By unifying high-priority logistics, executive recruitment, and regulated visa preparation, we enable organizations and individuals to thrive across borders without bureaucratic delays.
          </p>
        </div>
      </div>

      {/* 3 Pillars Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Plane className="w-6 h-6 -rotate-45" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Reliable Freight Infrastructure</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Daily air cargo corridors and temperature-controlled cold chain logistics connecting London, Frankfurt, Dubai, New York, and Singapore.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Elite Talent Acquisition</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Connecting premier multinational corporations with specialized engineering, executive, and financial leaders worldwide.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Regulated Consular Dossiers</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Full compliance auditing and biometric appointment scheduling backed by a 99.4% first-pass consular approval record.
          </p>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-xs uppercase font-bold tracking-widest text-blue-600">Company Heritage</h2>
          <h3 className="text-2xl font-black text-slate-900 font-display">A Decade of International Excellence</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {milestones.map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-2xl font-black text-blue-600 font-mono">{item.year}</div>
              <div className="font-bold text-slate-900 text-sm">{item.title}</div>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Leadership Section */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-xs uppercase font-bold tracking-widest text-blue-600">Executive Leadership</h2>
          <h3 className="text-2xl font-black text-slate-900 font-display">Steered by Global Trade Veterans</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {leadership.map((leader, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-base">
                {leader.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{leader.name}</h4>
                <div className="text-xs font-semibold text-blue-600">{leader.role}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{leader.location}</div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                {leader.bio}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-2xl font-bold font-display">Ready to scale across borders?</h3>
          <p className="text-xs text-blue-100">Speak directly with our enterprise trade and immigration team.</p>
        </div>
        <button
          onClick={() => setAppointmentModalOpen(true)}
          className="bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs px-6 py-3.5 rounded-xl shadow-lg transition flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <span>Schedule Enterprise Consultation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plane, 
  Briefcase, 
  FileCheck2, 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Globe2, 
  TrendingUp, 
  CheckCircle2, 
  Star, 
  Package, 
  Calendar,
  Sparkles,
  Calculator,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { formatPrice } from '../../lib/currencies';
import { formatRelativeTime } from '../../lib/utils';

export const HomePage: React.FC = () => {
  const { 
    setCurrentView, 
    t, 
    trackShipmentByNumber, 
    jobs, 
    visaCategories, 
    cmsContent, 
    currency,
    setSelectedJobForApply,
    setAppointmentModalOpen
  } = useApp();

  const [trackInput, setTrackInput] = useState('');
  const [calcWeight, setCalcWeight] = useState(5);
  const [calcOrigin, setCalcOrigin] = useState('Frankfurt, Germany (FRA)');
  const [calcDest, setCalcDest] = useState('Dubai, UAE (DXB)');
  const [calcSpeed, setCalcSpeed] = useState<'express' | 'standard' | 'economy'>('express');
  const [calcResult, setCalcResult] = useState<number | null>(null);

  const sampleTrackingNumbers = ['APX-98241', 'APX-41029', 'APX-77318'];

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackInput.trim()) return;
    await trackShipmentByNumber(trackInput);
    setCurrentView('tracking');
  };

  const handleSampleTrack = async (num: string) => {
    setTrackInput(num);
    await trackShipmentByNumber(num);
    setCurrentView('tracking');
  };

  const calculateEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    const baseRatePerKg = calcSpeed === 'express' ? 18.5 : calcSpeed === 'standard' ? 12.0 : 8.5;
    const handlingFee = 35;
    const est = (calcWeight * baseRatePerKg) + handlingFee;
    setCalcResult(est);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Announcement Ribbon */}
      {cmsContent.announcementBanner?.enabled && (
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span>{cmsContent.announcementBanner.text}</span>
          <button 
            onClick={() => setCurrentView('blog')} 
            className="underline text-blue-200 hover:text-white ml-2 text-[11px] font-semibold"
          >
            Read Trade Corridor Updates →
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-12 pb-24 px-4 sm:px-6">
        {/* Background Subtle Gradient Spheres */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-10 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-blue-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Regulated International Operations • ISO 9001:2026 Certified</span>
          </div>

          {/* Heading & Subtitle */}
          <div className="max-w-4xl space-y-5">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-display leading-[1.1]">
              {cmsContent.heroTitle}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {cmsContent.heroSubtitle}
            </p>
          </div>

          {/* Hero Tracking Box */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 sm:p-6 rounded-2xl max-w-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-2">
                <Package className="w-4 h-4" /> Live Consignment & Cargo Radar
              </span>
              <span className="text-[11px] text-slate-300 hidden sm:inline">Real-time GPS waypoints enabled</span>
            </div>

            <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Enter Waybill / Tracking # (e.g., APX-98241)"
                  value={trackInput}
                  onChange={(e) => setTrackInput(e.target.value)}
                  className="w-full bg-white text-slate-900 placeholder-slate-400 font-mono text-sm px-4 py-3.5 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-8 py-3.5 rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>Track Cargo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* One-click Sample Tracking Numbers */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
              <span className="text-slate-400 font-medium">Quick Demo Samples:</span>
              {sampleTrackingNumbers.map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleSampleTrack(num)}
                  className="px-2.5 py-1 rounded-md bg-slate-900/80 hover:bg-blue-600 hover:text-white border border-slate-700 text-blue-300 font-mono text-[11px] transition"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Metrics Counter */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-800/80 text-xs">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white font-display">99.82%</div>
              <div className="text-slate-400 mt-0.5">On-Time Cargo Delivery</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white font-display">140+</div>
              <div className="text-slate-400 mt-0.5">International Hubs & Corridors</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white font-display">28,400+</div>
              <div className="text-slate-400 mt-0.5">Visa Filings Approved</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white font-display">9,650+</div>
              <div className="text-slate-400 mt-0.5">Global Talents Placed</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Business Pillars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <h2 className="text-xs uppercase font-bold tracking-widest text-blue-600">Enterprise Capability</h2>
          <p className="text-3xl font-extrabold text-slate-900 font-display">
            Three Specialized Pillars. One Unified Enterprise System.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1: Logistics */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                <Plane className="w-7 h-7 -rotate-45" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display">
                Express Courier & Freight
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Next-flight-out express air cargo, customs bonded transit, multi-temperature cold chain, and guaranteed waybill fulfillment across major continents.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Real-time GPS telemetry & waybills</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Customs brokerage & automated clearance</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Door-to-door courier dispatch</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => setCurrentView('tracking')}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <span>Explore Logistics Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pillar 2: Recruitment */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display">
                International Recruitment
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cross-border executive talent matching, engineering placement, salary benchmark structuring, and verified employer sponsorship pipelines.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Pre-screened executive talent pool</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Structured multi-stage interview desk</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Direct relocation sponsorship linking</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => setCurrentView('jobs')}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <span>Browse Job Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pillar 3: Visa Assistance */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-sm">
                <FileCheck2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display">
                Visa & Mobility Assistance
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Licensed consular advisory, end-to-end dossier preparation, biometric appointment scheduling, and compliance validation for GCC, UK, EU & NA.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>99.4% dossier approval first-pass rate</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Secure encrypted document vault</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Direct consular liaison & slot booking</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => setCurrentView('visa')}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-purple-600 text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <span>Explore Visa Categories</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Shipping Rate Calculator & Consultation Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest">
              <Calculator className="w-4 h-4" /> Instant Cargo Rate Estimator
            </div>
            <h2 className="text-3xl font-black tracking-tight font-display">
              Calculate Real-Time Air Cargo & Freight Tariff
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Transparent, zone-based international courier calculations with automatic fuel surcharge, handling rates, and customs clearance projections.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setAppointmentModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <Calendar className="w-4 h-4" /> Schedule Strategy Consultation
              </button>
              <button
                onClick={() => setCurrentView('pricing')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs px-5 py-3 rounded-xl transition border border-slate-700 flex items-center justify-center gap-1.5"
              >
                <span>View Full Rate Cards</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-800/90 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-4">
            <form onSubmit={calculateEstimate} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Origin Air Hub</label>
                  <select
                    value={calcOrigin}
                    onChange={(e) => setCalcOrigin(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option>Frankfurt, Germany (FRA)</option>
                    <option>London Heathrow, UK (LHR)</option>
                    <option>New York JFK, USA (JFK)</option>
                    <option>Dubai International, UAE (DXB)</option>
                    <option>Singapore Changi, SG (SIN)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Destination Hub</label>
                  <select
                    value={calcDest}
                    onChange={(e) => setCalcDest(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option>Dubai, UAE (DXB)</option>
                    <option>New York JFK, USA (JFK)</option>
                    <option>London Heathrow, UK (LHR)</option>
                    <option>Toronto Pearson, Canada (YYZ)</option>
                    <option>Riyadh King Khalid, KSA (RUH)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Total Weight (KG)</label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(parseFloat(e.target.value) || 1)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Service Tier</label>
                  <select
                    value={calcSpeed}
                    onChange={(e) => setCalcSpeed(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="express">Express Priority Air (1-2 Days)</option>
                    <option value="standard">Standard Freight Air (3-5 Days)</option>
                    <option value="economy">Economy Consolidated (5-7 Days)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 font-bold text-xs rounded-xl transition text-white"
              >
                Compute Estimated Rate
              </button>

              {calcResult !== null && (
                <div className="p-3 bg-blue-900/40 border border-blue-600/50 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="text-slate-300">Estimated Total Tariff:</div>
                    <div className="text-[10px] text-slate-400">Includes fuel & standard terminal handling</div>
                  </div>
                  <div className="text-xl font-black text-blue-400 font-display">
                    {formatPrice(calcResult, currency)}
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Featured Global Jobs Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <h2 className="text-xs uppercase font-bold tracking-widest text-indigo-600">Career Mobility</h2>
            <h3 className="text-2xl font-black text-slate-900 font-display mt-1">Featured International Vacancies</h3>
          </div>
          <button
            onClick={() => setCurrentView('jobs')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All {jobs.length} Positions</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {jobs.slice(0, 3).map((job) => (
            <div key={job.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-mono">
                    {job.jobType}
                  </span>
                  {job.isFeatured && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Priority
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-slate-900 text-base line-clamp-1">{job.title}</h4>
                <div className="text-xs text-slate-600 font-medium">{job.company} • {job.location}</div>
                <p className="text-xs text-slate-500 line-clamp-2">{job.description}</p>

                <div className="text-xs font-bold text-slate-900 pt-2 border-t border-slate-100">
                  {formatPrice(job.salaryMin, currency)} - {formatPrice(job.salaryMax, currency)} / yr
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedJobForApply(job);
                  setCurrentView('jobs');
                }}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition"
              >
                Apply with CV & Dossier
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Visa Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <h2 className="text-xs uppercase font-bold tracking-widest text-purple-600">Immigration Assistance</h2>
            <h3 className="text-2xl font-black text-slate-900 font-display mt-1">Key Consular Filing Pathways</h3>
          </div>
          <button
            onClick={() => setCurrentView('visa')}
            className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
          >
            <span>View All Visa Programs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {visaCategories.slice(0, 4).map((vc) => (
            <div key={vc.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-2xl">{vc.flagIcon}</div>
                <h4 className="font-bold text-slate-900 text-sm">{vc.country}</h4>
                <div className="text-xs font-semibold text-purple-700">{vc.name}</div>
                <p className="text-[11px] text-slate-500 line-clamp-3">{vc.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Timeline:</span>
                  <span className="font-medium text-slate-800">{vc.processingTimeDays} Days</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Service Fee:</span>
                  <span className="font-bold text-slate-900">{formatPrice(vc.serviceFee, currency)}</span>
                </div>
                <button
                  onClick={() => setCurrentView('visa')}
                  className="w-full py-1.5 rounded-lg bg-slate-100 hover:bg-purple-600 hover:text-white text-slate-700 text-xs font-semibold transition mt-1"
                >
                  Start Case File
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Trust & Testimonials */}
      <section className="bg-slate-50 py-16 px-4 sm:px-6 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-xs uppercase font-bold tracking-widest text-slate-500">Verified Client Reviews</h2>
            <h3 className="text-2xl font-black text-slate-900 font-display">Trusted by Global Corporations & Individuals</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "ApexGlobal handled our cross-border pharmaceutical freight from Frankfurt to Dubai flawlessly. The cold-chain temperature telemetry was updated at every checkpoint."
              </p>
              <div className="pt-2 border-t border-slate-100 text-xs">
                <div className="font-bold text-slate-900">Dr. Helena Brauer</div>
                <div className="text-slate-500 text-[11px]">VP Logistics, BioPharm International (Germany)</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "I was recruited for an AI engineering role in London. ApexGlobal managed both my employment contract and the entire UK Skilled Worker visa sponsorship in under 3 weeks."
              </p>
              <div className="pt-2 border-t border-slate-100 text-xs">
                <div className="font-bold text-slate-900">Tariq Al-Mansoor</div>
                <div className="text-slate-500 text-[11px]">Senior AI Architect, Fintech Global (UK)</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Their UAE Golden Visa team prepared our family dossier with zero errors. From initial document apostille to biometric appointment, the process was completely transparent."
              </p>
              <div className="pt-2 border-t border-slate-100 text-xs">
                <div className="font-bold text-slate-900">Catherine & David Sterling</div>
                <div className="text-slate-500 text-[11px]">Investors & Residents, Dubai Marina (UAE)</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

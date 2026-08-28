import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  DollarSign, 
  CheckCircle2, 
  ShieldCheck, 
  Calculator, 
  ArrowRight, 
  Package, 
  Plane, 
  FileCheck2, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { formatPrice } from '../../lib/currencies';

export const PricingPage: React.FC = () => {
  const { currency, openCheckout, setAppointmentModalOpen, setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<'freight' | 'visa' | 'recruitment'>('freight');

  const freightTiers = [
    {
      name: 'Economy Consolidated Cargo',
      pricePerKg: 8.50,
      baseFee: 25,
      deliveryTime: '5-7 Business Days',
      features: [
        'Consolidated palletized freight',
        'Standard checkpoint telemetry',
        'Standard customs clearance',
        'Commercial invoice generation',
        'Basic transit insurance ($500 cap)'
      ],
      recommended: false,
    },
    {
      name: 'Express Priority Air Waybill',
      pricePerKg: 18.50,
      baseFee: 45,
      deliveryTime: '1-3 Business Days',
      features: [
        'Guaranteed next-flight-out belly hold',
        'Real-time GPS satellite radar tracking',
        'Priority green-lane customs brokerage',
        '4x6 thermal printable air waybill',
        'Comprehensive all-risk insurance included'
      ],
      recommended: true,
    },
    {
      name: 'Cold Chain & Active Pharma Cargo',
      pricePerKg: 32.00,
      baseFee: 95,
      deliveryTime: '24-48 Hours Dedicated',
      features: [
        'Active temperature container (-20°C / 2-8°C)',
        'Continuous thermal sensor logger',
        'Dry-ice refill at all transit hubs',
        'GDP compliance certification',
        '24/7 dedicated logistics officer hotline'
      ],
      recommended: false,
    },
  ];

  const visaTiers = [
    {
      name: 'Standard Tourist & Business Dossier',
      fee: 350,
      timeline: '7-10 Business Days',
      features: [
        'Document review & eligibility check',
        'Online consular application filing',
        'Embassy biometric slot booking',
        'Electronic visa tracking dashboard',
        'Email & SMS status notifications'
      ]
    },
    {
      name: 'Skilled Worker & Relocation Visa',
      fee: 1200,
      timeline: '15-20 Business Days',
      features: [
        'Employer sponsorship credential audit',
        'Degree & police certificate apostille',
        'Legal representation with immigration authorities',
        'Priority consular interview scheduling',
        'Family dependent application linking'
      ],
      recommended: true,
    },
    {
      name: 'Golden Residency & Investor Program',
      fee: 2800,
      timeline: '25-30 Business Days',
      features: [
        'Complete 10-year residency dossier preparation',
        'High-net-worth property/financial audit',
        'Dedicated Senior Consular Officer',
        'VIP biometric & medical exam escort',
        'Post-approval Emirates ID / Residence stamping'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          Transparent, Regulated Pricing & Tariff Cards
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          No hidden fuel surcharges or surprise consular fees. Real-time conversion across all major international currencies.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('freight')}
            className={`px-5 py-2 rounded-xl transition ${
              activeTab === 'freight' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Air Freight & Courier
          </button>
          <button
            onClick={() => setActiveTab('visa')}
            className={`px-5 py-2 rounded-xl transition ${
              activeTab === 'visa' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Visa & Immigration Dossiers
          </button>
        </div>
      </div>

      {/* Freight Pricing Grid */}
      {activeTab === 'freight' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {freightTiers.map((tier, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-3xl border p-8 shadow-sm transition flex flex-col justify-between space-y-6 ${
                tier.recommended ? 'border-blue-600 ring-2 ring-blue-600/20 shadow-xl relative' : 'border-slate-200'
              }`}
            >
              {tier.recommended && (
                <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Most Popular for Air Freight
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg font-display">{tier.name}</h3>
                  <div className="text-xs text-slate-500 mt-1">Transit Window: <strong>{tier.deliveryTime}</strong></div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-2xl font-black text-slate-900 font-display">
                    {formatPrice(tier.pricePerKg, currency)} <span className="text-xs font-normal text-slate-500">/ KG</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    + {formatPrice(tier.baseFee, currency)} Base Dispatch & Documentation
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700">
                  {tier.features.map((feat, fidx) => (
                    <li key={fidx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setCurrentView('tracking')}
                className={`w-full py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
                  tier.recommended
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <span>Book Shipment Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Visa Pricing Grid */}
      {activeTab === 'visa' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {visaTiers.map((tier, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-3xl border p-8 shadow-sm transition flex flex-col justify-between space-y-6 ${
                tier.recommended ? 'border-purple-600 ring-2 ring-purple-600/20 shadow-xl relative' : 'border-slate-200'
              }`}
            >
              {tier.recommended && (
                <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Recommended for Professionals
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg font-display">{tier.name}</h3>
                  <div className="text-xs text-slate-500 mt-1">Est. Duration: <strong>{tier.timeline}</strong></div>
                </div>

                <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100">
                  <div className="text-2xl font-black text-purple-900 font-display">
                    {formatPrice(tier.fee, currency)}
                  </div>
                  <div className="text-[11px] text-purple-700 mt-0.5">
                    Complete Legal Dossier & Consular Representation
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700">
                  {tier.features.map((feat, fidx) => (
                    <li key={fidx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setCurrentView('visa')}
                className={`w-full py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
                  tier.recommended
                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <span>Initiate Visa Case</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Enterprise SLA Banner */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold">Need Volume Freight or Corporate Relocation Master Agreements?</h3>
          <p className="text-xs text-slate-300 mt-1">We provide credit line terms (Net-30/60) and dedicated SLA officers.</p>
        </div>
        <button
          onClick={() => setAppointmentModalOpen(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition shrink-0"
        >
          Request Corporate Account
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VisaCategory } from '../../types';
import { 
  FileCheck2, 
  Globe2, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Upload, 
  X, 
  ArrowRight, 
  HelpCircle,
  FileText,
  Calendar,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { formatPrice } from '../../lib/currencies';

export const VisaPage: React.FC = () => {
  const { 
    visaCategories, 
    currency, 
    applyForVisa, 
    currentUser, 
    t, 
    setAppointmentModalOpen,
    openCheckout
  } = useApp();

  const [selectedCountry, setSelectedCountry] = useState('all');
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedCatForWizard, setSelectedCatForWizard] = useState<VisaCategory | null>(null);

  // Wizard state
  const [wizardStep, setWizardStep] = useState(1);
  const [passportNumber, setPassportNumber] = useState('K98402194');
  const [nationality, setNationality] = useState('United States of America');
  const [travelPurpose, setTravelPurpose] = useState('Executive Relocation / Golden Visa');
  const [uploadedDocNames, setUploadedDocNames] = useState<string[]>([
    'Valid_Passport_BioPage.pdf',
    'Degree_Certificate_Attested.pdf'
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const countries = Array.from(new Set(visaCategories.map(v => v.country)));

  const filteredCategories = visaCategories.filter(cat => {
    return selectedCountry === 'all' || cat.country === selectedCountry;
  });

  const startWizard = (cat: VisaCategory) => {
    setSelectedCatForWizard(cat);
    setWizardStep(1);
    setWizardOpen(true);
  };

  const handleCompleteWizard = async () => {
    if (!selectedCatForWizard) return;
    setIsSubmitting(true);
    try {
      const newApp = await applyForVisa({
        visaCategoryId: selectedCatForWizard.id,
        country: selectedCatForWizard.country,
        visaType: selectedCatForWizard.name,
        passportNumber,
        nationality,
        travelPurpose,
        documents: uploadedDocNames.map(name => ({
          documentId: `doc-${Date.now()}-${Math.random()}`,
          name,
          status: 'pending_review'
        }))
      });
      setIsSubmitting(false);
      setWizardOpen(false);

      // Offer immediate payment checkout for the dossier
      openCheckout({
        serviceType: `${selectedCatForWizard.country} Visa Assistance`,
        amount: selectedCatForWizard.serviceFee,
        description: `Consular Dossier Filing & Representation for #${newApp.applicationNumber}`,
        relatedEntityId: newApp.id,
      });
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Official Government Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm text-xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-amber-900">
          <span className="font-bold uppercase tracking-wide">{t.disclaimer.title}</span>
          <p className="text-amber-800 leading-relaxed">{t.disclaimer.text}</p>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-purple-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> 99.4% First-Pass Consular Approval Rate
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-display">
            Global Visa & Legal Immigration Services
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            End-to-end consular preparation, apostille legalization, eligibility scoring, and official appointment booking for international investors, skilled workers, and corporate transferees.
          </p>
        </div>

        <button
          onClick={() => setAppointmentModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-6 py-3.5 rounded-2xl shadow-lg shadow-purple-600/30 transition flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Calendar className="w-4 h-4" /> Book Strategy Session
        </button>
      </div>

      {/* Country Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setSelectedCountry('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            selectedCountry === 'all' ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          All Jurisdictions ({visaCategories.length})
        </button>
        {countries.map(c => (
          <button
            key={c}
            onClick={() => setSelectedCountry(c)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              selectedCountry === c ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Visa Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl">{cat.flagIcon}</span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 font-mono">
                  {cat.country}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">{cat.name}</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{cat.description}</p>
              </div>

              {/* Requirements checklist */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-[11px] font-bold uppercase text-slate-500">Required Dossier Documents:</div>
                <div className="space-y-1.5 text-xs text-slate-700">
                  {cat.requiredDocuments.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="line-clamp-1">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Processing Time & Fee */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Processing Window</div>
                  <div className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{cat.processingTimeDays} Business Days</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Advisory Fee</div>
                  <div className="font-black text-purple-700 text-sm font-display">
                    {formatPrice(cat.serviceFee, currency)}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => startWizard(cat)}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Initiate Dossier Preparation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Multi-Step Visa Application Wizard Modal */}
      {wizardOpen && selectedCatForWizard && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200 my-8">
            {/* Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedCatForWizard.flagIcon}</span>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-purple-400">
                    Step {wizardStep} of 3 • Visa Application Wizard
                  </div>
                  <h3 className="font-bold text-sm text-white">{selectedCatForWizard.name}</h3>
                </div>
              </div>
              <button onClick={() => setWizardOpen(false)} className="p-1 text-slate-400 hover:text-white rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-purple-900">
                    <span className="font-bold">Applicant Identity Verification:</span> Application filed under {currentUser.name} ({currentUser.email}).
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Passport Number</label>
                      <input
                        type="text"
                        value={passportNumber}
                        onChange={(e) => setPassportNumber(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Current Nationality</label>
                      <input
                        type="text"
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Primary Purpose of Relocation / Travel</label>
                    <input
                      type="text"
                      value={travelPurpose}
                      onChange={(e) => setTravelPurpose(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setWizardStep(2)}
                    className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <span>Proceed to Document Vault</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div className="text-slate-700 font-semibold">
                    Upload & Verify Mandatory Files for {selectedCatForWizard.country}:
                  </div>

                  <div className="space-y-2">
                    {selectedCatForWizard.requiredDocuments.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-purple-600" />
                          <span className="font-medium text-slate-800">{doc}</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          Included
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Dropzone */}
                  <div className="border-2 border-dashed border-purple-200 bg-purple-50/50 rounded-xl p-4 text-center">
                    <Upload className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                    <div className="font-semibold text-purple-900">Upload Additional Supporting Records</div>
                    <div className="text-[10px] text-purple-700">Bank statements, salary certificates, tax slips (PDF, max 25MB)</div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setWizardStep(1)}
                      className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold text-slate-700"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardStep(3)}
                      className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <span>Review & Submit</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-900 text-sm">Dossier Summary</div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                      <div>Jurisdiction: <strong className="text-slate-900">{selectedCatForWizard.country}</strong></div>
                      <div>Program: <strong className="text-slate-900">{selectedCatForWizard.name}</strong></div>
                      <div>Applicant: <strong className="text-slate-900">{currentUser.name}</strong></div>
                      <div>Passport: <strong className="text-slate-900">{passportNumber}</strong></div>
                      <div>Advisory Fee: <strong className="text-purple-600">{formatPrice(selectedCatForWizard.serviceFee, currency)}</strong></div>
                      <div>Processing: <strong className="text-slate-900">{selectedCatForWizard.processingTimeDays} Days</strong></div>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>
                      Upon submission, an assigned Visa Officer will review all documents against consular criteria before booking the official embassy biometric appointment.
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold text-slate-700"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleCompleteWizard}
                      className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                    >
                      {isSubmitting ? 'Transmitting Dossier...' : 'Submit & Proceed to Checkout'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

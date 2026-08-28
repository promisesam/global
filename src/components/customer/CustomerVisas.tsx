import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileCheck2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Plus, 
  FileText, 
  CreditCard 
} from 'lucide-react';
import { formatStatus, formatDate, getStatusBadgeColor } from '../../lib/utils';
import { formatPrice } from '../../lib/currencies';

export const CustomerVisas: React.FC = () => {
  const { 
    visaApplications, 
    currentUser, 
    setCurrentView, 
    setAppointmentModalOpen, 
    openCheckout, 
    currency 
  } = useApp();

  const userVisas = visaApplications.filter(v => v.userId === currentUser.id);

  const stages = ['draft', 'submitted', 'under_review', 'additional_docs_required', 'biometrics_scheduled', 'approved'];

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'submitted': return 1;
      case 'under_review': return 2;
      case 'biometrics_scheduled': return 4;
      case 'approved': return 5;
      default: return 1;
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">My Visa & Immigration Case Files</h1>
          <p className="text-xs text-slate-500">Track dossier preparation, consular compliance reviews, and embassy biometric dates.</p>
        </div>

        <button
          onClick={() => setCurrentView('visa')}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Start New Visa Filing
        </button>
      </div>

      <div className="space-y-4">
        {userVisas.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500 space-y-3">
            <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No Visa Dossiers Open</h3>
            <p>Explore Golden Visas, Skilled Worker programs, and business dossiers across 140+ countries.</p>
            <button
              onClick={() => setCurrentView('visa')}
              className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl"
            >
              Explore Visa Pathways
            </button>
          </div>
        ) : (
          userVisas.map((visa) => {
            const activeIdx = getStageIndex(visa.status);
            return (
              <div key={visa.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 font-display">
                        {visa.country} • {visa.visaType}
                      </h3>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${getStatusBadgeColor(visa.status)}`}>
                        {formatStatus(visa.status)}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 font-medium">
                      <span>Dossier #{visa.applicationNumber}</span>
                      <span>•</span>
                      <span>Submitted: {formatDate(visa.submittedAt)}</span>
                      <span>•</span>
                      <span>Assigned Officer: <strong className="text-slate-800">{visa.assignedOfficerName || 'Senior Consular Desk'}</strong></span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setAppointmentModalOpen(true)}
                      className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-xl border border-purple-200 transition flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" /> Book Consular Slot
                    </button>
                  </div>
                </div>

                {/* Progress Stepper */}
                <div className="py-2">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { label: 'Dossier Filed', key: 'submitted' },
                      { label: 'Officer Review', key: 'under_review' },
                      { label: 'Apostille & Legalization', key: 'legalization' },
                      { label: 'Embassy Biometrics', key: 'biometrics_scheduled' },
                      { label: 'Visa Granted', key: 'approved' },
                    ].map((step, idx) => {
                      const isPast = idx <= activeIdx;
                      const isCurrent = idx === activeIdx;
                      return (
                        <div key={step.key} className="flex flex-col items-center text-center space-y-1.5">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            isPast ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400 border'
                          }`}>
                            {isPast ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span className={`text-[11px] font-medium leading-tight ${isCurrent ? 'text-purple-600 font-bold' : isPast ? 'text-slate-800' : 'text-slate-400'}`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Checklist & Document Vault records */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                  <div className="font-bold text-slate-800 flex items-center justify-between">
                    <span>Dossier Supporting Documents</span>
                    <span className="text-[11px] text-purple-700 font-semibold">{visa.documents.length} verified records attached</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {visa.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                        <div className="flex items-center gap-1.5 truncate">
                          <FileText className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span className="font-medium text-slate-900 truncate">{doc.name}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getStatusBadgeColor(doc.status)}`}>
                          {formatStatus(doc.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

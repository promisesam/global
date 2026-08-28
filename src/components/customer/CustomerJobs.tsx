import React from 'react';
import { useApp } from '../../context/AppContext';
import { Briefcase, Building2, MapPin, Calendar, Clock, CheckCircle2, ArrowRight, FileText, Sparkles } from 'lucide-react';
import { formatStatus, formatDate, getStatusBadgeColor } from '../../lib/utils';

export const CustomerJobs: React.FC = () => {
  const { jobApplications, currentUser, setCurrentView, setAppointmentModalOpen } = useApp();

  const userApps = jobApplications.filter(a => a.userId === currentUser.id);

  const stages = ['applied', 'screening', 'interview_scheduled', 'offer_extended', 'accepted'];

  const getStageIndex = (status: string) => {
    const idx = stages.indexOf(status);
    return idx === -1 ? 1 : idx;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">My Career & Relocation Applications</h1>
          <p className="text-xs text-slate-500">Track candidate review stages, interview schedules, and legal sponsorship linking.</p>
        </div>

        <button
          onClick={() => setCurrentView('jobs')}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
        >
          <Briefcase className="w-4 h-4" /> Browse Vacancies
        </button>
      </div>

      <div className="space-y-4">
        {userApps.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500 space-y-3">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No Active Applications</h3>
            <p>Explore international roles in logistics, cloud architecture, and corporate trade.</p>
            <button
              onClick={() => setCurrentView('jobs')}
              className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl"
            >
              Explore Open Vacancies
            </button>
          </div>
        ) : (
          userApps.map((app) => {
            const activeIdx = getStageIndex(app.status);
            return (
              <div key={app.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 font-display">{app.jobTitle}</h3>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${getStatusBadgeColor(app.status)}`}>
                        {formatStatus(app.status)}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 font-medium">
                      <span>{app.companyName}</span>
                      <span>•</span>
                      <span>Applied: {formatDate(app.appliedAt)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {app.interviewDate && (
                      <button
                        onClick={() => setAppointmentModalOpen(true)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl border border-indigo-200 transition flex items-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5" /> View Interview Slot
                      </button>
                    )}
                  </div>
                </div>

                {/* Candidate Stepper */}
                <div className="py-2">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { label: 'Application Submitted', key: 'applied' },
                      { label: 'Screening Audit', key: 'screening' },
                      { label: 'Technical Interview', key: 'interview_scheduled' },
                      { label: 'Offer Extended', key: 'offer_extended' },
                      { label: 'Hired & Relocating', key: 'accepted' },
                    ].map((st, sidx) => {
                      const isPast = sidx <= activeIdx;
                      const isCurrent = sidx === activeIdx;
                      return (
                        <div key={st.key} className="flex flex-col items-center text-center space-y-1.5">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            isPast ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 border'
                          }`}>
                            {isPast ? <CheckCircle2 className="w-4 h-4" /> : sidx + 1}
                          </div>
                          <span className={`text-[11px] font-medium leading-tight ${isCurrent ? 'text-indigo-600 font-bold' : isPast ? 'text-slate-800' : 'text-slate-400'}`}>
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Candidate notes and CV reference */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Attached CV File:</span>
                    <div className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{app.cvFileName}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Visa Relocation Sponsorship:</span>
                    <div className="font-bold text-emerald-700 mt-0.5">
                      {app.visaRequired ? '✓ Sponsorship Requested & Linked' : 'Not Required (Local Resident)'}
                    </div>
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

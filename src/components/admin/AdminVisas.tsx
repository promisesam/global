import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VisaApplication, VisaStatus } from '../../types';
import { 
  FileCheck2, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  User, 
  ShieldCheck, 
  FileText, 
  Plus, 
  X,
  AlertCircle 
} from 'lucide-react';
import { formatStatus, formatDate, getStatusBadgeColor } from '../../lib/utils';

export const AdminVisas: React.FC = () => {
  const { visaApplications, updateVisaApplication, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState<VisaApplication | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const [officerNotes, setOfficerNotes] = useState('');
  const [newStatus, setNewStatus] = useState<VisaStatus>('under_review');
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredVisas = visaApplications.filter(v => {
    return v.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           v.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
           v.country.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleOpenReview = (visa: VisaApplication) => {
    setSelectedCase(visa);
    setNewStatus(visa.status);
    setOfficerNotes(visa.officerNotes || '');
    setReviewModalOpen(true);
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;
    setIsUpdating(true);
    try {
      await updateVisaApplication(selectedCase.id, {
        status: newStatus,
        officerNotes,
        assignedOfficerName: 'Marcus Sterling (Senior Consular Attaché)',
      });
      setIsUpdating(false);
      setReviewModalOpen(false);
      showToast('success', 'Consular Case Updated', `Dossier #${selectedCase.applicationNumber} updated to ${formatStatus(newStatus)}.`);
    } catch {
      setIsUpdating(false);
    }
  };

  const handleVerifyDocument = async (docIndex: number) => {
    if (!selectedCase) return;
    const updatedDocs = [...selectedCase.documents];
    updatedDocs[docIndex].status = 'verified';
    await updateVisaApplication(selectedCase.id, {
      documents: updatedDocs,
    });
    setSelectedCase({ ...selectedCase, documents: updatedDocs });
    showToast('success', 'Document Verified', `Document marked as verified and attested.`);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Consular & Visa Processing Station</h1>
          <p className="text-xs text-slate-500">Audit KYC dossiers, verify apostille seals, and schedule official diplomatic biometrics.</p>
        </div>

        <div className="flex gap-2">
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-2 rounded-xl flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-purple-600" />
            <span>{visaApplications.length} Total Registered Dossiers</span>
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="Search dossier by applicant name, dossier # or destination country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Visas Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Dossier Number</th>
                <th className="py-3.5 px-4">Applicant Particulars</th>
                <th className="py-3.5 px-4">Jurisdiction & Category</th>
                <th className="py-3.5 px-4">Documents</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Consular Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVisas.map((visa) => (
                <tr key={visa.id} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-4 font-mono font-bold text-purple-600">
                    <div>#{visa.applicationNumber}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{formatDate(visa.submittedAt)}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{visa.applicantName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{visa.applicantEmail}</div>
                    <div className="text-[10px] text-slate-400">Pass: {visa.passportNumber}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800">{visa.country}</div>
                    <div className="text-[11px] text-slate-500">{visa.visaType}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-700 font-medium">
                      {visa.documents.filter(d => d.status === 'verified').length} / {visa.documents.length} Verified
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getStatusBadgeColor(visa.status)}`}>
                      {formatStatus(visa.status)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenReview(visa)}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] rounded-lg transition inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Review Dossier</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Dossier Modal */}
      {reviewModalOpen && selectedCase && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl p-6 space-y-5 text-xs animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-purple-600 font-mono">Consular Adjudication</span>
                <h3 className="font-bold text-sm text-slate-900">
                  Dossier #{selectedCase.applicationNumber} - {selectedCase.applicantName}
                </h3>
              </div>
              <button onClick={() => setReviewModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Verification Section */}
            <div className="space-y-2">
              <div className="font-bold text-slate-800">Attached Dossier Documents</div>
              <div className="space-y-2">
                {selectedCase.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-purple-600 shrink-0" />
                      <span className="font-medium text-slate-900 truncate">{doc.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getStatusBadgeColor(doc.status)}`}>
                        {formatStatus(doc.status)}
                      </span>
                      {doc.status !== 'verified' && (
                        <button
                          type="button"
                          onClick={() => handleVerifyDocument(idx)}
                          className="px-2 py-1 bg-emerald-600 text-white font-bold text-[10px] rounded hover:bg-emerald-700"
                        >
                          Verify Seal
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Dossier Decision Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as VisaStatus)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  <option value="under_review">Under Consular Review</option>
                  <option value="biometrics_scheduled">Biometrics & Interview Scheduled</option>
                  <option value="approved">Visa Granted / Approved</option>
                  <option value="additional_docs_required">Additional Documents Required</option>
                  <option value="rejected">Application Refused / Ineligible</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Consular Officer Notes</label>
                <textarea
                  rows={3}
                  value={officerNotes}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  placeholder="Record apostille validation numbers, interview remarks, or additional compliance requirements..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold text-slate-700"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {isUpdating ? 'Recording Adjudication...' : 'Commit Adjudication Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

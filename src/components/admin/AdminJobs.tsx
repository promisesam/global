import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JobPosting, ApplicationStatus } from '../../types';
import { 
  Briefcase, 
  Search, 
  Plus, 
  Users, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  FileText, 
  Sparkles, 
  X, 
  Building2, 
  MapPin 
} from 'lucide-react';
import { formatStatus, formatDate, getStatusBadgeColor } from '../../lib/utils';
import { formatPrice } from '../../lib/currencies';

export const AdminJobs: React.FC = () => {
  const { 
    jobPostings, 
    jobApplications, 
    updateJobApplication, 
    createJobPosting, 
    currency, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'applications' | 'postings'>('applications');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  // New Job Modal
  const [newJobModal, setNewJobModal] = useState(false);
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering & Tech');
  const [location, setLocation] = useState('Dubai, UAE');
  const [country, setCountry] = useState('United Arab Emirates');
  const [type, setType] = useState<'Full-Time' | 'Executive Contract' | 'Relocation Package'>('Full-Time');
  const [salaryMin, setSalaryMin] = useState(90000);
  const [salaryMax, setSalaryMax] = useState(130000);
  const [visaProvided, setVisaProvided] = useState(true);
  const [description, setDescription] = useState('');
  const [isCreatingJob, setIsCreatingJob] = useState(false);

  const filteredApps = jobApplications.filter(a => {
    return a.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           a.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
           a.candidateEmail.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
    await updateJobApplication(appId, { status: newStatus });
    showToast('success', 'Candidate Stage Updated', `Candidate application marked as ${formatStatus(newStatus)}.`);
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingJob(true);
    try {
      await createJobPosting({
        title,
        department,
        location,
        country,
        type,
        salaryMin,
        salaryMax,
        currency: 'USD',
        experienceLevel: 'Mid-Senior Level',
        description,
        requirements: ['5+ years relevant domain expertise', 'Fluent in professional English', 'Degree in related discipline'],
        benefits: ['Full Visa Sponsorship & Relocation Allowance', 'Comprehensive Health Insurance', 'Annual Performance Bonus'],
        visaProvided,
      });
      setIsCreatingJob(false);
      setNewJobModal(false);
      setTitle('');
      setDescription('');
    } catch {
      setIsCreatingJob(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Recruitment & Candidate Pipeline</h1>
          <p className="text-xs text-slate-500">Screen global engineering talent, schedule interviews, and issue corporate relocation contracts.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setNewJobModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Post New Vacancy
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'applications' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Candidate Applications ({jobApplications.length})
        </button>
        <button
          onClick={() => setActiveTab('postings')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'postings' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Active Job Listings ({jobPostings.length})
        </button>
      </div>

      {/* Applications Table */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Search candidate by name, email or job title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Candidate Particulars</th>
                  <th className="py-3.5 px-4">Target Position</th>
                  <th className="py-3.5 px-4">Visa Required?</th>
                  <th className="py-3.5 px-4">Application Date</th>
                  <th className="py-3.5 px-4">Pipeline Status</th>
                  <th className="py-3.5 px-4 text-right">Stage Progression</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{app.candidateName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{app.candidateEmail}</div>
                      <div className="text-[10px] text-indigo-600 font-medium mt-0.5 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> CV: {app.cvFileName}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{app.jobTitle}</div>
                      <div className="text-[11px] text-slate-500">{app.companyName}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {app.visaRequired ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                          ✓ Visa Needed
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Local Resident</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {formatDate(app.appliedAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getStatusBadgeColor(app.status)}`}>
                        {formatStatus(app.status)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                        className="bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs font-semibold"
                      >
                        <option value="applied">1. Applied</option>
                        <option value="screening">2. Screening</option>
                        <option value="interview_scheduled">3. Interview Scheduled</option>
                        <option value="offer_extended">4. Offer Extended</option>
                        <option value="accepted">5. Accepted & Hired</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Job Postings Tab */}
      {activeTab === 'postings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobPostings.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {job.department}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-1">{job.title}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" /> {job.location} • {job.type}
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900">
                  {formatPrice(job.salaryMin, currency)} - {formatPrice(job.salaryMax, currency)}
                </span>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2">{job.description}</p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-emerald-600 font-semibold text-[11px]">
                  {job.visaProvided ? '✓ Full Relocation Sponsorship Included' : 'Local Only'}
                </span>
                <span className="text-slate-400 text-[10px]">Posted: {formatDate(job.postedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Job Modal */}
      {newJobModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-4 text-xs animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" /> Post New Job Vacancy
              </h3>
              <button onClick={() => setNewJobModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lead Aerospace Cargo Coordinator"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location / Hub</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min Annual Salary (USD)</label>
                  <input
                    type="number"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Annual Salary (USD)</label>
                  <input
                    type="number"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Overview</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize the role responsibilities and requirements..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs"
                  required
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <input
                  type="checkbox"
                  checked={visaProvided}
                  onChange={(e) => setVisaProvided(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span className="font-semibold text-indigo-900">Include Complete Visa & Relocation Package</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewJobModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingJob}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {isCreatingJob ? 'Publishing...' : 'Publish Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

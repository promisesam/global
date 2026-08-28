import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JobVacancy } from '../../types';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  Building2, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Upload, 
  X, 
  ShieldCheck, 
  Sparkles,
  Filter,
  ArrowRight
} from 'lucide-react';
import { formatPrice } from '../../lib/currencies';
import { formatDate } from '../../lib/utils';

export const JobsPage: React.FC = () => {
  const { 
    jobs, 
    currency, 
    selectedJobForApply, 
    setSelectedJobForApply, 
    applyForJob,
    currentUser,
    setCurrentView
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Application Form State
  const [candidateYearsExp, setCandidateYearsExp] = useState('6');
  const [candidateCoverLetter, setCandidateCoverLetter] = useState(
    'I have 6+ years of international enterprise systems experience and I am eager to contribute to global logistics & cloud transformation.'
  );
  const [needsVisaSponsorship, setNeedsVisaSponsorship] = useState(true);
  const [cvFileName, setCvFileName] = useState('Resume_Alexander_Wright_Lead_Architect.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDept = selectedDept === 'all' || job.department.toLowerCase().includes(selectedDept.toLowerCase());
    const matchesLoc = selectedLocation === 'all' || job.location.toLowerCase().includes(selectedLocation.toLowerCase());
    const matchesType = selectedType === 'all' || job.jobType.toLowerCase() === selectedType.toLowerCase();
    return matchesSearch && matchesDept && matchesLoc && matchesType;
  });

  const departments = ['Engineering', 'Logistics Operations', 'Commercial Trade', 'Data Intelligence'];

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForApply) return;
    setIsSubmitting(true);
    try {
      await applyForJob(selectedJobForApply.id, {
        cvFileName,
        yearsOfExperience: parseInt(candidateYearsExp) || 3,
        coverLetter: candidateCoverLetter,
        visaRequired: needsVisaSponsorship,
      });
      setIsSubmitting(false);
      setSelectedJobForApply(null);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-indigo-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Direct Global Sponsorship & Relocation Placements
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-display">
          International Careers & Relocation Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
          Discover high-impact roles across international logistics, supply chain systems, fintech, and engineering hubs with integrated employer visa sponsorship.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="relative">
            <input
              type="text"
              placeholder="Search title, skills or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium"
            >
              <option value="all">All Departments</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium"
            >
              <option value="all">All Global Locations</option>
              <option value="London">London, UK</option>
              <option value="Frankfurt">Frankfurt, Germany</option>
              <option value="Dubai">Dubai, UAE</option>
              <option value="Toronto">Toronto, Canada</option>
              <option value="New York">New York, USA</option>
            </select>
          </div>

          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium"
            >
              <option value="all">All Contract Types</option>
              <option value="Full-time">Full-time Permanent</option>
              <option value="Contract">Executive Contract</option>
              <option value="Remote">Global Remote / Hybrid</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Showing <strong>{filteredJobs.length}</strong> available positions</span>
          <span className="text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> All listings include legal sponsorship assessment
          </span>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full font-mono">
                  {job.department}
                </span>
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Deadline: {formatDate(job.deadline)}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">{job.title}</h3>
                <div className="text-xs text-slate-600 flex items-center gap-2 mt-1 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{job.company}</span>
                  <span>•</span>
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{job.location}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {job.description}
              </p>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {job.skills.map((skill, idx) => (
                  <span key={idx} className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Salary & Visa Sponsorship */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Annual Compensation</div>
                  <div className="font-black text-slate-900 text-sm font-display">
                    {formatPrice(job.salaryMin, currency)} - {formatPrice(job.salaryMax, currency)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Visa Support</div>
                  <div className="text-emerald-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Full Sponsorship
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedJobForApply(job)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>Submit Candidate Application</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Job Application Modal */}
      {selectedJobForApply && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 my-8">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-indigo-400 font-bold">Candidate Application</div>
                <h3 className="font-bold text-sm text-white">{selectedJobForApply.title}</h3>
              </div>
              <button onClick={() => setSelectedJobForApply(null)} className="p-1 text-slate-400 hover:text-white rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="p-6 space-y-4 text-xs">
              {/* Applicant Info (Auto-Filled from active profile) */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-[10px] font-bold uppercase text-slate-500">Applicant Identity</div>
                <div className="font-bold text-slate-900">{currentUser.name} ({currentUser.email})</div>
                <div className="text-slate-600">{currentUser.phone}</div>
              </div>

              {/* Experience Years */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Total Relevant Experience (Years)</label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={candidateYearsExp}
                  onChange={(e) => setCandidateYearsExp(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                  required
                />
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Executive Summary / Cover Note</label>
                <textarea
                  rows={3}
                  value={candidateCoverLetter}
                  onChange={(e) => setCandidateCoverLetter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs leading-relaxed"
                  required
                />
              </div>

              {/* Simulated CV Upload Dropzone */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Curriculum Vitae (PDF / DOCX)</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
                  <Upload className="w-6 h-6 text-indigo-600 mx-auto mb-1.5" />
                  <div className="font-semibold text-slate-800 text-xs">{cvFileName}</div>
                  <div className="text-[10px] text-slate-500">Click to replace or drop updated resume file (Max 15MB)</div>
                </div>
              </div>

              {/* Visa Sponsorship Checkbox */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50/70 border border-indigo-100">
                <input
                  type="checkbox"
                  id="visa-sponsorship-check"
                  checked={needsVisaSponsorship}
                  onChange={(e) => setNeedsVisaSponsorship(e.target.checked)}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="visa-sponsorship-check" className="text-indigo-950 font-medium">
                  I will require legal employer visa sponsorship and consular relocation assistance for {selectedJobForApply.location}.
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedJobForApply(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md"
                >
                  {isSubmitting ? 'Transmitting Dossier...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  ShieldCheck 
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { createSupportTicket, setAppointmentModalOpen, cmsContent } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState<'logistics' | 'recruitment' | 'visa' | 'billing' | 'general'>('logistics');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const globalHubs = [
    {
      city: 'London, UK (Global HQ)',
      address: 'Apex Tower, 12 Bishopsgate, London EC2N 4BQ',
      phone: '+44 (20) 7946 0912',
      email: 'london.desk@apexglobal.com',
      badge: 'Corporate HQ & EMEA Desk',
    },
    {
      city: 'Frankfurt, Germany (Air Cargo Hub)',
      address: 'CargoCity Süd, Building 502, Frankfurt Airport (FRA)',
      phone: '+49 (69) 5050 4410',
      email: 'frankfurt.cargo@apexglobal.com',
      badge: 'Cold Chain & Air Freight Hub',
    },
    {
      city: 'Dubai, UAE (MENA & Consular Desk)',
      address: 'DIFC Gate Precinct 4, Level 7, Dubai',
      phone: '+971 (4) 312 8800',
      email: 'dubai.visa@apexglobal.com',
      badge: 'Golden Visa & GCC Mobility',
    },
    {
      city: 'New York, USA (North America)',
      address: 'One World Trade Center, Suite 8400, New York, NY',
      phone: '+1 (800) 555-0199',
      email: 'us.operations@apexglobal.com',
      badge: 'North America Hub',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createSupportTicket({
        subject: `[Public Inquiry - ${department.toUpperCase()}] ${subject}`,
        category: department,
        priority: 'medium',
        initialMessage: `From: ${name} (${email})\n\n${message}`,
      });
      setIsSubmitting(false);
      setSubmitted(true);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          Connect with Our Global Operations Desk
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Our specialized logistics controllers, recruitment consultants, and visa officers are standing by 24 hours a day.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-lg font-display">Send Direct Inquiry</h2>
            <button
              onClick={() => setAppointmentModalOpen(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Calendar className="w-3.5 h-3.5" /> Book 1-on-1 Consultation
            </button>
          </div>

          {submitted ? (
            <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3 text-xs">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-slate-900 text-base">Inquiry Transmitted Successfully</h3>
              <p className="text-slate-600 max-w-md mx-auto">
                A verified ticket has been dispatched to our desk. An assigned operations officer will respond via email within 2 business hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 bg-emerald-700 text-white font-bold rounded-xl text-xs"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alexander Wright"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Corporate / Contact Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium"
                  >
                    <option value="logistics">Courier & Freight Logistics</option>
                    <option value="recruitment">Recruitment & Executive Search</option>
                    <option value="visa">Visa & Consular Assistance</option>
                    <option value="billing">Invoicing & Corporate Credit</option>
                    <option value="general">General Operations Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Air Freight quote Frankfurt to Dubai"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Message / Specifications</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide cargo dimensions, destination country, role specifications, or visa requirements..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Transmitting to Operations Desk...' : 'Dispatch Message'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Global Hubs Sidebar */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="font-bold text-slate-900 text-lg font-display">International Command Hubs</h2>
          <div className="space-y-3">
            {globalHubs.map((hub, idx) => (
              <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{hub.city}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded">
                    {hub.badge}
                  </span>
                </div>
                <div className="text-slate-600 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{hub.address}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px]">
                  <span className="text-slate-700 font-mono">{hub.phone}</span>
                  <span className="text-blue-600 font-medium">{hub.email}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

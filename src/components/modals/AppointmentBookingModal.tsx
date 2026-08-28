import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, Clock, Video, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';

export const AppointmentBookingModal: React.FC = () => {
  const { appointmentModalOpen, setAppointmentModalOpen, bookAppointment } = useApp();
  const [serviceType, setServiceType] = useState<'Visa Consultation' | 'Job Interview' | 'Courier Business Account' | 'Document Verification'>('Visa Consultation');
  const [date, setDate] = useState('2026-09-04');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 10:45 AM');
  const [mode, setMode] = useState<'Video Call (Google Meet / Zoom)' | 'In-Person (Headquarters Hub)' | 'Phone Consultation'>('Video Call (Google Meet / Zoom)');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!appointmentModalOpen) return null;

  const timeSlots = [
    '09:00 AM - 09:45 AM',
    '10:00 AM - 10:45 AM',
    '11:30 AM - 12:15 PM',
    '02:00 PM - 02:45 PM',
    '03:30 PM - 04:15 PM',
    '05:00 PM - 05:45 PM',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await bookAppointment({
        serviceType,
        date,
        timeSlot,
        mode,
        notes,
      });
      setIsSubmitting(false);
      setAppointmentModalOpen(false);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900/90 backdrop-blur-2xl text-white rounded-2xl shadow-2xl border border-white/15 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white/[0.04] text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-sm">Schedule Official Consultation / Appointment</span>
          </div>
          <button onClick={() => setAppointmentModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Service Selection */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Appointment Type</label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value as any)}
              className="w-full bg-slate-800/90 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-400 font-medium"
            >
              <option value="Visa Consultation" className="bg-slate-900 text-white">Visa Strategy & Dossier Audit Consultation</option>
              <option value="Job Interview" className="bg-slate-900 text-white">Executive Recruitment Screening Interview</option>
              <option value="Courier Business Account" className="bg-slate-900 text-white">Enterprise Freight & Supply Chain Account Setup</option>
              <option value="Document Verification" className="bg-slate-900 text-white">Consular Document & KYC Verification</option>
            </select>
          </div>

          {/* Meeting Mode */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Consultation Channel</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode('Video Call (Google Meet / Zoom)')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  mode === 'Video Call (Google Meet / Zoom)'
                    ? 'border-blue-500/50 bg-blue-600/30 text-blue-300 shadow-md backdrop-blur-md'
                    : 'border-white/10 text-slate-300 hover:bg-white/5'
                }`}
              >
                <Video className="w-4 h-4" /> Google Meet (Virtual)
              </button>
              <button
                type="button"
                onClick={() => setMode('In-Person (Headquarters Hub)')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  mode === 'In-Person (Headquarters Hub)'
                    ? 'border-blue-500/50 bg-blue-600/30 text-blue-300 shadow-md backdrop-blur-md'
                    : 'border-white/10 text-slate-300 hover:bg-white/5'
                }`}
              >
                <MapPin className="w-4 h-4" /> London / Dubai Office
              </button>
            </div>
          </div>

          {/* Date & Time Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Select Date</label>
              <input
                type="date"
                value={date}
                min="2026-08-29"
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-800/90 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400 font-medium"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Select Time Slot</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full bg-slate-800/90 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400 font-medium"
              >
                {timeSlots.map(ts => (
                  <option key={ts} value={ts} className="bg-slate-900 text-white">{ts}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Topics / Reference Notes (Optional)</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., specific country visa questions, passport validity queries, or cargo freight dimensions..."
              className="w-full bg-white/[0.07] border border-white/15 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Notice */}
          <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 flex items-start gap-2 text-[11px] text-blue-200">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>
              Confirmed slots automatically generate Google Calendar and Outlook meeting invites with high-definition video access links.
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 border border-white/10 transition cursor-pointer"
          >
            {isSubmitting ? 'Confirming with Calendar...' : 'Confirm Appointment Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};

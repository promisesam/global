import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Video, MapPin, Clock, Plus, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { formatStatus, formatDate, getStatusBadgeColor } from '../../lib/utils';

export const CustomerAppointments: React.FC = () => {
  const { appointments, currentUser, setAppointmentModalOpen, updateAppointment, showToast } = useApp();

  const userApts = appointments.filter(a => a.userId === currentUser.id);

  const handleCancel = async (id: string) => {
    await updateAppointment(id, { status: 'cancelled' });
    showToast('info', 'Appointment Cancelled', 'Your scheduled slot has been released.');
  };

  const handleJoinVideo = (link?: string) => {
    showToast('info', 'Opening Video Room', 'Launching secure Google Meet / Zoom HD room session.');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Scheduled Consultations & Interviews</h1>
          <p className="text-xs text-slate-500">Manage video meetings, consular interviews, and supply chain briefings.</p>
        </div>

        <button
          onClick={() => setAppointmentModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Book New Appointment
        </button>
      </div>

      <div className="space-y-4">
        {userApts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500 space-y-3">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No Scheduled Consultations</h3>
            <p>Book a dedicated 1-on-1 strategy session with our visa officers or logistics specialists.</p>
            <button
              onClick={() => setAppointmentModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl"
            >
              Schedule Consultation
            </button>
          </div>
        ) : (
          userApts.map((apt) => (
            <div key={apt.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 font-display">{apt.serviceType}</h3>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${getStatusBadgeColor(apt.status)}`}>
                      {formatStatus(apt.status)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(apt.date)} • {apt.timeSlot}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {apt.meetingLink && apt.status === 'confirmed' && (
                    <button
                      onClick={() => handleJoinVideo(apt.meetingLink)}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" /> Join Google Meet
                    </button>
                  )}
                  {apt.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancel(apt.id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs font-semibold rounded-xl transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500">Consultation Channel:</span>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    {apt.mode.includes('Video') ? <Video className="w-3.5 h-3.5 text-blue-600" /> : <MapPin className="w-3.5 h-3.5 text-blue-600" />}
                    <span>{apt.mode}</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Assigned Specialist:</span>
                  <div className="font-bold text-slate-800 mt-0.5">
                    {apt.assignedStaffName || 'Senior Advisory Officer'}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

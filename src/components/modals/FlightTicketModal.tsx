import React from 'react';
import { useApp } from '../../context/AppContext';
import { FlightBooking } from '../../types';
import { 
  X, 
  Printer, 
  Download, 
  Plane, 
  QrCode, 
  Luggage, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  FileText,
  CreditCard,
  Building2,
  CheckCircle2,
  Barcode
} from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { formatPrice } from '../../lib/currencies';

export const FlightTicketModal: React.FC = () => {
  const { 
    selectedFlightTicket, 
    setSelectedFlightTicket, 
    openReceiptModal, 
    checkinFlight,
    currency 
  } = useApp();

  if (!selectedFlightTicket) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCheckin = async () => {
    if (selectedFlightTicket.checkinStatus !== 'completed') {
      await checkinFlight(selectedFlightTicket.id);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/15 w-full max-w-3xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 text-white">
        {/* Header Action Bar (hidden when printing) */}
        <div className="bg-gradient-to-r from-blue-600/30 via-indigo-600/30 to-purple-600/30 px-6 py-4 flex items-center justify-between border-b border-white/10 print:hidden">
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-sm">Electronic Ticket & Boarding Pass (IATA Passenger Record)</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => openReceiptModal(selectedFlightTicket)}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 transition"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" /> View Tax Receipt
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md transition border border-white/10"
            >
              <Printer className="w-3.5 h-3.5" /> Print E-Ticket
            </button>
            <button
              onClick={() => setSelectedFlightTicket(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Body */}
        <div className="p-6 sm:p-8 space-y-6 bg-slate-950 text-white font-sans" id="printable-flight-ticket">
          {/* Main Boarding Pass Card */}
          <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/60 border border-white/15 overflow-hidden shadow-2xl">
            {/* Top Brand Banner */}
            <div className="px-6 py-4 bg-white/[0.04] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                  ✈
                </div>
                <div>
                  <div className="text-xs font-bold text-white tracking-wider uppercase font-display">{selectedFlightTicket.airline}</div>
                  <div className="text-[10px] text-slate-400">Operated by ApexGlobal Aviation Network</div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 uppercase">PNR / Booking Ref</span>
                <div className="text-sm font-black font-mono text-blue-400 tracking-wider">
                  {selectedFlightTicket.eTicketNumber || selectedFlightTicket.bookingReference}
                </div>
              </div>
            </div>

            {/* Flight Flight Path Grid */}
            <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center border-b border-dashed border-white/20">
              {/* Origin */}
              <div>
                <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                  {selectedFlightTicket.originAirportCode}
                </div>
                <div className="text-sm font-semibold text-slate-200 mt-1">{selectedFlightTicket.originCity}</div>
                <div className="text-xs text-blue-400 font-mono mt-0.5">
                  Dep: {selectedFlightTicket.departureTime?.replace('T', ' ').substring(0, 16) || 'Scheduled'}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Terminal {selectedFlightTicket.terminal} • Gate {selectedFlightTicket.gate}</div>
              </div>

              {/* Flight Icon & Flight Number */}
              <div className="flex flex-col items-center justify-center text-center px-2">
                <div className="text-xs font-bold font-mono text-slate-300 mb-1">{selectedFlightTicket.flightNumber}</div>
                <div className="w-full flex items-center gap-2 text-blue-400">
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-blue-500 to-blue-400" />
                  <Plane className="w-5 h-5 shrink-0 rotate-90 sm:rotate-0" />
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-blue-400 via-blue-500 to-transparent" />
                </div>
                <div className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
                  {selectedFlightTicket.seatClass}
                </div>
              </div>

              {/* Destination */}
              <div className="sm:text-right">
                <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                  {selectedFlightTicket.destinationAirportCode}
                </div>
                <div className="text-sm font-semibold text-slate-200 mt-1">{selectedFlightTicket.destinationCity}</div>
                <div className="text-xs text-blue-400 font-mono mt-0.5">
                  Arr: {selectedFlightTicket.arrivalTime?.replace('T', ' ').substring(0, 16) || 'Scheduled'}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Status: Confirmed</div>
              </div>
            </div>

            {/* Passenger, Seat, Gate & Boarding Information */}
            <div className="p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs bg-white/[0.02]">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Passenger</div>
                <div className="font-bold text-white text-sm mt-0.5 truncate">{selectedFlightTicket.customerName}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">Passport: {selectedFlightTicket.passportNumber || 'VERIFIED'}</div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Seat</div>
                <div className="font-mono font-black text-xl text-emerald-400 mt-0.5">{selectedFlightTicket.seatNumber}</div>
                <div className="text-[10px] text-slate-400">{selectedFlightTicket.seatClass}</div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Boarding Time</div>
                <div className="font-mono font-bold text-amber-400 text-sm mt-0.5">45 Min Before Dept</div>
                <div className="text-[10px] text-slate-400">Gate Closes: 15m Prior</div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Baggage</div>
                <div className="font-bold text-white text-sm mt-0.5 flex items-center gap-1">
                  <Luggage className="w-3.5 h-3.5 text-blue-400" /> {selectedFlightTicket.baggageAllowance || '2x 23kg Check-in'}
                </div>
                <div className="text-[10px] text-slate-400">+ 1 Carry-on 8kg</div>
              </div>
            </div>

            {/* QR Code & Barcode Stub */}
            <div className="px-6 py-5 bg-white/[0.04] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white p-1.5 rounded-xl shrink-0 flex items-center justify-center shadow-lg">
                  {/* Digital QR Code Pattern */}
                  <div className="w-full h-full border-2 border-slate-900 flex flex-col justify-between p-1">
                    <div className="flex justify-between">
                      <div className="w-3 h-3 bg-slate-900" />
                      <div className="w-3 h-3 bg-slate-900" />
                    </div>
                    <div className="flex justify-center items-center font-mono text-[8px] font-black text-slate-900">APX</div>
                    <div className="flex justify-between">
                      <div className="w-3 h-3 bg-slate-900" />
                      <div className="w-1.5 h-1.5 bg-slate-900 self-end" />
                    </div>
                  </div>
                </div>

                <div className="space-y-0.5 text-left">
                  <div className="text-[10px] text-slate-400 font-mono">E-TICKET NO: {selectedFlightTicket.eTicketNumber}</div>
                  <div className="text-xs font-bold text-slate-200">Electronic Boarding Pass Validated</div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Security Check Clearance Status: Active
                  </div>
                </div>
              </div>

              {/* Barcode Display */}
              <div className="flex flex-col items-center sm:items-end">
                <div className="font-mono text-lg tracking-widest text-slate-300 select-none">
                  ||||| | |||| ||| || ||||| |||| || |
                </div>
                <span className="text-[9px] font-mono text-slate-500 mt-0.5">{selectedFlightTicket.bookingReference}</span>
              </div>
            </div>
          </div>

          {/* Quick Online Check-in Banner */}
          {selectedFlightTicket.checkinStatus !== 'completed' && (
            <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between print:hidden">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white">Online Check-in Open</div>
                <div className="text-[11px] text-slate-300">Confirm your seat ({selectedFlightTicket.seatNumber}) and receive airport fast-track access.</div>
              </div>
              <button
                onClick={handleCheckin}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Check-in Online Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

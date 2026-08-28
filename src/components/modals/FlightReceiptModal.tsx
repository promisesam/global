import React from 'react';
import { useApp } from '../../context/AppContext';
import { FlightBooking } from '../../types';
import { 
  X, 
  Printer, 
  Plane, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  Receipt,
  Download,
  CreditCard
} from 'lucide-react';
import { formatPrice } from '../../lib/currencies';
import { formatDate } from '../../lib/utils';

export const FlightReceiptModal: React.FC = () => {
  const { 
    selectedFlightReceipt, 
    setSelectedFlightReceipt, 
    openTicketModal,
    currency, 
    cmsContent 
  } = useApp();

  if (!selectedFlightReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const baseFare = selectedFlightReceipt.totalAmount / 1.12;
  const taxesAndFees = selectedFlightReceipt.totalAmount - baseFare;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/15 w-full max-w-3xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 text-white">
        {/* Header Actions */}
        <div className="bg-white/[0.04] text-white px-6 py-4 flex items-center justify-between border-b border-white/10 print:hidden">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">Official Passenger Electronic Receipt & Tax Breakdown</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => openTicketModal(selectedFlightReceipt)}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 transition"
            >
              <Plane className="w-3.5 h-3.5 text-blue-400" /> View Boarding Pass
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md transition border border-white/10"
            >
              <Printer className="w-4 h-4" /> Print / Save Receipt
            </button>
            <button
              onClick={() => setSelectedFlightReceipt(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-8 sm:p-10 space-y-8 bg-white text-slate-800 font-sans" id="printable-flight-receipt">
          {/* Top Brand & Metadata */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-black text-slate-900 tracking-tight font-display">APEX</span>
                <span className="text-2xl font-bold text-blue-600 tracking-tight font-display">GLOBAL</span>
                <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-md ml-1 font-mono">AVIATION</span>
              </div>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                ApexGlobal Aviation & Passenger Mobility Division<br />
                {cmsContent?.contactInfo?.headquarters || 'Apex Tower, London, United Kingdom'}<br />
                IATA Agent Code: 91-2-04982 • Tax ID: GB-994-1029-APX
              </p>
            </div>

            <div className="text-right space-y-1">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Electronic Receipt No.</div>
              <div className="text-xl font-mono font-bold text-slate-900">{selectedFlightReceipt.receiptNumber}</div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> PAID & ISSUED
              </div>
            </div>
          </div>

          {/* Passenger, PNR & Flight Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
            <div>
              <div className="font-bold text-slate-400 uppercase tracking-wider mb-2">Passenger Information</div>
              <div className="font-bold text-slate-900 text-sm">{selectedFlightReceipt.customerName}</div>
              <div className="text-slate-600 mt-0.5">Email: {selectedFlightReceipt.customerEmail}</div>
              <div className="text-slate-600 mt-0.5">Passport: {selectedFlightReceipt.passportNumber || 'VERIFIED'}</div>
              <div className="text-slate-600 mt-0.5">Phone: {selectedFlightReceipt.customerPhone}</div>
            </div>

            <div className="sm:text-right space-y-1.5">
              <div>
                <span className="text-slate-500">Booking Reference (PNR):</span>{' '}
                <span className="font-mono font-bold text-slate-900">{selectedFlightReceipt.bookingReference}</span>
              </div>
              <div>
                <span className="text-slate-500">E-Ticket Number:</span>{' '}
                <span className="font-mono font-bold text-blue-600">{selectedFlightReceipt.eTicketNumber}</span>
              </div>
              <div>
                <span className="text-slate-500">Issue Date:</span>{' '}
                <span className="font-semibold text-slate-800">{formatDate(selectedFlightReceipt.createdAt)}</span>
              </div>
              <div>
                <span className="text-slate-500">Payment Method:</span>{' '}
                <span className="font-semibold text-slate-800">{selectedFlightReceipt.paymentMethod || 'Credit Card Direct'}</span>
              </div>
            </div>
          </div>

          {/* Flight Segment Summary */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 font-bold text-xs text-slate-700 flex items-center justify-between">
              <span>Flight Segment Summary</span>
              <span className="font-mono text-blue-600">{selectedFlightReceipt.airline} ({selectedFlightReceipt.flightNumber})</span>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-bold">Departure</div>
                <div className="font-bold text-slate-900 text-sm">{selectedFlightReceipt.originCity} ({selectedFlightReceipt.originAirportCode})</div>
                <div className="text-slate-600">{selectedFlightReceipt.departureTime?.replace('T', ' ').substring(0, 16)}</div>
              </div>

              <div className="text-center sm:border-x sm:border-slate-100 sm:px-4">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Class & Baggage</div>
                <div className="font-semibold text-slate-800">{selectedFlightReceipt.seatClass}</div>
                <div className="text-slate-600">Seat: {selectedFlightReceipt.seatNumber} • {selectedFlightReceipt.baggageAllowance}</div>
              </div>

              <div className="sm:text-right">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Arrival</div>
                <div className="font-bold text-slate-900 text-sm">{selectedFlightReceipt.destinationCity} ({selectedFlightReceipt.destinationAirportCode})</div>
                <div className="text-slate-600">{selectedFlightReceipt.arrivalTime?.replace('T', ' ').substring(0, 16)}</div>
              </div>
            </div>
          </div>

          {/* Price Calculation Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Item & Fare Description</th>
                  <th className="py-3 px-4 text-center">Pax</th>
                  <th className="py-3 px-4 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    Air Passenger Base Fare ({selectedFlightReceipt.airline} - {selectedFlightReceipt.seatClass})
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-600">{selectedFlightReceipt.passengersCount}</td>
                  <td className="py-3.5 px-4 text-right text-slate-600">{formatPrice(baseFare / selectedFlightReceipt.passengersCount, currency)}</td>
                  <td className="py-3.5 px-4 text-right font-semibold text-slate-900">{formatPrice(baseFare, currency)}</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 text-slate-600">
                    Aviation Security, Passenger Service & Fuel Surcharge
                  </td>
                  <td className="py-3 px-4 text-center text-slate-600">{selectedFlightReceipt.passengersCount}</td>
                  <td className="py-3 px-4 text-right text-slate-600">{formatPrice(taxesAndFees / selectedFlightReceipt.passengersCount, currency)}</td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-900">{formatPrice(taxesAndFees, currency)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="flex justify-end pt-2">
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Base Fare:</span>
                <span className="font-semibold">{formatPrice(baseFare, currency)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Taxes & Carrier Fees:</span>
                <span className="font-semibold">{formatPrice(taxesAndFees, currency)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                <span>Total Amount Paid:</span>
                <span className="font-mono text-emerald-600 text-base">{formatPrice(selectedFlightReceipt.totalAmount, currency)}</span>
              </div>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="border-t border-slate-200 pt-6 text-[11px] text-slate-500 leading-relaxed flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-700">Thank you for flying with ApexGlobal Aviation Partners.</p>
              <p>This electronic ticket receipt satisfies all standard corporate travel expense requirements.</p>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <ShieldCheck className="w-4 h-4" /> Tax Verified
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

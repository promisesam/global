import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plane, 
  Building, 
  Calendar, 
  Clock, 
  FileText, 
  Printer, 
  Plus, 
  Search, 
  CheckCircle2, 
  Luggage, 
  QrCode, 
  Receipt, 
  Sparkles, 
  ExternalLink,
  MapPin,
  Star,
  Download
} from 'lucide-react';
import { formatPrice } from '../../lib/currencies';
import { formatDate } from '../../lib/utils';
import { FlightBooking, HotelBooking } from '../../types';

export const CustomerTravel: React.FC = () => {
  const { 
    flightBookings, 
    hotelBookings, 
    currentUser, 
    currency, 
    openFlightBookingModal, 
    openHotelBookingModal,
    openTicketModal,
    openReceiptModal,
    setSelectedInvoice,
    invoices,
    checkinFlight
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'flights' | 'hotels'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter bookings for current user
  const userFlightBookings = flightBookings.filter(b => 
    b.userId === currentUser.id || b.customerEmail === currentUser.email || currentUser.role.includes('admin')
  );

  const userHotelBookings = hotelBookings.filter(b => 
    b.userId === currentUser.id || b.customerEmail === currentUser.email || currentUser.role.includes('admin')
  );

  const filteredFlights = userFlightBookings.filter(f => 
    f.bookingReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.airline.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.originCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.destinationCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.flightNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHotels = userHotelBookings.filter(h => 
    h.bookingReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.hotelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewInvoice = (bookingRef: string) => {
    const match = invoices.find(inv => inv.items.some(it => it.description.includes(bookingRef)) || inv.relatedEntityId === bookingRef);
    if (match) {
      setSelectedInvoice(match);
    } else if (invoices.length > 0) {
      setSelectedInvoice(invoices[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Plane className="w-6 h-6 text-blue-400" />
            Flight & Hotel Bookings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your airline E-Tickets, tax receipts, boarding passes, and hotel invoices
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openHotelBookingModal()}
            className="flex items-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 px-4 py-2.5 rounded-xl border border-emerald-500/30 font-bold text-xs shadow-lg transition"
          >
            <Building className="w-4 h-4" /> Book Hotel
          </button>
          <button
            onClick={() => openFlightBookingModal()}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-500/25 border border-white/10 transition"
          >
            <Plus className="w-4 h-4" /> Book Flight & Get Ticket
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">Flight Trips</div>
            <div className="text-2xl font-black text-white mt-1">{userFlightBookings.length}</div>
            <div className="text-[11px] text-blue-400 mt-0.5">Tickets & Tax Receipts Ready</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Plane className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">Hotel Stays</div>
            <div className="text-2xl font-black text-white mt-1">{userHotelBookings.length}</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">Invoices & Reservations</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Building className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">Total Travel Spend</div>
            <div className="text-2xl font-black text-white mt-1 font-mono">
              {formatPrice(
                userFlightBookings.reduce((s, f) => s + f.totalAmount, 0) +
                userHotelBookings.reduce((s, h) => s + h.totalAmount, 0),
                currency
              )}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Tax Compliant Receipts</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Receipt className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Bookings ({userFlightBookings.length + userHotelBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('flights')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'flights'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plane className="w-3.5 h-3.5" /> Flights ({userFlightBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('hotels')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'hotels'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5" /> Hotels ({userHotelBookings.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by PNR, City, Airline..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.06] border border-white/15 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Flight Bookings List */}
      {(activeTab === 'all' || activeTab === 'flights') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Plane className="w-4 h-4 text-blue-400" />
              Active Flight Bookings & E-Tickets
            </h2>
            <span className="text-xs text-slate-400">{filteredFlights.length} flights</span>
          </div>

          {filteredFlights.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 text-center space-y-3">
              <Plane className="w-10 h-10 text-slate-500 mx-auto" />
              <div className="text-sm font-bold text-white">No Flight Bookings Found</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Ready to travel? Book an international flight route and receive your instant Boarding E-Ticket and Tax Receipt.
              </p>
              <button
                onClick={() => openFlightBookingModal()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md inline-flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" /> Book First Flight
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFlights.map((flight) => (
                <div
                  key={flight.id}
                  className="p-6 rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-xl hover:border-blue-500/30 transition space-y-4"
                >
                  {/* Flight Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                        ✈
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{flight.airline} ({flight.flightNumber})</div>
                        <div className="text-xs text-slate-400 font-mono">
                          PNR: <span className="text-blue-400 font-bold">{flight.bookingReference}</span> • E-Ticket: {flight.eTicketNumber}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full font-bold uppercase border border-emerald-500/30">
                        {flight.paymentStatus.toUpperCase()}
                      </span>
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-full font-bold uppercase border border-blue-500/30">
                        {flight.seatClass}
                      </span>
                    </div>
                  </div>

                  {/* Route & Timing Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <div>
                      <div className="text-2xl font-black font-mono text-white">{flight.originAirportCode}</div>
                      <div className="text-xs font-semibold text-slate-200">{flight.originCity}</div>
                      <div className="text-[11px] text-blue-400 font-mono mt-0.5">{flight.departureTime?.replace('T', ' ').substring(0, 16)}</div>
                      <div className="text-[11px] text-slate-400">Terminal {flight.terminal} • Gate {flight.gate}</div>
                    </div>

                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="text-[10px] font-mono text-slate-400 mb-1">Direct Flight</div>
                      <div className="w-full flex items-center gap-2 text-blue-400">
                        <div className="h-[1px] flex-1 bg-blue-500/40" />
                        <Plane className="w-4 h-4 shrink-0" />
                        <div className="h-[1px] flex-1 bg-blue-500/40" />
                      </div>
                      <div className="text-xs font-mono font-bold text-emerald-400 mt-1">Seat: {flight.seatNumber}</div>
                    </div>

                    <div className="sm:text-right">
                      <div className="text-2xl font-black font-mono text-white">{flight.destinationAirportCode}</div>
                      <div className="text-xs font-semibold text-slate-200">{flight.destinationCity}</div>
                      <div className="text-[11px] text-blue-400 font-mono mt-0.5">{flight.arrivalTime?.replace('T', ' ').substring(0, 16)}</div>
                      <div className="text-[11px] text-slate-400">Passenger: {flight.customerName}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <Luggage className="w-3.5 h-3.5 text-slate-300" />
                      <span>{flight.baggageAllowance}</span>
                      <span>• Total: <strong className="text-emerald-400 font-mono">{formatPrice(flight.totalAmount, currency)}</strong></span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {flight.checkinStatus !== 'completed' && (
                        <button
                          onClick={() => checkinFlight(flight.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-md"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Check-in
                        </button>
                      )}
                      <button
                        onClick={() => openTicketModal(flight)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                      >
                        <QrCode className="w-3.5 h-3.5" /> View E-Ticket / Pass
                      </button>
                      <button
                        onClick={() => openReceiptModal(flight)}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold rounded-xl border border-white/10 transition flex items-center gap-1.5"
                      >
                        <Receipt className="w-3.5 h-3.5 text-emerald-400" /> View Tax Receipt
                      </button>
                      <button
                        onClick={() => handleViewInvoice(flight.bookingReference)}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold rounded-xl border border-white/10 transition flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-400" /> Invoice
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Hotel Bookings List */}
      {(activeTab === 'all' || activeTab === 'hotels') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-400" />
              Confirmed Hotel Reservations & Invoices
            </h2>
            <span className="text-xs text-slate-400">{filteredHotels.length} hotels</span>
          </div>

          {filteredHotels.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 text-center space-y-3">
              <Building className="w-10 h-10 text-slate-500 mx-auto" />
              <div className="text-sm font-bold text-white">No Hotel Bookings Found</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Need accommodation? Browse partner luxury hotels worldwide with guaranteed corporate rates and instant invoices.
              </p>
              <button
                onClick={() => openHotelBookingModal()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md inline-flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" /> Book First Hotel
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="p-6 rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-xl hover:border-emerald-500/30 transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                        <Building className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{hotel.hotelName}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{hotel.address}, {hotel.city}, {hotel.country}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full font-bold uppercase border border-emerald-500/30">
                        {hotel.status.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Ref: <strong className="text-white">{hotel.bookingReference}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Check-in</div>
                      <div className="font-bold text-white text-sm mt-0.5">{formatDate(hotel.checkInDate)}</div>
                      <div className="text-[10px] text-slate-400">From 14:00</div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Check-out</div>
                      <div className="font-bold text-white text-sm mt-0.5">{formatDate(hotel.checkOutDate)}</div>
                      <div className="text-[10px] text-slate-400">Until 12:00</div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Room & Guests</div>
                      <div className="font-semibold text-slate-200 mt-0.5">{hotel.roomType}</div>
                      <div className="text-[10px] text-slate-400">{hotel.guestsCount} Guest(s) • {hotel.nightsCount} Night(s)</div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Total Invoiced</div>
                      <div className="font-mono font-bold text-emerald-400 text-base mt-0.5">
                        {formatPrice(hotel.totalAmount, currency)}
                      </div>
                      <div className="text-[10px] text-slate-400">Rate: {formatPrice(hotel.ratePerNight, currency)}/night</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      Primary Guest: <strong className="text-slate-200">{hotel.customerName}</strong> ({hotel.customerEmail})
                    </div>

                    <button
                      onClick={() => handleViewInvoice(hotel.bookingReference)}
                      className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-bold rounded-xl border border-emerald-500/30 transition flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" /> View Commercial Invoice & Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

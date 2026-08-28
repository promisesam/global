import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plane, 
  Building, 
  Calendar, 
  Search, 
  Star, 
  Luggage, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Receipt, 
  FileText, 
  Globe2, 
  MapPin, 
  Users,
  Compass
} from 'lucide-react';
import { formatPrice } from '../../lib/currencies';
import { FlightOffer, HotelOffer } from '../../types';

export const TravelPage: React.FC = () => {
  const { 
    flightOffers, 
    hotelOffers, 
    flightBookings, 
    currency, 
    openFlightBookingModal, 
    openHotelBookingModal,
    openTicketModal,
    openReceiptModal,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'flights' | 'hotels'>('flights');
  const [originFilter, setOriginFilter] = useState('all');
  const [destinationFilter, setDestinationFilter] = useState('all');
  const [pnrLookup, setPnrLookup] = useState('');
  const [searchedBooking, setSearchedBooking] = useState<any>(null);

  // Filter flight offers
  const filteredFlights = flightOffers.filter(f => {
    if (originFilter !== 'all' && f.originAirportCode !== originFilter) return false;
    if (destinationFilter !== 'all' && f.destinationAirportCode !== destinationFilter) return false;
    return true;
  });

  // Extract unique origins and destinations
  const uniqueOrigins = Array.from(new Set(flightOffers.map(f => f.originAirportCode)));
  const uniqueDestinations = Array.from(new Set(flightOffers.map(f => f.destinationAirportCode)));

  const handlePnrSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pnrLookup.trim()) return;

    const clean = pnrLookup.trim().toUpperCase();
    const match = flightBookings.find(b => 
      b.bookingReference.toUpperCase() === clean || 
      b.eTicketNumber?.toUpperCase() === clean
    );

    if (match) {
      setSearchedBooking(match);
      showToast('success', 'Booking Record Found', `Retrieved E-Ticket for ${match.customerName} on ${match.flightNumber}`);
    } else {
      setSearchedBooking(null);
      showToast('error', 'PNR Not Found', `No flight reservation matches ${clean}. Please verify.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12 relative z-10">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>IATA Global Aviation & Corporate Hospitality Portal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
          Global Flight Bookings, E-Tickets & <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Hotel Invoices</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Book international flights with automated electronic ticket and boarding pass generation. Reserve luxury partner hotels with instant commercial invoice issuance.
        </p>
      </div>

      {/* Main Mode Toggle: Flights vs Hotels vs PNR Lookup */}
      <div className="p-2 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/15 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 p-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('flights')}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition ${
                activeTab === 'flights'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 border border-white/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Plane className="w-4 h-4" /> Book International Flights
            </button>
            <button
              onClick={() => setActiveTab('hotels')}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition ${
                activeTab === 'hotels'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 border border-white/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Building className="w-4 h-4" /> Reserve Hotels & Stays
            </button>
          </div>

          {/* Quick PNR Search Bar */}
          <form onSubmit={handlePnrSearch} className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Enter PNR / E-Ticket (e.g. APX-FL-9201)"
                value={pnrLookup}
                onChange={(e) => setPnrLookup(e.target.value)}
                className="w-full bg-white/[0.06] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 text-xs font-bold rounded-xl transition"
            >
              Look Up
            </button>
          </form>
        </div>

        {/* PNR Found Result Card */}
        {searchedBooking && (
          <div className="mx-4 p-5 rounded-2xl bg-blue-950/40 border border-blue-500/30 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 font-black text-lg">
                ✈
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>{searchedBooking.airline} ({searchedBooking.flightNumber})</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    CONFIRMED
                  </span>
                </div>
                <div className="text-xs text-slate-300">
                  {searchedBooking.originCity} ({searchedBooking.originAirportCode}) → {searchedBooking.destinationCity} ({searchedBooking.destinationAirportCode})
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Passenger: {searchedBooking.customerName} • Seat: {searchedBooking.seatNumber} • E-Ticket: {searchedBooking.eTicketNumber}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openTicketModal(searchedBooking)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg transition"
              >
                View E-Ticket & Pass
              </button>
              <button
                onClick={() => openReceiptModal(searchedBooking)}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold rounded-xl border border-white/10 transition"
              >
                Tax Receipt
              </button>
            </div>
          </div>
        )}

        {/* FLIGHT OFFERS VIEW */}
        {activeTab === 'flights' && (
          <div className="p-4 sm:p-6 space-y-6">
            {/* Filter controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Departure City / Airport</label>
                <select
                  value={originFilter}
                  onChange={(e) => setOriginFilter(e.target.value)}
                  className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all" className="bg-slate-900">All Departure Airports</option>
                  {uniqueOrigins.map(code => (
                    <option key={code} value={code} className="bg-slate-900">{code} Airport</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Destination City / Airport</label>
                <select
                  value={destinationFilter}
                  onChange={(e) => setDestinationFilter(e.target.value)}
                  className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all" className="bg-slate-900">All Destination Airports</option>
                  {uniqueDestinations.map(code => (
                    <option key={code} value={code} className="bg-slate-900">{code} Airport</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => openFlightBookingModal()}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 border border-white/10 flex items-center justify-center gap-1.5 transition"
                >
                  <Sparkles className="w-4 h-4" /> Custom Flight Route & Ticket
                </button>
              </div>
            </div>

            {/* Flight Route Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredFlights.map((flight) => (
                <div
                  key={flight.id}
                  className="p-6 rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/10 hover:border-blue-500/40 transition-all duration-200 shadow-xl space-y-5 flex flex-col justify-between group"
                >
                  <div>
                    {/* Airline Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 font-black text-xs">
                          ✈
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{flight.airline}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{flight.flightNumber} • {flight.aircraft}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase font-mono">From</div>
                        <div className="text-lg font-bold text-emerald-400 font-mono">
                          {formatPrice(flight.basePrice, currency)}
                        </div>
                      </div>
                    </div>

                    {/* Flight Path Graphic */}
                    <div className="py-4 grid grid-cols-3 items-center text-center">
                      <div className="text-left">
                        <div className="text-2xl font-black font-mono text-white">{flight.originAirportCode}</div>
                        <div className="text-xs font-semibold text-slate-300">{flight.originCity}</div>
                        <div className="text-xs text-blue-400 font-mono mt-0.5">{flight.departureTime}</div>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-slate-400 font-mono mb-1">{flight.duration}</span>
                        <div className="w-full flex items-center gap-1 text-blue-400">
                          <div className="h-[2px] flex-1 bg-blue-500/40" />
                          <Plane className="w-4 h-4 shrink-0" />
                          <div className="h-[2px] flex-1 bg-blue-500/40" />
                        </div>
                        <span className="text-[10px] text-emerald-400 mt-1">Direct Flight</span>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-black font-mono text-white">{flight.destinationAirportCode}</div>
                        <div className="text-xs font-semibold text-slate-300">{flight.destinationCity}</div>
                        <div className="text-xs text-blue-400 font-mono mt-0.5">{flight.arrivalTime}</div>
                      </div>
                    </div>

                    {/* Feature badges */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10 text-[11px] text-slate-300">
                      <span className="flex items-center gap-1 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/10">
                        <Luggage className="w-3 h-3 text-slate-400" /> {flight.baggageAllowance}
                      </span>
                      <span className="flex items-center gap-1 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/10">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" /> Instant E-Ticket
                      </span>
                      <span className="flex items-center gap-1 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/10">
                        <Receipt className="w-3 h-3 text-blue-400" /> Official Tax Receipt
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => openFlightBookingModal(flight)}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 border border-white/10 flex items-center justify-center gap-2 transition"
                  >
                    <span>Book Flight & Issue E-Ticket</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HOTEL OFFERS VIEW */}
        {activeTab === 'hotels' && (
          <div className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hotelOffers.map((hotel) => (
                <div
                  key={hotel.id}
                  className="p-6 rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/10 hover:border-emerald-500/40 transition-all duration-200 shadow-xl space-y-5 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-base">{hotel.hotelName}</h3>
                          <div className="flex text-amber-400">
                            {Array.from({ length: hotel.stars }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400" />
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>{hotel.address}, {hotel.city}, {hotel.country}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase font-mono">Per Night</div>
                        <div className="text-lg font-bold text-emerald-400 font-mono">
                          {formatPrice(hotel.pricePerNight, currency)}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                      <div className="text-[11px] font-bold uppercase text-slate-400 font-mono">Available Room Classes:</div>
                      <div className="flex flex-wrap gap-2">
                        {hotel.roomTypes.map((rt, i) => (
                          <span key={i} className="text-xs bg-white/[0.06] text-slate-200 px-2.5 py-1 rounded-lg border border-white/10">
                            {rt}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
                      {hotel.amenities.map((a, i) => (
                        <span key={i} className="bg-emerald-500/10 text-emerald-300 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => openHotelBookingModal(hotel)}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/25 border border-white/10 flex items-center justify-center gap-2 transition"
                  >
                    <span>Reserve Hotel & Generate Commercial Invoice</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trust & Guarantee Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 backdrop-blur-md text-center">
          <ShieldCheck className="w-6 h-6 text-blue-400 mx-auto" />
          <div className="font-bold text-white text-xs">Official IATA Boarding Pass</div>
          <p className="text-[11px] text-slate-400 leading-relaxed">Scannable QR codes for airport fast-track security</p>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 backdrop-blur-md text-center">
          <Receipt className="w-6 h-6 text-emerald-400 mx-auto" />
          <div className="font-bold text-white text-xs">Electronic Tax Receipts</div>
          <p className="text-[11px] text-slate-400 leading-relaxed">Itemized fuel, baggage, and VAT breakdown for corporate expense</p>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 backdrop-blur-md text-center">
          <Building className="w-6 h-6 text-purple-400 mx-auto" />
          <div className="font-bold text-white text-xs">Direct Hotel Invoices</div>
          <p className="text-[11px] text-slate-400 leading-relaxed">Standardized commercial invoices for hospitality bookings</p>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 backdrop-blur-md text-center">
          <Clock className="w-6 h-6 text-amber-400 mx-auto" />
          <div className="font-bold text-white text-xs">24/7 Flight Support</div>
          <p className="text-[11px] text-slate-400 leading-relaxed">Instant re-routing and concierge assistance worldwide</p>
        </div>
      </div>
    </div>
  );
};

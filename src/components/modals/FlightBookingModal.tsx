import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FlightOffer } from '../../types';
import { 
  X, 
  Plane, 
  Calendar, 
  User as UserIcon, 
  Mail, 
  Phone, 
  CreditCard, 
  ShieldCheck, 
  Clock, 
  Luggage, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { formatPrice } from '../../lib/currencies';

export const FlightBookingModal: React.FC = () => {
  const { 
    flightBookingModalOpen, 
    setFlightBookingModalOpen, 
    selectedFlightOfferForBook, 
    setSelectedFlightOfferForBook,
    flightOffers, 
    bookFlight, 
    currentUser, 
    currency,
    openTicketModal
  } = useApp();

  const [selectedOfferId, setSelectedOfferId] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [seatClass, setSeatClass] = useState<'Economy' | 'Premium Economy' | 'Business' | 'First Class'>('Economy');
  const [passengersCount, setPassengersCount] = useState<number>(1);
  const [mealPreference, setMealPreference] = useState('Standard / International');
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wire' | 'corporate_account'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedFlightOfferForBook) {
      setSelectedOfferId(selectedFlightOfferForBook.id);
    } else if (flightOffers.length > 0 && !selectedOfferId) {
      setSelectedOfferId(flightOffers[0].id);
    }

    if (currentUser) {
      setCustomerName(currentUser.name || '');
      setCustomerEmail(currentUser.email || '');
      setCustomerPhone(currentUser.phone || '+1 (555) 234-8901');
    }

    // Default travel date to tomorrow + 3 days
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 5);
    setTravelDate(defaultDate.toISOString().split('T')[0]);
  }, [selectedFlightOfferForBook, flightOffers, currentUser, flightBookingModalOpen]);

  if (!flightBookingModalOpen) return null;

  const currentOffer = flightOffers.find(o => o.id === selectedOfferId) || flightOffers[0];

  const classMultiplier = 
    seatClass === 'First Class' ? 2.8 : 
    seatClass === 'Business' ? 2.0 : 
    seatClass === 'Premium Economy' ? 1.4 : 1.0;

  const basePricePerPerson = currentOffer ? currentOffer.basePrice * classMultiplier : 450;
  const taxesPerPerson = basePricePerPerson * 0.12;
  const totalPrice = (basePricePerPerson + taxesPerPerson) * passengersCount;

  const handleClose = () => {
    setFlightBookingModalOpen(false);
    setSelectedFlightOfferForBook(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOffer) return;

    setIsSubmitting(true);
    try {
      const newBooking = await bookFlight({
        flightOfferId: currentOffer.id,
        flightNumber: currentOffer.flightNumber,
        airline: currentOffer.airline,
        originCity: currentOffer.originCity,
        originAirportCode: currentOffer.originAirportCode,
        destinationCity: currentOffer.destinationCity,
        destinationAirportCode: currentOffer.destinationAirportCode,
        departureTime: `${travelDate}T${currentOffer.departureTime}:00Z`,
        arrivalTime: `${travelDate}T${currentOffer.arrivalTime}:00Z`,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        passportNumber: passportNumber.trim().toUpperCase() || 'P-98421034',
        seatClass,
        passengersCount,
        totalAmount: totalPrice,
        currency: currentOffer.currency || 'USD',
        mealPreference,
        specialRequests,
        paymentStatus: 'paid',
        paymentMethod: paymentMethod === 'card' ? 'Visa / Mastercard Direct' : paymentMethod === 'wire' ? 'SWIFT Wire Transfer' : 'Apex Corporate Account',
      });

      handleClose();
      // Automatically open the generated E-Ticket for instant preview and print
      openTicketModal(newBooking);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/15 w-full max-w-3xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 text-white">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 px-6 py-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Book International Flight & Issue E-Ticket
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30 uppercase font-mono">
                  Instant PNR
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Guaranteed seat reservation with automated receipt & boarding ticket issuance
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Flight Corridor Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Select Flight Route & Flight Number
            </label>
            <select
              value={selectedOfferId}
              onChange={(e) => setSelectedOfferId(e.target.value)}
              className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              {flightOffers.map((offer) => (
                <option key={offer.id} value={offer.id} className="bg-slate-900 text-white">
                  {offer.airline} ({offer.flightNumber}) • {offer.originCity} ({offer.originAirportCode}) → {offer.destinationCity} ({offer.destinationAirportCode}) • {offer.departureTime} - {offer.arrivalTime} ({formatPrice(offer.basePrice, currency)})
                </option>
              ))}
            </select>
          </div>

          {/* Selected Route Preview Card */}
          {currentOffer && (
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-xl font-black font-mono text-white">{currentOffer.originAirportCode}</div>
                  <div className="text-[11px] text-slate-400">{currentOffer.originCity}</div>
                  <div className="text-xs font-semibold text-blue-400 mt-0.5">{currentOffer.departureTime}</div>
                </div>

                <div className="flex flex-col items-center px-4">
                  <div className="text-[10px] text-slate-400 font-mono mb-1">{currentOffer.duration} • Direct</div>
                  <div className="flex items-center gap-1.5 text-blue-400">
                    <div className="w-8 h-[2px] bg-blue-500/40 rounded-full" />
                    <Plane className="w-4 h-4" />
                    <div className="w-8 h-[2px] bg-blue-500/40 rounded-full" />
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">{currentOffer.aircraft}</div>
                </div>

                <div className="text-center">
                  <div className="text-xl font-black font-mono text-white">{currentOffer.destinationAirportCode}</div>
                  <div className="text-[11px] text-slate-400">{currentOffer.destinationCity}</div>
                  <div className="text-xs font-semibold text-blue-400 mt-0.5">{currentOffer.arrivalTime}</div>
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-white/10 sm:pl-6">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Base Fare</div>
                <div className="text-lg font-bold text-emerald-400">{formatPrice(basePricePerPerson, currency)} <span className="text-xs font-normal text-slate-400">/ pax</span></div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1 justify-end mt-0.5">
                  <Luggage className="w-3 h-3 text-slate-300" /> {currentOffer.baggageAllowance}
                </div>
              </div>
            </div>
          )}

          {/* Passenger & Schedule Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Travel Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  required
                  className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Cabin Class
              </label>
              <select
                value={seatClass}
                onChange={(e) => setSeatClass(e.target.value as any)}
                className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Economy" className="bg-slate-900">Economy Class</option>
                <option value="Premium Economy" className="bg-slate-900">Premium Economy (+40%)</option>
                <option value="Business" className="bg-slate-900">Business Class (+100%)</option>
                <option value="First Class" className="bg-slate-900">First Class (+180%)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Passenger Full Legal Name (as on Passport)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Alexander Wright"
                  required
                  className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Passport Number
              </label>
              <input
                type="text"
                value={passportNumber}
                onChange={(e) => setPassportNumber(e.target.value)}
                placeholder="e.g. P-88294104"
                required
                className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Contact Email (for E-Ticket delivery)
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                  className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Contact Phone / WhatsApp
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                  className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Number of Passengers
              </label>
              <input
                type="number"
                min="1"
                max="9"
                value={passengersCount}
                onChange={(e) => setPassengersCount(parseInt(e.target.value) || 1)}
                className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Meal Preference
              </label>
              <select
                value={mealPreference}
                onChange={(e) => setMealPreference(e.target.value)}
                className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Standard / International" className="bg-slate-900">Standard / International Menu</option>
                <option value="Vegetarian Asian" className="bg-slate-900">Vegetarian Asian / Jain</option>
                <option value="Halal Certified" className="bg-slate-900">Halal Certified Meal</option>
                <option value="Gluten-Free" className="bg-slate-900">Gluten-Free Special Meal</option>
                <option value="Kosher" className="bg-slate-900">Kosher Certified Meal</option>
              </select>
            </div>
          </div>

          {/* Payment & Invoice Breakdown */}
          <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/20 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Fare ({passengersCount}x Passenger - {seatClass}):</span>
              <span>{formatPrice(basePricePerPerson * passengersCount, currency)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Aviation Security & Fuel Surcharges (12%):</span>
              <span>{formatPrice(taxesPerPerson * passengersCount, currency)}</span>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between font-bold text-sm text-white">
              <span>Total Payment & Invoice Amount:</span>
              <span className="text-emerald-400 font-mono text-base">{formatPrice(totalPrice, currency)}</span>
            </div>

            <div className="pt-2 flex items-center gap-4 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="text-blue-500"
                />
                Credit / Debit Card
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'wire'}
                  onChange={() => setPaymentMethod('wire')}
                  className="text-blue-500"
                />
                Bank Wire Transfer
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'corporate_account'}
                  onChange={() => setPaymentMethod('corporate_account')}
                  className="text-blue-500"
                />
                Corporate Billing
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>IATA Approved E-Ticket with Instant QR Code</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 border border-white/10 flex items-center gap-2 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>Issuing E-Ticket & Receipt...</>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Confirm & Issue E-Ticket ({formatPrice(totalPrice, currency)})
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

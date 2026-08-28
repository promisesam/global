import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { HotelOffer } from '../../types';
import { 
  X, 
  Building, 
  Calendar, 
  User as UserIcon, 
  Mail, 
  Phone, 
  Star, 
  ShieldCheck, 
  Coffee, 
  Wifi, 
  Sparkles,
  MapPin,
  BedDouble
} from 'lucide-react';
import { formatPrice } from '../../lib/currencies';

export const HotelBookingModal: React.FC = () => {
  const { 
    hotelBookingModalOpen, 
    setHotelBookingModalOpen, 
    selectedHotelOfferForBook, 
    setSelectedHotelOfferForBook,
    hotelOffers, 
    bookHotel, 
    currentUser, 
    currency,
    setSelectedInvoice
  } = useApp();

  const [selectedOfferId, setSelectedOfferId] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [roomType, setRoomType] = useState('Executive King Suite');
  const [guestsCount, setGuestsCount] = useState<number>(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wire' | 'corporate_account'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedHotelOfferForBook) {
      setSelectedOfferId(selectedHotelOfferForBook.id);
      if (selectedHotelOfferForBook.roomTypes.length > 0) {
        setRoomType(selectedHotelOfferForBook.roomTypes[0]);
      }
    } else if (hotelOffers.length > 0 && !selectedOfferId) {
      setSelectedOfferId(hotelOffers[0].id);
    }

    if (currentUser) {
      setCustomerName(currentUser.name || '');
      setCustomerEmail(currentUser.email || '');
      setCustomerPhone(currentUser.phone || '+1 (555) 234-8901');
    }

    const today = new Date();
    const inDate = new Date(today);
    inDate.setDate(today.getDate() + 5);
    const outDate = new Date(inDate);
    outDate.setDate(inDate.getDate() + 3);

    setCheckInDate(inDate.toISOString().split('T')[0]);
    setCheckOutDate(outDate.toISOString().split('T')[0]);
  }, [selectedHotelOfferForBook, hotelOffers, currentUser, hotelBookingModalOpen]);

  if (!hotelBookingModalOpen) return null;

  const currentOffer = hotelOffers.find(o => o.id === selectedOfferId) || hotelOffers[0];

  // Calculate nights
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 3;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diff = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
    return diff || 1;
  };

  const nightsCount = calculateNights();
  const roomMultiplier = 
    roomType.includes('Presidential') || roomType.includes('Royal') ? 2.2 : 
    roomType.includes('Executive') || roomType.includes('Suite') ? 1.5 : 1.0;

  const ratePerNight = currentOffer ? currentOffer.pricePerNight * roomMultiplier : 220;
  const taxes = ratePerNight * nightsCount * 0.10;
  const totalAmount = (ratePerNight * nightsCount) + taxes;

  const handleClose = () => {
    setHotelBookingModalOpen(false);
    setSelectedHotelOfferForBook(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOffer) return;

    setIsSubmitting(true);
    try {
      const newBooking = await bookHotel({
        hotelOfferId: currentOffer.id,
        hotelName: currentOffer.hotelName,
        city: currentOffer.city,
        country: currentOffer.country,
        address: currentOffer.address,
        checkInDate,
        checkOutDate,
        nightsCount,
        roomType,
        guestsCount,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        ratePerNight,
        totalAmount,
        currency: currentOffer.currency || 'USD',
        specialRequests,
        paymentStatus: 'paid',
        paymentMethod: paymentMethod === 'card' ? 'Credit Card Online' : paymentMethod === 'wire' ? 'Direct Bank Transfer' : 'Corporate Account',
      });

      handleClose();
      // If invoice was generated, can open invoice preview
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
        <div className="bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-blue-600/20 px-6 py-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Reserve Luxury Hotel & Generate Tax Invoice
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase font-mono">
                  Instant Confirmation
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Direct booking with verified corporate partner accommodations worldwide
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
          {/* Hotel Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Select Partner Hotel & Destination
            </label>
            <select
              value={selectedOfferId}
              onChange={(e) => {
                setSelectedOfferId(e.target.value);
                const match = hotelOffers.find(h => h.id === e.target.value);
                if (match && match.roomTypes.length > 0) {
                  setRoomType(match.roomTypes[0]);
                }
              }}
              className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            >
              {hotelOffers.map((hotel) => (
                <option key={hotel.id} value={hotel.id} className="bg-slate-900 text-white">
                  {hotel.hotelName} ({hotel.stars}★) • {hotel.city}, {hotel.country} • from {formatPrice(hotel.pricePerNight, currency)}/night
                </option>
              ))}
            </select>
          </div>

          {/* Selected Hotel Preview Card */}
          {currentOffer && (
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm">{currentOffer.hotelName}</h3>
                  <div className="flex text-amber-400">
                    {Array.from({ length: currentOffer.stars }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{currentOffer.address}, {currentOffer.city}, {currentOffer.country}</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {currentOffer.amenities.slice(0, 4).map((a, i) => (
                    <span key={i} className="text-[10px] bg-white/[0.06] text-slate-300 px-2 py-0.5 rounded-md border border-white/10">
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-white/10 sm:pl-6 shrink-0">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Nightly Rate</div>
                <div className="text-lg font-bold text-emerald-400">{formatPrice(ratePerNight, currency)} <span className="text-xs font-normal text-slate-400">/ night</span></div>
                <div className="text-[10px] text-slate-400">Rating: {currentOffer.rating}/5.0</div>
              </div>
            </div>
          )}

          {/* Booking Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Check-in Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  required
                  className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Check-out Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  required
                  className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Room Type
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {currentOffer?.roomTypes.map((rt, idx) => (
                  <option key={idx} value={rt} className="bg-slate-900">{rt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Guests Count
              </label>
              <input
                type="number"
                min="1"
                max="6"
                value={guestsCount}
                onChange={(e) => setGuestsCount(parseInt(e.target.value) || 1)}
                className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Guest Primary Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Confirmation Email (for Invoice)
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                  className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                  className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Special Requests
              </label>
              <input
                type="text"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g. High floor, quiet room, late check-in"
                className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Pricing Calculation & Invoice Breakdown */}
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Accommodation ({nightsCount} nights @ {formatPrice(ratePerNight, currency)}):</span>
              <span>{formatPrice(ratePerNight * nightsCount, currency)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>City Municipality Tax & Hospitality VAT (10%):</span>
              <span>{formatPrice(taxes, currency)}</span>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between font-bold text-sm text-white">
              <span>Total Invoice Amount:</span>
              <span className="text-emerald-400 font-mono text-base">{formatPrice(totalAmount, currency)}</span>
            </div>

            <div className="pt-2 flex items-center gap-4 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                <input
                  type="radio"
                  name="hotel_payment"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="text-emerald-500"
                />
                Credit / Debit Card
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                <input
                  type="radio"
                  name="hotel_payment"
                  checked={paymentMethod === 'wire'}
                  onChange={() => setPaymentMethod('wire')}
                  className="text-emerald-500"
                />
                Bank Wire Transfer
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                <input
                  type="radio"
                  name="hotel_payment"
                  checked={paymentMethod === 'corporate_account'}
                  onChange={() => setPaymentMethod('corporate_account')}
                  className="text-emerald-500"
                />
                Apex Corporate Account
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official Tax Invoice Generated Automatically Upon Booking</span>
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
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 border border-white/10 flex items-center gap-2 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>Generating Invoice & Booking...</>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Confirm Reservation & Issue Invoice
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

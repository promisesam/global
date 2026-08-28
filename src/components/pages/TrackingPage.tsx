import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShipmentMap } from '../maps/ShipmentMap';
import { 
  Search, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Plane, 
  ShieldCheck, 
  Printer, 
  FileText, 
  AlertCircle,
  Plus,
  RefreshCw,
  Share2
} from 'lucide-react';
import { formatStatus, formatDate, getStatusBadgeColor } from '../../lib/utils';
import { formatPrice } from '../../lib/currencies';

export const TrackingPage: React.FC = () => {
  const { 
    searchedShipment, 
    trackShipmentByNumber, 
    setSelectedLabelShipment, 
    setSelectedInvoice, 
    invoices, 
    currentUser, 
    addTrackingEvent,
    currency,
    showToast
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [newEventModal, setNewEventModal] = useState(false);
  const [newEventStatus, setNewEventStatus] = useState('In Transit Hub');
  const [newEventLocation, setNewEventLocation] = useState('Manhattan Logistics Sorting Hub, NY');
  const [newEventDesc, setNewEventDesc] = useState('Consignment sorted and staged for final regional carrier van.');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setIsSearching(true);
    await trackShipmentByNumber(inputVal);
    setIsSearching(false);
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchedShipment) return;
    await addTrackingEvent(searchedShipment.id, {
      status: newEventStatus,
      location: newEventLocation,
      description: newEventDesc,
    });
    setNewEventModal(false);
  };

  const handleShareTracking = () => {
    if (navigator.clipboard && searchedShipment) {
      navigator.clipboard.writeText(window.location.origin + '?track=' + searchedShipment.trackingNumber);
      showToast('info', 'Link Copied', 'Direct tracking URL copied to your clipboard.');
    }
  };

  const relatedInvoice = searchedShipment ? invoices.find(inv => inv.trackingNumber === searchedShipment.trackingNumber || inv.relatedEntityId === searchedShipment.id) : null;

  const milestoneSteps = [
    { label: 'Booking Confirmed', key: 'booked' },
    { label: 'Origin Dispatch', key: 'picked_up' },
    { label: 'Air Transit', key: 'in_transit' },
    { label: 'Customs Cleared', key: 'customs_cleared' },
    { label: 'Out for Delivery', key: 'out_for_delivery' },
    { label: 'Delivered', key: 'delivered' },
  ];

  const getStepActiveIndex = (status: string) => {
    switch (status) {
      case 'created': return 0;
      case 'picked_up': return 1;
      case 'in_transit': return 2;
      case 'customs_cleared': return 3;
      case 'out_for_delivery': return 4;
      case 'delivered': return 5;
      default: return 2;
    }
  };

  const activeIndex = searchedShipment ? getStepActiveIndex(searchedShipment.status) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Tracking Search Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-6">
        <div className="max-w-2xl space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-display">
            Live Global Cargo & Waybill Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time multi-modal satellite GPS tracking, milestone timestamps, customs clearance certification, and digital waybill records.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-3xl">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter Tracking / Waybill Number (e.g. APX-98241, APX-41029)"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full bg-slate-800 text-white placeholder-slate-400 font-mono text-sm px-4 py-3.5 pl-10 rounded-2xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-8 py-3.5 rounded-2xl transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Track Waybill</span>
          </button>
        </form>
      </div>

      {/* Main Tracking Details */}
      {searchedShipment ? (
        <div className="space-y-8">
          {/* Top Shipment Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Waybill #</span>
                  <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">{searchedShipment.trackingNumber}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusBadgeColor(searchedShipment.status)}`}>
                    {formatStatus(searchedShipment.status)}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                  <span>Carrier: <strong className="text-slate-700">{searchedShipment.carrier}</strong></span>
                  <span>•</span>
                  <span>Service: <strong className="text-blue-600">{searchedShipment.serviceSpeed}</strong></span>
                  <span>•</span>
                  <span>Category: <strong className="text-slate-700">{searchedShipment.shipmentType.toUpperCase()}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedLabelShipment(searchedShipment)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition"
                >
                  <Printer className="w-3.5 h-3.5" /> 4x6 Waybill Label
                </button>
                {relatedInvoice && (
                  <button
                    onClick={() => setSelectedInvoice(relatedInvoice)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition"
                  >
                    <FileText className="w-3.5 h-3.5" /> View Invoice
                  </button>
                )}
                <button
                  onClick={handleShareTracking}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                  title="Copy Tracking Link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                {currentUser.role !== 'customer' && (
                  <button
                    onClick={() => setNewEventModal(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Telemetry Checkpoint
                  </button>
                )}
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="py-4">
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {milestoneSteps.map((step, idx) => {
                  const isDone = idx <= activeIndex;
                  const isCurrent = idx === activeIndex;
                  return (
                    <div key={step.key} className="flex flex-col items-center text-center space-y-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isDone ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}>
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span className={`text-[11px] font-medium leading-tight ${isCurrent ? 'text-blue-600 font-bold' : isDone ? 'text-slate-800' : 'text-slate-400'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Origin & Destination Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Origin Dispatch Point</div>
                <div className="font-bold text-slate-900 text-sm">{searchedShipment.origin}</div>
                <div className="text-slate-600">{searchedShipment.sender.name} ({searchedShipment.sender.city})</div>
                <div className="text-slate-500 font-mono text-[11px]">{searchedShipment.sender.phone}</div>
              </div>

              <div className="space-y-1 md:border-x md:border-slate-200 md:px-6">
                <div className="text-[10px] uppercase font-bold text-slate-400">Current Facility & Coordinates</div>
                <div className="font-bold text-blue-600 text-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {searchedShipment.currentLocation}
                </div>
                <div className="text-slate-600">Est. Delivery: <strong>{formatDate(searchedShipment.estimatedDelivery)}</strong></div>
                <div className="text-slate-500">Weight: <strong>{searchedShipment.packageWeight} KG</strong> ({searchedShipment.packageCount} PKG)</div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Destination Delivery Address</div>
                <div className="font-bold text-slate-900 text-sm">{searchedShipment.destination}</div>
                <div className="text-slate-600">{searchedShipment.recipient.name} ({searchedShipment.recipient.city})</div>
                <div className="text-slate-500 font-mono text-[11px]">{searchedShipment.recipient.phone}</div>
              </div>
            </div>
          </div>

          {/* Interactive Leaflet Route Map */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" /> Real-Time Geographic Route & Checkpoint Radar
              </h2>
              <span className="text-xs text-slate-500">Click pins for detailed hub telemetry</span>
            </div>
            <ShipmentMap shipment={searchedShipment} height="420px" />
          </div>

          {/* Checkpoint Event Log Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" /> Chronological Telemetry & Checkpoint Log
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {searchedShipment.events.map((evt, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-white" />
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="font-bold text-slate-900 text-sm">{evt.status}</span>
                      <span className="text-slate-500 font-mono text-[11px]">{formatDate(evt.timestamp)}</span>
                    </div>
                    <div className="font-medium text-blue-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {evt.location}
                    </div>
                    <p className="text-slate-600 pt-1 leading-relaxed">{evt.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs space-y-2">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <div className="font-semibold text-slate-800 text-sm">No Waybill Selected</div>
          <p>Please enter a valid tracking number above to inspect cargo telemetry.</p>
        </div>
      )}

      {/* Admin Add Checkpoint Modal */}
      {newEventModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 text-xs animate-in zoom-in-95">
            <h3 className="font-bold text-sm text-slate-900">Publish New Telemetry Event</h3>
            <form onSubmit={handleAddEvent} className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Status Checkpoint</label>
                <select
                  value={newEventStatus}
                  onChange={(e) => setNewEventStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                >
                  <option>In Transit Hub</option>
                  <option>Customs Cleared</option>
                  <option>Out for Delivery</option>
                  <option>Delivered & Signed</option>
                  <option>Flight Arrived at Transit Hub</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Facility / Location Name</label>
                <input
                  type="text"
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Detailed Event Description</label>
                <textarea
                  rows={3}
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewEventModal(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                >
                  Publish Checkpoint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

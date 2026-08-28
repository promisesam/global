import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shipment } from '../../types';
import { 
  Package, 
  Search, 
  Plus, 
  Printer, 
  FileText, 
  MapPin, 
  Clock, 
  ArrowRight, 
  X, 
  CheckCircle2,
  Filter
} from 'lucide-react';
import { formatStatus, formatDate, getStatusBadgeColor } from '../../lib/utils';
import { formatPrice } from '../../lib/currencies';

export const CustomerShipments: React.FC = () => {
  const { 
    shipments, 
    currentUser, 
    createShipment, 
    trackShipmentByNumber, 
    setCurrentView, 
    setSelectedLabelShipment, 
    setSelectedInvoice, 
    invoices,
    currency
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New Shipment Form State
  const [origin, setOrigin] = useState('Frankfurt Air Cargo Terminal, Germany');
  const [destination, setDestination] = useState('Dubai Logistics City, UAE');
  const [shipmentType, setShipmentType] = useState<'document' | 'parcel' | 'freight' | 'cold_chain'>('parcel');
  const [serviceSpeed, setServiceSpeed] = useState<'Standard (3-5 Days)' | 'Express (1-2 Days)' | 'Priority Next-Flight'>('Express (1-2 Days)');
  const [packageWeight, setPackageWeight] = useState(4.5);
  const [packageCount, setPackageCount] = useState(1);
  const [recipientName, setRecipientName] = useState('Hamad Al-Maktoum');
  const [recipientPhone, setRecipientPhone] = useState('+971 50 889 2140');
  const [recipientAddress, setRecipientAddress] = useState('Villa 14, Jumeirah Islands, Dubai, UAE');
  const [recipientCity, setRecipientCity] = useState('Dubai');
  const [recipientCountry, setRecipientCountry] = useState('United Arab Emirates');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userShipments = shipments.filter(s => s.userId === currentUser.id || s.customerEmail === currentUser.email);

  const filteredShipments = userShipments.filter(s => {
    const matchesSearch = s.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.recipient.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const baseCost = serviceSpeed.includes('Priority') ? 120 : serviceSpeed.includes('Express') ? 75 : 45;
      const totalCost = baseCost + (packageWeight * 12);

      await createShipment({
        origin,
        destination,
        currentLocation: origin,
        currentCoordinates: { lat: 50.0379, lng: 8.5622 },
        shipmentType,
        serviceSpeed,
        packageWeight,
        packageCount,
        sender: {
          name: currentUser.name,
          address: '42 Berkeley Square, Mayfair',
          city: 'London',
          country: 'United Kingdom',
          phone: currentUser.phone,
        },
        recipient: {
          name: recipientName,
          address: recipientAddress,
          city: recipientCity,
          country: recipientCountry,
          phone: recipientPhone,
        },
        totalCost,
        currency: 'USD',
        isInsured: true,
        estimatedDelivery: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
      });

      setIsSubmitting(false);
      setCreateModalOpen(false);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">My Consignments & Cargo</h1>
          <p className="text-xs text-slate-500">Manage waybills, track real-time air movements, and download shipping labels.</p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Book New Shipment
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 text-xs">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by Waybill #, Recipient or City..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="in_transit">In Transit</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="customs_cleared">Customs Cleared</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Shipments Table / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Waybill Number</th>
                <th className="py-3.5 px-4">Origin / Destination</th>
                <th className="py-3.5 px-4">Recipient</th>
                <th className="py-3.5 px-4">Speed / Weight</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No consignments found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredShipments.map((s) => {
                  const relatedInv = invoices.find(i => i.trackingNumber === s.trackingNumber || i.relatedEntityId === s.id);
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                        <button
                          onClick={async () => {
                            await trackShipmentByNumber(s.trackingNumber);
                            setCurrentView('tracking');
                          }}
                          className="hover:underline text-left flex items-center gap-1"
                        >
                          {s.trackingNumber}
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{s.destination}</div>
                        <div className="text-[11px] text-slate-500">From: {s.origin}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900">{s.recipient.name}</div>
                        <div className="text-[11px] text-slate-500">{s.recipient.city}, {s.recipient.country}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900">{s.packageWeight} KG</div>
                        <div className="text-[11px] text-slate-500">{s.serviceSpeed}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getStatusBadgeColor(s.status)}`}>
                          {formatStatus(s.status)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1">
                        <button
                          onClick={() => setSelectedLabelShipment(s)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition inline-flex"
                          title="Print 4x6 Shipping Waybill"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        {relatedInv && (
                          <button
                            onClick={() => setSelectedInvoice(relatedInv)}
                            className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition inline-flex"
                            title="View Invoice"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={async () => {
                            await trackShipmentByNumber(s.trackingNumber);
                            setCurrentView('tracking');
                          }}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-blue-600 text-white font-bold text-[11px] rounded-lg transition inline-flex items-center gap-1"
                        >
                          <span>Live Map</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Shipment Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 my-8">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-sm">Book New Air Express Consignment</span>
              </div>
              <button onClick={() => setCreateModalOpen(false)} className="p-1 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Origin Air Hub</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Destination Hub / City</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Package Weight (KG)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={packageWeight}
                    onChange={(e) => setPackageWeight(parseFloat(e.target.value) || 1)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Service Speed</label>
                  <select
                    value={serviceSpeed}
                    onChange={(e) => setServiceSpeed(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  >
                    <option>Priority Next-Flight</option>
                    <option>Express (1-2 Days)</option>
                    <option>Standard (3-5 Days)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Package Type</label>
                  <select
                    value={shipmentType}
                    onChange={(e) => setShipmentType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="parcel">Parcel / Package</option>
                    <option value="document">Legal Documents</option>
                    <option value="freight">Heavy Cargo Freight</option>
                    <option value="cold_chain">Cold Chain Pharma</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-3">
                <div className="font-bold text-slate-800">Recipient Particulars</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">Recipient Name</label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Recipient Phone</label>
                    <input
                      type="tel"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Delivery Street Address</label>
                  <input
                    type="text"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {isSubmitting ? 'Issuing Waybill...' : 'Generate Waybill & Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

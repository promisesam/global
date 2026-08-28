import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shipment, ShipmentStatus } from '../../types';
import { 
  Package, 
  Search, 
  Plus, 
  Printer, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Edit3, 
  CheckCircle2, 
  FileText, 
  AlertCircle,
  X
} from 'lucide-react';
import { formatStatus, formatDate, getStatusBadgeColor } from '../../lib/utils';

export const AdminShipments: React.FC = () => {
  const { 
    shipments, 
    updateShipment, 
    addShipmentEvent, 
    setSelectedLabelShipment, 
    setSelectedInvoice, 
    invoices,
    trackShipmentByNumber,
    setCurrentView,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  // Waypoint Update Modal State
  const [waypointModalOpen, setWaypointModalOpen] = useState(false);
  const [newLocation, setNewLocation] = useState('');
  const [newLat, setNewLat] = useState<number>(25.2048);
  const [newLng, setNewLng] = useState<number>(55.2708);
  const [newStatus, setNewStatus] = useState<ShipmentStatus>('in_transit');
  const [newDescription, setNewDescription] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const filtered = shipments.filter(s => {
    const matchesSearch = s.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.recipient.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenWaypointModal = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setNewLocation(shipment.currentLocation);
    setNewLat(shipment.currentCoordinates?.lat || 50.0379);
    setNewLng(shipment.currentCoordinates?.lng || 8.5622);
    setNewStatus(shipment.status);
    setNewDescription(`Telemetry checkpoint logged at ${shipment.currentLocation}`);
    setWaypointModalOpen(true);
  };

  const handleSaveWaypoint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;
    setIsUpdating(true);
    try {
      // 1. Add event log
      await addShipmentEvent(selectedShipment.id, {
        status: newStatus,
        location: newLocation,
        coordinates: { lat: newLat, lng: newLng },
        description: newDescription,
      });

      // 2. Update master shipment
      await updateShipment(selectedShipment.id, {
        status: newStatus,
        currentLocation: newLocation,
        currentCoordinates: { lat: newLat, lng: newLng },
      });

      setIsUpdating(false);
      setWaypointModalOpen(false);
      showToast('success', 'Waypoint Telemetry Dispatched', `Air waybill ${selectedShipment.trackingNumber} updated to ${formatStatus(newStatus)}.`);
    } catch {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Consignments & Waypoint Dispatch</h1>
          <p className="text-xs text-slate-500">Inject live radar waypoints, advance customs milestones, and print IATA air labels.</p>
        </div>

        <div className="flex gap-2">
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-2 rounded-xl flex items-center gap-1.5">
            <Package className="w-4 h-4 text-blue-600" />
            <span>{shipments.length} Total Master Waybills</span>
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 text-xs">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by Waybill #, Recipient or Destination..."
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
            <option value="all">All Operational Statuses</option>
            <option value="in_transit">In Transit</option>
            <option value="customs_cleared">Customs Cleared</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Shipments Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Waybill Number</th>
                <th className="py-3.5 px-4">Current Hub Checkpoint</th>
                <th className="py-3.5 px-4">Origin / Dest</th>
                <th className="py-3.5 px-4">Weight / Speed</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Dispatch Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => {
                const relatedInv = invoices.find(i => i.trackingNumber === s.trackingNumber || i.relatedEntityId === s.id);
                return (
                  <tr key={s.id} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                      <div>{s.trackingNumber}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{formatDate(s.createdAt)}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>{s.currentLocation}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        GPS: {s.currentCoordinates?.lat.toFixed(2)}, {s.currentCoordinates?.lng.toFixed(2)}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div>{s.destination}</div>
                      <div className="text-[10px] text-slate-400">From: {s.origin}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900">{s.packageWeight} KG</div>
                      <div className="text-[10px] text-slate-500">{s.serviceSpeed}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getStatusBadgeColor(s.status)}`}>
                        {formatStatus(s.status)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenWaypointModal(s)}
                        className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg transition inline-flex items-center gap-1"
                        title="Inject Live Checkpoint"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Update Waypoint</span>
                      </button>
                      <button
                        onClick={() => setSelectedLabelShipment(s)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition inline-flex"
                        title="Print 4x6 Waybill"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      {relatedInv && (
                        <button
                          onClick={() => setSelectedInvoice(relatedInv)}
                          className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition inline-flex"
                          title="Tax Invoice"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Waypoint Injection Modal */}
      {waypointModalOpen && selectedShipment && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-4 text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 font-mono">
                  Waypoint Telemetry Console
                </span>
                <h3 className="font-bold text-sm text-slate-900">
                  Update Cargo: {selectedShipment.trackingNumber}
                </h3>
              </div>
              <button onClick={() => setWaypointModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveWaypoint} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Operational Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ShipmentStatus)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  <option value="in_transit">In Transit (Air Cargo En Route)</option>
                  <option value="under_customs_review">Under Customs Inspection / Audit</option>
                  <option value="customs_cleared">Customs Cleared & Released</option>
                  <option value="out_for_delivery">Out for Courier Delivery</option>
                  <option value="delivered">Successfully Delivered & Signed</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Checkpoint / Airport Hub Name</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Dubai Cargo Terminal Gate 4"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newLat}
                    onChange={(e) => setNewLat(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newLng}
                    onChange={(e) => setNewLng(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Audit Log Event Note</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="e.g. Pallet scanned at bonded warehouse, temperature verified at 4.2°C"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setWaypointModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {isUpdating ? 'Dispatching Telemetry...' : 'Publish Waypoint Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

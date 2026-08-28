import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Printer, Package, Plane, QrCode } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export const ShippingLabelModal: React.FC = () => {
  const { selectedLabelShipment, setSelectedLabelShipment } = useApp();

  if (!selectedLabelShipment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/15 w-full max-w-lg overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 text-white">
        {/* Modal Controls */}
        <div className="bg-white/[0.04] text-white px-5 py-3.5 flex items-center justify-between border-b border-white/10 print:hidden">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-xs">Official 4x6 Express Courier Air Waybill</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition border border-white/10"
            >
              <Printer className="w-3.5 h-3.5" /> Print Label
            </button>
            <button
              onClick={() => setSelectedLabelShipment(null)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable 4x6 Label Canvas */}
        <div className="p-6 bg-white border-2 border-slate-800 m-4 rounded-xl space-y-4 text-slate-900 font-mono text-xs select-none">
          {/* Top Label Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-black text-white flex items-center justify-center rounded font-black text-sm">
                A
              </div>
              <span className="font-black text-lg tracking-tighter">APEX EXPRESS</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-xs">{selectedLabelShipment.shipmentType.toUpperCase()}</div>
              <div className="text-[10px] text-slate-600">{selectedLabelShipment.serviceSpeed}</div>
            </div>
          </div>

          {/* Large Routing Hub Code */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
            <div>
              <div className="text-[10px] uppercase font-sans font-bold text-slate-500">Destination Hub</div>
              <div className="text-3xl font-black tracking-wider">
                {selectedLabelShipment.destination.substring(0, 3).toUpperCase()} / {selectedLabelShipment.recipient.city.substring(0, 3).toUpperCase()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase font-sans font-bold text-slate-500">Gross Weight</div>
              <div className="text-2xl font-bold">{selectedLabelShipment.packageWeight} KG</div>
            </div>
          </div>

          {/* Sender & Recipient Addresses */}
          <div className="grid grid-cols-2 gap-4 border-b-2 border-slate-900 pb-4">
            <div className="space-y-0.5 border-r-2 border-slate-900 pr-2">
              <div className="text-[10px] font-sans font-bold text-slate-500">FROM (SENDER):</div>
              <div className="font-bold text-xs truncate">{selectedLabelShipment.sender.name}</div>
              <div className="text-[11px] truncate">{selectedLabelShipment.sender.address}</div>
              <div className="text-[11px]">{selectedLabelShipment.sender.city}, {selectedLabelShipment.sender.country}</div>
              <div className="text-[10px] text-slate-600">TEL: {selectedLabelShipment.sender.phone}</div>
            </div>

            <div className="space-y-0.5 pl-1">
              <div className="text-[10px] font-sans font-bold text-slate-500">SHIP TO (RECIPIENT):</div>
              <div className="font-bold text-xs truncate">{selectedLabelShipment.recipient.name}</div>
              <div className="text-[11px] truncate">{selectedLabelShipment.recipient.address}</div>
              <div className="text-[11px]">{selectedLabelShipment.recipient.city}, {selectedLabelShipment.recipient.country}</div>
              <div className="text-[10px] text-slate-600">TEL: {selectedLabelShipment.recipient.phone}</div>
            </div>
          </div>

          {/* Barcode & Tracking Number */}
          <div className="text-center py-2 space-y-1">
            <div className="text-3xl tracking-[0.25em] font-black scale-y-125 my-2">
              ||| | ||||| |||| | |||||||| |||
            </div>
            <div className="text-sm font-bold tracking-widest bg-slate-100 py-1 rounded">
              {selectedLabelShipment.trackingNumber}
            </div>
            <div className="text-[9px] text-slate-500 font-sans">
              SCAN BARCODE FOR REAL-TIME WAYPOINT GPS TELEMETRY
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="flex items-center justify-between border-t-2 border-slate-900 pt-2 text-[10px]">
            <div>Pieces: {selectedLabelShipment.packageCount} | Ref: {selectedLabelShipment.id}</div>
            <div>Date: {formatDate(selectedLabelShipment.createdAt)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

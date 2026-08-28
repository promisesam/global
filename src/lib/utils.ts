import { ShipmentStatus, JobApplicationStatus, VisaApplicationStatus, DocumentStatus } from '../types';

export function formatDate(isoString?: string): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return isoString;
  }
}

export function formatDateTime(isoString?: string): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function formatRelativeTime(isoString?: string): string {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(isoString);
  } catch {
    return isoString;
  }
}

export function formatStatus(status: string): string {
  if (!status) return '—';
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function getStatusBadgeColor(status: string): string {
  const s = (status || '').toLowerCase().replace(/[\s_]+/g, '');
  if (['delivered', 'completed', 'verified', 'accepted', 'approved', 'paid', 'active', 'selected'].some(k => s.includes(k))) {
    return 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 backdrop-blur-md shadow-sm shadow-emerald-500/10';
  }
  if (['transit', 'shipping', 'interview', 'review', 'screening', 'processing', 'scheduled'].some(k => s.includes(k))) {
    return 'bg-blue-500/15 text-blue-300 border border-blue-500/30 backdrop-blur-md shadow-sm shadow-blue-500/10';
  }
  if (['customs', 'pending', 'additional', 'draft', 'unpaid', 'action'].some(k => s.includes(k))) {
    return 'bg-amber-500/15 text-amber-300 border border-amber-500/30 backdrop-blur-md shadow-sm shadow-amber-500/10';
  }
  if (['rejected', 'cancelled', 'overdue', 'failed', 'refused', 'suspended'].some(k => s.includes(k))) {
    return 'bg-rose-500/15 text-rose-300 border border-rose-500/30 backdrop-blur-md shadow-sm shadow-rose-500/10';
  }
  return 'bg-white/10 text-slate-300 border border-white/15 backdrop-blur-md';
}

export const SHIPMENT_LIFECYCLE_STEPS: ShipmentStatus[] = [
  'Shipment Created',
  'Picked Up',
  'Processing',
  'In Transit',
  'Arrived at Facility',
  'Departed Facility',
  'Customs Processing',
  'Customs Cleared',
  'Arrived at Destination',
  'Out for Delivery',
  'Delivered',
];

export function getShipmentProgress(status: ShipmentStatus): number {
  if (status === 'Cancelled') return 0;
  const index = SHIPMENT_LIFECYCLE_STEPS.indexOf(status);
  if (index === -1) return 10;
  return Math.round(((index + 1) / SHIPMENT_LIFECYCLE_STEPS.length) * 100);
}

export function getShipmentStatusColor(status: ShipmentStatus): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (status) {
    case 'Delivered':
      return { bg: 'bg-emerald-500/15 backdrop-blur-md', text: 'text-emerald-300', border: 'border-emerald-500/30', dot: 'bg-emerald-400 shadow-sm shadow-emerald-400/50' };
    case 'Out for Delivery':
      return { bg: 'bg-blue-500/15 backdrop-blur-md', text: 'text-blue-300', border: 'border-blue-500/30', dot: 'bg-blue-400 shadow-sm shadow-blue-400/50' };
    case 'In Transit':
    case 'Departed Facility':
    case 'Arrived at Destination':
      return { bg: 'bg-sky-500/15 backdrop-blur-md', text: 'text-sky-300', border: 'border-sky-500/30', dot: 'bg-sky-400 shadow-sm shadow-sky-400/50' };
    case 'Customs Processing':
    case 'Customs Cleared':
      return { bg: 'bg-purple-500/15 backdrop-blur-md', text: 'text-purple-300', border: 'border-purple-500/30', dot: 'bg-purple-400 shadow-sm shadow-purple-400/50' };
    case 'Processing':
    case 'Picked Up':
    case 'Arrived at Facility':
      return { bg: 'bg-amber-500/15 backdrop-blur-md', text: 'text-amber-300', border: 'border-amber-500/30', dot: 'bg-amber-400 shadow-sm shadow-amber-400/50' };
    case 'Cancelled':
      return { bg: 'bg-rose-500/15 backdrop-blur-md', text: 'text-rose-300', border: 'border-rose-500/30', dot: 'bg-rose-400 shadow-sm shadow-rose-400/50' };
    case 'Shipment Created':
    default:
      return { bg: 'bg-white/10 backdrop-blur-md', text: 'text-slate-300', border: 'border-white/15', dot: 'bg-slate-400' };
  }
}

export function generateRandomId(prefix: string): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${num}`;
}

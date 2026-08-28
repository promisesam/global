import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { History, ShieldAlert, Search, Filter, Clock, User, Terminal } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export const AdminAuditLogs: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filtered = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.entityType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.entityId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action.toLowerCase().includes(actionFilter.toLowerCase());
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Immutable Security & Audit Trail</h1>
          <p className="text-xs text-slate-500">Tamper-evident logs of all system operations, role transitions, financial transactions, and telemetry writes.</p>
        </div>

        <div className="flex gap-2">
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-2 rounded-xl flex items-center gap-1.5">
            <History className="w-4 h-4 text-blue-600" />
            <span>{auditLogs.length} Total Audit Records</span>
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 text-xs">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by action, user, entity ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium"
          >
            <option value="all">All Action Types</option>
            <option value="SHIPMENT">Shipment Actions</option>
            <option value="VISA">Visa Actions</option>
            <option value="USER">User / Auth Actions</option>
            <option value="INVOICE">Invoice Actions</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Action Code</th>
                <th className="py-3.5 px-4">Target Entity</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">IP Address / Source</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4 text-right">Details Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-4 font-bold text-blue-600">
                    <span className="bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-900 font-semibold font-sans">
                    {log.entityType} #{log.entityId}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-sans">
                    <div className="font-semibold">{log.userName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">ID: {log.userId}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {log.ipAddress}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded max-w-xs truncate inline-block font-mono">
                      {JSON.stringify(log.details)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

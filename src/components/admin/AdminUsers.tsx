import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserRole } from '../../types';
import { Users, Search, ShieldCheck, UserCheck, UserX, Key, Mail, Phone, Lock } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export const AdminUsers: React.FC = () => {
  const { allUsers, updateUserRole, updateUserStatus, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = allUsers.filter(u => {
    return u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
           u.role.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    await updateUserRole(userId, newRole);
    showToast('success', 'Role Updated', `User permissions updated to ${newRole}.`);
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    await updateUserStatus(userId, nextStatus as any);
    showToast('info', 'Account Status Changed', `User status set to ${nextStatus}.`);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">User & RBAC Access Directory</h1>
          <p className="text-xs text-slate-500">Manage customer accounts, dispatch staff credentials, superadmin permissions, and KYC audits.</p>
        </div>

        <div className="flex gap-2">
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-2 rounded-xl flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-600" />
            <span>{allUsers.length} Registered Accounts</span>
          </span>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by user name, email address or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">User Particulars</th>
                <th className="py-3.5 px-4">Phone / Location</th>
                <th className="py-3.5 px-4">Role Permission</th>
                <th className="py-3.5 px-4">KYC / 2FA</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{user.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                    <div>{user.phone}</div>
                    <div className="text-slate-400">{user.country}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                      className="bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs font-semibold"
                    >
                      <option value="customer">Customer</option>
                      <option value="staff">Staff Specialist</option>
                      <option value="courier">Courier Driver</option>
                      <option value="admin">Super Admin</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 w-max">
                        <ShieldCheck className="w-3 h-3" /> KYC {user.kycStatus}
                      </span>
                      {user.twoFactorEnabled && (
                        <div className="text-[10px] text-slate-400">2FA Active</div>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      user.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {user.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleStatusToggle(user.id, user.status)}
                      className={`px-3 py-1 text-[11px] font-bold rounded-lg transition ${
                        user.status === 'active'
                          ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {user.status === 'active' ? 'Suspend' : 'Reactivate'}
                    </button>
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

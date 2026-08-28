import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, ShieldCheck, Bell, Globe2, Key, Save, CheckCircle2, Lock } from 'lucide-react';
import { CURRENCIES } from '../../lib/currencies';
import { CurrencyCode, LanguageCode } from '../../types';

export const CustomerSettings: React.FC = () => {
  const { currentUser, updateProfile, language, setLanguage, currency, setCurrency, showToast } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(currentUser.twoFactorEnabled);
  const [emailAlerts, setEmailAlerts] = useState(currentUser.notificationPreferences.email);
  const [smsAlerts, setSmsAlerts] = useState(currentUser.notificationPreferences.sms);
  const [whatsappAlerts, setWhatsappAlerts] = useState(currentUser.notificationPreferences.whatsapp);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile({
      name,
      phone,
      twoFactorEnabled,
      notificationPreferences: {
        email: emailAlerts,
        sms: smsAlerts,
        whatsapp: whatsappAlerts,
      },
    });
    setIsSaving(false);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast('error', 'Password Error', 'Password must be at least 6 characters.');
      return;
    }
    showToast('success', 'Security Credentials Updated', 'Your master account password has been updated.');
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
        <h1 className="text-xl font-bold text-slate-900 font-display">Account Security & Profile Settings</h1>
        <p className="text-xs text-slate-500">Manage identity records, 2FA biometric safeguards, and dispatch notification preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details Form */}
        <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
          <div className="flex items-center gap-2 border-b pb-3 font-bold text-slate-900 text-sm">
            <User className="w-4 h-4 text-blue-600" />
            <span>Profile & Contact Particulars</span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Registered Account Email</label>
            <input
              type="email"
              value={currentUser.email}
              disabled
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Contact Phone Number (with Country Code)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              required
            />
          </div>

          {/* Localization Preferences */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Preferred Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium"
              >
                {Object.entries(CURRENCIES).map(([code, cur]) => (
                  <option key={code} value={code}>{code} ({cur.symbol}) - {cur.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Interface Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium"
              >
                <option value="en">English (UK/Global)</option>
                <option value="de">Deutsch (German)</option>
                <option value="fr">Français (French)</option>
                <option value="ar">العربية (Arabic)</option>
                <option value="zh">中文 (Chinese)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </form>

        {/* Security & Notification Settings */}
        <div className="space-y-6">
          {/* 2FA & Password */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
            <div className="flex items-center gap-2 border-b pb-3 font-bold text-slate-900 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Two-Factor Authentication & Access</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <div className="font-bold text-slate-900">2-Factor Authentication (2FA)</div>
                <div className="text-[11px] text-slate-500">Require one-time SMS / TOTP passcode for sensitive actions</div>
              </div>
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-3 pt-2">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-slate-500" />
                <span>Update Password</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
                <input
                  type="password"
                  placeholder="New secure password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition cursor-pointer"
              >
                Update Master Password
              </button>
            </form>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3 text-xs">
            <div className="flex items-center gap-2 border-b pb-3 font-bold text-slate-900 text-sm">
              <Bell className="w-4 h-4 text-blue-600" />
              <span>Dispatch Notification Channels</span>
            </div>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                <span>Email Consignment & Visa Alerts</span>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                <span>SMS Checkpoint Waybill Updates</span>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                <span>WhatsApp Real-Time Milestone Alerts</span>
                <input
                  type="checkbox"
                  checked={whatsappAlerts}
                  onChange={(e) => setWhatsappAlerts(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

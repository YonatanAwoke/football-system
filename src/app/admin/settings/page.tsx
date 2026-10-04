"use client";

import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, RefreshCw, AlertTriangle, Shield, Globe, CreditCard } from 'lucide-react';
import { ClubSettings } from '@/lib/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Partial<ClubSettings>>({
    clubName: "Bulbula Amen Football Club",
    shortName: "Bulbula Amen FC",
    establishedYear: "2018",
    dashboardWelcomeTitle: "Academy Control Center",
    dashboardWelcomeText: "Bulbula Amen F.C. real-time academy operations dashboard.",
    location: "Addis Ababa, Ethiopia",
    website: "bulbulaamenfc.com",
    logoUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80",
    phone: "+251 91 123 4567",
    email: "info@bulbulaamenfc.com",
    telebirrAccount: "10002938481 (Bulbula Amen FC)",
    cbeAccount: "1000123456789 (Bulbula Amen FC Main)",
    currency: "ETB",
    timeZone: "East Africa Time (UTC+3)",
    academicSeason: "2025/2026 Season",
    autoRemindersEnabled: true,
    reminderDaysBeforeDue: [7, 3, 0],
    gracePeriodDays: 5
  });

  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) {
          setSettings(res.data);
        }
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      }).then(r => r.json());

      if (res.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetSeedData = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'RESET_SEED' })
      }).then(r => r.json());

      if (res.success) {
        setResetModalOpen(false);
        setResetSuccess(true);
        setTimeout(() => setResetSuccess(false), 4000);
        // Refresh page data
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 font-sans max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase text-brand-orange tracking-wider block">Central System Control</span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Club Settings & System Configurations</h1>
          <p className="text-slate-500 text-xs mt-1">Configure global club metadata, payment accounts, automated reminders, and database seed controls.</p>
        </div>

        <button
          type="button"
          onClick={() => setResetModalOpen(true)}
          className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
        >
          <RefreshCw className="w-4 h-4" /> Reset Demo Seed Data
        </button>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Club settings saved successfully! All administrative modules updated.
        </div>
      )}

      {resetSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Database reset to fresh demo seed data (10 players per team)! Reloading system...
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Section 1: Club Identity & Branding */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
          <h3 className="font-black text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-orange" /> Club Identity & Dashboard Text
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Club Full Name</label>
              <input 
                type="text" value={settings.clubName || ''}
                onChange={e => setSettings({ ...settings, clubName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:border-brand-orange focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Short Name / Abbreviation</label>
              <input 
                type="text" value={settings.shortName || ''}
                onChange={e => setSettings({ ...settings, shortName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:border-brand-orange focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Established Year</label>
              <input 
                type="text" value={settings.establishedYear || '2018'}
                onChange={e => setSettings({ ...settings, establishedYear: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:border-brand-orange focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Dashboard Welcome Title</label>
              <input 
                type="text" value={settings.dashboardWelcomeTitle || ''}
                onChange={e => setSettings({ ...settings, dashboardWelcomeTitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:border-brand-orange focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Dashboard Subtitle / Description</label>
              <input 
                type="text" value={settings.dashboardWelcomeText || ''}
                onChange={e => setSettings({ ...settings, dashboardWelcomeText: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:border-brand-orange focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Regional Settings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
          <h3 className="font-black text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" /> Contact Details & Season Parameters
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Official Phone</label>
              <input 
                type="text" value={settings.phone || ''}
                onChange={e => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Official Email</label>
              <input 
                type="email" value={settings.email || ''}
                onChange={e => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Current Academic/Football Season</label>
              <input 
                type="text" value={settings.academicSeason || '2025/2026 Season'}
                onChange={e => setSettings({ ...settings, academicSeason: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Payment Accounts & Verification Rules */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
          <h3 className="font-black text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" /> Official Payment Accounts & Reminders
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Telebirr Account Number</label>
              <input 
                type="text" value={settings.telebirrAccount || ''}
                onChange={e => setSettings({ ...settings, telebirrAccount: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">CBE Bank Account Number</label>
              <input 
                type="text" value={settings.cbeAccount || ''}
                onChange={e => setSettings({ ...settings, cbeAccount: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Grace Period (Days)</label>
              <input 
                type="number" value={settings.gracePeriodDays || 5}
                onChange={e => setSettings({ ...settings, gracePeriodDays: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Currency Code</label>
              <input 
                type="text" value={settings.currency || 'ETB'}
                onChange={e => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold uppercase"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-brand-orange text-white font-extrabold text-xs rounded-xl hover:bg-brand-orange-dark shadow-md flex items-center gap-2 transition-all"
        >
          <Save className="w-4 h-4" /> Save System Configurations
        </button>
      </form>

      {/* Reset Seed Modal Confirmation */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="p-2.5 bg-red-50 text-red-600 rounded-2xl border border-red-200">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900">Reset Demo Seed Data</h3>
                <span className="text-xs text-slate-500 font-bold">Restore fresh 10 players per team</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This action will reset players, registrations, payment histories, and attendance sessions back to the official <strong>Bulbula Amen F.C. demo seed dataset</strong> (10 realistic players per squad). Are you sure you want to proceed?
            </p>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button 
                type="button" 
                onClick={() => setResetModalOpen(false)} 
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleResetSeedData} 
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" /> Confirm Seed Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, Shield, Calendar, Clock, CreditCard, CheckCircle2, 
  Upload, Bell, ChevronRight, Activity, DollarSign, FileText, ArrowLeft, AlertCircle
} from 'lucide-react';
import { Player, PaymentTransaction } from '@/lib/types';
import FifaPlayerCard from '@/components/FifaPlayerCard';

export default function ParentPortalPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  // Upload Payment Modal
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Telebirr' | 'CBE Birr'>('Telebirr');
  const [transactionId, setTransactionId] = useState('');
  const [amount, setAmount] = useState('1500');
  const [screenshotUrl, setScreenshotUrl] = useState('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetch('/api/players')
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data.length > 0) {
          setPlayers(res.data);
          setSelectedPlayer(res.data[0]);
        }
        setLoading(false);
      });
  }, []);

  const handleUploadPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayer) return;

    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: selectedPlayer.id,
          playerName: selectedPlayer.fullName,
          teamId: selectedPlayer.teamId,
          teamName: selectedPlayer.teamName,
          parentName: selectedPlayer.parentInfo?.fullName || 'Parent',
          parentPhone: selectedPlayer.parentInfo?.phone || selectedPlayer.phone,
          amount: Number(amount) || 1500,
          type: 'MONTHLY',
          paymentMethod,
          transactionId: transactionId || `TXN-${Math.floor(1000000 + Math.random()*9000000)}`,
          screenshotUrl,
          notes: `Uploaded via Parent Portal for ${selectedPlayer.fullName}`
        })
      }).then(r => r.json());

      if (res.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          setUploadModalOpen(false);
        }, 2500);
      } else {
        setErrorMessage(res.error || 'Failed to submit payment receipt');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">Loading Parent Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/login" className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-all border border-slate-200">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[10px] font-black uppercase text-brand-orange tracking-wider block">Bulbula Amen F.C.</span>
              <h1 className="text-base font-black text-slate-900">Parent & Guardian Portal</h1>
            </div>
          </div>

          <Link 
            href="/login"
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 border border-slate-200 transition-all"
          >
            Staff Dashboard &rarr;
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        {/* Child Selector Tabs (Multi-Children Support) */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 space-y-3 shadow-md">
          <span className="text-xs font-extrabold uppercase text-slate-500 block tracking-wider">
            MY CHILDREN (ACADEMY MEMBERS)
          </span>

          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
            {players.slice(0, 4).map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlayer(p)}
                className={`p-3 rounded-2xl border transition-all flex items-center gap-3 min-w-[200px] text-left ${
                  selectedPlayer?.id === p.id 
                    ? "bg-brand-orange/10 border-brand-orange text-slate-900 shadow-md" 
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <img src={p.photoUrl} alt={p.fullName} className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                <div>
                  <span className="font-extrabold text-xs block text-slate-900">{p.fullName}</span>
                  <span className="text-[10px] text-brand-orange font-bold">{p.teamName} &bull; #{p.jerseyNumber}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedPlayer && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* FIFA Card Preview */}
            <div className="flex justify-center items-start">
              <FifaPlayerCard player={selectedPlayer} />
            </div>

            {/* Child Details & Actions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Status Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Monthly Fee Status</span>
                    <h3 className="text-lg font-black text-slate-900">Fee Balance & Schedule</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                    selectedPlayer.paymentStatus === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
                  }`}>
                    {selectedPlayer.paymentStatus || 'DUE'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-center">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-slate-500 block font-bold">Monthly Fee</span>
                    <span className="text-base font-black text-brand-orange">
                      {(selectedPlayer.feeSchedule?.monthlyFee || 1500).toLocaleString()} ETB
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-slate-500 block font-bold">Due Date</span>
                    <span className="text-sm font-black text-slate-900">
                      {selectedPlayer.feeSchedule?.nextPaymentDueDate || '2026-09-05'}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-slate-500 block font-bold">Attendance</span>
                    <span className="text-base font-black text-emerald-600">
                      {selectedPlayer.statistics?.trainingAttendance || 92}%
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setUploadModalOpen(true)}
                  className="w-full py-3 bg-brand-orange hover:bg-brand-orange-dark text-white font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" /> Upload Monthly Payment Receipt (Telebirr / CBE)
                </button>
              </div>

              {/* Training & Match Schedule */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-md">
                <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block">Academy Schedule</span>
                <h3 className="text-base font-black text-slate-900">Training Sessions & Matches</h3>

                <div className="space-y-3 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-900 font-extrabold">
                        <Calendar className="w-4 h-4 text-brand-orange" />
                        <span>Weekly Training Session</span>
                      </div>
                      <p className="text-slate-500">Saturday & Sunday &bull; 9:00 AM – 10:30 AM</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 font-bold rounded-lg">Active</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-900 font-extrabold">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span>Sub-City Youth Cup Match</span>
                      </div>
                      <p className="text-slate-500">Bulbula Amen F.C. vs St. George Youth &bull; Abebe Bikila Stadium</p>
                    </div>
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-700 font-bold rounded-lg">Upcoming</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Upload Payment Modal */}
      {uploadModalOpen && selectedPlayer && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-slate-900">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black text-brand-orange uppercase">Upload Payment Proof</span>
                <h3 className="font-black text-lg text-slate-900">{selectedPlayer.fullName} ({selectedPlayer.teamName})</h3>
              </div>
              <button onClick={() => setUploadModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            {submitSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-extrabold text-slate-900 text-base">Receipt Uploaded Successfully!</h4>
                <p className="text-xs text-slate-600">Finance officer will verify your transaction shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleUploadPayment} className="space-y-4 text-xs">
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 font-bold rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Select Payment Provider</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Telebirr', 'CBE Birr'].map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPaymentMethod(m as any)}
                        className={`p-3 rounded-xl border font-extrabold transition-all ${
                          paymentMethod === m 
                            ? "bg-brand-orange text-white border-brand-orange" 
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Transaction ID (Reference Number)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TXN-998201 or 92830182"
                    value={transactionId}
                    onChange={e => setTransactionId(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono focus:border-brand-orange focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Amount Paid (ETB)</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold focus:border-brand-orange focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Screenshot / Receipt Image URL</label>
                  <input
                    type="url"
                    required
                    value={screenshotUrl}
                    onChange={e => setScreenshotUrl(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono text-[11px] focus:border-brand-orange focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setUploadModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-brand-orange text-white font-black rounded-xl hover:bg-brand-orange-dark transition-all"
                  >
                    {submitting ? 'Submitting...' : 'Submit Receipt for Verification'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

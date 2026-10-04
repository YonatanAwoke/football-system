"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  CreditCard, CheckCircle2, XCircle, Clock, Eye, Shield, Scan, X, Calendar, 
  User as UserIcon, Phone, DollarSign, Bell, AlertTriangle, UserX, Search, Filter, 
  Send, AlertCircle, ArrowUpRight, Check, RefreshCw, Mail, MapPin, Trophy, Activity,
  ChevronRight, ExternalLink, FileText, Award, Layers
} from 'lucide-react';
import { PaymentTransaction, Player, Team, User as UserType } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';

function PaymentsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, tContent, language } = useLanguage();

  // Navigation View: 'dashboard' (Payment Status & Roster) or 'verification' (Transaction Proof Queue)
  const viewParam = searchParams.get('view') || 'dashboard';
  const statusParam = searchParams.get('status') || 'ALL';

  const [activeView, setActiveView] = useState<'dashboard' | 'verification'>(
    viewParam === 'verification' || statusParam === 'Under Verification' ? 'verification' : 'dashboard'
  );

  // Sync state with query params
  useEffect(() => {
    if (viewParam === 'verification' || statusParam === 'Under Verification') {
      setActiveView('verification');
    } else {
      setActiveView('dashboard');
    }
  }, [viewParam, statusParam]);

  // Data States
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const txnTarget = searchParams.get('txn');
  const playerTarget = searchParams.get('playerId') || searchParams.get('search');

  // Filter States for Dashboard
  const [dashFilter, setDashFilter] = useState<'ALL' | 'PAID' | 'OVERDUE' | 'PENDING'>('ALL');
  const [searchQuery, setSearchQuery] = useState(playerTarget || '');
  const [teamFilter, setTeamFilter] = useState('ALL');

  // Filter States for Verification Queue
  const [verifFilter, setVerifFilter] = useState<string>(statusParam !== 'dashboard' ? statusParam : 'ALL');

  // Sync searchQuery when playerTarget changes
  useEffect(() => {
    if (playerTarget) {
      setSearchQuery(playerTarget);
    }
  }, [playerTarget]);

  // Modal States
  const [selectedPayment, setSelectedPayment] = useState<PaymentTransaction | null>(null);

  // Player Profile Modal State
  const [profilePlayer, setProfilePlayer] = useState<Player | null>(null);
  const [profileTab, setProfileTab] = useState<'OVERVIEW' | 'FEES' | 'STATS'>('OVERVIEW');

  // Action Modals for Players in Dashboard
  const [notifPlayer, setNotifPlayer] = useState<Player | null>(null);
  const [notifMessage, setNotifMessage] = useState('');

  const [warningPlayer, setWarningPlayer] = useState<Player | null>(null);
  const [warningMessage, setWarningMessage] = useState('');

  const [deactivatePlayer, setDeactivatePlayer] = useState<Player | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentUser: UserType = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('auth_user') || '{"name":"Martha Haile","role":"FINANCE_OFFICER"}') 
    : { name: 'Martha Haile', role: 'FINANCE_OFFICER' } as UserType;

  // Fetch Players, Teams, and Payments
  const fetchData = async () => {
    setLoading(true);
    try {
      const [playersRes, teamsRes, paymentsRes] = await Promise.all([
        fetch('/api/players').then(r => r.json()),
        fetch('/api/teams').then(r => r.json()),
        fetch('/api/payments').then(r => r.json())
      ]);
      if (playersRes.success) setPlayers(playersRes.data);
      if (teamsRes.success) setTeams(teamsRes.data);
      if (paymentsRes.success) setPayments(paymentsRes.data);
    } catch (err) {
      console.error("Error loading payment data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Target Auto-Opening when navigating from notifications
  useEffect(() => {
    if (txnTarget && payments.length > 0) {
      const matchPay = payments.find(p => 
        p.transactionId.toLowerCase() === txnTarget.toLowerCase() || 
        p.id.toLowerCase() === txnTarget.toLowerCase()
      );
      if (matchPay) {
        setActiveView('verification');
        setSelectedPayment(matchPay);
      }
    }
    if (playerTarget && players.length > 0) {
      const matchPlayer = players.find(p => 
        p.id.toLowerCase() === playerTarget.toLowerCase() || 
        p.fullName.toLowerCase().includes(playerTarget.toLowerCase())
      );
      if (matchPlayer) {
        setProfilePlayer(matchPlayer);
      }
    }
  }, [txnTarget, playerTarget, payments, players]);

  // Payment Settings Drawer state
  const [payConfigOpen, setPayConfigOpen] = useState(false);
  const [payConfigData, setPayConfigData] = useState({
    telebirrAccount: '10002938481 (Bulbula Amen FC)',
    cbeAccount: '1000123456789 (Bulbula Amen FC Main)',
    bankTransferDetails: 'CBE Account: 1000123456789 | Telebirr: 0911234567',
    gracePeriodDays: 5,
    autoRemindersEnabled: true,
    reminderDaysBeforeDue: [7, 3, 0],
    reminderDaysAfterDue: [3, 7],
    deactivationThresholdDays: 14
  });

  const handleSavePayConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const settingsRes = await fetch('/api/settings').then(r => r.json());
      const currentSettings = settingsRes.success ? settingsRes.data : {};
      const updatedSettings = {
        ...currentSettings,
        ...payConfigData
      };
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      }).then(r => r.json());

      if (res.success) {
        setToastMessage('Payment & Reminder configuration saved successfully!');
        setTimeout(() => setToastMessage(null), 3000);
        setPayConfigOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Helper: Calculate Overdue Days from Due Date
  const getOverdueDays = (dueDateStr?: string) => {
    if (!dueDateStr) return 0;
    const dueTime = new Date(dueDateStr).getTime();
    const currentTime = new Date('2026-08-29').getTime(); // Current system reference date
    if (isNaN(dueTime)) return 0;
    const diffDays = Math.floor((currentTime - dueTime) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Helper: Get Normalized Payment Status for Player
  const getPlayerPaymentStatus = (player: Player): 'PAID' | 'OVERDUE' | 'PENDING' => {
    if (player.status === 'SUSPENDED') return 'OVERDUE';
    if (player.feeSchedule?.paymentStatus === 'PAID' || player.paymentStatus === 'VERIFIED') return 'PAID';
    if (player.feeSchedule?.paymentStatus === 'OVERDUE' || player.paymentStatus === 'OVERDUE') return 'OVERDUE';
    const days = getOverdueDays(player.feeSchedule?.nextPaymentDueDate);
    if (days > 0) return 'OVERDUE';
    return 'PENDING';
  };

  // Helper: Get Last Paid Date for Player
  const getPlayerLastPaidDate = (player: Player) => {
    const playerPay = payments.find(p => p.playerId === player.id && p.verificationStatus === 'Verified');
    if (playerPay) return playerPay.paymentDate.split('T')[0];
    if (player.feeSchedule?.paymentStatus === 'PAID') return player.registrationDate || '2026-08-01';
    return 'Not Paid Yet';
  };

  // Filtered Players for Dashboard View
  const filteredPlayers = players.filter(player => {
    const status = getPlayerPaymentStatus(player);
    if (dashFilter !== 'ALL' && status !== dashFilter) return false;
    if (teamFilter !== 'ALL' && player.teamId !== teamFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = player.fullName.toLowerCase().includes(q);
      const matchId = player.id.toLowerCase().includes(q);
      const matchPhone = player.phone.includes(q) || player.parentInfo?.phone?.includes(q);
      if (!matchName && !matchId && !matchPhone) return false;
    }
    return true;
  });

  // Financial Summary Stats
  const paidCount = players.filter(p => getPlayerPaymentStatus(p) === 'PAID').length;
  const overdueCount = players.filter(p => getPlayerPaymentStatus(p) === 'OVERDUE').length;
  const pendingCount = players.filter(p => getPlayerPaymentStatus(p) === 'PENDING').length;
  const totalRevenue = players.reduce((sum, p) => sum + (p.feeSchedule?.totalPaid || 0), 0);
  const totalOutstanding = players.reduce((sum, p) => sum + (p.feeSchedule?.currentBalance || (getPlayerPaymentStatus(p) === 'OVERDUE' ? (p.feeSchedule?.monthlyFee || 1500) : 0)), 0);

  // Filtered Transactions for Verification View
  const filteredTransactions = payments.filter(p => {
    if (verifFilter !== 'ALL' && p.verificationStatus !== verifFilter) return false;
    if (txnTarget) {
      const q = txnTarget.toLowerCase();
      return p.transactionId.toLowerCase() === q || p.id.toLowerCase() === q || p.playerName.toLowerCase().includes(q);
    }
    return true;
  });

  // Action Handler: Send Notification
  const handleOpenNotificationModal = (player: Player) => {
    setNotifPlayer(player);
    setNotifMessage(
      `Dear ${player.parentInfo?.fullName || 'Parent'}, this is a friendly reminder from Bulbula Amen F.C. that monthly training fee of ETB ${(player.feeSchedule?.monthlyFee || 1500).toLocaleString()} for ${player.fullName} is due. Please pay via Telebirr or CBE Birr and upload receipt.`
    );
  };

  const handleSendNotificationSubmit = async () => {
    if (!notifPlayer) return;
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientRole: 'ALL',
          recipientPhone: notifPlayer.parentInfo?.phone || notifPlayer.phone,
          recipientName: notifPlayer.parentInfo?.fullName || notifPlayer.fullName,
          title: `Payment Reminder: ${notifPlayer.fullName}`,
          message: notifMessage,
          channel: 'SMS',
          type: 'PAYMENT_REMINDER'
        })
      }).then(r => r.json());

      if (res.success) {
        showToast(`🔔 Notification SMS dispatched to ${notifPlayer.parentInfo?.fullName || notifPlayer.fullName}!`);
        setNotifPlayer(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Action Handler: Send Warning
  const handleOpenWarningModal = (player: Player) => {
    const overdueDays = getOverdueDays(player.feeSchedule?.nextPaymentDueDate) || 14;
    setWarningPlayer(player);
    setWarningMessage(
      `URGENT WARNING: Payment for ${player.fullName} (${player.id}) is ${overdueDays} DAYS OVERDUE. Outstanding balance: ETB ${(player.feeSchedule?.monthlyFee || 1500).toLocaleString()}. Please settle payment within 48 hours to avoid membership suspension and deactivation.`
    );
  };

  const handleSendWarningSubmit = async () => {
    if (!warningPlayer) return;
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientRole: 'ALL',
          recipientPhone: warningPlayer.parentInfo?.phone || warningPlayer.phone,
          recipientName: warningPlayer.parentInfo?.fullName || warningPlayer.fullName,
          title: `⚠️ OFFICIAL OVERDUE WARNING: ${warningPlayer.fullName}`,
          message: warningMessage,
          channel: 'SMS',
          type: 'SYSTEM_ALERT'
        })
      }).then(r => r.json());

      if (res.success) {
        showToast(`⚠️ Warning SMS & Notification sent to ${warningPlayer.parentInfo?.fullName || warningPlayer.fullName}!`);
        setWarningPlayer(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Action Handler: Deactivate Player
  const handleDeactivateSubmit = async () => {
    if (!deactivatePlayer) return;
    try {
      const updatedPlayer: Player = {
        ...deactivatePlayer,
        status: 'SUSPENDED',
        paymentStatus: 'OVERDUE',
        feeSchedule: deactivatePlayer.feeSchedule ? {
          ...deactivatePlayer.feeSchedule,
          paymentStatus: 'OVERDUE'
        } : undefined
      };

      const res = await fetch('/api/players', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPlayer)
      }).then(r => r.json());

      if (res.success) {
        setPlayers(players.map(p => p.id === deactivatePlayer.id ? res.data : p));
        showToast(`🚫 Player ${deactivatePlayer.fullName} (${deactivatePlayer.id}) has been DEACTIVATED.`);
        setDeactivatePlayer(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Verify Transaction Handler
  const handleVerifyTransaction = async (paymentId: string, status: 'Verified' | 'Rejected') => {
    try {
      const res = await fetch('/api/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId,
          status,
          user: currentUser
        })
      }).then(r => r.json());

      if (res.success) {
        setPayments(payments.map(p => p.id === paymentId ? res.data : p));
        if (selectedPayment && selectedPayment.id === paymentId) {
          setSelectedPayment(res.data);
        }
        showToast(`Payment transaction ${status === 'Verified' ? 'Approved' : 'Rejected'} successfully!`);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Main Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase text-brand-orange tracking-wider block">
            Financial Management & Accounting
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Payments & Financials</h1>
          <p className="text-slate-500 text-xs mt-1">
            Track member fee status, overdue collections, dispatch notifications & verify electronic payments.
          </p>
        </div>

        {/* View Switcher: Module 1 (Payment Dashboard) vs Module 2 (Payment Verification) */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => {
              setActiveView('dashboard');
              router.push('/admin/payments?view=dashboard');
            }}
            className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all flex items-center gap-2 ${
              activeView === 'dashboard'
                ? "bg-brand-orange text-white shadow-md"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Payment Dashboard
          </button>
          <button
            onClick={() => {
              setActiveView('verification');
              router.push('/admin/payments?view=verification');
            }}
            className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all flex items-center gap-2 ${
              activeView === 'verification'
                ? "bg-brand-orange text-white shadow-md"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Scan className="w-4 h-4" />
            Payment Verification
            {payments.filter(p => p.verificationStatus === 'Under Verification').length > 0 && (
              <span className="px-1.5 py-0.5 bg-amber-400 text-slate-950 font-black rounded-full text-[10px]">
                {payments.filter(p => p.verificationStatus === 'Under Verification').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODULE 1: PAYMENT DASHBOARD (STATUS, OVERDUE, REMINDERS, DEACTIVATIONS) */}
      {/* ========================================================================= */}
      {activeView === 'dashboard' && (
        <div className="space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div 
              onClick={() => setDashFilter('PAID')}
              className={`p-5 rounded-2xl bg-white border border-slate-200 shadow-sm cursor-pointer hover:border-emerald-500 transition-all ${dashFilter === 'PAID' ? 'ring-2 ring-emerald-500 bg-emerald-50/20' : ''}`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Paid Members</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{paidCount}</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                Collected: ETB {totalRevenue.toLocaleString()}
              </div>
            </div>

            <div 
              onClick={() => setDashFilter('OVERDUE')}
              className={`p-5 rounded-2xl bg-white border border-slate-200 shadow-sm cursor-pointer hover:border-red-500 transition-all ${dashFilter === 'OVERDUE' ? 'ring-2 ring-red-500 bg-red-50/20' : ''}`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Overdue Payments</span>
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              </div>
              <div className="text-2xl font-black text-red-600 mt-2">{overdueCount}</div>
              <div className="text-[11px] text-red-600 font-semibold mt-1">
                Outstanding: ETB {totalOutstanding.toLocaleString()}
              </div>
            </div>

            <div 
              onClick={() => setDashFilter('PENDING')}
              className={`p-5 rounded-2xl bg-white border border-slate-200 shadow-sm cursor-pointer hover:border-amber-500 transition-all ${dashFilter === 'PENDING' ? 'ring-2 ring-amber-500 bg-amber-50/20' : ''}`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Pending / Due Soon</span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              </div>
              <div className="text-2xl font-black text-amber-600 mt-2">{pendingCount}</div>
              <div className="text-[11px] text-amber-600 font-semibold mt-1">
                Upcoming Monthly Dues
              </div>
            </div>

            <div 
              onClick={() => setDashFilter('ALL')}
              className={`p-5 rounded-2xl bg-white border border-slate-200 shadow-sm cursor-pointer hover:border-brand-orange transition-all ${dashFilter === 'ALL' ? 'ring-2 ring-brand-orange bg-brand-orange/5' : ''}`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Total Roster</span>
                <span className="w-2.5 h-2.5 rounded-full bg-brand-orange"></span>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{players.length}</div>
              <div className="text-[11px] text-slate-500 font-semibold mt-1">
                Compliance Rate: {Math.round((paidCount / (players.length || 1)) * 100)}%
              </div>
            </div>
          </div>

          {/* SELECTABLE DIVISION / TEAM TABS BAR */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-brand-orange" /> Select Squad / Division
              </span>
              <span className="text-[11px] text-slate-400 font-semibold">
                Showing {teamFilter === 'ALL' ? 'All Divisions' : (teams.find(t => t.id === teamFilter)?.name || teamFilter)}
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setTeamFilter('ALL')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  teamFilter === 'ALL'
                    ? "bg-brand-orange text-white shadow-md"
                    : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span>All Divisions</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                  teamFilter === 'ALL' ? "bg-white/20 text-white" : "bg-slate-200 text-slate-800"
                }`}>
                  {players.length}
                </span>
              </button>

              {teams.map(team => {
                const count = players.filter(p => p.teamId === team.id).length;
                const isSelected = teamFilter === team.id;
                return (
                  <button
                    key={team.id}
                    onClick={() => setTeamFilter(team.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-brand-orange text-white shadow-md"
                        : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>{tContent(team.name)}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                      isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-800"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter Bar & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            {/* Status Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {[
                { key: 'ALL', label: `All Statuses (${players.length})` },
                { key: 'PAID', label: `Paid (${paidCount})` },
                { key: 'OVERDUE', label: `Overdue (${overdueCount})` },
                { key: 'PENDING', label: `Pending (${pendingCount})` },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setDashFilter(tab.key as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                    dashFilter === tab.key
                      ? "bg-brand-orange text-white shadow-sm"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Targeted Notification Filter Banner */}
            {(playerTarget || txnTarget) && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs font-extrabold flex items-center justify-between shadow-sm mb-4 w-full">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-brand-orange text-white font-black text-[10px] rounded uppercase">Target Filter</span>
                  <span>Showing only notification target: <strong className="text-slate-900">{playerTarget || txnTarget}</strong></span>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    router.push('/admin/payments?view=dashboard');
                  }}
                  className="px-3 py-1 bg-white border border-amber-300 text-slate-900 font-bold rounded-xl hover:bg-amber-100 transition-all flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Show All Players / Items
                </button>
              </div>
            )}

            {/* Search Filter */}
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input 
                  type="text"
                  placeholder="Search player, ID, phone..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-brand-orange focus:outline-none w-full"
                />
              </div>
            </div>
          </div>

          {/* Players Detailed Payment Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                  <tr>
                    <th className="p-4">Player Details (Click Name for Profile)</th>
                    <th className="p-4">Division / Team</th>
                    <th className="p-4">Parent & Contact</th>
                    <th className="p-4">Monthly Fee & Dues</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">When They Paid</th>
                    <th className="p-4">Due Date</th>
                    <th className="p-4">Overdue Days</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredPlayers.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-400">
                        No player records found matching current division and filters.
                      </td>
                    </tr>
                  ) : (
                    filteredPlayers.map(player => {
                      const status = getPlayerPaymentStatus(player);
                      const lastPaid = getPlayerLastPaidDate(player);
                      const dueDate = player.feeSchedule?.nextPaymentDueDate || '2026-08-01';
                      const overdueDays = getOverdueDays(dueDate);
                      const isSuspended = player.status === 'SUSPENDED';

                      const isTarget = !!playerTarget && (
                        player.id.toLowerCase() === playerTarget.toLowerCase() ||
                        player.fullName.toLowerCase().includes(playerTarget.toLowerCase())
                      );

                      return (
                        <tr 
                          key={player.id} 
                          className={`transition-colors ${
                            isTarget 
                              ? "bg-amber-50/90 border-2 border-brand-orange shadow-md font-bold" 
                              : "hover:bg-slate-50/80"
                          }`}
                        >
                          {/* Player Details - Clickable to Open Profile Modal */}
                          <td 
                            className="p-4 cursor-pointer group"
                            onClick={() => setProfilePlayer(player)}
                            title="Click to view full player profile"
                          >
                            <div className="flex items-center gap-3">
                              <img 
                                src={player.photoUrl} 
                                alt={player.fullName} 
                                className="w-10 h-10 rounded-xl object-cover border border-slate-200 group-hover:scale-105 transition-transform" 
                              />
                              <div>
                                <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5 group-hover:text-brand-orange transition-colors">
                                  <span>{player.fullName}</span>
                                  <ExternalLink className="w-3.5 h-3.5 text-brand-orange opacity-0 group-hover:opacity-100 transition-opacity" />
                                  {isTarget && (
                                    <span className="px-2 py-0.5 bg-brand-orange text-white font-black text-[9px] rounded-full uppercase shadow animate-pulse">
                                      🎯 NOTIFICATION TARGET
                                    </span>
                                  )}
                                  {isSuspended && (
                                    <span className="px-1.5 py-0.5 bg-red-600 text-white font-black text-[9px] rounded uppercase">
                                      DEACTIVATED
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500 font-mono">
                                  ID: {player.id} &bull; #{player.jerseyNumber} &bull; {player.position}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Team / Division Name */}
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 font-bold text-slate-800 text-[11px] inline-block">
                              {tContent(player.teamName)}
                            </span>
                          </td>

                          {/* Parent & Contact */}
                          <td className="p-4">
                            <div className="font-bold text-slate-900">{player.parentInfo?.fullName || 'Parent'}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{player.parentInfo?.phone || player.phone}</div>
                          </td>

                          {/* Fee Amount */}
                          <td className="p-4">
                            <div className="font-black text-slate-900 text-sm">
                              ETB {(player.feeSchedule?.monthlyFee || 1500).toLocaleString()}
                            </div>
                            <div className="text-[10px] text-slate-400 font-semibold">
                              Total Paid: ETB {(player.feeSchedule?.totalPaid || 9500).toLocaleString()}
                            </div>
                          </td>

                          {/* Payment Status Badge */}
                          <td className="p-4">
                            {isSuspended ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-red-100 text-red-700 border border-red-300">
                                🚫 Deactivated
                              </span>
                            ) : status === 'PAID' ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center gap-1 w-fit">
                                <CheckCircle2 className="w-3 h-3" /> Paid
                              </span>
                            ) : status === 'OVERDUE' ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-red-50 text-red-600 border border-red-200 flex items-center gap-1 w-fit">
                                <AlertTriangle className="w-3 h-3" /> Overdue
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-50 text-amber-600 border border-amber-200 flex items-center gap-1 w-fit">
                                <Clock className="w-3 h-3" /> Pending
                              </span>
                            )}
                          </td>

                          {/* When They Paid */}
                          <td className="p-4 font-semibold text-slate-700">
                            {lastPaid}
                          </td>

                          {/* When It's Due / Was Due */}
                          <td className="p-4 font-semibold text-slate-700">
                            {dueDate}
                          </td>

                          {/* Overdue Days */}
                          <td className="p-4">
                            {status === 'OVERDUE' || overdueDays > 0 ? (
                              <span className="px-2.5 py-1 rounded-xl bg-red-500 text-white font-extrabold text-xs shadow-sm flex items-center gap-1 w-fit">
                                ⚠️ {overdueDays} Days Overdue
                              </span>
                            ) : status === 'PAID' ? (
                              <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-[11px] w-fit block">
                                0 Days (On Time)
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-800 font-bold text-[11px] w-fit block">
                                Due Soon
                              </span>
                            )}
                          </td>

                          {/* Action Buttons: Notification, Warning, Deactivate */}
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* 1. Send Notification */}
                              <button
                                onClick={() => handleOpenNotificationModal(player)}
                                title="Send Payment Notification SMS"
                                className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-[11px] rounded-xl transition-all flex items-center gap-1"
                              >
                                <Bell className="w-3.5 h-3.5" />
                                Notify
                              </button>

                              {/* 2. Send Warning */}
                              <button
                                onClick={() => handleOpenWarningModal(player)}
                                title="Send Urgent Overdue Warning"
                                className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold text-[11px] rounded-xl transition-all flex items-center gap-1"
                              >
                                <AlertCircle className="w-3.5 h-3.5" />
                                Warning
                              </button>

                              {/* 3. Deactivate */}
                              <button
                                onClick={() => setDeactivatePlayer(player)}
                                disabled={isSuspended}
                                title={isSuspended ? "Player already deactivated" : "Deactivate player profile for non-payment"}
                                className={`px-2.5 py-1.5 font-bold text-[11px] rounded-xl transition-all flex items-center gap-1 ${
                                  isSuspended 
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                                    : "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                                }`}
                              >
                                <UserX className="w-3.5 h-3.5" />
                                Deactivate
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 2: PAYMENT VERIFICATION QUEUE (RECEIPT OCR, VERIFY & REJECT) */}
      {/* ========================================================================= */}
      {activeView === 'verification' && (
        <div className="space-y-6">
          {/* Filter Sub-Tabs for Verification */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
            {[
              { key: 'ALL', label: 'All Transactions' },
              { key: 'Under Verification', label: '⏳ Under Verification Queue' },
              { key: 'Verified', label: '✓ Verified Payments' },
              { key: 'Rejected', label: '✕ Rejected / Failed' },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setVerifFilter(t.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                  verifFilter === t.key 
                    ? "bg-brand-orange text-white shadow-sm" 
                    : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-3.5">Txn Ref ID</th>
                  <th className="p-3.5">Player & Parent</th>
                  <th className="p-3.5">Team</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Method</th>
                  <th className="p-3.5">Date & Time</th>
                  <th className="p-3.5">Verification Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      No payment transactions found matching filter.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map(pay => {
                    const isTarget = !!txnTarget && (
                      pay.transactionId.toLowerCase() === txnTarget.toLowerCase() ||
                      pay.id.toLowerCase() === txnTarget.toLowerCase()
                    );

                    return (
                      <tr 
                        key={pay.id} 
                        className={`transition-colors ${
                          isTarget 
                            ? "bg-amber-50/90 border-2 border-brand-orange shadow-md font-bold" 
                            : "hover:bg-slate-50/80"
                        }`}
                      >
                        <td className="p-3.5 font-mono font-bold text-brand-orange cursor-pointer" onClick={() => setSelectedPayment(pay)}>
                          <div className="flex items-center gap-1.5">
                            <span>{pay.transactionId}</span>
                            {isTarget && (
                              <span className="px-2 py-0.5 bg-brand-orange text-white font-black text-[9px] rounded-full uppercase shadow animate-pulse">
                                🎯 NOTIFICATION TARGET
                              </span>
                            )}
                          </div>
                        </td>
                      <td className="p-3.5 font-bold text-slate-900 cursor-pointer" onClick={() => setSelectedPayment(pay)}>
                        <div>{pay.playerName}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{pay.parentName} ({pay.parentPhone})</div>
                      </td>
                      <td className="p-3.5">{tContent(pay.teamName)}</td>
                      <td className="p-3.5 font-black text-slate-900">{pay.amount.toLocaleString()} ETB</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded">
                          {pay.paymentMethod}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500">
                        {new Date(pay.paymentDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="p-3.5 font-bold">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                          pay.verificationStatus === 'Verified' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                          pay.verificationStatus === 'Under Verification' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-red-50 text-red-600'
                        }`}>
                          {tContent(pay.verificationStatus)}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedPayment(pay)}
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:border-brand-orange text-brand-orange font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect Receipt
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
      )}

      {/* ========================================================================= */}
      {/* PLAYER PROFILE INSPECTOR MODAL (OPENED WHEN CLICKING PLAYER NAME) */}
      {/* ========================================================================= */}
      {profilePlayer && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            
            {/* Header with Photo & Basic Info */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="flex items-center gap-4">
                <img 
                  src={profilePlayer.photoUrl} 
                  alt={profilePlayer.fullName} 
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-orange shadow-md"
                />
                <div>
                  <span className="text-xs font-mono font-bold text-brand-orange">ID: {profilePlayer.id}</span>
                  <h2 className="text-2xl font-black text-slate-900">{profilePlayer.fullName}</h2>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">
                    {profilePlayer.teamName} &bull; #{profilePlayer.jerseyNumber} &bull; {profilePlayer.position}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setProfilePlayer(null)}
                className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Internal Tabs Header */}
            <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
              <button
                onClick={() => setProfileTab('OVERVIEW')}
                className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all ${
                  profileTab === 'OVERVIEW' ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Overview & Contact
              </button>
              <button
                onClick={() => setProfileTab('FEES')}
                className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all ${
                  profileTab === 'FEES' ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Fee Schedule & Financial Dues
              </button>
              <button
                onClick={() => setProfileTab('STATS')}
                className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all ${
                  profileTab === 'STATS' ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Football Stats & Rating
              </button>
            </div>

            {/* TAB 1: OVERVIEW & CONTACT */}
            {profileTab === 'OVERVIEW' && (
              <div className="grid md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                  <h4 className="font-extrabold text-sm text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                    <UserIcon className="w-4 h-4 text-brand-orange" /> Personal Details
                  </h4>
                  <div><span className="text-slate-400 block">Full Name:</span> <strong className="text-slate-900">{profilePlayer.fullName}</strong></div>
                  <div><span className="text-slate-400 block">Date of Birth / Age:</span> <strong className="text-slate-900">{profilePlayer.dateOfBirth} ({profilePlayer.age} yrs)</strong></div>
                  <div><span className="text-slate-400 block">Gender & Nationality:</span> <strong className="text-slate-900">{profilePlayer.gender} &bull; {profilePlayer.nationality}</strong></div>
                  <div><span className="text-slate-400 block">Place of Birth:</span> <strong className="text-slate-900">{profilePlayer.placeOfBirth}</strong></div>
                  <div><span className="text-slate-400 block">School Name:</span> <strong className="text-slate-900">{profilePlayer.schoolName || 'N/A'}</strong></div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                  <h4 className="font-extrabold text-sm text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-brand-orange" /> Parent & Guardian Contact
                  </h4>
                  <div><span className="text-slate-400 block">Guardian Name:</span> <strong className="text-slate-900">{profilePlayer.parentInfo?.fullName || 'N/A'}</strong></div>
                  <div><span className="text-slate-400 block">Relationship:</span> <strong className="text-slate-900">{profilePlayer.parentInfo?.relationship || 'Parent'}</strong></div>
                  <div><span className="text-slate-400 block">Phone Number:</span> <strong className="text-brand-orange font-mono text-sm">{profilePlayer.parentInfo?.phone || profilePlayer.phone}</strong></div>
                  <div><span className="text-slate-400 block">Email Address:</span> <strong className="text-slate-900">{profilePlayer.parentInfo?.email || 'N/A'}</strong></div>
                  <div><span className="text-slate-400 block">Residence Address:</span> <strong className="text-slate-900">{profilePlayer.address}</strong></div>
                </div>
              </div>
            )}

            {/* TAB 2: FEE SCHEDULE & FINANCIAL DUES */}
            {profileTab === 'FEES' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <span className="text-[10px] font-bold text-emerald-600 block">Total Fees Paid</span>
                    <strong className="text-lg font-black text-emerald-700">ETB {(profilePlayer.feeSchedule?.totalPaid || 9500).toLocaleString()}</strong>
                  </div>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <span className="text-[10px] font-bold text-red-600 block">Current Balance Dues</span>
                    <strong className="text-lg font-black text-red-700">ETB {(profilePlayer.feeSchedule?.currentBalance || 1500).toLocaleString()}</strong>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <span className="text-[10px] font-bold text-blue-600 block">Monthly Rate</span>
                    <strong className="text-lg font-black text-blue-700">ETB {(profilePlayer.feeSchedule?.monthlyFee || 1500).toLocaleString()}</strong>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-slate-700">
                  <div><strong>Registration Fee:</strong> ETB {(profilePlayer.feeSchedule?.registrationFee || 3500).toLocaleString()}</div>
                  <div><strong>Uniform Fee:</strong> ETB {(profilePlayer.feeSchedule?.uniformFee || 1200).toLocaleString()}</div>
                  <div><strong>Next Payment Due Date:</strong> {profilePlayer.feeSchedule?.nextPaymentDueDate || '2026-08-01'}</div>
                  <div><strong>Overdue Status:</strong> {getOverdueDays(profilePlayer.feeSchedule?.nextPaymentDueDate)} Days Overdue</div>
                </div>
              </div>
            )}

            {/* TAB 3: FOOTBALL STATS */}
            {profileTab === 'STATS' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-brand-orange text-white rounded-xl shadow-sm">
                    <span className="text-[10px] font-bold text-white/80 uppercase block">Overall Rating</span>
                    <strong className="text-2xl font-black text-white">{profilePlayer.statistics?.overallRating || 75}</strong>
                  </div>
                  <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Goals Scored</span>
                    <strong className="text-2xl font-black text-slate-900">{profilePlayer.statistics?.goals || 0}</strong>
                  </div>
                  <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Assists</span>
                    <strong className="text-2xl font-black text-slate-900">{profilePlayer.statistics?.assists || 0}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center font-bold">
                  <div><span className="text-slate-400 text-[10px] block">PACE</span> {profilePlayer.statistics?.pace || 75}</div>
                  <div><span className="text-slate-400 text-[10px] block">SHOOTING</span> {profilePlayer.statistics?.shooting || 70}</div>
                  <div><span className="text-slate-400 text-[10px] block">PASSING</span> {profilePlayer.statistics?.passing || 70}</div>
                  <div><span className="text-slate-400 text-[10px] block">DRIBBLING</span> {profilePlayer.statistics?.dribbling || 72}</div>
                  <div><span className="text-slate-400 text-[10px] block">DEFENDING</span> {profilePlayer.statistics?.defending || 50}</div>
                  <div><span className="text-slate-400 text-[10px] block">PHYSICAL</span> {profilePlayer.statistics?.physical || 68}</div>
                </div>
              </div>
            )}

            {/* Footer Action to open in full players roster page */}
            <div className="flex justify-between items-center border-t border-slate-100 pt-4">
              <button
                onClick={() => {
                  setProfilePlayer(null);
                  router.push(`/admin/players?search=${profilePlayer.id}`);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                Open Full Roster Profile Page ↗
              </button>

              <button
                onClick={() => setProfilePlayer(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: SEND NOTIFICATION MODAL */}
      {/* ========================================================================= */}
      {notifPlayer && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Send Payment Notification</h3>
                  <p className="text-xs text-slate-500">Player: {notifPlayer.fullName} ({notifPlayer.id})</p>
                </div>
              </div>
              <button onClick={() => setNotifPlayer(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Recipient Parent Phone</label>
                <input 
                  type="text" 
                  disabled
                  value={`${notifPlayer.parentInfo?.fullName || 'Parent'} (${notifPlayer.parentInfo?.phone || notifPlayer.phone})`}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 font-mono text-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notification Message (SMS & In-App)</label>
                <textarea 
                  rows={4}
                  value={notifMessage}
                  onChange={e => setNotifMessage(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-brand-orange focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button 
                onClick={() => setNotifPlayer(null)} 
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendNotificationSubmit}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" /> Send Notification SMS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: SEND WARNING MODAL */}
      {/* ========================================================================= */}
      {warningPlayer && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-red-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-red-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-red-600">Send Overdue Warning Notice</h3>
                  <p className="text-xs text-slate-500">Player: {warningPlayer.fullName} ({warningPlayer.id})</p>
                </div>
              </div>
              <button onClick={() => setWarningPlayer(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              Official warning notification regarding non-payment of academy dues.
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Parent Contact</label>
                <input 
                  type="text" 
                  disabled
                  value={`${warningPlayer.parentInfo?.fullName || 'Parent'} (${warningPlayer.parentInfo?.phone || warningPlayer.phone})`}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 font-mono text-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Urgent Warning Text</label>
                <textarea 
                  rows={4}
                  value={warningMessage}
                  onChange={e => setWarningMessage(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-red-200 text-slate-900 focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button 
                onClick={() => setWarningPlayer(null)} 
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendWarningSubmit}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
              >
                <AlertTriangle className="w-4 h-4" /> Dispatch Urgent Warning
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: DEACTIVATE PLAYER CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {deactivatePlayer && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                <UserX className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Deactivate Player Profile?</h3>
                <p className="text-xs text-slate-500">Suspend membership due to non-payment</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2 text-slate-700">
              <div><strong>Player Name:</strong> {deactivatePlayer.fullName}</div>
              <div><strong>Player ID:</strong> {deactivatePlayer.id}</div>
              <div><strong>Team:</strong> {deactivatePlayer.teamName}</div>
              <div><strong>Monthly Dues:</strong> ETB {(deactivatePlayer.feeSchedule?.monthlyFee || 1500).toLocaleString()}</div>
              <div><strong>Overdue Days:</strong> {getOverdueDays(deactivatePlayer.feeSchedule?.nextPaymentDueDate)} Days</div>
            </div>

            <p className="text-xs text-red-600 font-semibold leading-relaxed">
              ⚠️ Deactivating this player will change their account status to <strong>SUSPENDED</strong>. The player will be restricted from squad matches and official academy activities until dues are paid.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button 
                onClick={() => setDeactivatePlayer(null)} 
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeactivateSubmit}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
              >
                <UserX className="w-4 h-4" /> Confirm Deactivation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: TRANSACTION VERIFICATION INSPECTION MODAL */}
      {/* ========================================================================= */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="px-2.5 py-1 bg-brand-orange/10 text-brand-orange font-mono font-bold text-xs rounded-lg">
                  TXN: {selectedPayment.transactionId}
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  Payment Proof Inspection
                </h2>
                <p className="text-xs text-slate-500">
                  Type: {selectedPayment.type} &bull; Submitted: {new Date(selectedPayment.paymentDate).toLocaleString()}
                </p>
              </div>

              <button 
                onClick={() => setSelectedPayment(null)}
                className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-xs text-slate-700">
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                  <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-200 pb-2">
                    Payment Metadata
                  </h3>
                  <div>
                    <span className="text-slate-400 block">Payment Method</span>
                    <strong className="text-slate-900 text-sm">{selectedPayment.paymentMethod}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Transaction Reference ID</span>
                    <strong className="text-brand-orange font-mono text-sm">{selectedPayment.transactionId}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Total Paid Amount</span>
                    <strong className="text-emerald-600 text-base font-black">{selectedPayment.amount.toLocaleString()} ETB</strong>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                  <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-200 pb-2">
                    Player & Payer Information
                  </h3>
                  <div>
                    <span className="text-slate-400 block">Player Name</span>
                    <strong className="text-slate-900">{selectedPayment.playerName} ({selectedPayment.teamName})</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Parent / Payer Name</span>
                    <strong className="text-slate-900">{selectedPayment.parentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Parent Phone</span>
                    <strong className="text-brand-orange">{selectedPayment.parentPhone}</strong>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 flex flex-col h-full">
                  <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-200 pb-2">
                    Receipt Screenshot Proof
                  </h3>
                  
                  <div className="flex-1 bg-slate-100 rounded-xl overflow-hidden min-h-[220px] flex items-center justify-center relative border border-slate-200">
                    {selectedPayment.screenshotUrl ? (
                      <img 
                        src={selectedPayment.screenshotUrl} 
                        alt="Payment Proof Receipt" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-slate-400 text-center p-6 space-y-2">
                        <CreditCard className="w-8 h-8 mx-auto text-slate-500" />
                        <p>No screenshot attached</p>
                      </div>
                    )}
                  </div>

                  {selectedPayment.verificationStatus === 'Under Verification' && (
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleVerifyTransaction(selectedPayment.id, 'Verified')}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve Payment
                      </button>
                      <button
                        onClick={() => handleVerifyTransaction(selectedPayment.id, 'Rejected')}
                        className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaymentsManagementPage() {
  return (
    <Suspense fallback={<div className="text-center text-slate-400 py-20">Loading payments...</div>}>
      <PaymentsContent />
    </Suspense>
  );
}

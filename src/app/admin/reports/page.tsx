"use client";

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, FileSpreadsheet, Printer, Download, Filter, Calendar, Users, Shield, CreditCard, ClipboardList, Activity, UserCheck, AlertTriangle
} from 'lucide-react';
import { Player, Team, Registration, PaymentTransaction } from '@/lib/types';
import { exportPlayersToCSV, downloadCSV } from '@/lib/excel-exporter';
import { useLanguage } from '@/context/LanguageContext';

export default function ReportsModulePage() {
  const { t } = useLanguage();

  const [activeReport, setActiveReport] = useState<
    'PLAYER' | 'TEAM' | 'REGISTRATION' | 'PAYMENT' | 'OVERDUE' | 'ATTENDANCE' | 'FINANCIAL' | 'PLAYER_STATS'
  >('PLAYER');

  const [startDate, setStartDate] = useState<string>('2026-01-01');
  const [endDate, setEndDate] = useState<string>('2026-08-30');
  const [selectedTeam, setSelectedTeam] = useState<string>('ALL');

  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [pRes, tRes, rRes, payRes] = await Promise.all([
          fetch('/api/players').then(r => r.json()),
          fetch('/api/teams').then(r => r.json()),
          fetch('/api/registrations').then(r => r.json()),
          fetch('/api/payments').then(r => r.json())
        ]);
        if (pRes.success) setPlayers(pRes.data);
        if (tRes.success) setTeams(tRes.data);
        if (rRes.success) setRegistrations(rRes.data);
        if (payRes.success) setPayments(payRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredPlayers = players.filter(p => selectedTeam === 'ALL' || p.teamId === selectedTeam);
  const filteredRegs = registrations.filter(r => selectedTeam === 'ALL' || r.teamId === selectedTeam);
  const filteredPayments = payments.filter(p => {
    if (selectedTeam !== 'ALL' && p.teamId !== selectedTeam) return false;
    if (p.paymentDate) {
      const d = new Date(p.paymentDate);
      return d >= new Date(startDate) && d <= new Date(endDate);
    }
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (activeReport === 'PLAYER' || activeReport === 'PLAYER_STATS') {
      const csv = exportPlayersToCSV(filteredPlayers, selectedTeam === 'ALL' ? 'All Squads' : selectedTeam);
      downloadCSV(csv, `Bulbula_Amen_FC_${activeReport}_Report.csv`);
    } else {
      let headers = "ID,Name,Team,Status,Amount,Date\n";
      let rows = filteredPayments.map(p => `${p.id},"${p.playerName}","${p.teamName}",${p.verificationStatus},${p.amount},${p.paymentDate}`).join("\n");
      downloadCSV(headers + rows, `Bulbula_Amen_FC_${activeReport}_Report.csv`);
    }
  };

  const reportTypes = [
    { id: 'PLAYER', name: 'Player Report', icon: Users },
    { id: 'TEAM', name: 'Team Report', icon: Shield },
    { id: 'REGISTRATION', name: 'Registration Report', icon: ClipboardList },
    { id: 'PAYMENT', name: 'Payment Report', icon: CreditCard },
    { id: 'OVERDUE', name: 'Overdue Payment Report', icon: AlertTriangle },
    { id: 'ATTENDANCE', name: 'Attendance Report', icon: UserCheck },
    { id: 'FINANCIAL', name: 'Financial Report', icon: BarChart3 },
    { id: 'PLAYER_STATS', name: 'Player Statistics Report', icon: Activity },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs print:hidden">
        <div>
          <span className="text-xs font-black uppercase text-brand-orange tracking-widest block">
            ANALYTICS & REPORTS
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Comprehensive Reports Center</h1>
          <p className="text-slate-500 text-xs mt-1">
            Generate, filter, print, and export official club reports across operations, rosters, and finances.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export CSV / Excel
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Print Report
          </button>
        </div>
      </div>

      {/* REPORT TYPE SELECTOR & FILTER BAR */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-xs print:hidden">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {reportTypes.map(rep => {
            const Icon = rep.icon;
            const isActive = activeReport === rep.id;
            return (
              <button
                key={rep.id}
                onClick={() => setActiveReport(rep.id as any)}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                  isActive 
                    ? "bg-brand-orange text-white border-brand-orange shadow-xs font-extrabold" 
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200 font-bold"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] leading-tight block truncate">{rep.name}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-orange" />
            <span className="font-extrabold text-slate-700">Team Filter:</span>
            <select
              value={selectedTeam}
              onChange={e => setSelectedTeam(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
            >
              <option value="ALL">All Squads & Teams</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 font-bold text-slate-700">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Date Range:</span>
            <input 
              type="date" value={startDate} onChange={e => setStartDate(e.target.value)} 
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            />
            <span>to</span>
            <input 
              type="date" value={endDate} onChange={e => setEndDate(e.target.value)} 
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            />
          </div>
        </div>
      </div>

      {/* REPORT DISPLAY CANVAS */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-200 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase">BULBULA AMEN FOOTBALL CLUB</h2>
            <h3 className="text-sm font-extrabold text-brand-orange uppercase tracking-wider mt-0.5">
              OFFICIAL REPORT: {activeReport.replace('_', ' ')}
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-semibold">
              Period: {startDate} to {endDate} &bull; Scope: {selectedTeam === 'ALL' ? 'All Squads' : teams.find(t => t.id === selectedTeam)?.name}
            </p>
          </div>
          <div className="text-right text-xs text-slate-400 font-mono">
            <div>Generated: {new Date().toLocaleString()}</div>
            <div>Addis Ababa, Ethiopia</div>
          </div>
        </div>

        {(activeReport === 'PLAYER' || activeReport === 'PLAYER_STATS') && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase">
                <tr>
                  <th className="p-3">Player ID</th>
                  <th className="p-3">Full Name</th>
                  <th className="p-3">Team</th>
                  <th className="p-3">Age</th>
                  <th className="p-3">Position</th>
                  <th className="p-3">Parent Phone</th>
                  <th className="p-3">Overall Rating</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                {filteredPlayers.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-brand-orange">{p.id}</td>
                    <td className="p-3 font-black text-slate-900">{p.fullName}</td>
                    <td className="p-3 font-bold">{p.teamName}</td>
                    <td className="p-3">{p.age} yrs</td>
                    <td className="p-3">{p.position} (#{p.jerseyNumber})</td>
                    <td className="p-3 font-mono">{p.parentInfo?.phone || p.phone}</td>
                    <td className="p-3 font-black text-emerald-600">{p.statistics?.overallRating || 80} OVR</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(activeReport === 'PAYMENT' || activeReport === 'FINANCIAL' || activeReport === 'OVERDUE') && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-500 font-bold block">Total Collections</span>
                <span className="text-xl font-black text-emerald-600">
                  {filteredPayments.filter(p => p.verificationStatus === 'Verified').reduce((sum, p) => sum + p.amount, 0).toLocaleString()} ETB
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-500 font-bold block">Verified Transactions</span>
                <span className="text-xl font-black text-brand-orange">
                  {filteredPayments.filter(p => p.verificationStatus === 'Verified').length} Receipts
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-500 font-bold block">Overdue Count</span>
                <span className="text-xl font-black text-red-500">
                  {players.filter(p => p.paymentStatus === 'OVERDUE').length} Members
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase">
                  <tr>
                    <th className="p-3">Txn ID</th>
                    <th className="p-3">Player Name</th>
                    <th className="p-3">Team</th>
                    <th className="p-3">Payment Method</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                  {filteredPayments.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-brand-orange">{p.transactionId}</td>
                      <td className="p-3 font-black text-slate-900">{p.playerName}</td>
                      <td className="p-3 font-bold">{p.teamName}</td>
                      <td className="p-3 font-semibold">{p.paymentMethod}</td>
                      <td className="p-3 font-black text-slate-900">{p.amount.toLocaleString()} ETB</td>
                      <td className="p-3 font-mono">{p.paymentDate}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.verificationStatus === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {p.verificationStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeReport === 'TEAM' && (
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            {teams.map(t => (
              <div key={t.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <h4 className="font-extrabold text-sm text-slate-900">{t.name}</h4>
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 font-bold rounded-full">{t.activePlayerCount} Players</span>
                </div>
                <div className="space-y-1 text-slate-600 font-semibold">
                  <div>Age Range: <strong className="text-slate-900">{t.ageRange}</strong></div>
                  <div>Head Coach: <strong className="text-brand-orange">{t.coachName}</strong></div>
                  <div>Training Schedule: <strong className="text-slate-900">{t.trainingDays} ({t.trainingTime})</strong></div>
                  <div>Monthly Fee: <strong className="text-slate-900">{t.monthlyFee} ETB</strong></div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-8 border-t border-slate-200 flex justify-between items-center text-xs text-slate-400 font-bold">
          <div>Bulbula Amen F.C. Administration & Operations Center</div>
          <div>Page 1 of 1</div>
        </div>
      </div>
    </div>
  );
}

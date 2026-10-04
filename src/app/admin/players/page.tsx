"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Users, Search, FileSpreadsheet, Plus, Edit2, Eye, 
  MoreVertical, LayoutGrid, Table as TableIcon, Lock, Unlock, X, Shield, 
  DollarSign, Activity, ChevronLeft, ChevronRight, CheckCircle2, Upload, FileText, Download, Filter, AlertCircle
} from 'lucide-react';
import { Player, Team, User } from '@/lib/types';
import { exportPlayersToCSV, downloadCSV } from '@/lib/excel-exporter';
import FifaPlayerCard from '@/components/FifaPlayerCard';
import { useLanguage } from '@/context/LanguageContext';

function PlayersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, language } = useLanguage();

  const selectedTeamFilter = searchParams.get('teamId') || 'ALL';
  const initialSearch = searchParams.get('search') || '';

  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  // View state: TABLE or CARD
  const [viewMode, setViewMode] = useState<'TABLE' | 'CARD'>('TABLE');

  // Filters & Search
  const [teamFilter, setTeamFilter] = useState(selectedTeamFilter);
  const [genderFilter, setGenderFilter] = useState('ALL');
  const [positionFilter, setPositionFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // Sorting & Pagination
  const [sortField, setSortField] = useState<'fullName' | 'id' | 'teamName' | 'age' | 'jerseyNumber'>('fullName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Bulk Selection
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);

  // Profile Modal state
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [modalTab, setModalTab] = useState<'PROFILE' | 'DETAILS' | 'FOOTBALL' | 'PARENT' | 'DOCUMENTS' | 'PAYMENTS' | 'ATTENDANCE' | 'HISTORY'>('PROFILE');

  // Multi-step Add / Edit Player Wizard State
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [wizardEditingPlayer, setWizardEditingPlayer] = useState<Player | null>(null);

  // Wizard Form Fields
  const [wizardData, setWizardData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '2013-05-10',
    gender: 'Male' as 'Male' | 'Female',
    nationality: 'Ethiopian',
    placeOfBirth: 'Addis Ababa',
    phone: '+251911400101',
    address: 'Bole Sub-City, Addis Ababa',
    photoUrl: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=400&auto=format&fit=crop&q=80',
    parentFullName: 'Abebe Desta',
    parentRelationship: 'Father',
    parentPhone: '+251911223344',
    parentEmail: 'abebe.desta@gmail.com',
    parentNationalId: 'ETH-ID-992831',
    parentResidenceId: 'AA-RES-44812',
    teamId: 'TEAM-U13',
    position: 'Central Midfielder',
    jerseyNumber: 10,
    preferredFoot: 'Right' as 'Right' | 'Left' | 'Both',
    overallRating: 82,
    pace: 84,
    shooting: 78,
    passing: 85,
    dribbling: 83,
    defending: 72,
    physical: 76,
    birthCertNumber: 'BC-2013-8812',
    birthCertDocUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=500&auto=format&fit=crop&q=80',
    parentDocUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&auto=format&fit=crop&q=80',
    otherDocUrl: '',
    registrationFee: 3500,
    monthlyFee: 1500,
    uniformFee: 1200,
    paymentStatus: 'VERIFIED' as 'VERIFIED' | 'DUE_SOON' | 'OVERDUE',
    termsAccepted: true
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const currentUser: User = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('auth_user') || '{"role":"ADMIN"}') 
    : { role: 'ADMIN' } as User;

  useEffect(() => {
    async function loadData() {
      try {
        const [pRes, tRes] = await Promise.all([
          fetch('/api/players').then(r => r.json()),
          fetch('/api/teams').then(r => r.json())
        ]);
        if (pRes.success) {
          setPlayers(pRes.data);
          if (initialSearch) {
            const matched = pRes.data.find((p: Player) => 
              p.id.toLowerCase() === initialSearch.toLowerCase() || 
              p.fullName.toLowerCase().includes(initialSearch.toLowerCase())
            );
            if (matched) setSelectedPlayer(matched);
          }
        }
        if (tRes.success) setTeams(tRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [initialSearch]);

  const handleFilterTeam = (tid: string) => {
    setTeamFilter(tid);
    setCurrentPage(1);
    if (tid === 'ALL') {
      router.push('/admin/players');
    } else {
      router.push(`/admin/players?teamId=${tid}`);
    }
  };

  const filteredPlayers = players.filter(p => {
    if (teamFilter !== 'ALL' && p.teamId !== teamFilter) return false;
    if (genderFilter !== 'ALL' && p.gender !== genderFilter) return false;
    if (positionFilter !== 'ALL' && p.position !== positionFilter) return false;
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    if (paymentStatusFilter !== 'ALL' && p.paymentStatus !== paymentStatusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = p.fullName.toLowerCase().includes(q);
      const matchId = p.id.toLowerCase().includes(q);
      const matchPhone = p.phone?.includes(q);
      const matchParent = p.parentInfo?.fullName?.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchPhone && !matchParent) return false;
    }
    return true;
  });

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    let aVal = (a as any)[sortField] || '';
    let bVal = (b as any)[sortField] || '';
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedPlayers.length / itemsPerPage) || 1;
  const paginatedPlayers = sortedPlayers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const activeTeamObj = teams.find(t => t.id === teamFilter);

  const handleExportExcel = () => {
    const teamName = activeTeamObj ? activeTeamObj.name : "All Bulbula Amen FC";
    const csvData = exportPlayersToCSV(filteredPlayers, teamName);
    downloadCSV(csvData, `Bulbula_Amen_FC_${teamName.replace(/\s+/g, '_')}_Roster.csv`);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPlayerIds(paginatedPlayers.map(p => p.id));
    } else {
      setSelectedPlayerIds([]);
    }
  };

  const handleToggleSelectPlayer = (id: string) => {
    setSelectedPlayerIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const openAddWizard = () => {
    setWizardEditingPlayer(null);
    setWizardStep(1);
    setWizardData({
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '2013-05-10',
      gender: 'Male',
      nationality: 'Ethiopian',
      placeOfBirth: 'Addis Ababa',
      phone: '+251911400101',
      address: 'Bole Sub-City, Addis Ababa',
      photoUrl: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=400&auto=format&fit=crop&q=80',
      parentFullName: 'Abebe Desta',
      parentRelationship: 'Father',
      parentPhone: '+251911223344',
      parentEmail: 'abebe.desta@gmail.com',
      parentNationalId: 'ETH-ID-992831',
      parentResidenceId: 'AA-RES-44812',
      teamId: 'TEAM-U13',
      position: 'Central Midfielder',
      jerseyNumber: 10,
      preferredFoot: 'Right',
      overallRating: 82,
      pace: 84,
      shooting: 78,
      passing: 85,
      dribbling: 83,
      defending: 72,
      physical: 76,
      birthCertNumber: 'BC-2013-8812',
      birthCertDocUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=500&auto=format&fit=crop&q=80',
      parentDocUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&auto=format&fit=crop&q=80',
      otherDocUrl: '',
      registrationFee: 3500,
      monthlyFee: 1500,
      uniformFee: 1200,
      paymentStatus: 'VERIFIED',
      termsAccepted: true
    });
    setValidationErrors({});
    setWizardOpen(true);
  };

  const openEditWizard = (player: Player) => {
    setWizardEditingPlayer(player);
    setWizardStep(1);
    setWizardData({
      firstName: player.firstName || player.fullName.split(' ')[0] || '',
      middleName: player.middleName || player.fullName.split(' ')[1] || '',
      lastName: player.lastName || player.fullName.split(' ')[2] || '',
      dateOfBirth: player.dateOfBirth || '2013-05-10',
      gender: player.gender || 'Male',
      nationality: player.nationality || 'Ethiopian',
      placeOfBirth: player.placeOfBirth || 'Addis Ababa',
      phone: player.phone || '+251911400101',
      address: player.address || 'Bole Sub-City, Addis Ababa',
      photoUrl: player.photoUrl || '',
      parentFullName: player.parentInfo?.fullName || 'Parent Full Name',
      parentRelationship: player.parentInfo?.relationship || 'Parent',
      parentPhone: player.parentInfo?.phone || '+251911400101',
      parentEmail: player.parentInfo?.email || 'parent@gmail.com',
      parentNationalId: player.parentInfo?.nationalIdNumber || 'ETH-ID-XXXX',
      parentResidenceId: player.parentInfo?.residenceIdNumber || 'AA-RES-XXXX',
      teamId: player.teamId || 'TEAM-U13',
      position: player.position || 'Midfielder',
      jerseyNumber: player.jerseyNumber || 10,
      preferredFoot: player.preferredFoot || 'Right',
      overallRating: player.statistics?.overallRating || 80,
      pace: player.statistics?.pace || 80,
      shooting: player.statistics?.shooting || 75,
      passing: player.statistics?.passing || 80,
      dribbling: player.statistics?.dribbling || 80,
      defending: player.statistics?.defending || 70,
      physical: player.statistics?.physical || 75,
      birthCertNumber: player.documents?.birthCertificateNumber || 'BC-001',
      birthCertDocUrl: player.documents?.birthCertificateDocUrl || '',
      parentDocUrl: player.documents?.parentNationalIdDocUrl || '',
      otherDocUrl: '',
      registrationFee: player.feeSchedule?.registrationFee || 3500,
      monthlyFee: player.feeSchedule?.monthlyFee || 1500,
      uniformFee: player.feeSchedule?.uniformFee || 1200,
      paymentStatus: (player.paymentStatus as any) || 'VERIFIED',
      termsAccepted: true
    });
    setValidationErrors({});
    setWizardOpen(true);
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    if (step === 1) {
      if (!wizardData.firstName.trim()) errors.firstName = 'First name is required';
      if (!wizardData.lastName.trim()) errors.lastName = 'Last name is required';
    } else if (step === 2) {
      if (!wizardData.parentFullName.trim()) errors.parentFullName = 'Parent full name is required';
      if (!wizardData.parentPhone.trim()) errors.parentPhone = 'Parent phone is required';
    } else if (step === 3) {
      if (!wizardData.teamId) errors.teamId = 'Select a valid team squad';
      if (!wizardData.position.trim()) errors.position = 'Position is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(wizardStep)) {
      setWizardStep(prev => Math.min(6, prev + 1));
    }
  };

  const handlePrevStep = () => {
    setWizardStep(prev => Math.max(1, prev - 1));
  };

  const handleSaveWizardPlayer = async () => {
    const selectedTeam = teams.find(t => t.id === wizardData.teamId);
    const fullName = `${wizardData.firstName} ${wizardData.middleName} ${wizardData.lastName}`.trim();

    const payload = {
      ...(wizardEditingPlayer ? { id: wizardEditingPlayer.id } : {}),
      firstName: wizardData.firstName,
      middleName: wizardData.middleName,
      lastName: wizardData.lastName,
      fullName,
      dateOfBirth: wizardData.dateOfBirth,
      gender: wizardData.gender,
      nationality: wizardData.nationality,
      placeOfBirth: wizardData.placeOfBirth,
      phone: wizardData.phone,
      address: wizardData.address,
      photoUrl: wizardData.photoUrl,
      teamId: wizardData.teamId,
      teamName: selectedTeam?.name || 'Squad',
      position: wizardData.position,
      jerseyNumber: Number(wizardData.jerseyNumber),
      preferredFoot: wizardData.preferredFoot,
      paymentStatus: wizardData.paymentStatus,
      parentInfo: {
        fullName: wizardData.parentFullName,
        relationship: wizardData.parentRelationship,
        phone: wizardData.parentPhone,
        email: wizardData.parentEmail,
        nationalIdNumber: wizardData.parentNationalId,
        residenceIdNumber: wizardData.parentResidenceId,
      },
      statistics: {
        overallRating: Number(wizardData.overallRating),
        pace: Number(wizardData.pace),
        shooting: Number(wizardData.shooting),
        passing: Number(wizardData.passing),
        dribbling: Number(wizardData.dribbling),
        defending: Number(wizardData.defending),
        physical: Number(wizardData.physical),
      },
      documents: {
        birthCertificateNumber: wizardData.birthCertNumber,
        birthCertificateDocUrl: wizardData.birthCertDocUrl,
        parentNationalIdDocUrl: wizardData.parentDocUrl,
      },
      feeSchedule: {
        registrationFee: Number(wizardData.registrationFee),
        monthlyFee: Number(wizardData.monthlyFee),
        uniformFee: Number(wizardData.uniformFee),
      }
    };

    try {
      const method = wizardEditingPlayer ? 'PUT' : 'POST';
      const res = await fetch('/api/players', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(r => r.json());

      if (res.success) {
        if (wizardEditingPlayer) {
          setPlayers(players.map(p => p.id === res.data.id ? res.data : p));
        } else {
          setPlayers([res.data, ...players]);
        }
        setWizardOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-black uppercase text-brand-orange tracking-widest block">
            PLAYERS MODULE
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">
            {activeTeamObj ? `${activeTeamObj.name} Roster` : "All Players Roster"}
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Manage player profiles, teams, statistics and membership.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('TABLE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                viewMode === 'TABLE' ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" /> Table
            </button>
            <button
              onClick={() => setViewMode('CARD')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                viewMode === 'CARD' ? "bg-brand-orange text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Grid Cards
            </button>
          </div>

          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export Excel
          </button>

          <button
            onClick={openAddWizard}
            className="px-4 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> + Add Player
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs text-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search player name, ID, phone..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-brand-orange"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={teamFilter}
              onChange={e => handleFilterTeam(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-brand-orange"
            >
              <option value="ALL">All Teams</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>

            <select
              value={paymentStatusFilter}
              onChange={e => setPaymentStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-brand-orange"
            >
              <option value="ALL">All Payment Statuses</option>
              <option value="VERIFIED">PAID / VERIFIED</option>
              <option value="DUE_SOON">DUE SOON</option>
              <option value="OVERDUE">OVERDUE</option>
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-brand-orange"
            >
              <option value="ALL">All Player Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="SUSPENDED">SUSPENDED</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === 'TABLE' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase">
                <tr>
                  <th className="p-3.5 w-10 text-center">
                    <input 
                      type="checkbox" 
                      onChange={e => handleSelectAll(e.target.checked)}
                      checked={paginatedPlayers.length > 0 && selectedPlayerIds.length === paginatedPlayers.length}
                    />
                  </th>
                  <th className="p-3.5 cursor-pointer hover:text-slate-900" onClick={() => { setSortField('fullName'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>PLAYER</th>
                  <th className="p-3.5 cursor-pointer hover:text-slate-900" onClick={() => { setSortField('id'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>PLAYER ID</th>
                  <th className="p-3.5 cursor-pointer hover:text-slate-900" onClick={() => { setSortField('teamName'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>TEAM</th>
                  <th className="p-3.5 cursor-pointer hover:text-slate-900" onClick={() => { setSortField('age'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>AGE</th>
                  <th className="p-3.5">POSITION</th>
                  <th className="p-3.5">JERSEY</th>
                  <th className="p-3.5">PARENT/GUARDIAN</th>
                  <th className="p-3.5">PAYMENT STATUS</th>
                  <th className="p-3.5">PLAYER STATUS</th>
                  <th className="p-3.5 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {paginatedPlayers.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedPlayerIds.includes(p.id)}
                        onChange={() => handleToggleSelectPlayer(p.id)}
                      />
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img 
                          src={p.photoUrl || "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=120&auto=format&fit=crop&q=80"} 
                          alt={p.fullName} 
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 flex-shrink-0" 
                        />
                        <span className="font-extrabold text-slate-900">{p.fullName}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-brand-orange font-bold">{p.id}</td>
                    <td className="p-3.5 font-bold text-slate-700">{p.teamName}</td>
                    <td className="p-3.5 font-semibold text-slate-700">{p.age} yrs</td>
                    <td className="p-3.5 font-semibold text-slate-700">{p.position}</td>
                    <td className="p-3.5 font-black text-slate-900">#{p.jerseyNumber}</td>
                    <td className="p-3.5 text-slate-600 font-semibold">{p.parentInfo?.fullName || 'N/A'} ({p.parentInfo?.phone || p.phone})</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] uppercase border ${
                        p.paymentStatus === 'OVERDUE' ? 'bg-red-50 text-red-600 border-red-200' :
                        p.paymentStatus === 'DUE_SOON' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                        'bg-emerald-50 text-emerald-600 border-emerald-200'
                      }`}>
                        {p.paymentStatus?.replace('_', ' ') || 'VERIFIED'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] uppercase ${
                        p.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setSelectedPlayer(p); setModalTab('PROFILE'); }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition-colors"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => openEditWizard(p)}
                          className="p-1 bg-slate-100 hover:bg-brand-orange hover:text-white text-slate-600 rounded-lg transition-colors"
                          title="Edit Player"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-bold bg-slate-50">
            <span>Showing {paginatedPlayers.length} of {sortedPlayers.length} Players</span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40"
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GRID CARD VIEW */}
      {viewMode === 'CARD' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedPlayers.map(p => (
            <div 
              key={p.id} 
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-brand-orange shadow-xs transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <img src={p.photoUrl || "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=120&auto=format&fit=crop&q=80"} alt={p.fullName} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">{p.fullName}</h3>
                    <p className="text-[11px] font-mono text-brand-orange font-bold">{p.id}</p>
                  </div>
                </div>
                <div className="space-y-1 text-xs text-slate-600">
                  <div>Team: <strong className="text-slate-900 font-bold">{p.teamName}</strong></div>
                  <div>Position: <strong className="text-slate-900 font-bold">{p.position} (#{p.jerseyNumber})</strong></div>
                  <div>Age: <strong className="text-slate-900 font-bold">{p.age} yrs</strong></div>
                  <div>Parent: <strong className="text-slate-900 font-bold">{p.parentInfo?.fullName || 'N/A'}</strong></div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                  p.paymentStatus === 'OVERDUE' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {p.paymentStatus || 'VERIFIED'}
                </span>
                <button
                  onClick={() => { setSelectedPlayer(p); setModalTab('PROFILE'); }}
                  className="px-3 py-1 bg-brand-orange text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PLAYER PROFILE MODAL */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-6 my-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-4">
                <img src={selectedPlayer.photoUrl || "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=120&auto=format&fit=crop&q=80"} alt={selectedPlayer.fullName} className="w-14 h-14 rounded-2xl object-cover border border-slate-200" />
                <div>
                  <h2 className="text-xl font-black text-slate-900">{selectedPlayer.fullName}</h2>
                  <div className="text-xs text-slate-500 font-semibold flex items-center gap-2">
                    <span className="font-mono text-brand-orange font-bold">{selectedPlayer.id}</span> &bull; 
                    <span>{selectedPlayer.teamName}</span> &bull; 
                    <span>{selectedPlayer.position} (#{selectedPlayer.jerseyNumber})</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => openEditWizard(selectedPlayer)} 
                  className="px-3 py-1.5 bg-brand-orange text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Edit Player
                </button>
                <button onClick={() => setSelectedPlayer(null)} className="p-1 text-slate-400 hover:text-slate-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-2 text-xs font-extrabold">
              {['PROFILE', 'DETAILS', 'FOOTBALL', 'PARENT', 'DOCUMENTS', 'PAYMENTS', 'ATTENDANCE', 'HISTORY'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setModalTab(tab as any)}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    modalTab === tab ? "bg-brand-navy text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab: PROFILE */}
            {modalTab === 'PROFILE' && (
              <div className="grid md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-5 flex justify-center">
                  <FifaPlayerCard player={selectedPlayer} />
                </div>
                <div className="md:col-span-7 space-y-4 text-xs text-slate-700">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-200 pb-1">Football Stats Overview</h3>
                    <div className="grid grid-cols-3 gap-2 text-center pt-1">
                      <div className="p-2 bg-white rounded-xl border border-slate-200"><span className="text-slate-400 text-[10px] block">Pace</span><strong className="text-brand-orange font-black text-sm">{selectedPlayer.statistics?.pace || 80}</strong></div>
                      <div className="p-2 bg-white rounded-xl border border-slate-200"><span className="text-slate-400 text-[10px] block">Shooting</span><strong className="text-brand-orange font-black text-sm">{selectedPlayer.statistics?.shooting || 78}</strong></div>
                      <div className="p-2 bg-white rounded-xl border border-slate-200"><span className="text-slate-400 text-[10px] block">Passing</span><strong className="text-brand-orange font-black text-sm">{selectedPlayer.statistics?.passing || 82}</strong></div>
                      <div className="p-2 bg-white rounded-xl border border-slate-200"><span className="text-slate-400 text-[10px] block">Dribbling</span><strong className="text-brand-orange font-black text-sm">{selectedPlayer.statistics?.dribbling || 83}</strong></div>
                      <div className="p-2 bg-white rounded-xl border border-slate-200"><span className="text-slate-400 text-[10px] block">Defense</span><strong className="text-brand-orange font-black text-sm">{selectedPlayer.statistics?.defending || 74}</strong></div>
                      <div className="p-2 bg-white rounded-xl border border-slate-200"><span className="text-slate-400 text-[10px] block">Physicality</span><strong className="text-brand-orange font-black text-sm">{selectedPlayer.statistics?.physical || 76}</strong></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: DETAILS */}
            {modalTab === 'DETAILS' && (
              <div className="space-y-4 text-xs text-slate-700 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <h3 className="font-extrabold text-sm text-slate-900">Personal Information</h3>
                  <button onClick={() => openEditWizard(selectedPlayer)} className="text-brand-orange font-bold text-xs">Edit</button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-semibold">
                  <div><span className="text-slate-400 block">Full Name</span><strong className="text-slate-900">{selectedPlayer.fullName}</strong></div>
                  <div><span className="text-slate-400 block">Date of Birth</span><strong className="text-slate-900">{selectedPlayer.dateOfBirth}</strong></div>
                  <div><span className="text-slate-400 block">Gender & Age</span><strong className="text-slate-900">{selectedPlayer.gender} &bull; {selectedPlayer.age} yrs</strong></div>
                  <div><span className="text-slate-400 block">Place of Birth</span><strong className="text-slate-900">{selectedPlayer.placeOfBirth}</strong></div>
                  <div><span className="text-slate-400 block">Phone</span><strong className="text-brand-orange">{selectedPlayer.phone}</strong></div>
                  <div><span className="text-slate-400 block">Address</span><strong className="text-slate-900">{selectedPlayer.address}</strong></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MULTI-STEP WIZARD MODAL */}
      {wizardOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black text-brand-orange uppercase tracking-widest block">
                  {wizardEditingPlayer ? 'EDIT PLAYER RECORD' : 'CREATE NEW PLAYER RECORD'}
                </span>
                <h3 className="font-black text-base text-slate-900">Step {wizardStep} of 6: {
                  wizardStep === 1 ? 'Personal Information' :
                  wizardStep === 2 ? 'Parent / Guardian Details' :
                  wizardStep === 3 ? 'Football Information' :
                  wizardStep === 4 ? 'Identity Documents' :
                  wizardStep === 5 ? 'Payment & Membership' : 'Review & Submit'
                }</h3>
              </div>
              <button onClick={() => setWizardOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-6 gap-1 text-center text-[10px] font-extrabold">
              {[1, 2, 3, 4, 5, 6].map(stepNum => (
                <div 
                  key={stepNum}
                  className={`py-1.5 rounded-lg transition-all ${
                    wizardStep === stepNum ? 'bg-brand-orange text-white' :
                    wizardStep > stepNum ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  Step {stepNum}
                </div>
              ))}
            </div>

            <div className="space-y-4 text-xs">
              {wizardStep === 1 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">First Name *</label>
                      <input type="text" value={wizardData.firstName} onChange={e => setWizardData({ ...wizardData, firstName: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold" />
                      {validationErrors.firstName && <span className="text-red-500 text-[10px]">{validationErrors.firstName}</span>}
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Middle Name</label>
                      <input type="text" value={wizardData.middleName} onChange={e => setWizardData({ ...wizardData, middleName: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold" />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Last Name *</label>
                      <input type="text" value={wizardData.lastName} onChange={e => setWizardData({ ...wizardData, lastName: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold" />
                      {validationErrors.lastName && <span className="text-red-500 text-[10px]">{validationErrors.lastName}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Date of Birth</label>
                      <input type="date" value={wizardData.dateOfBirth} onChange={e => setWizardData({ ...wizardData, dateOfBirth: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold" />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Gender</label>
                      <select value={wizardData.gender} onChange={e => setWizardData({ ...wizardData, gender: e.target.value as any })} className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Parent Full Name *</label>
                      <input type="text" value={wizardData.parentFullName} onChange={e => setWizardData({ ...wizardData, parentFullName: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold" />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Parent Phone *</label>
                      <input type="text" value={wizardData.parentPhone} onChange={e => setWizardData({ ...wizardData, parentPhone: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold" />
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Assigned Team Squad *</label>
                      <select value={wizardData.teamId} onChange={e => setWizardData({ ...wizardData, teamId: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold">
                        {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Position *</label>
                      <input type="text" value={wizardData.position} onChange={e => setWizardData({ ...wizardData, position: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold" />
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 4 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Birth Certificate Number</label>
                    <input type="text" value={wizardData.birthCertNumber} onChange={e => setWizardData({ ...wizardData, birthCertNumber: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold" />
                  </div>
                </div>
              )}

              {wizardStep === 5 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Monthly Fee (ETB)</label>
                      <input type="number" value={wizardData.monthlyFee} onChange={e => setWizardData({ ...wizardData, monthlyFee: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold" />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Payment Status</label>
                      <select value={wizardData.paymentStatus} onChange={e => setWizardData({ ...wizardData, paymentStatus: e.target.value as any })} className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold">
                        <option value="VERIFIED">VERIFIED / PAID</option>
                        <option value="DUE_SOON">DUE SOON</option>
                        <option value="OVERDUE">OVERDUE</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 6 && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <h4 className="font-black text-slate-900 text-sm border-b border-slate-200 pb-1">Review Registration Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-slate-700 font-semibold">
                    <div>Name: <strong className="text-slate-900">{wizardData.firstName} {wizardData.lastName}</strong></div>
                    <div>Team: <strong className="text-slate-900">{teams.find(t => t.id === wizardData.teamId)?.name}</strong></div>
                    <div>Position: <strong className="text-slate-900">{wizardData.position} (#{wizardData.jerseyNumber})</strong></div>
                    <div>Parent: <strong className="text-slate-900">{wizardData.parentFullName} ({wizardData.parentPhone})</strong></div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                disabled={wizardStep === 1}
                onClick={handlePrevStep}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl disabled:opacity-40"
              >
                Back
              </button>

              {wizardStep < 6 ? (
                <button
                  onClick={handleNextStep}
                  className="px-5 py-2 bg-brand-orange text-white font-bold rounded-xl hover:bg-brand-orange-dark shadow-xs"
                >
                  Continue &rarr;
                </button>
              ) : (
                <button
                  onClick={handleSaveWizardPlayer}
                  className="px-6 py-2 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-700 shadow-xs"
                >
                  Confirm & Save Player
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlayersManagementPage() {
  return (
    <Suspense fallback={<div className="text-center text-slate-400 py-20 font-bold">Loading player roster...</div>}>
      <PlayersContent />
    </Suspense>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import { 
  Shield, Plus, Calendar, Clock, MapPin, X, CheckCircle2, XCircle, 
  Trophy, UserCheck, Activity, Users, Save, Check
} from 'lucide-react';
import { Team, Player, AttendanceSession, Match } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';

export default function TeamsManagementPage() {
  const { tContent } = useLanguage();
  const [activeTab, setActiveTab] = useState<'TEAMS' | 'ATTENDANCE' | 'MATCHES'>('TEAMS');

  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Team Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    category: 'Youth Academy',
    description: '',
    ageRange: 'Under 14',
    gender: 'Male',
    trainingDays: 'Monday / Wednesday / Friday',
    trainingTime: '4:00 PM – 5:30 PM',
    location: 'Bulbula Amen Main Pitch',
    registrationFee: 3500,
    monthlyFee: 1500,
    uniformFee: 1200,
    coachName: 'Coach Ashenafi Bekele'
  });

  // Attendance Tracker State
  const [attTeamId, setAttTeamId] = useState<string>('');
  const [attDate, setAttDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attSessionType, setAttSessionType] = useState<'Training' | 'Tactical' | 'Fitness' | 'Match Day'>('Training');
  const [attRecords, setAttRecords] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'EXCUSED'>>({});
  const [attSavedMessage, setAttSavedMessage] = useState(false);

  // Match Center State
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [matchData, setMatchData] = useState({
    teamId: '',
    opponent: '',
    date: new Date().toISOString().split('T')[0],
    time: '15:00',
    location: 'Abebe Bikila Stadium',
    competition: 'Sub-City Youth Cup',
    isHome: true,
    scoreHome: 3,
    scoreAway: 1,
    scorerPlayerId: '',
    assistPlayerId: ''
  });
  const [matchSavedMessage, setMatchSavedMessage] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [tRes, pRes, aRes, mRes] = await Promise.all([
          fetch('/api/teams').then(r => r.json()),
          fetch('/api/players').then(r => r.json()),
          fetch('/api/attendance').then(r => r.json()),
          fetch('/api/matches').then(r => r.json())
        ]);
        if (tRes.success) {
          setTeams(tRes.data);
          if (tRes.data.length > 0) setAttTeamId(tRes.data[0].id);
        }
        if (pRes.success) setPlayers(pRes.data);
        if (aRes.success) setAttendanceSessions(aRes.data);
        if (mRes.success) setMatches(mRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // When selected team changes in Attendance tab, initialize player records
  useEffect(() => {
    if (attTeamId && players.length > 0) {
      const teamPlayers = players.filter(p => p.teamId === attTeamId || p.teamName.includes(attTeamId.replace('TEAM-', '')));
      const initial: Record<string, 'PRESENT' | 'ABSENT' | 'EXCUSED'> = {};
      teamPlayers.forEach(p => {
        initial[p.id] = 'PRESENT';
      });
      setAttRecords(initial);
    }
  }, [attTeamId, players]);

  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      }).then(r => r.json());

      if (res.success) {
        setTeams([...teams, res.data]);
        setAddModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveAttendance = async () => {
    const selectedTeam = teams.find(t => t.id === attTeamId);
    const records = Object.entries(attRecords).map(([playerId, status]) => {
      const p = players.find(player => player.id === playerId);
      return {
        playerId,
        playerName: p?.fullName || playerId,
        status
      };
    });

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: attTeamId,
          teamName: selectedTeam?.name || 'Squad',
          sessionDate: attDate,
          sessionType: attSessionType,
          coachName: selectedTeam?.coachName || 'Coach Abebe',
          records
        })
      }).then(r => r.json());

      if (res.success) {
        setAttendanceSessions([res.data, ...attendanceSessions]);
        setAttSavedMessage(true);
        setTimeout(() => setAttSavedMessage(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedTeam = teams.find(t => t.id === matchData.teamId) || teams[0];
    const events = [];

    if (matchData.scorerPlayerId) {
      const scorer = players.find(p => p.id === matchData.scorerPlayerId);
      events.push({
        id: `EVT-${Date.now()}-1`,
        type: 'GOAL',
        playerId: matchData.scorerPlayerId,
        playerName: scorer?.fullName || 'Scorer',
        minute: 34
      });
    }

    if (matchData.assistPlayerId) {
      const passer = players.find(p => p.id === matchData.assistPlayerId);
      events.push({
        id: `EVT-${Date.now()}-2`,
        type: 'ASSIST',
        playerId: matchData.assistPlayerId,
        playerName: passer?.fullName || 'Assister',
        minute: 34
      });
    }

    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...matchData,
          teamName: selectedTeam.name,
          startingXiIds: players.filter(p => p.teamId === selectedTeam.id).slice(0, 11).map(p => p.id),
          substituteIds: players.filter(p => p.teamId === selectedTeam.id).slice(11, 16).map(p => p.id),
          events
        })
      }).then(r => r.json());

      if (res.success) {
        setMatches([res.data, ...matches]);
        setMatchModalOpen(false);
        setMatchSavedMessage(true);
        setTimeout(() => setMatchSavedMessage(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Edit & Transfer states
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferPlayerId, setTransferPlayerId] = useState('');
  const [transferTargetTeamId, setTransferTargetTeamId] = useState('');
  const [transferSuccessMsg, setTransferSuccessMsg] = useState(false);

  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    if (!confirm(`Are you sure you want to delete/archive team ${teamName}?`)) return;
    try {
      const res = await fetch(`/api/teams?id=${teamId}`, { method: 'DELETE' }).then(r => r.json());
      if (res.success) {
        setTeams(teams.filter(t => t.id !== teamId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTransferPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferPlayerId || !transferTargetTeamId) return;
    const player = players.find(p => p.id === transferPlayerId);
    const targetTeam = teams.find(t => t.id === transferTargetTeamId);
    if (!player || !targetTeam) return;

    try {
      const updatedPlayer: Player = {
        ...player,
        teamId: targetTeam.id,
        teamName: targetTeam.name
      };

      const res = await fetch('/api/players', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPlayer)
      }).then(r => r.json());

      if (res.success) {
        setPlayers(players.map(p => p.id === player.id ? updatedPlayer : p));
        // Refresh teams to update active player counts
        const tRes = await fetch('/api/teams').then(r => r.json());
        if (tRes.success) setTeams(tRes.data);
        setTransferModalOpen(false);
        setTransferSuccessMsg(true);
        setTimeout(() => setTransferSuccessMsg(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase text-brand-orange tracking-wider block">
            Squad Architecture & Operations
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Teams, Attendance & Match Center</h1>
          <p className="text-slate-500 text-xs mt-1">Manage academy teams, player transfers, log training attendance, and record match results.</p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'TEAMS' && (
            <>
              <button
                onClick={() => setTransferModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
              >
                🔄 Transfer Player
              </button>
              <button
                onClick={() => { setEditingTeam(null); setAddModalOpen(true); }}
                className="px-4 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Team
              </button>
            </>
          )}

          {activeTab === 'MATCHES' && (
            <button
              onClick={() => setMatchModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
            >
              <Trophy className="w-4 h-4" /> Record New Match
            </button>
          )}
        </div>
      </div>

      {transferSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Player transferred successfully! Roster counts and player record updated.</span>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('TEAMS')}
          className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 ${
            activeTab === 'TEAMS' ? 'bg-brand-orange text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <Shield className="w-4 h-4" /> Squads & Schedules ({teams.length})
        </button>

        <button
          onClick={() => setActiveTab('ATTENDANCE')}
          className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 ${
            activeTab === 'ATTENDANCE' ? 'bg-brand-orange text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" /> Training Attendance Tracker
        </button>

        <button
          onClick={() => setActiveTab('MATCHES')}
          className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 ${
            activeTab === 'MATCHES' ? 'bg-brand-orange text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4" /> Match Center ({matches.length})
        </button>
      </div>

      {/* TAB 1: SQUADS & SCHEDULES */}
      {activeTab === 'TEAMS' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {teams.map(team => (
            <div key={team.id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-sm hover:border-brand-orange transition-all relative group">
              <div className="flex justify-between items-start border-b border-slate-100 pb-2.5">
                <div>
                  <span className="text-xs font-bold text-brand-orange uppercase">{team.shortName}</span>
                  <h3 className="text-lg font-black text-slate-900">{team.name}</h3>
                  <span className="text-[11px] text-slate-500">{team.category} &bull; {team.ageRange}</span>
                </div>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold rounded-full">
                  {team.activePlayerCount} Players
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                  <span>{team.trainingDays}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>{team.trainingTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{team.location}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-500">Monthly: <strong className="text-brand-orange font-extrabold">{team.monthlyFee} ETB</strong></span>
                <span className="text-slate-400">Head Coach: {team.coachName || 'Coach Bekele'}</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  onClick={() => handleDeleteTeam(team.id, team.name)}
                  className="px-2.5 py-1 text-[11px] bg-red-50 text-red-600 border border-red-200 rounded-lg font-bold hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: TRAINING ATTENDANCE TRACKER */}
      {activeTab === 'ATTENDANCE' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase text-brand-orange block">Training Session Log</span>
                <h3 className="text-lg font-black text-slate-900">Record Player Attendance</h3>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={attTeamId}
                  onChange={e => setAttTeamId(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-extrabold text-slate-900 focus:border-brand-orange focus:outline-none"
                >
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.shortName})</option>
                  ))}
                </select>

                <input
                  type="date"
                  value={attDate}
                  onChange={e => setAttDate(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-extrabold text-slate-900 focus:border-brand-orange focus:outline-none"
                />

                <button
                  onClick={handleSaveAttendance}
                  className="px-4 py-2 bg-brand-orange text-white font-black text-xs rounded-xl shadow-sm hover:bg-brand-orange-dark transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Attendance Session
                </button>
              </div>
            </div>

            {attSavedMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Attendance session saved successfully! Player attendance stats updated.</span>
              </div>
            )}

            {/* Attendance Roster Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                  <tr>
                    <th className="p-3.5">Player Details</th>
                    <th className="p-3.5">Jersey & Pos</th>
                    <th className="p-3.5">Current Attendance %</th>
                    <th className="p-3.5 text-center">Status for Today</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {players.filter(p => p.teamId === attTeamId || p.teamName.includes(attTeamId.replace('TEAM-', ''))).map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/80">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img src={p.photoUrl} alt={p.fullName} className="w-9 h-9 rounded-xl object-cover border border-slate-200" />
                          <div>
                            <span className="font-bold text-slate-900 block text-sm">{p.fullName}</span>
                            <span className="text-[10px] text-slate-400">ID: {p.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 font-bold text-slate-700">#{p.jerseyNumber} &bull; {p.position}</td>
                      <td className="p-3.5 font-black text-emerald-600 text-sm">
                        {p.statistics?.trainingAttendance || 92}%
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex justify-center items-center gap-2">
                          {(['PRESENT', 'ABSENT', 'EXCUSED'] as const).map(st => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => setAttRecords({ ...attRecords, [p.id]: st })}
                              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                                attRecords[p.id] === st 
                                  ? st === 'PRESENT' ? 'bg-emerald-600 text-white' : st === 'ABSENT' ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'
                                  : 'bg-slate-100 text-slate-500 border border-slate-200'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MATCH CENTER */}
      {activeTab === 'MATCHES' && (
        <div className="space-y-6">
          {matchSavedMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Match recorded successfully! Player goals, assists, and games played updated automatically.</span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-5">
            {matches.map(m => (
              <div key={m.id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase border-b border-slate-100 pb-2">
                  <span>{m.competition} &bull; {m.date}</span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-extrabold rounded">{m.status}</span>
                </div>

                <div className="flex items-center justify-between py-2 px-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-center space-y-1">
                    <span className="font-black text-slate-900 text-base block">{m.teamName}</span>
                    <span className="text-[10px] text-slate-400 font-bold">HOME</span>
                  </div>

                  <div className="text-center font-black text-2xl text-brand-orange px-4 py-1 bg-white rounded-xl border border-slate-200 shadow-inner">
                    {m.scoreHome} — {m.scoreAway}
                  </div>

                  <div className="text-center space-y-1">
                    <span className="font-black text-slate-900 text-base block">{m.opponent}</span>
                    <span className="text-[10px] text-slate-400 font-bold">AWAY</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p>Venue: <strong>{m.location}</strong></p>
                  {m.events.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <span className="font-bold text-slate-900 block text-[11px] uppercase">Match Events Log:</span>
                      {m.events.map(ev => (
                        <span key={ev.id} className="inline-block mr-2 px-2 py-0.5 bg-orange-50 text-brand-orange font-bold text-[10px] rounded border border-orange-200">
                          ⚽ {ev.playerName} ({ev.type} &bull; {ev.minute}')
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Record Match Modal */}
      {matchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black text-brand-orange uppercase">Match Result & Player Stats Recorder</span>
                <h3 className="font-extrabold text-base text-slate-900">Record Match Score & Events</h3>
              </div>
              <button onClick={() => setMatchModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-900"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveMatch} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Academy Squad</label>
                <select
                  value={matchData.teamId}
                  onChange={e => setMatchData({ ...matchData, teamId: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:border-brand-orange focus:outline-none"
                >
                  <option value="">-- Choose Squad --</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.name} ({t.shortName})</option>)}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Opponent Team</label>
                <input
                  type="text"
                  required
                  value={matchData.opponent}
                  onChange={e => setMatchData({ ...matchData, opponent: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:border-brand-orange focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Home Score</label>
                  <input
                    type="number"
                    value={matchData.scoreHome}
                    onChange={e => setMatchData({ ...matchData, scoreHome: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Away Score</label>
                  <input
                    type="number"
                    value={matchData.scoreAway}
                    onChange={e => setMatchData({ ...matchData, scoreAway: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Goal Scorer (Auto-updates Player Stats)</label>
                <select
                  value={matchData.scorerPlayerId}
                  onChange={e => setMatchData({ ...matchData, scorerPlayerId: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                >
                  <option value="">-- Select Goal Scorer --</option>
                  {players.map(p => <option key={p.id} value={p.id}>{p.fullName} (#{p.jerseyNumber})</option>)}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setMatchModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-brand-orange text-white font-bold rounded-xl hover:bg-brand-orange-dark">Save Match & Update Stats</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Player Modal */}
      {transferModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black text-brand-orange uppercase">Squad Roster Transfer</span>
                <h3 className="font-extrabold text-base text-slate-900">Transfer Player Between Squads</h3>
              </div>
              <button onClick={() => setTransferModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-900"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleTransferPlayer} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Player to Transfer</label>
                <select
                  required
                  value={transferPlayerId}
                  onChange={e => setTransferPlayerId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:border-brand-orange focus:outline-none"
                >
                  <option value="">-- Choose Player --</option>
                  {players.map(p => (
                    <option key={p.id} value={p.id}>{p.fullName} ({p.teamName} &bull; #{p.jerseyNumber})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Target Destination Squad</label>
                <select
                  required
                  value={transferTargetTeamId}
                  onChange={e => setTransferTargetTeamId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:border-brand-orange focus:outline-none"
                >
                  <option value="">-- Choose Destination Squad --</option>
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.category})</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setTransferModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-brand-orange text-white font-bold rounded-xl hover:bg-brand-orange-dark">Confirm Transfer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

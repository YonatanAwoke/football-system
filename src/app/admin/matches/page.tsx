"use client";

import React, { useState, useEffect } from 'react';
import { Match, Player, Team, TacticalFormation, PitchSlot } from '@/lib/types';
import { 
  Trophy, Swords, Plus, Calendar, MapPin, Clock, 
  Search, Filter, ShieldCheck, Printer, Play, Edit3, 
  Trash2, CheckCircle2, ChevronRight, Award, Sparkles,
  Users, BarChart3, ArrowRightLeft, FileSpreadsheet
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/StatCard';
import { Modal } from '@/components/ui/Modal';
import { TacticalPitch } from '@/components/tactics/TacticalPitch';
import { LiveMatchTracker } from '@/components/tactics/LiveMatchTracker';
import { MatchSheetModal } from '@/components/tactics/MatchSheetModal';
import { getDefaultPitchSlots } from '@/lib/tactics-presets';
import { validateMatchForm } from '@/lib/validation';

export default function AdminMatchesPage() {
  const [activeTab, setActiveTab] = useState<'fixtures' | 'tactics' | 'live' | 'stats'>('fixtures');
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Currently focused match for tactical board / live match / sheet
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isNewMatchModalOpen, setIsNewMatchModalOpen] = useState(false);
  const [isMatchSheetModalOpen, setIsMatchSheetModalOpen] = useState(false);

  // New Match Form State
  const [newMatchData, setNewMatchData] = useState<Partial<Match>>({
    teamId: '',
    opponent: '',
    date: new Date().toISOString().split('T')[0],
    time: '15:00',
    location: 'Abebe Bikila Stadium',
    competition: 'Addis Ababa Youth League',
    isHome: true,
    scoreHome: 0,
    scoreAway: 0,
    status: 'UPCOMING',
    formation: '4-3-3',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [mRes, tRes, pRes] = await Promise.all([
        fetch('/api/matches').then(r => r.json()),
        fetch('/api/teams').then(r => r.json()),
        fetch('/api/players').then(r => r.json()),
      ]);

      if (mRes.success && mRes.data) {
        setMatches(mRes.data);
        if (mRes.data.length > 0 && !selectedMatch) {
          setSelectedMatch(mRes.data[0]);
        }
      }
      if (tRes.success && tRes.data) {
        setTeams(tRes.data);
        if (tRes.data.length > 0 && !newMatchData.teamId) {
          setNewMatchData(prev => ({ ...prev, teamId: tRes.data[0].id, teamName: tRes.data[0].name }));
        }
      }
      if (pRes.success && pRes.data) {
        setPlayers(pRes.data);
      }
    } catch (e) {
      console.error('Failed to load matches data:', e);
    }
  };

  const handleCreateMatch = async () => {
    const val = validateMatchForm({
      teamId: newMatchData.teamId,
      opponent: newMatchData.opponent,
      date: newMatchData.date,
      time: newMatchData.time,
      location: newMatchData.location,
      competition: newMatchData.competition,
    });

    if (!val.isValid) {
      setFormErrors(val.errors);
      return;
    }

    const team = teams.find(t => t.id === newMatchData.teamId);
    const payload = {
      ...newMatchData,
      teamName: team ? team.name : 'Bulbula Squad',
      startingXiIds: [],
      substituteIds: [],
      events: [],
      pitchSlots: getDefaultPitchSlots((newMatchData.formation as TacticalFormation) || '4-3-3'),
    };

    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then(r => r.json());

      if (res.success) {
        setMatches(prev => [res.data, ...prev]);
        setSelectedMatch(res.data);
        setIsNewMatchModalOpen(false);
        setNewMatchData({
          teamId: teams[0]?.id || '',
          opponent: '',
          date: new Date().toISOString().split('T')[0],
          time: '15:00',
          location: 'Abebe Bikila Stadium',
          competition: 'Addis Ababa Youth League',
          isHome: true,
          scoreHome: 0,
          scoreAway: 0,
          status: 'UPCOMING',
          formation: '4-3-3',
        });
        setFormErrors({});
      }
    } catch (e) {
      console.error('Error creating match:', e);
    }
  };

  const handleUpdateMatch = async (updated: Match) => {
    // Save to server / mock db
    try {
      await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      setMatches(prev => prev.map(m => m.id === updated.id ? updated : m));
      setSelectedMatch(updated);
    } catch (e) {
      console.error('Error updating match:', e);
    }
  };

  const handleDeleteMatch = (matchId: string) => {
    if (!confirm('Are you sure you want to delete this match fixture?')) return;
    const filtered = matches.filter(m => m.id !== matchId);
    setMatches(filtered);
    if (selectedMatch?.id === matchId) {
      setSelectedMatch(filtered[0] || null);
    }
  };

  // Filtered Matches
  const filteredMatches = matches.filter(m => {
    const matchesTeam = selectedTeamId === 'ALL' || m.teamId === selectedTeamId;
    const matchesStatus = selectedStatus === 'ALL' || m.status === selectedStatus;
    const matchesQuery = !searchQuery.trim() || 
      m.opponent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.competition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.teamName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTeam && matchesStatus && matchesQuery;
  });

  // Calculate Aggregates
  const totalMatches = matches.length;
  const completedMatches = matches.filter(m => m.status === 'COMPLETED');
  const wins = completedMatches.filter(m => m.scoreHome > m.scoreAway).length;
  const draws = completedMatches.filter(m => m.scoreHome === m.scoreAway).length;
  const losses = completedMatches.filter(m => m.scoreHome < m.scoreAway).length;
  const totalGoalsScored = completedMatches.reduce((sum, m) => sum + m.scoreHome, 0);

  // Active match team squad
  const currentTeamSquad = players.filter(p => 
    selectedMatch ? p.teamId === selectedMatch.teamId : true
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Swords className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Matches &amp; Tactical Center
            </h1>
          </div>
          <p className="text-sm text-slate-400">
            Interactive 2D pitch formation builder, live match-day tracker, squad tactical sheets, and results.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={() => setIsNewMatchModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Match Fixture
          </Button>
        </div>
      </div>

      {/* Aggregate KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Fixtures"
          value={totalMatches}
          subtitle={`${matches.filter(m => m.status === 'UPCOMING').length} Upcoming • ${matches.filter(m => m.status === 'LIVE').length} Live`}
          icon={Calendar}
          colorScheme="emerald"
        />
        <StatCard
          title="Club Record (W-D-L)"
          value={`${wins} - ${draws} - ${losses}`}
          subtitle={`${completedMatches.length} Matches Played`}
          icon={Trophy}
          colorScheme="amber"
        />
        <StatCard
          title="Goals Scored"
          value={totalGoalsScored}
          subtitle={completedMatches.length ? `${(totalGoalsScored / completedMatches.length).toFixed(1)} goals / match` : '0 goals / match'}
          icon={Sparkles}
          colorScheme="purple"
        />
        <StatCard
          title="Win Rate"
          value={completedMatches.length ? `${Math.round((wins / completedMatches.length) * 100)}%` : '0%'}
          subtitle="Competitive matches"
          icon={Award}
          colorScheme="sky"
        />
      </div>

      {/* Tab Navigation Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('fixtures')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
            activeTab === 'fixtures'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Fixtures &amp; Results ({matches.length})
        </button>

        <button
          type="button"
          onClick={() => {
            if (!selectedMatch && matches.length > 0) setSelectedMatch(matches[0]);
            setActiveTab('tactics');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
            activeTab === 'tactics'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Users className="w-4 h-4" />
          Tactical Pitch &amp; Lineups
        </button>

        <button
          type="button"
          onClick={() => {
            if (!selectedMatch && matches.length > 0) setSelectedMatch(matches[0]);
            setActiveTab('live');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
            activeTab === 'live'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Play className="w-4 h-4" />
          Live Match Console
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
            activeTab === 'stats'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Top Scorers &amp; Honours
        </button>
      </div>

      {/* TAB 1: FIXTURES & RESULTS */}
      {activeTab === 'fixtures' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search opponent or tournament..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Team Filter */}
            <select
              value={selectedTeamId}
              onChange={e => setSelectedTeamId(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Age Teams</option>
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.category})</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Match Statuses</option>
              <option value="UPCOMING">Upcoming Fixtures</option>
              <option value="LIVE">Live Matches</option>
              <option value="COMPLETED">Completed Results</option>
            </select>
          </div>

          {/* Matches Grid */}
          {filteredMatches.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl">
              <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No Match Fixtures Found</h3>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your filter or schedule a new match fixture.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMatches.map(match => {
                const isSelected = selectedMatch?.id === match.id;
                return (
                  <div
                    key={match.id}
                    className={`relative overflow-hidden bg-slate-900 border rounded-3xl p-6 transition-all duration-200 shadow-lg ${
                      isSelected ? 'border-emerald-500/80 ring-2 ring-emerald-500/20' : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Header info */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={match.status === 'LIVE' ? 'danger' : match.status === 'COMPLETED' ? 'success' : 'primary'}
                          dot={match.status === 'LIVE'}
                        >
                          {match.status}
                        </Badge>
                        <span className="text-xs font-semibold text-slate-400 truncate max-w-[160px]">
                          {match.competition}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{match.date}</span>
                        <span>•</span>
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{match.time}</span>
                      </div>
                    </div>

                    {/* Match Score Strip */}
                    <div className="flex items-center justify-between gap-4 my-4">
                      {/* Bulbula Team */}
                      <div className="flex-1 text-center">
                        <p className="text-sm font-bold text-white truncate">{match.teamName}</p>
                        <span className="text-[10px] text-emerald-400 font-semibold uppercase">Bulbula Amen</span>
                      </div>

                      {/* Score Box */}
                      <div className="px-5 py-2 bg-slate-950 border border-slate-800 rounded-2xl text-center shadow-inner">
                        <span className="text-2xl font-black text-white font-mono">
                          {match.status === 'UPCOMING' ? 'VS' : `${match.scoreHome} - ${match.scoreAway}`}
                        </span>
                        {match.currentMinute ? (
                          <span className="block text-[10px] font-mono text-emerald-400">{match.currentMinute}&apos;</span>
                        ) : null}
                      </div>

                      {/* Opponent Team */}
                      <div className="flex-1 text-center">
                        <p className="text-sm font-bold text-white truncate">{match.opponent}</p>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">Opponent</span>
                      </div>
                    </div>

                    {/* Location & MOTM Tag */}
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{match.location}</span>
                      </div>
                      {match.motmPlayerName && (
                        <span className="text-yellow-400 font-semibold text-[11px] flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" /> MOTM: {match.motmPlayerName.split(' ')[0]}
                        </span>
                      )}
                    </div>

                    {/* Action Toolbar */}
                    <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-800">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="emerald"
                          size="sm"
                          onClick={() => {
                            setSelectedMatch(match);
                            setActiveTab('tactics');
                          }}
                          leftIcon={<Users className="w-3.5 h-3.5" />}
                        >
                          Tactics
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedMatch(match);
                            setActiveTab('live');
                          }}
                          leftIcon={<Play className="w-3.5 h-3.5 text-emerald-400" />}
                        >
                          Live Tracker
                        </Button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMatch(match);
                            setIsMatchSheetModalOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                          title="Print Match Sheet"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMatch(match.id)}
                          className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                          title="Delete Fixture"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TACTICAL PITCH & LINEUPS */}
      {activeTab === 'tactics' && (
        <div className="space-y-6">
          {selectedMatch ? (
            <div className="space-y-6">
              {/* Active Match Selector Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-3xl shadow-xl">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="primary">Match Lineup</Badge>
                    <h3 className="text-lg font-black text-white">
                      {selectedMatch.teamName} vs {selectedMatch.opponent}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {selectedMatch.competition} • {selectedMatch.date} @ {selectedMatch.time} • {selectedMatch.location}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={selectedMatch.id}
                    onChange={e => {
                      const m = matches.find(item => item.id === e.target.value);
                      if (m) setSelectedMatch(m);
                    }}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {matches.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.teamName} vs {m.opponent} ({m.date})
                      </option>
                    ))}
                  </select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsMatchSheetModalOpen(true)}
                    leftIcon={<Printer className="w-4 h-4" />}
                  >
                    Print Sheet
                  </Button>
                </div>
              </div>

              {/* Tactical Pitch Component */}
              <TacticalPitch
                squad={currentTeamSquad}
                formation={selectedMatch.formation || '4-3-3'}
                onFormationChange={f => {
                  const updated = { ...selectedMatch, formation: f };
                  handleUpdateMatch(updated);
                }}
                pitchSlots={selectedMatch.pitchSlots || getDefaultPitchSlots(selectedMatch.formation || '4-3-3')}
                onPitchSlotsChange={slots => {
                  const updatedStartingXI = slots.map(s => s.playerId).filter(Boolean) as string[];
                  const updated = {
                    ...selectedMatch,
                    pitchSlots: slots,
                    startingXiIds: updatedStartingXI,
                  };
                  handleUpdateMatch(updated);
                }}
                substituteIds={selectedMatch.substituteIds || []}
                onSubstituteIdsChange={subIds => {
                  const updated = { ...selectedMatch, substituteIds: subIds };
                  handleUpdateMatch(updated);
                }}
                captainId={selectedMatch.captainId}
                onCaptainChange={cId => {
                  const updated = { ...selectedMatch, captainId: cId };
                  handleUpdateMatch(updated);
                }}
                penaltyTakerId={selectedMatch.penaltyTakerId}
                onPenaltyTakerChange={pId => {
                  const updated = { ...selectedMatch, penaltyTakerId: pId };
                  handleUpdateMatch(updated);
                }}
                freeKickTakerId={selectedMatch.freeKickTakerId}
                onFreeKickTakerChange={fkId => {
                  const updated = { ...selectedMatch, freeKickTakerId: fkId };
                  handleUpdateMatch(updated);
                }}
              />
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl">
              <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-bold text-white">No Match Selected</p>
              <p className="text-xs text-slate-400 mt-1">Please select or create a match from the Fixtures tab.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: LIVE MATCH CONSOLE */}
      {activeTab === 'live' && (
        <div className="space-y-6">
          {selectedMatch ? (
            <div className="space-y-6">
              {/* Fixture Picker */}
              <div className="flex items-center justify-between gap-4 bg-slate-900 border border-slate-800 px-4 py-3 rounded-2xl">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Match:</span>
                <select
                  value={selectedMatch.id}
                  onChange={e => {
                    const m = matches.find(item => item.id === e.target.value);
                    if (m) setSelectedMatch(m);
                  }}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                >
                  {matches.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.teamName} vs {m.opponent} ({m.date}) - [{m.status}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Live Tracker Tracker */}
              <LiveMatchTracker
                match={selectedMatch}
                squad={currentTeamSquad}
                onSaveMatch={handleUpdateMatch}
                onFinishMatch={m => {
                  handleUpdateMatch(m);
                  alert('Match finalized and player statistics successfully updated in database!');
                }}
              />
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl">
              <Play className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-bold text-white">No Match Selected for Live Tracking</p>
              <p className="text-xs text-slate-400 mt-1">Select a fixture from the Fixtures tab to initiate the live scorekeeper.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: STATS & HONOURS */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Match Goalscorers */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Top Match Goalscorers</h3>
                </div>
                <Badge variant="primary" size="sm">Club Golden Boot</Badge>
              </div>

              <div className="space-y-2">
                {[...players]
                  .filter(p => (p.statistics?.goals || 0) > 0)
                  .sort((a, b) => (b.statistics?.goals || 0) - (a.statistics?.goals || 0))
                  .slice(0, 8)
                  .map((p, idx) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/40 border border-slate-700/60"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full font-black text-xs flex items-center justify-center ${
                          idx === 0 ? 'bg-yellow-400 text-slate-950 shadow' : 'bg-slate-700 text-white'
                        }`}>
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-white">{p.fullName}</p>
                          <p className="text-xs text-slate-400">{p.teamName} • #{p.jerseyNumber} {p.position}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-black text-emerald-400 font-mono">
                          {p.statistics?.goals || 0}
                        </span>
                        <span className="text-xs text-slate-500 ml-1">Goals</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Man of the Match Leaderboard */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-base font-bold text-white">Recent MOTM Honours</h3>
                </div>
                <Badge variant="gold" size="sm">Star Performers</Badge>
              </div>

              <div className="space-y-3">
                {matches.filter(m => m.motmPlayerName).slice(0, 6).map(m => (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-500/20 text-yellow-300 rounded-xl">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{m.motmPlayerName}</p>
                        <p className="text-xs text-slate-400">vs {m.opponent} ({m.scoreHome} - {m.scoreAway})</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-yellow-400">{m.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE FIXTURE MODAL */}
      <Modal
        isOpen={isNewMatchModalOpen}
        onClose={() => setIsNewMatchModalOpen(false)}
        title="Schedule New Match Fixture"
        subtitle="Create upcoming competitive or friendly fixture"
        maxWidth="2xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Bulbula Amen Squad *</label>
              <select
                value={newMatchData.teamId}
                onChange={e => setNewMatchData({ ...newMatchData, teamId: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500"
              >
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.category})</option>
                ))}
              </select>
              {formErrors.teamId && <p className="text-xs text-rose-400 mt-1">{formErrors.teamId}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Opponent Club / Team *</label>
              <input
                type="text"
                placeholder="e.g., St. George Youth FC"
                value={newMatchData.opponent}
                onChange={e => setNewMatchData({ ...newMatchData, opponent: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500"
              />
              {formErrors.opponent && <p className="text-xs text-rose-400 mt-1">{formErrors.opponent}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Match Date *</label>
              <input
                type="date"
                value={newMatchData.date}
                onChange={e => setNewMatchData({ ...newMatchData, date: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500"
              />
              {formErrors.date && <p className="text-xs text-rose-400 mt-1">{formErrors.date}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Kick-off Time *</label>
              <input
                type="time"
                value={newMatchData.time}
                onChange={e => setNewMatchData({ ...newMatchData, time: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500"
              />
              {formErrors.time && <p className="text-xs text-rose-400 mt-1">{formErrors.time}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Venue / Stadium *</label>
              <input
                type="text"
                placeholder="e.g., Abebe Bikila Stadium"
                value={newMatchData.location}
                onChange={e => setNewMatchData({ ...newMatchData, location: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500"
              />
              {formErrors.location && <p className="text-xs text-rose-400 mt-1">{formErrors.location}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Competition / Tournament *</label>
              <input
                type="text"
                placeholder="e.g., Sub-City Youth Cup"
                value={newMatchData.competition}
                onChange={e => setNewMatchData({ ...newMatchData, competition: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500"
              />
              {formErrors.competition && <p className="text-xs text-rose-400 mt-1">{formErrors.competition}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tactical Formation Preset</label>
            <select
              value={newMatchData.formation}
              onChange={e => setNewMatchData({ ...newMatchData, formation: e.target.value as any })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="4-3-3">4-3-3 Attack</option>
              <option value="4-2-3-1">4-2-3-1 Wide</option>
              <option value="4-4-2">4-4-2 Classic</option>
              <option value="3-5-2">3-5-2 Wingbacks</option>
              <option value="3-4-3">3-4-3 Diamond</option>
              <option value="5-3-2">5-3-2 Counter</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="outline" onClick={() => setIsNewMatchModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreateMatch}>Schedule Match</Button>
          </div>
        </div>
      </Modal>

      {/* PRINTABLE MATCH SHEET MODAL */}
      {selectedMatch && (
        <MatchSheetModal
          isOpen={isMatchSheetModalOpen}
          onClose={() => setIsMatchSheetModalOpen(false)}
          match={selectedMatch}
          squad={currentTeamSquad}
        />
      )}
    </div>
  );
}

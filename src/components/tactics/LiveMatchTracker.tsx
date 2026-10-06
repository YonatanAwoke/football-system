import React, { useState, useEffect } from 'react';
import { Match, MatchEvent, Player } from '@/lib/types';
import { 
  Play, Pause, RotateCcw, Plus, Trash2, Award, Clock, 
  ArrowRightLeft, AlertTriangle, ShieldCheck, CheckCircle2,
  Sparkles, Trophy
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface LiveMatchTrackerProps {
  match: Match;
  squad: Player[];
  onSaveMatch: (updatedMatch: Match) => void;
  onFinishMatch?: (finalMatch: Match) => void;
}

export const LiveMatchTracker: React.FC<LiveMatchTrackerProps> = ({
  match,
  squad,
  onSaveMatch,
  onFinishMatch,
}) => {
  const [currentMinute, setCurrentMinute] = useState<number>(match.currentMinute || 0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(match.status === 'LIVE');
  const [matchHalf, setMatchHalf] = useState<'1st Half' | 'Halftime' | '2nd Half' | 'Fulltime' | 'Extra Time'>(
    match.matchHalf || (match.status === 'COMPLETED' ? 'Fulltime' : '1st Half')
  );

  const [scoreHome, setScoreHome] = useState<number>(match.scoreHome || 0);
  const [scoreAway, setScoreAway] = useState<number>(match.scoreAway || 0);
  const [events, setEvents] = useState<MatchEvent[]>(match.events || []);
  const [motmId, setMotmId] = useState<string>(match.motmPlayerId || '');

  // Event creation modal state
  const [eventModalType, setEventModalType] = useState<'GOAL' | 'YELLOW' | 'RED' | 'SUB' | null>(null);
  const [selectedScorerId, setSelectedScorerId] = useState<string>('');
  const [selectedAssistId, setSelectedAssistId] = useState<string>('');
  const [selectedCardPlayerId, setSelectedCardPlayerId] = useState<string>('');
  const [selectedSubOutId, setSelectedSubOutId] = useState<string>('');
  const [selectedSubInId, setSelectedSubInId] = useState<string>('');
  const [eventNotes, setEventNotes] = useState<string>('');

  const squadMap = new Map<string, Player>();
  squad.forEach(p => squadMap.set(p.id, p));

  const startingXIPlayers = match.startingXiIds.map(id => squadMap.get(id)).filter(Boolean) as Player[];
  const substitutePlayers = match.substituteIds.map(id => squadMap.get(id)).filter(Boolean) as Player[];

  // Active timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && matchHalf !== 'Halftime' && matchHalf !== 'Fulltime') {
      interval = setInterval(() => {
        setCurrentMinute(prev => {
          if (prev >= 90 && matchHalf === '2nd Half') {
            setIsTimerRunning(false);
            return 90;
          }
          if (prev >= 45 && matchHalf === '1st Half') {
            setIsTimerRunning(false);
            setMatchHalf('Halftime');
            return 45;
          }
          return prev + 1;
        });
      }, 2000); // 2 seconds real time = 1 match minute simulation
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, matchHalf]);

  const handleScoreChange = (team: 'home' | 'away', delta: number) => {
    if (team === 'home') {
      const newScore = Math.max(0, scoreHome + delta);
      setScoreHome(newScore);
      updateMatchState({ scoreHome: newScore });
    } else {
      const newScore = Math.max(0, scoreAway + delta);
      setScoreAway(newScore);
      updateMatchState({ scoreAway: newScore });
    }
  };

  const updateMatchState = (partial: Partial<Match>) => {
    const updated: Match = {
      ...match,
      scoreHome,
      scoreAway,
      events,
      currentMinute,
      matchHalf,
      status: matchHalf === 'Fulltime' ? 'COMPLETED' : isTimerRunning ? 'LIVE' : match.status,
      motmPlayerId: motmId,
      motmPlayerName: motmId ? squadMap.get(motmId)?.fullName : undefined,
      ...partial,
    };
    onSaveMatch(updated);
  };

  const logGoalEvent = (isOpponent: boolean = false) => {
    if (isOpponent) {
      handleScoreChange('away', 1);
      const newEvt: MatchEvent = {
        id: `EVT-${Date.now()}`,
        type: 'GOAL',
        playerId: 'OPPONENT',
        playerName: `${match.opponent} Goal`,
        minute: currentMinute || 1,
      };
      const updatedEvents = [newEvt, ...events];
      setEvents(updatedEvents);
      updateMatchState({ events: updatedEvents, scoreAway: scoreAway + 1 });
      return;
    }

    if (!selectedScorerId) return;
    const scorer = squadMap.get(selectedScorerId);
    const assist = selectedAssistId ? squadMap.get(selectedAssistId) : null;

    const newEvt: MatchEvent = {
      id: `EVT-${Date.now()}`,
      type: 'GOAL',
      playerId: selectedScorerId,
      playerName: scorer?.fullName || 'Bulbula Player',
      minute: currentMinute || 1,
      notes: assist ? `Assist: ${assist.fullName}` : eventNotes || undefined,
    };

    const updatedEvents = [newEvt, ...events];
    setEvents(updatedEvents);
    const newHomeScore = scoreHome + 1;
    setScoreHome(newHomeScore);
    updateMatchState({ events: updatedEvents, scoreHome: newHomeScore });

    setEventModalType(null);
    setSelectedScorerId('');
    setSelectedAssistId('');
    setEventNotes('');
  };

  const logCardEvent = (type: 'YELLOW' | 'RED') => {
    if (!selectedCardPlayerId) return;
    const player = squadMap.get(selectedCardPlayerId);

    const newEvt: MatchEvent = {
      id: `EVT-${Date.now()}`,
      type,
      playerId: selectedCardPlayerId,
      playerName: player?.fullName || 'Bulbula Player',
      minute: currentMinute || 1,
      notes: eventNotes || undefined,
    };

    const updatedEvents = [newEvt, ...events];
    setEvents(updatedEvents);
    updateMatchState({ events: updatedEvents });

    setEventModalType(null);
    setSelectedCardPlayerId('');
    setEventNotes('');
  };

  const logSubstitutionEvent = () => {
    if (!selectedSubOutId || !selectedSubInId) return;
    const subOut = squadMap.get(selectedSubOutId);
    const subIn = squadMap.get(selectedSubInId);

    const newEvt: MatchEvent = {
      id: `EVT-${Date.now()}`,
      type: 'SUB_IN',
      playerId: selectedSubOutId,
      playerName: subOut?.fullName || 'Player Out',
      playerInId: selectedSubInId,
      playerInName: subIn?.fullName || 'Player In',
      minute: currentMinute || 1,
      notes: `Sub: ${subIn?.fullName} IN ➔ ${subOut?.fullName} OUT`,
    };

    // Swap starting XI and substitute arrays
    const newStartingXI = match.startingXiIds.map(id => id === selectedSubOutId ? selectedSubInId : id);
    const newSubs = match.substituteIds.map(id => id === selectedSubInId ? selectedSubOutId : id);

    const updatedEvents = [newEvt, ...events];
    setEvents(updatedEvents);
    updateMatchState({
      events: updatedEvents,
      startingXiIds: newStartingXI,
      substituteIds: newSubs,
    });

    setEventModalType(null);
    setSelectedSubOutId('');
    setSelectedSubInId('');
  };

  const deleteEvent = (eventId: string) => {
    const target = events.find(e => e.id === eventId);
    if (target?.type === 'GOAL') {
      if (target.playerId === 'OPPONENT') {
        setScoreAway(prev => Math.max(0, prev - 1));
      } else {
        setScoreHome(prev => Math.max(0, prev - 1));
      }
    }
    const filtered = events.filter(e => e.id !== eventId);
    setEvents(filtered);
    updateMatchState({ events: filtered });
  };

  const completeMatch = () => {
    setIsTimerRunning(false);
    setMatchHalf('Fulltime');
    const finalMatch: Match = {
      ...match,
      scoreHome,
      scoreAway,
      events,
      status: 'COMPLETED',
      matchHalf: 'Fulltime',
      currentMinute: 90,
      motmPlayerId: motmId || undefined,
      motmPlayerName: motmId ? squadMap.get(motmId)?.fullName : undefined,
    };
    onSaveMatch(finalMatch);
    if (onFinishMatch) onFinishMatch(finalMatch);
  };

  return (
    <div className="space-y-6">
      {/* Live Stadium Scoreboard */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Ambient Stadium Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* Top Match Header Info */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Badge variant={isTimerRunning ? 'danger' : match.status === 'COMPLETED' ? 'success' : 'primary'} dot={isTimerRunning}>
              {isTimerRunning ? 'LIVE MATCH' : match.status}
            </Badge>
            <span className="text-xs font-bold text-slate-400">
              {match.competition} • {match.location}
            </span>
          </div>

          {/* Half & Minute Controller */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-base font-black text-white">{currentMinute}&apos;</span>
              <span className="text-xs text-slate-400 ml-1">({matchHalf})</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  const nextRunning = !isTimerRunning;
                  setIsTimerRunning(nextRunning);
                  updateMatchState({ status: nextRunning ? 'LIVE' : 'UPCOMING' });
                }}
                className={`p-2 rounded-xl border transition-all ${
                  isTimerRunning
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold hover:bg-emerald-400'
                }`}
                title={isTimerRunning ? 'Pause Clock' : 'Start Clock'}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  const nextMin = Math.min(90, currentMinute + 5);
                  setCurrentMinute(nextMin);
                  updateMatchState({ currentMinute: nextMin });
                }}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 text-xs font-bold"
                title="+5 Minutes"
              >
                +5&apos;
              </button>
            </div>
          </div>
        </div>

        {/* Score Display Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Home Team (Bulbula Amen FC) */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950 border-2 border-emerald-500/60 p-2.5 flex items-center justify-center shadow-lg shadow-emerald-900/40">
              <ShieldCheck className="w-10 h-10 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{match.teamName}</h3>
              <p className="text-xs text-emerald-400 font-semibold">Home Club</p>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => handleScoreChange('home', -1)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => handleScoreChange('home', 1)}
                className="w-7 h-7 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Central Giant Score & Half Toggle */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 px-8 py-4 rounded-3xl shadow-inner">
              <span className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tight">{scoreHome}</span>
              <span className="text-2xl font-bold text-slate-600">:</span>
              <span className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tight">{scoreAway}</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {(['1st Half', 'Halftime', '2nd Half', 'Fulltime'] as const).map(half => (
                <button
                  key={half}
                  type="button"
                  onClick={() => {
                    setMatchHalf(half);
                    if (half === 'Halftime' || half === 'Fulltime') setIsTimerRunning(false);
                    updateMatchState({ matchHalf: half });
                  }}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                    matchHalf === half
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/60'
                  }`}
                >
                  {half}
                </button>
              ))}
            </div>
          </div>

          {/* Away Team (Opponent) */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-slate-700 p-2.5 flex items-center justify-center shadow-lg">
              <Trophy className="w-10 h-10 text-slate-400" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{match.opponent}</h3>
              <p className="text-xs text-slate-400 font-semibold">Opponent</p>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => handleScoreChange('away', -1)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => handleScoreChange('away', 1)}
                className="w-7 h-7 rounded-lg bg-slate-700 text-white hover:bg-slate-600 flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Event Loggers */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Button
          variant="primary"
          onClick={() => setEventModalType('GOAL')}
          leftIcon={<Sparkles className="w-4 h-4 text-emerald-300" />}
          className="h-14 font-bold"
        >
          Bulbula Goal
        </Button>

        <Button
          variant="secondary"
          onClick={() => logGoalEvent(true)}
          className="h-14 font-bold text-rose-300 border-rose-500/30 hover:bg-rose-500/10"
        >
          Opponent Goal
        </Button>

        <Button
          variant="secondary"
          onClick={() => setEventModalType('YELLOW')}
          leftIcon={<div className="w-3.5 h-4.5 bg-yellow-400 rounded-sm" />}
          className="h-14 font-bold"
        >
          Yellow Card
        </Button>

        <Button
          variant="secondary"
          onClick={() => setEventModalType('RED')}
          leftIcon={<div className="w-3.5 h-4.5 bg-rose-500 rounded-sm" />}
          className="h-14 font-bold"
        >
          Red Card
        </Button>

        <Button
          variant="outline"
          onClick={() => setEventModalType('SUB')}
          leftIcon={<ArrowRightLeft className="w-4 h-4 text-sky-400" />}
          className="h-14 font-bold col-span-2 sm:col-span-1"
        >
          Substitution
        </Button>
      </div>

      {/* Events Timeline & MOTM Picker Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events Feed (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              Match Events Timeline
            </h4>
            <Badge variant="slate" size="sm">
              {events.length} Recorded
            </Badge>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-sm">No match events logged yet.</p>
              <p className="text-xs mt-1">Use the quick-action buttons above to log goals, bookings, and substitutions.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
              {events.map(evt => (
                <div
                  key={evt.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/50 border border-slate-700/60 hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-mono text-xs font-black text-emerald-400">
                      {evt.minute}&apos;
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        {evt.type === 'GOAL' && (
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold text-[10px] rounded-md">
                            ⚽ GOAL
                          </span>
                        )}
                        {evt.type === 'YELLOW' && (
                          <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 font-bold text-[10px] rounded-md">
                            🟨 YELLOW
                          </span>
                        )}
                        {evt.type === 'RED' && (
                          <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 font-bold text-[10px] rounded-md">
                            🟥 RED
                          </span>
                        )}
                        {evt.type === 'SUB_IN' && (
                          <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 font-bold text-[10px] rounded-md">
                            🔄 SUB
                          </span>
                        )}
                        <span className="text-sm font-bold text-white">{evt.playerName}</span>
                      </div>
                      {evt.notes && <p className="text-xs text-slate-400 mt-0.5">{evt.notes}</p>}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteEvent(evt.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-700 transition-colors"
                    title="Delete event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MOTM & Finalize Card (1 col) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <h4 className="text-base font-bold text-white">Man of the Match</h4>
            </div>
            <p className="text-xs text-slate-400">
              Select the top outstanding performer for this fixture to award official MOTM honors.
            </p>

            <select
              value={motmId}
              onChange={e => {
                setMotmId(e.target.value);
                updateMatchState({ motmPlayerId: e.target.value });
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="">-- Select Outstanding Player --</option>
              {startingXIPlayers.map(p => (
                <option key={p.id} value={p.id}>
                  #{p.jerseyNumber} {p.fullName} ({p.position})
                </option>
              ))}
            </select>

            {motmId && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 flex items-center gap-3">
                <div className="p-2.5 bg-yellow-500/20 text-yellow-300 rounded-xl">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-yellow-400 font-semibold">Awarded MOTM</p>
                  <p className="text-sm font-bold text-white">{squadMap.get(motmId)?.fullName}</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800">
            <Button
              variant="emerald"
              size="lg"
              className="w-full"
              onClick={completeMatch}
              leftIcon={<CheckCircle2 className="w-5 h-5" />}
            >
              Finalize &amp; Save Match
            </Button>
          </div>
        </div>
      </div>

      {/* Goal Logger Modal */}
      <Modal
        isOpen={eventModalType === 'GOAL'}
        onClose={() => setEventModalType(null)}
        title="Record Bulbula Amen FC Goal"
        subtitle={`Match Minute: ${currentMinute}'`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Goal Scorer *</label>
            <select
              value={selectedScorerId}
              onChange={e => setSelectedScorerId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">-- Select Goal Scorer --</option>
              {squad.map(p => (
                <option key={p.id} value={p.id}>
                  #{p.jerseyNumber} {p.fullName} ({p.position})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Assist Provider (Optional)</label>
            <select
              value={selectedAssistId}
              onChange={e => setSelectedAssistId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">-- None / Solo Effort --</option>
              {squad.filter(p => p.id !== selectedScorerId).map(p => (
                <option key={p.id} value={p.id}>
                  #{p.jerseyNumber} {p.fullName} ({p.position})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Goal Details / Notes (Optional)</label>
            <input
              type="text"
              placeholder="e.g., Header from corner / 25-yard screamer / Penalty"
              value={eventNotes}
              onChange={e => setEventNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="outline" onClick={() => setEventModalType(null)}>Cancel</Button>
            <Button variant="primary" onClick={() => logGoalEvent(false)} disabled={!selectedScorerId}>
              Save Goal
            </Button>
          </div>
        </div>
      </Modal>

      {/* Card Logger Modal */}
      <Modal
        isOpen={eventModalType === 'YELLOW' || eventModalType === 'RED'}
        onClose={() => setEventModalType(null)}
        title={`Record ${eventModalType === 'YELLOW' ? 'Yellow' : 'Red'} Card`}
        subtitle={`Match Minute: ${currentMinute}'`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Booked Player *</label>
            <select
              value={selectedCardPlayerId}
              onChange={e => setSelectedCardPlayerId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">-- Select Player --</option>
              {squad.map(p => (
                <option key={p.id} value={p.id}>
                  #{p.jerseyNumber} {p.fullName} ({p.position})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Booking Reason (Optional)</label>
            <input
              type="text"
              placeholder="e.g., Tactical foul / Dissent / Reckless tackle"
              value={eventNotes}
              onChange={e => setEventNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="outline" onClick={() => setEventModalType(null)}>Cancel</Button>
            <Button 
              variant={eventModalType === 'RED' ? 'danger' : 'primary'} 
              onClick={() => logCardEvent(eventModalType as any)} 
              disabled={!selectedCardPlayerId}
            >
              Record Card
            </Button>
          </div>
        </div>
      </Modal>

      {/* Substitution Modal */}
      <Modal
        isOpen={eventModalType === 'SUB'}
        onClose={() => setEventModalType(null)}
        title="Make Tactical Substitution"
        subtitle={`Match Minute: ${currentMinute}'`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-400 mb-1">Player Substituted OUT ➔</label>
            <select
              value={selectedSubOutId}
              onChange={e => setSelectedSubOutId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">-- Select Player Leaving Pitch --</option>
              {startingXIPlayers.map(p => (
                <option key={p.id} value={p.id}>
                  #{p.jerseyNumber} {p.fullName} ({p.position})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-emerald-400 mb-1">Player Substituted IN ➔</label>
            <select
              value={selectedSubInId}
              onChange={e => setSelectedSubInId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">-- Select Player Entering from Bench --</option>
              {substitutePlayers.map(p => (
                <option key={p.id} value={p.id}>
                  #{p.jerseyNumber} {p.fullName} ({p.position})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="outline" onClick={() => setEventModalType(null)}>Cancel</Button>
            <Button 
              variant="primary" 
              onClick={logSubstitutionEvent} 
              disabled={!selectedSubOutId || !selectedSubInId}
            >
              Confirm Substitution
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

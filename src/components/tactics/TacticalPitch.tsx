import React, { useState } from 'react';
import { Player, TacticalFormation, PitchSlot } from '@/lib/types';
import { FORMATION_PRESETS, getDefaultPitchSlots } from '@/lib/tactics-presets';
import { Shield, Sparkles, UserPlus, X, Award, Target, Flame, RotateCcw, ArrowRightLeft } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface TacticalPitchProps {
  squad: Player[];
  formation: TacticalFormation;
  onFormationChange: (f: TacticalFormation) => void;
  pitchSlots: PitchSlot[];
  onPitchSlotsChange: (slots: PitchSlot[]) => void;
  substituteIds: string[];
  onSubstituteIdsChange: (ids: string[]) => void;
  captainId?: string;
  onCaptainChange?: (id: string) => void;
  penaltyTakerId?: string;
  onPenaltyTakerChange?: (id: string) => void;
  freeKickTakerId?: string;
  onFreeKickTakerChange?: (id: string) => void;
  cornerTakerId?: string;
  onCornerTakerChange?: (id: string) => void;
  readOnly?: boolean;
}

export const TacticalPitch: React.FC<TacticalPitchProps> = ({
  squad,
  formation,
  onFormationChange,
  pitchSlots,
  onPitchSlotsChange,
  substituteIds,
  onSubstituteIdsChange,
  captainId,
  onCaptainChange,
  penaltyTakerId,
  onPenaltyTakerChange,
  freeKickTakerId,
  onFreeKickTakerChange,
  cornerTakerId,
  onCornerTakerChange,
  readOnly = false,
}) => {
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [benchModalOpen, setBenchModalOpen] = useState(false);

  // Map squad IDs for quick lookup
  const squadMap = new Map<string, Player>();
  squad.forEach(p => squadMap.set(p.id, p));

  const assignedPlayerIds = new Set(
    pitchSlots.map(s => s.playerId).filter(Boolean) as string[]
  );

  const availableForStartingXI = squad.filter(
    p => !assignedPlayerIds.has(p.id) && !substituteIds.includes(p.id)
  );

  const handleFormationSelect = (newForm: TacticalFormation) => {
    onFormationChange(newForm);
    const updated = getDefaultPitchSlots(newForm, pitchSlots);
    onPitchSlotsChange(updated);
  };

  const handleSlotClick = (index: number) => {
    if (readOnly) return;
    setSelectedSlotIndex(index);
  };

  const assignPlayerToSlot = (slotIndex: number, player: Player) => {
    const updated = [...pitchSlots];
    
    // Remove player if already in another slot
    updated.forEach((slot, idx) => {
      if (idx !== slotIndex && slot.playerId === player.id) {
        slot.playerId = undefined;
      }
    });

    // Remove player from bench if they were there
    if (substituteIds.includes(player.id)) {
      onSubstituteIdsChange(substituteIds.filter(id => id !== player.id));
    }

    updated[slotIndex] = {
      ...updated[slotIndex],
      playerId: player.id,
    };

    onPitchSlotsChange(updated);
    setSelectedSlotIndex(null);
  };

  const unassignSlot = (slotIndex: number) => {
    const updated = [...pitchSlots];
    const removedId = updated[slotIndex].playerId;
    updated[slotIndex] = {
      ...updated[slotIndex],
      playerId: undefined,
    };
    if (removedId && captainId === removedId && onCaptainChange) {
      onCaptainChange('');
    }
    onPitchSlotsChange(updated);
    setSelectedSlotIndex(null);
  };

  const toggleSubstitute = (player: Player) => {
    if (substituteIds.includes(player.id)) {
      onSubstituteIdsChange(substituteIds.filter(id => id !== player.id));
    } else {
      // Remove from starting XI if present
      const updated = pitchSlots.map(slot => 
        slot.playerId === player.id ? { ...slot, playerId: undefined } : slot
      );
      onPitchSlotsChange(updated);
      onSubstituteIdsChange([...substituteIds, player.id]);
    }
  };

  // Auto pick best starting 11 based on overall rating
  const autoAssignStartingXI = () => {
    const sorted = [...squad].sort((a, b) => {
      const ratA = a.statistics?.overallRating || 75;
      const ratB = b.statistics?.overallRating || 75;
      return ratB - ratA;
    });

    const currentSlots = getDefaultPitchSlots(formation);
    const newSlots = currentSlots.map((slot, idx) => ({
      ...slot,
      playerId: sorted[idx]?.id,
    }));

    const remainingSubIds = sorted.slice(11, 18).map(p => p.id);
    onPitchSlotsChange(newSlots);
    onSubstituteIdsChange(remainingSubIds);
    if (sorted[0] && onCaptainChange && !captainId) {
      onCaptainChange(sorted[0].id);
    }
  };

  const clearAllSlots = () => {
    const cleared = pitchSlots.map(s => ({ ...s, playerId: undefined }));
    onPitchSlotsChange(cleared);
    onSubstituteIdsChange([]);
  };

  const activeSlot = selectedSlotIndex !== null ? pitchSlots[selectedSlotIndex] : null;

  return (
    <div className="space-y-6">
      {/* Formation Selector & Top Bar */}
      {!readOnly && (
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">Formation:</span>
            <div className="flex flex-wrap gap-1.5">
              {(['4-3-3', '4-2-3-1', '4-4-2', '3-5-2', '3-4-3', '5-3-2', '4-1-4-1'] as TacticalFormation[]).map(form => (
                <button
                  key={form}
                  type="button"
                  onClick={() => handleFormationSelect(form)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                    formation === form
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {form}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={autoAssignStartingXI}
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
            >
              Auto Pick XI
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllSlots}
              leftIcon={<RotateCcw className="w-3.5 h-3.5 text-slate-400" />}
            >
              Reset
            </Button>
          </div>
        </div>
      )}

      {/* Main Pitch Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Pitch Container (Takes 8 cols) */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="relative w-full max-w-[560px] aspect-[1/1.4] bg-emerald-900 rounded-3xl border-4 border-emerald-950/80 shadow-2xl overflow-hidden select-none">
            {/* Turf Stripes Pattern */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,#064e3b_0px,#064e3b_40px,#065f46_40px,#065f46_80px)] opacity-95" />

            {/* Pitch Markings SVG Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 stroke-white fill-none stroke-[2]">
              {/* Outer Boundary */}
              <rect x="5%" y="4%" width="90%" height="92%" rx="8" />
              
              {/* Halfway Line */}
              <line x1="5%" y1="50%" x2="95%" y2="50%" />
              <circle cx="50%" cy="50%" r="14%" />
              <circle cx="50%" cy="50%" r="1%" className="fill-white" />

              {/* Top Penalty Area (Opponent Box) */}
              <rect x="22%" y="4%" width="56%" height="16%" />
              <rect x="36%" y="4%" width="28%" height="6%" />
              <circle cx="50%" cy="13%" r="1%" className="fill-white" />
              <path d="M 40% 20% A 10% 10% 0 0 0 60% 20%" />

              {/* Bottom Penalty Area (Bulbula Amen FC Box) */}
              <rect x="22%" y="80%" width="56%" height="16%" />
              <rect x="36%" y="90%" width="28%" height="6%" />
              <circle cx="50%" cy="87%" r="1%" className="fill-white" />
              <path d="M 40% 80% A 10% 10% 0 0 1 60% 80%" />

              {/* Corner Arcs */}
              <path d="M 5% 7% A 3% 3% 0 0 0 8% 4%" />
              <path d="M 95% 7% A 3% 3% 0 0 1 92% 4%" />
              <path d="M 5% 93% A 3% 3% 0 0 1 8% 96%" />
              <path d="M 95% 93% A 3% 3% 0 0 0 92% 96%" />
            </svg>

            {/* Team Goal Identifier */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-extrabold uppercase tracking-wider text-emerald-300/40 bg-emerald-950/60 px-3 py-0.5 rounded-full">
              Attacking Direction ↑
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-extrabold uppercase tracking-wider text-emerald-300/40 bg-emerald-950/60 px-3 py-0.5 rounded-full">
              Bulbula Amen FC Goal
            </div>

            {/* Pitch Interactive Player Slots */}
            {pitchSlots.map((slot, index) => {
              const player = slot.playerId ? squadMap.get(slot.playerId) : null;
              const isSelected = selectedSlotIndex === index;
              const isCaptain = player && captainId === player.id;
              const isPenalty = player && penaltyTakerId === player.id;
              const isFreeKick = player && freeKickTakerId === player.id;
              const isCorner = player && cornerTakerId === player.id;

              return (
                <div
                  key={slot.id || index}
                  style={{
                    left: `${slot.x}%`,
                    top: `${slot.y}%`,
                  }}
                  onClick={() => handleSlotClick(index)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer transition-all duration-200 group ${
                    isSelected ? 'scale-110 z-30' : 'hover:scale-105 z-20'
                  }`}
                >
                  {/* Player Card Marker / Circle */}
                  <div className="relative flex items-center justify-center">
                    {player ? (
                      <div className={`relative w-12 h-12 rounded-full overflow-hidden border-2 shadow-xl bg-slate-900 transition-all ${
                        isSelected 
                          ? 'border-yellow-400 ring-4 ring-yellow-400/30' 
                          : slot.roleName === 'GK'
                            ? 'border-amber-400 shadow-amber-900/50'
                            : 'border-emerald-400 shadow-emerald-950/60'
                      }`}>
                        <img
                          src={player.photoUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${player.id}`}
                          alt={player.fullName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${player.id}`;
                          }}
                        />
                        {/* Jersey Number Tag */}
                        <div className="absolute top-0 right-0 bg-slate-950/90 text-white font-black text-[9px] px-1 rounded-bl border-b border-l border-emerald-500/40">
                          {player.jerseyNumber}
                        </div>
                      </div>
                    ) : (
                      <div className={`w-11 h-11 rounded-full border-2 border-dashed flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur transition-all ${
                        isSelected 
                          ? 'border-yellow-400 bg-yellow-950/40 text-yellow-300' 
                          : 'border-white/50 text-white hover:border-emerald-300 hover:bg-emerald-950/60'
                      }`}>
                        <span className="text-[10px] font-black uppercase tracking-wider">{slot.roleName}</span>
                        {!readOnly && <UserPlus className="w-3 h-3 opacity-60 mt-0.5" />}
                      </div>
                    )}

                    {/* Role Badges (Captain, Penalty, etc) */}
                    {isCaptain && (
                      <div className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-yellow-400 text-slate-950 rounded-full font-black text-[10px] flex items-center justify-center shadow-lg border border-yellow-200" title="Team Captain">
                        C
                      </div>
                    )}
                    {isPenalty && !isCaptain && (
                      <div className="absolute -top-1.5 -left-1.5 w-4 h-4 bg-rose-500 text-white rounded-full font-black text-[9px] flex items-center justify-center shadow" title="Penalty Taker">
                        P
                      </div>
                    )}
                  </div>

                  {/* Player Name / Position Label Underneath */}
                  <div className="mt-1 flex flex-col items-center">
                    <span className="bg-slate-950/80 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-700/80 whitespace-nowrap shadow max-w-[90px] truncate text-center">
                      {player ? player.fullName.split(' ')[0] : slot.roleName}
                    </span>
                    {player && (
                      <span className="text-[9px] text-emerald-300 font-semibold tracking-wider">
                        {slot.roleName} • {player.statistics?.overallRating || 78} OVR
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tactical Control Sidebar (Takes 4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Slot Inspector / Player Picker */}
          {selectedSlotIndex !== null && activeSlot && (
            <div className="bg-slate-900 border border-yellow-500/40 rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-yellow-500/20 text-yellow-300 font-black rounded-lg text-xs">
                    {activeSlot.roleName}
                  </span>
                  <h4 className="text-sm font-bold text-white">Assign Position</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSlotIndex(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Current Assigned Player */}
              {activeSlot.playerId ? (
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 space-y-3">
                  {(() => {
                    const p = squadMap.get(activeSlot.playerId!);
                    if (!p) return null;
                    return (
                      <>
                        <div className="flex items-center gap-3">
                          <img
                            src={p.photoUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${p.id}`}
                            alt={p.fullName}
                            className="w-10 h-10 rounded-full object-cover border border-emerald-500"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{p.fullName}</p>
                            <p className="text-[11px] text-slate-400">#{p.jerseyNumber} • {p.position} • {p.statistics?.overallRating || 78} OVR</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => unassignSlot(selectedSlotIndex)}
                            className="text-rose-400 hover:text-rose-300 text-xs font-semibold px-2 py-1 bg-rose-500/10 rounded-lg"
                          >
                            Remove
                          </button>
                        </div>

                        {/* Special Role Toggles */}
                        <div className="pt-2 border-t border-slate-700/60 flex flex-wrap gap-1.5">
                          {onCaptainChange && (
                            <button
                              type="button"
                              onClick={() => onCaptainChange(captainId === p.id ? '' : p.id)}
                              className={`px-2 py-1 text-[10px] font-bold rounded-lg border flex items-center gap-1 ${
                                captainId === p.id 
                                  ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' 
                                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                              }`}
                            >
                              <Award className="w-3 h-3" /> Captain
                            </button>
                          )}
                          {onPenaltyTakerChange && (
                            <button
                              type="button"
                              onClick={() => onPenaltyTakerChange(penaltyTakerId === p.id ? '' : p.id)}
                              className={`px-2 py-1 text-[10px] font-bold rounded-lg border flex items-center gap-1 ${
                                penaltyTakerId === p.id 
                                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                              }`}
                            >
                              <Target className="w-3 h-3" /> Penalties
                            </button>
                          )}
                          {onFreeKickTakerChange && (
                            <button
                              type="button"
                              onClick={() => onFreeKickTakerChange(freeKickTakerId === p.id ? '' : p.id)}
                              className={`px-2 py-1 text-[10px] font-bold rounded-lg border flex items-center gap-1 ${
                                freeKickTakerId === p.id 
                                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' 
                                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                              }`}
                            >
                              <Flame className="w-3 h-3" /> Free Kicks
                            </button>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No player selected for {activeSlot.roleName}. Choose from available squad below:</p>
              )}

              {/* Available squad candidates */}
              <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Available Players</p>
                {availableForStartingXI.length === 0 ? (
                  <p className="text-xs text-slate-500 py-2">All squad players are currently assigned.</p>
                ) : (
                  availableForStartingXI.map(p => (
                    <div
                      key={p.id}
                      onClick={() => assignPlayerToSlot(selectedSlotIndex, p)}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
                          {p.jerseyNumber}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{p.fullName}</p>
                          <p className="text-[10px] text-slate-400">{p.position}</p>
                        </div>
                      </div>
                      <Badge variant="primary" size="sm">
                        {p.statistics?.overallRating || 78} OVR
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Substitutes / Bench Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Substitutes Bench</h4>
              </div>
              <Badge variant="slate" size="sm">
                {substituteIds.length} Selected
              </Badge>
            </div>

            {/* Bench Roster */}
            <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
              {substituteIds.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2 text-center">No substitutes assigned to the bench.</p>
              ) : (
                substituteIds.map(id => {
                  const p = squadMap.get(id);
                  if (!p) return null;
                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-slate-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                          {p.jerseyNumber}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{p.fullName}</p>
                          <p className="text-[10px] text-slate-400">{p.position}</p>
                        </div>
                      </div>
                      {!readOnly && (
                        <button
                          type="button"
                          onClick={() => toggleSubstitute(p)}
                          className="text-slate-400 hover:text-rose-400 p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Add to bench button */}
            {!readOnly && availableForStartingXI.length > 0 && (
              <div className="pt-2 border-t border-slate-800">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setBenchModalOpen(true)}
                  leftIcon={<UserPlus className="w-3.5 h-3.5" />}
                >
                  Add Bench Players ({availableForStartingXI.length})
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bench Selection Sub-Modal */}
      {benchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Select Bench Substitutes</h3>
              <button
                type="button"
                onClick={() => setBenchModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
              {availableForStartingXI.map(p => {
                const isBench = substituteIds.includes(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => toggleSubstitute(p)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                      isBench
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-700 text-white font-bold text-xs flex items-center justify-center">
                        {p.jerseyNumber}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-white">{p.fullName}</p>
                        <p className="text-[11px] text-slate-400">{p.position}</p>
                      </div>
                    </div>
                    <Badge variant={isBench ? 'primary' : 'slate'} size="sm">
                      {isBench ? 'Bench' : 'Add'}
                    </Badge>
                  </div>
                );
              })}
            </div>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => setBenchModalOpen(false)}
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

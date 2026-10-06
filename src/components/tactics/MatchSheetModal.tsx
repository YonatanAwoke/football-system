import React from 'react';
import { Match, Player } from '@/lib/types';
import { Printer, X, Shield, Award, Calendar, MapPin, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MatchSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match;
  squad: Player[];
}

export const MatchSheetModal: React.FC<MatchSheetModalProps> = ({
  isOpen,
  onClose,
  match,
  squad,
}) => {
  if (!isOpen) return null;

  const squadMap = new Map<string, Player>();
  squad.forEach(p => squadMap.set(p.id, p));

  const startingXI = match.startingXiIds.map(id => squadMap.get(id)).filter(Boolean) as Player[];
  const subs = match.substituteIds.map(id => squadMap.get(id)).filter(Boolean) as Player[];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Modal Action Header (hidden on print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 print:hidden">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h3 className="text-base font-bold text-white">Official Match Team Sheet</h3>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-4 h-4" />}
            >
              Print Match Sheet
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div className="p-8 bg-white text-slate-900 print:p-0 font-sans">
          {/* Official Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-800 text-white rounded-2xl flex items-center justify-center font-black text-2xl">
                ⚽
              </div>
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tight text-emerald-900">BULBULA AMEN FC</h1>
                <p className="text-xs font-bold text-slate-600 tracking-wider">OFFICIAL MATCH REPORT &amp; TEAM SHEET</p>
                <p className="text-[11px] text-slate-500">Addis Ababa, Ethiopia • Sub-City Football Federation</p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block bg-slate-100 border border-slate-300 px-3 py-1 rounded-lg text-xs font-mono font-bold text-slate-800">
                MATCH ID: {match.id}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Generated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Fixture Details Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Competition</span>
              <span className="font-bold text-slate-900 text-sm">{match.competition}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Date &amp; Kick-Off</span>
              <span className="font-bold text-slate-900 text-sm">{match.date} @ {match.time}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Venue / Stadium</span>
              <span className="font-bold text-slate-900 text-sm">{match.location}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Final Result</span>
              <span className="font-black text-slate-900 text-base">
                {match.scoreHome} - {match.scoreAway} ({match.status})
              </span>
            </div>
          </div>

          {/* Teams Header Banner */}
          <div className="flex items-center justify-around py-3 bg-emerald-950 text-white rounded-xl mb-6">
            <div className="text-center">
              <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold block">HOME TEAM</span>
              <h2 className="text-lg font-black">{match.teamName}</h2>
            </div>
            <span className="text-xl font-black text-emerald-400">VS</span>
            <div className="text-center">
              <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold block">AWAY TEAM</span>
              <h2 className="text-lg font-black">{match.opponent}</h2>
            </div>
          </div>

          {/* Starting XI & Substitutes Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Starting XI */}
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-4 py-2 border-b border-slate-300 flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Starting XI ({match.formation || '4-3-3'})
                </h3>
                <span className="text-[10px] font-bold text-slate-500">{startingXI.length} Players</span>
              </div>
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-1.5 w-10">No.</th>
                    <th className="px-3 py-1.5">Player Name</th>
                    <th className="px-3 py-1.5">Pos</th>
                    <th className="px-3 py-1.5 text-right">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {startingXI.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-4 text-center text-slate-400 italic">No Starting XI selected</td>
                    </tr>
                  ) : (
                    startingXI.map((p, idx) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="px-3 py-1.5 font-bold font-mono">{p.jerseyNumber}</td>
                        <td className="px-3 py-1.5 font-semibold">{p.fullName}</td>
                        <td className="px-3 py-1.5 text-slate-600">{p.position}</td>
                        <td className="px-3 py-1.5 text-right">
                          {match.captainId === p.id && <span className="font-bold text-amber-600 text-[10px]">(C) Captain</span>}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Substitutes & Events */}
            <div className="space-y-4">
              <div className="border border-slate-300 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-300 flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Substitutes Bench</h3>
                  <span className="text-[10px] font-bold text-slate-500">{subs.length} Players</span>
                </div>
                <table className="w-full text-xs text-left">
                  <tbody className="divide-y divide-slate-200">
                    {subs.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-3 py-3 text-center text-slate-400 italic">No bench players</td>
                      </tr>
                    ) : (
                      subs.map(p => (
                        <tr key={p.id}>
                          <td className="px-3 py-1.5 font-mono font-bold w-10">{p.jerseyNumber}</td>
                          <td className="px-3 py-1.5 font-semibold">{p.fullName}</td>
                          <td className="px-3 py-1.5 text-slate-600 text-right">{p.position}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Match Events Summary */}
              {match.events && match.events.length > 0 && (
                <div className="border border-slate-300 rounded-xl p-3 bg-slate-50 text-xs">
                  <h4 className="text-[10px] font-bold uppercase text-slate-600 mb-2">Key Match Events</h4>
                  <div className="space-y-1">
                    {match.events.map(e => (
                      <div key={e.id} className="flex items-center gap-2 text-[11px]">
                        <span className="font-mono font-bold text-emerald-800">{e.minute}&apos;</span>
                        <span className="font-semibold">{e.type}:</span>
                        <span>{e.playerName}</span>
                        {e.notes && <span className="text-slate-500 italic">({e.notes})</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Signatures & Official Approvals */}
          <div className="border-t-2 border-slate-300 pt-6 mt-6 grid grid-cols-3 gap-6 text-xs text-center">
            <div>
              <div className="border-b border-slate-400 pb-8 mb-2" />
              <p className="font-bold text-slate-800">Head Coach Signature</p>
              <p className="text-[10px] text-slate-500">Bulbula Amen FC</p>
            </div>
            <div>
              <div className="border-b border-slate-400 pb-8 mb-2" />
              <p className="font-bold text-slate-800">Opponent Team Official</p>
              <p className="text-[10px] text-slate-500">{match.opponent}</p>
            </div>
            <div>
              <div className="border-b border-slate-400 pb-8 mb-2" />
              <p className="font-bold text-slate-800">Match Referee / Official</p>
              <p className="text-[10px] text-slate-500">Sub-City Refereeing Board</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

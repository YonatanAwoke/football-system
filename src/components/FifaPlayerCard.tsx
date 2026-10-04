"use client";

import React, { useState } from 'react';
import { Player } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';

interface FifaPlayerCardProps {
  player: Player;
  onClick?: () => void;
  className?: string;
}

export default function FifaPlayerCard({ player, onClick, className = '' }: FifaPlayerCardProps) {
  const [imageError, setImageError] = useState(false);
  const { language, tContent } = useLanguage();

  const stats = player.statistics || {
    overallRating: 75,
    pace: 70,
    shooting: 70,
    passing: 70,
    dribbling: 70,
    defending: 70,
    physical: 70
  };

  const positionShort = player.position 
    ? player.position.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 3) 
    : 'ST';

  const displayName = language === 'am' && player.fullNameAmharic 
    ? player.fullNameAmharic 
    : player.fullName;

  const displayTeam = tContent(player.teamName);

  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/admin/players?search=${player.id}`;
    if (navigator.share) {
      navigator.share({
        title: `${player.fullName} — Bulbula Amen F.C.`,
        text: `Check out ${player.fullName}'s official player card!`,
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Print window or canvas download trigger
    const cardWindow = window.open('', '_blank');
    if (cardWindow) {
      cardWindow.document.write(`
        <html>
          <head>
            <title>${player.fullName} — FIFA Player Card</title>
            <style>
              body { font-family: sans-serif; display: flex; align-items: center; justify-center: center; min-height: 100vh; background: #f8fafc; margin: 0; }
              .card { width: 300px; padding: 20px; background: white; border-radius: 24px; border: 2px solid #cbd5e1; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
              .avatar { width: 120px; h-150px; object-fit: cover; border-radius: 16px; margin: 10px auto; border: 2px solid #e2e8f0; }
              .ovr { font-size: 36px; font-weight: 900; color: #0f172a; }
              .name { font-size: 16px; font-weight: 900; color: #f96302; margin-top: 8px; text-transform: uppercase; }
              .team { font-size: 12px; font-weight: 700; color: #64748b; }
              .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; margin-top: 12px; font-weight: 800; text-align: left; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="ovr">${stats.overallRating || 78} <span style="font-size:16px; color:#f96302;">${positionShort}</span></div>
              <img class="avatar" src="${player.photoUrl}" alt="${player.fullName}" />
              <div class="name">${displayName}</div>
              <div class="team">Bulbula Amen F.C. &bull; ${displayTeam} &bull; #${player.jerseyNumber}</div>
              <div class="stats">
                <div>PAC: ${stats.pace || 75}</div><div>DRI: ${stats.dribbling || 76}</div>
                <div>SHO: ${stats.shooting || 74}</div><div>DEF: ${stats.defending || 52}</div>
                <div>PAS: ${stats.passing || 72}</div><div>PHY: ${stats.physical || 70}</div>
              </div>
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `);
      cardWindow.document.close();
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        onClick={onClick}
        className={`group relative w-64 h-[390px] rounded-3xl p-1 bg-gradient-to-b from-white via-slate-100 to-slate-200 border-2 border-slate-300 shadow-md hover:shadow-2xl hover:border-brand-orange hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between select-none font-sans ${className}`}
      >
        {/* Inner Card Frame */}
        <div className="w-full h-full bg-gradient-to-b from-white via-slate-50 to-slate-100 rounded-[22px] p-4 flex flex-col justify-between relative border border-white">
          
          {/* Watermark Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none w-44 h-44 flex items-center justify-center">
            <img src="/logo.png" alt="Bulbula Amen F.C." className="w-full h-full object-contain" />
          </div>

          {/* TOP SECTION: OVR Rating & Position + Official Logo Header */}
          <div className="flex justify-between items-start z-10">
            <div className="flex flex-col items-center leading-none">
              <span className="text-3xl font-black tracking-tight text-slate-900 drop-shadow-sm">
                {stats.overallRating || 78}
              </span>
              <span className="text-xs font-black text-brand-orange uppercase tracking-wider mt-0.5">
                {positionShort}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <img 
                src="/logo.png" 
                alt="Bulbula Amen F.C." 
                className="w-9 h-9 object-contain drop-shadow-sm" 
              />
              <div className="flex flex-col items-end">
                <span className="w-6 h-6 rounded-lg bg-brand-orange text-white flex items-center justify-center font-black text-xs shadow-sm border border-brand-orange/40">
                  #{player.jerseyNumber || 10}
                </span>
              </div>
            </div>
          </div>

          {/* CENTER SECTION: Player Image */}
          <div className="relative my-auto flex justify-center items-center z-10 py-1">
            <div className="w-28 h-36 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-md bg-slate-100 flex items-center justify-center relative">
              {!imageError && player.photoUrl ? (
                <img 
                  src={player.photoUrl} 
                  alt={player.fullName}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-t from-slate-300 to-slate-100 flex items-center justify-center text-slate-400 font-extrabold text-2xl">
                  {player.firstName[0]}{player.lastName[0]}
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM SECTION: Player Name & Stats */}
          <div className="z-10 text-center space-y-2">
            {/* Player Name Banner */}
            <div className="py-1 border border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-sm rounded-xl">
              <h4 className="text-xs font-black text-slate-900 tracking-tight uppercase truncate px-1">
                {displayName}
              </h4>
            </div>

            {/* 6 Core FIFA Stats Grid */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] font-bold text-slate-700 pt-0.5">
              <div className="flex justify-between px-1">
                <span className="text-slate-400">{language === 'am' ? 'ፍጥነት' : 'PAC'}</span>
                <span className="font-extrabold text-slate-900">{stats.pace || 75}</span>
              </div>
              <div className="flex justify-between px-1">
                <span className="text-slate-400">{language === 'am' ? 'ክህሎት' : 'DRI'}</span>
                <span className="font-extrabold text-slate-900">{stats.dribbling || 76}</span>
              </div>
              <div className="flex justify-between px-1">
                <span className="text-slate-400">{language === 'am' ? 'ምታት' : 'SHO'}</span>
                <span className="font-extrabold text-brand-orange">{stats.shooting || 74}</span>
              </div>
              <div className="flex justify-between px-1">
                <span className="text-slate-400">{language === 'am' ? 'ተከላካይ' : 'DEF'}</span>
                <span className="font-extrabold text-slate-900">{stats.defending || 52}</span>
              </div>
              <div className="flex justify-between px-1">
                <span className="text-slate-400">{language === 'am' ? 'ቅብብል' : 'PAS'}</span>
                <span className="font-extrabold text-brand-blue">{stats.passing || 72}</span>
              </div>
              <div className="flex justify-between px-1">
                <span className="text-slate-400">{language === 'am' ? 'ጉልበት' : 'PHY'}</span>
                <span className="font-extrabold text-slate-900">{stats.physical || 70}</span>
              </div>
            </div>

            {/* Footer Ribbon Branding */}
            <div className="pt-1 flex items-center justify-center gap-1 text-[10px] font-black text-brand-navy uppercase tracking-widest">
              <span>{language === 'am' ? 'ቡልቡላ አመን' : 'BULBULA AMEN F.C.'}</span>
              <span className="text-brand-orange">&bull;</span>
              <span className="text-brand-orange">{displayTeam}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Below Card */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDownload}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center gap-1"
        >
          📥 Download Card
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="px-3 py-1.5 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
        >
          {copied ? '✓ Link Copied' : '🔗 Share Card'}
        </button>
      </div>
    </div>
  );
}

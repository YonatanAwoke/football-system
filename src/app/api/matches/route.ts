import { NextResponse } from 'next/server';
import { getMatches, saveMatch, getPlayers, savePlayer, addAuditLog } from '@/lib/db';
import { Match } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get('teamId');
  let matches = getMatches();

  if (teamId) {
    matches = matches.filter(m => m.teamId === teamId);
  }

  return NextResponse.json({ success: true, data: matches });
}

export async function POST(request: Request) {
  try {
    const body = await request.json(); // { teamId, teamName, opponent, date, time, location, competition, isHome, scoreHome, scoreAway, events, startingXiIds, substituteIds }
    const matchCount = getMatches().length + 1;
    const id = `MTC-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${matchCount}`;

    const newMatch: Match = {
      id,
      teamId: body.teamId || 'TEAM-U18',
      teamName: body.teamName || 'U18 Seniors',
      opponent: body.opponent || 'St. George Youth FC',
      date: body.date || new Date().toISOString().split('T')[0],
      time: body.time || '15:00',
      location: body.location || 'Abebe Bikila Stadium',
      competition: body.competition || 'Sub-City Youth Cup',
      isHome: body.isHome !== false,
      scoreHome: Number(body.scoreHome) || 0,
      scoreAway: Number(body.scoreAway) || 0,
      status: body.status || 'COMPLETED',
      motmPlayerId: body.motmPlayerId,
      motmPlayerName: body.motmPlayerName,
      startingXiIds: body.startingXiIds || [],
      substituteIds: body.substituteIds || [],
      events: body.events || [],
      createdAt: new Date().toISOString()
    };

    saveMatch(newMatch);

    // Auto-update player statistics based on match events!
    const players = getPlayers();

    // 1. Increment games played for starting XI and substitutes
    const matchParticipants = new Set([...newMatch.startingXiIds, ...newMatch.substituteIds]);
    matchParticipants.forEach(playerId => {
      const player = players.find(p => p.id === playerId);
      if (player) {
        if (!player.statistics) {
          player.statistics = {
            overallRating: 78, pace: 75, shooting: 75, passing: 75, dribbling: 75, defending: 50, physical: 70,
            gamesPlayed: 1, gamesStarted: newMatch.startingXiIds.includes(playerId) ? 1 : 0,
            minutesPlayed: 90, goals: 0, assists: 0, yellowCards: 0, redCards: 0, trainingAttendance: 90
          };
        } else {
          player.statistics.gamesPlayed += 1;
          if (newMatch.startingXiIds.includes(playerId)) {
            player.statistics.gamesStarted += 1;
          }
          player.statistics.minutesPlayed += 90;
        }
        savePlayer(player);
      }
    });

    // 2. Increment goals, assists, cards from match events
    newMatch.events.forEach(evt => {
      const player = players.find(p => p.id === evt.playerId);
      if (player && player.statistics) {
        if (evt.type === 'GOAL') player.statistics.goals += 1;
        if (evt.type === 'ASSIST') player.statistics.assists += 1;
        if (evt.type === 'YELLOW') player.statistics.yellowCards += 1;
        if (evt.type === 'RED') player.statistics.redCards += 1;
        savePlayer(player);
      }
    });

    addAuditLog({
      userId: 'USR-002',
      userName: 'Manager Bekele',
      userRole: 'MANAGER',
      action: `Recorded match result: ${newMatch.teamName} ${newMatch.scoreHome} - ${newMatch.scoreAway} ${newMatch.opponent}`,
      affectedRecordId: newMatch.id,
      affectedRecordType: 'Match',
      ipAddress: '127.0.0.1'
    });

    return NextResponse.json({ success: true, data: newMatch });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

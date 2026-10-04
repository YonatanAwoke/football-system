import { NextResponse } from 'next/server';
import { getAttendance, saveAttendanceSession, getPlayers, savePlayer, addAuditLog } from '@/lib/db';
import { AttendanceSession } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get('teamId');
  let sessions = getAttendance();

  if (teamId) {
    sessions = sessions.filter(s => s.teamId === teamId);
  }

  return NextResponse.json({ success: true, data: sessions });
}

export async function POST(request: Request) {
  try {
    const body = await request.json(); // { teamId, teamName, sessionDate, sessionType, coachName, records }
    const sessionDate = body.sessionDate || new Date().toISOString().split('T')[0];
    const id = `ATT-${sessionDate.replace(/-/g, '')}-${body.teamId || 'TEAM'}`;

    const newSession: AttendanceSession = {
      id,
      teamId: body.teamId || 'TEAM-U13',
      teamName: body.teamName || 'U13 Premier',
      sessionDate,
      sessionType: body.sessionType || 'Training',
      coachName: body.coachName || 'Coach Abebe',
      records: body.records || [],
      createdAt: new Date().toISOString()
    };

    saveAttendanceSession(newSession);

    // Update player attendance percentage on profile!
    const players = getPlayers();
    const allSessions = getAttendance();

    newSession.records.forEach(rec => {
      const player = players.find(p => p.id === rec.playerId);
      if (player) {
        // Calculate attendance % for this player across all sessions
        const playerRecords = allSessions
          .flatMap(s => s.records)
          .filter(r => r.playerId === player.id);
        
        const total = playerRecords.length;
        const presentCount = playerRecords.filter(r => r.status === 'PRESENT').length;
        const attendancePercent = total > 0 ? Math.round((presentCount / total) * 100) : 100;

        if (!player.statistics) {
          player.statistics = {
            overallRating: 75, pace: 70, shooting: 70, passing: 70, dribbling: 70, defending: 70, physical: 70,
            gamesPlayed: 0, gamesStarted: 0, minutesPlayed: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0,
            trainingAttendance: attendancePercent
          };
        } else {
          player.statistics.trainingAttendance = attendancePercent;
        }
        savePlayer(player);
      }
    });

    addAuditLog({
      userId: 'USR-003',
      userName: body.coachName || 'Coach',
      userRole: 'COACH',
      action: `Recorded attendance session for ${newSession.teamName} on ${newSession.sessionDate}`,
      affectedRecordId: newSession.id,
      affectedRecordType: 'AttendanceSession',
      ipAddress: '127.0.0.1'
    });

    return NextResponse.json({ success: true, data: newSession });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

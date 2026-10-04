import { NextResponse } from 'next/server';
import { getPlayers, savePlayer, addAuditLog, getTeams } from '@/lib/db';
import { Player } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get('teamId');
  const status = searchParams.get('status');
  const search = searchParams.get('search')?.toLowerCase();

  let players = getPlayers();

  if (teamId) {
    players = players.filter(p => p.teamId === teamId);
  }
  if (status) {
    players = players.filter(p => p.status === status);
  }
  if (search) {
    players = players.filter(p => 
      p.fullName.toLowerCase().includes(search) || 
      p.id.toLowerCase().includes(search) ||
      p.phone.includes(search) ||
      p.position.toLowerCase().includes(search)
    );
  }

  return NextResponse.json({ success: true, data: players });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const teams = getTeams();
    const targetTeam = teams.find(t => t.id === body.teamId);

    // Auto-generate Player ID
    const count = getPlayers().length + 1;
    const teamShort = targetTeam ? targetTeam.shortName.toUpperCase() : 'CLUB';
    const id = `BFC-${teamShort}-${String(count).padStart(4, '0')}`;

    const newPlayer: Player = {
      id,
      firstName: body.firstName || '',
      middleName: body.middleName || '',
      lastName: body.lastName || '',
      fullName: body.fullName || `${body.firstName} ${body.middleName} ${body.lastName}`.trim(),
      dateOfBirth: body.dateOfBirth || '2012-01-01',
      age: body.age || 13,
      gender: body.gender || 'Male',
      nationality: body.nationality || 'Ethiopian',
      placeOfBirth: body.placeOfBirth || 'Addis Ababa',
      phone: body.phone || '',
      address: body.address || '',
      photoUrl: body.photoUrl || 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=300&auto=format&fit=crop&q=80',
      teamId: body.teamId || 'TEAM-U13',
      teamName: targetTeam ? targetTeam.name : 'U13 Premier',
      jerseyNumber: body.jerseyNumber || 10,
      position: body.position || 'Midfielder',
      status: body.status || 'ACTIVE',
      registrationStatus: 'ACTIVE',
      paymentStatus: body.paymentStatus || 'VERIFIED',
      registrationDate: new Date().toISOString().split('T')[0],
      publicVisible: body.publicVisible ?? true,
      statistics: body.statistics || {
        overallRating: 75,
        pace: 75,
        shooting: 70,
        passing: 70,
        dribbling: 72,
        defending: 50,
        physical: 68,
        gamesPlayed: 0,
        gamesStarted: 0,
        minutesPlayed: 0,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        trainingAttendance: 100
      },
      parentInfo: body.parentInfo || {
        fullName: 'N/A',
        relationship: 'Parent',
        phone: '',
        email: '',
        nationalIdNumber: '',
        nationalIdDocUrl: '',
        residenceIdNumber: '',
        residenceIdDocUrl: ''
      },
      documents: body.documents || {
        birthCertificateNumber: '',
        birthCertificateDocUrl: '',
        parentNationalIdDocUrl: '',
        parentResidenceIdDocUrl: ''
      },
      feeSchedule: body.feeSchedule || {
        registrationFee: targetTeam?.registrationFee || 3500,
        monthlyFee: targetTeam?.monthlyFee || 1500,
        uniformFee: targetTeam?.uniformFee || 1200,
        totalPaid: targetTeam?.registrationFee || 3500,
        currentBalance: 0,
        nextPaymentDueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
        paymentStatus: 'PAID'
      }
    };

    savePlayer(newPlayer);

    addAuditLog({
      userId: body.authorId || 'USR-001',
      userName: body.authorName || 'System Admin',
      userRole: body.authorRole || 'ADMIN',
      action: `Added new player ${newPlayer.fullName} (${newPlayer.id}) to ${newPlayer.teamName}`,
      affectedRecordId: newPlayer.id,
      affectedRecordType: 'Player',
      newValue: JSON.stringify({ name: newPlayer.fullName, team: newPlayer.teamName }),
      ipAddress: '127.0.0.1'
    });

    return NextResponse.json({ success: true, data: newPlayer });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updated = savePlayer(body);

    addAuditLog({
      userId: body.authorId || 'USR-001',
      userName: body.authorName || 'System Admin',
      userRole: body.authorRole || 'ADMIN',
      action: `Updated player ${updated.fullName} (${updated.id})`,
      affectedRecordId: updated.id,
      affectedRecordType: 'Player',
      newValue: `Updated details for ${updated.id}`,
      ipAddress: '127.0.0.1'
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('id');
    if (!playerId) {
      return NextResponse.json({ success: false, error: 'Player ID parameter is required' }, { status: 400 });
    }

    const { deletePlayer } = await import('@/lib/db');
    deletePlayer(playerId);

    addAuditLog({
      userId: 'USR-001',
      userName: 'Administrator',
      userRole: 'ADMIN',
      action: `Deleted player ${playerId}`,
      affectedRecordId: playerId,
      affectedRecordType: 'Player',
      ipAddress: '127.0.0.1'
    });

    return NextResponse.json({ success: true, message: 'Player deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

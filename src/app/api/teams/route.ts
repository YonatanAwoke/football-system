import { NextResponse } from 'next/server';
import { getTeams, saveTeam, addAuditLog } from '@/lib/db';
import { Team } from '@/lib/types';

export async function GET() {
  const teams = getTeams();
  return NextResponse.json({ success: true, data: teams });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const short = (body.shortName || body.name.split(' ')[0]).toUpperCase();
    const id = `TEAM-${short}`;

    const newTeam: Team = {
      id,
      name: body.name,
      shortName: short,
      category: body.category || 'Youth Academy',
      description: body.description || '',
      ageRange: body.ageRange || 'Under 16',
      gender: body.gender || 'Male',
      trainingDays: body.trainingDays || 'Monday / Wednesday / Friday',
      trainingTime: body.trainingTime || '4:00 PM – 5:30 PM',
      location: body.location || 'Bulbula Amen Pitch',
      registrationFee: Number(body.registrationFee) || 3500,
      monthlyFee: Number(body.monthlyFee) || 1500,
      uniformFee: Number(body.uniformFee) || 1200,
      coachName: body.coachName || 'Unassigned Coach',
      photoUrl: body.photoUrl || 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&auto=format&fit=crop&q=80',
      active: true,
      activePlayerCount: 0
    };

    saveTeam(newTeam);

    addAuditLog({
      userId: body.authorId || 'USR-001',
      userName: body.authorName || 'Super Admin',
      userRole: body.authorRole || 'SUPER_ADMIN',
      action: `Created new team ${newTeam.name} (${newTeam.id})`,
      affectedRecordId: newTeam.id,
      affectedRecordType: 'Team',
      newValue: JSON.stringify({ name: newTeam.name, fee: newTeam.monthlyFee }),
      ipAddress: '127.0.0.1'
    });

    return NextResponse.json({ success: true, data: newTeam });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updated = saveTeam(body);

    addAuditLog({
      userId: body.authorId || 'USR-001',
      userName: body.authorName || 'Admin',
      userRole: body.authorRole || 'ADMIN',
      action: `Updated team configuration for ${updated.name}`,
      affectedRecordId: updated.id,
      affectedRecordType: 'Team',
      newValue: JSON.stringify({ name: updated.name, fees: { reg: updated.registrationFee, monthly: updated.monthlyFee } }),
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
    const teamId = searchParams.get('id');
    if (!teamId) {
      return NextResponse.json({ success: false, error: 'Team ID parameter is required' }, { status: 400 });
    }

    const { deleteTeam } = await import('@/lib/db');
    deleteTeam(teamId);

    addAuditLog({
      userId: 'USR-001',
      userName: 'Administrator',
      userRole: 'ADMIN',
      action: `Deleted/Archived team ${teamId}`,
      affectedRecordId: teamId,
      affectedRecordType: 'Team',
      ipAddress: '127.0.0.1'
    });

    return NextResponse.json({ success: true, message: 'Team deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

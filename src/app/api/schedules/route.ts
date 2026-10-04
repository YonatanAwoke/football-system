import { NextResponse } from 'next/server';
import { getSchedules, saveSchedule, deleteSchedule, addAuditLog } from '@/lib/db';
import { TrainingSchedule } from '@/lib/types';

export async function GET() {
  try {
    const schedules = getSchedules();
    return NextResponse.json({ success: true, data: schedules });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body: Partial<TrainingSchedule> = await req.json();
    if (!body.teamId || !body.teamName || !body.sessionDate) {
      return NextResponse.json({ success: false, error: 'Team ID, Team Name, and Session Date are required' }, { status: 400 });
    }

    const newSchedule: TrainingSchedule = {
      id: body.id || `SCH-${Date.now()}`,
      teamId: body.teamId,
      teamName: body.teamName,
      coachId: body.coachId,
      coachName: body.coachName || 'Coach Ashenafi Bekele',
      sessionDate: body.sessionDate,
      dayOfWeek: body.dayOfWeek || 'Saturday',
      startTime: body.startTime || '9:00 AM',
      endTime: body.endTime || '10:30 AM',
      location: body.location || 'Bulbula Amen Pitch 1',
      sessionType: body.sessionType || 'Training',
      notes: body.notes,
      status: body.status || 'SCHEDULED'
    };

    saveSchedule(newSchedule);

    addAuditLog({
      userId: 'USR-001',
      userName: 'Administrator',
      userRole: 'ADMIN',
      action: `Created training schedule for ${newSchedule.teamName} on ${newSchedule.sessionDate}`,
      affectedRecordId: newSchedule.id,
      affectedRecordType: 'Schedule',
      newValue: JSON.stringify(newSchedule),
      ipAddress: '127.0.0.1'
    });

    return NextResponse.json({ success: true, data: newSchedule });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body: TrainingSchedule = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Schedule ID is required' }, { status: 400 });
    }

    saveSchedule(body);

    addAuditLog({
      userId: 'USR-001',
      userName: 'Administrator',
      userRole: 'ADMIN',
      action: `Updated training schedule ${body.id} (${body.status})`,
      affectedRecordId: body.id,
      affectedRecordType: 'Schedule',
      newValue: JSON.stringify(body),
      ipAddress: '127.0.0.1'
    });

    return NextResponse.json({ success: true, data: body });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const scheduleId = searchParams.get('id');
    if (!scheduleId) {
      return NextResponse.json({ success: false, error: 'Schedule ID is required' }, { status: 400 });
    }

    deleteSchedule(scheduleId);

    addAuditLog({
      userId: 'USR-001',
      userName: 'Administrator',
      userRole: 'ADMIN',
      action: `Deleted training schedule ${scheduleId}`,
      affectedRecordId: scheduleId,
      affectedRecordType: 'Schedule',
      ipAddress: '127.0.0.1'
    });

    return NextResponse.json({ success: true, message: 'Schedule deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

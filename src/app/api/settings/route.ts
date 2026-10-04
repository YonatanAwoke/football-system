import { NextResponse } from 'next/server';
import { getSettings, saveSettings, resetDatabaseToSeedData, addAuditLog } from '@/lib/db';
import { ClubSettings } from '@/lib/types';

export async function GET() {
  try {
    const settings = getSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body: ClubSettings = await req.json();
    if (!body.clubName) {
      return NextResponse.json({ success: false, error: 'Club Name is required' }, { status: 400 });
    }

    const prevSettings = getSettings();
    saveSettings(body);

    addAuditLog({
      userId: 'USR-001',
      userName: 'Super Administrator',
      userRole: 'SUPER_ADMIN',
      action: `Updated Club Settings & Operational Configuration`,
      affectedRecordId: 'SETTINGS',
      affectedRecordType: 'ClubSettings',
      previousValue: JSON.stringify(prevSettings),
      newValue: JSON.stringify(body),
      ipAddress: '127.0.0.1'
    });

    return NextResponse.json({ success: true, data: body });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.action === 'RESET_SEED') {
      const resetDb = resetDatabaseToSeedData();
      
      addAuditLog({
        userId: 'USR-001',
        userName: 'Super Administrator',
        userRole: 'SUPER_ADMIN',
        action: 'Reset system database to fresh demo seed data (10 players per team)',
        affectedRecordId: 'DATABASE',
        affectedRecordType: 'Database',
        ipAddress: '127.0.0.1'
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Database reset to demo seed data successfully', 
        data: resetDb.settings 
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

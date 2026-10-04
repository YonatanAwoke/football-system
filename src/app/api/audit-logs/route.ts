import { NextResponse } from 'next/server';
import { getAuditLogs, addAuditLog } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userRole = searchParams.get('role');
    const action = searchParams.get('action');
    const recordType = searchParams.get('type');

    let logs = getAuditLogs();

    if (userRole) {
      logs = logs.filter(l => l.userRole === userRole);
    }
    if (action) {
      logs = logs.filter(l => l.action.toLowerCase().includes(action.toLowerCase()));
    }
    if (recordType) {
      logs = logs.filter(l => l.affectedRecordType === recordType);
    }

    return NextResponse.json({ success: true, data: logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.action) {
      return NextResponse.json({ success: false, error: 'Audit action description is required' }, { status: 400 });
    }

    const newLog = addAuditLog({
      userId: body.userId || 'USR-001',
      userName: body.userName || 'System Administrator',
      userRole: body.userRole || 'SUPER_ADMIN',
      action: body.action,
      affectedRecordId: body.affectedRecordId || 'SYS-01',
      affectedRecordType: body.affectedRecordType || 'System',
      previousValue: body.previousValue,
      newValue: body.newValue,
      ipAddress: body.ipAddress || '127.0.0.1'
    });

    return NextResponse.json({ success: true, data: newLog });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

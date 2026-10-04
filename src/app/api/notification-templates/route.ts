import { NextResponse } from 'next/server';
import { getNotificationTemplates, saveNotificationTemplate, addAuditLog } from '@/lib/db';
import { NotificationTemplate } from '@/lib/types';

export async function GET() {
  try {
    const templates = getNotificationTemplates();
    return NextResponse.json({ success: true, data: templates });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body: NotificationTemplate = await req.json();
    if (!body.id || !body.eventType) {
      return NextResponse.json({ success: false, error: 'Template ID and eventType are required' }, { status: 400 });
    }

    saveNotificationTemplate(body);

    addAuditLog({
      userId: 'USR-001',
      userName: 'Administrator',
      userRole: 'ADMIN',
      action: `Updated notification template for event: ${body.eventType}`,
      affectedRecordId: body.id,
      affectedRecordType: 'NotificationTemplate',
      newValue: JSON.stringify(body),
      ipAddress: '127.0.0.1'
    });

    return NextResponse.json({ success: true, data: body });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

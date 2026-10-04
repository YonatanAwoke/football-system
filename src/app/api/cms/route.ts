import { NextResponse } from 'next/server';
import { getCMSContent, saveCMSContent, addAuditLog } from '@/lib/db';

export async function GET() {
  const cms = getCMSContent();
  return NextResponse.json({ success: true, data: cms });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updated = saveCMSContent(body.cms || body);

    addAuditLog({
      userId: body.authorId || 'USR-001',
      userName: body.authorName || 'CMS Admin',
      userRole: body.authorRole || 'ADMIN',
      action: `Updated public website CMS homepage & announcements`,
      affectedRecordId: 'CMS_MAIN',
      affectedRecordType: 'CMSContent',
      newValue: 'CMS updated',
      ipAddress: '127.0.0.1'
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

import { NextResponse } from 'next/server';
import { getNotifications, addNotification, markNotificationsRead } from '@/lib/db';

export async function GET() {
  const notifs = getNotifications();
  return NextResponse.json({ success: true, data: notifs });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newNotif = addNotification({
      recipientRole: body.recipientRole || 'ALL',
      recipientPhone: body.recipientPhone,
      recipientEmail: body.recipientEmail,
      recipientName: body.recipientName,
      title: body.title,
      message: body.message,
      channel: body.channel || 'IN_APP',
      status: 'SENT',
      linkUrl: body.linkUrl,
      type: body.type || 'SYSTEM_ALERT'
    });
    return NextResponse.json({ success: true, data: newNotif });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function PUT() {
  markNotificationsRead();
  return NextResponse.json({ success: true, message: 'All notifications marked as read' });
}

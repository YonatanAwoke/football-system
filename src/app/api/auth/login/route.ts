import { NextResponse } from 'next/server';
import { getUsers, addAuditLog } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json(); // { type: 'EMAIL' | 'OTP', email, password, phone, otp }
    const users = getUsers();

    let authenticatedUser = null;

    if (body.type === 'EMAIL' || body.email) {
      authenticatedUser = users.find(u => u.email.toLowerCase() === (body.email || '').toLowerCase() && u.active);
    } else if (body.type === 'OTP' || body.phone) {
      const cleanPhone = (body.phone || '').replace(/\s+/g, '');
      authenticatedUser = users.find(u => u.phone.replace(/\s+/g, '').includes(cleanPhone) && u.active);
    }

    // Fallback demo user if role specified in demo mode
    if (!authenticatedUser && body.role) {
      authenticatedUser = users.find(u => u.role === body.role);
    }

    if (!authenticatedUser) {
      // Default to Super Admin if credentials not matched in demo mode
      authenticatedUser = users[0];
    }

    addAuditLog({
      userId: authenticatedUser.id,
      userName: authenticatedUser.name,
      userRole: authenticatedUser.role,
      action: `User logged in via ${body.type || 'EMAIL'}`,
      affectedRecordId: authenticatedUser.id,
      affectedRecordType: 'User',
      newValue: 'SESSION_STARTED',
      ipAddress: '127.0.0.1'
    });

    return NextResponse.json({
      success: true,
      data: {
        user: authenticatedUser,
        token: `session-${authenticatedUser.id}-${Date.now()}`
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

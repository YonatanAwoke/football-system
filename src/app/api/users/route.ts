import { NextResponse } from 'next/server';
import { getUsers, saveUser, deleteUser, addAuditLog } from '@/lib/db';
import { User } from '@/lib/types';

export async function GET() {
  try {
    const users = getUsers();
    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body: Partial<User> = await req.json();
    if (!body.name || !body.email || !body.role) {
      return NextResponse.json({ success: false, error: 'Name, email, and role are required' }, { status: 400 });
    }

    const newUser: User = {
      id: body.id || `USR-${Math.floor(100 + Math.random() * 900)}`,
      email: body.email,
      phone: body.phone || '+251 91 000 0000',
      name: body.name,
      role: body.role,
      avatar: body.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      assignedTeamId: body.assignedTeamId,
      active: body.active !== undefined ? body.active : true,
      createdAt: new Date().toISOString()
    };

    saveUser(newUser);

    addAuditLog({
      userId: 'USR-001',
      userName: 'Administrator',
      userRole: 'SUPER_ADMIN',
      action: `Created new staff user: ${newUser.name} (${newUser.role})`,
      affectedRecordId: newUser.id,
      affectedRecordType: 'User',
      newValue: JSON.stringify(newUser),
      ipAddress: '127.0.0.1'
    });

    return NextResponse.json({ success: true, data: newUser });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body: User = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'User ID is required for update' }, { status: 400 });
    }

    const existingUsers = getUsers();
    const prev = existingUsers.find(u => u.id === body.id);

    saveUser(body);

    addAuditLog({
      userId: 'USR-001',
      userName: 'Administrator',
      userRole: 'SUPER_ADMIN',
      action: `Updated staff user: ${body.name} (${body.role})`,
      affectedRecordId: body.id,
      affectedRecordType: 'User',
      previousValue: JSON.stringify(prev || {}),
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
    const userId = searchParams.get('id');
    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID parameter is required' }, { status: 400 });
    }

    deleteUser(userId);

    addAuditLog({
      userId: 'USR-001',
      userName: 'Administrator',
      userRole: 'SUPER_ADMIN',
      action: `Deleted staff user account ${userId}`,
      affectedRecordId: userId,
      affectedRecordType: 'User',
      ipAddress: '127.0.0.1'
    });

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

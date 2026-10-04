import { NextResponse } from 'next/server';
import { getRegistrations, saveRegistration, savePlayer, addAuditLog, addNotification, getTeams, getPlayers } from '@/lib/db';
import { Registration, Player } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  let regs = getRegistrations();

  if (status) {
    regs = regs.filter(r => r.status === status);
  }

  return NextResponse.json({ success: true, data: regs });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const count = getRegistrations().length + 1047;
    const id = `REG-${count}`;

    const newReg: Registration = {
      id,
      applicantName: body.parentData?.fullName || 'Parent Applicant',
      playerFullName: body.playerData?.fullName || `${body.playerData?.firstName} ${body.playerData?.lastName}`,
      playerDateOfBirth: body.playerData?.dateOfBirth || '2013-01-01',
      gender: body.playerData?.gender || 'Male',
      teamId: body.teamId,
      teamName: body.teamName,
      phone: body.parentData?.phone || body.phone,
      email: body.parentData?.email || body.email,
      submittedAt: new Date().toISOString(),
      status: 'PENDING_REVIEW',
      paymentStatus: 'PENDING',
      playerData: body.playerData,
      parentData: body.parentData,
      documents: body.documents
    };

    saveRegistration(newReg);

    // Create system notification for managers
    addNotification({
      recipientRole: 'MANAGER',
      title: 'New Registration Submitted',
      message: `Application ${id} for ${newReg.playerFullName} (${newReg.teamName}) is pending review.`,
      channel: 'IN_APP',
      status: 'SENT',
      linkUrl: '/admin/registrations',
      type: 'REGISTRATION_ALERT'
    });

    addAuditLog({
      userId: 'PUBLIC',
      userName: newReg.applicantName,
      userRole: 'MANAGER',
      action: `Submitted public registration application ${id} for ${newReg.playerFullName}`,
      affectedRecordId: id,
      affectedRecordType: 'Registration',
      newValue: JSON.stringify({ player: newReg.playerFullName, team: newReg.teamName }),
      ipAddress: '127.0.0.1'
    });

    return NextResponse.json({ success: true, data: newReg });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json(); // { registrationId, action: 'APPROVE'|'REJECT'|'VERIFY_PAYMENT', notes, user }
    const { registrationId, action, notes, user, paymentProofUrl, extractedTransactionId } = body;

    const regs = getRegistrations();
    const reg = regs.find(r => r.id === registrationId);

    if (!reg) {
      return NextResponse.json({ success: false, error: 'Registration not found' }, { status: 404 });
    }

    if (action === 'APPROVE') {
      reg.status = 'AWAITING_PAYMENT';
      reg.reviewedBy = `${user.name} (${user.role})`;
      reg.reviewedAt = new Date().toISOString();
      saveRegistration(reg);

      addNotification({
        recipientPhone: reg.phone,
        recipientName: reg.applicantName,
        title: 'Registration Approved - Action Required',
        message: `Your registration for ${reg.playerFullName} has been approved! Please complete the registration payment to finalize enrollment.`,
        channel: 'SMS',
        status: 'SENT',
        linkUrl: '/upload-payment',
        type: 'REGISTRATION_ALERT'
      });

      addAuditLog({
        userId: user.id || 'USR-003',
        userName: user.name || 'Manager',
        userRole: user.role || 'MANAGER',
        action: `Approved registration ${reg.id} for ${reg.playerFullName}`,
        affectedRecordId: reg.id,
        affectedRecordType: 'Registration',
        previousValue: 'PENDING_REVIEW',
        newValue: 'AWAITING_PAYMENT',
        ipAddress: '127.0.0.1'
      });
    } else if (action === 'SUBMIT_PAYMENT_PROOF') {
      reg.status = 'PAYMENT_VERIFICATION';
      reg.paymentStatus = 'SUBMITTED';
      reg.paymentProofUrl = paymentProofUrl;
      reg.extractedTransactionId = extractedTransactionId;
      saveRegistration(reg);

      addNotification({
        recipientRole: 'FINANCE_OFFICER',
        title: 'Payment Proof Uploaded',
        message: `Payment proof submitted for ${reg.playerFullName} (${extractedTransactionId || 'Pending ID'}). Finance verification needed.`,
        channel: 'IN_APP',
        status: 'SENT',
        linkUrl: '/admin/payments',
        type: 'PAYMENT_REMINDER'
      });
    } else if (action === 'VERIFY_PAYMENT') {
      reg.status = 'ACTIVE';
      reg.paymentStatus = 'VERIFIED';
      saveRegistration(reg);

      // AUTO CREATE OFFICIAL PLAYER PROFILE
      const teams = getTeams();
      const targetTeam = teams.find(t => t.id === reg.teamId);
      const teamShort = targetTeam ? targetTeam.shortName.toUpperCase() : 'CLUB';
      const count = getPlayers().length + 1;
      const playerId = `BFC-${teamShort}-${String(count).padStart(4, '0')}`;

      const newPlayer: Player = {
        id: playerId,
        firstName: reg.playerData?.firstName || '',
        middleName: reg.playerData?.middleName || '',
        lastName: reg.playerData?.lastName || '',
        fullName: reg.playerFullName,
        dateOfBirth: reg.playerDateOfBirth,
        age: reg.playerData?.age || 13,
        gender: reg.gender,
        nationality: reg.playerData?.nationality || 'Ethiopian',
        placeOfBirth: reg.playerData?.placeOfBirth || 'Addis Ababa',
        phone: reg.playerData?.phone || reg.phone,
        address: reg.playerData?.address || 'Addis Ababa',
        photoUrl: reg.playerData?.photoUrl || 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=300&auto=format&fit=crop&q=80',
        teamId: reg.teamId,
        teamName: reg.teamName,
        jerseyNumber: reg.playerData?.jerseyNumber || 10,
        position: reg.playerData?.position || 'Forward',
        status: 'ACTIVE',
        registrationStatus: 'ACTIVE',
        paymentStatus: 'VERIFIED',
        registrationDate: new Date().toISOString().split('T')[0],
        publicVisible: true,
        registrationId: reg.id,
        statistics: {
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
        parentInfo: reg.parentData,
        documents: reg.documents,
        feeSchedule: {
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

      addNotification({
        recipientPhone: reg.phone,
        recipientName: reg.applicantName,
        title: 'Welcome to Bulbula Amen FC!',
        message: `Payment verified! ${reg.playerFullName} is now officially registered in ${reg.teamName} with Player ID: ${playerId}.`,
        channel: 'SMS',
        status: 'SENT',
        type: 'REGISTRATION_ALERT'
      });

      addAuditLog({
        userId: user.id || 'USR-005',
        userName: user.name || 'Finance Officer',
        userRole: user.role || 'FINANCE_OFFICER',
        action: `Verified payment & activated player ${newPlayer.fullName} (${playerId})`,
        affectedRecordId: playerId,
        affectedRecordType: 'Player',
        newValue: 'ACTIVE',
        ipAddress: '127.0.0.1'
      });
    } else if (action === 'REJECT') {
      reg.status = 'REJECTED';
      reg.rejectionReason = notes || 'Application did not satisfy requirements';
      saveRegistration(reg);

      addAuditLog({
        userId: user.id || 'USR-003',
        userName: user.name || 'Manager',
        userRole: user.role || 'MANAGER',
        action: `Rejected registration ${reg.id}`,
        affectedRecordId: reg.id,
        affectedRecordType: 'Registration',
        newValue: 'REJECTED',
        ipAddress: '127.0.0.1'
      });
    }

    return NextResponse.json({ success: true, data: reg });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

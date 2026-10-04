import { NextResponse } from 'next/server';
import { getPayments, savePayment, savePlayer, getPlayers, addAuditLog, addNotification, isDuplicateTransaction, getRegistrations, saveRegistration } from '@/lib/db';
import { PaymentTransaction, Player } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  let payments = getPayments();

  if (status) {
    payments = payments.filter(p => p.verificationStatus === status);
  }

  return NextResponse.json({ success: true, data: payments });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Duplicate Transaction ID Validation
    if (body.transactionId && isDuplicateTransaction(body.transactionId)) {
      return NextResponse.json({ 
        success: false, 
        error: `Duplicate transaction detected! Transaction ID "${body.transactionId}" has already been submitted and processed.` 
      }, { status: 400 });
    }

    const count = getPayments().length + 9005;
    const id = `PAY-${count}`;

    const newPayment: PaymentTransaction = {
      id,
      playerId: body.playerId || 'BFC-PENDING',
      playerName: body.playerName || 'Player Name',
      teamId: body.teamId || 'TEAM-U13',
      teamName: body.teamName || 'U13 Premier',
      parentName: body.parentName || 'Parent Name',
      parentPhone: body.parentPhone || '+251911000000',
      amount: Number(body.amount) || 1500,
      type: body.type || 'MONTHLY',
      transactionId: body.transactionId || `TXN-${Math.floor(1000000 + Math.random()*9000000)}`,
      paymentDate: new Date().toISOString(),
      paymentMethod: body.paymentMethod || 'Telebirr',
      screenshotUrl: body.screenshotUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      verificationStatus: 'Under Verification',
      notes: body.notes || 'Payment uploaded for processing'
    };

    savePayment(newPayment);

    addNotification({
      recipientRole: 'FINANCE_OFFICER',
      title: 'Payment Verification Needed',
      message: `New ${newPayment.paymentMethod} transaction (${newPayment.transactionId}) for ${newPayment.amount} ETB submitted by ${newPayment.parentName}.`,
      channel: 'IN_APP',
      status: 'SENT',
      linkUrl: '/admin/payments',
      type: 'PAYMENT_REMINDER'
    });

    return NextResponse.json({ success: true, data: newPayment });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json(); // { paymentId, status: 'Verified'|'Rejected', verifiedBy }
    const { paymentId, status, verifiedBy, user } = body;

    const payments = getPayments();
    const payment = payments.find(p => p.id === paymentId);

    if (!payment) {
      return NextResponse.json({ success: false, error: 'Payment record not found' }, { status: 404 });
    }

    payment.verificationStatus = status;
    payment.verifiedBy = verifiedBy || user?.name || 'Finance Officer';
    payment.verificationDate = new Date().toISOString();

    savePayment(payment);

    // If verified and associated with an existing active player, update player fee schedule!
    if (status === 'Verified') {
      if (payment.playerId && payment.playerId !== 'BFC-PENDING') {
        const players = getPlayers();
        const player = players.find(p => p.id === payment.playerId);
        if (player) {
          player.paymentStatus = 'VERIFIED';
          if (player.feeSchedule) {
            player.feeSchedule.totalPaid += payment.amount;
            player.feeSchedule.currentBalance = Math.max(0, player.feeSchedule.currentBalance - payment.amount);
            player.feeSchedule.paymentStatus = 'PAID';
            player.feeSchedule.nextPaymentDueDate = new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0];
          }
          savePlayer(player);
        }
      }

      // Check if associated with pending registration for Auto-Activation
      const regs = getRegistrations();
      const matchedReg = regs.find(r => r.phone === payment.parentPhone || r.applicantName === payment.parentName || payment.notes?.includes(r.id));
      if (matchedReg) {
        matchedReg.status = 'ACTIVE';
        saveRegistration(matchedReg);

        // Check if player already exists
        const players = getPlayers();
        const existingPlayer = players.find(p => p.registrationId === matchedReg.id || p.fullName === matchedReg.playerFullName);
        if (existingPlayer) {
          existingPlayer.status = 'ACTIVE';
          existingPlayer.registrationStatus = 'ACTIVE';
          existingPlayer.paymentStatus = 'VERIFIED';
          savePlayer(existingPlayer);
        } else {
          const newPlayerId = `BFC-${matchedReg.teamName.replace(/\s+/g, '')}-${Math.floor(100 + Math.random()*900)}`;
          const newPlayer: Player = {
            id: newPlayerId,
            firstName: matchedReg.playerFullName.split(' ')[0] || matchedReg.playerFullName,
            middleName: matchedReg.playerFullName.split(' ')[1] || '',
            lastName: matchedReg.playerFullName.split(' ')[2] || '',
            fullName: matchedReg.playerFullName,
            fullNameAmharic: matchedReg.playerFullNameAmharic,
            dateOfBirth: matchedReg.playerData?.dateOfBirth || '2014-05-12',
            age: matchedReg.playerData?.age || 12,
            gender: matchedReg.playerData?.gender || 'Male',
            nationality: 'Ethiopian',
            placeOfBirth: 'Addis Ababa',
            phone: matchedReg.phone,
            address: matchedReg.subCity ? `Subcity: ${matchedReg.subCity}` : 'Addis Ababa',
            photoUrl: matchedReg.playerPhotoUrl || 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=300&auto=format&fit=crop&q=80',
            teamId: `TEAM-${matchedReg.teamName.split(' ')[0]}`,
            teamName: matchedReg.teamName,
            jerseyNumber: Math.floor(1 + Math.random()*30),
            position: matchedReg.playerData?.position || 'Forward',
            status: 'ACTIVE',
            registrationStatus: 'ACTIVE',
            paymentStatus: 'VERIFIED',
            registrationDate: new Date().toISOString().split('T')[0],
            registrationId: matchedReg.id,
            publicVisible: true,
            parentInfo: {
              fullName: matchedReg.applicantName,
              relationship: matchedReg.parentData?.relationship || 'Parent',
              phone: matchedReg.phone,
              email: matchedReg.email || 'parent@gmail.com',
              nationalIdNumber: matchedReg.parentData?.nationalIdNumber || 'ID-99201',
              nationalIdDocUrl: matchedReg.documents?.parentNationalIdDocUrl || matchedReg.parentData?.nationalIdDocUrl || '',
              residenceIdNumber: matchedReg.parentData?.residenceIdNumber || 'RES-1029',
              residenceIdDocUrl: matchedReg.documents?.parentResidenceIdDocUrl || matchedReg.parentData?.residenceIdDocUrl || ''
            },
            feeSchedule: {
              registrationFee: 500,
              monthlyFee: 1500,
              uniformFee: 800,
              totalPaid: payment.amount,
              currentBalance: 0,
              nextPaymentDueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
              paymentStatus: 'PAID'
            },
            statistics: {
              overallRating: 78,
              pace: 75,
              shooting: 76,
              passing: 72,
              dribbling: 74,
              defending: 50,
              physical: 70,
              gamesPlayed: 1,
              gamesStarted: 1,
              minutesPlayed: 90,
              goals: 0,
              assists: 0,
              yellowCards: 0,
              redCards: 0,
              trainingAttendance: 100
            },
            history: [
              {
                id: `HIST-${Date.now()}`,
                season: '2026',
                teamName: matchedReg.teamName,
                jerseyNumber: 10,
                coachName: 'Academy Coach',
                goals: 0,
                assists: 0,
                attendancePercent: 100,
                date: new Date().toISOString().split('T')[0],
                notes: 'Registered and verified as active player.'
              }
            ]
          };
          savePlayer(newPlayer);
        }
      }
    }

    addAuditLog({
      userId: user?.id || 'USR-005',
      userName: user?.name || 'Finance Officer',
      userRole: user?.role || 'FINANCE_OFFICER',
      action: `${status} payment transaction ${payment.transactionId} (${payment.amount} ETB)`,
      affectedRecordId: payment.id,
      affectedRecordType: 'PaymentTransaction',
      previousValue: 'Under Verification',
      newValue: status,
      ipAddress: '127.0.0.1'
    });

    return NextResponse.json({ success: true, data: payment });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

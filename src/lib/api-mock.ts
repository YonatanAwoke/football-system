import * as db from './db';
import { extractTransactionFromImage } from './ocr-helper';
import { Player, Registration, PaymentTransaction, Team, User, TrainingSchedule, Match, AttendanceSession } from './types';

export function setupApiMock() {
  if (typeof window === 'undefined') return;

  const originalFetch = window.fetch;

  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const urlString = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

    // Only intercept requests targeting /api/
    if (!urlString.includes('/api/')) {
      return originalFetch.apply(window, [input as any, init]);
    }

    try {
      const url = new URL(urlString, window.location.origin);
      const pathname = url.pathname;
      const method = (init?.method || 'GET').toUpperCase();
      const searchParams = url.searchParams;

      let body: any = null;
      if (init?.body) {
        try {
          body = typeof init.body === 'string' ? JSON.parse(init.body) : init.body;
        } catch (e) {
          body = init.body;
        }
      }

      const jsonResponse = (data: any, status = 200) => {
        return new Response(JSON.stringify(data), {
          status,
          headers: { 'Content-Type': 'application/json' }
        });
      };

      // 1. Auth: /api/auth/login
      if (pathname === '/api/auth/login' && method === 'POST') {
        const { email, phone, type, role, password, otp } = body || {};
        const users = db.getUsers();
        
        let foundUser: User | undefined;
        if (role) {
          foundUser = users.find(u => u.role === role);
        }
        if (!foundUser && type === 'OTP') {
          foundUser = users.find(u => u.phone.replace(/\s+/g, '') === (phone || '').replace(/\s+/g, ''));
        }
        if (!foundUser && email) {
          foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        }
        // Fallback default admin user if none matches
        if (!foundUser) {
          foundUser = users[0] || {
            id: 'USR-001',
            email: email || 'admin@bulbulaamenfc.com',
            phone: phone || '+251911556677',
            name: 'Selamawit Tadesse',
            role: 'ADMIN',
            active: true,
            createdAt: new Date().toISOString()
          };
        }

        db.addAuditLog({
          userId: foundUser.id,
          userName: foundUser.name,
          userRole: foundUser.role,
          action: `User logged in (${type || 'CREDENTIALS'})`,
          affectedRecordId: foundUser.id,
          affectedRecordType: 'User',
          ipAddress: '127.0.0.1'
        });

        return jsonResponse({
          success: true,
          data: {
            user: foundUser,
            token: `mock-jwt-${Date.now()}`
          }
        });
      }

      // 2. Players: /api/players
      if (pathname === '/api/players') {
        if (method === 'GET') {
          const teamId = searchParams.get('teamId');
          const status = searchParams.get('status');
          const search = searchParams.get('search')?.toLowerCase();

          let players = db.getPlayers();
          if (teamId) players = players.filter(p => p.teamId === teamId);
          if (status) players = players.filter(p => p.status === status);
          if (search) {
            players = players.filter(p =>
              p.fullName.toLowerCase().includes(search) ||
              p.id.toLowerCase().includes(search) ||
              p.phone.includes(search) ||
              p.position.toLowerCase().includes(search)
            );
          }
          return jsonResponse({ success: true, data: players });
        }

        if (method === 'POST') {
          const teams = db.getTeams();
          const targetTeam = teams.find(t => t.id === body.teamId);
          const count = db.getPlayers().length + 1;
          const teamShort = targetTeam ? targetTeam.shortName.toUpperCase() : 'CLUB';
          const id = `BFC-${teamShort}-${String(count).padStart(4, '0')}`;

          const newPlayer: Player = {
            id,
            firstName: body.firstName || '',
            middleName: body.middleName || '',
            lastName: body.lastName || '',
            fullName: body.fullName || `${body.firstName || ''} ${body.middleName || ''} ${body.lastName || ''}`.trim(),
            dateOfBirth: body.dateOfBirth || '2012-01-01',
            age: body.age || 13,
            gender: body.gender || 'Male',
            nationality: body.nationality || 'Ethiopian',
            placeOfBirth: body.placeOfBirth || 'Addis Ababa',
            phone: body.phone || '',
            address: body.address || '',
            photoUrl: body.photoUrl || 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=300&auto=format&fit=crop&q=80',
            teamId: body.teamId || 'TEAM-U13',
            teamName: targetTeam ? targetTeam.name : 'U13 Premier',
            jerseyNumber: body.jerseyNumber || 10,
            position: body.position || 'Midfielder',
            status: body.status || 'ACTIVE',
            registrationStatus: 'ACTIVE',
            paymentStatus: body.paymentStatus || 'VERIFIED',
            registrationDate: new Date().toISOString().split('T')[0],
            publicVisible: body.publicVisible ?? true,
            statistics: body.statistics || {
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
            parentInfo: body.parentInfo || {
              fullName: 'N/A',
              relationship: 'Parent',
              phone: '',
              email: '',
              nationalIdNumber: '',
              nationalIdDocUrl: '',
              residenceIdNumber: '',
              residenceIdDocUrl: ''
            },
            documents: body.documents || {
              birthCertificateNumber: '',
              birthCertificateDocUrl: '',
              parentNationalIdDocUrl: '',
              parentResidenceIdDocUrl: ''
            },
            feeSchedule: body.feeSchedule || {
              registrationFee: targetTeam?.registrationFee || 3500,
              monthlyFee: targetTeam?.monthlyFee || 1500,
              uniformFee: targetTeam?.uniformFee || 1200,
              totalPaid: targetTeam?.registrationFee || 3500,
              currentBalance: 0,
              nextPaymentDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              paymentStatus: 'PAID'
            }
          };

          db.savePlayer(newPlayer);
          db.addAuditLog({
            userId: body.authorId || 'USR-001',
            userName: body.authorName || 'System Admin',
            userRole: body.authorRole || 'ADMIN',
            action: `Added player ${newPlayer.fullName} (${newPlayer.id})`,
            affectedRecordId: newPlayer.id,
            affectedRecordType: 'Player',
            newValue: JSON.stringify({ name: newPlayer.fullName, team: newPlayer.teamName }),
            ipAddress: '127.0.0.1'
          });

          return jsonResponse({ success: true, data: newPlayer });
        }

        if (method === 'PUT') {
          const updated = db.savePlayer(body);
          db.addAuditLog({
            userId: body.authorId || 'USR-001',
            userName: body.authorName || 'System Admin',
            userRole: body.authorRole || 'ADMIN',
            action: `Updated player ${updated.fullName} (${updated.id})`,
            affectedRecordId: updated.id,
            affectedRecordType: 'Player',
            newValue: `Updated details for ${updated.id}`,
            ipAddress: '127.0.0.1'
          });
          return jsonResponse({ success: true, data: updated });
        }

        if (method === 'DELETE') {
          const playerId = searchParams.get('id');
          if (playerId) {
            db.deletePlayer(playerId);
            db.addAuditLog({
              userId: 'USR-001',
              userName: 'Administrator',
              userRole: 'ADMIN',
              action: `Deleted player ${playerId}`,
              affectedRecordId: playerId,
              affectedRecordType: 'Player',
              ipAddress: '127.0.0.1'
            });
            return jsonResponse({ success: true, message: 'Player deleted successfully' });
          }
          return jsonResponse({ success: false, error: 'Player ID required' }, 400);
        }
      }

      // 3. Teams: /api/teams
      if (pathname === '/api/teams') {
        if (method === 'GET') {
          return jsonResponse({ success: true, data: db.getTeams() });
        }
        if (method === 'POST' || method === 'PUT') {
          const saved = db.saveTeam(body);
          return jsonResponse({ success: true, data: saved });
        }
        if (method === 'DELETE') {
          const teamId = searchParams.get('id');
          if (teamId) {
            db.deleteTeam(teamId);
            return jsonResponse({ success: true, message: 'Team deleted successfully' });
          }
        }
      }

      // 4. Registrations: /api/registrations
      if (pathname === '/api/registrations') {
        if (method === 'GET') {
          return jsonResponse({ success: true, data: db.getRegistrations() });
        }
        if (method === 'POST') {
          const count = db.getRegistrations().length + 1001;
          const reg: Registration = {
            id: body.id || `REG-${new Date().getFullYear()}-${count}`,
            submittedAt: new Date().toISOString(),
            status: body.status || 'PENDING_REVIEW',
            paymentStatus: body.paymentStatus || 'PENDING',
            ...body
          };
          db.saveRegistration(reg);
          db.addAuditLog({
            userId: 'PUBLIC',
            userName: reg.applicantName || 'Applicant',
            userRole: 'VIEWER',
            action: `New Registration submitted: ${reg.playerFullName} (${reg.id})`,
            affectedRecordId: reg.id,
            affectedRecordType: 'Registration',
            ipAddress: '127.0.0.1'
          });
          return jsonResponse({ success: true, data: reg });
        }
        if (method === 'PUT') {
          const updated = db.saveRegistration(body);
          return jsonResponse({ success: true, data: updated });
        }
      }

      // 5. Payments: /api/payments
      if (pathname === '/api/payments') {
        if (method === 'GET') {
          return jsonResponse({ success: true, data: db.getPayments() });
        }
        if (method === 'POST') {
          const count = db.getPayments().length + 1001;
          const newPayment: PaymentTransaction = {
            id: body.id || `PAY-${count}`,
            transactionId: body.transactionId || `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`,
            playerId: body.playerId || '',
            playerName: body.playerName || '',
            teamId: body.teamId || '',
            teamName: body.teamName || '',
            parentName: body.parentName || '',
            parentPhone: body.parentPhone || '',
            amount: Number(body.amount) || 0,
            type: body.type || 'MONTHLY',
            paymentMethod: body.paymentMethod || 'Telebirr',
            paymentDate: body.paymentDate || new Date().toISOString().split('T')[0],
            screenshotUrl: body.screenshotUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
            verificationStatus: body.verificationStatus || 'Under Verification',
            verifiedBy: body.verifiedBy,
            verificationDate: body.verifiedAt || body.verificationDate || new Date().toISOString(),
            notes: body.notes || ''
          };
          db.savePayment(newPayment);
          return jsonResponse({ success: true, data: newPayment });
        }
        if (method === 'PUT') {
          const updated = db.savePayment(body);
          if (updated.verificationStatus === 'Verified') {
            // Update player fee schedule if exists
            const players = db.getPlayers();
            const p = players.find(x => x.id === updated.playerId);
            if (p && p.feeSchedule) {
              p.feeSchedule.totalPaid = (p.feeSchedule.totalPaid || 0) + updated.amount;
              p.feeSchedule.currentBalance = Math.max(0, (p.feeSchedule.currentBalance || 0) - updated.amount);
              p.feeSchedule.paymentStatus = 'PAID';
              p.paymentStatus = 'VERIFIED';
              db.savePlayer(p);
            }
          }
          return jsonResponse({ success: true, data: updated });
        }
      }

      // 6. Settings: /api/settings
      if (pathname === '/api/settings') {
        if (method === 'GET') {
          return jsonResponse({ success: true, data: db.getSettings() });
        }
        if (method === 'POST' || method === 'PUT') {
          const updated = db.saveSettings(body);
          return jsonResponse({ success: true, data: updated });
        }
      }

      // 7. Notifications: /api/notifications
      if (pathname === '/api/notifications') {
        if (method === 'GET') {
          return jsonResponse({ success: true, data: db.getNotifications() });
        }
        if (method === 'POST') {
          const added = db.addNotification(body);
          return jsonResponse({ success: true, data: added });
        }
      }

      // 8. Notification Templates: /api/notification-templates
      if (pathname === '/api/notification-templates') {
        if (method === 'GET') {
          return jsonResponse({ success: true, data: db.getNotificationTemplates() });
        }
        if (method === 'POST' || method === 'PUT') {
          const saved = db.saveNotificationTemplate(body);
          return jsonResponse({ success: true, data: saved });
        }
      }

      // 9. Gallery: /api/gallery
      if (pathname === '/api/gallery') {
        if (method === 'GET') {
          return jsonResponse({ success: true, data: db.getGallery() });
        }
        if (method === 'POST' || method === 'PUT') {
          const saved = db.saveGalleryAlbum(body);
          return jsonResponse({ success: true, data: saved });
        }
        if (method === 'DELETE') {
          const id = searchParams.get('id');
          if (id) {
            db.deleteGalleryAlbum(id);
            return jsonResponse({ success: true, message: 'Album deleted' });
          }
        }
      }

      // 10. CMS: /api/cms
      if (pathname === '/api/cms') {
        if (method === 'GET') {
          return jsonResponse({ success: true, data: db.getCMSContent() });
        }
        if (method === 'POST' || method === 'PUT') {
          const saved = db.saveCMSContent(body);
          return jsonResponse({ success: true, data: saved });
        }
      }

      // 11. Audit Logs: /api/audit-logs
      if (pathname === '/api/audit-logs') {
        return jsonResponse({ success: true, data: db.getAuditLogs() });
      }

      // 12. Attendance: /api/attendance
      if (pathname === '/api/attendance') {
        if (method === 'GET') {
          return jsonResponse({ success: true, data: db.getAttendance() });
        }
        if (method === 'POST' || method === 'PUT') {
          const saved = db.saveAttendanceSession(body);
          return jsonResponse({ success: true, data: saved });
        }
      }

      // 13. Matches: /api/matches
      if (pathname === '/api/matches') {
        if (method === 'GET') {
          return jsonResponse({ success: true, data: db.getMatches() });
        }
        if (method === 'POST' || method === 'PUT') {
          const saved = db.saveMatch(body);
          return jsonResponse({ success: true, data: saved });
        }
      }

      // 14. OCR Simulator: /api/ocr
      if (pathname === '/api/ocr' && method === 'POST') {
        const { filename, imageUrl, text } = body || {};
        const result = extractTransactionFromImage(filename || imageUrl || '', text || '');
        return jsonResponse({ success: true, data: result });
      }

      // 15. Users: /api/users
      if (pathname === '/api/users') {
        if (method === 'GET') {
          return jsonResponse({ success: true, data: db.getUsers() });
        }
        if (method === 'POST' || method === 'PUT') {
          const saved = db.saveUser(body);
          return jsonResponse({ success: true, data: saved });
        }
        if (method === 'DELETE') {
          const id = searchParams.get('id');
          if (id) {
            db.deleteUser(id);
            return jsonResponse({ success: true, message: 'User deleted' });
          }
        }
      }

      // 16. Schedules: /api/schedules
      if (pathname === '/api/schedules') {
        if (method === 'GET') {
          return jsonResponse({ success: true, data: db.getSchedules() });
        }
        if (method === 'POST' || method === 'PUT') {
          const saved = db.saveSchedule(body);
          return jsonResponse({ success: true, data: saved });
        }
        if (method === 'DELETE') {
          const id = searchParams.get('id');
          if (id) {
            db.deleteSchedule(id);
            return jsonResponse({ success: true, message: 'Schedule deleted' });
          }
        }
      }

      // Fallback
      return jsonResponse({ success: true, message: 'OK' });
    } catch (err: any) {
      console.error('API Mock error:', err);
      return new Response(JSON.stringify({ success: false, error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };
}

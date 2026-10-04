import { 
  User, Team, Player, Registration, PaymentTransaction, 
  NotificationItem, GalleryAlbum, CMSContent, AuditLog, ClubSettings,
  TrainingSchedule, NotificationTemplate, AttendanceSession, Match
} from './types';
import { 
  initialClubSettings, initialUsers, initialTeams, initialPlayers, 
  initialRegistrations, initialPayments, initialNotifications, 
  initialGalleryAlbums, initialCMSContent, initialAuditLogs 
} from './seed-data';

export interface DatabaseSchema {
  settings: ClubSettings;
  users: User[];
  teams: Team[];
  players: Player[];
  registrations: Registration[];
  payments: PaymentTransaction[];
  notifications: NotificationItem[];
  notificationTemplates?: NotificationTemplate[];
  schedules?: TrainingSchedule[];
  gallery: GalleryAlbum[];
  cms: CMSContent;
  auditLogs: AuditLog[];
  attendance?: AttendanceSession[];
  matches?: Match[];
}

const STORAGE_KEY = 'bulbula_amen_fc_db_v2';
let memoryDb: DatabaseSchema | null = null;

function getInitialData(): DatabaseSchema {
  return {
    settings: initialClubSettings,
    users: initialUsers,
    teams: initialTeams,
    players: initialPlayers,
    registrations: initialRegistrations,
    payments: initialPayments,
    notifications: initialNotifications,
    gallery: initialGalleryAlbums,
    cms: initialCMSContent,
    auditLogs: initialAuditLogs,
  };
}

export function getDatabase(): DatabaseSchema {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.players && parsed.players.length >= 10) {
          memoryDb = parsed;
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading from localStorage:', e);
    }
  }

  if (memoryDb) return memoryDb;

  const initialData = getInitialData();
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    } catch (e) {}
  }
  memoryDb = initialData;
  return initialData;
}

export function saveDatabase(data: DatabaseSchema): void {
  memoryDb = data;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Error saving to localStorage:', e);
    }
  }
}

export function resetDatabaseToSeedData(): DatabaseSchema {
  const initialData = getInitialData();
  saveDatabase(initialData);
  return initialData;
}

// Entity helper functions
export function getPlayers(): Player[] {
  return getDatabase().players;
}

export function savePlayer(player: Player): Player {
  const db = getDatabase();
  const existingIdx = db.players.findIndex(p => p.id === player.id);
  if (existingIdx >= 0) {
    db.players[existingIdx] = player;
  } else {
    db.players.unshift(player);
  }
  // Recalculate team active player count
  db.teams = db.teams.map(t => {
    const count = db.players.filter(p => p.teamId === t.id && p.status === 'ACTIVE').length;
    return { ...t, activePlayerCount: count };
  });
  saveDatabase(db);
  return player;
}

export function deletePlayer(playerId: string): void {
  const db = getDatabase();
  db.players = db.players.filter(p => p.id !== playerId);
  db.teams = db.teams.map(t => {
    const count = db.players.filter(p => p.teamId === t.id && p.status === 'ACTIVE').length;
    return { ...t, activePlayerCount: count };
  });
  saveDatabase(db);
}

export function getTeams(): Team[] {
  const db = getDatabase();
  return db.teams.map(t => {
    const count = db.players.filter(p => p.teamId === t.id && p.status === 'ACTIVE').length;
    return { ...t, activePlayerCount: count };
  });
}

export function saveTeam(team: Team): Team {
  const db = getDatabase();
  const existingIdx = db.teams.findIndex(t => t.id === team.id);
  if (existingIdx >= 0) {
    db.teams[existingIdx] = team;
  } else {
    db.teams.push(team);
  }
  saveDatabase(db);
  return team;
}

export function deleteTeam(teamId: string): void {
  const db = getDatabase();
  db.teams = db.teams.filter(t => t.id !== teamId);
  saveDatabase(db);
}

export function getRegistrations(): Registration[] {
  return getDatabase().registrations;
}

export function saveRegistration(reg: Registration): Registration {
  const db = getDatabase();
  const existingIdx = db.registrations.findIndex(r => r.id === reg.id);
  if (existingIdx >= 0) {
    db.registrations[existingIdx] = reg;
  } else {
    db.registrations.unshift(reg);
  }
  saveDatabase(db);
  return reg;
}

export function getPayments(): PaymentTransaction[] {
  return getDatabase().payments;
}

export function savePayment(payment: PaymentTransaction): PaymentTransaction {
  const db = getDatabase();
  const existingIdx = db.payments.findIndex(p => p.id === payment.id);
  if (existingIdx >= 0) {
    db.payments[existingIdx] = payment;
  } else {
    db.payments.unshift(payment);
  }
  saveDatabase(db);
  return payment;
}

export function getNotifications(): NotificationItem[] {
  return getDatabase().notifications;
}

export function addNotification(notif: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>): NotificationItem {
  const db = getDatabase();
  const newNotif: NotificationItem = {
    ...notif,
    id: `NOTIF-${Date.now()}`,
    createdAt: new Date().toISOString(),
    isRead: false
  };
  db.notifications.unshift(newNotif);
  saveDatabase(db);
  return newNotif;
}

export function markNotificationsRead(): void {
  const db = getDatabase();
  db.notifications = db.notifications.map(n => ({ ...n, isRead: true, status: 'READ' }));
  saveDatabase(db);
}

export function getGallery(): GalleryAlbum[] {
  return getDatabase().gallery;
}

export function saveGalleryAlbum(album: GalleryAlbum): GalleryAlbum {
  const db = getDatabase();
  const existingIdx = db.gallery.findIndex(a => a.id === album.id);
  if (existingIdx >= 0) {
    db.gallery[existingIdx] = album;
  } else {
    db.gallery.unshift(album);
  }
  saveDatabase(db);
  return album;
}

export function deleteGalleryAlbum(albumId: string): void {
  const db = getDatabase();
  db.gallery = db.gallery.filter(a => a.id !== albumId);
  saveDatabase(db);
}

export function getCMSContent(): CMSContent {
  return getDatabase().cms;
}

export function saveCMSContent(cms: CMSContent): CMSContent {
  const db = getDatabase();
  db.cms = cms;
  saveDatabase(db);
  return cms;
}

export function getAuditLogs(): AuditLog[] {
  return getDatabase().auditLogs;
}

export function addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog {
  const db = getDatabase();
  const newLog: AuditLog = {
    ...log,
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toISOString()
  };
  db.auditLogs.unshift(newLog);
  saveDatabase(db);
  return newLog;
}

export function getUsers(): User[] {
  return getDatabase().users;
}

export function saveUser(user: User): User {
  const db = getDatabase();
  const existingIdx = db.users.findIndex(u => u.id === user.id);
  if (existingIdx >= 0) {
    db.users[existingIdx] = user;
  } else {
    db.users.push(user);
  }
  saveDatabase(db);
  return user;
}

export function deleteUser(userId: string): void {
  const db = getDatabase();
  db.users = db.users.filter(u => u.id !== userId);
  saveDatabase(db);
}

export function getSettings(): ClubSettings {
  return getDatabase().settings;
}

export function saveSettings(settings: ClubSettings): ClubSettings {
  const db = getDatabase();
  db.settings = settings;
  saveDatabase(db);
  return settings;
}

// Schedules Helpers
export function getSchedules(): TrainingSchedule[] {
  const db = getDatabase();
  return db.schedules || [];
}

export function saveSchedule(schedule: TrainingSchedule): TrainingSchedule {
  const db = getDatabase();
  if (!db.schedules) db.schedules = [];
  const existingIdx = db.schedules.findIndex(s => s.id === schedule.id);
  if (existingIdx >= 0) {
    db.schedules[existingIdx] = schedule;
  } else {
    db.schedules.unshift(schedule);
  }
  saveDatabase(db);
  return schedule;
}

export function deleteSchedule(scheduleId: string): void {
  const db = getDatabase();
  if (db.schedules) {
    db.schedules = db.schedules.filter(s => s.id !== scheduleId);
    saveDatabase(db);
  }
}

// Attendance Helpers
export function getAttendance(): AttendanceSession[] {
  const db = getDatabase();
  return db.attendance || [];
}

export function saveAttendanceSession(session: AttendanceSession): AttendanceSession {
  const db = getDatabase();
  if (!db.attendance) db.attendance = [];
  const existingIdx = db.attendance.findIndex(s => s.id === session.id);
  if (existingIdx >= 0) {
    db.attendance[existingIdx] = session;
  } else {
    db.attendance.unshift(session);
  }
  saveDatabase(db);
  return session;
}

// Matches Helpers
export function getMatches(): Match[] {
  const db = getDatabase();
  return db.matches || [];
}

export function saveMatch(match: Match): Match {
  const db = getDatabase();
  if (!db.matches) db.matches = [];
  const existingIdx = db.matches.findIndex(m => m.id === match.id);
  if (existingIdx >= 0) {
    db.matches[existingIdx] = match;
  } else {
    db.matches.unshift(match);
  }
  saveDatabase(db);
  return match;
}

// Notification Templates Helpers
export function getNotificationTemplates(): NotificationTemplate[] {
  const db = getDatabase();
  if (db.notificationTemplates && db.notificationTemplates.length > 0) {
    return db.notificationTemplates;
  }
  const defaultTemplates: NotificationTemplate[] = [
    {
      id: 'TPL-01',
      eventType: 'REGISTRATION_RECEIVED',
      titleTemplate: 'Registration Received for {player_name}',
      messageTemplate: 'Dear {parent_name}, we have received your application for {player_name} ({team_name}). Registration ID: {transaction_id}.',
      recipients: ['PARENT', 'MANAGER'],
      enabled: true
    },
    {
      id: 'TPL-02',
      eventType: 'PAYMENT_REQUIRED',
      titleTemplate: 'Payment Required for {player_name}',
      messageTemplate: 'Application approved! Please submit ETB {amount} by {due_date} to activate membership.',
      recipients: ['PARENT'],
      enabled: true
    },
    {
      id: 'TPL-03',
      eventType: 'PAYMENT_VERIFIED',
      titleTemplate: 'Payment Verified — Welcome to Bulbula Amen FC!',
      messageTemplate: 'Payment of ETB {amount} (Txn: {transaction_id}) is verified for {player_name}. Membership is ACTIVE in {team_name}.',
      recipients: ['PARENT', 'COACH', 'FINANCE'],
      enabled: true
    },
    {
      id: 'TPL-04',
      eventType: 'PAYMENT_OVERDUE',
      titleTemplate: 'Overdue Monthly Fee Reminder — {player_name}',
      messageTemplate: 'Monthly fee of ETB {amount} for {player_name} was due on {due_date}. Please upload payment receipt immediately.',
      recipients: ['PARENT', 'FINANCE'],
      enabled: true
    }
  ];
  db.notificationTemplates = defaultTemplates;
  saveDatabase(db);
  return defaultTemplates;
}

export function saveNotificationTemplate(template: NotificationTemplate): NotificationTemplate {
  const db = getDatabase();
  if (!db.notificationTemplates) db.notificationTemplates = getNotificationTemplates();
  const idx = db.notificationTemplates.findIndex(t => t.id === template.id);
  if (idx >= 0) {
    db.notificationTemplates[idx] = template;
  } else {
    db.notificationTemplates.push(template);
  }
  saveDatabase(db);
  return template;
}

// Duplicate Transaction Check Helper
export function isDuplicateTransaction(transactionId: string): boolean {
  const payments = getPayments();
  const normalized = transactionId.trim().toLowerCase();
  return payments.some(p => p.transactionId && p.transactionId.trim().toLowerCase() === normalized);
}

// Dynamic Dashboard Calculated Metrics Helper
export function getCalculatedMetrics(reportingPeriod: string = 'ALL') {
  const db = getDatabase();
  const totalPlayers = db.players.length;
  const activePlayers = db.players.filter(p => p.status === 'ACTIVE').length;
  const pendingRegistrations = db.registrations.filter(r => r.status === 'PENDING_REVIEW' || r.status === 'AWAITING_PAYMENT' || r.status === 'PAYMENT_VERIFICATION').length;
  const overduePayments = db.players.filter(p => p.paymentStatus === 'OVERDUE' || p.feeSchedule?.paymentStatus === 'OVERDUE').length;

  const now = new Date();
  let verifiedPayments = db.payments.filter(p => p.verificationStatus === 'Verified');

  if (reportingPeriod === 'THIS_MONTH') {
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    verifiedPayments = verifiedPayments.filter(p => {
      const d = new Date(p.paymentDate);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  } else if (reportingPeriod === 'LAST_MONTH') {
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lmMonth = lastMonthDate.getMonth();
    const lmYear = lastMonthDate.getFullYear();
    verifiedPayments = verifiedPayments.filter(p => {
      const d = new Date(p.paymentDate);
      return d.getMonth() === lmMonth && d.getFullYear() === lmYear;
    });
  }

  const monthlyCollections = verifiedPayments.reduce((sum, p) => sum + p.amount, 0);

  return {
    totalPlayers,
    activePlayers,
    pendingRegistrations,
    overduePayments,
    monthlyCollections,
    verifiedTransactionsCount: verifiedPayments.length
  };
}

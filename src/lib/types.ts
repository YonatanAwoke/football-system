export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'ADMIN' 
  | 'MANAGER' 
  | 'COACH' 
  | 'ASSISTANT_COACH'
  | 'FINANCE_OFFICER'
  | 'REGISTRATION_OFFICER'
  | 'CONTENT_MANAGER'
  | 'VIEWER';

export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: UserRole;
  avatar?: string;
  assignedTeamId?: string;
  active: boolean;
  createdAt: string;
}

export type PlayerStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'INACTIVE' | 'ARCHIVED';

export type RegistrationStatus = 
  | 'DRAFT' 
  | 'PENDING_REVIEW' 
  | 'CORRECTION_REQUIRED' 
  | 'APPROVED' 
  | 'AWAITING_PAYMENT' 
  | 'PAYMENT_VERIFICATION' 
  | 'ACTIVE' 
  | 'REJECTED' 
  | 'CANCELLED';

export type PaymentStatus = 
  | 'PENDING' 
  | 'SUBMITTED' 
  | 'UNDER_VERIFICATION' 
  | 'VERIFIED' 
  | 'REJECTED' 
  | 'FAILED' 
  | 'OVERDUE' 
  | 'DUE_SOON'
  | 'REFUNDED';

export type PaymentType = 'REGISTRATION' | 'MONTHLY' | 'UNIFORM' | 'TOURNAMENT';

export interface PlayerStatistics {
  overallRating: number; // e.g. 82
  pace: number;         // PAC e.g. 78
  shooting: number;     // SHO e.g. 84
  passing: number;      // PAS e.g. 71
  dribbling: number;    // DRI e.g. 80
  defending: number;    // DEF e.g. 42
  physical: number;     // PHY e.g. 76
  gamesPlayed: number;
  gamesStarted: number;
  minutesPlayed: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  cleanSheets?: number;
  trainingAttendance: number; // Percentage e.g. 92
  customStats?: Record<string, string | number>;
}

export interface ParentInfo {
  fullName: string;
  fullNameAmharic?: string;
  relationship: string;
  phone: string;
  email: string;
  nationalIdNumber: string;
  nationalIdDocUrl: string;
  residenceIdNumber: string;
  residenceIdDocUrl: string;
  photoUrl?: string;
}

export interface PlayerDocuments {
  playerDocType?: 'Birth Certificate' | 'Fayda ID Card' | 'Kebele ID';
  birthCertificateNumber?: string;
  birthCertificateDocUrl?: string;
  playerDocFrontUrl?: string;
  playerDocBackUrl?: string;
  parentDocType?: 'Fayda ID Card' | 'Kebele ID' | 'Passport';
  parentNationalIdDocUrl?: string;
  parentResidenceIdDocUrl?: string;
  parentDocFrontUrl?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface EthiopianDate {
  day: string;
  month: string;
  year: string;
}

export interface FeeSchedule {
  registrationFee: number;
  monthlyFee: number;
  uniformFee: number;
  totalPaid: number;
  currentBalance: number;
  nextPaymentDueDate: string;
  paymentStatus: 'PAID' | 'DUE_SOON' | 'DUE_TODAY' | 'OVERDUE' | 'NOT_APPLICABLE';
}

export interface Player {
  id: string; // e.g. BFC-U13-0024
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  firstNameAmharic?: string;
  fatherNameAmharic?: string;
  grandfatherNameAmharic?: string;
  fullNameAmharic?: string;
  dateOfBirth: string;
  ethiopianDob?: EthiopianDate;
  age: number;
  gender: 'Male' | 'Female';
  nationality: string;
  placeOfBirth: string;
  nationalIdNumber?: string;
  bloodType?: string;
  schoolName?: string;
  phone: string;
  address: string;
  subCity?: string;
  woreda?: string;
  houseNo?: string;
  emergencyContact?: EmergencyContact;
  photoUrl: string;
  parentPhotoUrl?: string;
  teamId: string;
  teamName: string;
  jerseyNumber: number;
  jerseyChoice1?: number;
  jerseyChoice2?: number;
  position: string;
  preferredFoot?: 'Right' | 'Left' | 'Both';
  heightCm?: number;
  weightKg?: number;
  previousClub?: string;
  medicalCondition?: string;
  declarationAccepted?: boolean;
  status: PlayerStatus;
  registrationStatus: RegistrationStatus;
  paymentStatus: PaymentStatus;
  registrationDate: string;
  feeSchedule?: FeeSchedule;
  parentInfo?: ParentInfo;
  documents?: PlayerDocuments;
  statistics?: PlayerStatistics;
  history?: PlayerHistoryItem[];
  registrationId?: string;
  publicVisible: boolean;
}

export interface PlayerHistoryItem {
  id: string;
  season: string; // e.g. '2025/2026' or '2026'
  teamName: string;
  jerseyNumber: number;
  coachName?: string;
  goals: number;
  assists: number;
  attendancePercent: number;
  date: string;
  notes?: string;
}

export interface AttendanceRecord {
  playerId: string;
  playerName: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  notes?: string;
}

export interface AttendanceSession {
  id: string;
  teamId: string;
  teamName: string;
  sessionDate: string;
  sessionType: 'Training' | 'Tactical' | 'Fitness' | 'Match Day';
  coachName: string;
  records: AttendanceRecord[];
  createdAt: string;
}

export interface TrainingSchedule {
  id: string;
  teamId: string;
  teamName: string;
  coachId?: string;
  coachName: string;
  sessionDate: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  location: string;
  sessionType: 'Training' | 'Tactical' | 'Fitness' | 'Match Day';
  notes?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
}

export type TacticalFormation = 
  | '4-3-3' 
  | '4-2-3-1' 
  | '4-4-2' 
  | '3-5-2' 
  | '3-4-3' 
  | '5-3-2' 
  | '4-1-4-1' 
  | '4-5-1';

export interface PitchSlot {
  id: string;
  roleName: string; // GK, LB, CB, RB, CDM, CM, CAM, LW, ST, RW etc.
  x: number; // percentage from left 0 - 100
  y: number; // percentage from top 0 - 100
  playerId?: string;
  isCaptain?: boolean;
  isPenaltyTaker?: boolean;
  isFreeKickTaker?: boolean;
  isCornerTaker?: boolean;
}

export interface MatchEvent {
  id: string;
  type: 'GOAL' | 'ASSIST' | 'YELLOW' | 'RED' | 'SUB_IN' | 'SUB_OUT' | 'PENALTY_GOAL' | 'OWN_GOAL';
  playerId: string;
  playerName: string;
  playerInId?: string;
  playerInName?: string;
  minute: number;
  notes?: string;
}

export interface Match {
  id: string;
  teamId: string;
  teamName: string;
  opponent: string;
  opponentLogoUrl?: string;
  date: string;
  time: string;
  location: string;
  competition: string;
  isHome: boolean;
  scoreHome: number;
  scoreAway: number;
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'POSTPONED' | 'CANCELLED';
  matchHalf?: '1st Half' | 'Halftime' | '2nd Half' | 'Fulltime' | 'Extra Time';
  currentMinute?: number;
  formation?: TacticalFormation;
  pitchSlots?: PitchSlot[];
  captainId?: string;
  penaltyTakerId?: string;
  freeKickTakerId?: string;
  cornerTakerId?: string;
  tacticalNotes?: string;
  motmPlayerId?: string;
  motmPlayerName?: string;
  startingXiIds: string[];
  substituteIds: string[];
  events: MatchEvent[];
  createdAt: string;
}

export interface Team {
  id: string;
  name: string; // e.g., U13
  code?: string;
  shortName: string;
  category: string;
  description: string;
  ageRange: string;
  gender: string;
  maxCapacity?: number;
  trainingDays: string;
  trainingTime: string;
  location: string;
  registrationFee: number;
  monthlyFee: number;
  uniformFee: number;
  otherFees?: number;
  coachId?: string;
  coachName: string;
  assistantCoachName?: string;
  photoUrl: string;
  publicVisible?: boolean;
  active: boolean;
  activePlayerCount: number;
}

export interface Registration {
  id: string;
  applicantName: string;
  playerFullName: string;
  playerFullNameAmharic?: string;
  playerDateOfBirth: string;
  ethiopianDob?: EthiopianDate;
  age?: number;
  gender: 'Male' | 'Female';
  placeOfBirth?: string;
  nationalIdNumber?: string;
  bloodType?: string;
  schoolName?: string;
  teamId: string;
  teamName: string;
  position?: string;
  jerseyChoice1?: number;
  jerseyChoice2?: number;
  previousClub?: string;
  phone: string;
  email: string;
  subCity?: string;
  woreda?: string;
  houseNo?: string;
  emergencyContact?: EmergencyContact;
  playerPhotoUrl?: string;
  parentPhotoUrl?: string;
  submittedAt: string;
  status: RegistrationStatus;
  paymentStatus: PaymentStatus;
  playerData: Partial<Player>;
  parentData: ParentInfo;
  documents: PlayerDocuments;
  medicalCondition?: string;
  declarationAccepted?: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  paymentProofUrl?: string;
  extractedTransactionId?: string;
  paymentMethod?: string;
  history?: Array<{
    status: RegistrationStatus;
    updatedBy: string;
    updatedAt: string;
    notes?: string;
  }>;
}

export interface PaymentTransaction {
  id: string;
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  parentName: string;
  parentPhone: string;
  amount: number;
  type: PaymentType;
  transactionId: string;
  paymentDate: string;
  dueDate?: string;
  paymentMethod: 'Telebirr' | 'CBE Birr' | 'Bank Transfer' | 'Cash' | 'Mobile Money';
  screenshotUrl?: string;
  verificationStatus: 'Submitted' | 'Under Verification' | 'Verified' | 'Rejected' | 'Duplicate' | 'Failed';
  verifiedBy?: string;
  verificationDate?: string;
  notes?: string;
}

export interface NotificationTemplate {
  id: string;
  eventType: string;
  titleTemplate: string;
  messageTemplate: string;
  recipients: Array<'PLAYER' | 'PARENT' | 'COACH' | 'MANAGER' | 'FINANCE'>;
  enabled: boolean;
}

export interface NotificationItem {
  id: string;
  recipientRole?: UserRole | 'ALL';
  recipientPhone?: string;
  recipientEmail?: string;
  recipientName?: string;
  title: string;
  message: string;
  channel: 'SMS' | 'EMAIL' | 'IN_APP' | 'SYSTEM';
  status: 'SENT' | 'PENDING' | 'READ';
  createdAt: string;
  isRead: boolean;
  linkUrl?: string;
  type: 'PAYMENT_REMINDER' | 'REGISTRATION_ALERT' | 'SYSTEM_ALERT';
}

export interface GalleryMediaItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  caption: string;
  uploadedAt: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  category: string;
  description: string;
  coverUrl: string;
  mediaCount: number;
  createdAt: string;
  published: boolean;
  items: GalleryMediaItem[];
}

export interface PromoBanner {
  id: string;
  slotNumber: 1 | 2 | 3;
  title: string;
  tagline: string;
  buttonText: string;
  linkUrl: string;
  imageUrl: string;
  badge: string;
  active: boolean;
}

export interface CMSContent {
  heroTitle: string;
  heroSubtitle: string;
  heroBannerUrl: string;
  aboutTitle?: string;
  aboutContent?: string;
  promoBanners?: PromoBanner[];
  announcements: Array<{
    id: string;
    title: string;
    content: string;
    date: string;
    active: boolean;
  }>;
  clubPhone: string;
  clubEmail: string;
  clubAddress: string;
  socialLinks: {
    facebook?: string;
    telegram?: string;
    instagram?: string;
    youtube?: string;
  };
  feesNotice: string;
  trainingLocation: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  affectedRecordId: string;
  affectedRecordType: string;
  previousValue?: string;
  newValue?: string;
  timestamp: string;
  ipAddress: string;
}

export interface ClubSettings {
  clubName: string;
  shortName: string;
  establishedYear?: string;
  dashboardWelcomeTitle?: string;
  dashboardWelcomeText?: string;
  location: string;
  website: string;
  logoUrl: string;
  phone: string;
  email: string;
  authMode: 'EMAIL_PASSWORD' | 'OTP' | 'BOTH';
  otpExpirationMinutes: number;
  maxLoginAttempts: number;
  telebirrAccount: string;
  cbeAccount: string;
  bankTransferDetails?: string;
  currency: string;
  timeZone: string;
  academicSeason: string;
  autoRemindersEnabled: boolean;
  reminderDaysBeforeDue: number[];
  reminderDaysAfterDue?: number[];
  deactivationThresholdDays?: number;
  gracePeriodDays?: number;
  registrationOpenDate?: string;
  registrationCloseDate?: string;
  registrationTermsText?: string;
  requiredDocumentsList?: string[];
  rolePermissions?: Record<string, string[]>;
}

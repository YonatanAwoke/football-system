import { 
  User, Team, Player, Registration, PaymentTransaction, 
  NotificationItem, GalleryAlbum, CMSContent, AuditLog, ClubSettings 
} from './types';

export const initialClubSettings: ClubSettings = {
  clubName: "Bulbula Amen Football Club",
  shortName: "Bulbula Amen FC",
  establishedYear: "2018",
  dashboardWelcomeTitle: "Academy Control Center",
  dashboardWelcomeText: "Bulbula Amen F.C. real-time academy operations dashboard.",
  location: "Addis Ababa, Ethiopia",
  website: "bulbulaamenfc.com",
  logoUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80",
  phone: "+251 91 123 4567",
  email: "info@bulbulaamenfc.com",
  authMode: "BOTH",
  otpExpirationMinutes: 5,
  maxLoginAttempts: 3,
  telebirrAccount: "10002938481 (Bulbula Amen FC)",
  cbeAccount: "1000123456789 (Bulbula Amen FC Main)",
  currency: "ETB",
  timeZone: "East Africa Time (UTC+3)",
  academicSeason: "2025/2026 Season",
  autoRemindersEnabled: true,
  reminderDaysBeforeDue: [7, 3, 0]
};

export const initialUsers: User[] = [
  {
    id: "USR-001",
    email: "superadmin@bulbulaamenfc.com",
    phone: "+251911223344",
    name: "Yonas Alemu",
    role: "SUPER_ADMIN",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    active: true,
    createdAt: "2025-01-10T08:00:00Z"
  },
  {
    id: "USR-002",
    email: "admin@bulbulaamenfc.com",
    phone: "+251911556677",
    name: "Selamawit Tadesse",
    role: "ADMIN",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    active: true,
    createdAt: "2025-01-12T09:30:00Z"
  },
  {
    id: "USR-003",
    email: "manager@bulbulaamenfc.com",
    phone: "+251911889900",
    name: "Tewodros Kassaye",
    role: "MANAGER",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    active: true,
    createdAt: "2025-01-15T10:15:00Z"
  },
  {
    id: "USR-004",
    email: "coach@bulbulaamenfc.com",
    phone: "+251911443322",
    name: "Coach Ashenafi Bekele",
    role: "COACH",
    assignedTeamId: "TEAM-U13",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    active: true,
    createdAt: "2025-01-20T14:00:00Z"
  },
  {
    id: "USR-005",
    email: "finance@bulbulaamenfc.com",
    phone: "+251911778899",
    name: "Martha Haile",
    role: "FINANCE_OFFICER",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
    active: true,
    createdAt: "2025-01-22T11:00:00Z"
  }
];

export const initialTeams: Team[] = [
  {
    id: "TEAM-U8",
    name: "U8 Academy",
    shortName: "U8",
    category: "Youth Academy",
    description: "Grassroots introductory football program for ages 6-8",
    ageRange: "6 - 8 yrs",
    gender: "Co-ed",
    trainingDays: "Saturday / Sunday",
    trainingTime: "9:00 AM – 10:30 AM",
    location: "Bulbula Amen Pitch 1",
    registrationFee: 3000,
    monthlyFee: 1200,
    uniformFee: 1000,
    coachName: "Coach Ermias Desta",
    photoUrl: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&auto=format&fit=crop&q=80",
    active: true,
    activePlayerCount: 10
  },
  {
    id: "TEAM-U10",
    name: "U10 Juniors",
    shortName: "U10",
    category: "Junior Academy",
    description: "Skill development and technical mastery for ages 9-10",
    ageRange: "9 - 10 yrs",
    gender: "Co-ed",
    trainingDays: "Tuesday / Thursday / Saturday",
    trainingTime: "4:00 PM – 5:30 PM",
    location: "Bulbula Amen Main Pitch",
    registrationFee: 3200,
    monthlyFee: 1300,
    uniformFee: 1200,
    coachName: "Coach Solomon Girma",
    photoUrl: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=600&auto=format&fit=crop&q=80",
    active: true,
    activePlayerCount: 10
  },
  {
    id: "TEAM-U12",
    name: "U12 Development",
    shortName: "U12",
    category: "Development Squad",
    description: "Tactical positioning and ball control for under 12s",
    ageRange: "11 - 12 yrs",
    gender: "Male",
    trainingDays: "Monday / Wednesday / Friday",
    trainingTime: "4:00 PM – 5:30 PM",
    location: "Bulbula Amen Pitch A",
    registrationFee: 3500,
    monthlyFee: 1500,
    uniformFee: 1200,
    coachName: "Coach Fikru Teferra",
    photoUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80",
    active: true,
    activePlayerCount: 10
  },
  {
    id: "TEAM-U13",
    name: "U13 Premier",
    shortName: "U13",
    category: "Youth Premier",
    description: "Competitive youth league preparation squad",
    ageRange: "12 - 13 yrs",
    gender: "Male",
    trainingDays: "Monday / Wednesday / Friday",
    trainingTime: "4:30 PM – 6:00 PM",
    location: "Bulbula Main Stadium Ground",
    registrationFee: 3500,
    monthlyFee: 1500,
    uniformFee: 1500,
    coachId: "USR-004",
    coachName: "Coach Ashenafi Bekele",
    photoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80",
    active: true,
    activePlayerCount: 10
  },
  {
    id: "TEAM-U15",
    name: "U15 Cadets",
    shortName: "U15",
    category: "Cadet Elite",
    description: "High performance tactical training for under 15s",
    ageRange: "14 - 15 yrs",
    gender: "Male",
    trainingDays: "Everyday except Sunday",
    trainingTime: "5:00 PM – 6:30 PM",
    location: "Bulbula Amen Main Turf",
    registrationFee: 4000,
    monthlyFee: 1800,
    uniformFee: 1500,
    coachName: "Coach Ashenafi Bekele",
    photoUrl: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=600&auto=format&fit=crop&q=80",
    active: true,
    activePlayerCount: 10
  },
  {
    id: "TEAM-U17",
    name: "U17 Elite",
    shortName: "U17",
    category: "Elite Academy",
    description: "Pre-professional league squad",
    ageRange: "16 - 17 yrs",
    gender: "Male",
    trainingDays: "Monday thru Friday",
    trainingTime: "4:00 PM – 6:00 PM",
    location: "Addis Ababa Stadium Sub-pitch",
    registrationFee: 4000,
    monthlyFee: 1800,
    uniformFee: 1500,
    coachName: "Coach Yohannes Sahle",
    photoUrl: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=600&auto=format&fit=crop&q=80",
    active: true,
    activePlayerCount: 10
  },
  {
    id: "TEAM-U18",
    name: "U18 Seniors Prep",
    shortName: "U18",
    category: "Senior Reserve",
    description: "Feeder squad for senior team division",
    ageRange: "17 - 18 yrs",
    gender: "Male",
    trainingDays: "Daily",
    trainingTime: "3:30 PM – 5:30 PM",
    location: "Bulbula Amen Main Pitch",
    registrationFee: 4500,
    monthlyFee: 2000,
    uniformFee: 1800,
    coachName: "Coach Million Begashaw",
    photoUrl: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=600&auto=format&fit=crop&q=80",
    active: true,
    activePlayerCount: 10
  },
  {
    id: "TEAM-WOMEN",
    name: "Women's Team",
    shortName: "Women",
    category: "Senior Women",
    description: "Bulbula Amen FC Women's Division Team",
    ageRange: "16+ yrs",
    gender: "Female",
    trainingDays: "Monday / Wednesday / Saturday",
    trainingTime: "3:00 PM – 5:00 PM",
    location: "Bulbula Amen Turf B",
    registrationFee: 3500,
    monthlyFee: 1500,
    uniformFee: 1500,
    coachName: "Coach Meseret Manni",
    photoUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&auto=format&fit=crop&q=80",
    active: true,
    activePlayerCount: 10
  },
  {
    id: "TEAM-HEALTH",
    name: "Health & Fitness Veterans",
    shortName: "Health",
    category: "Community & Vets",
    description: "Fitness and recreational football for adult members",
    ageRange: "30+ yrs",
    gender: "All",
    trainingDays: "Saturday / Sunday Morning",
    trainingTime: "6:30 AM – 8:30 AM",
    location: "Bulbula Amen Main Turf",
    registrationFee: 5000,
    monthlyFee: 2500,
    uniformFee: 2000,
    coachName: "Coach General Fit",
    photoUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80",
    active: true,
    activePlayerCount: 10
  }
];

// Helper generator to build 10 consistent players per team
function createTeamPlayers(
  teamId: string, 
  teamName: string, 
  shortCode: string,
  gender: 'Male' | 'Female',
  ageRangeBase: number,
  playerNames: Array<{ first: string; middle: string; last: string; pos: string; jersey: number; ovr: number; photo: string }>
): Player[] {
  return playerNames.map((p, idx) => {
    const numStr = String(idx + 1).padStart(4, '0');
    const id = `BFC-${shortCode}-${numStr}`;
    const age = ageRangeBase + (idx % 3);
    const dobYear = 2026 - age;

    return {
      id,
      firstName: p.first,
      middleName: p.middle,
      lastName: p.last,
      fullName: `${p.first} ${p.middle} ${p.last}`,
      dateOfBirth: `${dobYear}-0${(idx % 8) + 1}-1${idx + 2}`,
      age,
      gender,
      nationality: "Ethiopian",
      placeOfBirth: idx % 2 === 0 ? "Addis Ababa" : "Hawassa",
      phone: `+251911${(idx + 10).toString().padStart(2, '0')}00${idx}`,
      address: `Sub-city ${ (idx % 10) + 1 }, Addis Ababa`,
      photoUrl: p.photo,
      teamId,
      teamName,
      jerseyNumber: p.jersey,
      position: p.pos,
      status: "ACTIVE",
      registrationStatus: "ACTIVE",
      paymentStatus: idx % 5 === 0 ? "OVERDUE" : idx % 4 === 0 ? "DUE_SOON" : "VERIFIED",
      dateJoined: "2024-09-01",
      registrationDate: "2024-09-01",
      publicVisible: true,
      statistics: {
        overallRating: p.ovr,
        pace: Math.min(99, p.ovr + (idx % 5) - 2),
        shooting: Math.min(99, p.ovr + (idx % 4) - 3),
        passing: Math.min(99, p.ovr + (idx % 3) - 1),
        dribbling: Math.min(99, p.ovr + (idx % 4) - 2),
        defending: Math.min(99, Math.max(30, p.pos.includes('Back') || p.pos.includes('GK') ? p.ovr + 5 : p.ovr - 20)),
        physical: Math.min(99, p.ovr + (idx % 3)),
        gamesPlayed: 12 + idx,
        gamesStarted: 10 + (idx % 3),
        minutesPlayed: (12 + idx) * 75,
        goals: p.pos.includes('Forward') || p.pos.includes('Striker') || p.pos.includes('Winger') ? 8 + idx : idx % 3,
        assists: 4 + (idx % 5),
        yellowCards: idx % 3,
        redCards: 0,
        cleanSheets: p.pos.includes('Keeper') ? 5 : 0,
        trainingAttendance: 90 + (idx % 9)
      },
      parentInfo: {
        fullName: `${p.middle} ${p.last} Workneh`,
        relationship: gender === 'Female' && idx % 2 === 0 ? "Mother" : "Father",
        phone: `+251911${(idx + 10).toString().padStart(2, '0')}00${idx}`,
        email: `${p.first.toLowerCase()}.${p.last.toLowerCase()}@gmail.com`,
        nationalIdNumber: `ETH-ID-902${idx}14`,
        nationalIdDocUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80",
        residenceIdNumber: `AA-RES-4${idx}90`,
        residenceIdDocUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80"
      },
      documents: {
        birthCertificateNumber: `BC-AA-${dobYear}-70${idx}`,
        birthCertificateDocUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
        parentNationalIdDocUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80",
        parentResidenceIdDocUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80"
      },
      feeSchedule: {
        registrationFee: 3500,
        monthlyFee: 1500,
        uniformFee: 1200,
        totalPaid: 9500,
        currentBalance: idx % 5 === 0 ? 1500 : 0,
        nextPaymentDueDate: "2026-09-05",
        paymentStatus: idx % 5 === 0 ? "OVERDUE" : idx % 4 === 0 ? "DUE_SOON" : "PAID"
      }
    };
  });
}

export const initialPlayers: Player[] = [
  ...createTeamPlayers("TEAM-U8", "U8 Academy", "U08", "Male", 7, [
    { first: "Abel", middle: "Tesfaye", last: "Mekonnen", pos: "Striker", jersey: 9, ovr: 72, photo: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=300&auto=format&fit=crop&q=80" },
    { first: "Bekele", middle: "Girma", last: "Tola", pos: "Midfielder", jersey: 10, ovr: 74, photo: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=300&auto=format&fit=crop&q=80" },
    { first: "Chala", middle: "Desta", last: "Tadesse", pos: "Defender", jersey: 4, ovr: 68, photo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300&auto=format&fit=crop&q=80" },
    { first: "Dawit", middle: "Kassa", last: "Bekele", pos: "Winger", jersey: 7, ovr: 71, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" },
    { first: "Ermias", middle: "Solomon", last: "Girma", pos: "Goalkeeper", jersey: 1, ovr: 70, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" },
    { first: "Fikru", middle: "Haile", last: "Alemu", pos: "Defender", jersey: 3, ovr: 67, photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80" },
    { first: "Getachew", middle: "Worku", last: "Kebede", pos: "Midfielder", jersey: 8, ovr: 69, photo: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=300&auto=format&fit=crop&q=80" },
    { first: "Henok", middle: "Tassew", last: "Assefa", pos: "Forward", jersey: 11, ovr: 73, photo: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=300&auto=format&fit=crop&q=80" },
    { first: "Israel", middle: "Kebede", last: "Tesfaye", pos: "Defender", jersey: 5, ovr: 66, photo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300&auto=format&fit=crop&q=80" },
    { first: "Jofar", middle: "Tamirat", last: "Bikila", pos: "Winger", jersey: 17, ovr: 70, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" }
  ]),

  ...createTeamPlayers("TEAM-U10", "U10 Juniors", "U10", "Male", 9, [
    { first: "Kirubel", middle: "Tadesse", last: "Worku", pos: "Attacking Midfielder", jersey: 10, ovr: 76, photo: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=300&auto=format&fit=crop&q=80" },
    { first: "Luel", middle: "Gebre", last: "Hailu", pos: "Center Forward", jersey: 9, ovr: 78, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" },
    { first: "Mikiyas", middle: "Alemu", last: "Kassaye", pos: "Right Winger", jersey: 7, ovr: 75, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" },
    { first: "Nahom", middle: "Bikila", last: "Tassew", pos: "Center Back", jersey: 4, ovr: 72, photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80" },
    { first: "Oliyad", middle: "Fekadu", last: "Girma", pos: "Left Back", jersey: 3, ovr: 71, photo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300&auto=format&fit=crop&q=80" },
    { first: "Paulos", middle: "Solomon", last: "Woldie", pos: "Goalkeeper", jersey: 1, ovr: 74, photo: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=300&auto=format&fit=crop&q=80" },
    { first: "Robel", middle: "Worku", last: "Asefa", pos: "Central Midfielder", jersey: 8, ovr: 73, photo: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=300&auto=format&fit=crop&q=80" },
    { first: "Samuel", middle: "Girma", last: "Mekonnen", pos: "Left Winger", jersey: 11, ovr: 77, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" },
    { first: "Tariku", middle: "Desta", last: "Kebede", pos: "Defensive Midfielder", jersey: 6, ovr: 70, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" },
    { first: "Yonas", middle: "Haile", last: "Tola", pos: "Right Back", jersey: 2, ovr: 71, photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80" }
  ]),

  ...createTeamPlayers("TEAM-U12", "U12 Development", "U12", "Male", 11, [
    { first: "Amanuel", middle: "Tekle", last: "Girma", pos: "Central Midfielder", jersey: 8, ovr: 79, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" },
    { first: "Biniam", middle: "Girma", last: "Bekele", pos: "Striker", jersey: 9, ovr: 81, photo: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=300&auto=format&fit=crop&q=80" },
    { first: "Caleb", middle: "Solomon", last: "Tesfaye", pos: "Center Back", jersey: 5, ovr: 76, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" },
    { first: "Daniel", middle: "Worku", last: "Tola", pos: "Right Winger", jersey: 7, ovr: 80, photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80" },
    { first: "Elias", middle: "Kassa", last: "Alemu", pos: "Left Winger", jersey: 11, ovr: 78, photo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300&auto=format&fit=crop&q=80" },
    { first: "Firaol", middle: "Desta", last: "Girma", pos: "Goalkeeper", jersey: 1, ovr: 77, photo: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=300&auto=format&fit=crop&q=80" },
    { first: "Gideon", middle: "Haile", last: "Workneh", pos: "Center Back", jersey: 4, ovr: 75, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" },
    { first: "Habtamu", middle: "Alemu", last: "Kebede", pos: "Left Back", jersey: 3, ovr: 74, photo: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=300&auto=format&fit=crop&q=80" },
    { first: "Isaac", middle: "Tassew", last: "Bikila", pos: "Defensive Midfielder", jersey: 6, ovr: 76, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" },
    { first: "Jemil", middle: "Beshir", last: "Tadesse", pos: "Right Back", jersey: 2, ovr: 73, photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80" }
  ]),

  ...createTeamPlayers("TEAM-U13", "U13 Premier", "U13", "Male", 12, [
    { first: "Abebe", middle: "Bikila", last: "Tassew", pos: "Central Midfielder", jersey: 10, ovr: 83, photo: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=300&auto=format&fit=crop&q=80" },
    { first: "Dawit", middle: "Fekadu", last: "Girma", pos: "Right Winger", jersey: 7, ovr: 81, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" },
    { first: "Elias", middle: "Solomon", last: "Kassa", pos: "Attacking Midfielder", jersey: 11, ovr: 80, photo: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=300&auto=format&fit=crop&q=80" },
    { first: "Fikadu", middle: "Girma", last: "Woldemariam", pos: "Center Back", jersey: 4, ovr: 78, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" },
    { first: "Girma", middle: "Tolesa", last: "Kebede", pos: "Striker", jersey: 9, ovr: 84, photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80" },
    { first: "Haile", middle: "Gebrselassie", last: "Bikila", pos: "Left Winger", jersey: 17, ovr: 82, photo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300&auto=format&fit=crop&q=80" },
    { first: "Kenenisa", middle: "Bekele", last: "Worku", pos: "Defensive Midfielder", jersey: 6, ovr: 79, photo: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=300&auto=format&fit=crop&q=80" },
    { first: "Lidetu", middle: "Ayano", last: "Tadesse", pos: "Goalkeeper", jersey: 1, ovr: 77, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" },
    { first: "Mulugeta", middle: "Tesfaye", last: "Hailu", pos: "Left Back", jersey: 3, ovr: 76, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" },
    { first: "Negash", middle: "Worku", last: "Alemu", pos: "Right Back", jersey: 2, ovr: 75, photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80" }
  ]),

  ...createTeamPlayers("TEAM-U15", "U15 Cadets", "U15", "Male", 14, [
    { first: "Yared", middle: "Bayeh", last: "Belay", pos: "Center Back", jersey: 4, ovr: 84, photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80" },
    { first: "Mikiyas", middle: "Robel", last: "Worku", pos: "Left Back", jersey: 3, ovr: 81, photo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300&auto=format&fit=crop&q=80" },
    { first: "Asefa", middle: "Tola", last: "Girma", pos: "Striker", jersey: 9, ovr: 85, photo: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=300&auto=format&fit=crop&q=80" },
    { first: "Birhanu", middle: "Legesse", last: "Kebede", pos: "Central Midfielder", jersey: 8, ovr: 83, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" },
    { first: "Chekole", middle: "Desta", last: "Tessema", pos: "Right Winger", jersey: 7, ovr: 82, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" },
    { first: "Desta", middle: "Workneh", last: "Alemu", pos: "Defensive Midfielder", jersey: 6, ovr: 80, photo: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=300&auto=format&fit=crop&q=80" },
    { first: "Eyob", middle: "Solomon", last: "Bikila", pos: "Center Back", jersey: 5, ovr: 79, photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80" },
    { first: "Fayisa", middle: "Lilesa", last: "Hailu", pos: "Goalkeeper", jersey: 1, ovr: 82, photo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300&auto=format&fit=crop&q=80" },
    { first: "Getu", middle: "Feleke", last: "Tadesse", pos: "Left Winger", jersey: 11, ovr: 81, photo: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=300&auto=format&fit=crop&q=80" },
    { first: "Hagos", middle: "Gebrhiwet", last: "Kassa", pos: "Right Back", jersey: 2, ovr: 78, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" }
  ]),

  ...createTeamPlayers("TEAM-U17", "U17 Elite", "U17", "Male", 16, [
    { first: "Tamirat", middle: "Tola", last: "Kebede", pos: "Striker", jersey: 9, ovr: 86, photo: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=300&auto=format&fit=crop&q=80" },
    { first: "Sisay", middle: "Lemma", last: "Worku", pos: "Attacking Midfielder", jersey: 10, ovr: 85, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" },
    { first: "Lamecha", middle: "Girma", last: "Tessema", pos: "Right Winger", jersey: 7, ovr: 84, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" },
    { first: "Selemon", middle: "Barega", last: "Hailu", pos: "Center Back", jersey: 4, ovr: 83, photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80" },
    { first: "Yomif", middle: "Kejelcha", last: "Alemu", pos: "Left Back", jersey: 3, ovr: 80, photo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300&auto=format&fit=crop&q=80" },
    { first: "Berihu", middle: "Aregawi", last: "Bikila", pos: "Defensive Midfielder", jersey: 6, ovr: 82, photo: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=300&auto=format&fit=crop&q=80" },
    { first: "Muktar", middle: "Edris", last: "Kassa", pos: "Right Back", jersey: 2, ovr: 79, photo: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=300&auto=format&fit=crop&q=80" },
    { first: "Hagos", middle: "Worlde", last: "Bekele", pos: "Goalkeeper", jersey: 1, ovr: 83, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" },
    { first: "Ibrahim", middle: "Jeilan", last: "Tassew", pos: "Left Winger", jersey: 11, ovr: 82, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" },
    { first: "Jemalesh", middle: "Desta", last: "Girma", pos: "Center Back", jersey: 5, ovr: 81, photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80" }
  ]),

  ...createTeamPlayers("TEAM-U18", "U18 Seniors Prep", "U18", "Male", 17, [
    { first: "Samuel", middle: "Wolde", last: "Begashaw", pos: "Striker", jersey: 9, ovr: 88, photo: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=300&auto=format&fit=crop&q=80" },
    { first: "Deriba", middle: "Merga", last: "Kebede", pos: "Central Midfielder", jersey: 10, ovr: 87, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" },
    { first: "Tsegaye", middle: "Kebede", last: "Alemu", pos: "Center Back", jersey: 4, ovr: 86, photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80" },
    { first: "Ayele", middle: "Abshero", last: "Tessema", pos: "Right Winger", jersey: 7, ovr: 85, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" },
    { first: "Bazu", middle: "Worku", last: "Girma", pos: "Left Back", jersey: 3, ovr: 82, photo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300&auto=format&fit=crop&q=80" },
    { first: "Feyisa", middle: "Lilesa", last: "Bekele", pos: "Goalkeeper", jersey: 1, ovr: 85, photo: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=300&auto=format&fit=crop&q=80" },
    { first: "Gebregziabher", middle: "Gebremariam", last: "Tadesse", pos: "Defensive Midfielder", jersey: 6, ovr: 84, photo: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=300&auto=format&fit=crop&q=80" },
    { first: "Imane", middle: "Merga", last: "Kassa", pos: "Right Back", jersey: 2, ovr: 81, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" },
    { first: "Lelisa", middle: "Desisa", last: "Bikila", pos: "Left Winger", jersey: 11, ovr: 86, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" },
    { first: "Markos", middle: "Geneti", last: "Hailu", pos: "Center Back", jersey: 5, ovr: 83, photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80" }
  ]),

  ...createTeamPlayers("TEAM-WOMEN", "Women's Team", "WOM", "Female", 17, [
    { first: "Bethlehem", middle: "Sheferaw", last: "Hailu", pos: "Striker", jersey: 9, ovr: 87, photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" },
    { first: "Genzebe", middle: "Dibaba", last: "Tadesse", pos: "Attacking Midfielder", jersey: 10, ovr: 88, photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80" },
    { first: "Tirunesh", middle: "Dibaba", last: "Kebede", pos: "Center Back", jersey: 4, ovr: 89, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80" },
    { first: "Meseret", middle: "Defar", last: "Tola", pos: "Left Winger", jersey: 11, ovr: 86, photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" },
    { first: "Almaz", middle: "Ayana", last: "Girma", pos: "Central Midfielder", jersey: 8, ovr: 87, photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80" },
    { first: "Worknesh", middle: "Degefa", last: "Alemu", pos: "Right Winger", jersey: 7, ovr: 84, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80" },
    { first: "Gudaf", middle: "Tsegay", last: "Bikila", pos: "Defensive Midfielder", jersey: 6, ovr: 85, photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" },
    { first: "Letesenbet", middle: "Gidey", last: "Worku", pos: "Center Back", jersey: 5, ovr: 86, photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80" },
    { first: "Ejgayehu", middle: "Tayaye", last: "Kassa", pos: "Left Back", jersey: 3, ovr: 81, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80" },
    { first: "Gotytom", middle: "Gebreslase", last: "Tesfaye", pos: "Goalkeeper", jersey: 1, ovr: 84, photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" }
  ]),

  ...createTeamPlayers("TEAM-HEALTH", "Health & Fitness Veterans", "HEA", "Male", 32, [
    { first: "Haile", middle: "Gebreselassie", last: "Workneh", pos: "Playmaker", jersey: 10, ovr: 91, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" },
    { first: "Miruts", middle: "Yifter", last: "Tessema", pos: "Striker", jersey: 9, ovr: 89, photo: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=300&auto=format&fit=crop&q=80" },
    { first: "Belayneh", middle: "Dinsamo", last: "Kebede", pos: "Center Back", jersey: 4, ovr: 85, photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80" },
    { first: "Mamo", middle: "Wolde", last: "Girma", pos: "Midfielder", jersey: 8, ovr: 87, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" },
    { first: "Eshetu", middle: "Tura", last: "Alemu", pos: "Defender", jersey: 5, ovr: 82, photo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300&auto=format&fit=crop&q=80" },
    { first: "Addis", middle: "Abebe", last: "Tola", pos: "Winger", jersey: 7, ovr: 84, photo: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=300&auto=format&fit=crop&q=80" },
    { first: "Fita", middle: "Bayisa", last: "Tadesse", pos: "Full Back", jersey: 2, ovr: 81, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" },
    { first: "Worku", middle: "Bikila", last: "Worku", pos: "Goalkeeper", jersey: 1, ovr: 83, photo: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=300&auto=format&fit=crop&q=80" },
    { first: "Assefa", middle: "Mezgebu", last: "Hailu", pos: "Defender", jersey: 3, ovr: 80, photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80" },
    { first: "Gezahegne", middle: "Aberra", last: "Kassa", pos: "Forward", jersey: 11, ovr: 86, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" }
  ])
];

export const initialRegistrations: Registration[] = [
  {
    id: "REG-1045",
    applicantName: "Solomon Kassa (Parent)",
    playerFullName: "Elias Solomon Kassa",
    playerDateOfBirth: "2013-09-12",
    gender: "Male",
    teamId: "TEAM-U13",
    teamName: "U13 Premier",
    phone: "+251912334455",
    email: "solomon.kassa@gmail.com",
    submittedAt: "2026-08-25T14:30:00Z",
    status: "PENDING_REVIEW",
    paymentStatus: "PENDING",
    playerData: {
      firstName: "Elias",
      middleName: "Solomon",
      lastName: "Kassa",
      fullName: "Elias Solomon Kassa",
      dateOfBirth: "2013-09-12",
      age: 13,
      gender: "Male",
      nationality: "Ethiopian",
      placeOfBirth: "Addis Ababa",
      phone: "+251912334455",
      address: "Kolfe Keranio, Woreda 04, Addis Ababa",
      photoUrl: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=300&auto=format&fit=crop&q=80",
      position: "Attacking Midfielder",
      jerseyNumber: 11
    },
    parentData: {
      fullName: "Solomon Kassa Woldie",
      relationship: "Father",
      phone: "+251912334455",
      email: "solomon.kassa@gmail.com",
      nationalIdNumber: "ETH-ID-4401928",
      nationalIdDocUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80",
      residenceIdNumber: "AA-RES-8812",
      residenceIdDocUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80"
    },
    documents: {
      birthCertificateNumber: "BC-AA-2013-9011",
      birthCertificateDocUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
      parentNationalIdDocUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80",
      parentResidenceIdDocUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80"
    }
  }
];

export const initialPayments: PaymentTransaction[] = [
  {
    id: "PAY-9001",
    playerId: "BFC-U13-0001",
    playerName: "Abebe Bikila Tassew",
    teamId: "TEAM-U13",
    teamName: "U13 Premier",
    parentName: "Bikila Tassew Kebede",
    parentPhone: "+251911400101",
    amount: 1500,
    type: "MONTHLY",
    transactionId: "TXN-998201",
    paymentDate: "2026-08-01T10:00:00Z",
    paymentMethod: "Telebirr",
    screenshotUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
    verificationStatus: "Verified",
    verifiedBy: "Martha Haile (Finance Officer)",
    verificationDate: "2026-08-01T11:30:00Z"
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: "NOTIF-001",
    recipientRole: "ALL",
    title: "New Registration Pending",
    message: "New application received for Elias Solomon Kassa (U13 Premier). Awaiting manager review.",
    channel: "IN_APP",
    status: "SENT",
    createdAt: "2026-08-25T14:31:00Z",
    isRead: false,
    linkUrl: "/admin/registrations",
    type: "REGISTRATION_ALERT"
  }
];

export const initialGalleryAlbums: GalleryAlbum[] = [
  {
    id: "ALB-001",
    title: "U12 & U13 Training Ground Action",
    category: "Training",
    description: "Highlights from August 2026 tactical drills at Bulbula Amen Main Turf",
    coverUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
    mediaCount: 12,
    createdAt: "2026-08-15T12:00:00Z",
    published: true,
    items: [
      {
        id: "MED-101",
        type: "photo",
        url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
        caption: "Passing drill under Coach Ashenafi Bekele",
        uploadedAt: "2026-08-15T12:00:00Z"
      }
    ]
  }
];

export const initialCMSContent: CMSContent = {
  heroTitle: "Nurturing Football Excellence & Character in Addis Ababa",
  heroSubtitle: "Official Youth Academy, Professional Player Development, and Community Health Programs of Bulbula Amen Football Club.",
  heroBannerUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1600&auto=format&fit=crop&q=80",
  announcements: [
    {
      id: "ANN-001",
      title: "2026/27 Season Registration Now Open!",
      content: "Register now for U8, U10, U12, U13, U15, U17, U18, Women's, and Health teams. Limited slots available per age group.",
      date: "2026-08-20",
      active: true
    }
  ],
  clubPhone: "+251 91 123 4567 / +251 91 987 6543",
  clubEmail: "contact@bulbulaamenfc.com",
  clubAddress: "Bulbula Amen Football Ground, Bole Sub-City, Addis Ababa, Ethiopia",
  socialLinks: {
    facebook: "https://facebook.com/bulbulaamenfc",
    telegram: "https://t.me/bulbulaamenfc",
    instagram: "https://instagram.com/bulbulaamenfc",
    youtube: "https://youtube.com/@bulbulaamenfc"
  },
  feesNotice: "All registration and monthly fees must be paid via Telebirr or CBE Birr with payment receipt screenshot uploaded for instant verification.",
  trainingLocation: "Bulbula Amen Complex Ground, Bole Woreda 03, Addis Ababa"
};

export const initialAuditLogs: AuditLog[] = [
  {
    id: "LOG-001",
    userId: "USR-003",
    userName: "Tewodros Kassaye",
    userRole: "MANAGER",
    action: "Approved Registration REG-1045",
    affectedRecordId: "REG-1045",
    affectedRecordType: "Registration",
    previousValue: "PENDING_REVIEW",
    newValue: "AWAITING_PAYMENT",
    timestamp: "2026-08-26T11:00:00Z",
    ipAddress: "197.156.98.12"
  }
];

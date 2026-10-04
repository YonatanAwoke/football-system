import { Player, Registration, PaymentTransaction, AttendanceSession, User, AuditLog } from './types';

export function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportPlayersToCSV(players: Player[], reportTitle: string = "Players Roster"): string {
  const headers = [
    "Player ID",
    "Full Name",
    "Date of Birth",
    "Age",
    "Gender",
    "Team",
    "Jersey Number",
    "Position",
    "Phone",
    "Parent Name",
    "Parent Phone",
    "Registration Date",
    "Status",
    "Payment Status",
    "Games Played",
    "Goals",
    "Assists",
    "Training Attendance (%)"
  ];

  const rows = players.map(p => [
    `"${p.id}"`,
    `"${p.fullName}"`,
    `"${p.dateOfBirth}"`,
    p.age,
    `"${p.gender}"`,
    `"${p.teamName}"`,
    p.jerseyNumber,
    `"${p.position}"`,
    `"${p.phone}"`,
    `"${p.parentInfo?.fullName || ''}"`,
    `"${p.parentInfo?.phone || ''}"`,
    `"${p.registrationDate || '2024-09-01'}"`,
    `"${p.status}"`,
    `"${p.feeSchedule?.paymentStatus || p.paymentStatus}"`,
    p.statistics?.gamesPlayed || 0,
    p.statistics?.goals || 0,
    p.statistics?.assists || 0,
    `${p.statistics?.trainingAttendance || 0}%`
  ]);

  return [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
}

export function exportRegistrationsToCSV(registrations: Registration[]): string {
  const headers = [
    "Registration ID",
    "Applicant Name",
    "Player Name",
    "Date of Birth",
    "Gender",
    "Team",
    "Phone",
    "Email",
    "Submitted At",
    "Status",
    "Payment Status"
  ];

  const rows = registrations.map(r => [
    `"${r.id}"`,
    `"${r.applicantName}"`,
    `"${r.playerFullName}"`,
    `"${r.playerDateOfBirth}"`,
    `"${r.gender}"`,
    `"${r.teamName}"`,
    `"${r.phone}"`,
    `"${r.email}"`,
    `"${r.submittedAt}"`,
    `"${r.status}"`,
    `"${r.paymentStatus}"`
  ]);

  return [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
}

export function exportPaymentsToCSV(payments: PaymentTransaction[]): string {
  const headers = [
    "Transaction ID",
    "Player Name",
    "Team",
    "Parent Name",
    "Parent Phone",
    "Amount (ETB)",
    "Payment Type",
    "Method",
    "Payment Date",
    "Status"
  ];

  const rows = payments.map(p => [
    `"${p.transactionId || p.id}"`,
    `"${p.playerName}"`,
    `"${p.teamName}"`,
    `"${p.parentName}"`,
    `"${p.parentPhone}"`,
    p.amount,
    `"${p.type}"`,
    `"${p.paymentMethod}"`,
    `"${p.paymentDate}"`,
    `"${p.verificationStatus}"`
  ]);

  return [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
}

export function exportAttendanceToCSV(sessions: AttendanceSession[]): string {
  const headers = [
    "Session ID",
    "Team",
    "Session Date",
    "Type",
    "Coach",
    "Total Players Marked",
    "Present Count",
    "Absent Count"
  ];

  const rows = sessions.map(s => {
    const records = s.records || [];
    const present = records.filter(r => r.status === 'PRESENT').length;
    const absent = records.filter(r => r.status === 'ABSENT').length;
    return [
      `"${s.id}"`,
      `"${s.teamName}"`,
      `"${s.sessionDate}"`,
      `"${s.sessionType}"`,
      `"${s.coachName}"`,
      records.length,
      present,
      absent
    ];
  });

  return [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
}

export function exportUsersToCSV(users: User[]): string {
  const headers = [
    "User ID",
    "Name",
    "Email",
    "Phone",
    "Role",
    "Assigned Team ID",
    "Status",
    "Created At"
  ];

  const rows = users.map(u => [
    `"${u.id}"`,
    `"${u.name}"`,
    `"${u.email}"`,
    `"${u.phone}"`,
    `"${u.role}"`,
    `"${u.assignedTeamId || 'N/A'}"`,
    `"${u.active ? 'ACTIVE' : 'INACTIVE'}"`,
    `"${u.createdAt}"`
  ]);

  return [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
}

export function exportAuditLogsToCSV(logs: AuditLog[]): string {
  const headers = [
    "Log ID",
    "Timestamp",
    "User Name",
    "User Role",
    "Action",
    "Record Type",
    "Record ID",
    "Previous Value",
    "New Value"
  ];

  const rows = logs.map(l => [
    `"${l.id}"`,
    `"${l.timestamp}"`,
    `"${l.userName}"`,
    `"${l.userRole}"`,
    `"${l.action}"`,
    `"${l.affectedRecordType}"`,
    `"${l.affectedRecordId}"`,
    `"${l.previousValue || ''}"`,
    `"${l.newValue || ''}"`
  ]);

  return [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
}

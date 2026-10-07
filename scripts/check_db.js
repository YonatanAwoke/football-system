// Script to compile the entire Football System into a single standalone HTML file
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

console.log('Loaded DB Data:');
console.log('Players:', dbData.players?.length);
console.log('Teams:', dbData.teams?.length);
console.log('Users:', dbData.users?.length);
console.log('Payments:', dbData.payments?.length);
console.log('Registrations:', dbData.registrations?.length);
console.log('Gallery:', dbData.gallery?.length);
console.log('AuditLogs:', dbData.auditLogs?.length);

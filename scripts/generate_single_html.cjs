const fs = require('fs');
const path = require('path');

// Read existing db.json
const dbPath = path.join(__dirname, 'data', 'db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

console.log(`Loaded db.json successfully. Players: ${dbData.players.length}, Teams: ${dbData.teams.length}`);

// We will generate the complete, self-contained single HTML file
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bulbula Amen F.C. — Academy Management Portal</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --brand-orange: #f96302;
      --brand-orange-hover: #ea580c;
      --brand-orange-light: #fff7ed;
      --brand-navy: #0f172a;
      --brand-navy-card: #1e293b;
      --brand-amber: #f59e0b;
      --brand-emerald: #10b981;
      --brand-red: #ef4444;
      --brand-blue: #3b82f6;
      --bg-slate: #f8fafc;
      --border-slate: #e2e8f0;
      --border-slate-light: #f1f5f9;
      --text-dark: #0f172a;
      --text-muted: #64748b;
      --text-sub: #94a3b8;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg-slate);
      color: var(--text-dark);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      min-height: 100vh;
      overflow-x: hidden;
    }

    h1, h2, h3, h4, .font-heading {
      font-family: 'Outfit', sans-serif;
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #f1f5f9; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 9999px; }
    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

    /* Utility Layout Classes */
    .flex { display: flex; }
    .inline-flex { display: inline-flex; }
    .grid { display: grid; }
    .hidden { display: none !important; }
    .flex-col { flex-direction: column; }
    .items-center { align-items: center; }
    .items-start { align-items: flex-start; }
    .items-end { align-items: flex-end; }
    .justify-between { justify-content: space-between; }
    .justify-center { justify-content: center; }
    .justify-end { justify-content: flex-end; }
    .flex-1 { flex: 1 1 0%; }
    .flex-shrink-0 { flex-shrink: 0; }
    .flex-wrap { flex-wrap: wrap; }
    .gap-1 { gap: 0.25rem; }
    .gap-1\\.5 { gap: 0.375rem; }
    .gap-2 { gap: 0.5rem; }
    .gap-3 { gap: 0.75rem; }
    .gap-4 { gap: 1rem; }
    .gap-6 { gap: 1.5rem; }
    .gap-8 { gap: 2rem; }

    /* Spacing */
    .p-1 { padding: 0.25rem; }
    .p-1\\.5 { padding: 0.375rem; }
    .p-2 { padding: 0.5rem; }
    .p-3 { padding: 0.75rem; }
    .p-4 { padding: 1rem; }
    .p-5 { padding: 1.25rem; }
    .p-6 { padding: 1.5rem; }
    .p-8 { padding: 2rem; }
    .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
    .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .px-5 { padding-left: 1.25rem; padding-right: 1.25rem; }
    .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
    .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
    .py-1\\.5 { padding-top: 0.375rem; padding-bottom: 0.375rem; }
    .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
    .py-2\\.5 { padding-top: 0.625rem; padding-bottom: 0.625rem; }
    .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
    .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
    .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
    .py-12 { padding-top: 3rem; padding-bottom: 3rem; }

    .m-0 { margin: 0; }
    .mb-1 { margin-bottom: 0.25rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-3 { margin-bottom: 0.75rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    .mt-1 { margin-top: 0.25rem; }
    .mt-2 { margin-top: 0.5rem; }
    .mt-4 { margin-top: 1rem; }
    .mt-6 { margin-top: 1.5rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }

    /* Dimensions */
    .w-full { width: 100%; }
    .w-auto { width: auto; }
    .h-full { height: 100%; }
    .min-h-screen { min-height: 100vh; }
    .max-w-md { max-width: 28rem; }
    .max-w-lg { max-width: 32rem; }
    .max-w-xl { max-width: 36rem; }
    .max-w-2xl { max-width: 42rem; }
    .max-w-4xl { max-width: 56rem; }
    .max-w-5xl { max-width: 64rem; }
    .max-w-6xl { max-width: 72rem; }
    .max-w-7xl { max-width: 80rem; }

    /* Borders & Radius */
    .rounded-md { border-radius: 0.375rem; }
    .rounded-lg { border-radius: 0.5rem; }
    .rounded-xl { border-radius: 0.75rem; }
    .rounded-2xl { border-radius: 1rem; }
    .rounded-3xl { border-radius: 1.5rem; }
    .rounded-full { border-radius: 9999px; }
    .border { border: 1px solid var(--border-slate); }
    .border-b { border-bottom: 1px solid var(--border-slate); }
    .border-t { border-top: 1px solid var(--border-slate); }
    .border-r { border-right: 1px solid var(--border-slate); }
    .border-l { border-left: 1px solid var(--border-slate); }
    .border-orange { border-color: var(--brand-orange); }

    /* Backgrounds & Colors */
    .bg-white { background-color: #ffffff; }
    .bg-slate-50 { background-color: #f8fafc; }
    .bg-slate-100 { background-color: #f1f5f9; }
    .bg-slate-200 { background-color: #e2e8f0; }
    .bg-slate-800 { background-color: #1e293b; }
    .bg-slate-900 { background-color: #0f172a; }
    .bg-orange { background-color: var(--brand-orange); }
    .bg-orange-light { background-color: var(--brand-orange-light); }
    .bg-emerald-50 { background-color: #ecfdf5; }
    .bg-emerald-500 { background-color: #10b981; }
    .bg-amber-50 { background-color: #fffbeb; }
    .bg-red-50 { background-color: #fef2f2; }
    .bg-blue-50 { background-color: #eff6ff; }

    .text-white { color: #ffffff; }
    .text-slate-400 { color: #94a3b8; }
    .text-slate-500 { color: #64748b; }
    .text-slate-600 { color: #475569; }
    .text-slate-700 { color: #334155; }
    .text-slate-800 { color: #1e293b; }
    .text-slate-900 { color: #0f172a; }
    .text-orange { color: var(--brand-orange); }
    .text-emerald { color: #059669; }
    .text-amber { color: #d97706; }
    .text-red { color: #dc2626; }
    .text-blue { color: #2563eb; }

    /* Typography */
    .text-xs { font-size: 0.75rem; line-height: 1rem; }
    .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
    .text-base { font-size: 1rem; line-height: 1.5rem; }
    .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
    .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
    .text-2xl { font-size: 1.5rem; line-height: 2rem; }
    .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
    .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }

    .font-normal { font-weight: 400; }
    .font-medium { font-weight: 500; }
    .font-semibold { font-weight: 600; }
    .font-bold { font-weight: 700; }
    .font-extrabold { font-weight: 800; }
    .font-black { font-weight: 900; }
    .uppercase { text-transform: uppercase; }
    .tracking-tight { letter-spacing: -0.025em; }
    .tracking-wide { letter-spacing: 0.025em; }
    .tracking-widest { letter-spacing: 0.1em; }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .text-left { text-align: left; }
    .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    /* Shadows */
    .shadow-xs { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
    .shadow-sm { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1); }
    .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1); }
    .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1); }
    .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); }
    .shadow-orange { box-shadow: 0 10px 25px -3px rgba(249, 99, 2, 0.3); }

    /* Transitions & Interactivity */
    .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 200ms; }
    .cursor-pointer { cursor: pointer; }
    .select-none { user-select: none; }
    button { border: none; outline: none; background: none; font-family: inherit; cursor: pointer; }
    input, select, textarea { font-family: inherit; font-size: inherit; }

    /* Button Styles */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 0.75rem;
      font-weight: 700;
      font-size: 0.8125rem;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .btn-orange {
      background: linear-gradient(135deg, var(--brand-orange), #ea580c);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(249, 99, 2, 0.25);
    }
    .btn-orange:hover {
      background: linear-gradient(135deg, #ea580c, #c2410c);
      box-shadow: 0 6px 16px rgba(249, 99, 2, 0.35);
      transform: translateY(-1px);
    }
    .btn-white {
      background: #ffffff;
      color: #334155;
      border: 1px solid var(--border-slate);
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
    .btn-white:hover {
      background: #f8fafc;
      color: #0f172a;
      border-color: #cbd5e1;
    }
    .btn-slate {
      background: #f1f5f9;
      color: #475569;
    }
    .btn-slate:hover {
      background: #e2e8f0;
      color: #0f172a;
    }
    .btn-emerald {
      background: #10b981;
      color: white;
    }
    .btn-emerald:hover { background: #059669; }
    .btn-red {
      background: #ef4444;
      color: white;
    }
    .btn-red:hover { background: #dc2626; }

    /* Form Inputs */
    .form-input {
      width: 100%;
      padding: 0.625rem 0.875rem;
      border-radius: 0.75rem;
      border: 1px solid var(--border-slate);
      background-color: #ffffff;
      color: #0f172a;
      font-size: 0.875rem;
      transition: all 0.15s ease;
      outline: none;
    }
    .form-input:focus {
      border-color: var(--brand-orange);
      box-shadow: 0 0 0 3px rgba(249, 99, 2, 0.15);
    }

    /* Badges */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.25rem 0.625rem;
      border-radius: 9999px;
      font-size: 0.6875rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .badge-active { background-color: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
    .badge-pending { background-color: #fffbeb; color: #d97706; border: 1px solid #fde68a; }
    .badge-overdue { background-color: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
    .badge-paid { background-color: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
    .badge-rejected { background-color: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
    .badge-verified { background-color: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
    .badge-team { background-color: #f8fafc; color: #475569; border: 1px solid #e2e8f0; }

    /* Card styling */
    .card {
      background: #ffffff;
      border: 1px solid var(--border-slate);
      border-radius: 1.25rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      overflow: hidden;
    }
    .card-hover:hover {
      border-color: #cbd5e1;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08);
      transform: translateY(-2px);
    }

    /* Modals & Backdrop */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background-color: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .modal-content {
      background: #ffffff;
      border-radius: 1.5rem;
      max-width: 48rem;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
      border: 1px solid var(--border-slate);
      animation: modalIn 0.2s ease-out;
    }
    @keyframes modalIn {
      from { opacity: 0; transform: scale(0.96) translateY(8px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    /* FIFA Player Card Visual Style */
    .fifa-card {
      position: relative;
      width: 250px;
      height: 380px;
      border-radius: 1.5rem;
      padding: 3px;
      background: linear-gradient(145deg, #ffffff, #fef3c7, #fed7aa, #ffffff);
      border: 2px solid #f59e0b;
      box-shadow: 0 12px 28px rgba(0,0,0,0.15), 0 0 20px rgba(245, 158, 11, 0.2);
      user-select: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
    }
    .fifa-card:hover {
      transform: translateY(-6px) scale(1.02);
      box-shadow: 0 20px 35px rgba(249, 99, 2, 0.3);
      border-color: var(--brand-orange);
    }
    .fifa-inner {
      width: 100%;
      height: 100%;
      border-radius: calc(1.5rem - 3px);
      background: radial-gradient(circle at 50% 20%, #ffffff 0%, #fffbeb 60%, #fed7aa 100%);
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    }
    .fifa-gold-pattern {
      position: absolute;
      inset: 0;
      opacity: 0.07;
      background-image: repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 0, transparent 8px);
      pointer-events: none;
    }

    /* Tables */
    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    .data-table th {
      padding: 0.75rem 1rem;
      background: #f8fafc;
      font-size: 0.6875rem;
      font-weight: 800;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--border-slate);
    }
    .data-table td {
      padding: 0.875rem 1rem;
      border-bottom: 1px solid #f1f5f9;
      font-size: 0.8125rem;
      color: #1e293b;
    }
    .data-table tr:hover td {
      background: #f8fafc;
    }

    /* Mobile Drawer */
    .sidebar-drawer {
      transition: transform 0.3s ease;
    }
    @media (max-width: 768px) {
      .sidebar-desktop { display: none !important; }
      .sidebar-open { transform: translateX(0) !important; }
      .sidebar-closed { transform: translateX(-100%) !important; }
    }
    @media (min-width: 769px) {
      .mobile-menu-btn { display: none !important; }
    }

    /* Toast Notification */
    .toast-container {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 999;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      pointer-events: none;
    }
    .toast {
      pointer-events: auto;
      background: #0f172a;
      color: #ffffff;
      padding: 0.75rem 1.25rem;
      border-radius: 0.875rem;
      font-size: 0.8125rem;
      font-weight: 700;
      box-shadow: 0 10px 25px rgba(0,0,0,0.25);
      border: 1px solid rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      animation: toastIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes toastIn {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    /* Print Styles */
    @media print {
      body { background: white !important; }
      header, aside, .no-print, .btn, .modal-backdrop { display: none !important; }
      .main-content { margin-left: 0 !important; padding: 0 !important; width: 100% !important; }
      .card { box-shadow: none !important; border: 1px solid #ccc !important; }
      .fifa-card { break-inside: avoid; page-break-inside: avoid; margin: 10px auto !important; }
    }
  </style>
</head>
<body>
  <div id="app-root"></div>
  <div id="modal-root"></div>
  <div class="toast-container" id="toast-root"></div>

  <script>
    // Embedded Seed Database (Preloaded with all 90 players, 9 teams, payments, registrations, etc.)
    const INITIAL_SEED_DB = ${JSON.stringify(dbData)};

    // SVG Icon Generator (Self-contained, no external font or script needed!)
    function icon(name, cls = "w-4 h-4", size = 16) {
      const icons = {
        'dashboard': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>',
        'users': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        'clipboard': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>',
        'credit-card': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>',
        'shield': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',
        'image': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
        'bell': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
        'globe': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
        'user-cog': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="15" r="3"/><circle cx="9" cy="7" r="4"/><path d="M10 15H6a4 4 0 0 0-4 4v2"/></svg>',
        'settings': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
        'history': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>',
        'search': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
        'menu': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',
        'x': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
        'logout': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>',
        'bar-chart': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>',
        'chevron-down': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
        'chevron-right': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
        'check': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
        'check-circle': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="16 9 12 14 8 10"/></svg>',
        'alert-triangle': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>',
        'plus': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>',
        'edit': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',
        'eye': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
        'download': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',
        'printer': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>',
        'calendar': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',
        'clock': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
        'trophy': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
        'scan': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/></svg>',
        'mail': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
        'phone': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
        'lock': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
        'upload': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>'
      };
      return icons[name] || '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>';
    }

    // Official Bulbula Amen FC Crest Logo SVG
    function getCrestLogoSVG(size = 40) {
      return \`
        <svg width="\${size}" height="\${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0 drop-shadow">
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#f97316"/>
              <stop offset="50%" stop-color="#ea580c"/>
              <stop offset="100%" stop-color="#0f172a"/>
            </linearGradient>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fbbf24"/>
              <stop offset="100%" stop-color="#d97706"/>
            </linearGradient>
          </defs>
          <!-- Outer Shield -->
          <path d="M50 5 L88 20 C88 65 50 92 50 92 C50 92 12 65 12 20 Z" fill="url(#shieldGrad)" stroke="#fbbf24" stroke-width="3"/>
          <!-- Inner Shield Outline -->
          <path d="M50 12 L80 24 C80 60 50 82 50 82 C50 82 20 60 20 24 Z" fill="#0f172a" stroke="#ffffff" stroke-width="1.5" opacity="0.9"/>
          <!-- Soccer Ball -->
          <circle cx="50" cy="46" r="17" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
          <polygon points="50,38 56,43 54,49 46,49 44,43" fill="#0f172a"/>
          <line x1="50" y1="38" x2="50" y2="30" stroke="#0f172a" stroke-width="1.5"/>
          <line x1="56" y1="43" x2="64" y2="40" stroke="#0f172a" stroke-width="1.5"/>
          <line x1="54" y1="49" x2="61" y2="56" stroke="#0f172a" stroke-width="1.5"/>
          <line x1="46" y1="49" x2="39" y2="56" stroke="#0f172a" stroke-width="1.5"/>
          <line x1="44" y1="43" x2="36" y2="40" stroke="#0f172a" stroke-width="1.5"/>
          <!-- Club Banner Ribbon -->
          <path d="M18 70 Q50 78 82 70 L80 77 Q50 85 20 77 Z" fill="url(#goldGrad)" stroke="#0f172a" stroke-width="1"/>
          <text x="50" y="75" font-family="'Outfit', sans-serif" font-weight="900" font-size="6.5" fill="#0f172a" text-anchor="middle" letter-spacing="0.5">BULBULA AMEN FC</text>
          <!-- Stars -->
          <polygon points="50,18 52,23 57,23 53,26 55,31 50,28 45,31 47,26 43,23 48,23" fill="#fbbf24"/>
        </svg>
      \`;
    }

    // Translation Dictionary & Language Engine
    const DICTIONARY = {
      en: {
        "nav.dashboard": "Dashboard",
        "nav.players": "Players",
        "nav.registrations": "Registrations",
        "nav.payments": "Payments & Financials",
        "nav.teams": "Teams & Schedules",
        "nav.gallery": "Gallery CMS",
        "nav.cms": "Website CMS",
        "nav.notifications": "Notifications",
        "nav.users": "Users & Staff",
        "nav.reports": "Reports & Analytics",
        "nav.audit": "Audit Logs",
        "nav.settings": "Club Settings",
        "nav.parent_portal": "Parent Portal",
        "nav.register": "Public Registration",
        "nav.upload_payment": "Upload Payment Receipt",
        "header.title": "BULBULA AMEN F.C.",
        "header.established": "EST. 2000 E.C. • ADDIS ABABA",
        "header.search": "Search players, registrations, receipts...",
        "dash.total_players": "Total Players",
        "dash.active_members": "Active Members",
        "dash.pending_regs": "Pending Registrations",
        "dash.pending_payments": "Pending Verifications",
        "dash.overdue": "Overdue Payments",
        "dash.revenue": "Verified Revenue",
        "players.title": "Academy Player Roster",
        "players.all": "All Players",
        "players.export": "Export CSV",
        "players.add": "Add Player",
        "players.table": "Table View",
        "players.cards": "Card View",
        "reg.title": "Applicant Registrations",
        "reg.pending": "Pending Review",
        "reg.approved": "Approved Roster",
        "reg.rejected": "Rejected",
        "pay.title": "Payment Verifications & Ledgers",
        "pay.queue": "Verification Queue",
        "pay.ledger": "Payment Dashboard",
        "teams.title": "Squads & Training Sessions",
        "teams.schedule": "Weekly Schedule",
        "teams.attendance": "Daily Attendance Sheet",
        "teams.matches": "Match Center",
        "cms.title": "Website CMS & Banners",
        "users.title": "Staff & Role Permissions",
        "reports.title": "Executive Reports Generator",
        "audit.title": "Security & Audit Logs"
      },
      am: {
        "nav.dashboard": "ዳሽቦርድ",
        "nav.players": "ተጫዋቾች",
        "nav.registrations": "ምዝገባዎች",
        "nav.payments": "ክፍያዎች እና ፋይናንስ",
        "nav.teams": "ቡድኖች እና ፕሮግራም",
        "nav.gallery": "ፎቶ ጋለሪ",
        "nav.cms": "ዌብሳይት ሲኤምኤስ",
        "nav.notifications": "ማስታወቂያዎች",
        "nav.users": "ተጠቃሚዎች እና አሰልጣኞች",
        "nav.reports": "ሪፖርቶች",
        "nav.audit": "የደህንነት ኦዲት",
        "nav.settings": "የክለብ መቼቶች",
        "nav.parent_portal": "የወላጅ ፖርታል",
        "nav.register": "አዲስ ምዝገባ",
        "nav.upload_payment": "የክፍያ ደረሰኝ ማስገቢያ",
        "header.title": "ቡልቡላ አመን እግር ኳስ ክለብ",
        "header.established": "ተመሰረተ 2000 ዓ.ም. • አዲስ አበባ",
        "header.search": "ተጫዋች፣ ምዝገባ፣ ደረሰኝ ፈልግ...",
        "dash.total_players": "ጠቅላላ ተጫዋቾች",
        "dash.active_members": "ንቁ አባላት",
        "dash.pending_regs": "የሚገመገሙ ምዝገባዎች",
        "dash.pending_payments": "የሚረጋገጡ ደረሰኞች",
        "dash.overdue": "ያለፈባቸው ክፍያዎች",
        "dash.revenue": "የተሰበሰበ ገቢ",
        "players.title": "የአካዳሚው ተጫዋቾች ዝርዝር",
        "players.all": "ሁሉም ተጫዋቾች",
        "players.export": "በኤክሴል (CSV) አውርድ",
        "players.add": "አዲስ ተጫዋች መዝግብ",
        "players.table": "ሰንጠረዥ እይታ",
        "players.cards": "የካርድ እይታ (FIFA)",
        "reg.title": "የአዳዲስ አመልካቾች ማመልከቻ",
        "reg.pending": "በግምገማ ላይ ያሉ",
        "reg.approved": "የጸደቁ አባላት",
        "reg.rejected": "ውድቅ የተደረጉ",
        "pay.title": "የክፍያ ማረጋገጫ እና ሂሳብ",
        "pay.queue": "የደረሰኞች ማረጋገጫ ተራ",
        "pay.ledger": "የክፍያ ዳሽቦርድ",
        "teams.title": "የዕድሜ ቡድኖች እና ልምምድ",
        "teams.schedule": "የሳምንት መርሃ-ግብር",
        "teams.attendance": "የቀን መገኘት መመዝገቢያ",
        "teams.matches": "የውድድር ውጤቶች",
        "cms.title": "የድረ-ገጽ ማስታወቂያዎች",
        "users.title": "አሰልጣኞች እና ፈቃዶች",
        "reports.title": "ሪፖርቶች ማመንጫ",
        "audit.title": "የደህንነት እና ክትትል መዝገብ"
      }
    };

    const AMHARIC_CONTENT = {
      "Striker": "አጥቂ",
      "Center Forward": "ማዕከላዊ አጥቂ",
      "Right Winger": "ቀኝ ክንፍ",
      "Left Winger": "ግራ ክንፍ",
      "Central Midfielder": "ማዕከላዊ አማካይ",
      "Attacking Midfielder": "አጥቂ አማካይ",
      "Defensive Midfielder": "ተከላካይ አማካይ",
      "Center Back": "ማዕከላዊ ተከላካይ",
      "Left Back": "ግራ ተከላካይ",
      "Right Back": "ቀኝ ተከላካይ",
      "Goalkeeper": "ግብ ጠባቂ",
      "U8 Academy": "U8 አካዳሚ",
      "U10 Juniors": "U10 ጁኒየርስ",
      "U12 Development": "U12 ልማት",
      "U13 Premier": "U13 ፕሪሚየር",
      "U15 Cadets": "U15 ካዴት",
      "U17 Elite": "U17 ኤሊት",
      "U18 Seniors Prep": "U18 ሲኒየርስ",
      "Women's Team": "የሴቶች ቡድን",
      "Health & Fitness Veterans": "የጤና እና አርበኞች",
      "ACTIVE": "ንቁ አባል",
      "PENDING_REVIEW": "በመገምገም ላይ",
      "AWAITING_PAYMENT": "ክፍያ የሚጠብቅ",
      "VERIFIED": "የተረጋገጠ",
      "PAID": "ተከፍሏል",
      "OVERDUE": "ጊዜው ያለፈበት",
      "DUE_SOON": "ክፍያ ደርሷል",
      "REJECTED": "ውድቅ የተደረገ"
    };

    // Global Reactive Application State
    const AppState = {
      currentRoute: window.location.hash.replace('#', '') || 'dashboard',
      language: localStorage.getItem('bulbula_fc_lang') || 'en',
      sidebarOpen: true,
      mobileMenuOpen: false,
      userMenuOpen: false,
      notifDrawerOpen: false,
      searchQuery: '',
      db: null,
      currentUser: {
        id: "USR-002",
        name: "Selamawit Tadesse",
        email: "admin@bulbulaamenfc.com",
        role: "ADMIN",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80"
      },
      // Filters
      playersFilter: { team: 'ALL', status: 'ALL', search: '', viewMode: 'TABLE' },
      regFilter: { status: 'PENDING_REVIEW', search: '' },
      payFilter: { view: 'dashboard', status: 'ALL', search: '' },
      attendanceTeam: 'TEAM-U13',
      attendanceDate: new Date().toISOString().split('T')[0],
      attendanceRecords: {}
    };

    // Initialize Database from LocalStorage or Embed
    function initDatabase() {
      try {
        const stored = localStorage.getItem('bulbula_fc_db');
        if (stored) {
          AppState.db = JSON.parse(stored);
        } else {
          AppState.db = JSON.parse(JSON.stringify(INITIAL_SEED_DB));
          localStorage.setItem('bulbula_fc_db', JSON.stringify(AppState.db));
        }
      } catch (e) {
        console.error("Failed to parse localStorage db, resetting to seed:", e);
        AppState.db = JSON.parse(JSON.stringify(INITIAL_SEED_DB));
      }
    }

    function saveDatabase() {
      try {
        localStorage.setItem('bulbula_fc_db', JSON.stringify(AppState.db));
      } catch (e) {
        console.error("Storage error:", e);
      }
    }

    // Translation helper
    function t(key) {
      const lang = AppState.language;
      return (DICTIONARY[lang] && DICTIONARY[lang][key]) || (DICTIONARY['en'] && DICTIONARY['en'][key]) || key;
    }

    function tContent(text) {
      if (!text) return '';
      if (AppState.language === 'am') {
        return AMHARIC_CONTENT[text] || text;
      }
      return text;
    }

    function setLanguage(lang) {
      AppState.language = lang;
      localStorage.setItem('bulbula_fc_lang', lang);
      renderApp();
      showToast(lang === 'am' ? 'ቋንቋ ወደ አማርኛ ተቀይሯል' : 'Language switched to English');
    }

    // Toast notification
    function showToast(msg) {
      const container = document.getElementById('toast-root');
      if (!container) return;
      const el = document.createElement('div');
      el.className = 'toast';
      el.innerHTML = icon('check-circle', 'text-emerald w-4 h-4') + '<span>' + msg + '</span>';
      container.appendChild(el);
      setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(10px)';
        el.style.transition = 'all 0.3s ease';
        setTimeout(() => el.remove(), 300);
      }, 3500);
    }

    // Audit Logger
    function logAudit(action, type, id, details) {
      if (!AppState.db.auditLogs) AppState.db.auditLogs = [];
      const newLog = {
        id: 'LOG-' + Date.now(),
        timestamp: new Date().toISOString(),
        userId: AppState.currentUser.id,
        userName: AppState.currentUser.name,
        userRole: AppState.currentUser.role,
        action: action,
        affectedRecordType: type,
        affectedRecordId: id,
        details: details || ''
      };
      AppState.db.auditLogs.unshift(newLog);
      saveDatabase();
    }

    // Router
    function navigate(route) {
      AppState.currentRoute = route;
      window.location.hash = route;
      AppState.mobileMenuOpen = false;
      AppState.userMenuOpen = false;
      AppState.notifDrawerOpen = false;
      renderApp();
      window.scrollTo(0, 0);
    }

    window.addEventListener('hashchange', () => {
      const h = window.location.hash.replace('#', '');
      if (h && h !== AppState.currentRoute) {
        AppState.currentRoute = h;
        renderApp();
      }
    });

    // Close popovers on click outside
    document.addEventListener('click', (e) => {
      if (AppState.userMenuOpen && !e.target.closest('#user-menu-btn') && !e.target.closest('#user-menu-dropdown')) {
        AppState.userMenuOpen = false;
        renderApp();
      }
    });

    // Main App Renderer
    function renderApp() {
      const root = document.getElementById('app-root');
      if (!root) return;

      const isPublicScreen = ['login', 'register', 'upload-payment', 'parent'].includes(AppState.currentRoute);

      if (AppState.currentRoute === 'login') {
        root.innerHTML = renderLoginScreen();
        return;
      }
      if (AppState.currentRoute === 'register') {
        root.innerHTML = renderPublicRegisterScreen();
        return;
      }
      if (AppState.currentRoute === 'upload-payment') {
        root.innerHTML = renderUploadPaymentScreen();
        return;
      }
      if (AppState.currentRoute === 'parent') {
        root.innerHTML = renderParentPortalScreen();
        return;
      }

      // Admin Layout
      root.innerHTML = \`
        <div class="flex min-h-screen bg-slate-50">
          <!-- Sidebar (Desktop) -->
          <aside class="\${AppState.sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 transition-all duration-300 hidden md:flex flex-col fixed inset-y-0 left-0 z-30 sidebar-desktop shadow-xs">
            \${renderSidebarContent()}
          </aside>

          <!-- Sidebar (Mobile Drawer) -->
          <div class="fixed inset-0 bg-slate-900/60 z-50 transition-opacity md:hidden \${AppState.mobileMenuOpen ? 'block' : 'hidden'}" onclick="AppState.mobileMenuOpen = false; renderApp();">
            <div class="w-72 bg-white h-full shadow-2xl flex flex-col" onclick="event.stopPropagation();">
              \${renderSidebarContent(true)}
            </div>
          </div>

          <!-- Main Content Area -->
          <div class="flex-1 flex flex-col transition-all duration-300 \${AppState.sidebarOpen ? 'md:ml-64' : 'md:ml-20'} w-full">
            <!-- Top Header -->
            <header class="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-20 shadow-xs">
              <div class="flex items-center gap-3">
                <button class="mobile-menu-btn p-2 rounded-xl text-slate-600 hover:bg-slate-100" onclick="AppState.mobileMenuOpen = true; renderApp();">
                  \${icon('menu', 'w-5 h-5')}
                </button>
                <button class="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hidden md:block" onclick="AppState.sidebarOpen = !AppState.sidebarOpen; renderApp();" title="Toggle Sidebar">
                  \${icon(AppState.sidebarOpen ? 'x' : 'menu', 'w-4 h-4')}
                </button>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-black tracking-tight text-slate-900 uppercase hidden sm:inline">\${t('header.title')}</span>
                  <span class="text-[10px] font-bold text-orange bg-orange-light px-2 py-0.5 rounded-full uppercase">\${t('header.established')}</span>
                </div>
              </div>

              <!-- Header Search Bar -->
              <div class="hidden lg:flex items-center relative max-w-xs w-full mx-4">
                <span class="absolute left-3 text-slate-400">\${icon('search', 'w-4 h-4')}</span>
                <input 
                  type="text" 
                  placeholder="\${t('header.search')}" 
                  class="w-full pl-9 pr-4 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-orange focus:ring-1 focus:ring-orange outline-none"
                  value="\${AppState.searchQuery}"
                  oninput="handleGlobalSearch(this.value)"
                />
              </div>

              <!-- Header Actions: Lang, Notifications, User -->
              <div class="flex items-center gap-2 relative">
                <!-- Lang Toggle -->
                <button 
                  onclick="setLanguage(AppState.language === 'en' ? 'am' : 'en')"
                  class="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs"
                  title="Switch Language"
                >
                  \${icon('globe', 'w-3.5 h-3.5 text-orange')}
                  <span>\${AppState.language === 'en' ? 'አማርኛ' : 'English'}</span>
                </button>

                <!-- Notifications Bell -->
                <button 
                  onclick="AppState.notifDrawerOpen = !AppState.notifDrawerOpen; renderApp();"
                  class="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 relative shadow-xs"
                  title="Notifications"
                >
                  \${icon('bell', 'w-4 h-4')}
                  \${(AppState.db.notifications && AppState.db.notifications.filter(n => !n.isRead).length > 0) ? \`
                    <span class="absolute -top-1 -right-1 w-4 h-4 bg-orange text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
                      \${AppState.db.notifications.filter(n => !n.isRead).length}
                    </span>
                  \` : ''}
                </button>

                <!-- User Profile & Dropdown -->
                <div class="relative">
                  <button 
                    id="user-menu-btn"
                    onclick="AppState.userMenuOpen = !AppState.userMenuOpen; renderApp();"
                    class="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
                  >
                    <img src="\${AppState.currentUser.avatar}" alt="Avatar" class="w-8 h-8 rounded-lg object-cover border border-slate-200"/>
                    <div class="text-left hidden sm:block">
                      <span class="text-xs font-bold text-slate-900 block leading-tight truncate max-w-[110px]">\${AppState.currentUser.name}</span>
                      <span class="text-[10px] font-extrabold text-orange uppercase tracking-wider block">\${AppState.currentUser.role}</span>
                    </div>
                    \${icon('chevron-down', 'w-3 h-3 text-slate-400')}
                  </button>

                  \${AppState.userMenuOpen ? \`
                    <div id="user-menu-dropdown" class="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animation-modalIn">
                      <div class="px-4 py-2 border-b border-slate-100">
                        <span class="text-xs font-bold text-slate-900 block">\${AppState.currentUser.name}</span>
                        <span class="text-[10px] text-slate-500 block truncate">\${AppState.currentUser.email}</span>
                        <span class="inline-block mt-1 text-[9px] font-black px-2 py-0.5 rounded bg-orange-light text-orange">\${AppState.currentUser.role}</span>
                      </div>
                      <div class="p-2 border-b border-slate-100">
                        <span class="text-[10px] font-bold uppercase text-slate-400 px-2 block mb-1">Switch Demo Role</span>
                        <button onclick="switchRole('SUPER_ADMIN')" class="w-full text-left px-2 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-100 flex items-center justify-between">
                          <span>Super Admin</span> \${AppState.currentUser.role === 'SUPER_ADMIN' ? '✓' : ''}
                        </button>
                        <button onclick="switchRole('ADMIN')" class="w-full text-left px-2 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-100 flex items-center justify-between">
                          <span>Admin</span> \${AppState.currentUser.role === 'ADMIN' ? '✓' : ''}
                        </button>
                        <button onclick="switchRole('COACH')" class="w-full text-left px-2 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-100 flex items-center justify-between">
                          <span>Coach</span> \${AppState.currentUser.role === 'COACH' ? '✓' : ''}
                        </button>
                        <button onclick="switchRole('FINANCE_OFFICER')" class="w-full text-left px-2 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-100 flex items-center justify-between">
                          <span>Finance Officer</span> \${AppState.currentUser.role === 'FINANCE_OFFICER' ? '✓' : ''}
                        </button>
                      </div>
                      <div class="p-1">
                        <button onclick="navigate('login')" class="w-full text-left px-3 py-2 text-xs font-bold text-red hover:bg-red-50 rounded-xl flex items-center gap-2">
                          \${icon('logout', 'w-3.5 h-3.5 text-red')} Logout
                        </button>
                      </div>
                    </div>
                  \` : ''}
                </div>
              </div>
            </header>

            <!-- Notifications Drawer -->
            \${AppState.notifDrawerOpen ? renderNotificationDrawer() : ''}

            <!-- Main Route Content Container -->
            <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              \${renderActiveScreen()}
            </main>
          </div>
        </div>
      \`;
    }

    // Role switcher
    function switchRole(role) {
      const roleMap = {
        'SUPER_ADMIN': { id: 'USR-001', name: 'Yonas Alemu', email: 'superadmin@bulbulaamenfc.com', role: 'SUPER_ADMIN', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' },
        'ADMIN': { id: 'USR-002', name: 'Selamawit Tadesse', email: 'admin@bulbulaamenfc.com', role: 'ADMIN', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80' },
        'COACH': { id: 'USR-004', name: 'Coach Ashenafi Bekele', email: 'coach@bulbulaamenfc.com', role: 'COACH', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80' },
        'FINANCE_OFFICER': { id: 'USR-005', name: 'Martha Haile', email: 'finance@bulbulaamenfc.com', role: 'FINANCE_OFFICER', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80' }
      };
      AppState.currentUser = roleMap[role] || roleMap['ADMIN'];
      AppState.userMenuOpen = false;
      renderApp();
      showToast('Switched user role to ' + role);
    }

    // Global Search Action
    function handleGlobalSearch(q) {
      AppState.searchQuery = q;
      if (!q.trim()) return;
      // Auto route to players if searching
      if (AppState.currentRoute !== 'players') {
        AppState.playersFilter.search = q;
        navigate('players');
      } else {
        AppState.playersFilter.search = q;
        renderApp();
      }
    }

    // Sidebar Content Helper
    function renderSidebarContent(isMobile = false) {
      const navLinks = [
        { route: 'dashboard', name: t('nav.dashboard'), iconName: 'dashboard' },
        { route: 'players', name: t('nav.players'), iconName: 'users', count: AppState.db.players?.length },
        { route: 'registrations', name: t('nav.registrations'), iconName: 'clipboard', badge: AppState.db.registrations?.filter(r => r.status === 'PENDING_REVIEW').length },
        { route: 'payments', name: t('nav.payments'), iconName: 'credit-card', badge: AppState.db.payments?.filter(p => p.verificationStatus === 'Under Verification').length },
        { route: 'teams', name: t('nav.teams'), iconName: 'shield', count: AppState.db.teams?.length },
        { route: 'cms', name: t('nav.cms'), iconName: 'globe' },
        { route: 'gallery', name: t('nav.gallery'), iconName: 'image' },
        { route: 'notifications', name: t('nav.notifications'), iconName: 'bell' },
        { route: 'users', name: t('nav.users'), iconName: 'user-cog' },
        { route: 'reports', name: t('nav.reports'), iconName: 'bar-chart' },
        { route: 'audit-logs', name: t('nav.audit'), iconName: 'history' },
        { route: 'settings', name: t('nav.settings'), iconName: 'settings' }
      ];

      return \`
        <div class="h-16 px-4 flex items-center justify-between border-b border-slate-200 bg-white">
          <div class="flex items-center gap-3 overflow-hidden cursor-pointer" onclick="navigate('dashboard')">
            \${getCrestLogoSVG(36)}
            \${(AppState.sidebarOpen || isMobile) ? \`
              <div class="truncate">
                <span class="font-black text-xs tracking-tight text-slate-900 block truncate uppercase">BULBULA AMEN F.C.</span>
                <span class="block text-[10px] font-extrabold text-orange tracking-widest uppercase">EST. 2000 E.C.</span>
              </div>
            \` : ''}
          </div>
          \${isMobile ? \`
            <button onclick="AppState.mobileMenuOpen = false; renderApp();" class="p-2 text-slate-400 hover:text-slate-700">
              \${icon('x', 'w-5 h-5')}
            </button>
          \` : ''}
        </div>

        <div class="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          \${navLinks.map(link => {
            const isActive = AppState.currentRoute === link.route;
            return \`
              <button 
                onclick="navigate('\${link.route}')"
                class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all \${
                  isActive 
                    ? 'bg-orange text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }"
                title="\${link.name}"
              >
                <div class="flex items-center gap-3 truncate">
                  \${icon(link.iconName, 'w-4 h-4 flex-shrink-0')}
                  \${(AppState.sidebarOpen || isMobile) ? \`<span class="truncate">\${link.name}</span>\` : ''}
                </div>
                \${(AppState.sidebarOpen || isMobile) ? \`
                  \${link.badge ? \`<span class="px-2 py-0.5 text-[9px] font-black rounded-full \${isActive ? 'bg-white text-orange' : 'bg-orange text-white'}">\${link.badge}</span>\` : ''}
                  \${(!link.badge && link.count !== undefined) ? \`<span class="text-[10px] text-slate-400 font-semibold">\${link.count}</span>\` : ''}
                \` : ''}
              </button>
            \`;
          }).join('')}

          <!-- Public Portals Quick Jump -->
          \${(AppState.sidebarOpen || isMobile) ? \`
            <div class="pt-4 mt-4 border-t border-slate-100 px-2 space-y-1.5">
              <span class="text-[10px] font-extrabold uppercase text-slate-400 block px-1 tracking-wider">Public Portals</span>
              <button onclick="navigate('parent')" class="w-full text-left px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-orange hover:bg-slate-50 rounded-lg flex items-center gap-2">
                \${icon('users', 'w-3.5 h-3.5 text-slate-400')} \${t('nav.parent_portal')}
              </button>
              <button onclick="navigate('register')" class="w-full text-left px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-orange hover:bg-slate-50 rounded-lg flex items-center gap-2">
                \${icon('plus', 'w-3.5 h-3.5 text-slate-400')} \${t('nav.register')}
              </button>
              <button onclick="navigate('upload-payment')" class="w-full text-left px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-orange hover:bg-slate-50 rounded-lg flex items-center gap-2">
                \${icon('upload', 'w-3.5 h-3.5 text-slate-400')} \${t('nav.upload_payment')}
              </button>
            </div>
          \` : ''}
        </div>

        <div class="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div class="flex items-center gap-2 overflow-hidden">
            <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            \${(AppState.sidebarOpen || isMobile) ? \`
              <span class="text-[10px] font-bold text-slate-500 truncate">System Online (Local DB)</span>
            \` : ''}
          </div>
        </div>
      \`;
    }

    // Notifications Slide Drawer
    function renderNotificationDrawer() {
      const notifs = AppState.db.notifications || [];
      return \`
        <div class="fixed inset-0 bg-slate-900/40 z-50 flex justify-end" onclick="AppState.notifDrawerOpen = false; renderApp();">
          <div class="w-96 bg-white h-full shadow-2xl flex flex-col" onclick="event.stopPropagation();">
            <div class="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div class="flex items-center gap-2">
                \${icon('bell', 'w-4 h-4 text-orange')}
                <h3 class="font-extrabold text-sm text-slate-900">Notifications</h3>
                <span class="px-2 py-0.5 rounded-full bg-orange-light text-orange text-[10px] font-black">\${notifs.length}</span>
              </div>
              <button onclick="markAllNotificationsRead()" class="text-xs font-bold text-orange hover:underline">Mark all read</button>
            </div>
            <div class="flex-1 overflow-y-auto p-3 space-y-2">
              \${notifs.length === 0 ? \`
                <div class="text-center py-12 text-slate-400 text-xs">No notifications yet</div>
              \` : notifs.map(n => \`
                <div class="p-3 rounded-xl border border-slate-100 hover:border-orange hover:bg-slate-50 transition-all cursor-pointer \${!n.isRead ? 'bg-orange-light/30 border-orange/30' : ''}" onclick="handleNotifClick('\${n.id}')">
                  <div class="flex items-start justify-between gap-2 mb-1">
                    <span class="font-bold text-xs text-slate-900">\${n.title}</span>
                    <span class="text-[10px] text-slate-400">\${new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p class="text-xs text-slate-600 line-clamp-2">\${n.message}</p>
                </div>
              \`).join('')}
            </div>
          </div>
        </div>
      \`;
    }

    function markAllNotificationsRead() {
      if (AppState.db.notifications) {
        AppState.db.notifications.forEach(n => n.isRead = true);
        saveDatabase();
        renderApp();
        showToast('All notifications marked as read');
      }
    }

    function handleNotifClick(id) {
      const n = (AppState.db.notifications || []).find(item => item.id === id);
      if (n) {
        n.isRead = true;
        saveDatabase();
        AppState.notifDrawerOpen = false;
        if (n.linkUrl) {
          navigate((n.linkUrl.startsWith('/') ? n.linkUrl.slice(1) : n.linkUrl));
        } else {
          navigate('notifications');
        }
      }
    }

    // ==========================================
    // SCREEN 1: ADMIN DASHBOARD
    // ==========================================
    function renderDashboardScreen() {
      const players = AppState.db.players || [];
      const registrations = AppState.db.registrations || [];
      const payments = AppState.db.payments || [];
      const teams = AppState.db.teams || [];

      const activePlayers = players.filter(p => p.status === 'ACTIVE').length;
      const pendingRegs = registrations.filter(r => r.status === 'PENDING_REVIEW').length;
      const pendingPay = payments.filter(p => p.verificationStatus === 'Under Verification').length;
      const overduePay = players.filter(p => p.feeSchedule && p.feeSchedule.paymentStatus === 'OVERDUE').length;
      const verifiedTotalRevenue = payments
        .filter(p => p.verificationStatus === 'Verified')
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

      return \`
        <div class="space-y-6">
          <!-- Welcome Banner -->
          <div class="card p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="relative z-10">
              <span class="text-xs font-bold text-orange tracking-widest uppercase block mb-1">Bulbula Amen F.C. Academy Operations</span>
              <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight">Welcome, \${AppState.currentUser.name}</h1>
              <p class="text-xs sm:text-sm text-slate-300 max-w-xl mt-1">Real-time statistics across all 9 age groups, player enrollments, and Telebirr/CBE revenue collection.</p>
            </div>
            <div class="flex items-center gap-3 relative z-10">
              <button onclick="navigate('players')" class="btn btn-orange text-xs">
                \${icon('users', 'w-4 h-4')} Manage Players
              </button>
              <button onclick="navigate('registrations')" class="btn btn-white text-xs">
                \${icon('clipboard', 'w-4 h-4 text-orange')} Review Applications (\${pendingRegs})
              </button>
            </div>
          </div>

          <!-- 5 Metric KPI Cards -->
          <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div class="card p-4 card-hover cursor-pointer" onclick="navigate('players')">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-slate-500 uppercase">\${t('dash.total_players')}</span>
                <span class="p-2 rounded-xl bg-orange-light text-orange">\${icon('users', 'w-4 h-4')}</span>
              </div>
              <div class="text-2xl font-black text-slate-900">\${players.length}</div>
              <span class="text-[10px] text-emerald font-bold">✓ \${activePlayers} Active Members</span>
            </div>

            <div class="card p-4 card-hover cursor-pointer" onclick="navigate('registrations')">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-slate-500 uppercase">\${t('dash.pending_regs')}</span>
                <span class="p-2 rounded-xl bg-amber-50 text-amber">\${icon('clipboard', 'w-4 h-4')}</span>
              </div>
              <div class="text-2xl font-black text-slate-900">\${pendingRegs}</div>
              <span class="text-[10px] text-amber font-bold">Awaiting Manager Review</span>
            </div>

            <div class="card p-4 card-hover cursor-pointer" onclick="navigate('payments')">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-slate-500 uppercase">\${t('dash.revenue')}</span>
                <span class="p-2 rounded-xl bg-emerald-50 text-emerald">\${icon('credit-card', 'w-4 h-4')}</span>
              </div>
              <div class="text-2xl font-black text-slate-900">\${verifiedTotalRevenue.toLocaleString()} <span class="text-xs font-bold text-slate-500">ETB</span></div>
              <span class="text-[10px] text-emerald font-bold">Verified Bank & Telebirr</span>
            </div>

            <div class="card p-4 card-hover cursor-pointer" onclick="navigate('payments')">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-slate-500 uppercase">\${t('dash.pending_payments')}</span>
                <span class="p-2 rounded-xl bg-blue-50 text-blue">\${icon('scan', 'w-4 h-4')}</span>
              </div>
              <div class="text-2xl font-black text-slate-900">\${pendingPay}</div>
              <span class="text-[10px] text-blue font-bold">Receipts in OCR Queue</span>
            </div>

            <div class="card p-4 card-hover cursor-pointer col-span-2 lg:col-span-1" onclick="navigate('payments')">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-slate-500 uppercase">\${t('dash.overdue')}</span>
                <span class="p-2 rounded-xl bg-red-50 text-red">\${icon('alert-triangle', 'w-4 h-4')}</span>
              </div>
              <div class="text-2xl font-black text-red">\${overduePay}</div>
              <span class="text-[10px] text-red font-bold">Reminder SMS Active</span>
            </div>
          </div>

          <!-- Charts Row (SVG Native Charts) -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Revenue Trend Area Chart -->
            <div class="card p-5 lg:col-span-2">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="font-extrabold text-slate-900 text-sm">Monthly Collections (ETB)</h3>
                  <p class="text-xs text-slate-500">2026 Academic Season fee collections</p>
                </div>
                <span class="badge badge-verified">LIVE LEDGER</span>
              </div>
              <div class="h-60 w-full flex flex-col justify-end pt-4">
                <svg viewBox="0 0 600 200" class="w-full h-full overflow-visible">
                  <!-- Grid lines -->
                  <line x1="0" y1="40" x2="600" y2="40" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="4"/>
                  <line x1="0" y1="90" x2="600" y2="90" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="4"/>
                  <line x1="0" y1="140" x2="600" y2="140" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="4"/>
                  <!-- Area Gradient Fill -->
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#f96302" stop-opacity="0.3"/>
                      <stop offset="100%" stop-color="#f96302" stop-opacity="0.0"/>
                    </linearGradient>
                  </defs>
                  <polygon points="0,170 100,140 200,110 300,125 400,90 500,60 600,45 600,190 0,190" fill="url(#areaGrad)" />
                  <!-- Polyline Line -->
                  <polyline points="0,170 100,140 200,110 300,125 400,90 500,60 600,45" fill="none" stroke="#f96302" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                  <!-- Data Dots -->
                  <circle cx="100" cy="140" r="4" fill="#ffffff" stroke="#f96302" stroke-width="2"/>
                  <circle cx="200" cy="110" r="4" fill="#ffffff" stroke="#f96302" stroke-width="2"/>
                  <circle cx="300" cy="125" r="4" fill="#ffffff" stroke="#f96302" stroke-width="2"/>
                  <circle cx="400" cy="90" r="4" fill="#ffffff" stroke="#f96302" stroke-width="2"/>
                  <circle cx="500" cy="60" r="4" fill="#ffffff" stroke="#f96302" stroke-width="2"/>
                  <circle cx="600" cy="45" r="5" fill="#f96302"/>
                </svg>
                <div class="flex justify-between text-[11px] font-bold text-slate-400 mt-2 px-1">
                  <span>MAR (3.8k)</span>
                  <span>APR (4.2k)</span>
                  <span>MAY (4.5k)</span>
                  <span>JUN (4.1k)</span>
                  <span>JUL (4.6k)</span>
                  <span class="text-orange font-extrabold">AUG (5.2k ETB)</span>
                </div>
              </div>
            </div>

            <!-- Squad Distribution Bar Chart -->
            <div class="card p-5">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="font-extrabold text-slate-900 text-sm">Squad Distribution</h3>
                  <p class="text-xs text-slate-500">Players per team category</p>
                </div>
                <span class="badge badge-team">9 TEAMS</span>
              </div>
              <div class="space-y-2.5">
                \${teams.map(t => {
                  const count = players.filter(p => p.teamId === t.id).length;
                  const pct = Math.min(100, Math.round((count / 15) * 100));
                  return \`
                    <div>
                      <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>\${t.name}</span>
                        <span class="text-slate-500">\${count} players</span>
                      </div>
                      <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div class="bg-gradient-to-r from-orange to-amber-500 h-full rounded-full" style="width: \${pct}%"></div>
                      </div>
                    </div>
                  \`;
                }).slice(0, 6).join('')}
              </div>
            </div>
          </div>

          <!-- Pending Actions & Recent Transactions -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Pending Registrations Alert -->
            <div class="card p-5">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  \${icon('clipboard', 'w-4 h-4 text-orange')}
                  <h3 class="font-extrabold text-slate-900 text-sm">Recent Registration Applications</h3>
                </div>
                <button onclick="navigate('registrations')" class="text-xs font-bold text-orange hover:underline">View All</button>
              </div>
              <div class="divide-y divide-slate-100">
                \${registrations.slice(0, 4).map(r => \`
                  <div class="py-2.5 flex items-center justify-between">
                    <div>
                      <span class="font-bold text-xs text-slate-900 block">\${r.playerFullName}</span>
                      <span class="text-[11px] text-slate-500">\${r.teamName || 'U13 Premier'} • \${r.phone}</span>
                    </div>
                    <span class="badge \${r.status === 'ACTIVE' ? 'badge-active' : r.status === 'REJECTED' ? 'badge-rejected' : 'badge-pending'}">
                      \${tContent(r.status)}
                    </span>
                  </div>
                \`).join('')}
              </div>
            </div>

            <!-- Recent Verified Payments -->
            <div class="card p-5">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  \${icon('credit-card', 'w-4 h-4 text-emerald')}
                  <h3 class="font-extrabold text-slate-900 text-sm">Recent Financial Transactions</h3>
                </div>
                <button onclick="navigate('payments')" class="text-xs font-bold text-orange hover:underline">View All</button>
              </div>
              <div class="divide-y divide-slate-100">
                \${payments.slice(0, 4).map(p => \`
                  <div class="py-2.5 flex items-center justify-between">
                    <div>
                      <span class="font-bold text-xs text-slate-900 block">\${p.playerName}</span>
                      <span class="text-[11px] text-slate-500 font-mono">\${p.transactionId} • \${p.paymentMethod}</span>
                    </div>
                    <div class="text-right">
                      <span class="font-extrabold text-xs text-slate-900 block">\${p.amount} ETB</span>
                      <span class="text-[10px] font-bold text-emerald">\${p.verificationStatus}</span>
                    </div>
                  </div>
                \`).join('')}
              </div>
            </div>
          </div>
        </div>
      \`;
    }

    // ==========================================
    // SCREEN 2: PLAYERS MANAGEMENT
    // ==========================================
    function renderPlayersScreen() {
      const players = AppState.db.players || [];
      const teams = AppState.db.teams || [];

      // Filter logic
      const filtered = players.filter(p => {
        if (AppState.playersFilter.team !== 'ALL' && p.teamId !== AppState.playersFilter.team) return false;
        if (AppState.playersFilter.status !== 'ALL' && p.status !== AppState.playersFilter.status) return false;
        if (AppState.playersFilter.search) {
          const q = AppState.playersFilter.search.toLowerCase();
          const match = p.fullName.toLowerCase().includes(q) ||
            p.id.toLowerCase().includes(q) ||
            (p.phone && p.phone.includes(q)) ||
            (p.position && p.position.toLowerCase().includes(q));
          if (!match) return false;
        }
        return true;
      });

      return \`
        <div class="space-y-6">
          <!-- Header Bar -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 class="text-2xl font-black text-slate-900">\${t('players.title')}</h1>
              <p class="text-xs text-slate-500">Complete registry of 90+ academy athletes across all competitive age brackets.</p>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="exportPlayersCSV()" class="btn btn-white text-xs">
                \${icon('download', 'w-4 h-4 text-emerald')} \${t('players.export')}
              </button>
              <button onclick="openAddPlayerModal()" class="btn btn-orange text-xs">
                \${icon('plus', 'w-4 h-4')} \${t('players.add')}
              </button>
            </div>
          </div>

          <!-- Team Filter Tabs -->
          <div class="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
            <button 
              onclick="AppState.playersFilter.team = 'ALL'; renderApp();"
              class="px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all \${AppState.playersFilter.team === 'ALL' ? 'bg-orange text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}"
            >
              All Squads (\${players.length})
            </button>
            \${teams.map(t => \`
              <button 
                onclick="AppState.playersFilter.team = '\${t.id}'; renderApp();"
                class="px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all \${AppState.playersFilter.team === t.id ? 'bg-orange text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}"
              >
                \${t.name}
              </button>
            \`).join('')}
          </div>

          <!-- Search & View Mode Switcher -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="relative w-full sm:max-w-xs">
              <span class="absolute left-3 top-2.5 text-slate-400">\${icon('search', 'w-4 h-4')}</span>
              <input 
                type="text" 
                placeholder="Search by name, ID, phone..." 
                value="\${AppState.playersFilter.search}" 
                oninput="AppState.playersFilter.search = this.value; renderApp();"
                class="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-orange"
              />
            </div>
            <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
              <div class="bg-slate-100 p-1 rounded-xl border border-slate-200 flex">
                <button 
                  onclick="AppState.playersFilter.viewMode = 'TABLE'; renderApp();"
                  class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all \${AppState.playersFilter.viewMode === 'TABLE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}"
                >
                  Table
                </button>
                <button 
                  onclick="AppState.playersFilter.viewMode = 'CARDS'; renderApp();"
                  class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all \${AppState.playersFilter.viewMode === 'CARDS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}"
                >
                  FIFA Cards
                </button>
              </div>
            </div>
          </div>

          <!-- Content: Table or Cards -->
          \${AppState.playersFilter.viewMode === 'CARDS' ? \`
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
              \${filtered.map(p => renderFifaCardHTML(p)).join('')}
            </div>
          \` : \`
            <div class="card overflow-x-auto">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>ID</th>
                    <th>Team</th>
                    <th>Position</th>
                    <th>Jersey #</th>
                    <th>OVR</th>
                    <th>Fee Status</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  \${filtered.length === 0 ? \`
                    <tr><td colspan="9" class="text-center py-8 text-slate-400">No players match the selected filters.</td></tr>
                  \` : filtered.map(p => \`
                    <tr>
                      <td>
                        <div class="flex items-center gap-3">
                          <img src="\${p.photoUrl}" alt="\${p.fullName}" class="w-9 h-9 rounded-xl object-cover border border-slate-200"/>
                          <div>
                            <span class="font-extrabold text-xs text-slate-900 block">\${p.fullName}</span>
                            <span class="text-[10px] text-slate-400">\${p.age} yrs • \${p.dateOfBirth}</span>
                          </div>
                        </div>
                      </td>
                      <td class="font-mono text-xs font-bold text-slate-600">\${p.id}</td>
                      <td class="font-bold text-xs text-slate-700">\${tContent(p.teamName)}</td>
                      <td class="text-xs text-slate-600">\${tContent(p.position)}</td>
                      <td class="font-extrabold text-xs text-orange">#\${p.jerseyNumber}</td>
                      <td>
                        <span class="px-2 py-0.5 rounded-md bg-amber-50 text-amber font-black text-xs border border-amber-200">
                          \${p.statistics?.overallRating || 78}
                        </span>
                      </td>
                      <td>
                        <span class="badge \${p.feeSchedule?.paymentStatus === 'PAID' ? 'badge-paid' : 'badge-overdue'}">
                          \${tContent(p.feeSchedule?.paymentStatus || 'PAID')}
                        </span>
                      </td>
                      <td>
                        <span class="badge badge-active">\${tContent(p.status)}</span>
                      </td>
                      <td>
                        <div class="flex items-center gap-1.5">
                          <button onclick="viewPlayerModal('\${p.id}')" class="p-1.5 rounded-lg text-slate-500 hover:text-orange hover:bg-orange-light" title="Inspect Player">
                            \${icon('eye', 'w-4 h-4')}
                          </button>
                          <button onclick="editPlayerModal('\${p.id}')" class="p-1.5 rounded-lg text-slate-500 hover:text-blue hover:bg-blue-50" title="Edit Player">
                            \${icon('edit', 'w-4 h-4')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  \`).join('')}
                </tbody>
              </table>
            </div>
          \`}
        </div>
      \`;
    }

    // FIFA Card HTML Component
    function renderFifaCardHTML(player) {
      const stats = player.statistics || {
        overallRating: 78, pace: 75, shooting: 74, passing: 72, dribbling: 76, defending: 55, physical: 70
      };
      const posShort = player.position ? player.position.split(' ').map(w => w[0]).join('').slice(0, 3) : 'ST';

      return \`
        <div class="fifa-card cursor-pointer" onclick="viewPlayerModal('\${player.id}')">
          <div class="fifa-inner">
            <div class="fifa-gold-pattern"></div>
            <!-- Top Rating & Position & Flag -->
            <div class="flex justify-between items-start z-10">
              <div class="flex flex-col items-center">
                <span class="font-black text-2xl text-slate-900 leading-none">\${stats.overallRating || 78}</span>
                <span class="font-extrabold text-xs text-orange uppercase tracking-wider">\${posShort}</span>
                <!-- Ethiopian Flag -->
                <div class="w-5 h-3 rounded-xs border border-slate-300 mt-1 flex flex-col overflow-hidden">
                  <div class="h-1 bg-emerald-500"></div>
                  <div class="h-1 bg-amber-400"></div>
                  <div class="h-1 bg-red"></div>
                </div>
              </div>
              <div class="w-7 h-7">
                \${getCrestLogoSVG(28)}
              </div>
            </div>

            <!-- Player Avatar -->
            <div class="w-full flex-1 flex items-center justify-center z-10 py-1">
              <img src="\${player.photoUrl}" alt="\${player.fullName}" class="w-28 h-32 rounded-2xl object-cover border-2 border-amber-300 shadow-md"/>
            </div>

            <!-- Player Name & Club Info -->
            <div class="text-center z-10 mt-1">
              <span class="font-black text-sm text-slate-900 uppercase block truncate">\${player.fullName}</span>
              <span class="text-[10px] font-bold text-slate-600 block">\${tContent(player.teamName)} • #\${player.jerseyNumber}</span>
            </div>

            <!-- Attributes 6 Grid -->
            <div class="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] font-extrabold text-slate-800 z-10 mt-2 px-3 pt-2 border-t border-amber-300/60 bg-white/40 rounded-xl">
              <div class="flex justify-between"><span>PAC</span><span class="text-orange">\${stats.pace || 75}</span></div>
              <div class="flex justify-between"><span>DRI</span><span class="text-orange">\${stats.dribbling || 76}</span></div>
              <div class="flex justify-between"><span>SHO</span><span class="text-orange">\${stats.shooting || 74}</span></div>
              <div class="flex justify-between"><span>DEF</span><span class="text-orange">\${stats.defending || 52}</span></div>
              <div class="flex justify-between"><span>PAS</span><span class="text-orange">\${stats.passing || 72}</span></div>
              <div class="flex justify-between"><span>PHY</span><span class="text-orange">\${stats.physical || 70}</span></div>
            </div>
          </div>
        </div>
      \`;
    }

    // Export players CSV
    function exportPlayersCSV() {
      const players = AppState.db.players || [];
      let csv = "Player ID,Full Name,Team,Age,Gender,Jersey Number,Position,OVR,Phone,Parent Name,Parent Phone,Payment Status\\n";
      players.forEach(p => {
        csv += \`"\${p.id}","\${p.fullName}","\${p.teamName}","\${p.age}","\${p.gender}","\${p.jerseyNumber}","\${p.position}","\${p.statistics?.overallRating || 75}","\${p.phone}","\${p.parentInfo?.fullName || ''}","\${p.parentInfo?.phone || ''}","\${p.feeSchedule?.paymentStatus || 'PAID'}"\\n\`;
      });
      downloadFile(csv, 'Bulbula_Amen_FC_Players_Roster.csv', 'text/csv');
      showToast('Players roster exported to CSV successfully');
    }

    function downloadFile(content, fileName, mimeType) {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    // Player Inspect Modal
    function viewPlayerModal(id) {
      const p = (AppState.db.players || []).find(x => x.id === id);
      if (!p) return;

      const modalRoot = document.getElementById('modal-root');
      modalRoot.innerHTML = \`
        <div class="modal-backdrop" onclick="closeModal()">
          <div class="modal-content p-6" onclick="event.stopPropagation()">
            <div class="flex items-center justify-between pb-4 border-b border-slate-200">
              <div class="flex items-center gap-3">
                <img src="\${p.photoUrl}" alt="\${p.fullName}" class="w-12 h-12 rounded-xl object-cover border border-slate-200"/>
                <div>
                  <h3 class="font-black text-lg text-slate-900">\${p.fullName}</h3>
                  <span class="text-xs font-bold text-orange">\${p.id} • \${p.teamName} • Jersey #\${p.jerseyNumber}</span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button onclick="printCardWindow('\${p.id}')" class="btn btn-white text-xs">
                  \${icon('printer', 'w-4 h-4')} Print FIFA Card
                </button>
                <button onclick="closeModal()" class="p-2 text-slate-400 hover:text-slate-700">
                  \${icon('x', 'w-5 h-5')}
                </button>
              </div>
            </div>

            <!-- Modal Content Tabs -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <!-- Left: 3D FIFA Card -->
              <div class="flex flex-col items-center justify-center">
                \${renderFifaCardHTML(p)}
              </div>

              <!-- Right: 2 Column Details -->
              <div class="md:col-span-2 space-y-4">
                <div class="card p-4 bg-slate-50">
                  <h4 class="text-xs font-extrabold text-slate-500 uppercase mb-2">Personal & Contact</h4>
                  <div class="grid grid-cols-2 gap-3 text-xs">
                    <div><span class="text-slate-400 block">DoB:</span><strong class="text-slate-800">\${p.dateOfBirth} (\${p.age} yrs)</strong></div>
                    <div><span class="text-slate-400 block">Gender:</span><strong class="text-slate-800">\${p.gender}</strong></div>
                    <div><span class="text-slate-400 block">Nationality:</span><strong class="text-slate-800">\${p.nationality}</strong></div>
                    <div><span class="text-slate-400 block">Phone:</span><strong class="text-slate-800">\${p.phone}</strong></div>
                    <div class="col-span-2"><span class="text-slate-400 block">Address:</span><strong class="text-slate-800">\${p.address}</strong></div>
                  </div>
                </div>

                <div class="card p-4 bg-slate-50">
                  <h4 class="text-xs font-extrabold text-slate-500 uppercase mb-2">Parent / Guardian Information</h4>
                  <div class="grid grid-cols-2 gap-3 text-xs">
                    <div><span class="text-slate-400 block">Parent Name:</span><strong class="text-slate-800">\${p.parentInfo?.fullName || 'N/A'}</strong></div>
                    <div><span class="text-slate-400 block">Relationship:</span><strong class="text-slate-800">\${p.parentInfo?.relationship || 'Parent'}</strong></div>
                    <div><span class="text-slate-400 block">Parent Phone:</span><strong class="text-slate-800">\${p.parentInfo?.phone || 'N/A'}</strong></div>
                    <div><span class="text-slate-400 block">Parent Email:</span><strong class="text-slate-800">\${p.parentInfo?.email || 'N/A'}</strong></div>
                  </div>
                </div>

                <div class="card p-4 bg-slate-50">
                  <h4 class="text-xs font-extrabold text-slate-500 uppercase mb-2">Financial Status & Fees</h4>
                  <div class="grid grid-cols-3 gap-2 text-xs">
                    <div class="bg-white p-2 rounded-xl border border-slate-200 text-center">
                      <span class="text-slate-400 block text-[10px]">Monthly Fee</span>
                      <strong class="text-slate-900">\${p.feeSchedule?.monthlyFee || 1500} ETB</strong>
                    </div>
                    <div class="bg-white p-2 rounded-xl border border-slate-200 text-center">
                      <span class="text-slate-400 block text-[10px]">Total Paid</span>
                      <strong class="text-emerald">\${p.feeSchedule?.totalPaid || 0} ETB</strong>
                    </div>
                    <div class="bg-white p-2 rounded-xl border border-slate-200 text-center">
                      <span class="text-slate-400 block text-[10px]">Status</span>
                      <span class="badge \${p.feeSchedule?.paymentStatus === 'PAID' ? 'badge-paid' : 'badge-overdue'}">\${p.feeSchedule?.paymentStatus || 'PAID'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      \`;
    }

    function printCardWindow(id) {
      const p = (AppState.db.players || []).find(x => x.id === id);
      if (!p) return;
      const w = window.open('', '_blank');
      w.document.write(\`
        <html>
          <head>
            <title>\${p.fullName} — Bulbula Amen FC Card</title>
            <style>
              body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #fff; margin: 0; }
              .card { width: 320px; padding: 24px; border: 3px solid #f59e0b; border-radius: 24px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
              .photo { width: 140px; height: 160px; object-fit: cover; border-radius: 18px; margin: 10px auto; border: 2px solid #e2e8f0; }
              .ovr { font-size: 40px; font-weight: 900; color: #0f172a; line-height: 1; }
              .name { font-size: 18px; font-weight: 900; color: #f96302; margin-top: 10px; text-transform: uppercase; }
              .team { font-size: 13px; font-weight: 700; color: #64748b; margin-bottom: 12px; }
              .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px; font-weight: 800; border-top: 1px solid #e2e8f0; padding-top: 12px; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="ovr">\${p.statistics?.overallRating || 78} <span style="font-size:16px; color:#f96302;">\${p.position}</span></div>
              <img class="photo" src="\${p.photoUrl}"/>
              <div class="name">\${p.fullName}</div>
              <div class="team">Bulbula Amen F.C. • \${p.teamName} • #\${p.jerseyNumber}</div>
              <div class="stats">
                <div>PAC: \${p.statistics?.pace || 75}</div><div>DRI: \${p.statistics?.dribbling || 76}</div>
                <div>SHO: \${p.statistics?.shooting || 74}</div><div>DEF: \${p.statistics?.defending || 52}</div>
                <div>PAS: \${p.statistics?.passing || 72}</div><div>PHY: \${p.statistics?.physical || 70}</div>
              </div>
            </div>
            <' + 'script>window.print();<' + '/script>
</body>
</html>
`;

// Save to index.html and Bulbula_Amen_FC_System.html
const outPath1 = path.join(__dirname, 'index.html');
const outPath2 = path.join(__dirname, 'Bulbula_Amen_FC_System.html');

fs.writeFileSync(outPath1, htmlContent, 'utf-8');
fs.writeFileSync(outPath2, htmlContent, 'utf-8');

console.log(`Successfully generated standalone single HTML:`);
console.log(`1. ${outPath1} (${Math.round(fs.statSync(outPath1).size / 1024)} KB)`);
console.log(`2. ${outPath2} (${Math.round(fs.statSync(outPath2).size / 1024)} KB)`);

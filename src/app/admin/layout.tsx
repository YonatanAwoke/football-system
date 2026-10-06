"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, ClipboardList, CreditCard, Shield, Image, 
  Bell, Globe, UserCog, Settings, History, Search, Menu, X, LogOut,
  BarChart3, ChevronDown, ChevronRight, UserCheck, ShieldCheck, Key, User as UserIcon, Swords, Trophy
} from 'lucide-react';
import { User, NotificationItem } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminLayout({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const [currentUser, setCurrentUser] = useState<User>({
    id: "USR-001",
    email: "admin@bulbulaamenfc.com",
    phone: "+251911556677",
    name: "Selamawit Tadesse",
    role: "ADMIN",
    active: true,
    createdAt: "2025-01-12T09:30:00Z"
  });

  // Top Nav Profile Dropdown State
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Global Search State
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    players: any[];
    registrations: any[];
    payments: any[];
  }>({ players: [], registrations: [], payments: [] });

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch (e) {}
    }

    fetch('/api/notifications')
      .then(r => r.json())
      .then(res => {
        if (res.success) setNotifications(res.data);
      });

    fetch('/api/teams')
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) setTeams(res.data);
      });

    // Close dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_user');
    router.push('/login');
  };

  const toggleSubmenu = (name: string) => {
    setOpenSubmenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleGlobalSearch = (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults({ players: [], registrations: [], payments: [] });
      return;
    }

    const queryLower = q.toLowerCase();

    Promise.all([
      fetch(`/api/players?search=${encodeURIComponent(q)}`).then(r => r.json()),
      fetch('/api/registrations').then(r => r.json()),
      fetch('/api/payments').then(r => r.json())
    ]).then(([pRes, rRes, payRes]) => {
      const pMatches = pRes.success ? pRes.data : [];
      const rMatches = rRes.success ? rRes.data.filter((reg: any) => 
        reg.playerFullName?.toLowerCase().includes(queryLower) ||
        reg.id?.toLowerCase().includes(queryLower) ||
        reg.parentFullName?.toLowerCase().includes(queryLower) ||
        reg.phone?.includes(q)
      ) : [];
      const payMatches = payRes.success ? payRes.data.filter((pay: any) => 
        pay.transactionId?.toLowerCase().includes(queryLower) ||
        pay.playerFullName?.toLowerCase().includes(queryLower) ||
        pay.id?.toLowerCase().includes(queryLower)
      ) : [];

      setSearchResults({
        players: pMatches.slice(0, 5),
        registrations: rMatches.slice(0, 5),
        payments: payMatches.slice(0, 5)
      });
    });
  };

  const getNotificationTargetUrl = (n: NotificationItem): string => {
    if (n.linkUrl && n.linkUrl.includes('?')) {
      return n.linkUrl;
    }
    
    const text = `${n.title} ${n.message}`;
    
    const txnMatch = text.match(/TXN-[0-9]+|PAY-[0-9]+/i);
    if (txnMatch) {
      return `/admin/payments?view=verification&txn=${txnMatch[0]}`;
    }
    
    const regMatch = text.match(/REG-[0-9]+/i);
    if (regMatch) {
      return `/admin/registrations?regId=${regMatch[0]}`;
    }
    
    const playerMatch = text.match(/BFC-[A-Z0-9]+-[0-9]+/i);
    if (playerMatch) {
      return `/admin/payments?view=dashboard&search=${playerMatch[0]}`;
    }

    if (n.linkUrl) {
      if (n.linkUrl === '/admin/payments' && (n.title.includes('Verification') || n.message.includes('transaction') || n.message.includes('submitted'))) {
        return '/admin/payments?view=verification';
      }
      return n.linkUrl;
    }
    
    const textLower = text.toLowerCase();
    
    if (n.type === 'REGISTRATION_ALERT' || textLower.includes('registration') || textLower.includes('applicant')) {
      return '/admin/registrations';
    }
    if (n.type === 'PAYMENT_REMINDER' || textLower.includes('payment') || textLower.includes('telebirr') || textLower.includes('fee')) {
      if (textLower.includes('verification') || textLower.includes('submitted') || textLower.includes('transaction')) {
        return '/admin/payments?view=verification';
      }
      return '/admin/payments?view=dashboard';
    }
    if (textLower.includes('player') || textLower.includes('roster')) {
      return '/admin/players';
    }
    if (textLower.includes('team') || textLower.includes('schedule')) {
      return '/admin/teams';
    }
    
    return '/admin/notifications';
  };

  const handleNotificationClick = (n: NotificationItem) => {
    const targetUrl = getNotificationTargetUrl(n);
    setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, isRead: true } : item));
    setNotifDrawerOpen(false);
    router.push(targetUrl);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const playerSubItems = [
    { name: "All Players", href: "/admin/players" },
    { name: "U8 Academy", href: "/admin/players?teamId=TEAM-U8" },
    { name: "U10 Juniors", href: "/admin/players?teamId=TEAM-U10" },
    { name: "U12 Development", href: "/admin/players?teamId=TEAM-U12" },
    { name: "U13 Premier", href: "/admin/players?teamId=TEAM-U13" },
    { name: "U15 Cadets", href: "/admin/players?teamId=TEAM-U15" },
    { name: "U17 Under-17 Elite", href: "/admin/players?teamId=TEAM-U17" },
    { name: "U18 Seniors Prep", href: "/admin/players?teamId=TEAM-U18" },
    { name: "Women's Team", href: "/admin/players?teamId=TEAM-WOMEN" },
    { name: "Health & Fitness", href: "/admin/players?teamId=TEAM-HEALTH" },
  ];

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { 
      name: "Players", 
      href: "/admin/players", 
      icon: Users,
      subItems: playerSubItems
    },
    { 
      name: "Registrations", 
      href: "/admin/registrations", 
      icon: ClipboardList,
      subItems: [
        { name: "Pending Registrations", href: "/admin/registrations?status=PENDING_REVIEW" },
        { name: "Approved", href: "/admin/registrations?status=ACTIVE" },
        { name: "Rejected", href: "/admin/registrations?status=REJECTED" },
        { name: "Registration Forms", href: "/admin/registrations?view=forms" },
      ]
    },
    { 
      name: "Payments & Financials", 
      href: "/admin/payments", 
      icon: CreditCard,
      subItems: [
        { name: "Payment Dashboard", href: "/admin/payments?view=dashboard" },
        { name: "Payment Verification", href: "/admin/payments?view=verification" },
        { name: "Payment History", href: "/admin/payments?view=history" },
        { name: "Overdue Payments", href: "/admin/payments?view=dashboard&status=OVERDUE" },
        { name: "Financial Reports", href: "/admin/payments?view=reports" },
      ]
    },
    { 
      name: "Teams & Schedules", 
      href: "/admin/teams", 
      icon: Shield,
      subItems: [
        { name: "Teams", href: "/admin/teams?tab=TEAMS" },
        { name: "Training Schedule", href: "/admin/teams?tab=SCHEDULE" },
        { name: "Attendance", href: "/admin/teams?tab=ATTENDANCE" },
      ]
    },
    { 
      name: "Matches & Tactics", 
      href: "/admin/matches", 
      icon: Swords,
      subItems: [
        { name: "Fixtures & Results", href: "/admin/matches" },
        { name: "Tactical Lineup Board", href: "/admin/matches" },
        { name: "Live Match Tracker", href: "/admin/matches" },
      ]
    },
    { 
      name: "CMS", 
      href: "/admin/cms", 
      icon: Globe,
      subItems: [
        { name: "Website Content", href: "/admin/cms?tab=promos" },
        { name: "Gallery", href: "/admin/cms?tab=gallery" },
        { name: "Announcements", href: "/admin/cms?tab=announcements" },
      ]
    },
    { name: "Notifications", href: "/admin/notifications", icon: Bell },
    { 
      name: "Users & Staff", 
      href: "/admin/users", 
      icon: UserCog,
      subItems: [
        { name: "Staff Directory", href: "/admin/users?tab=USERS" },
        { name: "Role Permissions", href: "/admin/users?tab=PERMISSIONS" },
      ]
    },
    { name: "Reports", href: "/admin/reports", icon: BarChart3 },
    { name: "Audit Logs", href: "/admin/audit-logs", icon: History },
    { name: "Club Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
      {/* LEFT SIDEBAR (Fixed Desktop - Light SaaS Theme) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200 transition-all duration-300 flex flex-col ${
          sidebarOpen ? "w-64" : "w-20"
        } hidden md:flex`}
      >
        {/* Brand Header with Official Crest Logo */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 bg-white">
          <Link href="/admin/dashboard" className="flex items-center gap-3 overflow-hidden">
            <img 
              src="/logo.png" 
              alt="Bulbula Amen F.C." 
              className="w-10 h-10 object-contain drop-shadow-xs flex-shrink-0" 
            />
            {sidebarOpen && (
              <div className="truncate">
                <span className="font-black text-xs tracking-tight text-brand-navy block truncate uppercase">
                  BULBULA AMEN F.C.
                </span>
                <span className="block text-[10px] font-extrabold text-brand-orange tracking-widest uppercase">
                  EST. 2000 E.C.
                </span>
              </div>
            )}
          </Link>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.subItems && item.subItems.some(sub => pathname + (typeof window !== 'undefined' ? window.location.search : '') === sub.href));
            const isSubOpen = openSubmenus[item.name] ?? isActive;
            const Icon = item.icon;

            return (
              <div key={item.name} className="space-y-1 relative group/item">
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    title={!sidebarOpen ? item.name : undefined}
                    className={`flex-1 flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive 
                        ? "bg-brand-orange text-white shadow-xs" 
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {sidebarOpen && <span>{item.name}</span>}
                    </div>
                  </Link>
                  {sidebarOpen && item.subItems && (
                    <button
                      onClick={() => toggleSubmenu(item.name)}
                      className={`p-2 text-slate-400 hover:text-slate-700 rounded-lg transition-colors ${
                        isActive ? "text-white/80 hover:text-white" : ""
                      }`}
                    >
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isSubOpen ? 'transform rotate-180' : ''}`} />
                    </button>
                  )}
                </div>

                {!sidebarOpen && (
                  <div className="absolute left-full top-0 ml-2 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover/item:opacity-100 transition-opacity z-50 whitespace-nowrap">
                    {item.name}
                  </div>
                )}

                {sidebarOpen && item.subItems && isSubOpen && (
                  <div className="pl-9 space-y-1 pt-1 border-l border-slate-200 ml-5">
                    {item.subItems.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className="block px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-brand-orange hover:bg-slate-100 transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* User Footer Card */}
        <div className="p-3 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-brand-orange text-white flex items-center justify-center font-black text-xs flex-shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              {sidebarOpen && (
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
                  <div className="text-[10px] font-extrabold text-brand-orange uppercase">{currentUser.role.replace('_', ' ')}</div>
                </div>
              )}
            </div>
            {sidebarOpen && (
              <button 
                onClick={handleLogout}
                title="Sign Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? "md:pl-64" : "md:pl-20"}`}>
        {/* TOP NAVIGATION BAR */}
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Field */}
            <div 
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-500 text-xs font-semibold cursor-pointer w-64 sm:w-80 transition-all shadow-2xs"
            >
              <Search className="w-4 h-4 text-brand-orange" />
              <span>Search players, IDs, phone numbers...</span>
              <kbd className="hidden sm:inline-block ml-auto px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-400">
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setNotifDrawerOpen(!notifDrawerOpen)}
                className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 relative transition-all"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Drawer Dropdown */}
              {notifDrawerOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Notifications Center</span>
                    <button 
                      onClick={() => setNotifDrawerOpen(false)}
                      className="text-xs text-slate-400 hover:text-slate-700"
                    >
                      Close
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">No recent notifications</p>
                    ) : (
                      notifications.map(n => {
                        const targetUrl = getNotificationTargetUrl(n);
                        return (
                          <div 
                            key={n.id} 
                            onClick={() => handleNotificationClick(n)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                              n.isRead 
                                ? "bg-slate-50 border-slate-200 hover:bg-slate-100" 
                                : "bg-orange-50/60 border-brand-orange/40 hover:bg-brand-orange/10 shadow-xs"
                            }`}
                          >
                            <div className="flex justify-between items-center text-xs font-black text-brand-orange">
                              <span className="flex items-center gap-1 group-hover:underline">
                                {n.title} ↗
                              </span>
                              <span className="text-[10px] text-slate-400 font-normal">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 mt-1 line-clamp-2">{n.message}</p>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Language Selector */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-brand-orange" />
              <span>{t("lang.switch")}</span>
            </button>

            {/* Admin Profile & Role Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-navy text-white flex items-center justify-center font-black text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</div>
                  <div className="text-[10px] font-extrabold text-brand-orange uppercase leading-tight">{currentUser.role.replace('_', ' ')}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 space-y-1 text-xs font-bold text-slate-700">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-slate-900 font-extrabold">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 font-normal">{currentUser.email}</p>
                  </div>

                  <Link 
                    href="/admin/users?tab=USERS"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-brand-orange" /> My Profile
                  </Link>

                  <Link 
                    href="/admin/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-blue-600" /> Account Settings
                  </Link>

                  <Link 
                    href="/admin/users?tab=PERMISSIONS"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  >
                    <Key className="w-4 h-4 text-emerald-600" /> Security & Permissions
                  </Link>

                  <div className="border-t border-slate-100 pt-1">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-left font-bold"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Main Content Container */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children || <Outlet />}
        </main>
      </div>

      {/* Global Search Modal Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                <Search className="w-4 h-4 text-brand-orange" /> Global System Search
              </div>
              <button 
                onClick={() => setSearchOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-700 font-mono"
              >
                ESC
              </button>
            </div>

            <input 
              type="text"
              autoFocus
              value={searchQuery}
              onChange={e => handleGlobalSearch(e.target.value)}
              placeholder="Search player name, ID, parent name, phone, transaction ID..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-semibold focus:border-brand-orange focus:outline-none"
            />

            <div className="max-h-96 overflow-y-auto space-y-4 text-xs">
              {searchResults.players.length === 0 && searchResults.registrations.length === 0 && searchResults.payments.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">Type to search database across players, registrations, and transactions...</p>
              ) : (
                <>
                  {searchResults.players.length > 0 && (
                    <div>
                      <h4 className="font-extrabold text-slate-400 uppercase text-[10px] mb-1.5">Players</h4>
                      <div className="space-y-1.5">
                        {searchResults.players.map(p => (
                          <div 
                            key={p.id}
                            onClick={() => {
                              setSearchOpen(false);
                              router.push(`/admin/players?search=${p.id}`);
                            }}
                            className="p-3 rounded-xl bg-slate-50 hover:bg-orange-50/50 border border-slate-200 hover:border-brand-orange cursor-pointer flex items-center justify-between"
                          >
                            <div>
                              <div className="font-bold text-slate-900">{p.fullName}</div>
                              <div className="text-[11px] text-slate-500">{p.teamName} &bull; ID: {p.id} &bull; Parent: {p.parentInfo?.fullName || 'N/A'}</div>
                            </div>
                            <span className="px-2 py-0.5 bg-brand-orange/10 text-brand-orange font-bold text-[10px] rounded">
                              {p.position}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.registrations.length > 0 && (
                    <div>
                      <h4 className="font-extrabold text-slate-400 uppercase text-[10px] mb-1.5">Registrations</h4>
                      <div className="space-y-1.5">
                        {searchResults.registrations.map(r => (
                          <div 
                            key={r.id}
                            onClick={() => {
                              setSearchOpen(false);
                              router.push(`/admin/registrations?regId=${r.id}`);
                            }}
                            className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-400 cursor-pointer flex items-center justify-between"
                          >
                            <div>
                              <div className="font-bold text-slate-900">{r.playerFullName} (App ID: {r.id})</div>
                              <div className="text-[11px] text-slate-500">Parent: {r.parentFullName} &bull; Phone: {r.phone}</div>
                            </div>
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 font-bold text-[10px] rounded uppercase">
                              {r.status.replace('_', ' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.payments.length > 0 && (
                    <div>
                      <h4 className="font-extrabold text-slate-400 uppercase text-[10px] mb-1.5">Payment Transactions</h4>
                      <div className="space-y-1.5">
                        {searchResults.payments.map(pay => (
                          <div 
                            key={pay.id}
                            onClick={() => {
                              setSearchOpen(false);
                              router.push(`/admin/payments?view=verification&txn=${pay.transactionId}`);
                            }}
                            className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-400 cursor-pointer flex items-center justify-between"
                          >
                            <div>
                              <div className="font-bold text-slate-900">Txn: {pay.transactionId} ({pay.amount} ETB)</div>
                              <div className="text-[11px] text-slate-500">Player: {pay.playerFullName} &bull; {pay.paymentMethod}</div>
                            </div>
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold text-[10px] rounded uppercase">
                              {pay.verificationStatus}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

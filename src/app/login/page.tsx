"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Lock, Mail, Phone, KeyRound, ArrowLeft, Shield, CheckCircle2, UserCheck
} from 'lucide-react';
import { UserRole } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'EMAIL' | 'OTP'>('EMAIL');
  
  // Email fields
  const [email, setEmail] = useState('admin@bulbulaamenfc.com');
  const [password, setPassword] = useState('password123');

  // OTP fields
  const [phone, setPhone] = useState('+251 91 123 4567');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOTP = () => {
    setOtpSent(true);
    setOtpCode('123456'); // Simulated verification OTP
  };

  const handleLogin = async (roleOverride?: UserRole) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: authMode,
          email,
          password,
          phone,
          otp: otpCode,
          role: roleOverride
        })
      }).then(r => r.json());

      if (res.success && res.data) {
        localStorage.setItem('auth_user', JSON.stringify(res.data.user));
        router.push('/admin/dashboard');
      } else {
        setError(res.error || 'Authentication failed');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center items-center gap-3 mb-6 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-orange to-amber-500 p-0.5 shadow-lg shadow-brand-orange/30 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center font-black text-brand-orange text-xl shadow-xs">
              BA
            </div>
          </div>
          <div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900 block">
              BULBULA AMEN FC
            </span>
            <span className="block text-xs font-semibold text-brand-orange tracking-widest uppercase">
              Management Portal
            </span>
          </div>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white border border-slate-200 py-8 px-6 shadow-xl rounded-3xl sm:px-10 space-y-6">
          {/* Auth Mode Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setAuthMode('EMAIL')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'EMAIL' 
                  ? "bg-brand-orange text-white shadow-md" 
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Mail className="w-3.5 h-3.5" /> Email + Password
            </button>
            <button
              onClick={() => setAuthMode('OTP')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'OTP' 
                  ? "bg-brand-orange text-white shadow-md" 
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Phone className="w-3.5 h-3.5" /> Phone + OTP
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
              {error}
            </div>
          )}

          {authMode === 'EMAIL' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => handleLogin()}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-orange to-amber-500 text-white font-extrabold text-sm hover:shadow-xl shadow-brand-orange/30 transition-all mt-2"
              >
                {loading ? "Authenticating..." : "Sign In to Dashboard"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-brand-orange font-bold text-xs rounded-xl whitespace-nowrap"
                  >
                    {otpSent ? "Resend Code" : "Send OTP"}
                  </button>
                </div>
              </div>

              {otpSent && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Enter 6-Digit OTP Code</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input 
                      type="text" 
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange focus:outline-none font-mono tracking-widest text-center"
                    />
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Simulated OTP: 123456 sent to phone.</span>
                </div>
              )}

              <button
                onClick={() => handleLogin()}
                disabled={loading || !otpCode}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-orange to-amber-500 text-white font-extrabold text-sm hover:shadow-xl shadow-brand-orange/30 disabled:opacity-50 transition-all mt-2"
              >
                {loading ? "Verifying OTP..." : "Verify & Log In"}
              </button>
            </div>
          )}

          {/* Quick Role Tester Buttons */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center">
              Quick Role Login (Demo Switcher)
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button 
                onClick={() => handleLogin('SUPER_ADMIN')}
                className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-brand-orange hover:bg-white text-slate-700 text-left font-semibold transition-all shadow-xs"
              >
                👑 Super Admin
              </button>
              <button 
                onClick={() => handleLogin('ADMIN')}
                className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-brand-orange hover:bg-white text-slate-700 text-left font-semibold transition-all shadow-xs"
              >
                ⚡ Admin
              </button>
              <button 
                onClick={() => handleLogin('MANAGER')}
                className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-brand-orange hover:bg-white text-slate-700 text-left font-semibold transition-all shadow-xs"
              >
                📋 Manager
              </button>
              <button 
                onClick={() => handleLogin('COACH')}
                className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-brand-orange hover:bg-white text-slate-700 text-left font-semibold transition-all shadow-xs"
              >
                ⚽ Coach (U13/U15)
              </button>
            </div>
            <button 
              onClick={() => handleLogin('FINANCE_OFFICER')}
              className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-brand-orange hover:bg-white text-slate-700 text-center font-semibold text-xs transition-all shadow-xs"
            >
              💳 Finance Officer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

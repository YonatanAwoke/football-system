"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  ClipboardList, CheckCircle2, XCircle, Clock, Eye, AlertCircle, FileText, Shield, X, User, Phone, MapPin, Calendar, HeartPulse, Send, CreditCard, DollarSign, MessageSquare
} from 'lucide-react';
import { Registration, User as UserType } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';

function RegistrationsContent() {
  const searchParams = useSearchParams();
  const initialStatusFilter = searchParams.get('status') || 'PENDING_REVIEW';
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<string>(initialStatusFilter);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  
  // Interactive Modals
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [reqInfoMessage, setReqInfoMessage] = useState('');
  const [isRequestingInfo, setIsRequestingInfo] = useState(false);
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);

  const currentUser: UserType = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('auth_user') || '{"name":"Manager","role":"MANAGER"}') 
    : { name: 'Manager', role: 'MANAGER' } as UserType;

  const targetRegId = searchParams.get('regId') || searchParams.get('search');

  useEffect(() => {
    fetch('/api/registrations')
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          setRegistrations(res.data);
          if (targetRegId) {
            const matched = res.data.find((r: Registration) => 
              r.id.toLowerCase() === targetRegId.toLowerCase() || 
              r.playerFullName.toLowerCase().includes(targetRegId.toLowerCase())
            );
            if (matched) setSelectedReg(matched);
          }
        }
        setLoading(false);
      });
  }, [targetRegId]);

  const filteredRegs = registrations.filter(r => {
    if (activeTab !== 'ALL' && r.status !== activeTab) return false;
    if (targetRegId) {
      const q = targetRegId.toLowerCase();
      return r.id.toLowerCase() === q || r.playerFullName.toLowerCase().includes(q) || r.phone?.includes(q);
    }
    return true;
  });

  const handleAction = async (action: 'APPROVE' | 'REJECT' | 'VERIFY_PAYMENT' | 'REQUEST_INFO') => {
    if (!selectedReg) return;

    try {
      const res = await fetch('/api/registrations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId: selectedReg.id,
          action,
          notes: action === 'REJECT' ? rejectionNotes : action === 'REQUEST_INFO' ? reqInfoMessage : '',
          user: currentUser
        })
      }).then(r => r.json());

      if (res.success) {
        setRegistrations(registrations.map(r => r.id === selectedReg.id ? res.data : r));
        setSelectedReg(res.data);
        setIsRejecting(false);
        setIsRequestingInfo(false);
        if (action === 'APPROVE') {
          setShowPaymentInstructions(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [configOpen, setConfigOpen] = useState(false);

  return (
    <div className="space-y-6 font-sans">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-black uppercase text-brand-orange tracking-widest block">
            REGISTRATION MANAGEMENT
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Player Applications Queue</h1>
          <p className="text-slate-500 text-xs mt-1">
            Review incoming academy applications, verify documents, and issue approval notices.
          </p>
        </div>

        <button
          onClick={() => setConfigOpen(true)}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5"
        >
          ⚙️ Form Settings
        </button>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-xs font-extrabold">
        {[
          { id: 'PENDING_REVIEW', label: 'Pending' },
          { id: 'AWAITING_PAYMENT', label: 'Awaiting Payment' },
          { id: 'PAYMENT_VERIFICATION', label: 'Payment Submitted' },
          { id: 'ACTIVE', label: 'Approved & Completed' },
          { id: 'REJECTED', label: 'Rejected' },
          { id: 'ALL', label: 'All Applications' }
        ].map(tab => {
          const count = registrations.filter(r => tab.id === 'ALL' || r.status === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === tab.id 
                  ? "bg-brand-orange text-white shadow-xs" 
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === tab.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* APPLICATIONS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase">
              <tr>
                <th className="p-3.5">APP ID</th>
                <th className="p-3.5">APPLICANT / CHILD</th>
                <th className="p-3.5">DESIRED TEAM</th>
                <th className="p-3.5">PARENT / GUARDIAN</th>
                <th className="p-3.5">PHONE</th>
                <th className="p-3.5">SUBMITTED</th>
                <th className="p-3.5">REGISTRATION STATUS</th>
                <th className="p-3.5">PAYMENT STATUS</th>
                <th className="p-3.5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredRegs.map(reg => (
                <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono text-brand-orange font-bold">{reg.id}</td>
                  <td className="p-3.5">
                    <div className="font-extrabold text-slate-900">{reg.playerFullName}</div>
                    <div className="text-[11px] text-slate-500">{reg.gender} &bull; DOB: {reg.playerDateOfBirth || 'N/A'}</div>
                  </td>
                  <td className="p-3.5 font-bold text-slate-800">{reg.teamName}</td>
                  <td className="p-3.5 font-semibold text-slate-700">{reg.parentData?.fullName || reg.applicantName}</td>
                  <td className="p-3.5 text-slate-600 font-semibold">{reg.phone}</td>
                  <td className="p-3.5 text-slate-500">{reg.submittedAt ? new Date(reg.submittedAt).toLocaleDateString() : 'Recent'}</td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] uppercase border ${
                      reg.status === 'PENDING_REVIEW' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                      reg.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                      reg.status === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-blue-50 text-blue-600 border-blue-200'
                    }`}>
                      {reg.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                      reg.paymentStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {reg.paymentStatus || 'PENDING'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setSelectedReg(reg)}
                      className="px-3 py-1 bg-brand-orange text-white font-extrabold text-xs rounded-xl shadow-xs hover:bg-brand-orange-dark"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* REGISTRATION DETAIL INSPECTION MODAL */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-6 my-8">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-black text-brand-orange uppercase tracking-widest block">
                  REGISTRATION INSPECTION
                </span>
                <h3 className="text-xl font-black text-slate-900">Application #{selectedReg.id}</h3>
              </div>
              <button onClick={() => setSelectedReg(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-extrabold text-sm text-slate-900 border-b border-slate-200 pb-1">Player Information</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-semibold text-slate-700">
                  <div><span className="text-slate-400 block">Child Full Name</span><strong className="text-slate-900">{selectedReg.playerFullName}</strong></div>
                  <div><span className="text-slate-400 block">Date of Birth & Age</span><strong className="text-slate-900">{selectedReg.playerDateOfBirth} ({selectedReg.gender})</strong></div>
                  <div><span className="text-slate-400 block">Selected Team</span><strong className="text-brand-orange">{selectedReg.teamName}</strong></div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-extrabold text-sm text-slate-900 border-b border-slate-200 pb-1">Parent / Guardian Information</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-semibold text-slate-700">
                  <div><span className="text-slate-400 block">Parent Name</span><strong className="text-slate-900">{selectedReg.parentData?.fullName || selectedReg.applicantName}</strong></div>
                  <div><span className="text-slate-400 block">Phone Number</span><strong className="text-brand-orange">{selectedReg.phone}</strong></div>
                  <div><span className="text-slate-400 block">Fayda National ID</span><strong className="text-slate-900">{selectedReg.parentData?.nationalIdNumber || 'ETH-ID-XXXX'}</strong></div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-extrabold text-sm text-slate-900 border-b border-slate-200 pb-1">Registration & Fee Details</h4>
                <div className="grid grid-cols-3 gap-3 font-bold text-slate-800">
                  <div><span className="text-slate-400 block">Registration Fee</span><span>3,500 ETB</span></div>
                  <div><span className="text-slate-400 block">Monthly Fee</span><span>1,500 ETB</span></div>
                  <div><span className="text-slate-400 block">Registration Status</span><strong className="text-brand-orange">{selectedReg.status}</strong></div>
                </div>
              </div>

              {showPaymentInstructions && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 space-y-2">
                  <div className="font-extrabold text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Registration Approved! Payment Notice Sent.
                  </div>
                  <p className="text-xs text-emerald-700">
                    Payment instructions have been automatically generated. Parent can now pay via Telebirr (10002938481) or CBE Birr (1000123456789) and upload receipt screenshot in Parent Portal.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAction('APPROVE')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve Registration
                </button>

                <button
                  onClick={() => setIsRejecting(!isRejecting)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>

                <button
                  onClick={() => setIsRequestingInfo(!isRequestingInfo)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-extrabold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4 text-amber-500" /> Request Information
                </button>
              </div>

              <button
                onClick={() => setShowPaymentInstructions(true)}
                className="px-4 py-2 bg-brand-orange text-white font-extrabold text-xs rounded-xl shadow-xs hover:bg-brand-orange-dark flex items-center gap-1.5"
              >
                <CreditCard className="w-4 h-4" /> Send Payment Request
              </button>
            </div>

            {isRejecting && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl space-y-2 text-xs">
                <label className="block font-bold text-red-900">Reason for Rejection</label>
                <textarea
                  value={rejectionNotes}
                  onChange={e => setRejectionNotes(e.target.value)}
                  placeholder="Specify missing document or age disqualification reason..."
                  className="w-full p-2.5 bg-white border border-red-300 rounded-xl text-slate-900 font-semibold"
                />
                <button
                  onClick={() => handleAction('REJECT')}
                  className="px-4 py-1.5 bg-red-600 text-white font-bold rounded-xl"
                >
                  Confirm Rejection
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RegistrationsManagementPage() {
  return (
    <Suspense fallback={<div className="text-center text-slate-400 py-20 font-bold">Loading registrations queue...</div>}>
      <RegistrationsContent />
    </Suspense>
  );
}

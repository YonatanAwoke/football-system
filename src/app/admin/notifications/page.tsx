"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Send, CheckCircle2, ExternalLink, ArrowRight, Settings, FileText, Check, Save } from 'lucide-react';
import { NotificationItem, NotificationTemplate } from '@/lib/types';

export default function NotificationsManagementPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'LOG' | 'TEMPLATES'>('LOG');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    fetch('/api/notifications')
      .then(r => r.json())
      .then(res => {
        if (res.success) setNotifications(res.data);
      });

    fetch('/api/notification-templates')
      .then(r => r.json())
      .then(res => {
        if (res.success) setTemplates(res.data);
      });
  }, []);

  const getNotificationTargetUrl = (n: NotificationItem): string => {
    if (n.linkUrl && n.linkUrl.includes('?')) {
      return n.linkUrl;
    }
    
    const text = `${n.title} ${n.message}`;
    const txnMatch = text.match(/TXN-[0-9]+|PAY-[0-9]+/i);
    if (txnMatch) return `/admin/payments?view=verification&txn=${txnMatch[0]}`;
    
    const regMatch = text.match(/REG-[0-9]+/i);
    if (regMatch) return `/admin/registrations?regId=${regMatch[0]}`;
    
    const playerMatch = text.match(/BFC-[A-Z0-9]+-[0-9]+/i);
    if (playerMatch) return `/admin/payments?view=dashboard&search=${playerMatch[0]}`;

    if (n.linkUrl) return n.linkUrl;
    
    const textLower = text.toLowerCase();
    if (n.type === 'REGISTRATION_ALERT' || textLower.includes('registration')) return '/admin/registrations';
    if (n.type === 'PAYMENT_REMINDER' || textLower.includes('payment')) return '/admin/payments';
    return '/admin/notifications';
  };

  const handleNotificationClick = (n: NotificationItem) => {
    const targetUrl = getNotificationTargetUrl(n);
    router.push(targetUrl);
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;
    try {
      const res = await fetch('/api/notification-templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTemplate)
      }).then(r => r.json());

      if (res.success) {
        setTemplates(templates.map(t => t.id === editingTemplate.id ? res.data : t));
        setEditingTemplate(null);
        setSavedMsg(true);
        setTimeout(() => setSavedMsg(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase text-brand-orange tracking-wider block">Automated Messaging Engine</span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Notifications & Template Manager</h1>
          <p className="text-slate-500 text-xs mt-1">
            Manage real-time notifications, automated reminders, and customizable SMS/Email notification templates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('LOG')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'LOG' ? 'bg-brand-orange text-white shadow-sm' : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            📋 Notifications Log
          </button>
          <button
            onClick={() => setActiveTab('TEMPLATES')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'TEMPLATES' ? 'bg-brand-orange text-white shadow-sm' : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            ⚙️ Notification Templates ({templates.length})
          </button>
        </div>
      </div>

      {savedMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Notification template updated successfully!</span>
        </div>
      )}

      {/* TAB 1: NOTIFICATIONS LOG */}
      {activeTab === 'LOG' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
            <span className="text-xs font-bold uppercase text-brand-orange">Automated Reminders Schedule</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block font-bold">7 Days Before</span>
                <span className="text-emerald-600 font-bold">Active (SMS)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block font-bold">3 Days Before</span>
                <span className="text-emerald-600 font-bold">Active (SMS)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block font-bold">Due Date</span>
                <span className="text-emerald-600 font-bold">Active (SMS + App)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block font-bold">Overdue Follow-up</span>
                <span className="text-red-600 font-bold">Escalated</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                onClick={() => handleNotificationClick(n)}
                className={`p-4 hover:bg-orange-50/50 transition-all cursor-pointer flex items-center justify-between group ${
                  !n.isRead ? 'bg-orange-50/30' : ''
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl border mt-0.5 ${
                    n.type === 'PAYMENT_REMINDER' 
                      ? 'bg-blue-50 text-blue-600 border-blue-200' 
                      : n.type === 'REGISTRATION_ALERT' 
                        ? 'bg-amber-50 text-amber-600 border-amber-200' 
                        : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                  }`}>
                    <Bell className="w-4 h-4" />
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-brand-orange transition-colors">
                        {n.title}
                      </h4>
                      {!n.isRead && (
                        <span className="px-2 py-0.5 bg-brand-orange text-white font-black text-[9px] uppercase rounded-full">New</span>
                      )}
                    </div>
                    <p className="text-slate-600 text-xs">{n.message}</p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold pt-1">
                      <span>Channel: {n.channel}</span>
                      <span>&bull;</span>
                      <span>Recipient: {n.recipientName || n.recipientRole || 'All'}</span>
                      <span>&bull;</span>
                      <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-slate-400 group-hover:text-brand-orange transition-colors">
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: NOTIFICATION TEMPLATES EDITOR */}
      {activeTab === 'TEMPLATES' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-700">
            <span className="font-bold text-slate-900 block mb-1">Supported Template Variables:</span>
            <div className="flex flex-wrap gap-2 font-mono">
              <span className="px-2 py-1 bg-white border border-slate-200 rounded">{`{player_name}`}</span>
              <span className="px-2 py-1 bg-white border border-slate-200 rounded">{`{parent_name}`}</span>
              <span className="px-2 py-1 bg-white border border-slate-200 rounded">{`{team_name}`}</span>
              <span className="px-2 py-1 bg-white border border-slate-200 rounded">{`{amount}`}</span>
              <span className="px-2 py-1 bg-white border border-slate-200 rounded">{`{due_date}`}</span>
              <span className="px-2 py-1 bg-white border border-slate-200 rounded">{`{transaction_id}`}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {templates.map(tpl => (
              <div key={tpl.id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-brand-orange uppercase">{tpl.eventType}</span>
                    <h3 className="font-extrabold text-sm text-slate-900">{tpl.titleTemplate}</h3>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${tpl.enabled ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
                    {tpl.enabled ? 'ENABLED' : 'DISABLED'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono">
                  {tpl.messageTemplate}
                </p>

                <div className="pt-2 flex justify-between items-center text-xs">
                  <span className="text-slate-500 text-[11px]">Recipients: <strong>{tpl.recipients.join(', ')}</strong></span>
                  <button
                    onClick={() => setEditingTemplate(tpl)}
                    className="px-3 py-1.5 bg-brand-orange text-white font-bold rounded-lg text-xs hover:bg-brand-orange-dark shadow-xs"
                  >
                    Edit Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Template Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black text-brand-orange uppercase">Notification Template Editor</span>
                <h3 className="font-extrabold text-base text-slate-900">Edit {editingTemplate.eventType}</h3>
              </div>
              <button onClick={() => setEditingTemplate(null)} className="p-1 text-slate-400 hover:text-slate-900">&times;</button>
            </div>

            <form onSubmit={handleSaveTemplate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Title Template</label>
                <input
                  type="text"
                  required
                  value={editingTemplate.titleTemplate}
                  onChange={e => setEditingTemplate({ ...editingTemplate, titleTemplate: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Message Body Template</label>
                <textarea
                  rows={4}
                  required
                  value={editingTemplate.messageTemplate}
                  onChange={e => setEditingTemplate({ ...editingTemplate, messageTemplate: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="tplEnable"
                  checked={editingTemplate.enabled}
                  onChange={e => setEditingTemplate({ ...editingTemplate, enabled: e.target.checked })}
                  className="w-4 h-4 text-brand-orange rounded"
                />
                <label htmlFor="tplEnable" className="font-bold text-slate-700">Enable this notification trigger</label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingTemplate(null)} className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-brand-orange text-white font-bold rounded-xl hover:bg-brand-orange-dark flex items-center gap-1">
                  <Save className="w-4 h-4" /> Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

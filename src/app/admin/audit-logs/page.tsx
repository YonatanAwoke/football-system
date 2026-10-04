"use client";

import React, { useState, useEffect } from 'react';
import { History, Search, FileSpreadsheet, ShieldAlert, Eye, X, Filter } from 'lucide-react';
import { AuditLog } from '@/lib/types';
import { exportAuditLogsToCSV, downloadCSV } from '@/lib/excel-exporter';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Log detail modal
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  useEffect(() => {
    fetch('/api/audit-logs')
      .then(r => r.json())
      .then(res => {
        if (res.success) setLogs(res.data);
        setLoading(false);
      });
  }, []);

  const filteredLogs = logs.filter(log => {
    if (roleFilter !== 'ALL' && log.userRole !== roleFilter) return false;
    if (typeFilter !== 'ALL' && log.affectedRecordType !== typeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchAction = log.action.toLowerCase().includes(q);
      const matchUser = log.userName.toLowerCase().includes(q);
      const matchRecord = log.affectedRecordId.toLowerCase().includes(q);
      if (!matchAction && !matchUser && !matchRecord) return false;
    }
    return true;
  });

  const handleExportCSV = () => {
    const csvData = exportAuditLogsToCSV(filteredLogs);
    downloadCSV(csvData, 'Bulbula_Amen_FC_Security_Audit_Logs.csv');
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase text-brand-orange tracking-wider block">Security & Compliance Audit</span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">System Audit Logs & Security History</h1>
          <p className="text-slate-500 text-xs mt-1">Immutable security ledger capturing all administrative changes, payment approvals, and roster updates.</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export Audit Trail
        </button>
      </div>

      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs font-extrabold flex items-center gap-2 shadow-sm">
        <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span>Security Protection: Audit logs are read-only and immutable. System records cannot be altered or erased by standard administrators.</span>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm text-xs">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search action, user, or record ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-brand-orange"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-brand-orange"
          >
            <option value="ALL">All System Roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Manager</option>
            <option value="FINANCE_OFFICER">Finance Officer</option>
            <option value="COACH">Coach</option>
          </select>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-brand-orange"
          >
            <option value="ALL">All Record Types</option>
            <option value="Player">Player</option>
            <option value="Team">Team</option>
            <option value="Registration">Registration</option>
            <option value="PaymentTransaction">Payment</option>
            <option value="User">User / Staff</option>
            <option value="ClubSettings">Club Settings</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
              <tr>
                <th className="p-3.5">Log ID</th>
                <th className="p-3.5">User & Role</th>
                <th className="p-3.5">Action Executed</th>
                <th className="p-3.5">Affected Record</th>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">IP Address</th>
                <th className="p-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80">
                  <td className="p-3.5 font-mono text-brand-orange font-bold">{log.id}</td>
                  <td className="p-3.5 font-bold text-slate-900">
                    <div>{log.userName}</div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{log.userRole}</span>
                  </td>
                  <td className="p-3.5 font-bold text-slate-800">{log.action}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono font-bold rounded border border-slate-200">
                      {log.affectedRecordType} &bull; {log.affectedRecordId}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-500 font-medium">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-3.5 font-mono text-slate-400">{log.ipAddress}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold text-[11px] flex items-center gap-1 ml-auto"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Diff
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Diff Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-brand-orange uppercase">Audit Entry: {selectedLog.id}</span>
                <h3 className="font-extrabold text-base text-slate-900">{selectedLog.action}</h3>
              </div>
              <button onClick={() => setSelectedLog(null)} className="p-1 text-slate-400 hover:text-slate-900"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div><span className="text-slate-400 block">Executed By</span><strong className="text-slate-900">{selectedLog.userName} ({selectedLog.userRole})</strong></div>
                <div><span className="text-slate-400 block">Target Record</span><strong className="text-slate-900">{selectedLog.affectedRecordType} ({selectedLog.affectedRecordId})</strong></div>
                <div><span className="text-slate-400 block">Timestamp</span><strong className="text-slate-900">{new Date(selectedLog.timestamp).toLocaleString()}</strong></div>
                <div><span className="text-slate-400 block">Origin IP</span><strong className="font-mono text-slate-900">{selectedLog.ipAddress}</strong></div>
              </div>

              {selectedLog.previousValue && (
                <div>
                  <span className="font-bold text-slate-700 block mb-1">Previous Value:</span>
                  <pre className="p-3 bg-red-50 text-red-900 rounded-xl border border-red-200 text-[11px] font-mono whitespace-pre-wrap overflow-x-auto">
                    {selectedLog.previousValue}
                  </pre>
                </div>
              )}

              {selectedLog.newValue && (
                <div>
                  <span className="font-bold text-slate-700 block mb-1">New Value:</span>
                  <pre className="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 text-[11px] font-mono whitespace-pre-wrap overflow-x-auto">
                    {selectedLog.newValue}
                  </pre>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button onClick={() => setSelectedLog(null)} className="px-5 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl">Close Log Details</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import { 
  UserCog, Lock, Unlock, Plus, Edit2, Trash2, Shield, CheckCircle2, X, Download, FileSpreadsheet 
} from 'lucide-react';
import { User, UserRole, Team } from '@/lib/types';
import { exportUsersToCSV, downloadCSV } from '@/lib/excel-exporter';
import { getDefaultRolePermissions } from '@/lib/permissions';

export default function UsersManagementPage() {
  const [activeTab, setActiveTab] = useState<'USERS' | 'PERMISSIONS'>('USERS');
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add / Edit Modal
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'COACH' as UserRole,
    assignedTeamId: '',
    active: true
  });

  const rolesList: UserRole[] = [
    'SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COACH', 
    'ASSISTANT_COACH', 'FINANCE_OFFICER', 'REGISTRATION_OFFICER', 'CONTENT_MANAGER', 'VIEWER'
  ];

  const rolePermissionsMatrix = getDefaultRolePermissions();

  const loadData = async () => {
    try {
      const [uRes, tRes] = await Promise.all([
        fetch('/api/users').then(r => r.json()),
        fetch('/api/teams').then(r => r.json())
      ]);
      if (uRes.success) setUsers(uRes.data);
      if (tRes.success) setTeams(tRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'COACH',
      assignedTeamId: '',
      active: true
    });
    setUserModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      assignedTeamId: user.assignedTeamId || '',
      active: user.active
    });
    setUserModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingUser ? 'PUT' : 'POST';
      const bodyPayload = editingUser ? { ...editingUser, ...formData } : formData;

      const res = await fetch('/api/users', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      }).then(r => r.json());

      if (res.success) {
        showToast(editingUser ? 'Staff profile updated!' : 'New staff member added!');
        setUserModalOpen(false);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to remove staff member ${userName}?`)) return;
    try {
      const res = await fetch(`/api/users?id=${userId}`, { method: 'DELETE' }).then(r => r.json());
      if (res.success) {
        showToast('Staff member removed.');
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    const csvContent = exportUsersToCSV(users);
    downloadCSV(csvContent, 'Bulbula_Amen_FC_Staff_Roster.csv');
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase text-brand-orange tracking-wider block">Access Control & Staff Directory</span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Staff Management & Role-Based Permissions (RBAC)</h1>
          <p className="text-slate-500 text-xs mt-1">Manage staff accounts, assign team roles, and review granular system permissions.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export Staff List
          </button>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Staff Member
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('USERS')}
          className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 ${
            activeTab === 'USERS' ? 'bg-brand-orange text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <UserCog className="w-4 h-4" /> Staff Roster ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('PERMISSIONS')}
          className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 ${
            activeTab === 'PERMISSIONS' ? 'bg-brand-orange text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <Shield className="w-4 h-4" /> Granular Permissions Matrix
        </button>
      </div>

      {/* TAB 1: STAFF ROSTER TABLE */}
      {activeTab === 'USERS' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-3.5">Staff Member</th>
                  <th className="p-3.5">System Role</th>
                  <th className="p-3.5">Contact Details</th>
                  <th className="p-3.5">Assigned Squad</th>
                  <th className="p-3.5">Document Clearance</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {users.map(u => {
                  const assignedTeam = teams.find(t => t.id === u.assignedTeamId);
                  const isCoachRole = u.role === 'COACH' || u.role === 'ASSISTANT_COACH';

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80">
                      <td className="p-3.5 font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          <img src={u.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"} className="w-9 h-9 rounded-xl object-cover border border-slate-200" />
                          <div>
                            <span className="block text-sm">{u.name}</span>
                            <span className="text-[10px] font-mono text-slate-400">ID: {u.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 bg-brand-orange/10 text-brand-orange font-extrabold rounded-lg uppercase text-[10px]">
                          {u.role.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3.5 space-y-0.5">
                        <div className="font-bold text-slate-900">{u.email}</div>
                        <div className="text-slate-400 font-mono text-[11px]">{u.phone}</div>
                      </td>
                      <td className="p-3.5 font-bold text-slate-700">
                        {assignedTeam ? `${assignedTeam.name} (${assignedTeam.shortName})` : 'All Squads'}
                      </td>
                      <td className="p-3.5">
                        {isCoachRole ? (
                          <span className="text-amber-600 font-bold flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" /> Restricted Clearance
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <Unlock className="w-3.5 h-3.5" /> Full Staff Clearance
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`px-2.5 py-0.5 font-extrabold text-[10px] rounded-full ${
                          u.active ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {u.active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(u)}
                            className="p-1.5 text-slate-500 hover:text-brand-orange hover:bg-slate-100 rounded-lg transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: RBAC PERMISSIONS MATRIX */}
      {activeTab === 'PERMISSIONS' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase text-brand-orange tracking-wider block">Role Access Controls</span>
            <h3 className="text-lg font-black text-slate-900">System Role Permission Matrix</h3>
            <p className="text-xs text-slate-500">Overview of operational permissions assigned to each system role.</p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-3.5">Role Name</th>
                  <th className="p-3.5">Granted Permissions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {rolesList.map(role => {
                  const perms = rolePermissionsMatrix[role] || [];
                  return (
                    <tr key={role} className="hover:bg-slate-50/80">
                      <td className="p-3.5 font-black text-slate-900 uppercase">
                        <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg">
                          {role.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex flex-wrap gap-1.5">
                          {perms.map(p => (
                            <span key={p} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded">
                              ✓ {p}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Staff Modal */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black text-brand-orange uppercase">Staff Directory Form</span>
                <h3 className="font-extrabold text-base text-slate-900">{editingUser ? 'Edit Staff Profile' : 'Add New Staff Member'}</h3>
              </div>
              <button onClick={() => setUserModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-900"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:border-brand-orange focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:border-brand-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:border-brand-orange focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assign System Role</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:border-brand-orange focus:outline-none"
                  >
                    {rolesList.map(r => (
                      <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assign Squad Roster</label>
                  <select
                    value={formData.assignedTeamId}
                    onChange={e => setFormData({ ...formData, assignedTeamId: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:border-brand-orange focus:outline-none"
                  >
                    <option value="">All Squads (Unrestricted)</option>
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.shortName})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="userActive"
                  checked={formData.active}
                  onChange={e => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-brand-orange rounded"
                />
                <label htmlFor="userActive" className="font-bold text-slate-700">Account Active & Enabled</label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setUserModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-brand-orange text-white font-bold rounded-xl hover:bg-brand-orange-dark">
                  {editingUser ? 'Save Changes' : 'Create Staff User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

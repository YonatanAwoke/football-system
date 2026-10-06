import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Root & Public Pages
import LoginPage from './app/login/page';
import PublicRegistrationPage from './app/register/page';
import UploadPaymentPage from './app/upload-payment/page';
import ParentPortalPage from './app/parent/page';

// Admin Layout and Modules
import AdminLayout from './app/admin/layout';
import AdminDashboardPage from './app/admin/dashboard/page';
import AdminPlayersPage from './app/admin/players/page';
import AdminTeamsPage from './app/admin/teams/page';
import AdminRegistrationsPage from './app/admin/registrations/page';
import AdminPaymentsPage from './app/admin/payments/page';
import AdminCMSPage from './app/admin/cms/page';
import AdminNotificationsPage from './app/admin/notifications/page';
import AdminReportsPage from './app/admin/reports/page';
import AdminSettingsPage from './app/admin/settings/page';
import AdminUsersPage from './app/admin/users/page';
import AdminAuditLogsPage from './app/admin/audit-logs/page';

import AdminMatchesPage from './app/admin/matches/page';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<PublicRegistrationPage />} />
      <Route path="/upload-payment" element={<UploadPaymentPage />} />
      <Route path="/parent" element={<ParentPortalPage />} />

      {/* Admin nested routes protected by auth & RBAC */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="players" element={<AdminPlayersPage />} />
        <Route path="teams" element={<AdminTeamsPage />} />
        <Route path="matches" element={<AdminMatchesPage />} />
        <Route path="registrations" element={<AdminRegistrationsPage />} />
        <Route path="payments" element={<AdminPaymentsPage />} />
        <Route path="gallery" element={<Navigate to="/admin/cms?tab=gallery" replace />} />
        <Route path="cms" element={<AdminCMSPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route 
          path="settings" 
          element={
            <ProtectedRoute requiredPermission="MANAGE_SETTINGS">
              <AdminSettingsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="users" 
          element={
            <ProtectedRoute requiredPermission="MANAGE_STAFF">
              <AdminUsersPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="audit-logs" 
          element={
            <ProtectedRoute requiredPermission="VIEW_AUDIT_LOGS">
              <AdminAuditLogsPage />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}

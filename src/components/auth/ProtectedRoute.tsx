import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { User, UserRole } from '@/lib/types';
import { PermissionAction, hasPermission } from '@/lib/permissions';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: PermissionAction;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requiredPermission,
}) => {
  const location = useLocation();
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('auth_user') : null;
  
  if (!storedUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  let currentUser: User;
  try {
    currentUser = JSON.parse(storedUser);
  } catch (e) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role restriction if provided
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
        <p className="text-sm text-slate-400 max-w-md mb-6">
          Your account role (<span className="text-amber-400 font-semibold">{currentUser.role}</span>) does not have sufficient administrative privileges to access this module.
        </p>
        <Button 
          variant="secondary"
          onClick={() => window.history.back()}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Go Back
        </Button>
      </div>
    );
  }

  // Check action permission if provided
  if (requiredPermission && !hasPermission(currentUser.role, requiredPermission)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Permission Required</h2>
        <p className="text-sm text-slate-400 max-w-md mb-6">
          You need <code className="px-2 py-1 bg-slate-800 rounded text-xs text-amber-300">{requiredPermission}</code> permission to perform this operation.
        </p>
        <Button 
          variant="secondary"
          onClick={() => window.history.back()}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Go Back
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};

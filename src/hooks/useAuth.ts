'use client';
// Single place that reads/writes auth session from localStorage.
// All components use this instead of raw localStorage calls.

import { useState, useEffect } from 'react';

export interface AuthSession {
  empId: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
}

export function useAuth(): AuthSession {
  const [empId, setEmpId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    // Only runs on client — safe from SSR issues
    const stored = localStorage.getItem('currentUserEmpId');
    const storedRole = localStorage.getItem('currentUserRole');
    setEmpId(stored);
    setRole(storedRole);
    setIsAuthReady(true);
  }, []);

  return {
    empId,
    role,
    isAuthenticated: !!empId,
    isAuthReady,
  };
}

// Utility to set auth session (used after login/signup)
export function setAuthSession(empId: string, role?: string) {
  localStorage.setItem('currentUserEmpId', empId);
  if (role) {
    localStorage.setItem('currentUserRole', role);
  }
}

// Utility to clear auth session (used on logout)
export function clearAuthSession() {
  localStorage.removeItem('currentUserEmpId');
  localStorage.removeItem('currentUserRole');
}

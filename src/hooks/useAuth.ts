'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

export interface AuthSession {
  empId: string | null;
  role: string | null;
  username: string | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
}

export function useAuth(): AuthSession {
  const { data: session, status } = useSession();
  const [fallbackEmpId, setFallbackEmpId] = useState<string | null>(null);
  const [fallbackRole, setFallbackRole] = useState<string | null>(null);
  const [fallbackUsername, setFallbackUsername] = useState<string | null>(null);

  useEffect(() => {
    // Legacy credential-login fallback kept for non-NextAuth paths.
    const storedEmpId = localStorage.getItem('currentUserEmpId');
    const storedRole = localStorage.getItem('currentUserRole');
    const storedUsername = localStorage.getItem('currentUsername');
    setFallbackEmpId(storedEmpId);
    setFallbackRole(storedRole);
    setFallbackUsername(storedUsername);
  }, []);

  const sessionUser = (session?.user as any) || null;
  const empId = sessionUser?.empId || fallbackEmpId;
  const role = sessionUser?.role || fallbackRole;
  const username = sessionUser?.username || fallbackUsername;

  return {
    empId,
    role,
    username,
    isAuthenticated: status === 'authenticated' || !!empId,
    isAuthReady: status !== 'loading',
  };
}

export function setAuthSession(empId: string, role?: string, username?: string) {
  localStorage.setItem('currentUserEmpId', empId);
  if (role) {
    localStorage.setItem('currentUserRole', role);
  }
  if (username) {
    localStorage.setItem('currentUsername', username);
  }
}

export function clearAuthSession() {
  localStorage.removeItem('currentUserEmpId');
  localStorage.removeItem('currentUserRole');
  localStorage.removeItem('currentUsername');
  signOut({ callbackUrl: '/login' });
}

'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

export interface AuthSession {
  empId: string | null;
  role: string | null;
  username: string | null;
  email: string | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  forceUsernameChange?: boolean;
  updateSession: (data?: any) => Promise<any>;
}

export function useAuth(): AuthSession {
  const { data: session, status, update } = useSession();
  
  return {
    empId: (session?.user as any)?.empId || null,
    role: (session?.user as any)?.role || null,
    username: (session?.user as any)?.username || null,
    email: (session?.user as any)?.email || null,
    isAuthenticated: status === 'authenticated',
    isAuthReady: status !== 'loading',
    forceUsernameChange: (session?.user as any)?.forceUsernameChange || false,
    updateSession: update,
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

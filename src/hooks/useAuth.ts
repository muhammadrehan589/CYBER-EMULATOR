'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

export interface AuthSession {
  empId: string | null;
  username: string | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  forceUsernameChange?: boolean;
  updateSession: (data?: any) => Promise<any>;
}

export function useAuth(): AuthSession {
  const { data: session, status, update } = useSession();
  
  return {
    empId: (session?.user as any)?.empId || null,
    username: (session?.user as any)?.username || null,
    isAuthenticated: status === 'authenticated',
    isAuthReady: status !== 'loading',
    forceUsernameChange: (session?.user as any)?.forceUsernameChange || false,
    updateSession: update,
  };
}

export function setAuthSession(empId: string) {
  // Deprecated in favor of NextAuth
}

export function clearAuthSession() {
  signOut({ callbackUrl: '/login' });
}

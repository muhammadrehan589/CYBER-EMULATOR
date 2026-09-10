'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

export interface AuthSession {
  empId: string | null;
  username: string | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
}

export function useAuth(): AuthSession {
  const { data: session, status } = useSession();
  
  return {
    empId: (session?.user as any)?.empId || null,
    username: (session?.user as any)?.username || null,
    isAuthenticated: status === 'authenticated',
    isAuthReady: status !== 'loading',
  };
}

export function setAuthSession(empId: string) {
  // Deprecated in favor of NextAuth
}

export function clearAuthSession() {
  signOut({ callbackUrl: '/login' });
}

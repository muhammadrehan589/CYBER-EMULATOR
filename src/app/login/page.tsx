'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AuthForm } from '@/components/auth/AuthForm';
import { OcularScanner } from '@/components/auth/OcularScanner';

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'authenticated') {
    return <div className="h-screen flex items-center justify-center bg-[#030005] text-[#ff0055] font-mono">LOADING...</div>;
  }

  return (
    <div className="flex h-screen w-full flex-col lg:flex-row bg-[#030005]">
      {/* Left side: Ocular Scanner (Hidden on small screens) */}
      <div className="hidden lg:flex w-1/2 border-r border-[#ff0055]/20 bg-black relative">
        <OcularScanner 
          isTyping={isInputFocused} 
        />
      </div>
      
      {/* Right side: Auth Form */}
      <div className="flex-1 w-full lg:w-1/2 flex flex-col h-full bg-[#030005]">
        <AuthForm 
          setIsInputFocused={setIsInputFocused}
        />
      </div>
    </div>
  );
}

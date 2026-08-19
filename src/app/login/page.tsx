'use client';

import React, { useState } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';
import { OcularScanner } from '@/components/auth/OcularScanner';

export default function LoginPage() {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isAdminTrapdoor, setIsAdminTrapdoor] = useState(false);

  return (
    <div className="flex h-screen w-full flex-col lg:flex-row bg-[#030005]">
      {/* Left side: Ocular Scanner (Hidden on small screens) */}
      <div className="hidden lg:flex w-1/2 border-r border-[#ff0055]/20 bg-black relative">
        <OcularScanner 
          isTyping={isInputFocused} 
          isAdminTrapdoor={isAdminTrapdoor} 
        />
      </div>
      
      {/* Right side: Auth Form */}
      <div className="flex-1 w-full lg:w-1/2 flex flex-col h-full bg-[#030005]">
        <AuthForm 
          setIsInputFocused={setIsInputFocused}
          isAdminTrapdoor={isAdminTrapdoor}
          setIsAdminTrapdoor={setIsAdminTrapdoor}
        />
      </div>
    </div>
  );
}

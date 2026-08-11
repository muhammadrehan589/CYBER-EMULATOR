'use client';

import React, { useState } from 'react';
import { OcularScanner } from '@/components/auth/OcularScanner';
import { AuthForm } from '@/components/auth/AuthForm';

export default function CyberSimulatorAuthPage() {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isAdminTrapdoor, setIsAdminTrapdoor] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row overflow-hidden font-sans select-none bg-black text-white">
      {/* LEFT PANEL: Gameboy Console with Ocular Scanner & Pupil Physics */}
      <div className="lg:w-1/2 h-full">
        <OcularScanner 
          isInputFocused={isInputFocused} 
          isAdminTrapdoor={isAdminTrapdoor} 
        />
      </div>

      {/* RIGHT PANEL: Dark Glassmorphism Authentication Form & Admin Trapdoor */}
      <div className="lg:w-1/2 h-full">
        <AuthForm 
          setIsInputFocused={setIsInputFocused}
          isAdminTrapdoor={isAdminTrapdoor}
          setIsAdminTrapdoor={setIsAdminTrapdoor}
        />
      </div>
    </div>
  );
}

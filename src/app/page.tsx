'use client';

import React, { useState } from 'react';
import { OcularScanner } from '@/components/auth/OcularScanner';
import { AuthForm } from '@/components/auth/AuthForm';

export default function CyberSimulatorAuthPage() {
  // Hoisted shared state — bridges OcularScanner eye reaction to AuthForm input focus
  const [isTyping, setIsTyping] = useState(false);
  const [isAdminTrapdoor, setIsAdminTrapdoor] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row overflow-hidden font-sans select-none bg-black text-white">
      {/* LEFT PANEL: Large mechanical eyeball with proximity glow & biometric scan */}
      <div className="lg:w-1/2 h-full">
        <OcularScanner
          isTyping={isTyping}
          isAdminTrapdoor={isAdminTrapdoor}
        />
      </div>

      {/* RIGHT PANEL: Dark glassmorphism auth form & admin trapdoor */}
      <div className="lg:w-1/2 h-full">
        <AuthForm
          setIsInputFocused={setIsTyping}
          isAdminTrapdoor={isAdminTrapdoor}
          setIsAdminTrapdoor={setIsAdminTrapdoor}
        />
      </div>
    </div>
  );
}

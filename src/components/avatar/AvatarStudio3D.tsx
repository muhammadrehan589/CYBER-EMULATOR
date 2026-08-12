'use client';

import React, { useState, Suspense, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import dynamic from 'next/dynamic';

const AvatarCreator = dynamic(() => import('@readyplayerme/react-avatar-creator').then((mod) => mod.AvatarCreator), { ssr: false });
import { ArrowLeft, ShieldCheck, RefreshCw, Zap } from 'lucide-react';

function RPMModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  // RPM models often render exactly at 0,0,0 at the feet.
  return <primitive object={scene} position={[0, -1, 0]} />;
}

// CameraControls to lock target
function CameraControls() {
  const controlsRef = useRef<any>(null);
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0.5, 0); // Focus around mid-body
      controlsRef.current.update();
    }
  }, []);
  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      minDistance={1.5}
      maxDistance={5}
      maxPolarAngle={Math.PI * 0.85}
      minPolarAngle={Math.PI * 0.1}
      makeDefault
    />
  );
}

export default function AvatarStudio3D() {
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleAvatarExported = (event: any) => {
    setAvatarUrl(event.data.url);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => router.push('/dashboard'), 1400);
  };

  return (
    <div className="h-screen w-screen bg-black text-white font-sans overflow-hidden flex flex-col select-none"
      style={{ fontFamily: "'Inter','Outfit',sans-serif" }}>
      
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#ff0055]/7 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#e60039]/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* ── HEADER ── */}
      <header className="relative z-10 flex items-center justify-between px-6 py-3.5 border-b border-[#ff0055]/20 flex-shrink-0 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link href="/dashboard"
            className="p-2 rounded-xl bg-[#0e0414] border border-[#ff0055]/30 text-[#ff0055] hover:bg-[#ff0055] hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <p className="text-[10px] font-mono font-bold text-[#ff0055] tracking-widest uppercase leading-none">CHARACTER STUDIO 3D</p>
            <h1 className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-200 to-[#ff0055] leading-tight">
              Ready Player Me
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ff0055] animate-pulse" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Neural Link Active</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#120315] border border-[#ff0055]/40 font-mono text-xs text-[#ff0055]">
            <Zap className="w-3.5 h-3.5" /><span>SYSTEM READY</span>
          </div>
        </div>
      </header>

      {/* ── MAIN BODY ── */}
      <div className="relative z-10 flex flex-1 overflow-hidden">
        
        {!avatarUrl ? (
          // RPM Avatar Creator View
          <div className="flex-1 w-full h-full relative">
            <AvatarCreator 
              subdomain="guest" 
              config={{ clearCache: true, bodyType: 'fullbody' }} 
              style={{ width: '100%', height: '100%', border: 'none' }} 
              onAvatarExported={handleAvatarExported} 
            />
          </div>
        ) : (
          // Final 3D Render View
          <div className="flex-1 relative flex flex-col items-center">
            
            {/* Badge */}
            <div className="absolute top-6 left-6 z-10 px-4 py-2 rounded-xl bg-black/80 border border-[#ff0055]/30 backdrop-blur-sm flex items-center gap-3 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-[#ff0055] animate-pulse" />
              <span className="text-xs font-mono font-bold text-[#ff0055]/90 tracking-widest uppercase">Live 3D Render</span>
            </div>

            {/* Scanlines */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(255,0,85,0.01)_3px,rgba(255,0,85,0.01)_4px)] pointer-events-none z-10" />

            {/* R3F Canvas */}
            <div className="w-full flex-1">
              <Canvas
                camera={{ position: [0, 1.5, 3.5], fov: 45 }}
                shadows
                style={{ background: 'transparent', width: '100%', height: '100%' }}
                gl={{ antialias: true, alpha: true }}
              >
                <ambientLight intensity={0.5} />
                <directionalLight position={[3, 8, 4]} intensity={1.8} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0001} />
                <directionalLight position={[-3, 4, -2]} intensity={0.6} color="#ffbbcc" />
                <pointLight position={[-2, 3, -1]} intensity={0.8} color="#ff0055" />
                <pointLight position={[ 2, 2,  2]} intensity={0.4} color="#e60039" />
                <Suspense fallback={null}>
                  <RPMModel url={avatarUrl} />
                  <Environment preset="city" />
                </Suspense>
                <CameraControls />
              </Canvas>
            </div>

            {/* Action Bar at Bottom */}
            <div className="absolute bottom-10 z-20 flex gap-4 w-full max-w-lg px-6">
              <button onClick={() => setAvatarUrl(null)}
                className="flex-1 py-4 rounded-2xl bg-[#0e0414] text-[#ff0055] font-extrabold text-sm uppercase tracking-widest flex items-center justify-center gap-2.5 border border-[#ff0055]/40 hover:bg-[#ff0055]/10 hover:border-[#ff0055] transition-all cursor-pointer">
                <RefreshCw className="w-4 h-4" /> RE-EDIT NEURAL AVATAR
              </button>
              
              <button onClick={handleSave} disabled={isSaving}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#ff0055] via-[#e60039] to-[#ff0055] text-white font-extrabold text-sm uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-[0_0_22px_rgba(255,0,85,0.45)] hover:scale-[1.02] active:scale-95 border border-white/15 transition-all cursor-pointer disabled:opacity-60">
                {isSaving
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />LOCKING IN...</>
                  : <><ShieldCheck className="w-4 h-4" />LOCK IN AVATAR</>
                }
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

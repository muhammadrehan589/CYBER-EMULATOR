'use client';

import React, { useState, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

function BasicAvatar({ hairColor, topColor, bottomColor }: { hairColor: string, topColor: string, bottomColor: string }) {
  const groupRef = useRef<any>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Slight floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Head */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#ffccaa" roughness={0.8} />
      </mesh>
      
      {/* Hair (simple cap) */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <sphereGeometry args={[0.32, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={hairColor} roughness={0.9} />
      </mesh>

      {/* Body / Top */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.35, 0.7, 4, 16]} />
        <meshStandardMaterial color={topColor} roughness={0.7} />
      </mesh>

      {/* Bottom / Legs (simplified as a lower capsule/cylinder) */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.6, 16]} />
        <meshStandardMaterial color={bottomColor} roughness={0.8} />
      </mesh>
    </group>
  );
}

export default function AvatarPage() {
  const router = useRouter();
  const [hairColor, setHairColor] = useState('#222222');
  const [topColor, setTopColor] = useState('#ff0055');
  const [bottomColor, setBottomColor] = useState('#111111');
  const [isSaving, setIsSaving] = useState(false);

  const colors = {
    hair: ['#222222', '#8B4513', '#FFD700', '#FF0055', '#4B0082'],
    top: ['#ff0055', '#00ff88', '#0088ff', '#ffffff', '#222222'],
    bottom: ['#111111', '#2222ff', '#555555', '#ffffff', '#ff0055']
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => router.push('/dashboard'), 1000);
  };

  return (
    <div className="flex h-screen w-screen bg-black text-white font-sans overflow-hidden">
      
      {/* Left side: 3D Canvas */}
      <div className="flex-1 relative">
        {/* Ambient glows */}
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#ff0055]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#00ff88]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="absolute top-6 left-6 z-10">
          <Link href="/dashboard" className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
        </div>

        <Canvas shadows camera={{ position: [0, 1.2, 3], fov: 40 }} gl={{ antialias: true }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[2, 5, 2]} intensity={1.5} castShadow shadow-mapSize={1024} />
          <pointLight position={[-2, 2, 2]} intensity={0.5} color="#ff0055" />
          <Environment preset="city" />
          
          <Suspense fallback={null}>
            <BasicAvatar hairColor={hairColor} topColor={topColor} bottomColor={bottomColor} />
            <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={5} blur={2} far={2} />
          </Suspense>
          
          <OrbitControls 
            target={[0, 1, 0]} 
            enablePan={false} 
            minPolarAngle={Math.PI / 4} 
            maxPolarAngle={Math.PI / 2 + 0.1} 
            minDistance={2} 
            maxDistance={4} 
          />
        </Canvas>
      </div>

      {/* Right side: UI Grid */}
      <div className="w-[380px] bg-[#090909] border-l border-white/10 p-6 flex flex-col z-10 shadow-2xl overflow-y-auto">
        <h2 className="text-2xl font-black uppercase tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
          Neural Avatar
        </h2>

        <div className="space-y-8 flex-1">
          {/* Hair Color */}
          <div className="space-y-3">
            <h3 className="text-sm font-mono text-gray-400 uppercase tracking-wider">Hair</h3>
            <div className="grid grid-cols-5 gap-3">
              {colors.hair.map(color => (
                <button
                  key={color}
                  onClick={() => setHairColor(color)}
                  className={`w-12 h-12 rounded-xl border-2 transition-all ${hairColor === color ? 'border-white scale-110' : 'border-transparent hover:border-white/30'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Top Color */}
          <div className="space-y-3">
            <h3 className="text-sm font-mono text-gray-400 uppercase tracking-wider">Top</h3>
            <div className="grid grid-cols-5 gap-3">
              {colors.top.map(color => (
                <button
                  key={color}
                  onClick={() => setTopColor(color)}
                  className={`w-12 h-12 rounded-xl border-2 transition-all ${topColor === color ? 'border-white scale-110' : 'border-transparent hover:border-white/30'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Bottom Color */}
          <div className="space-y-3">
            <h3 className="text-sm font-mono text-gray-400 uppercase tracking-wider">Bottom</h3>
            <div className="grid grid-cols-5 gap-3">
              {colors.bottom.map(color => (
                <button
                  key={color}
                  onClick={() => setBottomColor(color)}
                  className={`w-12 h-12 rounded-xl border-2 transition-all ${bottomColor === color ? 'border-white scale-110' : 'border-transparent hover:border-white/30'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="w-full py-4 rounded-xl bg-white text-black font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
            {isSaving ? 'Syncing...' : 'Confirm Avatar'}
          </button>
        </div>
      </div>
    </div>
  );
}

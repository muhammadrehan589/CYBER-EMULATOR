'use client';

import React, { useState, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const skinMaterialProps = { color: '#ffccaa', roughness: 0.8, metalness: 0.1 };

function Eyes() {
  return (
    <group position={[0, 0.1, 0.28]}>
      {/* Left Eye */}
      <mesh position={[-0.12, 0, 0]} castShadow>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="white" roughness={0.8} metalness={0.1} />
        <mesh position={[0, 0, 0.03]} castShadow>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshStandardMaterial color="black" roughness={0.8} metalness={0.1} />
        </mesh>
      </mesh>
      {/* Right Eye */}
      <mesh position={[0.12, 0, 0]} castShadow>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="white" roughness={0.8} metalness={0.1} />
        <mesh position={[0, 0, 0.03]} castShadow>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshStandardMaterial color="black" roughness={0.8} metalness={0.1} />
        </mesh>
      </mesh>
    </group>
  );
}

function Mouth() {
  return (
    <mesh position={[0, -0.12, 0.28]} rotation={[0, 0, Math.PI / 2]} castShadow>
      <capsuleGeometry args={[0.015, 0.06, 8, 8]} />
      <meshStandardMaterial color="#aa4444" roughness={0.8} metalness={0.1} />
    </mesh>
  );
}

function Hair({ style, color }: { style: string, color: string }) {
  const materialProps = { color, roughness: 0.9, metalness: 0.1 };
  
  if (style === 'Bald') return null;
  
  if (style === 'Spiky') {
    const spikes = Array.from({ length: 14 }).map((_, i) => (
      <mesh key={i} position={[
        Math.cos(i * 2) * (0.1 + Math.random() * 0.1), 
        0.2 + Math.random() * 0.1, 
        Math.sin(i * 2) * (0.1 + Math.random() * 0.1)
      ]} rotation={[
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5
      ]} castShadow>
        <coneGeometry args={[0.1, 0.35, 8]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
    ));
    return <group position={[0, 0.15, 0]}>{spikes}</group>;
  }
  
  // Default 'Short'
  return (
    <mesh position={[0, 0.1, 0]} castShadow>
      <sphereGeometry args={[0.32, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
      <meshStandardMaterial {...materialProps} />
    </mesh>
  );
}

function FacialHair({ active, color }: { active: boolean, color: string }) {
  if (!active) return null;
  return (
    <mesh position={[0, -0.15, 0.1]} rotation={[Math.PI / 2.5, 0, 0]} castShadow>
      <torusGeometry args={[0.23, 0.05, 16, 32, Math.PI]} />
      <meshStandardMaterial color={color} roughness={0.9} metalness={0.1} />
    </mesh>
  );
}

function AvatarBody(props: any) {
  const { gender, faceStructure, hairStyle, facialHair, topStyle, bottomStyle, hairColor, topColor, bottomColor } = props;
  const groupRef = useRef<any>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.03 - 1;
    }
  });

  const torsoScale = gender === 'Female' ? [0.85, 1, 0.8] : [1, 1, 1];
  const headScale = faceStructure === 'Angular' ? [0.95, 1.05, 1] : [1, 1, 1];
  
  const materialTop = { color: topColor, roughness: 0.8, metalness: 0.1 };
  const materialBottom = { color: bottomColor, roughness: 0.8, metalness: 0.1 };
  
  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      
      {/* Head Group */}
      <group position={[0, 1.8, 0]} scale={headScale as any}>
        <mesh castShadow>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial {...skinMaterialProps} />
        </mesh>
        <Eyes />
        <Mouth />
        <Hair style={hairStyle} color={hairColor} />
        <FacialHair active={facialHair && gender !== 'Female'} color={hairColor} />
      </group>

      {/* Torso Group */}
      <group position={[0, 1.0, 0]} scale={torsoScale as any}>
        <mesh castShadow>
          <capsuleGeometry args={[0.35, 0.65, 16, 16]} />
          <meshStandardMaterial {...materialTop} />
        </mesh>
        
        {/* Jacket */}
        {topStyle === 'Jacket' && (
          <mesh castShadow rotation={[0, -Math.PI / 2, 0]}>
             <cylinderGeometry args={[0.42, 0.42, 0.9, 16, 1, true, Math.PI * 0.2, Math.PI * 1.6]} />
             <meshStandardMaterial color="#222" roughness={0.9} metalness={0.1} side={2} />
          </mesh>
        )}
      </group>

      {/* Arms Group */}
      <group position={[-0.5, 1.25, 0]} rotation={[0, 0, Math.PI / 10]}>
        {/* Left Arm */}
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.08, 0.6, 16]} />
          <meshStandardMaterial {...skinMaterialProps} />
        </mesh>
        {/* Sleeves */}
        <mesh position={[0, -0.1, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.1, 0.3, 16]} />
          <meshStandardMaterial {...materialTop} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.65, 0]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial {...skinMaterialProps} />
        </mesh>
      </group>
      <group position={[0.5, 1.25, 0]} rotation={[0, 0, -Math.PI / 10]}>
        {/* Right Arm */}
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.08, 0.6, 16]} />
          <meshStandardMaterial {...skinMaterialProps} />
        </mesh>
        {/* Sleeves */}
        <mesh position={[0, -0.1, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.1, 0.3, 16]} />
          <meshStandardMaterial {...materialTop} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.65, 0]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial {...skinMaterialProps} />
        </mesh>
      </group>

      {/* Legs Group */}
      <group position={[-0.18, 0.35, 0]}>
        {/* Left Leg */}
        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.1, 0.4, 16]} />
          <meshStandardMaterial {...(bottomStyle === 'Shorts' ? skinMaterialProps : materialBottom)} />
        </mesh>
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.13, 0.12, 0.3, 16]} />
          <meshStandardMaterial {...materialBottom} />
        </mesh>
        {/* Foot */}
        <mesh position={[0, -0.45, 0.05]} castShadow>
          <capsuleGeometry args={[0.1, 0.15, 8, 8]} />
          <meshStandardMaterial color="#222" roughness={0.8} />
        </mesh>
      </group>
      <group position={[0.18, 0.35, 0]}>
        {/* Right Leg */}
        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.1, 0.4, 16]} />
          <meshStandardMaterial {...(bottomStyle === 'Shorts' ? skinMaterialProps : materialBottom)} />
        </mesh>
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.13, 0.12, 0.3, 16]} />
          <meshStandardMaterial {...materialBottom} />
        </mesh>
        {/* Foot */}
        <mesh position={[0, -0.45, 0.05]} castShadow>
          <capsuleGeometry args={[0.1, 0.15, 8, 8]} />
          <meshStandardMaterial color="#222" roughness={0.8} />
        </mesh>
      </group>
      
      {/* Pelvis/Hips */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <sphereGeometry args={[0.34, 16, 16]} />
        <meshStandardMaterial {...materialBottom} />
      </mesh>
    </group>
  );
}

export default function AvatarPage() {
  const router = useRouter();
  
  // State
  const [gender, setGender] = useState('Male');
  const [faceStructure, setFaceStructure] = useState('Round');
  const [hairStyle, setHairStyle] = useState('Short');
  const [facialHair, setFacialHair] = useState(false);
  const [topStyle, setTopStyle] = useState('T-Shirt');
  const [bottomStyle, setBottomStyle] = useState('Pants');
  
  const [hairColor, setHairColor] = useState('#222222');
  const [topColor, setTopColor] = useState('#ff0055');
  const [bottomColor, setBottomColor] = useState('#111111');
  const [isSaving, setIsSaving] = useState(false);
  
  const [activeTab, setActiveTab] = useState('Gender');

  const tabs = ['Gender', 'Face', 'Hair', 'Top', 'Bottom'];
  
  const colors = {
    hair: ['#222222', '#8B4513', '#FFD700', '#FF0055', '#4B0082', '#cccccc'],
    top: ['#ff0055', '#00ff88', '#0088ff', '#ffffff', '#222222', '#ff8800'],
    bottom: ['#111111', '#2222ff', '#555555', '#ffffff', '#ff0055', '#885522']
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => router.push('/dashboard'), 1000);
  };

  return (
    <div className="flex h-screen w-screen bg-black text-white font-sans overflow-hidden">
      {/* 3D Canvas */}
      <div className="flex-1 relative">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#ff0055]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#00ff88]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="absolute top-6 left-6 z-10">
          <Link href="/dashboard" className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
        </div>

        <Canvas shadows camera={{ position: [0, 1.2, 4.5], fov: 40 }} gl={{ antialias: true }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[2, 5, 2]} intensity={1.5} castShadow shadow-mapSize={2048} shadow-bias={-0.001} />
          <pointLight position={[-2, 2, 2]} intensity={0.5} color="#ff0055" />
          <Environment preset="city" />
          
          <Suspense fallback={null}>
            <AvatarBody 
              gender={gender}
              faceStructure={faceStructure}
              hairStyle={hairStyle}
              facialHair={facialHair}
              topStyle={topStyle}
              bottomStyle={bottomStyle}
              hairColor={hairColor}
              topColor={topColor}
              bottomColor={bottomColor}
            />
            <ContactShadows position={[0, -1, 0]} opacity={0.5} scale={5} blur={2} far={2} />
          </Suspense>
          
          <OrbitControls 
            target={[0, 1, 0]} 
            enablePan={false} 
            minPolarAngle={Math.PI / 4} 
            maxPolarAngle={Math.PI / 2 + 0.1} 
            minDistance={2} 
            maxDistance={6} 
          />
        </Canvas>
      </div>

      {/* Customization Grid */}
      <div className="w-[420px] bg-[#090909] border-l border-white/10 flex flex-col z-10 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-black uppercase tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Structural Config
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-white/10 custom-scrollbar hide-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-4 font-bold text-sm tracking-widest uppercase whitespace-nowrap transition-colors ${activeTab === tab ? 'text-[#ff0055] border-b-2 border-[#ff0055]' : 'text-gray-500 hover:text-gray-300 border-b-2 border-transparent'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {activeTab === 'Gender' && (
            <div className="space-y-4">
              <h3 className="text-sm font-mono text-gray-400 uppercase tracking-wider">Form Factor</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Male', 'Female'].map(g => (
                  <button key={g} onClick={() => { setGender(g); if(g === 'Female') setFacialHair(false); }}
                    className={`py-3 rounded-xl border-2 font-bold transition-all ${gender === g ? 'border-[#ff0055] text-[#ff0055] bg-[#ff0055]/10' : 'border-white/10 hover:border-white/30 text-gray-400'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Face' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-mono text-gray-400 uppercase tracking-wider">Structure</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Round', 'Angular'].map(f => (
                    <button key={f} onClick={() => setFaceStructure(f)}
                      className={`py-3 rounded-xl border-2 font-bold transition-all ${faceStructure === f ? 'border-[#ff0055] text-[#ff0055] bg-[#ff0055]/10' : 'border-white/10 hover:border-white/30 text-gray-400'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              
              {gender === 'Male' && (
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h3 className="text-sm font-mono text-gray-400 uppercase tracking-wider">Facial Hair</h3>
                  <div className="flex gap-4">
                    <button onClick={() => setFacialHair(false)}
                      className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${!facialHair ? 'border-white text-white' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>
                      None
                    </button>
                    <button onClick={() => setFacialHair(true)}
                      className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${facialHair ? 'border-white text-white' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>
                      Beard
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Hair' && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-sm font-mono text-gray-400 uppercase tracking-wider">Style</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Bald', 'Short', 'Spiky'].map(h => (
                    <button key={h} onClick={() => setHairStyle(h)}
                      className={`py-3 rounded-xl border-2 font-bold transition-all ${hairStyle === h ? 'border-[#ff0055] text-[#ff0055] bg-[#ff0055]/10' : 'border-white/10 hover:border-white/30 text-gray-400'}`}>
                      {h}
                    </button>
                  ))}
                </div>
              </div>
              
              {hairStyle !== 'Bald' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-mono text-gray-400 uppercase tracking-wider">Color</h3>
                  <div className="flex flex-wrap gap-3">
                    {colors.hair.map(color => (
                      <button key={color} onClick={() => setHairColor(color)}
                        className={`w-12 h-12 rounded-xl border-2 transition-all ${hairColor === color ? 'border-white scale-110' : 'border-transparent hover:border-white/30'}`}
                        style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Top' && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-sm font-mono text-gray-400 uppercase tracking-wider">Style</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['T-Shirt', 'Jacket'].map(t => (
                    <button key={t} onClick={() => setTopStyle(t)}
                      className={`py-3 rounded-xl border-2 font-bold transition-all ${topStyle === t ? 'border-[#ff0055] text-[#ff0055] bg-[#ff0055]/10' : 'border-white/10 hover:border-white/30 text-gray-400'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-mono text-gray-400 uppercase tracking-wider">Color</h3>
                <div className="flex flex-wrap gap-3">
                  {colors.top.map(color => (
                    <button key={color} onClick={() => setTopColor(color)}
                      className={`w-12 h-12 rounded-xl border-2 transition-all ${topColor === color ? 'border-white scale-110' : 'border-transparent hover:border-white/30'}`}
                      style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Bottom' && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-sm font-mono text-gray-400 uppercase tracking-wider">Style</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Pants', 'Shorts'].map(b => (
                    <button key={b} onClick={() => setBottomStyle(b)}
                      className={`py-3 rounded-xl border-2 font-bold transition-all ${bottomStyle === b ? 'border-[#ff0055] text-[#ff0055] bg-[#ff0055]/10' : 'border-white/10 hover:border-white/30 text-gray-400'}`}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-mono text-gray-400 uppercase tracking-wider">Color</h3>
                <div className="flex flex-wrap gap-3">
                  {colors.bottom.map(color => (
                    <button key={color} onClick={() => setBottomColor(color)}
                      className={`w-12 h-12 rounded-xl border-2 transition-all ${bottomColor === color ? 'border-white scale-110' : 'border-transparent hover:border-white/30'}`}
                      style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Action Button */}
        <div className="p-6 border-t border-white/10">
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ff0055] to-[#e60039] text-white font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(255,0,85,0.4)]"
          >
            {isSaving ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
            {isSaving ? 'Syncing...' : 'Lock In Avatar'}
          </button>
        </div>
      </div>
    </div>
  );
}

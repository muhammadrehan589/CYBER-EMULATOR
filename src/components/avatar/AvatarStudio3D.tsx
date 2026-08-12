'use client';

import React, { useRef, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Zap,
  Palette,
  Scissors,
  Shirt,
  Sparkles,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

type Tab = 'tone' | 'hair' | 'top' | 'bottom' | 'shoes';

interface Option {
  id: string;
  label: string;
  color?: string;
  locked?: boolean;
  cost?: number;
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const BODY_TONES: Option[] = [
  { id: 't1', label: 'Porcelain', color: '#FDDBB4' },
  { id: 't2', label: 'Ivory',     color: '#F5C89A' },
  { id: 't3', label: 'Sand',      color: '#E8A87C' },
  { id: 't4', label: 'Honey',     color: '#C68642' },
  { id: 't5', label: 'Caramel',   color: '#8D5524' },
  { id: 't6', label: 'Espresso',  color: '#4A2912' },
];

const HAIR_OPTIONS: Option[] = [
  { id: 'h1', label: 'Jet Black',  color: '#1a0a00' },
  { id: 'h2', label: 'Dark Brown', color: '#3B1F0A' },
  { id: 'h3', label: 'Auburn',     color: '#8B4513' },
  { id: 'h4', label: 'Platinum',   color: '#E8D5A3' },
  { id: 'h5', label: 'Neon Red',   color: '#ff0055' },
  { id: 'h6', label: 'Violet',     color: '#a855f7' },
  { id: 'h7', label: 'Cyber Teal', color: '#06b6d4' },
  { id: 'h8', label: 'Neon Green', color: '#22c55e' },
];

const TOP_OPTIONS: Option[] = [
  { id: 'o1', label: 'Cyber Tee',      color: '#2a0d1a' },
  { id: 'o2', label: 'Hoodie',         color: '#2d0d2d' },
  { id: 'o3', label: 'Tactical Vest',  color: '#18181b' },
  { id: 'o4', label: 'Neon Jacket',    color: '#0d1a2d', locked: true, cost: 1800 },
  { id: 'o5', label: 'Vanguard Armor', color: '#1a0a00', locked: true, cost: 3500 },
];

const BOTTOM_OPTIONS: Option[] = [
  { id: 'b1', label: 'Cargo Pants',   color: '#1c1c1c' },
  { id: 'b2', label: 'Techwear',      color: '#111118' },
  { id: 'b3', label: 'Combat Shorts', color: '#2a2a2a' },
  { id: 'b4', label: 'Cyber Skirt',   color: '#1a0d1a', locked: true, cost: 900  },
  { id: 'b5', label: 'Moto Leggings', color: '#0d0d0d', locked: true, cost: 1200 },
];

const SHOE_OPTIONS: Option[] = [
  { id: 's1', label: 'Sneakers',     color: '#c8c8c8' },
  { id: 's2', label: 'Combat Boots', color: '#2a1a0a' },
  { id: 's3', label: 'Tech Runners', color: '#1a1a2e' },
  { id: 's4', label: 'Neon Kicks',   color: '#ff0055', locked: true, cost: 2000 },
  { id: 's5', label: 'Hover Boots',  color: '#0d1a2d', locked: true, cost: 4000 },
];

// ─── Tab Config ────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'tone',   label: 'Body Tone', icon: <Palette  className="w-3.5 h-3.5" /> },
  { id: 'hair',   label: 'Hair',      icon: <Scissors className="w-3.5 h-3.5" /> },
  { id: 'top',    label: 'Top',       icon: <Shirt    className="w-3.5 h-3.5" /> },
  { id: 'bottom', label: 'Bottom',    icon: <span className="text-[11px]">▼</span> },
  { id: 'shoes',  label: 'Shoes',     icon: <span className="text-[11px]">◆</span> },
];

// ─── 3D Humanoid Character ─────────────────────────────────────────────────────

interface CharacterProps {
  skinColor: string;
  hairColor: string;
  topColor:  string;
  bottomColor: string;
  shoeColor: string;
}

function HumanoidCharacter({ skinColor, hairColor, topColor, bottomColor, shoeColor }: CharacterProps) {
  const groupRef = useRef<THREE.Group>(null!);

  // Subtle idle breathing + micro-sway
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.9) * 0.022;
    groupRef.current.rotation.y += 0.0;
  });

  // Materials
  const skin = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.55, metalness: 0.05 });
  const hair = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.5,  metalness: 0.15 });
  const top  = new THREE.MeshStandardMaterial({ color: topColor,  roughness: 0.7,  metalness: 0.2  });
  const bot  = new THREE.MeshStandardMaterial({ color: bottomColor, roughness: 0.8, metalness: 0.1 });
  const shoe = new THREE.MeshStandardMaterial({ color: shoeColor, roughness: 0.35, metalness: 0.35 });
  const neon = new THREE.MeshStandardMaterial({
    color: '#ff0055', emissive: '#ff0055', emissiveIntensity: 1.1, roughness: 0.2,
  });
  const eyeMat = new THREE.MeshStandardMaterial({ color: '#050008', roughness: 0.15, metalness: 0.6 });

  return (
    <group ref={groupRef} position={[0, -0.55, 0]}>

      {/* ── HEAD ── */}
      <mesh position={[0, 2.28, 0]} material={skin} castShadow>
        <sphereGeometry args={[0.27, 32, 32]} />
      </mesh>

      {/* Hair cap */}
      <mesh position={[0, 2.44, 0]} material={hair} castShadow>
        <sphereGeometry args={[0.285, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
      </mesh>

      {/* Eyes */}
      <mesh position={[ 0.09, 2.29, 0.24]} material={eyeMat}><sphereGeometry args={[0.033, 12, 12]} /></mesh>
      <mesh position={[-0.09, 2.29, 0.24]} material={eyeMat}><sphereGeometry args={[0.033, 12, 12]} /></mesh>

      {/* Crimson eye glow */}
      <mesh position={[ 0.09, 2.29, 0.265]} material={neon}><sphereGeometry args={[0.016, 8, 8]} /></mesh>
      <mesh position={[-0.09, 2.29, 0.265]} material={neon}><sphereGeometry args={[0.016, 8, 8]} /></mesh>

      {/* ── NECK ── */}
      <mesh position={[0, 1.94, 0]} material={skin} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.2, 16]} />
      </mesh>

      {/* ── TORSO ── */}
      <mesh position={[0, 1.44, 0]} material={top} castShadow>
        <capsuleGeometry args={[0.27, 0.68, 8, 16]} />
      </mesh>

      {/* Neon chest accent bar */}
      <mesh position={[0, 1.52, 0.28]} material={neon}>
        <boxGeometry args={[0.2, 0.035, 0.01]} />
      </mesh>
      {/* Neon collar line */}
      <mesh position={[0, 1.82, 0.27]} material={neon}>
        <boxGeometry args={[0.14, 0.018, 0.01]} />
      </mesh>

      {/* ── LEFT ARM ── */}
      <mesh position={[0.44, 1.62, 0]} rotation={[0, 0,  0.32]} material={top} castShadow>
        <capsuleGeometry args={[0.088, 0.32, 8, 12]} />
      </mesh>
      <mesh position={[0.56, 1.2,  0]} rotation={[0, 0,  0.25]} material={skin} castShadow>
        <capsuleGeometry args={[0.073, 0.28, 8, 12]} />
      </mesh>
      <mesh position={[0.62, 0.9,  0]} material={skin} castShadow>
        <sphereGeometry args={[0.077, 12, 12]} />
      </mesh>

      {/* ── RIGHT ARM ── */}
      <mesh position={[-0.44, 1.62, 0]} rotation={[0, 0, -0.32]} material={top} castShadow>
        <capsuleGeometry args={[0.088, 0.32, 8, 12]} />
      </mesh>
      <mesh position={[-0.56, 1.2,  0]} rotation={[0, 0, -0.25]} material={skin} castShadow>
        <capsuleGeometry args={[0.073, 0.28, 8, 12]} />
      </mesh>
      <mesh position={[-0.62, 0.9, 0]} material={skin} castShadow>
        <sphereGeometry args={[0.077, 12, 12]} />
      </mesh>

      {/* ── WAIST / PELVIS ── */}
      <mesh position={[0, 0.92, 0]} material={bot} castShadow>
        <capsuleGeometry args={[0.235, 0.16, 8, 12]} />
      </mesh>

      {/* ── LEFT LEG ── */}
      <mesh position={[0.15, 0.55, 0]} rotation={[0, 0,  0.04]} material={bot} castShadow>
        <capsuleGeometry args={[0.108, 0.34, 8, 12]} />
      </mesh>
      <mesh position={[0.16, 0.1,  0]} material={bot} castShadow>
        <capsuleGeometry args={[0.088, 0.32, 8, 12]} />
      </mesh>
      {/* Left shoe */}
      <mesh position={[0.16, -0.2, 0.07]} material={shoe} castShadow>
        <boxGeometry args={[0.19, 0.11, 0.33]} />
      </mesh>
      {/* Shoe sole neon strip */}
      <mesh position={[0.16, -0.255, 0.07]} material={neon}>
        <boxGeometry args={[0.19, 0.012, 0.33]} />
      </mesh>

      {/* ── RIGHT LEG ── */}
      <mesh position={[-0.15, 0.55, 0]} rotation={[0, 0, -0.04]} material={bot} castShadow>
        <capsuleGeometry args={[0.108, 0.34, 8, 12]} />
      </mesh>
      <mesh position={[-0.16, 0.1,  0]} material={bot} castShadow>
        <capsuleGeometry args={[0.088, 0.32, 8, 12]} />
      </mesh>
      {/* Right shoe */}
      <mesh position={[-0.16, -0.2, 0.07]} material={shoe} castShadow>
        <boxGeometry args={[0.19, 0.11, 0.33]} />
      </mesh>
      <mesh position={[-0.16, -0.255, 0.07]} material={neon}>
        <boxGeometry args={[0.19, 0.012, 0.33]} />
      </mesh>

      {/* Ground shadow glow disc */}
      <mesh position={[0, -0.32, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.5, 32]} />
        <meshBasicMaterial color="#ff0055" opacity={0.07} transparent />
      </mesh>
    </group>
  );
}

// ─── 3D Scene ──────────────────────────────────────────────────────────────────

function Scene(props: CharacterProps) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 6, 3]} intensity={1.4} castShadow
        shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <pointLight position={[-3, 2, -2]} intensity={0.7} color="#ff0055" />
      <pointLight position={[ 3, 2,  2]} intensity={0.4} color="#e60039" />
      <pointLight position={[ 0, 5,  0]} intensity={0.3} color="#ffffff" />

      <Suspense fallback={null}>
        <HumanoidCharacter {...props} />
        <Environment preset="night" />
      </Suspense>

      <OrbitControls
        enablePan={false}
        minDistance={2.6}
        maxDistance={6}
        maxPolarAngle={Math.PI * 0.82}
        minPolarAngle={Math.PI * 0.12}
        autoRotate={false}
        makeDefault
      />
    </>
  );
}

// ─── Swatch Card ───────────────────────────────────────────────────────────────

const SwatchCard: React.FC<{ opt: Option; selected: boolean; onSelect: () => void }> = ({ opt, selected, onSelect }) => (
  <motion.button
    onClick={onSelect}
    whileHover={{ scale: opt.locked ? 1 : 1.03 }}
    whileTap={{ scale: opt.locked ? 1 : 0.97 }}
    className={`relative flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer w-full text-left ${
      opt.locked
        ? 'bg-[#050008]/60 border-zinc-800 opacity-50 cursor-not-allowed'
        : selected
        ? 'bg-[#1e0720] border-2 border-[#ff0055] shadow-[0_0_16px_rgba(255,0,85,0.35)]'
        : 'bg-[#050008] border-zinc-800 hover:border-[#ff0055]/50 hover:bg-[#0e0414]'
    }`}
  >
    {opt.color && (
      <div className="w-8 h-8 rounded-xl flex-shrink-0 border border-white/10 shadow-inner"
        style={{ backgroundColor: opt.color }} />
    )}
    <span className="text-[11px] font-mono font-semibold text-white truncate flex-1">{opt.label}</span>
    {opt.locked && (
      <div className="flex items-center gap-1 text-[9px] font-mono text-red-400 flex-shrink-0">
        <Lock className="w-3 h-3" />
        <span>{opt.cost?.toLocaleString()}</span>
      </div>
    )}
    {selected && !opt.locked && (
      <div className="w-4 h-4 rounded-full bg-[#ff0055] flex items-center justify-center flex-shrink-0">
        <div className="w-2 h-2 rounded-full bg-white" />
      </div>
    )}
  </motion.button>
);

// ─── Main Studio Component ─────────────────────────────────────────────────────

export default function AvatarStudio3D() {
  const router = useRouter();

  const [tone,   setTone]   = useState(BODY_TONES[2]);
  const [hair,   setHair]   = useState(HAIR_OPTIONS[0]);
  const [top,    setTop]    = useState(TOP_OPTIONS[0]);
  const [bottom, setBottom] = useState(BOTTOM_OPTIONS[0]);
  const [shoes,  setShoes]  = useState(SHOE_OPTIONS[0]);

  const [activeTab, setActiveTab] = useState<Tab>('tone');
  const [lockAlert, setLockAlert] = useState<string | null>(null);
  const [isSaving,  setIsSaving]  = useState(false);

  const handleLocked = (opt: Option) => {
    if (opt.locked) {
      setLockAlert(`LOCKED — Requires ${opt.cost?.toLocaleString()} PTS`);
      setTimeout(() => setLockAlert(null), 3000);
      return true;
    }
    return false;
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => router.push('/dashboard'), 1400);
  };

  const optionMap: Record<Tab, { opts: Option[]; sel: Option; set: (o: Option) => void }> = {
    tone:   { opts: BODY_TONES,    sel: tone,   set: setTone   },
    hair:   { opts: HAIR_OPTIONS,  sel: hair,   set: setHair   },
    top:    { opts: TOP_OPTIONS,   sel: top,    set: setTop    },
    bottom: { opts: BOTTOM_OPTIONS, sel: bottom, set: setBottom },
    shoes:  { opts: SHOE_OPTIONS,  sel: shoes,  set: setShoes  },
  };

  return (
    <div className="h-screen w-screen bg-black text-white font-sans overflow-hidden flex flex-col select-none"
      style={{ fontFamily: "'Inter', 'Outfit', sans-serif" }}>

      {/* Deep ambient background glows */}
      <div className="absolute top-0 left-1/4  w-[600px] h-[600px] bg-[#ff0055]/7 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#e60039]/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* ── HEADER ── */}
      <header className="relative z-10 flex items-center justify-between px-6 py-3.5 border-b border-[#ff0055]/20 flex-shrink-0 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link href="/dashboard"
            className="p-2 rounded-xl bg-[#0e0414] border border-[#ff0055]/30 text-[#ff0055] hover:bg-[#ff0055] hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <p className="text-[10px] font-mono font-bold text-[#ff0055] tracking-widest uppercase leading-none">CHARACTER STUDIO 3D</p>
            <h1 className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-200 to-[#ff0055] leading-tight">
              Avatar Creator
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ff0055] animate-pulse" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Drag · Scroll to Zoom</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#120315] border border-[#ff0055]/40 font-mono text-xs text-[#ff0055]">
            <Zap className="w-3.5 h-3.5" />
            <span>4,560 PTS</span>
          </div>
        </div>
      </header>

      {/* ── LOCK ALERT ── */}
      <AnimatePresence>
        {lockAlert && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="relative z-20 mx-6 mt-2.5 p-3 rounded-xl bg-red-950/90 border border-red-500 text-xs font-mono text-red-300 flex items-center gap-2 flex-shrink-0">
            <Lock className="w-4 h-4 text-red-400 shrink-0" />
            <span>{lockAlert}</span>
            <span className="ml-auto text-[10px] text-zinc-500">EARN PTS IN ARENA</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN BODY ── */}
      <div className="relative z-10 flex flex-1 overflow-hidden">

        {/* ── LEFT: 3D CANVAS ── */}
        <div className="flex-1 relative">

          {/* Corner bracket decorations */}
          <div className="absolute top-3 left-3  w-10 h-10 border-t-2 border-l-2 border-[#ff0055]/40 pointer-events-none z-10" />
          <div className="absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 border-[#ff0055]/40 pointer-events-none z-10" />
          <div className="absolute bottom-3 left-3  w-10 h-10 border-b-2 border-l-2 border-[#ff0055]/40 pointer-events-none z-10" />
          <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-[#ff0055]/40 pointer-events-none z-10" />

          {/* Scanline effect */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(255,0,85,0.012)_3px,rgba(255,0,85,0.012)_4px)] pointer-events-none z-10" />

          {/* LIVE label */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-black/70 border border-[#ff0055]/25 backdrop-blur-sm">
            <span className="text-[10px] font-mono text-[#ff0055]/70 tracking-[0.2em] uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff0055] animate-pulse inline-block" />
              LIVE 3D PREVIEW
            </span>
          </div>

          {/* R3F Canvas */}
          <Canvas camera={{ position: [0, 1.1, 4.0], fov: 50 }} shadows
            style={{ background: 'transparent', width: '100%', height: '100%' }}
            gl={{ antialias: true, alpha: true }}>
            <Scene
              skinColor={tone.color!}
              hairColor={hair.color!}
              topColor={top.color!}
              bottomColor={bottom.color!}
              shoeColor={shoes.color!}
            />
          </Canvas>

          {/* Bottom colour status strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 px-4 py-2 rounded-full bg-black/75 border border-zinc-800/80 backdrop-blur-sm">
            {([
              { label: 'Skin', color: tone.color!   },
              { label: 'Hair', color: hair.color!   },
              { label: 'Top',  color: top.color!    },
              { label: 'Bot',  color: bottom.color! },
              { label: 'Shoe', color: shoes.color!  },
            ] as const).map(({ label, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full border border-white/15 shadow"
                  style={{ backgroundColor: color }} />
                <span className="text-[9px] font-mono text-zinc-500">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: CUSTOMIZER PANEL ── */}
        <div className="w-72 flex-shrink-0 flex flex-col bg-[#04000a]/95 border-l border-[#ff0055]/20 backdrop-blur-xl overflow-hidden">

          {/* Vertical Tab Sidebar */}
          <div className="flex flex-col gap-1 p-3 border-b border-zinc-900/60 flex-shrink-0">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[11px] font-mono font-bold uppercase tracking-wide transition-all cursor-pointer w-full text-left ${
                  activeTab === tab.id
                    ? 'bg-[#ff0055] text-white shadow-[0_0_16px_rgba(255,0,85,0.55)]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                }`}>
                <span className="flex-shrink-0">{tab.icon}</span>
                <span>{tab.label}</span>
                {activeTab === tab.id && <span className="ml-auto text-[9px] opacity-60">ACTIVE</span>}
              </button>
            ))}
          </div>

          {/* Option List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab}
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.16 }}
                className="space-y-2">

                {/* Section divider */}
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-3 h-3 text-[#ff0055]" />
                  <span className="text-[9px] font-mono text-[#ff0055] uppercase tracking-[0.2em]">
                    {TABS.find(t => t.id === activeTab)?.label}
                  </span>
                  <div className="flex-1 h-px bg-[#ff0055]/20" />
                </div>

                {optionMap[activeTab].opts.map(opt => (
                  <SwatchCard
                    key={opt.id}
                    opt={opt}
                    selected={optionMap[activeTab].sel.id === opt.id}
                    onSelect={() => { if (!handleLocked(opt)) optionMap[activeTab].set(opt); }}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* LOCK IN AVATAR */}
          <div className="p-4 border-t border-zinc-900/60 flex-shrink-0">
            <button onClick={handleSave} disabled={isSaving}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#ff0055] via-[#e60039] to-[#ff0055] text-white font-extrabold text-sm uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-[0_0_22px_rgba(255,0,85,0.45)] hover:scale-[1.02] active:scale-95 border border-white/15 transition-all cursor-pointer disabled:opacity-60">
              {isSaving ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />LOCKING IN...</>
              ) : (
                <><ShieldCheck className="w-4 h-4" />LOCK IN AVATAR →</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

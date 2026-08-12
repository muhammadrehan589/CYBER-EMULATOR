'use client';

import React, { useRef, useState, Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import {
  ArrowLeft, ShieldCheck, Lock, Zap,
  Palette, Scissors, Shirt, Sparkles, User,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

type Tab    = 'face' | 'hair' | 'facial' | 'top' | 'bottom' | 'shoes';
type Gender = 'male' | 'female' | 'neutral';

interface Option {
  id: string; label: string; color?: string; locked?: boolean; cost?: number;
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
const FACE_STRUCTURES: Option[] = [
  { id: 'fs1', label: 'Oval'  },
  { id: 'fs2', label: 'Round' },
  { id: 'fs3', label: 'Square'},
  { id: 'fs4', label: 'Heart' },
  { id: 'fs5', label: 'Sharp', locked: true, cost: 500 },
];
const HAIR_MALE: Option[] = [
  { id: 'hm1', label: 'Buzz Cut',      color: '#1a0a00' },
  { id: 'hm2', label: 'Slicked Back',  color: '#3B1F0A' },
  { id: 'hm3', label: 'Side Swept',    color: '#8B4513' },
  { id: 'hm4', label: 'Messy Fringe',  color: '#DAA520' },
  { id: 'hm5', label: 'Mohawk',        color: '#ff0055', locked: true, cost: 1200 },
  { id: 'hm6', label: 'Cyber Braids',  color: '#a855f7', locked: true, cost: 1600 },
];
const HAIR_FEMALE: Option[] = [
  { id: 'hf1', label: 'Long Straight', color: '#1a0a00' },
  { id: 'hf2', label: 'Wavy Bob',      color: '#8B4513' },
  { id: 'hf3', label: 'High Ponytail', color: '#DAA520' },
  { id: 'hf4', label: 'Space Buns',    color: '#ff0055' },
  { id: 'hf5', label: 'Curtain Bangs', color: '#a855f7' },
  { id: 'hf6', label: 'Undercut',      color: '#06b6d4', locked: true, cost: 1400 },
];
const HAIR_NEUTRAL: Option[] = [
  { id: 'hn1', label: 'Afro',         color: '#1a0a00' },
  { id: 'hn2', label: 'Locs',         color: '#3B1F0A' },
  { id: 'hn3', label: 'Pixie Cut',    color: '#8B4513' },
  { id: 'hn4', label: 'Neon Spikes',  color: '#ff0055', locked: true, cost: 1000 },
  { id: 'hn5', label: 'Cyber Dreads', color: '#06b6d4', locked: true, cost: 1800 },
];
const HAIR_COLORS: Option[] = [
  { id: 'hc1', label: 'Jet Black',  color: '#1a0a00' },
  { id: 'hc2', label: 'Dark Brown', color: '#3B1F0A' },
  { id: 'hc3', label: 'Auburn',     color: '#8B4513' },
  { id: 'hc4', label: 'Blonde',     color: '#DAA520' },
  { id: 'hc5', label: 'Platinum',   color: '#E8D5A3' },
  { id: 'hc6', label: 'Neon Red',   color: '#ff0055' },
  { id: 'hc7', label: 'Violet',     color: '#a855f7' },
  { id: 'hc8', label: 'Cyber Teal', color: '#06b6d4' },
  { id: 'hc9', label: 'Neon Green', color: '#22c55e' },
];
const FACIAL_HAIR: Option[] = [
  { id: 'fd0', label: 'Clean Shaven' },
  { id: 'fd1', label: 'Stubble'      },
  { id: 'fd2', label: 'Full Beard'   },
  { id: 'fd3', label: 'Goatee'       },
  { id: 'fd4', label: 'Viking Beard', locked: true, cost: 1200 },
];
const TOP_MALE: Option[] = [
  { id: 'tm1', label: 'Cyber Tee',      color: '#2a0d1a' },
  { id: 'tm2', label: 'Hoodie',         color: '#2d0d2d' },
  { id: 'tm3', label: 'Tactical Vest',  color: '#18181b' },
  { id: 'tm4', label: 'Trench Coat',    color: '#0d0d18' },
  { id: 'tm5', label: 'Neon Jacket',    color: '#0d1a2d', locked: true, cost: 1800 },
  { id: 'tm6', label: 'Vanguard Armor', color: '#1a0a00', locked: true, cost: 3500 },
];
const TOP_FEMALE: Option[] = [
  { id: 'tf1', label: 'Crop Top',       color: '#2a0d1a' },
  { id: 'tf2', label: 'Hoodie',         color: '#2d0d2d' },
  { id: 'tf3', label: 'Cyber Corset',   color: '#18181b' },
  { id: 'tf4', label: 'Trench Coat',    color: '#0d0d18' },
  { id: 'tf5', label: 'Neon Jacket',    color: '#0d1a2d', locked: true, cost: 1800 },
  { id: 'tf6', label: 'Vanguard Armor', color: '#1a0a00', locked: true, cost: 3500 },
];
const TOP_NEUTRAL: Option[] = [
  { id: 'tn1', label: 'Cyber Tee',        color: '#2a0d1a' },
  { id: 'tn2', label: 'Oversized Hoodie', color: '#2d0d2d' },
  { id: 'tn3', label: 'Techwear Vest',    color: '#18181b' },
  { id: 'tn4', label: 'Longline Coat',    color: '#0d0d18' },
  { id: 'tn5', label: 'Neon Jacket',      color: '#0d1a2d', locked: true, cost: 1800 },
];
const BOTTOM_OPTIONS: Option[] = [
  { id: 'b1', label: 'Cargo Pants',    color: '#1c1c1c' },
  { id: 'b2', label: 'Techwear',       color: '#111118' },
  { id: 'b3', label: 'Combat Shorts',  color: '#2a2a2a' },
  { id: 'b4', label: 'Slim Fit',       color: '#0d0d14' },
  { id: 'b5', label: 'Cyber Skirt',    color: '#1a0d1a', locked: true, cost: 900  },
  { id: 'b6', label: 'Moto Leggings',  color: '#0d0d0d', locked: true, cost: 1200 },
];
const SHOE_OPTIONS: Option[] = [
  { id: 's1', label: 'Sneakers',        color: '#c8c8c8' },
  { id: 's2', label: 'Combat Boots',    color: '#2a1a0a' },
  { id: 's3', label: 'Tech Runners',    color: '#1a1a2e' },
  { id: 's4', label: 'Platform Boots',  color: '#18181b' },
  { id: 's5', label: 'Neon Kicks',      color: '#ff0055', locked: true, cost: 2000 },
  { id: 's6', label: 'Hover Boots',     color: '#0d1a2d', locked: true, cost: 4000 },
];

const ALL_TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'face',   label: 'Face',        icon: <User     className="w-3.5 h-3.5" /> },
  { id: 'hair',   label: 'Hair',        icon: <Scissors className="w-3.5 h-3.5" /> },
  { id: 'facial', label: 'Facial Hair', icon: <span className="text-[11px]">🧔</span> },
  { id: 'top',    label: 'Top',         icon: <Shirt    className="w-3.5 h-3.5" /> },
  { id: 'bottom', label: 'Bottom',      icon: <span className="text-[11px]">▼</span> },
  { id: 'shoes',  label: 'Shoes',       icon: <span className="text-[11px]">◆</span> },
];

// ─── Material factory — claymation look ────────────────────────────────────────

function mat(color: string, extra?: Partial<THREE.MeshStandardMaterialParameters>): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.1, ...extra });
}

// ─── 3D Humanoid — fully proportioned, claymation style ───────────────────────
// All positions are in LOCAL space of the character group.
// Character group is placed at world [0, 1.5, 0] so the HEAD is the camera target.
//
// Local coordinate breakdown (head center = local [0, 0, 0]):
//   HEAD        y =  0.00
//   NECK        y = -0.46
//   TORSO       y = -1.10   (center of capsule)
//   PELVIS      y = -1.88
//   THIGH MID   y = -2.42
//   SHIN MID    y = -2.98
//   FOOT        y = -3.35

interface CharacterProps {
  skinColor: string; hairColor: string; topColor: string;
  bottomColor: string; shoeColor: string;
  gender: Gender; faceStructure: string;
}

function HumanoidCharacter({ skinColor, hairColor, topColor, bottomColor, shoeColor, gender, faceStructure }: CharacterProps) {
  const root = useRef<THREE.Group>(null!);

  // Gentle idle breath bob — stays subtle so it doesn't feel jittery
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    root.current.position.y = Math.sin(t * 0.8) * 0.018;
  });

  // ── Materials ──
  const mSkin  = mat(skinColor);
  const mHair  = mat(hairColor, { roughness: 0.55 });
  const mTop   = mat(topColor,  { roughness: 0.5, metalness: 0.15 });
  const mBot   = mat(bottomColor);
  const mShoe  = mat(shoeColor, { roughness: 0.3, metalness: 0.25 });
  const mNeon  = mat('#ff0055', { emissive: '#ff0055', emissiveIntensity: 1.2, roughness: 0.15, metalness: 0 });
  const mWhite = mat('#f4f4f4', { roughness: 0.25, metalness: 0 });
  const mPupil = mat('#0a0005', { roughness: 0.15, metalness: 0.4 });
  const mLip   = mat('#b84060', { roughness: 0.45 });

  // Face shape scale multipliers
  const fScale: [number, number, number] =
    faceStructure === 'fs2' ? [1.07, 0.96, 1.04] :
    faceStructure === 'fs3' ? [1.03, 1.03, 0.97] :
    faceStructure === 'fs4' ? [0.94, 1.07, 1.01] :
    faceStructure === 'fs5' ? [0.88, 1.12, 0.96] :
    [1.0,  1.0,  1.0];

  // Gender-specific widths
  const shoulderX = gender === 'male' ? 0.44 : gender === 'female' ? 0.36 : 0.40;
  const hipX      = gender === 'female' ? 0.22 : 0.16;
  const torsoR    = gender === 'female' ? 0.27 : 0.30;
  const hipR      = gender === 'female' ? 0.28 : 0.25;

  // Utility: sphere
  const S = (args: [number, number?, number?], material: THREE.MeshStandardMaterial, pos: [number,number,number], scale?: [number,number,number]) => (
    <mesh material={material} position={pos} scale={scale} castShadow>
      <sphereGeometry args={[args[0], args[1] ?? 24, args[2] ?? 24]} />
    </mesh>
  );
  // Utility: capsule
  const C = (r: number, len: number, material: THREE.MeshStandardMaterial, pos: [number,number,number], rot?: [number,number,number]) => (
    <mesh material={material} position={pos} rotation={rot ?? [0,0,0]} castShadow>
      <capsuleGeometry args={[r, len, 8, 16]} />
    </mesh>
  );
  // Utility: box
  const B = (w: number, h: number, d: number, material: THREE.MeshStandardMaterial, pos: [number,number,number]) => (
    <mesh material={material} position={pos} castShadow>
      <boxGeometry args={[w, h, d]} />
    </mesh>
  );
  // Joint sphere (for seamless connections)
  const J = (r: number, material: THREE.MeshStandardMaterial, pos: [number,number,number]) => S([r, 14, 14], material, pos);

  return (
    // Character group pinned so head centre = world [0, 1.5, 0]
    <group position={[0, 1.5, 0]}>
      <group ref={root}>

        {/* ══════════════════════════════════════════════════
            HEAD  (local origin = head centre)
        ══════════════════════════════════════════════════ */}
        <group position={[0, 0, 0]}>
          {/* Head sphere — larger, claymation */}
          <mesh material={mSkin} castShadow scale={fScale}>
            <sphereGeometry args={[0.38, 40, 40]} />
          </mesh>

          {/* Hair cap — slightly above & covers top half */}
          <mesh material={mHair} castShadow scale={[fScale[0] * 1.02, fScale[1] * 1.02, fScale[2] * 1.02]}
            position={[0, 0.02, -0.04]}>
            <sphereGeometry args={[0.395, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          </mesh>

          {/* Ears */}
          {S([0.09, 10, 10], mSkin, [ 0.368, -0.02, 0])}
          {S([0.09, 10, 10], mSkin, [-0.368, -0.02, 0])}

          {/* ── EYES ── properly placed on forehead-to-nose band ─── */}
          {/* Eye whites — large & expressive */}
          {S([0.068, 18, 18], mWhite, [ 0.14, 0.05, 0.34])}
          {S([0.068, 18, 18], mWhite, [-0.14, 0.05, 0.34])}
          {/* Iris */}
          {S([0.044, 14, 14], mat('#1e3a7e', { roughness: 0.2, metalness: 0.1 }), [ 0.14, 0.05, 0.375])}
          {S([0.044, 14, 14], mat('#1e3a7e', { roughness: 0.2, metalness: 0.1 }), [-0.14, 0.05, 0.375])}
          {/* Pupil — black */}
          {S([0.026, 10, 10], mPupil, [ 0.14, 0.05, 0.395])}
          {S([0.026, 10, 10], mPupil, [-0.14, 0.05, 0.395])}
          {/* Neon glow dot */}
          {S([0.012, 8, 8], mNeon, [ 0.14, 0.05, 0.406])}
          {S([0.012, 8, 8], mNeon, [-0.14, 0.05, 0.406])}
          {/* Catchlight (white dot) */}
          {S([0.014, 6, 6], mWhite, [ 0.154, 0.066, 0.408])}
          {S([0.014, 6, 6], mWhite, [-0.126, 0.066, 0.408])}
          {/* Upper eyelid shadow band */}
          {B(0.12, 0.018, 0.01, mat('#1a0a1a', { roughness: 0.6 }), [ 0.14, 0.104, 0.384])}
          {B(0.12, 0.018, 0.01, mat('#1a0a1a', { roughness: 0.6 }), [-0.14, 0.104, 0.384])}
          {/* Eyebrows */}
          {B(0.1, 0.022, 0.012, mHair, [ 0.14, 0.142, 0.365])}
          {B(0.1, 0.022, 0.012, mHair, [-0.14, 0.142, 0.365])}

          {/* ── NOSE ── */}
          {S([0.028, 10, 10], mSkin, [0, -0.05, 0.37])}

          {/* ── MOUTH ── */}
          {/* Upper lip */}
          {B(0.14, 0.026, 0.014, mLip, [0, -0.138, 0.362])}
          {/* Lower lip — slightly thicker */}
          {B(0.13, 0.034, 0.016, mLip, [0, -0.168, 0.36])}
          {/* Lip corner dimples */}
          {S([0.016, 6, 6], mSkin, [ 0.073, -0.15, 0.358])}
          {S([0.016, 6, 6], mSkin, [-0.073, -0.15, 0.358])}
        </group>

        {/* ══════════════════════════════════════════════════
            NECK — seamlessly connects head to torso
        ══════════════════════════════════════════════════ */}
        <group position={[0, -0.46, 0]}>
          {C(0.13, 0.2, mSkin, [0, 0, 0])}
        </group>

        {/* ══════════════════════════════════════════════════
            TORSO GROUP — shoulders anchored here
        ══════════════════════════════════════════════════ */}
        <group position={[0, -1.10, 0]}>
          {/* Main torso capsule */}
          {C(torsoR, 0.78, mTop, [0, 0, 0])}
          {/* Neon chest stripe */}
          {B(0.26, 0.032, 0.01, mNeon, [0, 0.14, torsoR + 0.005])}
          {/* Neon collar bar */}
          {B(0.16, 0.02, 0.01, mNeon, [0, 0.40, torsoR + 0.005])}

          {/* ── LEFT SHOULDER & ARM ── */}
          <group position={[shoulderX, 0.30, 0]}>
            {/* Shoulder cap — joint sphere fills the gap */}
            {J(torsoR * 0.52, mTop, [0, 0, 0])}
            {/* Upper arm — slightly angled out */}
            {C(0.096, 0.34, mTop, [0.05, -0.26, 0], [0, 0, 0.22])}
            {/* Elbow joint */}
            {J(0.082, mSkin, [0.07, -0.52, 0])}
            {/* Forearm */}
            {C(0.082, 0.30, mSkin, [0.07, -0.74, 0])}
            {/* Wrist */}
            {J(0.072, mSkin, [0.07, -0.96, 0])}
            {/* Hand */}
            {S([0.085, 12, 12], mSkin, [0.07, -1.06, 0])}
          </group>

          {/* ── RIGHT SHOULDER & ARM ── */}
          <group position={[-shoulderX, 0.30, 0]}>
            {J(torsoR * 0.52, mTop, [0, 0, 0])}
            {C(0.096, 0.34, mTop, [-0.05, -0.26, 0], [0, 0, -0.22])}
            {J(0.082, mSkin, [-0.07, -0.52, 0])}
            {C(0.082, 0.30, mSkin, [-0.07, -0.74, 0])}
            {J(0.072, mSkin, [-0.07, -0.96, 0])}
            {S([0.085, 12, 12], mSkin, [-0.07, -1.06, 0])}
          </group>
        </group>

        {/* ══════════════════════════════════════════════════
            PELVIS — hips anchor the legs
        ══════════════════════════════════════════════════ */}
        <group position={[0, -1.88, 0]}>
          {C(hipR, 0.26, mBot, [0, 0, 0])}

          {/* ── LEFT LEG ── */}
          <group position={[hipX, -0.14, 0]}>
            {/* Hip socket joint */}
            {J(0.12, mBot, [0, 0, 0])}
            {/* Thigh */}
            {C(0.116, 0.40, mBot, [0, -0.30, 0])}
            {/* Knee */}
            {J(0.098, mBot, [0, -0.58, 0])}
            {/* Shin */}
            {C(0.096, 0.36, mBot, [0, -0.84, 0])}
            {/* Ankle */}
            {J(0.080, mSkin, [0, -1.10, 0])}
            {/* Shoe body */}
            {B(0.20, 0.12, 0.36, mShoe, [0, -1.25, 0.08])}
            {/* Sole neon strip */}
            {B(0.20, 0.013, 0.36, mNeon, [0, -1.316, 0.08])}
          </group>

          {/* ── RIGHT LEG ── */}
          <group position={[-hipX, -0.14, 0]}>
            {J(0.12, mBot, [0, 0, 0])}
            {C(0.116, 0.40, mBot, [0, -0.30, 0])}
            {J(0.098, mBot, [0, -0.58, 0])}
            {C(0.096, 0.36, mBot, [0, -0.84, 0])}
            {J(0.080, mSkin, [0, -1.10, 0])}
            {B(0.20, 0.12, 0.36, mShoe, [0, -1.25, 0.08])}
            {B(0.20, 0.013, 0.36, mNeon, [0, -1.316, 0.08])}
          </group>
        </group>

        {/* Ground glow disc */}
        <mesh position={[0, -3.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.55, 32]} />
          <meshBasicMaterial color="#ff0055" opacity={0.06} transparent />
        </mesh>
      </group>
    </group>
  );
}

// ─── Orbit Controls with fixed target ─────────────────────────────────────────

function CameraControls() {
  const controlsRef = useRef<any>(null);
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 1.5, 0);
      controlsRef.current.update();
    }
  }, []);
  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      minDistance={2.2}
      maxDistance={7}
      maxPolarAngle={Math.PI * 0.82}
      minPolarAngle={Math.PI * 0.1}
      makeDefault
    />
  );
}

// ─── Scene ─────────────────────────────────────────────────────────────────────

function Scene(props: CharacterProps) {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 5, 4]}   intensity={1.5} castShadow
        shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <directionalLight position={[-3, 3, -2]}  intensity={0.5} color="#ffbbcc" />
      <pointLight      position={[-2, 3, -1]}   intensity={0.8} color="#ff0055" />
      <pointLight      position={[ 2, 2,  2]}   intensity={0.4} color="#e60039" />
      <pointLight      position={[ 0, 5,  1]}   intensity={0.3} color="#ffffff" />
      <Suspense fallback={null}>
        <HumanoidCharacter {...props} />
        <Environment preset="night" />
      </Suspense>
      <CameraControls />
    </>
  );
}

// ─── UI helpers ────────────────────────────────────────────────────────────────

const SwatchCard: React.FC<{ opt: Option; selected: boolean; onSelect: () => void }> = ({ opt, selected, onSelect }) => (
  <motion.button onClick={onSelect}
    whileHover={{ scale: opt.locked ? 1 : 1.03 }}
    whileTap={{ scale: opt.locked ? 1 : 0.97 }}
    className={`relative flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer w-full text-left ${
      opt.locked
        ? 'bg-[#050008]/60 border-zinc-800 opacity-50 cursor-not-allowed'
        : selected
        ? 'bg-[#1e0720] border-2 border-[#ff0055] shadow-[0_0_16px_rgba(255,0,85,0.35)]'
        : 'bg-[#050008] border-zinc-800 hover:border-[#ff0055]/50 hover:bg-[#0e0414]'
    }`}>
    {opt.color && <div className="w-7 h-7 rounded-xl flex-shrink-0 border border-white/10" style={{ backgroundColor: opt.color }} />}
    <span className="text-[11px] font-mono font-semibold text-white truncate flex-1">{opt.label}</span>
    {opt.locked && <div className="flex items-center gap-1 text-[9px] font-mono text-red-400 flex-shrink-0"><Lock className="w-3 h-3" /><span>{opt.cost?.toLocaleString()}</span></div>}
    {selected && !opt.locked && <div className="w-3.5 h-3.5 rounded-full bg-[#ff0055] flex items-center justify-center flex-shrink-0"><div className="w-2 h-2 rounded-full bg-white" /></div>}
  </motion.button>
);

const SectionLabel: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center gap-2 mb-3">
    <Sparkles className="w-3 h-3 text-[#ff0055]" />
    <span className="text-[9px] font-mono text-[#ff0055] uppercase tracking-[0.2em]">{text}</span>
    <div className="flex-1 h-px bg-[#ff0055]/20" />
  </div>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AvatarStudio3D() {
  const router = useRouter();

  const [gender,        setGender]        = useState<Gender>('male');
  const [tone,          setTone]          = useState(BODY_TONES[2]);
  const [faceStructure, setFaceStructure] = useState(FACE_STRUCTURES[0]);
  const [hairStyle,     setHairStyle]     = useState(HAIR_MALE[0]);
  const [hairColor,     setHairColor]     = useState(HAIR_COLORS[0]);
  const [facialHair,    setFacialHair]    = useState(FACIAL_HAIR[0]);
  const [top,           setTop]           = useState(TOP_MALE[0]);
  const [bottom,        setBottom]        = useState(BOTTOM_OPTIONS[0]);
  const [shoes,         setShoes]         = useState(SHOE_OPTIONS[0]);

  const [activeTab, setActiveTab] = useState<Tab>('face');
  const [lockAlert, setLockAlert] = useState<string | null>(null);
  const [isSaving,  setIsSaving]  = useState(false);

  const handleGenderChange = (g: Gender) => {
    setGender(g);
    setHairStyle(g === 'female' ? HAIR_FEMALE[0] : g === 'neutral' ? HAIR_NEUTRAL[0] : HAIR_MALE[0]);
    setTop(g === 'female' ? TOP_FEMALE[0] : g === 'neutral' ? TOP_NEUTRAL[0] : TOP_MALE[0]);
    if (g === 'female' && activeTab === 'facial') setActiveTab('hair');
  };

  const handleLocked = (opt: Option) => {
    if (opt.locked) {
      setLockAlert(`LOCKED — Requires ${opt.cost?.toLocaleString()} PTS`);
      setTimeout(() => setLockAlert(null), 3000);
      return true;
    }
    return false;
  };

  const visibleTabs  = ALL_TABS.filter(t => !(t.id === 'facial' && gender === 'female'));
  const hairStyleOpts = gender === 'female' ? HAIR_FEMALE : gender === 'neutral' ? HAIR_NEUTRAL : HAIR_MALE;
  const topOpts       = gender === 'female' ? TOP_FEMALE  : gender === 'neutral' ? TOP_NEUTRAL  : TOP_MALE;

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
            <Zap className="w-3.5 h-3.5" /><span>4,560 PTS</span>
          </div>
        </div>
      </header>

      {/* Lock Alert */}
      <AnimatePresence>
        {lockAlert && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="relative z-20 mx-6 mt-2 p-3 rounded-xl bg-red-950/90 border border-red-500 text-xs font-mono text-red-300 flex items-center gap-2 flex-shrink-0">
            <Lock className="w-4 h-4 text-red-400 shrink-0" /><span>{lockAlert}</span>
            <span className="ml-auto text-[10px] text-zinc-500">EARN PTS IN ARENA</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN BODY ── */}
      <div className="relative z-10 flex flex-1 overflow-hidden">

        {/* ── LEFT: 3D CANVAS ── */}
        <div className="flex-1 relative">

          {/* Badge — top-left, never over the model */}
          <div className="absolute top-3 left-4 z-10 px-3 py-1.5 rounded-xl bg-black/80 border border-[#ff0055]/30 backdrop-blur-sm flex items-center gap-2 pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff0055] animate-pulse" />
            <span className="text-[10px] font-mono text-[#ff0055]/80 tracking-widest uppercase">Live 3D Preview</span>
          </div>

          {/* Corner brackets */}
          <div className="absolute top-3 right-3  w-10 h-10 border-t-2 border-r-2 border-[#ff0055]/35 pointer-events-none z-10" />
          <div className="absolute bottom-3 left-3  w-10 h-10 border-b-2 border-l-2 border-[#ff0055]/35 pointer-events-none z-10" />
          <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-[#ff0055]/35 pointer-events-none z-10" />

          {/* Scanlines */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(255,0,85,0.01)_3px,rgba(255,0,85,0.01)_4px)] pointer-events-none z-10" />

          {/* R3F Canvas */}
          <Canvas
            camera={{ position: [0, 1.5, 4], fov: 45 }}
            shadows
            style={{ background: 'transparent', width: '100%', height: '100%' }}
            gl={{ antialias: true, alpha: true }}
          >
            <Scene
              skinColor={tone.color!}
              hairColor={hairColor.color!}
              topColor={top.color!}
              bottomColor={bottom.color!}
              shoeColor={shoes.color!}
              gender={gender}
              faceStructure={faceStructure.id}
            />
          </Canvas>

          {/* Bottom colour status strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 px-4 py-2 rounded-full bg-black/80 border border-zinc-800/80 backdrop-blur-sm pointer-events-none">
            {([
              { label: 'Skin', color: tone.color! },
              { label: 'Hair', color: hairColor.color! },
              { label: 'Top',  color: top.color!   },
              { label: 'Bot',  color: bottom.color! },
              { label: 'Shoe', color: shoes.color! },
            ] as const).map(({ label, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full border border-white/15" style={{ backgroundColor: color }} />
                <span className="text-[9px] font-mono text-zinc-500">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: CUSTOMIZER PANEL ── */}
        <div className="w-72 flex-shrink-0 flex flex-col bg-[#04000a]/96 border-l border-[#ff0055]/20 backdrop-blur-xl overflow-hidden">

          {/* Gender Toggle */}
          <div className="p-3 border-b border-zinc-900/60 flex-shrink-0">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Gender</p>
            <div className="flex gap-1 p-1 rounded-xl bg-[#050008] border border-zinc-800">
              {(['male', 'female', 'neutral'] as Gender[]).map(g => (
                <button key={g} onClick={() => handleGenderChange(g)}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wide transition-all cursor-pointer capitalize ${
                    gender === g ? 'bg-[#ff0055] text-white shadow-[0_0_12px_rgba(255,0,85,0.5)]' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Bar */}
          <div className="flex flex-col gap-1 p-3 border-b border-zinc-900/60 flex-shrink-0">
            {visibleTabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[11px] font-mono font-bold uppercase tracking-wide transition-all cursor-pointer w-full text-left ${
                  activeTab === tab.id ? 'bg-[#ff0055] text-white shadow-[0_0_16px_rgba(255,0,85,0.55)]' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                }`}>
                <span className="flex-shrink-0">{tab.icon}</span>
                <span>{tab.label}</span>
                {activeTab === tab.id && <span className="ml-auto text-[9px] opacity-60">ACTIVE</span>}
              </button>
            ))}
          </div>

          {/* Options */}
          <div className="flex-1 overflow-y-auto p-4">
            <AnimatePresence mode="wait">
              <motion.div key={`${activeTab}-${gender}`}
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.15 }} className="space-y-2">

                {activeTab === 'face' && (<>
                  <SectionLabel text="Face Structure" />
                  {FACE_STRUCTURES.map(opt => (
                    <SwatchCard key={opt.id} opt={opt} selected={faceStructure.id === opt.id}
                      onSelect={() => { if (!handleLocked(opt)) setFaceStructure(opt); }} />
                  ))}
                  <div className="mt-4">
                    <SectionLabel text="Skin Tone" />
                    <div className="grid grid-cols-3 gap-2">
                      {BODY_TONES.map(t => (
                        <button key={t.id} onClick={() => setTone(t)}
                          className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border-2 transition-all cursor-pointer ${
                            tone.id === t.id ? 'border-[#ff0055] bg-[#1e0720] shadow-[0_0_12px_rgba(255,0,85,0.3)]' : 'border-zinc-800 bg-[#050008] hover:border-[#ff0055]/50'
                          }`}>
                          <div className="w-8 h-8 rounded-full border border-white/15" style={{ backgroundColor: t.color }} />
                          <span className="text-[8px] font-mono text-zinc-400 text-center leading-tight">{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>)}

                {activeTab === 'hair' && (<>
                  <SectionLabel text={`Hair · ${gender}`} />
                  {hairStyleOpts.map(opt => (
                    <SwatchCard key={opt.id} opt={opt} selected={hairStyle.id === opt.id}
                      onSelect={() => { if (!handleLocked(opt)) setHairStyle(opt); }} />
                  ))}
                  <div className="mt-4">
                    <SectionLabel text="Hair Color" />
                    <div className="flex flex-wrap gap-2">
                      {HAIR_COLORS.map(c => (
                        <button key={c.id} title={c.label} onClick={() => setHairColor(c)}
                          className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer hover:scale-110 ${
                            hairColor.id === c.id ? 'border-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'border-zinc-700'
                          }`}
                          style={{ backgroundColor: c.color }} />
                      ))}
                    </div>
                  </div>
                </>)}

                {activeTab === 'facial' && gender !== 'female' && (<>
                  <SectionLabel text="Beard & Mustache" />
                  {FACIAL_HAIR.map(opt => (
                    <SwatchCard key={opt.id} opt={opt} selected={facialHair.id === opt.id}
                      onSelect={() => { if (!handleLocked(opt)) setFacialHair(opt); }} />
                  ))}
                </>)}

                {activeTab === 'top' && (<>
                  <SectionLabel text={`Jackets & Tops · ${gender}`} />
                  {topOpts.map(opt => (
                    <SwatchCard key={opt.id} opt={opt} selected={top.id === opt.id}
                      onSelect={() => { if (!handleLocked(opt)) setTop(opt); }} />
                  ))}
                </>)}

                {activeTab === 'bottom' && (<>
                  <SectionLabel text="Pants & Bottoms" />
                  {BOTTOM_OPTIONS.map(opt => (
                    <SwatchCard key={opt.id} opt={opt} selected={bottom.id === opt.id}
                      onSelect={() => { if (!handleLocked(opt)) setBottom(opt); }} />
                  ))}
                </>)}

                {activeTab === 'shoes' && (<>
                  <SectionLabel text="Footwear" />
                  {SHOE_OPTIONS.map(opt => (
                    <SwatchCard key={opt.id} opt={opt} selected={shoes.id === opt.id}
                      onSelect={() => { if (!handleLocked(opt)) setShoes(opt); }} />
                  ))}
                </>)}

              </motion.div>
            </AnimatePresence>
          </div>

          {/* LOCK IN */}
          <div className="p-4 border-t border-zinc-900/60 flex-shrink-0">
            <button onClick={() => { setIsSaving(true); setTimeout(() => router.push('/dashboard'), 1400); }}
              disabled={isSaving}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#ff0055] via-[#e60039] to-[#ff0055] text-white font-extrabold text-sm uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-[0_0_22px_rgba(255,0,85,0.45)] hover:scale-[1.02] active:scale-95 border border-white/15 transition-all cursor-pointer disabled:opacity-60">
              {isSaving
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />LOCKING IN...</>
                : <><ShieldCheck className="w-4 h-4" />LOCK IN AVATAR →</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

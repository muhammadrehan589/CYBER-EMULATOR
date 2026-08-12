'use client';

import React, { useRef, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import {
  ArrowLeft, ShieldCheck, Lock, Zap, Palette,
  Scissors, Shirt, Sparkles, User,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

type Tab = 'face' | 'hair' | 'facial' | 'top' | 'bottom' | 'shoes';
type Gender = 'male' | 'female' | 'neutral';

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

const FACE_STRUCTURES: Option[] = [
  { id: 'fs1', label: 'Oval' },
  { id: 'fs2', label: 'Round' },
  { id: 'fs3', label: 'Square' },
  { id: 'fs4', label: 'Heart' },
  { id: 'fs5', label: 'Sharp', locked: true, cost: 500 },
];

const HAIR_MALE: Option[] = [
  { id: 'hm1', label: 'Buzz Cut',     color: '#1a0a00' },
  { id: 'hm2', label: 'Slicked Back', color: '#3B1F0A' },
  { id: 'hm3', label: 'Side Swept',   color: '#8B4513' },
  { id: 'hm4', label: 'Messy Fringe', color: '#DAA520' },
  { id: 'hm5', label: 'Mohawk',       color: '#ff0055', locked: true, cost: 1200 },
  { id: 'hm6', label: 'Cyber Braids', color: '#a855f7', locked: true, cost: 1600 },
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
  { id: 'hn1', label: 'Afro',        color: '#1a0a00' },
  { id: 'hn2', label: 'Locs',        color: '#3B1F0A' },
  { id: 'hn3', label: 'Pixie Cut',   color: '#8B4513' },
  { id: 'hn4', label: 'Neon Spikes', color: '#ff0055', locked: true, cost: 1000 },
  { id: 'hn5', label: 'Cyber Dreads',color: '#06b6d4', locked: true, cost: 1800 },
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
  { id: 'fd1', label: 'Stubble' },
  { id: 'fd2', label: 'Full Beard' },
  { id: 'fd3', label: 'Goatee' },
  { id: 'fd4', label: 'Viking Beard', locked: true, cost: 1200 },
];

const TOP_MALE: Option[] = [
  { id: 'tm1', label: 'Cyber Tee',     color: '#2a0d1a' },
  { id: 'tm2', label: 'Hoodie',        color: '#2d0d2d' },
  { id: 'tm3', label: 'Tactical Vest', color: '#18181b' },
  { id: 'tm4', label: 'Trench Coat',   color: '#0d0d18' },
  { id: 'tm5', label: 'Neon Jacket',   color: '#0d1a2d', locked: true, cost: 1800 },
  { id: 'tm6', label: 'Vanguard Armor',color: '#1a0a00', locked: true, cost: 3500 },
];

const TOP_FEMALE: Option[] = [
  { id: 'tf1', label: 'Crop Top',      color: '#2a0d1a' },
  { id: 'tf2', label: 'Hoodie',        color: '#2d0d2d' },
  { id: 'tf3', label: 'Cyber Corset',  color: '#18181b' },
  { id: 'tf4', label: 'Trench Coat',   color: '#0d0d18' },
  { id: 'tf5', label: 'Neon Jacket',   color: '#0d1a2d', locked: true, cost: 1800 },
  { id: 'tf6', label: 'Vanguard Armor',color: '#1a0a00', locked: true, cost: 3500 },
];

const TOP_NEUTRAL: Option[] = [
  { id: 'tn1', label: 'Cyber Tee',     color: '#2a0d1a' },
  { id: 'tn2', label: 'Oversized Hoodie', color: '#2d0d2d' },
  { id: 'tn3', label: 'Techwear Vest', color: '#18181b' },
  { id: 'tn4', label: 'Longline Coat', color: '#0d0d18' },
  { id: 'tn5', label: 'Neon Jacket',   color: '#0d1a2d', locked: true, cost: 1800 },
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
  { id: 's1', label: 'Sneakers',       color: '#c8c8c8' },
  { id: 's2', label: 'Combat Boots',   color: '#2a1a0a' },
  { id: 's3', label: 'Tech Runners',   color: '#1a1a2e' },
  { id: 's4', label: 'Platform Boots', color: '#18181b' },
  { id: 's5', label: 'Neon Kicks',     color: '#ff0055', locked: true, cost: 2000 },
  { id: 's6', label: 'Hover Boots',    color: '#0d1a2d', locked: true, cost: 4000 },
];

// ─── Tab Config ────────────────────────────────────────────────────────────────

const ALL_TABS: { id: Tab; label: string; icon: React.ReactNode; maleOnly?: boolean }[] = [
  { id: 'face',   label: 'Face',         icon: <User     className="w-3.5 h-3.5" /> },
  { id: 'hair',   label: 'Hair',         icon: <Scissors className="w-3.5 h-3.5" /> },
  { id: 'facial', label: 'Facial Hair',  icon: <span className="text-[11px] leading-none">🧔</span>, maleOnly: false },
  { id: 'top',    label: 'Top',          icon: <Shirt    className="w-3.5 h-3.5" /> },
  { id: 'bottom', label: 'Bottom',       icon: <span className="text-[11px] leading-none">▼</span> },
  { id: 'shoes',  label: 'Shoes',        icon: <span className="text-[11px] leading-none">◆</span> },
];

// ─── 3D Character ──────────────────────────────────────────────────────────────

interface CharacterProps {
  skinColor: string;
  hairColor: string;
  topColor: string;
  bottomColor: string;
  shoeColor: string;
  gender: Gender;
  faceStructure: string;
}

function HumanoidCharacter({ skinColor, hairColor, topColor, bottomColor, shoeColor, gender, faceStructure }: CharacterProps) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.85) * 0.02;
  });

  // Materials
  const skin = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.55, metalness: 0.05 });
  const hair = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.5, metalness: 0.15 });
  const top  = new THREE.MeshStandardMaterial({ color: topColor,  roughness: 0.7, metalness: 0.2 });
  const bot  = new THREE.MeshStandardMaterial({ color: bottomColor, roughness: 0.8, metalness: 0.1 });
  const shoe = new THREE.MeshStandardMaterial({ color: shoeColor, roughness: 0.35, metalness: 0.35 });
  const neon = new THREE.MeshStandardMaterial({ color: '#ff0055', emissive: '#ff0055', emissiveIntensity: 1.1 });
  const eyeMat   = new THREE.MeshStandardMaterial({ color: '#050008', roughness: 0.2, metalness: 0.6 });
  const mouthMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.6 });
  const lipMat   = new THREE.MeshStandardMaterial({ color: '#c0405a', roughness: 0.5 });

  // Face shape scaling based on faceStructure
  const faceScale: [number, number, number] =
    faceStructure === 'fs2' ? [1.08, 0.95, 1.05] :  // Round
    faceStructure === 'fs3' ? [1.04, 1.0,  1.0]  :  // Square
    faceStructure === 'fs4' ? [0.95, 1.06, 1.0]  :  // Heart
    faceStructure === 'fs5' ? [0.9,  1.1,  0.95] :  // Sharp
    [1.0, 1.0, 1.0];                                 // Oval default

  // Gender-based torso shape
  const torsoRadius = gender === 'female' ? 0.24 : gender === 'male' ? 0.28 : 0.26;
  const hipRadius   = gender === 'female' ? 0.30 : gender === 'male' ? 0.25 : 0.27;
  const shoulderW   = gender === 'female' ? 0.38 : gender === 'male' ? 0.46 : 0.42;

  return (
    <group ref={groupRef} position={[0, -1.55, 0]}>

      {/* ── HEAD GROUP ── */}
      <group position={[0, 3.05, 0]}>
        {/* Head base */}
        <mesh material={skin} castShadow scale={faceScale}>
          <sphereGeometry args={[0.27, 32, 32]} />
        </mesh>

        {/* Hair */}
        <mesh material={hair} castShadow position={[0, 0.05, 0]}
          scale={faceStructure === 'fs2' ? [1.09, 0.97, 1.06] : faceScale}>
          <sphereGeometry args={[0.285, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
        </mesh>

        {/* Ears */}
        <mesh position={[ 0.265, 0, 0]} material={skin} castShadow>
          <sphereGeometry args={[0.07, 10, 10]} />
        </mesh>
        <mesh position={[-0.265, 0, 0]} material={skin} castShadow>
          <sphereGeometry args={[0.07, 10, 10]} />
        </mesh>

        {/* ── EYES ── */}
        {/* Eye whites */}
        <mesh position={[ 0.095, 0.025, 0.245]} material={new THREE.MeshStandardMaterial({ color: '#f0f0f0', roughness: 0.2 })}>
          <sphereGeometry args={[0.046, 14, 14]} />
        </mesh>
        <mesh position={[-0.095, 0.025, 0.245]} material={new THREE.MeshStandardMaterial({ color: '#f0f0f0', roughness: 0.2 })}>
          <sphereGeometry args={[0.046, 14, 14]} />
        </mesh>
        {/* Iris */}
        <mesh position={[ 0.095, 0.025, 0.272]} material={eyeMat}>
          <sphereGeometry args={[0.028, 12, 12]} />
        </mesh>
        <mesh position={[-0.095, 0.025, 0.272]} material={eyeMat}>
          <sphereGeometry args={[0.028, 12, 12]} />
        </mesh>
        {/* Neon pupil glow */}
        <mesh position={[ 0.095, 0.025, 0.285]} material={neon}>
          <sphereGeometry args={[0.013, 8, 8]} />
        </mesh>
        <mesh position={[-0.095, 0.025, 0.285]} material={neon}>
          <sphereGeometry args={[0.013, 8, 8]} />
        </mesh>
        {/* Eyebrow bars */}
        <mesh position={[ 0.095, 0.088, 0.252]} material={hair} rotation={[0, 0, 0.18]}>
          <boxGeometry args={[0.085, 0.015, 0.01]} />
        </mesh>
        <mesh position={[-0.095, 0.088, 0.252]} material={hair} rotation={[0, 0, -0.18]}>
          <boxGeometry args={[0.085, 0.015, 0.01]} />
        </mesh>

        {/* ── NOSE ── */}
        <mesh position={[0, -0.04, 0.268]} material={skin}>
          <sphereGeometry args={[0.025, 8, 8]} />
        </mesh>

        {/* ── MOUTH ── */}
        {/* Upper lip */}
        <mesh position={[0, -0.1, 0.258]} material={lipMat} rotation={[0.15, 0, 0]}>
          <capsuleGeometry args={[0.008, 0.07, 4, 8]} />
        </mesh>
        {/* Lower lip */}
        <mesh position={[0, -0.118, 0.26]} material={lipMat} rotation={[0.1, 0, 0]}>
          <capsuleGeometry args={[0.01, 0.055, 4, 8]} />
        </mesh>
        {/* Smile crease left */}
        <mesh position={[ 0.055, -0.093, 0.255]} material={mouthMat} rotation={[0, 0, -0.6]}>
          <capsuleGeometry args={[0.006, 0.022, 4, 6]} />
        </mesh>
        {/* Smile crease right */}
        <mesh position={[-0.055, -0.093, 0.255]} material={mouthMat} rotation={[0, 0, 0.6]}>
          <capsuleGeometry args={[0.006, 0.022, 4, 6]} />
        </mesh>
        {/* Chin dimple (male / neutral only) */}
        {gender !== 'female' && (
          <mesh position={[0, -0.185, 0.245]} material={new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.7 })}>
            <sphereGeometry args={[0.016, 6, 6]} />
          </mesh>
        )}
      </group>

      {/* ── NECK ── */}
      <group position={[0, 2.68, 0]}>
        <mesh material={skin} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 0.24, 16]} />
        </mesh>
      </group>

      {/* ── TORSO GROUP (shoulders anchored here) ── */}
      <group position={[0, 2.12, 0]}>
        <mesh material={top} castShadow>
          <capsuleGeometry args={[torsoRadius, 0.72, 8, 16]} />
        </mesh>
        {/* Neon chest stripe */}
        <mesh position={[0, 0.12, torsoRadius - 0.01]} material={neon}>
          <boxGeometry args={[0.2, 0.03, 0.01]} />
        </mesh>
        {/* Neon collar */}
        <mesh position={[0, 0.38, torsoRadius - 0.01]} material={neon}>
          <boxGeometry args={[0.13, 0.016, 0.01]} />
        </mesh>

        {/* ── LEFT SHOULDER → ARM ── */}
        <group position={[shoulderW * 0.88, 0.3, 0]}>
          {/* Shoulder cap */}
          <mesh material={top} castShadow>
            <sphereGeometry args={[torsoRadius * 0.55, 12, 12]} />
          </mesh>
          {/* Upper arm */}
          <mesh position={[0.06, -0.22, 0]} rotation={[0, 0, 0.28]} material={top} castShadow>
            <capsuleGeometry args={[0.086, 0.3, 8, 12]} />
          </mesh>
          {/* Elbow joint */}
          <mesh position={[0.1, -0.5, 0]} material={skin} castShadow>
            <sphereGeometry args={[0.072, 10, 10]} />
          </mesh>
          {/* Forearm */}
          <mesh position={[0.12, -0.72, 0]} rotation={[0, 0, 0.18]} material={skin} castShadow>
            <capsuleGeometry args={[0.068, 0.28, 8, 12]} />
          </mesh>
          {/* Hand */}
          <mesh position={[0.16, -0.96, 0]} material={skin} castShadow>
            <sphereGeometry args={[0.076, 10, 10]} />
          </mesh>
        </group>

        {/* ── RIGHT SHOULDER → ARM ── */}
        <group position={[-shoulderW * 0.88, 0.3, 0]}>
          <mesh material={top} castShadow>
            <sphereGeometry args={[torsoRadius * 0.55, 12, 12]} />
          </mesh>
          <mesh position={[-0.06, -0.22, 0]} rotation={[0, 0, -0.28]} material={top} castShadow>
            <capsuleGeometry args={[0.086, 0.3, 8, 12]} />
          </mesh>
          <mesh position={[-0.1, -0.5, 0]} material={skin} castShadow>
            <sphereGeometry args={[0.072, 10, 10]} />
          </mesh>
          <mesh position={[-0.12, -0.72, 0]} rotation={[0, 0, -0.18]} material={skin} castShadow>
            <capsuleGeometry args={[0.068, 0.28, 8, 12]} />
          </mesh>
          <mesh position={[-0.16, -0.96, 0]} material={skin} castShadow>
            <sphereGeometry args={[0.076, 10, 10]} />
          </mesh>
        </group>
      </group>

      {/* ── PELVIS / WAIST ── */}
      <group position={[0, 1.28, 0]}>
        <mesh material={bot} castShadow>
          <capsuleGeometry args={[hipRadius, 0.22, 8, 12]} />
        </mesh>

        {/* ── LEFT LEG ── */}
        <group position={[hipRadius * 0.55, -0.22, 0]}>
          {/* Hip joint */}
          <mesh material={bot} castShadow>
            <sphereGeometry args={[0.11, 10, 10]} />
          </mesh>
          {/* Thigh */}
          <mesh position={[0, -0.32, 0]} material={bot} castShadow>
            <capsuleGeometry args={[0.105, 0.32, 8, 12]} />
          </mesh>
          {/* Knee */}
          <mesh position={[0, -0.62, 0]} material={bot} castShadow>
            <sphereGeometry args={[0.09, 10, 10]} />
          </mesh>
          {/* Shin */}
          <mesh position={[0, -0.9, 0]} material={bot} castShadow>
            <capsuleGeometry args={[0.082, 0.3, 8, 12]} />
          </mesh>
          {/* Ankle */}
          <mesh position={[0, -1.15, 0]} material={skin} castShadow>
            <sphereGeometry args={[0.072, 10, 10]} />
          </mesh>
          {/* Shoe */}
          <mesh position={[0, -1.32, 0.07]} material={shoe} castShadow>
            <boxGeometry args={[0.19, 0.12, 0.34]} />
          </mesh>
          {/* Sole neon strip */}
          <mesh position={[0, -1.385, 0.07]} material={neon}>
            <boxGeometry args={[0.19, 0.012, 0.34]} />
          </mesh>
        </group>

        {/* ── RIGHT LEG ── */}
        <group position={[-hipRadius * 0.55, -0.22, 0]}>
          <mesh material={bot} castShadow>
            <sphereGeometry args={[0.11, 10, 10]} />
          </mesh>
          <mesh position={[0, -0.32, 0]} material={bot} castShadow>
            <capsuleGeometry args={[0.105, 0.32, 8, 12]} />
          </mesh>
          <mesh position={[0, -0.62, 0]} material={bot} castShadow>
            <sphereGeometry args={[0.09, 10, 10]} />
          </mesh>
          <mesh position={[0, -0.9, 0]} material={bot} castShadow>
            <capsuleGeometry args={[0.082, 0.3, 8, 12]} />
          </mesh>
          <mesh position={[0, -1.15, 0]} material={skin} castShadow>
            <sphereGeometry args={[0.072, 10, 10]} />
          </mesh>
          <mesh position={[0, -1.32, 0.07]} material={shoe} castShadow>
            <boxGeometry args={[0.19, 0.12, 0.34]} />
          </mesh>
          <mesh position={[0, -1.385, 0.07]} material={neon}>
            <boxGeometry args={[0.19, 0.012, 0.34]} />
          </mesh>
        </group>
      </group>

      {/* Ground glow */}
      <mesh position={[0, -0.56, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 32]} />
        <meshBasicMaterial color="#ff0055" opacity={0.06} transparent />
      </mesh>
    </group>
  );
}

// ─── Scene ─────────────────────────────────────────────────────────────────────

function Scene(props: CharacterProps) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 6, 4]} intensity={1.4} castShadow
        shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <pointLight position={[-3, 3, -2]} intensity={0.7} color="#ff0055" />
      <pointLight position={[ 3, 2,  2]} intensity={0.4} color="#e60039" />
      <pointLight position={[ 0, 6,  1]} intensity={0.35} color="#ffffff" />
      <Suspense fallback={null}>
        <HumanoidCharacter {...props} />
        <Environment preset="night" />
      </Suspense>
      <OrbitControls
        enablePan={false}
        minDistance={2.5}
        maxDistance={7}
        maxPolarAngle={Math.PI * 0.82}
        minPolarAngle={Math.PI * 0.1}
        makeDefault
      />
    </>
  );
}

// ─── UI Components ─────────────────────────────────────────────────────────────

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
      <div className="w-7 h-7 rounded-xl flex-shrink-0 border border-white/10 shadow-inner"
        style={{ backgroundColor: opt.color }} />
    )}
    <span className="text-[11px] font-mono font-semibold text-white truncate flex-1">{opt.label}</span>
    {opt.locked && (
      <div className="flex items-center gap-1 text-[9px] font-mono text-red-400 flex-shrink-0">
        <Lock className="w-3 h-3" /><span>{opt.cost?.toLocaleString()}</span>
      </div>
    )}
    {selected && !opt.locked && (
      <div className="w-3.5 h-3.5 rounded-full bg-[#ff0055] flex items-center justify-center flex-shrink-0">
        <div className="w-2 h-2 rounded-full bg-white" />
      </div>
    )}
  </motion.button>
);

const SectionLabel: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center gap-2 mb-3">
    <Sparkles className="w-3 h-3 text-[#ff0055]" />
    <span className="text-[9px] font-mono text-[#ff0055] uppercase tracking-[0.2em]">{text}</span>
    <div className="flex-1 h-px bg-[#ff0055]/20" />
  </div>
);

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function AvatarStudio3D() {
  const router = useRouter();

  // ── Gender ──────────────────────────────────────────────────────────────────
  const [gender, setGender] = useState<Gender>('male');

  // ── Customization State ──────────────────────────────────────────────────────
  const [tone,         setTone]         = useState(BODY_TONES[2]);
  const [faceStructure, setFaceStructure] = useState(FACE_STRUCTURES[0]);
  const [hairStyle,    setHairStyle]    = useState(HAIR_MALE[0]);
  const [hairColor,    setHairColor]    = useState(HAIR_COLORS[0]);
  const [facialHair,   setFacialHair]   = useState(FACIAL_HAIR[0]);
  const [top,          setTop]          = useState(TOP_MALE[0]);
  const [bottom,       setBottom]       = useState(BOTTOM_OPTIONS[0]);
  const [shoes,        setShoes]        = useState(SHOE_OPTIONS[0]);

  const [activeTab, setActiveTab] = useState<Tab>('face');
  const [lockAlert, setLockAlert] = useState<string | null>(null);
  const [isSaving,  setIsSaving]  = useState(false);

  // When gender changes, reset gender-dependent options to first valid choice
  const handleGenderChange = (g: Gender) => {
    setGender(g);
    setHairStyle(g === 'female' ? HAIR_FEMALE[0] : g === 'neutral' ? HAIR_NEUTRAL[0] : HAIR_MALE[0]);
    setTop(g === 'female' ? TOP_FEMALE[0] : g === 'neutral' ? TOP_NEUTRAL[0] : TOP_MALE[0]);
    // Hide facial hair tab when female is selected
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

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => router.push('/dashboard'), 1400);
  };

  // ── Computed tab list (filter Facial Hair for female) ──────────────────────
  const visibleTabs = ALL_TABS.filter(t => !(t.id === 'facial' && gender === 'female'));

  // ── Hair style options by gender ───────────────────────────────────────────
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

          {/* LIVE badge — top-left, away from the model's head */}
          <div className="absolute top-3 left-4 z-10 px-3 py-1.5 rounded-xl bg-black/75 border border-[#ff0055]/30 backdrop-blur-sm flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff0055] animate-pulse" />
            <span className="text-[10px] font-mono text-[#ff0055]/80 tracking-widest uppercase">Live 3D Preview</span>
          </div>

          {/* Corner brackets */}
          <div className="absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 border-[#ff0055]/35 pointer-events-none z-10" />
          <div className="absolute bottom-3 left-3 w-10 h-10 border-b-2 border-l-2 border-[#ff0055]/35 pointer-events-none z-10" />
          <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-[#ff0055]/35 pointer-events-none z-10" />

          {/* Scanlines */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(255,0,85,0.011)_3px,rgba(255,0,85,0.011)_4px)] pointer-events-none z-10" />

          {/* R3F Canvas — camera raised to frame head clearly */}
          <Canvas
            camera={{ position: [0, 1.5, 5], fov: 45 }}
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
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 px-4 py-2 rounded-full bg-black/80 border border-zinc-800/80 backdrop-blur-sm">
            {([
              { label: 'Skin', color: tone.color! },
              { label: 'Hair', color: hairColor.color! },
              { label: 'Top',  color: top.color! },
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

          {/* ── GENDER TOGGLE ── */}
          <div className="p-3 border-b border-zinc-900/60 flex-shrink-0">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Gender</p>
            <div className="flex gap-1 p-1 rounded-xl bg-[#050008] border border-zinc-800">
              {(['male', 'female', 'neutral'] as Gender[]).map(g => (
                <button key={g} onClick={() => handleGenderChange(g)}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wide transition-all cursor-pointer capitalize ${
                    gender === g
                      ? 'bg-[#ff0055] text-white shadow-[0_0_12px_rgba(255,0,85,0.5)]'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* ── TAB BAR ── */}
          <div className="flex flex-col gap-1 p-3 border-b border-zinc-900/60 flex-shrink-0">
            {visibleTabs.map(tab => (
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

          {/* ── OPTION PANEL ── */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <AnimatePresence mode="wait">
              <motion.div key={`${activeTab}-${gender}`}
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.16 }}
                className="space-y-2">

                {/* ── FACE TAB ── */}
                {activeTab === 'face' && (
                  <>
                    <SectionLabel text="Face Structure" />
                    {FACE_STRUCTURES.map(opt => (
                      <SwatchCard key={opt.id} opt={opt}
                        selected={faceStructure.id === opt.id}
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
                  </>
                )}

                {/* ── HAIR TAB ── */}
                {activeTab === 'hair' && (
                  <>
                    <SectionLabel text={`Hair Styles · ${gender}`} />
                    {hairStyleOpts.map(opt => (
                      <SwatchCard key={opt.id} opt={opt}
                        selected={hairStyle.id === opt.id}
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
                  </>
                )}

                {/* ── FACIAL HAIR TAB (hidden for female) ── */}
                {activeTab === 'facial' && gender !== 'female' && (
                  <>
                    <SectionLabel text="Beard & Mustache" />
                    {FACIAL_HAIR.map(opt => (
                      <SwatchCard key={opt.id} opt={opt}
                        selected={facialHair.id === opt.id}
                        onSelect={() => { if (!handleLocked(opt)) setFacialHair(opt); }} />
                    ))}
                  </>
                )}

                {/* ── TOP TAB ── */}
                {activeTab === 'top' && (
                  <>
                    <SectionLabel text={`Jackets & Tops · ${gender}`} />
                    {topOpts.map(opt => (
                      <SwatchCard key={opt.id} opt={opt}
                        selected={top.id === opt.id}
                        onSelect={() => { if (!handleLocked(opt)) setTop(opt); }} />
                    ))}
                  </>
                )}

                {/* ── BOTTOM TAB ── */}
                {activeTab === 'bottom' && (
                  <>
                    <SectionLabel text="Pants & Bottoms" />
                    {BOTTOM_OPTIONS.map(opt => (
                      <SwatchCard key={opt.id} opt={opt}
                        selected={bottom.id === opt.id}
                        onSelect={() => { if (!handleLocked(opt)) setBottom(opt); }} />
                    ))}
                  </>
                )}

                {/* ── SHOES TAB ── */}
                {activeTab === 'shoes' && (
                  <>
                    <SectionLabel text="Footwear" />
                    {SHOE_OPTIONS.map(opt => (
                      <SwatchCard key={opt.id} opt={opt}
                        selected={shoes.id === opt.id}
                        onSelect={() => { if (!handleLocked(opt)) setShoes(opt); }} />
                    ))}
                  </>
                )}

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

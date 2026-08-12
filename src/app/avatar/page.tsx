'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Lock,
  Zap,
  Palette,
  Eye,
  Scissors,
  Shirt,
  Glasses,
  User,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

type Tab = 'structure' | 'eyes' | 'hair' | 'facial' | 'outfit' | 'accessories';

interface StyleOption {
  id: string;
  label: string;
  locked?: boolean;
  cost?: number;
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const SKIN_TONES = [
  { id: 's1', hex: '#FDDBB4', label: 'Porcelain' },
  { id: 's2', hex: '#F5C89A', label: 'Ivory' },
  { id: 's3', hex: '#E8A87C', label: 'Sand' },
  { id: 's4', hex: '#C68642', label: 'Honey' },
  { id: 's5', hex: '#8D5524', label: 'Caramel' },
  { id: 's6', hex: '#4A2912', label: 'Espresso' },
];

const FACE_STRUCTURES: StyleOption[] = [
  { id: 'f1', label: 'Oval' },
  { id: 'f2', label: 'Round' },
  { id: 'f3', label: 'Square' },
  { id: 'f4', label: 'Heart' },
  { id: 'f5', label: 'Diamond', locked: true, cost: 500 },
];

const BODY_BUILDS: StyleOption[] = [
  { id: 'bb1', label: 'Slim' },
  { id: 'bb2', label: 'Athletic' },
  { id: 'bb3', label: 'Broad' },
];

const EYE_STYLES: StyleOption[] = [
  { id: 'e1', label: 'Round' },
  { id: 'e2', label: 'Almond' },
  { id: 'e3', label: 'Cat-Eye' },
  { id: 'e4', label: 'Sleepy' },
  { id: 'e5', label: 'Wide', locked: true, cost: 800 },
  { id: 'e6', label: 'Star', locked: true, cost: 1500 },
];

const EYE_COLORS = [
  { id: 'ec1', hex: '#3B2314', label: 'Dark Brown' },
  { id: 'ec2', hex: '#6F4E37', label: 'Warm Brown' },
  { id: 'ec3', hex: '#6B8E23', label: 'Olive' },
  { id: 'ec4', hex: '#228B22', label: 'Forest' },
  { id: 'ec5', hex: '#4169E1', label: 'Royal' },
  { id: 'ec6', hex: '#00CED1', label: 'Teal' },
  { id: 'ec7', hex: '#C0392B', label: 'Crimson' },
  { id: 'ec8', hex: '#8B008B', label: 'Violet' },
];

const BROW_STYLES: StyleOption[] = [
  { id: 'b1', label: 'Soft Arch' },
  { id: 'b2', label: 'Straight' },
  { id: 'b3', label: 'High Arch' },
  { id: 'b4', label: 'Thick', locked: true, cost: 600 },
];

const HAIR_STYLES: StyleOption[] = [
  { id: 'h1', label: 'Short Wavy' },
  { id: 'h2', label: 'Long Straight' },
  { id: 'h3', label: 'Curly Afro' },
  { id: 'h4', label: 'Side Swept' },
  { id: 'h5', label: 'Ponytail' },
  { id: 'h6', label: 'Buzz Cut' },
  { id: 'h9', label: 'Messy Fringe' },
  { id: 'h10', label: 'Slicked Back' },
  { id: 'h7', label: 'Space Buns', locked: true, cost: 1200 },
  { id: 'h11', label: 'Cyber Braids', locked: true, cost: 1400 },
  { id: 'h8', label: 'Mohawk', locked: true, cost: 2000 },
];

const HAIR_COLORS = [
  { id: 'hc1', hex: '#1a0a00', label: 'Jet Black' },
  { id: 'hc2', hex: '#3B1F0A', label: 'Dark Brown' },
  { id: 'hc3', hex: '#8B4513', label: 'Auburn' },
  { id: 'hc4', hex: '#D2691E', label: 'Copper' },
  { id: 'hc5', hex: '#DAA520', label: 'Honey Blonde' },
  { id: 'hc6', hex: '#F5DEB3', label: 'Platinum' },
  { id: 'hc7', hex: '#ff0055', label: 'Neon Red' },
  { id: 'hc8', hex: '#a855f7', label: 'Violet' },
  { id: 'hc9', hex: '#06b6d4', label: 'Cyber Teal' },
  { id: 'hc10', hex: '#22c55e', label: 'Neon Green' },
];

const HIGHLIGHT_COLORS = [
  { id: 'hi0', hex: 'none', label: 'None' },
  { id: 'hi1', hex: '#ff0055', label: 'Crimson' },
  { id: 'hi2', hex: '#a855f7', label: 'Violet' },
  { id: 'hi3', hex: '#06b6d4', label: 'Cyber Teal' },
  { id: 'hi4', hex: '#ffd700', label: 'Gold' },
  { id: 'hi5', hex: '#22c55e', label: 'Neon Green' },
  { id: 'hi6', hex: '#F5DEB3', label: 'Platinum' },
];

// ─── Facial Hair Data ──────────────────────────────────────────────────────────

const BEARD_STYLES: StyleOption[] = [
  { id: 'fd0', label: 'Clean Shaven' },
  { id: 'fd1', label: 'Stubble' },
  { id: 'fd2', label: 'Full Beard' },
  { id: 'fd3', label: 'Goatee' },
  { id: 'fd4', label: 'Chin Strap' },
  { id: 'fd5', label: 'Viking Beard', locked: true, cost: 1000 },
];

const MUSTACHE_STYLES: StyleOption[] = [
  { id: 'ms0', label: 'None' },
  { id: 'ms1', label: 'Thin Line' },
  { id: 'ms2', label: 'Handlebar' },
  { id: 'ms3', label: 'Chevron' },
  { id: 'ms4', label: 'Fu Manchu', locked: true, cost: 800 },
];

// ─── Outfit & Accessory Data ───────────────────────────────────────────────────

const TOP_STYLES: StyleOption[] = [
  { id: 'o1', label: 'Cyber Tee' },
  { id: 'o2', label: 'Hoodie' },
  { id: 'o4', label: 'Tactical Vest' },
  { id: 'o7', label: 'Cyber Suit' },
  { id: 'o8', label: 'Streetwear' },
];

const OUTERWEAR_STYLES: StyleOption[] = [
  { id: 'ow0', label: 'None' },
  { id: 'o3', label: 'Trench Coat' },
  { id: 'o5', label: 'Neon Jacket', locked: true, cost: 1800 },
  { id: 'o9', label: 'Techwear', locked: true, cost: 2200 },
  { id: 'o6', label: 'Vanguard Armor', locked: true, cost: 3500 },
];

const VISOR_STYLES: StyleOption[] = [
  { id: 'v0', label: 'None' },
  { id: 'a2', label: 'Cat-Eye Shades' },
  { id: 'a3', label: 'Round Glasses' },
  { id: 'v1', label: 'VR Visor', locked: true, cost: 1200 },
  { id: 'v2', label: 'HUD Lens', locked: true, cost: 2500 },
];

const MASK_STYLES: StyleOption[] = [
  { id: 'm0', label: 'None' },
  { id: 'm1', label: 'LED Half-Mask' },
  { id: 'm2', label: 'Squid Circle', locked: true, cost: 2000 },
  { id: 'm3', label: 'Oni Mask', locked: true, cost: 3000 },
];

const HEADWEAR_STYLES: StyleOption[] = [
  { id: 'hw0', label: 'None' },
  { id: 'a4', label: 'Snapback Cap' },
  { id: 'a5', label: 'Beanie' },
  { id: 'hw1', label: 'Tactical Hood', locked: true, cost: 900 },
  { id: 'a6', label: 'Holo Tag', locked: true, cost: 900 },
  { id: 'a7', label: 'Neon Crown', locked: true, cost: 4000 },
];

const TECH_GEAR: StyleOption[] = [
  { id: 'tg0', label: 'None' },
  { id: 'tg1', label: 'Shoulder Pad' },
  { id: 'tg2', label: 'Cyber Arm Band' },
  { id: 'tg3', label: 'Holo Bracelet', locked: true, cost: 1100 },
  { id: 'tg4', label: 'Neural Spike', locked: true, cost: 2800 },
];

// ─── SVG Color Utilities ───────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}
function darken(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}
function lighten(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount);
}

// ─── SVG Sub-Layers ────────────────────────────────────────────────────────────

const EyeLayer: React.FC<{ style: string; eyeColor: string }> = ({ style, eyeColor }) => {
  const white = '#ffffff';
  const pupil = darken(eyeColor, 0.4);
  if (style === 'e1') return (
    <g>
      <ellipse cx="80" cy="108" rx="12" ry="12" fill={white} />
      <ellipse cx="120" cy="108" rx="12" ry="12" fill={white} />
      <ellipse cx="81" cy="108" rx="7" ry="7" fill={eyeColor} />
      <ellipse cx="121" cy="108" rx="7" ry="7" fill={eyeColor} />
      <ellipse cx="81" cy="108" rx="4" ry="4" fill={pupil} />
      <ellipse cx="121" cy="108" rx="4" ry="4" fill={pupil} />
      <circle cx="83" cy="105" r="2" fill={white} opacity="0.9" />
      <circle cx="123" cy="105" r="2" fill={white} opacity="0.9" />
      <path d="M68 100 Q80 96 92 100" stroke="#1a0a00" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M108 100 Q120 96 132 100" stroke="#1a0a00" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </g>
  );
  if (style === 'e2') return (
    <g>
      <path d="M68 108 Q80 98 92 108 Q80 118 68 108Z" fill={white} />
      <path d="M108 108 Q120 98 132 108 Q120 118 108 108Z" fill={white} />
      <ellipse cx="80" cy="108" rx="6" ry="7" fill={eyeColor} />
      <ellipse cx="120" cy="108" rx="6" ry="7" fill={eyeColor} />
      <ellipse cx="80" cy="108" rx="3.5" ry="4" fill={pupil} />
      <ellipse cx="120" cy="108" rx="3.5" ry="4" fill={pupil} />
      <circle cx="82" cy="105" r="1.8" fill={white} opacity="0.9" />
      <circle cx="122" cy="105" r="1.8" fill={white} opacity="0.9" />
      <path d="M68 108 Q80 98 92 108" stroke="#1a0a00" strokeWidth="2" fill="none" />
      <path d="M108 108 Q120 98 132 108" stroke="#1a0a00" strokeWidth="2" fill="none" />
    </g>
  );
  if (style === 'e3') return (
    <g>
      <path d="M67 110 Q80 96 93 106 Q88 115 70 114Z" fill={white} />
      <path d="M107 110 Q120 96 133 106 Q128 115 110 114Z" fill={white} />
      <ellipse cx="80" cy="106" rx="6" ry="6.5" fill={eyeColor} />
      <ellipse cx="120" cy="106" rx="6" ry="6.5" fill={eyeColor} />
      <ellipse cx="80" cy="106" rx="3.5" ry="3.8" fill={pupil} />
      <ellipse cx="120" cy="106" rx="3.5" ry="3.8" fill={pupil} />
      <circle cx="82" cy="104" r="1.8" fill={white} opacity="0.9" />
      <circle cx="122" cy="104" r="1.8" fill={white} opacity="0.9" />
      <path d="M67 110 Q80 96 93 106" stroke="#1a0a00" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M107 110 Q120 96 133 106" stroke="#1a0a00" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <line x1="93" y1="106" x2="96" y2="101" stroke="#1a0a00" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="107" y1="106" x2="104" y2="101" stroke="#1a0a00" strokeWidth="1.8" strokeLinecap="round" />
    </g>
  );
  if (style === 'e4') return (
    <g>
      <ellipse cx="80" cy="112" rx="7" ry="5" fill={white} />
      <ellipse cx="120" cy="112" rx="7" ry="5" fill={white} />
      <ellipse cx="80" cy="112" rx="4.5" ry="3.5" fill={eyeColor} />
      <ellipse cx="120" cy="112" rx="4.5" ry="3.5" fill={eyeColor} />
      <ellipse cx="80" cy="112" rx="2.5" ry="2" fill={pupil} />
      <ellipse cx="120" cy="112" rx="2.5" ry="2" fill={pupil} />
      <path d="M68 112 Q80 102 92 112" stroke="#1a0a00" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M108 112 Q120 102 132 112" stroke="#1a0a00" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </g>
  );
  if (style === 'e5') return (
    <g>
      <ellipse cx="80" cy="107" rx="14" ry="14" fill={white} />
      <ellipse cx="120" cy="107" rx="14" ry="14" fill={white} />
      <ellipse cx="80" cy="107" rx="9" ry="9" fill={eyeColor} />
      <ellipse cx="120" cy="107" rx="9" ry="9" fill={eyeColor} />
      <ellipse cx="80" cy="107" rx="5" ry="5" fill={pupil} />
      <ellipse cx="120" cy="107" rx="5" ry="5" fill={pupil} />
      <circle cx="82.5" cy="104" r="2.5" fill={white} opacity="0.9" />
      <circle cx="122.5" cy="104" r="2.5" fill={white} opacity="0.9" />
      <path d="M66 95 Q80 90 94 95" stroke="#1a0a00" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M106 95 Q120 90 134 95" stroke="#1a0a00" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </g>
  );
  if (style === 'e6') return (
    <g>
      <ellipse cx="80" cy="108" rx="12" ry="12" fill={white} />
      <ellipse cx="120" cy="108" rx="12" ry="12" fill={white} />
      <polygon points="80,99 82,106 89,106 83.5,110.5 85.5,117.5 80,113 74.5,117.5 76.5,110.5 71,106 78,106" fill={eyeColor} />
      <polygon points="120,99 122,106 129,106 123.5,110.5 125.5,117.5 120,113 114.5,117.5 116.5,110.5 111,106 118,106" fill={eyeColor} />
      <circle cx="82" cy="105" r="2" fill={white} opacity="0.9" />
      <circle cx="122" cy="105" r="2" fill={white} opacity="0.9" />
    </g>
  );
  return null;
};

const BrowLayer: React.FC<{ style: string; hairColor: string }> = ({ style, hairColor }) => {
  const brow = hairColor === '#F5DEB3' ? '#8B6914' : darken(hairColor, 0.1);
  if (style === 'b1') return <g><path d="M68 95 Q80 88 92 93" stroke={brow} strokeWidth="3" fill="none" strokeLinecap="round" /><path d="M108 93 Q120 88 132 95" stroke={brow} strokeWidth="3" fill="none" strokeLinecap="round" /></g>;
  if (style === 'b2') return <g><line x1="68" y1="92" x2="92" y2="92" stroke={brow} strokeWidth="3" strokeLinecap="round" /><line x1="108" y1="92" x2="132" y2="92" stroke={brow} strokeWidth="3" strokeLinecap="round" /></g>;
  if (style === 'b3') return <g><path d="M68 97 Q80 84 92 94" stroke={brow} strokeWidth="3" fill="none" strokeLinecap="round" /><path d="M108 94 Q120 84 132 97" stroke={brow} strokeWidth="3" fill="none" strokeLinecap="round" /></g>;
  if (style === 'b4') return <g><path d="M67 95 Q80 87 93 93" stroke={brow} strokeWidth="5" fill="none" strokeLinecap="round" /><path d="M107 93 Q120 87 133 95" stroke={brow} strokeWidth="5" fill="none" strokeLinecap="round" /></g>;
  return null;
};

const HairLayer: React.FC<{ style: string; hairColor: string; highlightColor: string }> = ({ style, hairColor, highlightColor }) => {
  const shadow = darken(hairColor, 0.2);
  const highlight = lighten(hairColor, 0.15);
  const accentHL = highlightColor !== 'none' ? highlightColor : highlight;

  if (style === 'h1') return <g><path d="M45 105 Q44 72 60 57 Q80 42 100 42 Q120 42 140 57 Q156 72 155 105 Q148 88 140 78 Q125 52 100 50 Q75 52 60 78 Q52 88 45 105Z" fill={hairColor} /><path d="M45 105 Q50 80 60 68 Q75 54 100 52 Q125 54 140 68 Q150 80 155 105" fill="none" stroke={accentHL} strokeWidth="1.5" opacity="0.55" /><path d="M46 100 Q52 95 58 100 Q64 105 70 100" stroke={shadow} strokeWidth="1.2" fill="none" opacity="0.6" /></g>;
  if (style === 'h2') return <g><path d="M45 105 Q44 72 60 57 Q80 42 100 42 Q120 42 140 57 Q156 72 155 105 Q148 88 140 78 Q125 52 100 50 Q75 52 60 78 Q52 88 45 105Z" fill={hairColor} /><rect x="44" y="98" width="18" height="90" rx="9" fill={hairColor} /><rect x="138" y="98" width="18" height="90" rx="9" fill={hairColor} /><line x1="50" y1="100" x2="52" y2="185" stroke={accentHL} strokeWidth="1" opacity="0.55" /><line x1="148" y1="100" x2="150" y2="185" stroke={accentHL} strokeWidth="1" opacity="0.55" /></g>;
  if (style === 'h3') return <g><circle cx="100" cy="62" r="48" fill={hairColor} />{[[68,52],[80,42],[95,36],[112,40],[128,52],[140,64],[138,78],[62,68],[100,32],[115,30]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r="9" fill={shadow} opacity="0.3" />)}<circle cx="100" cy="62" r="44" fill="none" stroke={accentHL} strokeWidth="1.5" opacity="0.3" /></g>;
  if (style === 'h4') return <g><path d="M45 105 Q44 72 60 57 Q80 42 100 42 Q120 42 140 57 Q156 72 155 105 Q148 88 140 78 Q125 52 100 50 Q75 52 60 78 Q52 88 45 105Z" fill={hairColor} /><path d="M56 75 Q80 55 130 62 Q110 48 100 46 Q75 48 56 75Z" fill={shadow} opacity="0.4" /><path d="M56 75 Q80 58 128 64" stroke={accentHL} strokeWidth="1.5" fill="none" opacity="0.55" /></g>;
  if (style === 'h5') return <g><path d="M45 105 Q44 72 60 57 Q80 42 100 42 Q120 42 140 57 Q156 72 155 105 Q148 88 140 78 Q125 52 100 50 Q75 52 60 78 Q52 88 45 105Z" fill={hairColor} /><ellipse cx="100" cy="52" rx="8" ry="6" fill={shadow} /><path d="M96 52 Q88 40 92 20 Q96 10 100 8 Q104 10 108 20 Q112 40 104 52Z" fill={hairColor} /><line x1="100" y1="48" x2="100" y2="12" stroke={accentHL} strokeWidth="1.2" opacity="0.55" /></g>;
  if (style === 'h6') return <g><path d="M45 108 Q44 78 62 62 Q80 46 100 46 Q120 46 138 62 Q156 78 155 108 Q150 92 140 82 Q125 56 100 54 Q75 56 60 82 Q50 92 45 108Z" fill={hairColor} />{[55,65,75,85,95,105,115,125,135,145].map((x,i)=><line key={i} x1={x} y1={i%2===0?58:62} x2={x} y2={i%2===0?53:56} stroke={shadow} strokeWidth="1" opacity="0.5" />)}</g>;
  if (style === 'h7') return <g><path d="M45 105 Q44 72 60 57 Q80 42 100 42 Q120 42 140 57 Q156 72 155 105 Q148 88 140 78 Q125 52 100 50 Q75 52 60 78 Q52 88 45 105Z" fill={hairColor} /><circle cx="74" cy="48" r="18" fill={hairColor} /><circle cx="126" cy="48" r="18" fill={hairColor} /><circle cx="74" cy="48" r="12" fill={shadow} opacity="0.35" /><circle cx="126" cy="48" r="12" fill={shadow} opacity="0.35" /><circle cx="72" cy="44" r="5" fill={accentHL} opacity="0.4" /><circle cx="124" cy="44" r="5" fill={accentHL} opacity="0.4" /></g>;
  if (style === 'h8') return <g><path d="M45 105 Q44 72 60 57 Q80 42 100 42 Q120 42 140 57 Q156 72 155 105 Q148 88 140 78 Q125 52 100 50 Q75 52 60 78 Q52 88 45 105Z" fill={hairColor} /><path d="M92 46 Q96 10 100 5 Q104 10 108 46Z" fill={accentHL || hairColor} /><line x1="100" y1="46" x2="100" y2="8" stroke={accentHL} strokeWidth="1.5" opacity="0.6" /></g>;
  if (style === 'h9') return <g><path d="M45 105 Q44 72 60 57 Q80 42 100 42 Q120 42 140 57 Q156 72 155 105 Q148 88 140 78 Q125 52 100 50 Q75 52 60 78 Q52 88 45 105Z" fill={hairColor} /><path d="M50 70 Q70 60 90 85 Q110 60 130 75" stroke={shadow} strokeWidth="2" fill="none" opacity="0.5" /><path d="M55 75 Q75 55 95 90 Q120 50 145 80" stroke={accentHL} strokeWidth="1.5" fill="none" opacity="0.6" /></g>;
  if (style === 'h10') return <g><path d="M45 105 Q44 72 60 57 Q80 45 100 45 Q120 45 140 57 Q156 72 155 105 Q150 92 140 82 Q125 56 100 54 Q75 56 60 82 Q50 92 45 108Z" fill={hairColor} /><path d="M60 60 Q80 48 100 50 Q120 48 140 60" stroke={accentHL} strokeWidth="2" fill="none" opacity="0.55" /></g>;
  if (style === 'h11') return <g><path d="M45 105 Q44 72 60 57 Q80 42 100 42 Q120 42 140 57 Q156 72 155 105 Q148 88 140 78 Q125 52 100 50 Q75 52 60 78 Q52 88 45 105Z" fill={hairColor} /><path d="M55 95 Q50 130 55 170" stroke={hairColor} strokeWidth="12" fill="none" strokeDasharray="6 2" /><path d="M145 95 Q150 130 145 170" stroke={hairColor} strokeWidth="12" fill="none" strokeDasharray="6 2" /><line x1="48" y1="160" x2="62" y2="160" stroke={accentHL} strokeWidth="3" /><line x1="138" y1="160" x2="152" y2="160" stroke={accentHL} strokeWidth="3" /></g>;
  return null;
};

// ─── Facial Hair SVG Layer ─────────────────────────────────────────────────────

const FacialHairLayer: React.FC<{ beardStyle: string; mustacheStyle: string; skinColor: string }> = ({ beardStyle, mustacheStyle, skinColor }) => {
  const shadow = darken(skinColor, 0.35);
  return (
    <g>
      {/* Beard */}
      {beardStyle === 'fd1' && ( // Stubble
        <g opacity="0.55">
          {[84,90,96,102,108,114].map((x,i)=><circle key={i} cx={x} cy={137+Math.sin(i)*2} r="1.2" fill={shadow} />)}
          {[80,88,96,104,112].map((x,i)=><circle key={i} cx={x} cy={143} r="1.2" fill={shadow} />)}
          {[76,86,100,114].map((x,i)=><circle key={i} cx={x} cy={150} r="1.2" fill={shadow} />)}
        </g>
      )}
      {beardStyle === 'fd2' && ( // Full Beard
        <path d="M68 135 Q70 130 80 130 Q100 128 120 130 Q130 130 132 135 Q138 155 134 165 Q118 178 100 180 Q82 178 66 165 Q62 155 68 135Z" fill={shadow} opacity="0.65" />
      )}
      {beardStyle === 'fd3' && ( // Goatee
        <g>
          <path d="M88 140 Q100 137 112 140 Q108 155 100 160 Q92 155 88 140Z" fill={shadow} opacity="0.65" />
        </g>
      )}
      {beardStyle === 'fd4' && ( // Chin Strap
        <g>
          <path d="M55 125 Q55 110 65 108 Q68 130 65 155 Q62 165 68 170" stroke={shadow} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.65" />
          <path d="M145 125 Q145 110 135 108 Q132 130 135 155 Q138 165 132 170" stroke={shadow} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.65" />
          <path d="M68 170 Q100 178 132 170" stroke={shadow} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.65" />
        </g>
      )}
      {beardStyle === 'fd5' && ( // Viking Beard
        <g>
          <path d="M62 130 Q65 128 75 130 Q100 126 125 130 Q135 128 138 130 Q145 155 142 175 Q120 195 100 200 Q80 195 58 175 Q55 155 62 130Z" fill={shadow} opacity="0.6" />
          {/* Braids */}
          <path d="M75 175 Q72 185 75 200" stroke={shadow} strokeWidth="5" fill="none" strokeDasharray="4 2" />
          <path d="M125 175 Q128 185 125 200" stroke={shadow} strokeWidth="5" fill="none" strokeDasharray="4 2" />
        </g>
      )}

      {/* Mustache */}
      {mustacheStyle === 'ms1' && ( // Thin Line
        <path d="M86 132 Q100 130 114 132" stroke={shadow} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8" />
      )}
      {mustacheStyle === 'ms2' && ( // Handlebar
        <g opacity="0.8">
          <path d="M87 131 Q100 128 113 131 Q110 136 100 134 Q90 136 87 131Z" fill={shadow} />
          <path d="M87 131 Q82 128 76 133" stroke={shadow} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M113 131 Q118 128 124 133" stroke={shadow} strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      )}
      {mustacheStyle === 'ms3' && ( // Chevron
        <path d="M84 130 Q100 135 116 130 Q108 138 100 136 Q92 138 84 130Z" fill={shadow} opacity="0.75" />
      )}
      {mustacheStyle === 'ms4' && ( // Fu Manchu
        <g opacity="0.75">
          <path d="M87 131 Q100 128 113 131 Q110 136 100 134 Q90 136 87 131Z" fill={shadow} />
          <path d="M87 131 Q78 136 72 158" stroke={shadow} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M113 131 Q122 136 128 158" stroke={shadow} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
};

const OutfitLayer: React.FC<{ style: string; skinColor: string }> = ({ style, skinColor }) => {
  const outfitColors: Record<string, { main: string; accent: string }> = {
    o1: { main: '#1a0a1a', accent: '#ff0055' },
    o2: { main: '#2d0d2d', accent: '#e60039' },
    o3: { main: '#0d0d18', accent: '#ff0055' },
    o4: { main: '#18181b', accent: '#ff0055' },
    o5: { main: '#0d1a2d', accent: '#00d4ff' },
    o6: { main: '#1a0a00', accent: '#ffd700' },
    o7: { main: '#101015', accent: '#00d4ff' },
    o8: { main: '#333333', accent: '#ff4400' },
    o9: { main: '#1a1a24', accent: '#00ff66' },
    ow0: { main: 'transparent', accent: 'transparent' },
  };
  const { main, accent } = outfitColors[style] || outfitColors.o1;
  if (style === 'ow0') return null;
  if (style === 'o1') return <g><path d="M30 240 L30 185 Q40 172 60 168 L80 165 Q90 175 100 178 Q110 175 120 165 L140 168 Q160 172 170 185 L170 240Z" fill={main} /><line x1="30" y1="210" x2="170" y2="210" stroke={accent} strokeWidth="2" opacity="0.7" /><text x="100" y="198" textAnchor="middle" fontSize="9" fill={accent} fontFamily="monospace" fontWeight="bold">CYBER</text><path d="M82 165 Q100 172 118 165" fill="none" stroke={accent} strokeWidth="1.5" /></g>;
  if (style === 'o2') return <g><path d="M26 240 L26 182 Q36 165 60 162 L78 162 Q88 172 100 175 Q112 172 122 162 L140 162 Q164 165 174 182 L174 240Z" fill={main} /><path d="M62 162 Q100 158 138 162 Q120 148 100 146 Q80 148 62 162Z" fill={darken(main, 0.1)} /><rect x="82" y="205" width="36" height="20" rx="4" fill={darken(main, 0.15)} /><line x1="100" y1="205" x2="100" y2="225" stroke={accent} strokeWidth="1" opacity="0.5" /></g>;
  if (style === 'o3') return <g><path d="M22 240 L22 180 Q32 162 58 158 L76 158 Q88 170 100 173 Q112 170 124 158 L142 158 Q168 162 178 180 L178 240Z" fill={main} /><path d="M78 158 L68 175 L82 180 L100 168Z" fill={darken(main, 0.2)} /><path d="M122 158 L132 175 L118 180 L100 168Z" fill={darken(main, 0.2)} />{[185,198,211,224].map((y,i)=><circle key={i} cx="100" cy={y} r="2.5" fill={accent} opacity="0.8" />)}</g>;
  if (style === 'o4') return <g><path d="M28 240 L28 184 Q38 168 62 164 L80 162 Q90 172 100 175 Q110 172 120 162 L138 164 Q162 168 172 184 L172 240Z" fill={main} /><rect x="60" y="178" width="28" height="50" rx="3" fill={darken(main, 0.3)} opacity="0.8" /><rect x="112" y="178" width="28" height="50" rx="3" fill={darken(main, 0.3)} opacity="0.8" /><rect x="65" y="192" width="18" height="6" rx="2" fill={accent} opacity="0.8" /><rect x="117" y="192" width="18" height="6" rx="2" fill={accent} opacity="0.8" /></g>;
  if (style === 'o5') return <g><path d="M26 240 L26 182 Q36 165 60 162 L78 160 Q88 172 100 175 Q112 172 122 160 L140 162 Q164 165 174 182 L174 240Z" fill={main} /><path d="M60 162 L26 182" stroke={accent} strokeWidth="2.5" opacity="0.9" /><path d="M140 162 L174 182" stroke={accent} strokeWidth="2.5" opacity="0.9" /><path d="M78 160 L100 175 L122 160" stroke={accent} strokeWidth="2" opacity="0.7" /></g>;
  if (style === 'o6') return <g><path d="M24 240 L24 180 Q34 160 58 156 L76 154 Q88 168 100 172 Q112 168 124 154 L142 156 Q166 160 176 180 L176 240Z" fill={main} /><ellipse cx="48" cy="168" rx="22" ry="14" fill={darken(main, 0.2)} /><ellipse cx="152" cy="168" rx="22" ry="14" fill={darken(main, 0.2)} /><ellipse cx="48" cy="166" rx="14" ry="8" fill={accent} opacity="0.6" /><ellipse cx="152" cy="166" rx="14" ry="8" fill={accent} opacity="0.6" /><path d="M76 154 Q100 160 124 154 L118 200 L100 205 L82 200Z" fill={darken(main, 0.15)} /><circle cx="100" cy="178" r="6" fill={accent} opacity="0.7" /></g>;
  if (style === 'o7') return <g><path d="M28 240 L28 180 Q38 165 62 162 L80 160 Q90 172 100 175 Q110 172 120 160 L138 162 Q162 165 172 180 L172 240Z" fill={main} /><path d="M90 185 L110 185 L120 200 L110 215 L90 215 L80 200 Z" fill={darken(main, 0.2)} /><path d="M90 185 L110 185 L120 200 L110 215 L90 215 L80 200 Z" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.8" /></g>;
  if (style === 'o8') return <g><path d="M22 240 L22 182 Q32 165 58 162 L78 160 Q88 172 100 175 Q112 172 122 160 L142 162 Q168 165 178 182 L178 240Z" fill={main} /><text x="100" y="200" textAnchor="middle" fontSize="14" fill={accent} fontFamily="sans-serif" fontWeight="900" transform="rotate(-5 100 200)" opacity="0.8">URBAN</text></g>;
  if (style === 'o9') return <g><path d="M25 240 L25 180 Q35 162 60 158 L80 156 Q90 170 100 172 Q110 170 120 156 L140 158 Q165 162 175 180 L175 240Z" fill={main} /><line x1="60" y1="160" x2="140" y2="210" stroke={darken(main, 0.3)} strokeWidth="8" /><line x1="140" y1="160" x2="60" y2="210" stroke={darken(main, 0.3)} strokeWidth="8" /><circle cx="100" cy="185" r="8" fill={accent} opacity="0.9" /></g>;
  return null;
};

const AccessoryLayer: React.FC<{ visor: string; mask: string; headwear: string; techGear: string; hairColor: string }> = ({
  visor, mask, headwear, techGear, hairColor
}) => {
  return (
    <g>
      {/* Headwear */}
      {headwear === 'a4' && <g><path d="M44 75 Q44 52 60 42 Q80 30 100 30 Q120 30 140 42 Q156 52 156 75 L44 75Z" fill={hairColor} /><path d="M38 75 L162 75 L156 82 L44 82Z" fill={darken(hairColor, 0.2)} /><line x1="100" y1="30" x2="100" y2="75" stroke={darken(hairColor, 0.25)} strokeWidth="1.5" /><rect x="86" y="56" width="28" height="14" rx="4" fill={darken(hairColor, 0.15)} /><text x="100" y="66" textAnchor="middle" fontSize="7" fill="#ff0055" fontFamily="monospace" fontWeight="bold">CE</text></g>}
      {headwear === 'a5' && <g><path d="M44 80 Q44 48 62 38 Q80 28 100 28 Q120 28 138 38 Q156 48 156 80 L44 80Z" fill={hairColor} /><path d="M44 80 L156 80 L156 90 L44 90Z" fill={darken(hairColor, 0.2)} /><circle cx="100" cy="32" r="10" fill={lighten(hairColor, 0.15)} /></g>}
      {headwear === 'a6' && <g><rect x="118" y="92" width="36" height="18" rx="9" fill="#ff0055" opacity="0.9" /><text x="136" y="104" textAnchor="middle" fontSize="7" fill="#ffffff" fontFamily="monospace" fontWeight="bold">HOLO</text><line x1="118" y1="101" x2="108" y2="104" stroke="#ff0055" strokeWidth="1.2" /></g>}
      {headwear === 'a7' && <g><path d="M56 68 L62 45 L80 62 L100 35 L120 62 L138 45 L144 68 Z" fill="#ffd700" /><circle cx="80" cy="62" r="5" fill="#ff0055" /><circle cx="100" cy="52" r="6" fill="#ff0055" /><circle cx="120" cy="62" r="5" fill="#ff0055" /></g>}
      {headwear === 'hw1' && <g><path d="M44 100 Q44 60 62 45 Q80 30 100 30 Q120 30 138 45 Q156 60 156 100 Q144 80 130 70 Q115 55 100 52 Q85 55 70 70 Q56 80 44 100Z" fill={darken(hairColor, 0.3)} /><path d="M44 100 Q55 75 70 65 Q86 52 100 50 Q114 52 130 65 Q145 75 156 100" stroke="#ff0055" strokeWidth="1.5" fill="none" opacity="0.6" /></g>}

      {/* Visor */}
      {visor === 'a2' && <g><path d="M66 106 Q80 98 94 106 Q80 114 66 106Z" fill="#1a0a00" opacity="0.85" /><path d="M106 106 Q120 98 134 106 Q120 114 106 106Z" fill="#1a0a00" opacity="0.85" /><path d="M66 106 Q80 98 94 106" stroke="#ff0055" strokeWidth="1.5" fill="none" /><path d="M106 106 Q120 98 134 106" stroke="#ff0055" strokeWidth="1.5" fill="none" /><line x1="94" y1="106" x2="106" y2="106" stroke="#ff0055" strokeWidth="1.5" /><line x1="66" y1="106" x2="50" y2="110" stroke="#ff0055" strokeWidth="1.5" strokeLinecap="round" /><line x1="134" y1="106" x2="150" y2="110" stroke="#ff0055" strokeWidth="1.5" strokeLinecap="round" /></g>}
      {visor === 'a3' && <g><circle cx="80" cy="108" r="13" fill="none" stroke="#ff0055" strokeWidth="2" /><circle cx="120" cy="108" r="13" fill="none" stroke="#ff0055" strokeWidth="2" /><circle cx="80" cy="108" r="11" fill="#000000" opacity="0.3" /><circle cx="120" cy="108" r="11" fill="#000000" opacity="0.3" /><line x1="93" y1="107" x2="107" y2="107" stroke="#ff0055" strokeWidth="1.8" /></g>}
      {visor === 'v1' && <g><rect x="58" y="96" width="84" height="26" rx="13" fill="#000" opacity="0.9" /><rect x="58" y="96" width="84" height="26" rx="13" fill="none" stroke="#ff0055" strokeWidth="1.5" /><line x1="100" y1="96" x2="100" y2="122" stroke="#ff0055" strokeWidth="0.8" opacity="0.6" />{[70,85,115,130].map((x,i)=><rect key={i} x={x-5} y="101" width="10" height="16" rx="2" fill="#ff0055" opacity="0.15" />)}<text x="100" y="114" textAnchor="middle" fontSize="6" fill="#ff0055" fontFamily="monospace" opacity="0.8">VR//VISOR</text></g>}
      {visor === 'v2' && <g><ellipse cx="80" cy="105" rx="14" ry="8" fill="#000" opacity="0.7" /><ellipse cx="120" cy="105" rx="14" ry="8" fill="#000" opacity="0.7" /><ellipse cx="80" cy="105" rx="14" ry="8" fill="none" stroke="#ff0055" strokeWidth="1" /><ellipse cx="120" cy="105" rx="14" ry="8" fill="none" stroke="#ff0055" strokeWidth="1" /><line x1="94" y1="105" x2="106" y2="105" stroke="#ff0055" strokeWidth="1" /><text x="80" y="108" textAnchor="middle" fontSize="5" fill="#ff0055" fontFamily="monospace">HUD</text><text x="120" y="108" textAnchor="middle" fontSize="5" fill="#ff0055" fontFamily="monospace">HUD</text></g>}

      {/* Mask */}
      {mask === 'm1' && <g><path d="M72 128 Q100 124 128 128 L126 145 Q100 150 74 145Z" fill="#111" opacity="0.9" /><path d="M72 128 Q100 124 128 128 L126 145 Q100 150 74 145Z" fill="none" stroke="#ff0055" strokeWidth="1.2" />{[80,90,100,110,120].map((x,i)=><line key={i} x1={x} y1="128" x2={x} y2="145" stroke="#ff0055" strokeWidth="0.8" opacity="0.4" />)}</g>}
      {mask === 'm2' && <g><circle cx="100" cy="138" r="18" fill="#000" opacity="0.85" /><circle cx="100" cy="138" r="18" fill="none" stroke="#ff0055" strokeWidth="2" /><circle cx="100" cy="138" r="10" fill="none" stroke="#ff0055" strokeWidth="1" opacity="0.5" /></g>}
      {mask === 'm3' && <g><path d="M68 130 Q100 118 132 130 L130 160 Q114 172 100 175 Q86 172 70 160Z" fill="#1a0000" opacity="0.9" /><path d="M68 130 Q100 118 132 130" stroke="#ff0055" strokeWidth="2" fill="none" /><path d="M80 135 Q100 128 120 135" stroke="#ff0055" strokeWidth="1" fill="none" opacity="0.6" />{/* Eye slots */}<ellipse cx="84" cy="138" rx="8" ry="5" fill="#ff0055" opacity="0.25" /><ellipse cx="116" cy="138" rx="8" ry="5" fill="#ff0055" opacity="0.25" /></g>}

      {/* Tech Gear */}
      {techGear === 'tg1' && <g><ellipse cx="40" cy="172" rx="16" ry="10" fill="#18181b" /><ellipse cx="160" cy="172" rx="16" ry="10" fill="#18181b" /><rect x="28" y="166" width="24" height="12" rx="4" fill="#ff0055" opacity="0.2" /><rect x="148" y="166" width="24" height="12" rx="4" fill="#ff0055" opacity="0.2" /></g>}
      {techGear === 'tg2' && <g><rect x="136" y="190" width="20" height="8" rx="4" fill="#111" stroke="#ff0055" strokeWidth="1" /><line x1="138" y1="194" x2="154" y2="194" stroke="#ff0055" strokeWidth="0.8" opacity="0.5" /></g>}
      {techGear === 'tg3' && <g><rect x="30" y="195" width="22" height="10" rx="5" fill="#111" stroke="#ff0055" strokeWidth="1.2" /><line x1="32" y1="200" x2="50" y2="200" stroke="#ff0055" strokeWidth="0.8" opacity="0.6" /></g>}
      {techGear === 'tg4' && <g><line x1="110" y1="48" x2="112" y2="30" stroke="#ff0055" strokeWidth="2" /><circle cx="112" cy="28" r="4" fill="#ff0055" opacity="0.9" /><circle cx="112" cy="28" r="2" fill="#fff" opacity="0.7" /></g>}
    </g>
  );
};

// ─── Main SVG Avatar ───────────────────────────────────────────────────────────

interface AvatarProps {
  skinColor: string;
  faceStructure: string;
  bodyBuild: string;
  eyeStyle: string;
  eyeColor: string;
  browStyle: string;
  hairStyle: string;
  hairColor: string;
  highlightColor: string;
  beardStyle: string;
  mustacheStyle: string;
  topStyle: string;
  outerwearStyle: string;
  visorStyle: string;
  maskStyle: string;
  headwearStyle: string;
  techGearStyle: string;
}

const AvatarFace: React.FC<AvatarProps> = (p) => {
  const shadowColor = darken(p.skinColor, 0.15);
  const highlightColor = lighten(p.skinColor, 0.12);

  const getFacePath = () => {
    if (p.faceStructure === 'f2') return <ellipse cx="100" cy="105" rx="60" ry="55" fill={p.skinColor} />;
    if (p.faceStructure === 'f3') return <path d="M50 70 Q50 45 100 45 Q150 45 150 70 L145 130 Q145 160 100 165 Q55 160 55 130 Z" fill={p.skinColor} />;
    if (p.faceStructure === 'f4') return <path d="M45 80 Q45 45 100 45 Q155 45 155 80 Q155 120 100 165 Q45 120 45 80 Z" fill={p.skinColor} />;
    if (p.faceStructure === 'f5') return <polygon points="100,45 155,95 100,165 45,95" fill={p.skinColor} />;
    return <ellipse cx="100" cy="105" rx="55" ry="60" fill={p.skinColor} />;
  };

  const getBodyTransform = () => {
    if (p.bodyBuild === 'bb1') return 'scale(0.85, 1) translate(18, 0)';
    if (p.bodyBuild === 'bb3') return 'scale(1.15, 1) translate(-13, 0)';
    return '';
  };

  return (
    <svg viewBox="0 0 200 240" width="200" height="240" xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 8px 32px rgba(255,0,85,0.35))' }}>
      <g transform={getBodyTransform()}>
        <OutfitLayer style={p.outerwearStyle !== 'ow0' ? p.outerwearStyle : p.topStyle} skinColor={p.skinColor} />
      </g>
      <rect x="87" y="152" width="26" height="24" rx="6" fill={p.skinColor} />
      <rect x="90" y="152" width="6" height="20" rx="3" fill={shadowColor} opacity="0.35" />
      {getFacePath()}
      <ellipse cx="76" cy="118" rx="12" ry="18" fill={shadowColor} opacity="0.18" />
      <ellipse cx="124" cy="118" rx="12" ry="18" fill={shadowColor} opacity="0.18" />
      <ellipse cx="100" cy="90" rx="28" ry="16" fill={highlightColor} opacity="0.3" />
      <ellipse cx="46" cy="108" rx="10" ry="13" fill={p.skinColor} />
      <ellipse cx="154" cy="108" rx="10" ry="13" fill={p.skinColor} />
      <ellipse cx="73" cy="125" rx="12" ry="7" fill="#ff6b9d" opacity="0.25" />
      <ellipse cx="127" cy="125" rx="12" ry="7" fill="#ff6b9d" opacity="0.25" />
      <BrowLayer style={p.browStyle} hairColor={p.hairColor} />
      <EyeLayer style={p.eyeStyle} eyeColor={p.eyeColor} />
      <path d="M98 112 Q100 122 102 112" stroke={shadowColor} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M88 134 Q100 143 112 134" stroke={darken(p.skinColor, 0.3)} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <FacialHairLayer beardStyle={p.beardStyle} mustacheStyle={p.mustacheStyle} skinColor={p.skinColor} />
      <HairLayer style={p.hairStyle} hairColor={p.hairColor} highlightColor={p.highlightColor} />
      <AccessoryLayer visor={p.visorStyle} mask={p.maskStyle} headwear={p.headwearStyle} techGear={p.techGearStyle} hairColor={p.hairColor} />
    </svg>
  );
};

// ─── Tab Config ────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'structure', label: 'Structure', icon: <Palette className="w-3.5 h-3.5" /> },
  { id: 'eyes',      label: 'Eyes',      icon: <Eye className="w-3.5 h-3.5" /> },
  { id: 'hair',      label: 'Hair',      icon: <Scissors className="w-3.5 h-3.5" /> },
  { id: 'facial',    label: 'Facial Hair', icon: <User className="w-3.5 h-3.5" /> },
  { id: 'outfit',    label: 'Outfit',    icon: <Shirt className="w-3.5 h-3.5" /> },
  { id: 'accessories', label: 'Gear',   icon: <Glasses className="w-3.5 h-3.5" /> },
];

// ─── Reusable Style Card ───────────────────────────────────────────────────────

interface StyleCardProps {
  item: StyleOption;
  isSelected: boolean;
  onSelect: () => void;
  renderPreview?: React.ReactNode;
}

const StyleCard: React.FC<StyleCardProps> = ({ item, isSelected, onSelect, renderPreview }) => (
  <motion.button
    onClick={onSelect}
    whileHover={{ scale: item.locked ? 1 : 1.03 }}
    whileTap={{ scale: item.locked ? 1 : 0.97 }}
    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center gap-2 relative text-center w-full ${
      item.locked
        ? 'bg-[#050008]/50 border-zinc-800 opacity-55'
        : isSelected
        ? 'bg-[#1e0720] border-2 border-[#ff0055] shadow-[0_0_18px_rgba(255,0,85,0.35)]'
        : 'bg-[#050008] border-zinc-800 hover:border-[#ff0055]/50'
    }`}>
    {renderPreview && <div className="flex items-center justify-center h-8">{renderPreview}</div>}
    <span className="text-[10px] font-mono font-semibold text-white leading-tight">{item.label}</span>
    {item.locked && <div className="absolute top-1.5 right-1.5 p-1 rounded-md bg-red-950/80 border border-red-800"><Lock className="w-3 h-3 text-red-400" /></div>}
    {isSelected && !item.locked && <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#ff0055] flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-white" /></div>}
  </motion.button>
);

// ─── Color Swatches ────────────────────────────────────────────────────────────

interface ColorItem { id: string; hex: string; label: string; }

const ColorSwatches: React.FC<{ colors: ColorItem[]; selected: string; onSelect: (c: ColorItem) => void }> = ({ colors, selected, onSelect }) => (
  <div className="flex flex-wrap gap-2">
    {colors.map(c => (
      <button key={c.id} title={c.label} onClick={() => onSelect(c)}
        className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer hover:scale-110 ${
          selected === c.id ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.4)]' : 'border-zinc-700 hover:border-zinc-400'
        }`}
        style={{ backgroundColor: c.hex === 'none' ? 'transparent' : c.hex }}
      >
        {c.hex === 'none' && <span className="text-[8px] text-zinc-400 font-mono">—</span>}
      </button>
    ))}
  </div>
);

// ─── Small Card Row (2-col compact) ───────────────────────────────────────────

const CompactCard: React.FC<{ item: StyleOption; isSelected: boolean; onSelect: () => void }> = ({ item, isSelected, onSelect }) => (
  <button onClick={onSelect}
    className={`py-2 px-3 rounded-xl border text-[10px] font-mono transition-all cursor-pointer flex items-center justify-between gap-1 w-full ${
      isSelected
        ? 'bg-[#1e0720] border-[#ff0055] text-white shadow-[0_0_10px_rgba(255,0,85,0.3)]'
        : 'bg-[#050008] border-zinc-800 text-zinc-400 hover:border-[#ff0055]/50'
    } ${item.locked ? 'opacity-50' : ''}`}>
    {item.label}
    {item.locked && <Lock className="w-3 h-3 text-red-400 shrink-0" />}
    {isSelected && !item.locked && <div className="w-3 h-3 rounded-full bg-[#ff0055]" />}
  </button>
);

// ─── Sub-section label ─────────────────────────────────────────────────────────

const SectionLabel: React.FC<{ text: string }> = ({ text }) => (
  <p className="text-[10px] text-zinc-500 font-mono mb-2 uppercase tracking-widest">{text}</p>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AvatarCustomizerPage() {
  const router = useRouter();

  // ── State ──────────────────────────────────────────────────────────────────
  const [skinTone,       setSkinTone]       = useState(SKIN_TONES[2]);
  const [faceStructure,  setFaceStructure]  = useState(FACE_STRUCTURES[0]);
  const [bodyBuild,      setBodyBuild]      = useState(BODY_BUILDS[1]);
  const [eyeStyle,       setEyeStyle]       = useState(EYE_STYLES[0]);
  const [eyeColor,       setEyeColor]       = useState(EYE_COLORS[0]);
  const [browStyle,      setBrowStyle]      = useState(BROW_STYLES[0]);
  const [hairStyle,      setHairStyle]      = useState(HAIR_STYLES[0]);
  const [hairColor,      setHairColor]      = useState(HAIR_COLORS[0]);
  const [highlightColor, setHighlightColor] = useState(HIGHLIGHT_COLORS[0]);
  const [beardStyle,     setBeardStyle]     = useState(BEARD_STYLES[0]);
  const [mustacheStyle,  setMustacheStyle]  = useState(MUSTACHE_STYLES[0]);
  const [topStyle,       setTopStyle]       = useState(TOP_STYLES[0]);
  const [outerwearStyle, setOuterwearStyle] = useState(OUTERWEAR_STYLES[0]);
  const [visorStyle,     setVisorStyle]     = useState(VISOR_STYLES[0]);
  const [maskStyle,      setMaskStyle]      = useState(MASK_STYLES[0]);
  const [headwearStyle,  setHeadwearStyle]  = useState(HEADWEAR_STYLES[0]);
  const [techGearStyle,  setTechGearStyle]  = useState(TECH_GEAR[0]);

  const [activeTab,  setActiveTab]  = useState<Tab>('structure');
  const [lockAlert,  setLockAlert]  = useState<string | null>(null);
  const [isSaving,   setIsSaving]   = useState(false);

  const handleLocked = (item: StyleOption) => {
    if (item.locked) {
      setLockAlert(`LOCKED — Requires ${item.cost?.toLocaleString()} PTS`);
      setTimeout(() => setLockAlert(null), 3000);
      return true;
    }
    return false;
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => router.push('/dashboard'), 1200);
  };

  // Avatar key so preview re-animates on any meaningful change
  const avatarKey = [
    skinTone.id, faceStructure.id, bodyBuild.id, eyeStyle.id, eyeColor.id,
    browStyle.id, hairStyle.id, hairColor.id, highlightColor.id,
    beardStyle.id, mustacheStyle.id, topStyle.id, outerwearStyle.id,
    visorStyle.id, maskStyle.id, headwearStyle.id, techGearStyle.id,
  ].join('-');

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-x-hidden select-none"
      style={{ fontFamily: "'Inter', 'Outfit', sans-serif" }}>

      {/* Ambient glows */}
      <div className="absolute top-0 left-1/3 w-[700px] h-[700px] bg-[#ff0055]/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#e60039]/8 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 relative z-10 space-y-5">

        {/* ── Header ── */}
        <header className="flex items-center justify-between border-b border-[#ff0055]/25 pb-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard"
              className="p-2.5 rounded-xl bg-[#0e0414] border border-[#ff0055]/30 text-[#ff0055] hover:bg-[#ff0055] hover:text-white transition-all shadow-[0_0_10px_rgba(255,0,85,0.2)]">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <p className="text-[10px] font-mono font-bold text-[#ff0055] tracking-widest uppercase mb-0.5">CHARACTER STUDIO</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-200 to-[#ff0055]">
                Avatar Creator
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-[#ff0055] animate-pulse" />
              LIVE SYNC ACTIVE
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#120315] border border-[#ff0055]/40 font-mono text-xs text-[#ff0055]">
              <Zap className="w-4 h-4" />
              <span>4,560 PTS</span>
            </div>
          </div>
        </header>

        {/* ── Lock Alert ── */}
        <AnimatePresence>
          {lockAlert && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="p-3.5 rounded-xl bg-red-950/90 border border-red-500 text-xs font-mono text-red-300 flex items-center gap-2.5 shadow-[0_0_20px_rgba(239,68,68,0.25)]">
              <Lock className="w-4 h-4 text-red-400 shrink-0" />
              <span>{lockAlert}</span>
              <span className="ml-auto text-[10px] text-zinc-500">EARN PTS IN ARENA</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main 2-col Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

          {/* ── LEFT: Avatar Preview Podium ── */}
          <div className="lg:col-span-2 bg-[#0a030d]/90 rounded-3xl border-2 border-[#ff0055]/45 p-6 backdrop-blur-xl shadow-[0_0_50px_rgba(255,0,85,0.18)] flex flex-col items-center gap-5 min-h-[580px] relative overflow-hidden">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#ff0055]/50 rounded-tl-3xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#ff0055]/50 rounded-tr-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#ff0055]/50 rounded-bl-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#ff0055]/50 rounded-br-3xl pointer-events-none" />

            <div className="w-full flex items-center justify-between text-[10px] font-mono text-[#ff0055]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ff0055] animate-pulse" />
                LIVE PREVIEW
              </span>
              <span className="text-zinc-600">CHARACTER // RENDER</span>
            </div>

            {/* SVG Avatar */}
            <div className="relative flex items-center justify-center flex-1 w-full">
              <div className="absolute bottom-0 w-52 h-10 rounded-full blur-xl" style={{ backgroundColor: `${skinTone.hex}44` }} />
              <div className="absolute bottom-2 w-44 h-6 rounded-full"
                style={{ backgroundColor: `${skinTone.hex}22`, boxShadow: `0 0 30px ${skinTone.hex}66` }} />
              <motion.div key={avatarKey} initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}>
                <AvatarFace
                  skinColor={skinTone.hex}
                  faceStructure={faceStructure.id}
                  bodyBuild={bodyBuild.id}
                  eyeStyle={eyeStyle.id}
                  eyeColor={eyeColor.hex}
                  browStyle={browStyle.id}
                  hairStyle={hairStyle.id}
                  hairColor={hairColor.hex}
                  highlightColor={highlightColor.hex}
                  beardStyle={beardStyle.id}
                  mustacheStyle={mustacheStyle.id}
                  topStyle={topStyle.id}
                  outerwearStyle={outerwearStyle.id}
                  visorStyle={visorStyle.id}
                  maskStyle={maskStyle.id}
                  headwearStyle={headwearStyle.id}
                  techGearStyle={techGearStyle.id}
                />
              </motion.div>
            </div>

            {/* Summary chips — all 6 categories */}
            <div className="w-full grid grid-cols-2 gap-2 text-[10px] font-mono">
              {[
                { label: 'Skin',     value: skinTone.label },
                { label: 'Eyes',     value: eyeStyle.label },
                { label: 'Hair',     value: hairStyle.label },
                { label: 'Facial',   value: beardStyle.label },
                { label: 'Outfit',   value: topStyle.label },
                { label: 'Gear',     value: [visorStyle, maskStyle, headwearStyle].find(s => s.id !== 'v0' && s.id !== 'm0' && s.id !== 'hw0')?.label ?? 'None' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#050008] border border-zinc-800">
                  <span className="text-zinc-500">{label}</span>
                  <span className="text-[#ff0055] font-semibold truncate max-w-[80px] text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Customizer Panel ── */}
          <div className="lg:col-span-3 space-y-4">

            {/* Tab Bar — scrollable on mobile */}
            <div className="flex gap-1 p-1.5 rounded-2xl bg-[#0a030d]/90 border border-[#ff0055]/25 backdrop-blur-xl overflow-x-auto scrollbar-hide">
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 py-2 px-3 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wide flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[#ff0055] text-white shadow-[0_0_18px_rgba(255,0,85,0.6)]'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                  }`}>
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Panel Content */}
            <AnimatePresence mode="wait">
              <motion.div key={activeTab}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="bg-[#0a030d]/90 rounded-3xl border border-[#ff0055]/25 p-5 backdrop-blur-xl shadow-xl space-y-6">

                {/* Section Header */}
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#ff0055]" />
                    {activeTab === 'structure'   && 'Face, Body & Skin'}
                    {activeTab === 'eyes'        && 'Eyes, Iris & Brows'}
                    {activeTab === 'hair'        && 'Hair Style, Color & Highlights'}
                    {activeTab === 'facial'      && 'Beard & Mustache'}
                    {activeTab === 'outfit'      && 'Tops & Outerwear'}
                    {activeTab === 'accessories' && 'Visors, Masks, Headwear & Tech'}
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-600">LIVE SYNC ON</span>
                </div>

                {/* ── STRUCTURE TAB ── */}
                {activeTab === 'structure' && (
                  <div className="space-y-5">
                    <div>
                      <SectionLabel text="Face Structure" />
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {FACE_STRUCTURES.map(opt => (
                          <StyleCard key={opt.id} item={opt} isSelected={faceStructure.id === opt.id}
                            onSelect={() => { if (!handleLocked(opt)) setFaceStructure(opt); }} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <SectionLabel text="Body Build" />
                      <div className="grid grid-cols-3 gap-3">
                        {BODY_BUILDS.map(opt => (
                          <StyleCard key={opt.id} item={opt} isSelected={bodyBuild.id === opt.id}
                            onSelect={() => { if (!handleLocked(opt)) setBodyBuild(opt); }} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <SectionLabel text="Skin Tone" />
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        {SKIN_TONES.map(tone => (
                          <button key={tone.id} onClick={() => setSkinTone(tone)}
                            className={`group flex flex-col items-center gap-2 p-2 rounded-2xl border-2 transition-all cursor-pointer ${
                              skinTone.id === tone.id
                                ? 'border-[#ff0055] shadow-[0_0_16px_rgba(255,0,85,0.4)] bg-[#1e0720]'
                                : 'border-zinc-800 hover:border-[#ff0055]/50 bg-[#050008]'
                            }`}>
                            <div className="w-10 h-10 rounded-full border-2 border-white/20 shadow-lg transition-transform group-hover:scale-105"
                              style={{ backgroundColor: tone.hex }} />
                            <span className="text-[9px] font-mono text-zinc-400 group-hover:text-white text-center leading-tight">{tone.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── EYES TAB ── */}
                {activeTab === 'eyes' && (
                  <div className="space-y-5">
                    <div>
                      <SectionLabel text="Eye Shape" />
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {EYE_STYLES.map(opt => (
                          <StyleCard key={opt.id} item={opt} isSelected={eyeStyle.id === opt.id}
                            onSelect={() => { if (!handleLocked(opt)) setEyeStyle(opt); }}
                            renderPreview={
                              <svg viewBox="0 0 40 20" width="40" height="20">
                                {opt.id === 'e1' && <><ellipse cx="12" cy="10" rx="9" ry="9" fill="#fff" /><ellipse cx="28" cy="10" rx="9" ry="9" fill="#fff" /><ellipse cx="12" cy="10" rx="5" ry="5" fill={eyeColor.hex} /><ellipse cx="28" cy="10" rx="5" ry="5" fill={eyeColor.hex} /></>}
                                {opt.id === 'e2' && <><path d="M3 10 Q12 2 21 10 Q12 18 3 10Z" fill="#fff" /><path d="M19 10 Q28 2 37 10 Q28 18 19 10Z" fill="#fff" /><ellipse cx="12" cy="10" rx="5" ry="5" fill={eyeColor.hex} /><ellipse cx="28" cy="10" rx="5" ry="5" fill={eyeColor.hex} /></>}
                                {opt.id === 'e3' && <><path d="M3 12 Q12 2 21 8 Q16 16 5 15Z" fill="#fff" /><path d="M19 8 Q28 2 37 12 Q35 15 24 16Z" fill="#fff" /><ellipse cx="11" cy="9" rx="4" ry="4" fill={eyeColor.hex} /><ellipse cx="27" cy="9" rx="4" ry="4" fill={eyeColor.hex} /></>}
                                {opt.id === 'e4' && <><ellipse cx="12" cy="12" rx="9" ry="6" fill="#fff" /><ellipse cx="28" cy="12" rx="9" ry="6" fill="#fff" /><ellipse cx="12" cy="12" rx="5" ry="3.5" fill={eyeColor.hex} /><ellipse cx="28" cy="12" rx="5" ry="3.5" fill={eyeColor.hex} /></>}
                                {opt.id === 'e5' && <><ellipse cx="12" cy="10" rx="11" ry="10" fill="#fff" /><ellipse cx="28" cy="10" rx="11" ry="10" fill="#fff" /><ellipse cx="12" cy="10" rx="6" ry="6" fill={eyeColor.hex} /><ellipse cx="28" cy="10" rx="6" ry="6" fill={eyeColor.hex} /></>}
                                {opt.id === 'e6' && <><ellipse cx="12" cy="10" rx="9" ry="9" fill="#fff" /><ellipse cx="28" cy="10" rx="9" ry="9" fill="#fff" /><text x="12" y="14" textAnchor="middle" fontSize="10">⭐</text><text x="28" y="14" textAnchor="middle" fontSize="10">⭐</text></>}
                              </svg>
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <SectionLabel text="Iris Color" />
                        <ColorSwatches colors={EYE_COLORS} selected={eyeColor.id} onSelect={setEyeColor} />
                      </div>
                      <div>
                        <SectionLabel text="Eyebrow Style" />
                        <div className="grid grid-cols-1 gap-2">
                          {BROW_STYLES.map(opt => (
                            <CompactCard key={opt.id} item={opt} isSelected={browStyle.id === opt.id}
                              onSelect={() => { if (!handleLocked(opt)) setBrowStyle(opt); }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── HAIR TAB ── */}
                {activeTab === 'hair' && (
                  <div className="space-y-5">
                    <div>
                      <SectionLabel text="Hair Style" />
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {HAIR_STYLES.map(opt => (
                          <StyleCard key={opt.id} item={opt} isSelected={hairStyle.id === opt.id}
                            onSelect={() => { if (!handleLocked(opt)) setHairStyle(opt); }}
                            renderPreview={
                              <svg viewBox="0 0 40 30" width="40" height="30">
                                <circle cx="20" cy="18" r="10" fill="#e8a87c" />
                                {opt.id === 'h1' && <path d="M10 18 Q10 6 20 4 Q30 6 30 18 Q28 12 20 11 Q12 12 10 18Z" fill={hairColor.hex} />}
                                {opt.id === 'h2' && <><path d="M10 18 Q10 6 20 4 Q30 6 30 18 Q28 12 20 11 Q12 12 10 18Z" fill={hairColor.hex} /><rect x="9" y="14" width="5" height="16" rx="2.5" fill={hairColor.hex} /><rect x="26" y="14" width="5" height="16" rx="2.5" fill={hairColor.hex} /></>}
                                {opt.id === 'h3' && <circle cx="20" cy="11" r="11" fill={hairColor.hex} />}
                                {opt.id === 'h4' && <path d="M10 18 Q10 6 20 4 Q30 6 30 18 Q22 9 10 18Z" fill={hairColor.hex} />}
                                {opt.id === 'h5' && <><path d="M10 18 Q10 6 20 4 Q30 6 30 18 Q28 12 20 11 Q12 12 10 18Z" fill={hairColor.hex} /><path d="M19 4 Q16 0 18 -4 Q20 -6 22 -4 Q24 0 21 4Z" fill={hairColor.hex} /></>}
                                {opt.id === 'h6' && <path d="M10 19 Q10 8 20 7 Q30 8 30 19 Q28 14 20 13 Q12 14 10 19Z" fill={hairColor.hex} />}
                                {opt.id === 'h7' && <><path d="M10 18 Q10 6 20 4 Q30 6 30 18Z" fill={hairColor.hex} /><circle cx="13" cy="6" r="5" fill={hairColor.hex} /><circle cx="27" cy="6" r="5" fill={hairColor.hex} /></>}
                                {opt.id === 'h8' && <><path d="M10 18 Q10 6 20 4 Q30 6 30 18Z" fill={hairColor.hex} /><path d="M18 4 Q19 -2 20 -5 Q21 -2 22 4Z" fill={hairColor.hex} /></>}
                                {opt.id === 'h9' && <><path d="M10 18 Q10 6 20 4 Q30 6 30 18 Q28 12 20 11 Q12 12 10 18Z" fill={hairColor.hex} /><path d="M10 12 Q20 18 30 12" stroke={hairColor.hex} strokeWidth="2" fill="none" /></>}
                                {opt.id === 'h10' && <><path d="M10 18 Q10 6 20 4 Q30 6 30 18 Q28 12 20 11 Q12 12 10 18Z" fill={hairColor.hex} /><path d="M15 8 Q20 5 25 8" stroke="#fff" strokeWidth="1" fill="none" opacity="0.5" /></>}
                                {opt.id === 'h11' && <><path d="M10 18 Q10 6 20 4 Q30 6 30 18Z" fill={hairColor.hex} /><line x1="12" y1="15" x2="12" y2="25" stroke={hairColor.hex} strokeWidth="3" /><line x1="28" y1="15" x2="28" y2="25" stroke={hairColor.hex} strokeWidth="3" /></>}
                              </svg>
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <SectionLabel text="Primary Color" />
                        <ColorSwatches colors={HAIR_COLORS} selected={hairColor.id} onSelect={setHairColor} />
                      </div>
                      <div>
                        <SectionLabel text="Highlights / Streaks" />
                        <ColorSwatches colors={HIGHLIGHT_COLORS} selected={highlightColor.id} onSelect={setHighlightColor} />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── FACIAL HAIR TAB ── */}
                {activeTab === 'facial' && (
                  <div className="space-y-5">
                    <div>
                      <SectionLabel text="Beard Style" />
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {BEARD_STYLES.map(opt => (
                          <StyleCard key={opt.id} item={opt} isSelected={beardStyle.id === opt.id}
                            onSelect={() => { if (!handleLocked(opt)) setBeardStyle(opt); }} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <SectionLabel text="Mustache Style" />
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {MUSTACHE_STYLES.map(opt => (
                          <StyleCard key={opt.id} item={opt} isSelected={mustacheStyle.id === opt.id}
                            onSelect={() => { if (!handleLocked(opt)) setMustacheStyle(opt); }} />
                        ))}
                      </div>
                    </div>
                    {/* Quick toggle row */}
                    <div className="p-4 rounded-2xl bg-[#050008] border border-zinc-800 flex items-center justify-between gap-4">
                      <span className="text-xs font-mono text-zinc-400">Quick Clean Shave</span>
                      <button onClick={() => { setBeardStyle(BEARD_STYLES[0]); setMustacheStyle(MUSTACHE_STYLES[0]); }}
                        className="px-4 py-2 rounded-xl bg-[#ff0055]/20 border border-[#ff0055]/50 text-[#ff0055] text-xs font-mono font-bold hover:bg-[#ff0055]/30 transition-all cursor-pointer">
                        RESET FACIAL HAIR
                      </button>
                    </div>
                  </div>
                )}

                {/* ── OUTFIT TAB ── */}
                {activeTab === 'outfit' && (
                  <div className="space-y-5">
                    <div>
                      <SectionLabel text="Top / Base Layer" />
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {TOP_STYLES.map(opt => (
                          <StyleCard key={opt.id} item={opt} isSelected={topStyle.id === opt.id}
                            onSelect={() => { if (!handleLocked(opt)) setTopStyle(opt); }}
                            renderPreview={
                              <svg viewBox="0 0 40 30" width="40" height="30">
                                <path d={`M5 30 L5 18 Q10 12 15 11 L20 12 L25 11 Q30 12 35 18 L35 30Z`}
                                  fill={{ o1:'#1a0a1a', o2:'#2d0d2d', o4:'#18181b', o7:'#101015', o8:'#333333' }[opt.id] ?? '#1a0a1a'} />
                              </svg>
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <SectionLabel text="Outerwear / Jacket" />
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {OUTERWEAR_STYLES.map(opt => (
                          <StyleCard key={opt.id} item={opt} isSelected={outerwearStyle.id === opt.id}
                            onSelect={() => { if (!handleLocked(opt)) setOuterwearStyle(opt); }}
                            renderPreview={
                              <svg viewBox="0 0 40 30" width="40" height="30">
                                {opt.id !== 'ow0' && <path d={`M5 30 L5 18 Q10 12 15 11 L20 12 L25 11 Q30 12 35 18 L35 30Z`}
                                  fill={{ o3:'#0d0d18', o5:'#0d1a2d', o9:'#1a1a24', o6:'#1a0a00' }[opt.id] ?? '#111'} />}
                                {opt.id === 'ow0' && <text x="20" y="18" textAnchor="middle" fontSize="9" fill="#666" fontFamily="monospace">NONE</text>}
                              </svg>
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── ACCESSORIES TAB ── */}
                {activeTab === 'accessories' && (
                  <div className="space-y-5">
                    <div>
                      <SectionLabel text="Visors & Eyewear" />
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {VISOR_STYLES.map(opt => (
                          <StyleCard key={opt.id} item={opt} isSelected={visorStyle.id === opt.id}
                            onSelect={() => { if (!handleLocked(opt)) setVisorStyle(opt); }} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <SectionLabel text="Masks" />
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {MASK_STYLES.map(opt => (
                          <StyleCard key={opt.id} item={opt} isSelected={maskStyle.id === opt.id}
                            onSelect={() => { if (!handleLocked(opt)) setMaskStyle(opt); }} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <SectionLabel text="Headwear" />
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {HEADWEAR_STYLES.map(opt => (
                          <StyleCard key={opt.id} item={opt} isSelected={headwearStyle.id === opt.id}
                            onSelect={() => { if (!handleLocked(opt)) setHeadwearStyle(opt); }} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <SectionLabel text="Tech Gear" />
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {TECH_GEAR.map(opt => (
                          <StyleCard key={opt.id} item={opt} isSelected={techGearStyle.id === opt.id}
                            onSelect={() => { if (!handleLocked(opt)) setTechGearStyle(opt); }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

            {/* LOCK IN AVATAR Button */}
            <motion.div className="flex justify-end"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <button onClick={handleSave} disabled={isSaving}
                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-[#ff0055] via-[#e60039] to-[#ff0055] text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,0,85,0.5)] hover:scale-105 active:scale-95 border border-white/20 transition-all cursor-pointer disabled:opacity-60">
                {isSaving ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />SAVING AVATAR...</>
                ) : (
                  <><ShieldCheck className="w-5 h-5" />LOCK IN AVATAR →</>
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────

type MainTab = 'fashion' | 'wardrobe' | 'avatar';

type AvatarSubCategory =
  | 'body'
  | 'face'
  | 'eyes'
  | 'brows'
  | 'nose'
  | 'lips'
  | 'ears'
  | 'beard'
  | 'hair'
  | 'skin';

interface Option {
  id: string;
  label: string;
  locked?: boolean;
  cost?: number;
}

interface ColorOption {
  id: string;
  hex: string;
  label: string;
}

interface AvatarState {
  skinTone: string;
  faceShape: string;
  bodyType: string;
  eyeStyle: string;
  eyeColor: string;
  browStyle: string;
  noseStyle: string;
  lipsStyle: string;
  earStyle: string;
  beardStyle: string;
  hairStyle: string;
  hairColor: string;
  outfitStyle: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SKIN_TONES: ColorOption[] = [
  { id: 'sk1', hex: '#FDDBB4', label: 'Porcelain' },
  { id: 'sk2', hex: '#F5C89A', label: 'Ivory' },
  { id: 'sk3', hex: '#E8A87C', label: 'Sand' },
  { id: 'sk4', hex: '#C68642', label: 'Honey' },
  { id: 'sk5', hex: '#8D5524', label: 'Caramel' },
  { id: 'sk6', hex: '#4A2912', label: 'Espresso' },
];

const FACE_SHAPES: Option[] = [
  { id: 'fc1', label: 'Oval' },
  { id: 'fc2', label: 'Round' },
  { id: 'fc3', label: 'Square' },
  { id: 'fc4', label: 'Heart' },
  { id: 'fc5', label: 'Diamond' },
  { id: 'fc6', label: 'Oblong' },
];

const BODY_TYPES: Option[] = [
  { id: 'bt1', label: 'Slim' },
  { id: 'bt2', label: 'Athletic' },
  { id: 'bt3', label: 'Broad' },
  { id: 'bt4', label: 'Petite' },
];

const EYE_STYLES: Option[] = [
  { id: 'ey1', label: 'Round' },
  { id: 'ey2', label: 'Almond' },
  { id: 'ey3', label: 'Cat-Eye' },
  { id: 'ey4', label: 'Sleepy' },
  { id: 'ey5', label: 'Wide' },
  { id: 'ey6', label: 'Deep Set' },
  { id: 'ey7', label: 'Upturned' },
  { id: 'ey8', label: 'Monolid' },
  { id: 'ey9', label: 'Hooded' },
];

const EYE_COLORS: ColorOption[] = [
  { id: 'ec1', hex: '#3B2314', label: 'Dark Brown' },
  { id: 'ec2', hex: '#6F4E37', label: 'Warm Brown' },
  { id: 'ec3', hex: '#6B8E23', label: 'Olive' },
  { id: 'ec4', hex: '#228B22', label: 'Forest' },
  { id: 'ec5', hex: '#4169E1', label: 'Royal' },
  { id: 'ec6', hex: '#00CED1', label: 'Teal' },
  { id: 'ec7', hex: '#C0392B', label: 'Crimson' },
  { id: 'ec8', hex: '#8B008B', label: 'Violet' },
  { id: 'ec9', hex: '#708090', label: 'Grey' },
];

const BROW_STYLES: Option[] = [
  { id: 'br1', label: 'Soft Arch' },
  { id: 'br2', label: 'Straight' },
  { id: 'br3', label: 'High Arch' },
  { id: 'br4', label: 'Thick' },
  { id: 'br5', label: 'Thin' },
  { id: 'br6', label: 'Bushy' },
];

const NOSE_STYLES: Option[] = [
  { id: 'ns1', label: 'Button' },
  { id: 'ns2', label: 'Straight' },
  { id: 'ns3', label: 'Broad' },
  { id: 'ns4', label: 'Pointy' },
  { id: 'ns5', label: 'Snub' },
  { id: 'ns6', label: 'Roman' },
];

const LIPS_STYLES: Option[] = [
  { id: 'lp1', label: 'Natural' },
  { id: 'lp2', label: 'Full' },
  { id: 'lp3', label: 'Thin' },
  { id: 'lp4', label: 'Cupid' },
  { id: 'lp5', label: 'Wide' },
  { id: 'lp6', label: 'Pouty' },
];

const EAR_STYLES: Option[] = [
  { id: 'ea1', label: 'Default' },
  { id: 'ea2', label: 'Small' },
  { id: 'ea3', label: 'Large' },
  { id: 'ea4', label: 'Pointed' },
  { id: 'ea5', label: 'Earring' },
  { id: 'ea6', label: 'Stud' },
];

const BEARD_STYLES: Option[] = [
  { id: 'bd0', label: 'None' },
  { id: 'bd1', label: 'Stubble' },
  { id: 'bd2', label: 'Goatee' },
  { id: 'bd3', label: 'Full Beard' },
  { id: 'bd4', label: 'Moustache' },
  { id: 'bd5', label: 'Chinstrap' },
  { id: 'bd6', label: 'Circle' },
  { id: 'bd7', label: 'Van Dyke' },
  { id: 'bd8', label: 'Balbo' },
];

const HAIR_STYLES: Option[] = [
  { id: 'hr1', label: 'Short Wavy' },
  { id: 'hr2', label: 'Long Straight' },
  { id: 'hr3', label: 'Curly Afro' },
  { id: 'hr4', label: 'Side Swept' },
  { id: 'hr5', label: 'Ponytail' },
  { id: 'hr6', label: 'Buzz Cut' },
  { id: 'hr7', label: 'Space Buns' },
  { id: 'hr8', label: 'Mohawk' },
  { id: 'hr9', label: 'Messy Fringe' },
  { id: 'hr10', label: 'Slicked Back' },
  { id: 'hr11', label: 'Braids' },
  { id: 'hr12', label: 'Bob Cut' },
];

const HAIR_COLORS: ColorOption[] = [
  { id: 'hc1', hex: '#1a0a00', label: 'Jet Black' },
  { id: 'hc2', hex: '#3B1F0A', label: 'Dark Brown' },
  { id: 'hc3', hex: '#8B4513', label: 'Auburn' },
  { id: 'hc4', hex: '#D2691E', label: 'Copper' },
  { id: 'hc5', hex: '#DAA520', label: 'Honey Blonde' },
  { id: 'hc6', hex: '#F5DEB3', label: 'Platinum' },
  { id: 'hc7', hex: '#ff0055', label: 'Neon Red' },
  { id: 'hc8', hex: '#a855f7', label: 'Violet' },
  { id: 'hc9', hex: '#06b6d4', label: 'Cyan' },
  { id: 'hc10', hex: '#22c55e', label: 'Neon Green' },
];

const OUTFIT_STYLES: Option[] = [
  { id: 'of1', label: 'Cyber Tee' },
  { id: 'of2', label: 'Hoodie' },
  { id: 'of3', label: 'Trench Coat' },
  { id: 'of4', label: 'Tactical Vest' },
  { id: 'of5', label: 'Cyber Suit' },
  { id: 'of6', label: 'Streetwear' },
  { id: 'of7', label: 'Neon Jacket', locked: true, cost: 1800 },
  { id: 'of8', label: 'Techwear', locked: true, cost: 2200 },
  { id: 'of9', label: 'Vanguard Armor', locked: true, cost: 3500 },
];

// ─── Default Avatar State ──────────────────────────────────────────────────────

const DEFAULT_AVATAR: AvatarState = {
  skinTone: 'sk3',
  faceShape: 'fc1',
  bodyType: 'bt2',
  eyeStyle: 'ey1',
  eyeColor: 'ec1',
  browStyle: 'br1',
  noseStyle: 'ns1',
  lipsStyle: 'lp1',
  earStyle: 'ea1',
  beardStyle: 'bd0',
  hairStyle: 'hr1',
  hairColor: 'hc1',
  outfitStyle: 'of1',
};

// ─── Sub-category Config ────────────────────────────────────────────────────────

const AVATAR_SUB_CATEGORIES: { id: AvatarSubCategory; label: string; icon: string }[] = [
  { id: 'eyes', label: 'Eyes', icon: '👁' },
  { id: 'brows', label: 'Brows', icon: '〰️' },
  { id: 'nose', label: 'Nose', icon: '👃' },
  { id: 'face', label: 'Face', icon: '⬮' },
  { id: 'lips', label: 'Lips', icon: '💋' },
  { id: 'ears', label: 'Ears', icon: '👂' },
  { id: 'beard', label: 'Beard', icon: '🧔' },
  { id: 'hair', label: 'Hair', icon: '💇' },
  { id: 'skin', label: 'Skin', icon: '🎨' },
  { id: 'body', label: 'Body', icon: '🚶' },
];

// ─── Color Utilities ───────────────────────────────────────────────────────────

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
function getSkinColor(id: string) {
  return SKIN_TONES.find(s => s.id === id)?.hex ?? '#E8A87C';
}
function getHairColor(id: string) {
  return HAIR_COLORS.find(h => h.id === id)?.hex ?? '#1a0a00';
}
function getEyeColor(id: string) {
  return EYE_COLORS.find(e => e.id === id)?.hex ?? '#3B2314';
}

// ─── 3D Avatar SVG ─────────────────────────────────────────────────────────────

interface AvatarSVGProps {
  avatar: AvatarState;
  size?: number;
  mini?: boolean;
}

const AvatarSVG: React.FC<AvatarSVGProps> = ({ avatar, size = 260, mini = false }) => {
  const skin = getSkinColor(avatar.skinTone);
  const hair = getHairColor(avatar.hairColor);
  const eye = getEyeColor(avatar.eyeColor);
  const skinShadow = darken(skin, 0.18);
  const skinDark = darken(skin, 0.28);
  const skinHighlight = lighten(skin, 0.14);
  const hairShadow = darken(hair, 0.22);
  const hairHighlight = lighten(hair, 0.12);
  const eyePupil = darken(eye, 0.45);

  // Face shape path
  const getFacePath = () => {
    switch (avatar.faceShape) {
      case 'fc2': return <ellipse cx="100" cy="108" rx="62" ry="58" fill={skin} />; // Round
      case 'fc3': return <path d="M48 72 Q48 44 100 44 Q152 44 152 72 L148 135 Q148 162 100 167 Q52 162 52 135Z" fill={skin} />; // Square
      case 'fc4': return <path d="M44 82 Q44 44 100 44 Q156 44 156 82 Q156 124 100 168 Q44 124 44 82Z" fill={skin} />; // Heart
      case 'fc5': return <ellipse cx="100" cy="108" rx="54" ry="65" fill={skin} />; // Diamond
      case 'fc6': return <ellipse cx="100" cy="112" rx="52" ry="68" fill={skin} />; // Oblong
      default:    return <ellipse cx="100" cy="108" rx="57" ry="62" fill={skin} />; // Oval
    }
  };

  // Eye renderer
  const getEyes = () => {
    const white = '#ffffff';
    switch (avatar.eyeStyle) {
      case 'ey2': // Almond
        return (<g>
          <path d="M67 108 Q80 97 93 108 Q80 119 67 108Z" fill={white} />
          <path d="M107 108 Q120 97 133 108 Q120 119 107 108Z" fill={white} />
          <ellipse cx="80" cy="108" rx="6" ry="7" fill={eye} /><ellipse cx="120" cy="108" rx="6" ry="7" fill={eye} />
          <ellipse cx="80" cy="108" rx="3.5" ry="4" fill={eyePupil} /><ellipse cx="120" cy="108" rx="3.5" ry="4" fill={eyePupil} />
          <circle cx="82" cy="104" r="2" fill={white} opacity="0.9" /><circle cx="122" cy="104" r="2" fill={white} opacity="0.9" />
          <path d="M67 108 Q80 97 93 108" stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M107 108 Q120 97 133 108" stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>);
      case 'ey3': // Cat-Eye
        return (<g>
          <path d="M66 110 Q80 96 94 106 Q88 115 69 114Z" fill={white} />
          <path d="M106 106 Q120 96 134 110 Q131 115 112 114Z" fill={white} />
          <ellipse cx="80" cy="106" rx="6" ry="6.5" fill={eye} /><ellipse cx="120" cy="106" rx="6" ry="6.5" fill={eye} />
          <ellipse cx="80" cy="106" rx="3.5" ry="3.8" fill={eyePupil} /><ellipse cx="120" cy="106" rx="3.5" ry="3.8" fill={eyePupil} />
          <circle cx="82" cy="103" r="1.8" fill={white} opacity="0.9" /><circle cx="122" cy="103" r="1.8" fill={white} opacity="0.9" />
          <path d="M66 110 Q80 96 94 106" stroke="#1a0a00" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M106 106 Q120 96 134 110" stroke="#1a0a00" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <line x1="94" y1="106" x2="97" y2="101" stroke="#1a0a00" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="106" y1="106" x2="103" y2="101" stroke="#1a0a00" strokeWidth="1.8" strokeLinecap="round" />
        </g>);
      case 'ey4': // Sleepy
        return (<g>
          <ellipse cx="80" cy="112" rx="10" ry="6" fill={white} /><ellipse cx="120" cy="112" rx="10" ry="6" fill={white} />
          <ellipse cx="80" cy="112" rx="6" ry="4" fill={eye} /><ellipse cx="120" cy="112" rx="6" ry="4" fill={eye} />
          <ellipse cx="80" cy="112" rx="3.5" ry="2.5" fill={eyePupil} /><ellipse cx="120" cy="112" rx="3.5" ry="2.5" fill={eyePupil} />
          <path d="M68 111 Q80 103 92 111" stroke="#1a0a00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M108 111 Q120 103 132 111" stroke="#1a0a00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>);
      case 'ey5': // Wide
        return (<g>
          <ellipse cx="80" cy="107" rx="14" ry="13" fill={white} /><ellipse cx="120" cy="107" rx="14" ry="13" fill={white} />
          <ellipse cx="80" cy="107" rx="9" ry="9" fill={eye} /><ellipse cx="120" cy="107" rx="9" ry="9" fill={eye} />
          <ellipse cx="80" cy="107" rx="5" ry="5" fill={eyePupil} /><ellipse cx="120" cy="107" rx="5" ry="5" fill={eyePupil} />
          <circle cx="83" cy="103" r="2.5" fill={white} opacity="0.9" /><circle cx="123" cy="103" r="2.5" fill={white} opacity="0.9" />
          <path d="M66 96 Q80 90 94 96" stroke="#1a0a00" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M106 96 Q120 90 134 96" stroke="#1a0a00" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </g>);
      case 'ey6': // Deep Set
        return (<g>
          <ellipse cx="80" cy="110" rx="11" ry="10" fill={skinShadow} opacity="0.4" />
          <ellipse cx="120" cy="110" rx="11" ry="10" fill={skinShadow} opacity="0.4" />
          <ellipse cx="80" cy="109" rx="10" ry="9" fill={white} /><ellipse cx="120" cy="109" rx="10" ry="9" fill={white} />
          <ellipse cx="80" cy="109" rx="6" ry="6" fill={eye} /><ellipse cx="120" cy="109" rx="6" ry="6" fill={eye} />
          <ellipse cx="80" cy="109" rx="3" ry="3" fill={eyePupil} /><ellipse cx="120" cy="109" rx="3" ry="3" fill={eyePupil} />
          <circle cx="82" cy="106" r="2" fill={white} opacity="0.9" /><circle cx="122" cy="106" r="2" fill={white} opacity="0.9" />
        </g>);
      case 'ey7': // Upturned
        return (<g>
          <path d="M68 112 Q80 98 94 106 Q88 116 70 116Z" fill={white} />
          <path d="M106 106 Q120 98 132 112 Q130 116 112 116Z" fill={white} />
          <ellipse cx="81" cy="107" rx="6" ry="6" fill={eye} /><ellipse cx="119" cy="107" rx="6" ry="6" fill={eye} />
          <ellipse cx="81" cy="107" rx="3" ry="3" fill={eyePupil} /><ellipse cx="119" cy="107" rx="3" ry="3" fill={eyePupil} />
          <circle cx="83" cy="104" r="1.8" fill={white} opacity="0.9" /><circle cx="121" cy="104" r="1.8" fill={white} opacity="0.9" />
          <path d="M68 112 Q80 98 94 106" stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M106 106 Q120 98 132 112" stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>);
      case 'ey8': // Monolid
        return (<g>
          <ellipse cx="80" cy="108" rx="11" ry="8" fill={white} /><ellipse cx="120" cy="108" rx="11" ry="8" fill={white} />
          <ellipse cx="80" cy="108" rx="7" ry="5" fill={eye} /><ellipse cx="120" cy="108" rx="7" ry="5" fill={eye} />
          <ellipse cx="80" cy="108" rx="4" ry="3" fill={eyePupil} /><ellipse cx="120" cy="108" rx="4" ry="3" fill={eyePupil} />
          <circle cx="82" cy="105" r="1.6" fill={white} opacity="0.9" /><circle cx="122" cy="105" r="1.6" fill={white} opacity="0.9" />
          <path d="M69 108 Q80 101 91 108" stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M109 108 Q120 101 131 108" stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>);
      case 'ey9': // Hooded
        return (<g>
          <ellipse cx="80" cy="108" rx="11" ry="9" fill={white} /><ellipse cx="120" cy="108" rx="11" ry="9" fill={white} />
          <ellipse cx="80" cy="108" rx="7" ry="6" fill={eye} /><ellipse cx="120" cy="108" rx="7" ry="6" fill={eye} />
          <ellipse cx="80" cy="108" rx="4" ry="3.5" fill={eyePupil} /><ellipse cx="120" cy="108" rx="4" ry="3.5" fill={eyePupil} />
          <circle cx="82" cy="104" r="1.8" fill={white} opacity="0.9" /><circle cx="122" cy="104" r="1.8" fill={white} opacity="0.9" />
          <path d="M68 108 Q80 97 92 104" stroke={skinShadow} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.6" />
          <path d="M108 104 Q120 97 132 108" stroke={skinShadow} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.6" />
          <path d="M68 108 Q80 97 92 104" stroke="#1a0a00" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M108 104 Q120 97 132 108" stroke="#1a0a00" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>);
      default: // Round
        return (<g>
          <ellipse cx="80" cy="108" rx="12" ry="12" fill={white} /><ellipse cx="120" cy="108" rx="12" ry="12" fill={white} />
          <ellipse cx="80" cy="108" rx="8" ry="8" fill={eye} /><ellipse cx="120" cy="108" rx="8" ry="8" fill={eye} />
          <ellipse cx="80" cy="108" rx="4.5" ry="4.5" fill={eyePupil} /><ellipse cx="120" cy="108" rx="4.5" ry="4.5" fill={eyePupil} />
          <circle cx="83" cy="104" r="2.5" fill={white} opacity="0.9" /><circle cx="123" cy="104" r="2.5" fill={white} opacity="0.9" />
          <path d="M68 99 Q80 93 92 99" stroke="#1a0a00" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M108 99 Q120 93 132 99" stroke="#1a0a00" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </g>);
    }
  };

  // Brow renderer
  const getBrows = () => {
    const brow = hair === '#F5DEB3' ? '#8B6914' : darken(hair, 0.05);
    switch (avatar.browStyle) {
      case 'br2': return <g><line x1="67" y1="92" x2="92" y2="92" stroke={brow} strokeWidth="3.5" strokeLinecap="round" /><line x1="108" y1="92" x2="133" y2="92" stroke={brow} strokeWidth="3.5" strokeLinecap="round" /></g>;
      case 'br3': return <g><path d="M67 98 Q80 83 93 94" stroke={brow} strokeWidth="3" fill="none" strokeLinecap="round" /><path d="M107 94 Q120 83 133 98" stroke={brow} strokeWidth="3" fill="none" strokeLinecap="round" /></g>;
      case 'br4': return <g><path d="M66 96 Q80 87 93 93" stroke={brow} strokeWidth="5.5" fill="none" strokeLinecap="round" /><path d="M107 93 Q120 87 134 96" stroke={brow} strokeWidth="5.5" fill="none" strokeLinecap="round" /></g>;
      case 'br5': return <g><path d="M70 93 Q80 89 91 93" stroke={brow} strokeWidth="1.8" fill="none" strokeLinecap="round" /><path d="M109 93 Q120 89 130 93" stroke={brow} strokeWidth="1.8" fill="none" strokeLinecap="round" /></g>;
      case 'br6': return <g><path d="M65 96 Q80 85 93 92" stroke={brow} strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.9" /><path d="M107 92 Q120 85 135 96" stroke={brow} strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.9" /></g>;
      default:    return <g><path d="M67 95 Q80 88 92 93" stroke={brow} strokeWidth="3" fill="none" strokeLinecap="round" /><path d="M108 93 Q120 88 133 95" stroke={brow} strokeWidth="3" fill="none" strokeLinecap="round" /></g>;
    }
  };

  // Nose renderer
  const getNose = () => {
    switch (avatar.noseStyle) {
      case 'ns2': return <g><line x1="100" y1="110" x2="100" y2="125" stroke={skinShadow} strokeWidth="1.8" strokeLinecap="round" opacity="0.5" /><ellipse cx="95" cy="125" rx="5" ry="2.5" fill={skinShadow} opacity="0.2" /><ellipse cx="105" cy="125" rx="5" ry="2.5" fill={skinShadow} opacity="0.2" /></g>;
      case 'ns3': return <g><path d="M96 115 Q100 125 104 115" stroke={skinShadow} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.55" /><ellipse cx="94" cy="124" rx="6" ry="3" fill={skinShadow} opacity="0.22" /><ellipse cx="106" cy="124" rx="6" ry="3" fill={skinShadow} opacity="0.22" /></g>;
      case 'ns4': return <g><path d="M100 110 Q100 120 100 126" stroke={skinShadow} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" /><ellipse cx="100" cy="126" rx="3" ry="2" fill={skinShadow} opacity="0.25" /></g>;
      case 'ns5': return <g><path d="M97 115 Q100 120 103 115" stroke={skinShadow} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.45" /><ellipse cx="97" cy="123" rx="4.5" ry="2.5" fill={skinShadow} opacity="0.2" /><ellipse cx="103" cy="123" rx="4.5" ry="2.5" fill={skinShadow} opacity="0.2" /></g>;
      case 'ns6': return <g><path d="M100 108 Q102 118 100 126" stroke={skinShadow} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" /><path d="M96 123 Q100 128 104 123" stroke={skinShadow} strokeWidth="1.5" fill="none" opacity="0.4" /></g>;
      default:    return <g><path d="M97 113 Q100 123 103 113" stroke={skinShadow} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.5" /><ellipse cx="95" cy="123" rx="4" ry="2.5" fill={skinShadow} opacity="0.18" /><ellipse cx="105" cy="123" rx="4" ry="2.5" fill={skinShadow} opacity="0.18" /></g>;
    }
  };

  // Lips renderer
  const getLips = () => {
    const lipColor = darken(skin, 0.22);
    switch (avatar.lipsStyle) {
      case 'lp2': return <g><path d="M85 136 Q100 148 115 136" stroke={lipColor} strokeWidth="2.5" fill="none" strokeLinecap="round" /><ellipse cx="100" cy="142" rx="11" ry="4" fill={lipColor} opacity="0.2" /></g>;
      case 'lp3': return <g><path d="M88 136 Q100 142 112 136" stroke={lipColor} strokeWidth="1.8" fill="none" strokeLinecap="round" /></g>;
      case 'lp4': return <g><path d="M87 135 Q93 130 100 133 Q107 130 113 135 Q100 145 87 135Z" stroke={lipColor} strokeWidth="1.5" fill={lipColor} fillOpacity="0.15" /></g>;
      case 'lp5': return <g><path d="M83 136 Q100 146 117 136" stroke={lipColor} strokeWidth="2.2" fill="none" strokeLinecap="round" /></g>;
      case 'lp6': return <g><path d="M87 135 Q100 150 113 135" stroke={lipColor} strokeWidth="2.5" fill="none" strokeLinecap="round" /><ellipse cx="100" cy="140" rx="9" ry="3.5" fill={lipColor} opacity="0.15" /></g>;
      default:    return <g><path d="M88 135 Q100 144 112 135" stroke={lipColor} strokeWidth="2.2" fill="none" strokeLinecap="round" /></g>;
    }
  };

  // Hair renderer
  const getHair = () => {
    const hs = avatar.hairStyle;
    switch (hs) {
      case 'hr2': return <g><path d="M44 106 Q43 72 60 57 Q80 42 100 42 Q120 42 140 57 Q157 72 156 106 Q148 88 140 78 Q124 52 100 50 Q76 52 60 78 Q52 88 44 106Z" fill={hair} /><rect x="43" y="98" width="18" height="92" rx="9" fill={hair} /><rect x="139" y="98" width="18" height="92" rx="9" fill={hair} /><line x1="49" y1="100" x2="51" y2="186" stroke={hairHighlight} strokeWidth="1" opacity="0.5" /><line x1="148" y1="100" x2="150" y2="186" stroke={hairHighlight} strokeWidth="1" opacity="0.5" /></g>;
      case 'hr3': return <g><circle cx="100" cy="62" r="50" fill={hair} />{[[67,52],[80,42],[95,36],[112,40],[128,52],[140,65],[138,80],[62,68],[100,32],[115,30]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="10" fill={hairShadow} opacity="0.3" />)}<circle cx="100" cy="62" r="46" fill="none" stroke={hairHighlight} strokeWidth="1.5" opacity="0.25" /></g>;
      case 'hr4': return <g><path d="M44 106 Q43 72 60 57 Q80 42 100 42 Q120 42 140 57 Q157 72 156 106 Q148 88 140 78 Q124 52 100 50 Q76 52 60 78 Q52 88 44 106Z" fill={hair} /><path d="M55 75 Q80 54 132 62 Q110 48 100 46 Q75 48 55 75Z" fill={hairShadow} opacity="0.4" /><path d="M55 75 Q82 57 130 63" stroke={hairHighlight} strokeWidth="1.5" fill="none" opacity="0.5" /></g>;
      case 'hr5': return <g><path d="M44 106 Q43 72 60 57 Q80 42 100 42 Q120 42 140 57 Q157 72 156 106 Q148 88 140 78 Q124 52 100 50 Q76 52 60 78 Q52 88 44 106Z" fill={hair} /><ellipse cx="100" cy="52" rx="9" ry="7" fill={hairShadow} /><path d="M95 52 Q86 40 90 18 Q95 8 100 6 Q105 8 110 18 Q114 40 105 52Z" fill={hair} /><line x1="100" y1="48" x2="100" y2="10" stroke={hairHighlight} strokeWidth="1.2" opacity="0.5" /></g>;
      case 'hr6': return <g><path d="M44 110 Q43 78 63 62 Q80 46 100 46 Q120 46 137 62 Q157 78 156 110 Q150 92 140 82 Q124 56 100 54 Q76 56 60 82 Q50 92 44 110Z" fill={hair} /></g>;
      case 'hr7': return <g><path d="M44 106 Q43 72 60 57 Q80 42 100 42 Q120 42 140 57 Q157 72 156 106 Q148 88 140 78 Q124 52 100 50 Q76 52 60 78 Q52 88 44 106Z" fill={hair} /><circle cx="74" cy="48" r="19" fill={hair} /><circle cx="126" cy="48" r="19" fill={hair} /><circle cx="74" cy="48" r="13" fill={hairShadow} opacity="0.35" /><circle cx="126" cy="48" r="13" fill={hairShadow} opacity="0.35" /></g>;
      case 'hr8': return <g><path d="M44 106 Q43 72 60 57 Q80 42 100 42 Q120 42 140 57 Q157 72 156 106 Q148 88 140 78 Q124 52 100 50 Q76 52 60 78 Q52 88 44 106Z" fill={hair} /><path d="M91 46 Q96 8 100 4 Q104 8 109 46Z" fill={hair} /><line x1="100" y1="46" x2="100" y2="7" stroke={hairHighlight} strokeWidth="1.5" opacity="0.6" /></g>;
      case 'hr9': return <g><path d="M44 106 Q43 72 60 57 Q80 42 100 42 Q120 42 140 57 Q157 72 156 106 Q148 88 140 78 Q124 52 100 50 Q76 52 60 78 Q52 88 44 106Z" fill={hair} /><path d="M50 70 Q70 58 92 86 Q112 58 132 74" stroke={hairShadow} strokeWidth="2.5" fill="none" opacity="0.5" /><path d="M39 100 Q60 78 82 105" stroke={hair} strokeWidth="5" fill="none" /></g>;
      case 'hr10': return <g><path d="M44 106 Q43 72 60 57 Q80 45 100 45 Q120 45 140 57 Q157 72 156 106 Q150 92 140 82 Q124 56 100 54 Q76 56 60 82 Q50 92 44 108Z" fill={hair} /><path d="M60 60 Q80 48 100 50 Q120 48 140 60" stroke={hairHighlight} strokeWidth="2" fill="none" opacity="0.5" /></g>;
      case 'hr11': return <g><path d="M44 106 Q43 72 60 57 Q80 42 100 42 Q120 42 140 57 Q157 72 156 106 Q148 88 140 78 Q124 52 100 50 Q76 52 60 78 Q52 88 44 106Z" fill={hair} /><path d="M54 96 Q49 130 54 175" stroke={hair} strokeWidth="14" fill="none" strokeDasharray="7 3" /><path d="M146 96 Q151 130 146 175" stroke={hair} strokeWidth="14" fill="none" strokeDasharray="7 3" /><line x1="47" y1="165" x2="61" y2="165" stroke="#00d4ff" strokeWidth="3" /><line x1="139" y1="165" x2="153" y2="165" stroke="#00d4ff" strokeWidth="3" /></g>;
      case 'hr12': return <g><path d="M44 106 Q43 72 60 57 Q80 42 100 42 Q120 42 140 57 Q157 72 156 106 Q148 88 140 78 Q124 52 100 50 Q76 52 60 78 Q52 88 44 106Z" fill={hair} /><rect x="42" y="95" width="22" height="45" rx="11" fill={hair} /><rect x="136" y="95" width="22" height="45" rx="11" fill={hair} /><line x1="48" y1="97" x2="50" y2="137" stroke={hairHighlight} strokeWidth="1" opacity="0.45" /><line x1="150" y1="97" x2="148" y2="137" stroke={hairHighlight} strokeWidth="1" opacity="0.45" /></g>;
      default: // hr1 Short Wavy
        return <g><path d="M44 106 Q43 72 60 57 Q80 42 100 42 Q120 42 140 57 Q157 72 156 106 Q148 88 140 78 Q124 52 100 50 Q76 52 60 78 Q52 88 44 106Z" fill={hair} /><path d="M44 106 Q50 80 60 68 Q76 54 100 52 Q124 54 140 68 Q150 80 156 106" fill="none" stroke={hairHighlight} strokeWidth="1.5" opacity="0.45" /></g>;
    }
  };

  // Beard renderer
  const getBeard = () => {
    const bc = darken(hair, 0.05);
    switch (avatar.beardStyle) {
      case 'bd0': return null;
      case 'bd1': // Stubble
        return <g opacity="0.5">{[80,88,96,104,112,120,75,84,100,116].map((x,i) => <circle key={i} cx={x} cy={138+((i%3)*4)} r="1.2" fill={bc} opacity="0.5" />)}</g>;
      case 'bd2': // Goatee
        return <g><path d="M90 138 Q100 155 110 138 Q100 165 90 138Z" fill={bc} opacity="0.85" /></g>;
      case 'bd3': // Full Beard
        return <g><path d="M60 125 Q58 150 70 162 Q84 175 100 178 Q116 175 130 162 Q142 150 140 125 Q120 140 100 140 Q80 140 60 125Z" fill={bc} opacity="0.88" /></g>;
      case 'bd4': // Moustache
        return <g><path d="M85 133 Q93 128 100 132 Q107 128 115 133 Q107 138 100 134 Q93 138 85 133Z" fill={bc} opacity="0.85" /></g>;
      case 'bd5': // Chinstrap
        return <g><path d="M60 120 Q56 148 66 162 Q74 170 100 172 Q126 170 134 162 Q144 148 140 120" stroke={bc} strokeWidth="5" fill="none" opacity="0.85" /></g>;
      case 'bd6': // Circle
        return <g><path d="M85 134 Q93 130 100 132 Q107 130 115 134 Q110 148 100 152 Q90 148 85 134Z" fill={bc} opacity="0.85" /></g>;
      case 'bd7': // Van Dyke
        return <g><path d="M85 133 Q93 128 100 131 Q107 128 115 133 Q107 137 100 134 Q93 137 85 133Z" fill={bc} opacity="0.8" /><path d="M91 140 Q100 158 109 140 Q100 168 91 140Z" fill={bc} opacity="0.85" /></g>;
      case 'bd8': // Balbo
        return <g><path d="M88 133 Q94 130 100 132 Q106 130 112 133 Q106 137 100 135 Q94 137 88 133Z" fill={bc} opacity="0.8" /><path d="M82 135 Q86 145 100 148 Q114 145 118 135 Q100 155 82 135Z" fill={bc} opacity="0.8" /></g>;
      default: return null;
    }
  };

  // Body/Outfit
  const getBody = () => {
    const outfitColors: Record<string, { main: string; accent: string }> = {
      of1: { main: '#1a0a1a', accent: '#ff0055' },
      of2: { main: '#2d0d2d', accent: '#e60039' },
      of3: { main: '#0d0d18', accent: '#ff0055' },
      of4: { main: '#18181b', accent: '#ff0055' },
      of5: { main: '#101015', accent: '#00d4ff' },
      of6: { main: '#333333', accent: '#ff4400' },
      of7: { main: '#0d1a2d', accent: '#00d4ff' },
      of8: { main: '#1a1a24', accent: '#00ff66' },
      of9: { main: '#1a0a00', accent: '#ffd700' },
    };
    const { main, accent } = outfitColors[avatar.outfitStyle] || outfitColors.of1;

    // Body type scale
    const bodyScale = avatar.bodyType === 'bt1' ? 0.88 : avatar.bodyType === 'bt3' ? 1.13 : avatar.bodyType === 'bt4' ? 0.82 : 1;
    const tx = (1 - bodyScale) * 100;

    return (
      <g transform={`translate(${tx}, 0) scale(${bodyScale}, 1)`}>
        {/* Torso */}
        <path d="M30 310 L30 184 Q40 170 62 166 L82 163 Q91 174 100 177 Q109 174 118 163 L138 166 Q160 170 170 184 L170 310Z" fill={main} />
        {/* Arms */}
        <rect x="16" y="175" width="22" height="80" rx="11" fill={skin} />
        <rect x="162" y="175" width="22" height="80" rx="11" fill={skin} />
        {/* Hands */}
        <ellipse cx="27" cy="256" rx="11" ry="9" fill={skin} />
        <ellipse cx="173" cy="256" rx="11" ry="9" fill={skin} />
        {/* Legs */}
        <rect x="55" y="308" width="32" height="100" rx="14" fill={darken(main, 0.12)} />
        <rect x="113" y="308" width="32" height="100" rx="14" fill={darken(main, 0.12)} />
        {/* Feet */}
        <ellipse cx="71" cy="408" rx="20" ry="10" fill={darken(main, 0.3)} />
        <ellipse cx="129" cy="408" rx="20" ry="10" fill={darken(main, 0.3)} />
        {/* Collar */}
        <path d="M82 163 Q100 174 118 163" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.8" />
        {/* Outfit detail */}
        {avatar.outfitStyle === 'of1' && <text x="100" y="218" textAnchor="middle" fontSize="10" fill={accent} fontFamily="monospace" fontWeight="bold" opacity="0.8">CYBER</text>}
        {avatar.outfitStyle === 'of2' && <rect x="82" y="235" width="36" height="22" rx="4" fill={darken(main, 0.15)} />}
        {avatar.outfitStyle === 'of3' && [195,210,225,240].map((y,i) => <circle key={i} cx="100" cy={y} r="2.5" fill={accent} opacity="0.8" />)}
        {avatar.outfitStyle === 'of4' && <><rect x="60" y="192" width="28" height="50" rx="3" fill={darken(main, 0.3)} opacity="0.8" /><rect x="112" y="192" width="28" height="50" rx="3" fill={darken(main, 0.3)} opacity="0.8" /></>}
        {avatar.outfitStyle === 'of5' && <><path d="M82 195 L118 195 L120 215 L100 218 L80 215Z" fill="none" stroke={accent} strokeWidth="1.5" /><circle cx="100" cy="205" r="5" fill={accent} opacity="0.7" /></>}
        {avatar.outfitStyle === 'of7' && <><path d="M62 166 L30 184" stroke={accent} strokeWidth="2.5" opacity="0.9" /><path d="M138 166 L170 184" stroke={accent} strokeWidth="2.5" opacity="0.9" /></>}
        {avatar.outfitStyle === 'of9' && <><ellipse cx="48" cy="178" rx="22" ry="14" fill={darken(main, 0.2)} /><ellipse cx="152" cy="178" rx="22" ry="14" fill={darken(main, 0.2)} /><ellipse cx="48" cy="176" rx="14" ry="8" fill={accent} opacity="0.6" /><ellipse cx="152" cy="176" rx="14" ry="8" fill={accent} opacity="0.6" /></>}
      </g>
    );
  };

  // Ear renderer
  const getEars = () => {
    switch (avatar.earStyle) {
      case 'ea2': return <g><ellipse cx="44" cy="110" rx="8" ry="10" fill={skin} /><ellipse cx="156" cy="110" rx="8" ry="10" fill={skin} /><ellipse cx="44" cy="110" rx="5" ry="7" fill={skinShadow} opacity="0.22" /><ellipse cx="156" cy="110" rx="5" ry="7" fill={skinShadow} opacity="0.22" /></g>;
      case 'ea3': return <g><ellipse cx="43" cy="110" rx="12" ry="16" fill={skin} /><ellipse cx="157" cy="110" rx="12" ry="16" fill={skin} /><ellipse cx="43" cy="110" rx="8" ry="11" fill={skinShadow} opacity="0.2" /><ellipse cx="157" cy="110" rx="8" ry="11" fill={skinShadow} opacity="0.2" /></g>;
      case 'ea4': return <g><path d="M34 95 Q36 108 35 122 Q44 126 45 110 Q46 96 40 90Z" fill={skin} /><path d="M166 95 Q164 108 165 122 Q156 126 155 110 Q154 96 160 90Z" fill={skin} /><ellipse cx="40" cy="110" rx="5" ry="8" fill={skinShadow} opacity="0.2" /><ellipse cx="160" cy="110" rx="5" ry="8" fill={skinShadow} opacity="0.2" /></g>;
      case 'ea5': return <g><ellipse cx="44" cy="110" rx="10" ry="13" fill={skin} /><ellipse cx="156" cy="110" rx="10" ry="13" fill={skin} /><ellipse cx="44" cy="110" rx="6" ry="8" fill={skinShadow} opacity="0.25" /><ellipse cx="156" cy="110" rx="6" ry="8" fill={skinShadow} opacity="0.25" /><circle cx="44" cy="120" r="4" fill="#ffd700" /><circle cx="156" cy="120" r="4" fill="#ffd700" /></g>;
      case 'ea6': return <g><ellipse cx="44" cy="110" rx="10" ry="13" fill={skin} /><ellipse cx="156" cy="110" rx="10" ry="13" fill={skin} /><ellipse cx="44" cy="110" rx="6" ry="8" fill={skinShadow} opacity="0.25" /><ellipse cx="156" cy="110" rx="6" ry="8" fill={skinShadow} opacity="0.25" /><circle cx="44" cy="122" r="3" fill="#c0c0c0" /><circle cx="156" cy="122" r="3" fill="#c0c0c0" /></g>;
      default: return <g><ellipse cx="44" cy="110" rx="10" ry="13" fill={skin} /><ellipse cx="156" cy="110" rx="10" ry="13" fill={skin} /><ellipse cx="44" cy="110" rx="6" ry="8" fill={skinShadow} opacity="0.25" /><ellipse cx="156" cy="110" rx="6" ry="8" fill={skinShadow} opacity="0.25" /></g>;
    }
  };

  const svgH = mini ? 80 : 420;
  const viewBox = mini ? "20 36 160 120" : "0 0 200 420";

  return (
    <svg
      viewBox={viewBox}
      width={size}
      height={mini ? size * 0.55 : size * 1.6}
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: mini ? 'none' : 'drop-shadow(0 12px 36px rgba(0,0,0,0.35))' }}
    >
      <defs>
        <radialGradient id="headGrad" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor={skinHighlight} />
          <stop offset="100%" stopColor={skinShadow} />
        </radialGradient>
        <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>

      {/* Body */}
      {!mini && getBody()}

      {/* Neck */}
      {!mini && <>
        <rect x="86" y="154" width="28" height="26" rx="8" fill={skin} />
        <rect x="89" y="154" width="7" height="22" rx="3.5" fill={skinShadow} opacity="0.3" />
      </>}

      {/* Ears (behind face) */}
      {getEars()}

      {/* Head - 3D illusion base */}
      {(() => {
        const p = getFacePath();
        // Replace fill with gradient for 3D depth
        return React.cloneElement(p as React.ReactElement<React.SVGProps<SVGElement>>, { fill: 'url(#headGrad)' });
      })()}

      {/* Forehead plane highlight */}
      <ellipse cx="100" cy="78" rx="32" ry="18" fill={skinHighlight} opacity="0.22" />

      {/* Cheek volume shading */}
      <ellipse cx="70" cy="120" rx="14" ry="20" fill={skinShadow} opacity="0.12" />
      <ellipse cx="130" cy="120" rx="14" ry="20" fill={skinShadow} opacity="0.12" />

      {/* Cheek blush */}
      <ellipse cx="72" cy="126" rx="13" ry="7" fill="#ff8fab" opacity="0.18" />
      <ellipse cx="128" cy="126" rx="13" ry="7" fill="#ff8fab" opacity="0.18" />

      {/* Chin shadow */}
      <ellipse cx="100" cy="157" rx="24" ry="9" fill={skinShadow} opacity="0.14" />

      {/* Brows */}
      {getBrows()}

      {/* Eyes */}
      {getEyes()}

      {/* Nose */}
      {getNose()}

      {/* Lips */}
      {getLips()}

      {/* Beard */}
      {getBeard()}

      {/* Hair (on top of face) */}
      {getHair()}
    </svg>
  );
};

// ─── Mini Face Thumbnail ──────────────────────────────────────────────────────

const MiniAvatar: React.FC<{ avatar: AvatarState }> = ({ avatar }) => (
  <AvatarSVG avatar={avatar} size={64} mini={true} />
);

// ─── Thumbnail Grid Option ────────────────────────────────────────────────────

interface ThumbCardProps {
  isSelected: boolean;
  onSelect: () => void;
  label: string;
  locked?: boolean;
  children: React.ReactNode;
  canDeselect?: boolean;
  onDeselect?: () => void;
}

const ThumbCard: React.FC<ThumbCardProps> = ({ isSelected, onSelect, label, locked, children }) => (
  <motion.button
    onClick={onSelect}
    whileTap={{ scale: locked ? 1 : 0.93 }}
    className={`relative flex flex-col items-center gap-1.5 p-2 rounded-2xl border-2 transition-all cursor-pointer w-full
      ${locked ? 'opacity-50 border-gray-200/30 bg-gray-100/10' :
        isSelected ? 'border-[#e8c84a] bg-[#fff9e0] shadow-[0_0_0_3px_rgba(232,200,74,0.25)]' :
        'border-transparent bg-gray-100/60 hover:bg-gray-200/70'
      }`}
  >
    <div className="flex items-center justify-center w-full h-14 rounded-xl overflow-hidden bg-gray-50/80">
      {children}
    </div>
    <span className="text-[10px] font-semibold text-gray-600 leading-tight text-center line-clamp-1">{label}</span>
    {isSelected && (
      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#e8c84a] flex items-center justify-center shadow-sm">
        <div className="w-2 h-2 rounded-full bg-white" />
      </div>
    )}
    {locked && (
      <div className="absolute top-1 right-1">
        <span className="text-[9px]">🔒</span>
      </div>
    )}
  </motion.button>
);

// ─── Color Grid ───────────────────────────────────────────────────────────────

const ColorGrid: React.FC<{
  colors: ColorOption[];
  selected: string;
  onSelect: (c: ColorOption) => void;
}> = ({ colors, selected, onSelect }) => (
  <div className="grid grid-cols-5 gap-3 p-1">
    {colors.map(c => (
      <button
        key={c.id}
        title={c.label}
        onClick={() => onSelect(c)}
        className={`w-12 h-12 rounded-full border-4 transition-all cursor-pointer hover:scale-110 mx-auto
          ${selected === c.id ? 'border-[#e8c84a] scale-110 shadow-[0_0_10px_rgba(232,200,74,0.6)]' : 'border-transparent shadow-md'}`}
        style={{ backgroundColor: c.hex }}
      />
    ))}
  </div>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AvatarCustomizerPage() {
  const router = useRouter();

  // Avatar state + history for undo/redo
  const [avatar, setAvatar] = useState<AvatarState>(DEFAULT_AVATAR);
  const [history, setHistory] = useState<AvatarState[]>([DEFAULT_AVATAR]);
  const [histIdx, setHistIdx] = useState(0);

  // UI state
  const [mainTab, setMainTab] = useState<MainTab>('avatar');
  const [subCat, setSubCat] = useState<AvatarSubCategory>('eyes');
  const [isSaving, setIsSaving] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const subScrollRef = useRef<HTMLDivElement>(null);

  const pushHistory = useCallback((next: AvatarState) => {
    setHistory(prev => {
      const sliced = prev.slice(0, histIdx + 1);
      return [...sliced, next];
    });
    setHistIdx(prev => prev + 1);
    setAvatar(next);
  }, [histIdx]);

  const undo = () => {
    if (histIdx > 0) {
      const newIdx = histIdx - 1;
      setHistIdx(newIdx);
      setAvatar(history[newIdx]);
    }
  };
  const redo = () => {
    if (histIdx < history.length - 1) {
      const newIdx = histIdx + 1;
      setHistIdx(newIdx);
      setAvatar(history[newIdx]);
    }
  };

  const update = (patch: Partial<AvatarState>) => {
    pushHistory({ ...avatar, ...patch });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => router.push('/dashboard'), 1000);
  };

  // Preview mini avatar with a single override applied
  const previewWith = (patch: Partial<AvatarState>): AvatarState => ({ ...avatar, ...patch });

  // Sub-category icon scroll to active
  const scrollSubToActive = (id: AvatarSubCategory) => {
    setSubCat(id);
    setTimeout(() => {
      const el = document.getElementById(`subcat-${id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }, 50);
  };

  // Render thumbnail grid for each sub-category
  const renderGrid = () => {
    switch (subCat) {
      case 'eyes':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {EYE_STYLES.map(opt => (
                <ThumbCard key={opt.id} isSelected={avatar.eyeStyle === opt.id} onSelect={() => update({ eyeStyle: opt.id })} label={opt.label}>
                  <MiniAvatar avatar={previewWith({ eyeStyle: opt.id })} />
                </ThumbCard>
              ))}
            </div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider pt-1">Eye Color</p>
            <ColorGrid colors={EYE_COLORS} selected={avatar.eyeColor} onSelect={c => update({ eyeColor: c.id })} />
          </div>
        );
      case 'brows':
        return (
          <div className="grid grid-cols-3 gap-2">
            {BROW_STYLES.map(opt => (
              <ThumbCard key={opt.id} isSelected={avatar.browStyle === opt.id} onSelect={() => update({ browStyle: opt.id })} label={opt.label}>
                <MiniAvatar avatar={previewWith({ browStyle: opt.id })} />
              </ThumbCard>
            ))}
          </div>
        );
      case 'nose':
        return (
          <div className="grid grid-cols-3 gap-2">
            {NOSE_STYLES.map(opt => (
              <ThumbCard key={opt.id} isSelected={avatar.noseStyle === opt.id} onSelect={() => update({ noseStyle: opt.id })} label={opt.label}>
                <MiniAvatar avatar={previewWith({ noseStyle: opt.id })} />
              </ThumbCard>
            ))}
          </div>
        );
      case 'face':
        return (
          <div className="grid grid-cols-3 gap-2">
            {FACE_SHAPES.map(opt => (
              <ThumbCard key={opt.id} isSelected={avatar.faceShape === opt.id} onSelect={() => update({ faceShape: opt.id })} label={opt.label}>
                <MiniAvatar avatar={previewWith({ faceShape: opt.id })} />
              </ThumbCard>
            ))}
          </div>
        );
      case 'lips':
        return (
          <div className="grid grid-cols-3 gap-2">
            {LIPS_STYLES.map(opt => (
              <ThumbCard key={opt.id} isSelected={avatar.lipsStyle === opt.id} onSelect={() => update({ lipsStyle: opt.id })} label={opt.label}>
                <MiniAvatar avatar={previewWith({ lipsStyle: opt.id })} />
              </ThumbCard>
            ))}
          </div>
        );
      case 'ears':
        return (
          <div className="grid grid-cols-3 gap-2">
            {EAR_STYLES.map(opt => (
              <ThumbCard key={opt.id} isSelected={avatar.earStyle === opt.id} onSelect={() => update({ earStyle: opt.id })} label={opt.label}>
                <MiniAvatar avatar={previewWith({ earStyle: opt.id })} />
              </ThumbCard>
            ))}
          </div>
        );
      case 'beard':
        return (
          <div className="grid grid-cols-3 gap-2">
            {BEARD_STYLES.map(opt => (
              <ThumbCard key={opt.id} isSelected={avatar.beardStyle === opt.id} onSelect={() => update({ beardStyle: opt.id })} label={opt.label}>
                <MiniAvatar avatar={previewWith({ beardStyle: opt.id })} />
              </ThumbCard>
            ))}
          </div>
        );
      case 'hair':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {HAIR_STYLES.map(opt => (
                <ThumbCard key={opt.id} isSelected={avatar.hairStyle === opt.id} onSelect={() => update({ hairStyle: opt.id })} label={opt.label}>
                  <MiniAvatar avatar={previewWith({ hairStyle: opt.id })} />
                </ThumbCard>
              ))}
            </div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider pt-1">Hair Color</p>
            <ColorGrid colors={HAIR_COLORS} selected={avatar.hairColor} onSelect={c => update({ hairColor: c.id })} />
          </div>
        );
      case 'skin':
        return (
          <div className="space-y-3">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Skin Tone</p>
            <ColorGrid colors={SKIN_TONES} selected={avatar.skinTone} onSelect={c => update({ skinTone: c.id })} />
          </div>
        );
      case 'body':
        return (
          <div className="grid grid-cols-2 gap-3">
            {BODY_TYPES.map(opt => (
              <ThumbCard key={opt.id} isSelected={avatar.bodyType === opt.id} onSelect={() => update({ bodyType: opt.id })} label={opt.label}>
                <MiniAvatar avatar={previewWith({ bodyType: opt.id })} />
              </ThumbCard>
            ))}
          </div>
        );
      default: return null;
    }
  };

  // Fashion tab content
  const renderFashion = () => (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-1">Outfit Style</p>
      <div className="grid grid-cols-3 gap-2">
        {OUTFIT_STYLES.map(opt => (
          <ThumbCard key={opt.id} isSelected={avatar.outfitStyle === opt.id} onSelect={() => { if (!opt.locked) update({ outfitStyle: opt.id }); }} label={opt.label} locked={opt.locked}>
            <MiniAvatar avatar={previewWith({ outfitStyle: opt.id })} />
          </ThumbCard>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 flex flex-col select-none overflow-hidden"
      style={{ background: 'linear-gradient(170deg, #dce3ec 0%, #c8d4e0 45%, #bfcfdf 100%)' }}
    >
      {/* ── Top Bar ── */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 pt-safe pt-3 pb-2 z-30">
        <button
          onClick={() => router.push('/dashboard')}
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-md text-gray-600 hover:bg-white transition-all active:scale-90"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
        </button>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 rounded-full bg-white/90 backdrop-blur text-gray-800 font-bold text-sm shadow-md hover:bg-white transition-all active:scale-90 disabled:opacity-60"
        >
          {isSaving ? (
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
              Saving…
            </span>
          ) : 'Save'}
        </button>
      </div>

      {/* ── Avatar Preview ── */}
      <div className="flex-1 relative flex flex-col items-center justify-end pb-4 min-h-0">
        {/* Subtle radial stage glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-24 rounded-full blur-2xl opacity-40 pointer-events-none"
          style={{ backgroundColor: getSkinColor(avatar.skinTone) }}
        />
        {/* Ellipse shadow under feet */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-40 h-5 rounded-full bg-black/20 blur-md pointer-events-none" />

        <motion.div
          key={JSON.stringify(avatar)}
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative z-10"
          style={{ animation: 'avatarBob 3s ease-in-out infinite' }}
        >
          <AvatarSVG avatar={avatar} size={210} />
        </motion.div>

        {/* Undo / Redo */}
        <div className="absolute bottom-5 left-4 flex gap-2 z-20">
          <button
            onClick={undo}
            disabled={histIdx <= 0}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-md text-gray-600 hover:bg-white transition-all active:scale-90 disabled:opacity-35"
            aria-label="Undo"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 6H10a4 4 0 0 1 0 8H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M3 6L6 3M3 6L6 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button
            onClick={redo}
            disabled={histIdx >= history.length - 1}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-md text-gray-600 hover:bg-white transition-all active:scale-90 disabled:opacity-35"
            aria-label="Redo"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 6H6a4 4 0 0 0 0 8H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M13 6L10 3M13 6L10 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>

      {/* ── Bottom Sheet ── */}
      <div
        className="flex-shrink-0 rounded-t-3xl shadow-2xl z-20"
        style={{
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(20px)',
          maxHeight: '52vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-2.5 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* ── Main Tabs ── */}
        <div className="flex border-b border-gray-100 flex-shrink-0">
          {(['fashion', 'wardrobe', 'avatar'] as MainTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setMainTab(tab)}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex flex-col items-center gap-1
                ${mainTab === tab ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <span className="text-base">
                {tab === 'fashion' ? '🏪' : tab === 'wardrobe' ? '🤍' : '🧑'}
              </span>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* ── Avatar Sub-category Icon Row ── */}
        {mainTab === 'avatar' && (
          <div
            ref={subScrollRef}
            className="flex-shrink-0 flex gap-0 overflow-x-auto border-b border-gray-100 px-1"
            style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {AVATAR_SUB_CATEGORIES.map(cat => (
              <button
                id={`subcat-${cat.id}`}
                key={cat.id}
                onClick={() => scrollSubToActive(cat.id)}
                className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-2.5 relative cursor-pointer transition-all
                  ${subCat === cat.id ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="text-[9px] font-semibold">{cat.label}</span>
                {subCat === cat.id && (
                  <motion.div layoutId="subcat-indicator" className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-gray-900" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* ── Tab Content (scrollable) ── */}
        <div className="flex-1 overflow-y-auto px-4 py-3" style={{ scrollbarWidth: 'none' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${mainTab}-${subCat}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {mainTab === 'avatar' && renderGrid()}
              {mainTab === 'fashion' && renderFashion()}
              {mainTab === 'wardrobe' && (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                  <span className="text-4xl">🧺</span>
                  <p className="text-sm font-semibold text-gray-500">Your wardrobe is empty</p>
                  <p className="text-xs text-gray-400">Purchase outfits from the Fashion tab</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bob animation */}
      <style jsx global>{`
        @keyframes avatarBob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

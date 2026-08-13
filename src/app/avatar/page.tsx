'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────

type MainTab = 'fashion' | 'wardrobe' | 'avatar';

type AvatarSubCategory =
  | 'gender'
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
  gender: 'male' | 'female';
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

const GENDER_OPTIONS: { id: 'male' | 'female'; label: string; icon: string; desc: string }[] = [
  { id: 'male',     label: 'Male',       icon: '♂',  desc: 'Broad shoulders, angular jaw' },
  { id: 'female',   label: 'Female',     icon: '♀',  desc: 'Softer curves, fuller lips' },
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
  gender: 'male',
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
  { id: 'gender', label: 'Gender', icon: '⚧️' },
  { id: 'eyes',   label: 'Eyes',   icon: '👁'  },
  { id: 'brows',  label: 'Brows',  icon: '〰️'  },
  { id: 'nose',   label: 'Nose',   icon: '👃'  },
  { id: 'face',   label: 'Face',   icon: '⬮'  },
  { id: 'lips',   label: 'Lips',   icon: '💋'  },
  { id: 'ears',   label: 'Ears',   icon: '👂'  },
  { id: 'beard',  label: 'Beard',  icon: '🧔'  },
  { id: 'hair',   label: 'Hair',   icon: '💇'  },
  { id: 'skin',   label: 'Skin',   icon: '🎨'  },
  { id: 'body',   label: 'Body',   icon: '🚶'  },
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

  // Hair renderer — base cap: M43 108 to Q157 72 157 108 eliminates the ~2px skin gap
  // Inner return path traces slightly inside the head so fill covers scalp fully
  const CAP = `M39 112 Q39 65 60 50 Q80 35 100 35 Q120 35 141 50 Q161 65 161 112 Q150 88 140 76 Q124 48 100 46 Q76 48 60 76 Q50 88 39 112Z`;
  const getHair = () => {
    const hs = avatar.hairStyle;
    switch (hs) {
      case 'hr2': return <g><path d={CAP} fill={hair} /><rect x="38" y="97" width="22" height="94" rx="11" fill={hair} /><rect x="140" y="97" width="22" height="94" rx="11" fill={hair} /><line x1="49" y1="100" x2="51" y2="188" stroke={hairHighlight} strokeWidth="1.5" opacity="0.45" /><line x1="148" y1="100" x2="150" y2="188" stroke={hairHighlight} strokeWidth="1.5" opacity="0.45" /></g>;
      case 'hr3': return <g><circle cx="100" cy="62" r="54" fill={hair} />{[[67,52],[80,42],[95,36],[112,40],[128,52],[140,65],[138,80],[62,68],[100,32],[115,30]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="12" fill={hairShadow} opacity="0.4" />)}<circle cx="100" cy="62" r="49" fill="none" stroke={hairHighlight} strokeWidth="1.5" opacity="0.25" /></g>;
      case 'hr4': return <g><path d={CAP} fill={hair} /><path d="M52 78 Q80 54 132 62 Q110 48 100 46 Q75 48 52 78Z" fill={hairShadow} opacity="0.5" /><path d="M52 78 Q82 57 130 63" stroke={hairHighlight} strokeWidth="2" fill="none" opacity="0.6" /></g>;
      case 'hr5': return <g><path d={CAP} fill={hair} /><ellipse cx="100" cy="52" rx="10" ry="8" fill={hairShadow} /><path d="M95 52 Q86 40 90 18 Q95 8 100 6 Q105 8 110 18 Q114 40 105 52Z" fill={hair} /><line x1="100" y1="48" x2="100" y2="10" stroke={hairHighlight} strokeWidth="1.5" opacity="0.5" /></g>;
      case 'hr6': return <g><path d="M40 110 Q40 75 62 58 Q80 42 100 42 Q120 42 138 58 Q160 75 160 110 Q150 90 140 80 Q124 52 100 50 Q76 52 60 80 Q50 90 40 110Z" fill={hair} /></g>;
      case 'hr7': return <g><path d={CAP} fill={hair} /><circle cx="72" cy="46" r="21" fill={hair} /><circle cx="128" cy="46" r="21" fill={hair} /><circle cx="72" cy="46" r="14" fill={hairShadow} opacity="0.4" /><circle cx="128" cy="46" r="14" fill={hairShadow} opacity="0.4" /></g>;
      case 'hr8': return <g><path d={CAP} fill={hair} /><path d="M91 46 Q96 8 100 4 Q104 8 109 46Z" fill={hair} /><line x1="100" y1="46" x2="100" y2="7" stroke={hairHighlight} strokeWidth="1.5" opacity="0.6" /></g>;
      case 'hr9': return <g><path d={CAP} fill={hair} /><path d="M50 70 Q70 58 92 86 Q112 58 132 74" stroke={hairShadow} strokeWidth="2.5" fill="none" opacity="0.5" /><path d="M38 100 Q60 78 82 105" stroke={hair} strokeWidth="6" fill="none" /></g>;
      case 'hr10': return <g><path d={CAP} fill={hair} /><path d="M60 60 Q80 48 100 50 Q120 48 140 60" stroke={hairHighlight} strokeWidth="2" fill="none" opacity="0.5" /></g>;
      case 'hr11': return <g><path d={CAP} fill={hair} /><path d="M54 96 Q49 132 54 178" stroke={hair} strokeWidth="14" fill="none" strokeDasharray="7 3" /><path d="M146 96 Q151 132 146 178" stroke={hair} strokeWidth="14" fill="none" strokeDasharray="7 3" /><line x1="47" y1="168" x2="61" y2="168" stroke="#00d4ff" strokeWidth="3" /><line x1="139" y1="168" x2="153" y2="168" stroke="#00d4ff" strokeWidth="3" /></g>;
      case 'hr12': return <g><path d={CAP} fill={hair} /><rect x="42" y="94" width="23" height="48" rx="11.5" fill={hair} /><rect x="135" y="94" width="23" height="48" rx="11.5" fill={hair} /><line x1="48" y1="96" x2="50" y2="140" stroke={hairHighlight} strokeWidth="1" opacity="0.45" /><line x1="150" y1="96" x2="148" y2="140" stroke={hairHighlight} strokeWidth="1" opacity="0.45" /></g>;
      default: // hr1 Short Wavy
        return <g><path d={CAP} fill={hair} /><path d="M43 108 Q50 80 60 68 Q76 54 100 52 Q124 54 140 68 Q150 80 157 108" fill="none" stroke={hairHighlight} strokeWidth="1.5" opacity="0.45" /></g>;
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

  // Body/Outfit — gender affects shoulder width, waist taper, hip width
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

    const isFemale = avatar.gender === 'female';
    const bodyScale = avatar.bodyType === 'bt1' ? 0.88 : avatar.bodyType === 'bt3' ? 1.13 : avatar.bodyType === 'bt4' ? 0.82 : 1;
    const tx = (1 - bodyScale) * 100;

    // Organic measurements
    const armW = isFemale ? 18 : 24;
    const legW = isFemale ? 30 : 36;
    const shoulderL = isFemale ? 52 : 40;
    const shoulderR = isFemale ? 148 : 160;
    const waistL = isFemale ? 72 : 62;
    const waistR = isFemale ? 128 : 138;
    const hipL = isFemale ? 58 : 64;
    const hipR = isFemale ? 142 : 136;

    // Smooth, contoured torso
    const torsoPath = `
      M 86 160 
      Q 100 172 114 160 
      Q ${shoulderR} 160 ${shoulderR} 175 
      C ${shoulderR} 210 ${waistR} 230 ${waistR} 255
      C ${waistR} 280 ${hipR} 300 ${hipR} 315
      L ${hipL} 315
      C ${hipL} 300 ${waistL} 280 ${waistL} 255
      C ${waistL} 230 ${shoulderL} 210 ${shoulderL} 175
      Q ${shoulderL} 160 86 160 Z
    `;

    return (
      <g transform={`translate(${tx}, 0) scale(${bodyScale}, 1)`}>
        {/* Arms (Skin) */}
        <path d={`M ${shoulderL + 4} 175 Q ${shoulderL - 16} 220 ${shoulderL - 8} 265`} stroke={skin} strokeWidth={armW} strokeLinecap="round" fill="none" />
        <path d={`M ${shoulderR - 4} 175 Q ${shoulderR + 16} 220 ${shoulderR + 8} 265`} stroke={skin} strokeWidth={armW} strokeLinecap="round" fill="none" />
        
        {/* Hands */}
        <ellipse cx={shoulderL - 8} cy="275" rx={armW/2 + 1} ry={armW/2 + 4} fill={skin} />
        <ellipse cx={shoulderR + 8} cy="275" rx={armW/2 + 1} ry={armW/2 + 4} fill={skin} />

        {/* Legs (Pants) */}
        <path d={`M ${hipL + 12} 310 Q ${hipL + 4} 360 ${hipL + 4} 405`} stroke={darken(main, 0.12)} strokeWidth={legW} strokeLinecap="round" fill="none" />
        <path d={`M ${hipR - 12} 310 Q ${hipR - 4} 360 ${hipR - 4} 405`} stroke={darken(main, 0.12)} strokeWidth={legW} strokeLinecap="round" fill="none" />

        {/* Feet */}
        <ellipse cx={hipL} cy="415" rx={legW/2 + 4} ry="12" fill={darken(main, 0.3)} />
        <ellipse cx={hipR} cy="415" rx={legW/2 + 4} ry="12" fill={darken(main, 0.3)} />

        {/* Sleeves (Outfit) */}
        <path d={`M ${shoulderL + 4} 175 Q ${shoulderL - 8} 205 ${shoulderL - 10} 215`} stroke={main} strokeWidth={armW + 2} strokeLinecap="round" fill="none" />
        <path d={`M ${shoulderR - 4} 175 Q ${shoulderR + 8} 205 ${shoulderR + 10} 215`} stroke={main} strokeWidth={armW + 2} strokeLinecap="round" fill="none" />

        {/* Torso (Outfit) */}
        <path d={torsoPath} fill={main} />
        
        {/* Female Chest detail */}
        {isFemale && <>
          <path d={`M 75 210 Q 86 222 100 216 Q 114 222 125 210`} stroke={darken(main, 0.18)} strokeWidth="2" fill="none" opacity="0.6" />
        </>}

        {/* Collar detail */}
        <path d="M 86 160 Q 100 172 114 160" fill="none" stroke={accent} strokeWidth="2.5" opacity="0.9" />

        {/* Outfit accents based on style */}
        {avatar.outfitStyle === 'of1' && <text x="100" y="210" textAnchor="middle" fontSize="12" fill={accent} fontFamily="monospace" fontWeight="bold" opacity="0.8">CYBER</text>}
        {avatar.outfitStyle === 'of2' && <rect x="80" y="230" width="40" height="24" rx="6" fill={darken(main, 0.15)} />}
        {avatar.outfitStyle === 'of3' && [190, 210, 230, 250].map((y,i) => <circle key={i} cx="100" cy={y} r="3" fill={accent} opacity="0.8" />)}
        {avatar.outfitStyle === 'of4' && <><rect x="65" y="185" width="30" height="55" rx="4" fill={darken(main, 0.3)} opacity="0.8" /><rect x="105" y="185" width="30" height="55" rx="4" fill={darken(main, 0.3)} opacity="0.8" /></>}
        {avatar.outfitStyle === 'of5' && <><path d="M 80 190 L 120 190 L 125 215 L 100 220 L 75 215 Z" fill="none" stroke={accent} strokeWidth="2" /><circle cx="100" cy="205" r="6" fill={accent} opacity="0.8" /></>}
        {avatar.outfitStyle === 'of7' && <><path d="M 60 170 L 30 190" stroke={accent} strokeWidth="3" opacity="0.9" /><path d="M 140 170 L 170 190" stroke={accent} strokeWidth="3" opacity="0.9" /></>}
        {avatar.outfitStyle === 'of9' && <><ellipse cx="48" cy="180" rx="24" ry="16" fill={darken(main, 0.2)} /><ellipse cx="152" cy="180" rx="24" ry="16" fill={darken(main, 0.2)} /><ellipse cx="48" cy="180" rx="14" ry="8" fill={accent} opacity="0.7" /><ellipse cx="152" cy="180" rx="14" ry="8" fill={accent} opacity="0.7" /></>}
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

  // mini viewBox: x30 y32 covers from just above hair (y=42) to chin (y=168), 140px wide
  const viewBox = mini ? "30 32 140 140" : "0 0 200 420";

  return (
    <svg
      viewBox={viewBox}
      width={size}
      height={mini ? size * 0.72 : size * 1.6}
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
  onDelete?: (e: React.MouseEvent) => void;
}

const ThumbCard: React.FC<ThumbCardProps> = ({ isSelected, onSelect, label, locked, children, onDelete }) => (
  <motion.div
    onClick={onSelect}
    whileTap={{ scale: locked ? 1 : 0.93 }}
    className={`relative flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-all cursor-pointer w-full
      ${locked ? 'opacity-50 border-[#ff0055]/10 bg-[#050008]' :
        isSelected ? 'border-[#ff0055] bg-[#ff0055]/10 shadow-[0_0_15px_rgba(255,0,85,0.3)]' :
        'border-zinc-800 bg-[#0a030d] hover:border-[#ff0055]/40'
      }`}
  >
    <div className="flex items-center justify-center w-full h-14 rounded-xl overflow-hidden bg-black/50">
      {children}
    </div>
    <span className="text-[10px] font-mono font-semibold text-zinc-300 leading-tight text-center line-clamp-1">{label}</span>
    {isSelected && (
      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#ff0055] flex items-center justify-center shadow-sm">
        <div className="w-2 h-2 rounded-full bg-white" />
      </div>
    )}
    {locked && (
      <div className="absolute top-1 right-1">
        <span className="text-[9px]">🔒</span>
      </div>
    )}
    {onDelete && (
      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(e); }}
        className="absolute top-1 left-1 w-5 h-5 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center shadow-sm transition-colors z-10"
        title="Delete Design"
      >
        <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
      </button>
    )}
  </motion.div>
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
        className={`w-12 h-12 rounded-full border-2 transition-all cursor-pointer hover:scale-110 mx-auto
          ${selected === c.id ? 'border-[#ff0055] scale-110 shadow-[0_0_15px_rgba(255,0,85,0.6)]' : 'border-transparent shadow-md'}`}
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
  const [subCat, setSubCat] = useState<AvatarSubCategory>('gender');
  const [isSaving, setIsSaving] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [savedWardrobe, setSavedWardrobe] = useState<AvatarState[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('cyberWardrobe');
    if (stored) {
      try {
        setSavedWardrobe(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

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
    
    const newWardrobe = [...savedWardrobe, avatar];
    setSavedWardrobe(newWardrobe);
    localStorage.setItem('cyberWardrobe', JSON.stringify(newWardrobe));

    setShowSaveMessage(true);
    setTimeout(() => {
      setShowSaveMessage(false);
      setIsSaving(false);
      setMainTab('wardrobe');
    }, 2500);
  };

  const handleDeleteDesign = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    const newWardrobe = savedWardrobe.filter((_, i) => i !== idx);
    setSavedWardrobe(newWardrobe);
    localStorage.setItem('cyberWardrobe', JSON.stringify(newWardrobe));
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
      case 'gender':
        return (
          <div className="space-y-3">
            <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider text-center pb-1">
              Choose your avatar style
            </p>
            <div className="grid grid-cols-3 gap-3">
              {GENDER_OPTIONS.map(g => (
                <motion.button
                  key={g.id}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => update({ gender: g.id })}
                  className={`flex flex-col items-center gap-2 py-4 px-2 rounded-2xl border transition-all cursor-pointer
                    ${ avatar.gender === g.id
                      ? 'border-[#ff0055] bg-[#ff0055]/10 shadow-[0_0_15px_rgba(255,0,85,0.3)]'
                      : 'border-zinc-800 bg-[#0a030d] hover:border-[#ff0055]/40'
                    }`}
                >
                  <span className="text-3xl">{g.icon}</span>
                  <span className="text-xs font-mono font-bold text-white">{g.label}</span>
                  <span className="text-[9px] text-zinc-400 font-mono text-center leading-tight">{g.desc}</span>
                  {avatar.gender === g.id && (
                    <div className="w-4 h-4 rounded-full bg-[#ff0055] flex items-center justify-center mt-1">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        );
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
            <p className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider pt-1">Eye Color</p>
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
            <p className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider pt-1">Hair Color</p>
            <ColorGrid colors={HAIR_COLORS} selected={avatar.hairColor} onSelect={c => update({ hairColor: c.id })} />
          </div>
        );
      case 'skin':
        return (
          <div className="space-y-3">
            <p className="text-[11px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">Skin Tone</p>
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
      <p className="text-[11px] font-mono font-semibold text-zinc-500 uppercase tracking-wider px-1">Outfit Style</p>
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
      className="fixed inset-0 flex flex-col select-none overflow-hidden bg-black text-white"
    >
      {/* Ambient glow matching dashboard */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#ff0055]/15 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#e60039]/15 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Save Success Message Overlay */}
      <AnimatePresence>
        {showSaveMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="absolute top-20 left-1/2 z-50 bg-[#ff0055]/20 border border-[#ff0055]/40 text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-mono backdrop-blur-md shadow-[0_0_15px_rgba(255,0,85,0.4)] whitespace-nowrap text-center"
          >
            <span className="text-[#ff0055] font-bold mr-2">SUCCESS:</span>
            Your changes have been saved and you can see it in the Wardrobe.
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top Bar ── */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 pt-safe pt-3 pb-2 z-30 relative">
        <button
          onClick={() => router.push('/dashboard')}
          className="p-2.5 rounded-xl bg-[#0e0414] border border-[#ff0055]/30 text-[#ff0055] hover:bg-[#ff0055] hover:text-white transition-all shadow-[0_0_10px_rgba(255,0,85,0.2)]"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
        </button>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff0055] to-[#e60039] hover:from-[#e60039] hover:to-[#ff0055] text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,0,85,0.5)] border border-white/20 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
              Saving…
            </>
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
            className="w-10 h-10 rounded-xl bg-[#0e0414] border border-[#ff0055]/30 flex items-center justify-center shadow-[0_0_10px_rgba(255,0,85,0.2)] text-[#ff0055] hover:bg-[#ff0055] hover:text-white transition-all active:scale-90 disabled:opacity-35"
            aria-label="Undo"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 6H10a4 4 0 0 1 0 8H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M3 6L6 3M3 6L6 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button
            onClick={redo}
            disabled={histIdx >= history.length - 1}
            className="w-10 h-10 rounded-xl bg-[#0e0414] border border-[#ff0055]/30 flex items-center justify-center shadow-[0_0_10px_rgba(255,0,85,0.2)] text-[#ff0055] hover:bg-[#ff0055] hover:text-white transition-all active:scale-90 disabled:opacity-35"
            aria-label="Redo"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 6H6a4 4 0 0 0 0 8H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M13 6L10 3M13 6L10 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>

      {/* ── Bottom Sheet ── */}
      <div
        className="flex-shrink-0 rounded-t-3xl shadow-[0_-10px_40px_rgba(255,0,85,0.15)] z-20 relative border-t border-[#ff0055]/30"
        style={{
          background: 'rgba(10, 3, 13, 0.85)',
          backdropFilter: 'blur(20px)',
          maxHeight: '52vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-12 h-1.5 rounded-full bg-[#ff0055]/40" />
        </div>

        {/* ── Main Tabs ── */}
        <div className="flex border-b border-[#ff0055]/30 flex-shrink-0">
          {(['fashion', 'wardrobe', 'avatar'] as MainTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setMainTab(tab)}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex flex-col items-center gap-1 font-mono
                ${mainTab === tab ? 'text-[#ff0055] border-b-2 border-[#ff0055] bg-[#ff0055]/10' : 'text-zinc-500 hover:text-zinc-300'}`}
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
            className="flex-shrink-0 flex gap-0 overflow-x-auto border-b border-[#ff0055]/20 px-1"
            style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {AVATAR_SUB_CATEGORIES.map(cat => (
              <button
                id={`subcat-${cat.id}`}
                key={cat.id}
                onClick={() => scrollSubToActive(cat.id)}
                className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-2.5 relative cursor-pointer transition-all font-mono
                  ${subCat === cat.id ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="text-[9px] font-semibold">{cat.label}</span>
                {subCat === cat.id && (
                  <motion.div layoutId="subcat-indicator" className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#ff0055]" />
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
                savedWardrobe.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                    <span className="text-4xl">🧺</span>
                    <p className="text-sm font-semibold text-zinc-400 font-mono">Your wardrobe is empty</p>
                    <p className="text-xs text-zinc-500 font-mono">Save avatars to add them to your wardrobe</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-[11px] font-mono font-semibold text-zinc-500 uppercase tracking-wider px-1">Saved Designs</p>
                    <div className="grid grid-cols-3 gap-2">
                      {savedWardrobe.map((savedAvatar, idx) => (
                        <ThumbCard 
                          key={idx} 
                          isSelected={JSON.stringify(avatar) === JSON.stringify(savedAvatar)} 
                          onSelect={() => pushHistory(savedAvatar)} 
                          onDelete={(e) => handleDeleteDesign(e, idx)}
                          label={`Design ${idx + 1}`}
                        >
                          <MiniAvatar avatar={savedAvatar} />
                        </ThumbCard>
                      ))}
                    </div>
                  </div>
                )
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

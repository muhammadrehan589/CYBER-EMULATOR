import React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type MainTab = 'wardrobe' | 'avatar';

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
  | 'skin'
  | 'clothes';

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

import type { AvatarState } from '@/types/avatar';
export type { AvatarState };

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
  { id: 'm_of1', label: 'Cyber Tee' },
  { id: 'm_of2', label: 'Corporate Suit' },
  { id: 'm_of3', label: 'Streetwear Hoodie' },
  { id: 'm_of4', label: 'Tactical Vest' },
  { id: 'm_of5', label: 'Netrunner Suit' },
  { id: 'm_of6', label: 'Punk Vest' },
  { id: 'm_of7', label: 'Techwear Poncho' },
  { id: 'm_of8', label: 'Minimalist Tee' },
  { id: 'm_of9', label: 'Racer Jacket' },
  { id: 'm_of10', label: 'Neon Samurai' },
  { id: 'm_of11', label: 'Mecha Suit' },
  { id: 'm_of12', label: 'Hacker Cloak' },
  { id: 'm_of13', label: 'Mercenary Gear' },
  { id: 'm_of14', label: 'Nomad Duster' },
  { id: 'm_of15', label: 'Corp Sec Armor' },

  { id: 'f_of1', label: 'Cyber Crop' },
  { id: 'f_of2', label: 'Neon Corset' },
  { id: 'f_of3', label: 'Techwear Dress' },
  { id: 'f_of4', label: 'Tactical Bra' },
  { id: 'f_of5', label: 'Netrunner Bodysuit' },
  { id: 'f_of6', label: 'Streetwear Top' },
  { id: 'f_of7', label: 'Techwear Jacket' },
  { id: 'f_of8', label: 'Minimalist Crop' },
  { id: 'f_of9', label: 'Racer Suit' },
  { id: 'f_of10', label: 'Neon Kunoichi' },
  { id: 'f_of11', label: 'Mecha Suit' },
  { id: 'f_of12', label: 'Hacker Cloak' },
  { id: 'f_of13', label: 'Mercenary Gear' },
  { id: 'f_of14', label: 'Nomad Vest' },
  { id: 'f_of15', label: 'Corp Sec Dress' },
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
  outfitStyle: 'm_of1',
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
  { id: 'clothes', label: 'Clothes', icon: '👕'  },
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
  pose?: 'idle' | 'firingRight' | 'firingLeft';
}

const AvatarSVG: React.FC<AvatarSVGProps> = ({ avatar, size = 260, mini = false, pose = 'idle' }) => {
  // 🛡️ SAFETY SHIELD: If no avatar data exists, render a placeholder
  if (!avatar) {
    return (
      <div 
        style={{ width: size, height: size }} 
        className="bg-gray-800 rounded-full flex items-center justify-center text-gray-500 border border-gray-700"
      >
        👤
      </div>
    );
  }

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
      case 'ns2': // Straight Long Nose
        return <g>
          <path d="M 97 100 L 97 125 L 103 125 L 103 100 Z" fill={skinShadow} opacity="0.2" />
          <path d="M 95 125 Q 100 129 105 125 Q 100 127 95 125 Z" fill={skinShadow} opacity="0.6" />
          <path d="M 93 123 Q 90 127 95 127 Q 95 124 93 123 Z" fill={skinShadow} opacity="0.7" />
          <path d="M 107 123 Q 110 127 105 127 Q 105 124 107 123 Z" fill={skinShadow} opacity="0.7" />
          <rect x="99" y="105" width="2" height="15" rx="1" fill="#ffffff" opacity="0.2" />
        </g>;
      case 'ns3': // Wide Button Nose
        return <g>
          <path d="M 95 110 C 92 120, 94 125, 100 126 C 106 125, 108 120, 105 110" fill="none" stroke={skinShadow} strokeWidth="2" opacity="0.3" />
          <path d="M 92 122 C 92 127, 108 127, 108 122 C 105 125, 95 125, 92 122 Z" fill={skinShadow} opacity="0.5" />
          <path d="M 88 122 C 85 126, 92 128, 94 125 Z" fill={skinShadow} opacity="0.8" />
          <path d="M 112 122 C 115 126, 108 128, 106 125 Z" fill={skinShadow} opacity="0.8" />
          <circle cx="100" cy="120" r="3" fill="#ffffff" opacity="0.25" />
        </g>;
      case 'ns4': // Upturned Nose (Cute)
        return <g>
          <path d="M 97 105 Q 98 115 95 120 Q 100 124 105 120 Q 102 115 103 105" fill={skinShadow} opacity="0.2" />
          <path d="M 94 119 C 96 124, 104 124, 106 119 C 103 122, 97 122, 94 119 Z" fill={skinShadow} opacity="0.5" />
          <circle cx="92" cy="122" r="1.5" fill={skinShadow} opacity="0.6" />
          <circle cx="108" cy="122" r="1.5" fill={skinShadow} opacity="0.6" />
          <ellipse cx="100" cy="116" rx="3" ry="2" fill="#ffffff" opacity="0.35" />
        </g>;
      case 'ns5': // Angular / Aquiline Nose
        return <g>
          <path d="M 98 100 L 95 115 L 98 126 L 102 126 L 105 115 L 102 100 Z" fill={skinShadow} opacity="0.2" />
          <path d="M 95 125 L 100 128 L 105 125 Z" fill={skinShadow} opacity="0.6" />
          <path d="M 93 122 L 91 125 L 95 126 Z" fill={skinShadow} opacity="0.8" />
          <path d="M 107 122 L 109 125 L 105 126 Z" fill={skinShadow} opacity="0.8" />
          <path d="M 99 105 L 98 115 L 99 122 L 101 122 L 102 115 Z" fill="#ffffff" opacity="0.2" />
        </g>;
      case 'ns6': // Broad / Flat Nose
        return <g>
          <path d="M 94 105 Q 92 118 90 123 Q 100 128 110 123 Q 108 118 106 105" fill={skinShadow} opacity="0.2" />
          <path d="M 90 123 Q 100 128 110 123 Q 100 125 90 123 Z" fill={skinShadow} opacity="0.5" />
          <ellipse cx="88" cy="124" rx="3" ry="2" fill={skinShadow} opacity="0.7" />
          <ellipse cx="112" cy="124" rx="3" ry="2" fill={skinShadow} opacity="0.7" />
          <ellipse cx="100" cy="120" rx="5" ry="3" fill="#ffffff" opacity="0.2" />
        </g>;
      default:    // ns1 Classic Pointy Nose
        return <g>
          <path d="M 96 100 Q 94 115 95 122 Q 100 125 105 122 Q 106 115 104 100" fill={skinShadow} opacity="0.3" />
          <path d="M 92 120 C 92 128, 108 128, 108 120 C 105 122, 95 122, 92 120 Z" fill={skinShadow} opacity="0.6" />
          <path d="M 90 120 C 88 125, 93 126, 95 124 C 95 122, 93 120, 90 120 Z" fill={skinShadow} opacity="0.7" />
          <path d="M 110 120 C 112 125, 107 126, 105 124 C 105 122, 107 120, 110 120 Z" fill={skinShadow} opacity="0.7" />
          <ellipse cx="100" cy="118" rx="2" ry="5" fill="#ffffff" opacity="0.25" />
        </g>;
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

  // Hair renderer — Redesigned to fit all head shapes perfectly
  const CAP = `M32 115 Q32 50 60 35 Q80 20 100 20 Q120 20 140 35 Q168 50 168 115 Q150 95 140 85 Q125 58 100 55 Q75 58 60 85 Q50 95 32 115Z`;
  
  const getHair = () => {
    switch (avatar.hairStyle) {
      case 'hr2': // Long Straight
        return <g>
          <path d="M32 115 Q32 40 100 25 Q168 40 168 115 L172 240 Q160 250 145 240 L135 115 L135 40 L65 40 L65 115 L55 240 Q40 250 28 240 Z" fill={hair} />
          <path d={CAP} fill={hair} />
          <path d="M50 80 Q50 180 50 220 M150 80 Q150 180 150 220" stroke={hairHighlight} strokeWidth="3" fill="none" opacity="0.3" />
        </g>;
      case 'hr3': // Afro / Curly
        return <g>
          <path d="M 40 105 C 20 90, 30 50, 60 40 C 70 10, 130 10, 140 40 C 170 50, 180 90, 160 105 C 165 120, 140 130, 135 115 C 135 80, 120 55, 100 55 C 80 55, 65 80, 65 115 C 60 130, 35 120, 40 105 Z" fill={hair} />
          <path d={CAP} fill={hair} />
          <circle cx="70" cy="45" r="8" fill={hairHighlight} opacity="0.2" />
          <circle cx="100" cy="30" r="10" fill={hairHighlight} opacity="0.2" />
          <circle cx="130" cy="45" r="8" fill={hairHighlight} opacity="0.2" />
        </g>;
      case 'hr4': // Pixie
        return <g>
          <path d={CAP} fill={hair} />
          <path d="M30 95 Q35 50 80 30 Q110 20 145 45 Q165 60 170 95 Q150 75 140 70 Q125 58 100 55 Q75 58 60 85 Q45 95 30 95Z" fill={hair} />
          <path d="M70 40 Q90 50 110 40" stroke={hairHighlight} strokeWidth="2" fill="none" opacity="0.4" />
        </g>;
      case 'hr5': // Top Knot
        return <g>
          <path d={CAP} fill={hair} />
          <circle cx="100" cy="20" r="18" fill={hair} />
          <path d="M 85 20 C 85 -5, 115 -5, 115 20 Z" fill={hairShadow} />
          <path d="M90 60 Q100 35 100 20 Q100 35 110 60" stroke={hairHighlight} strokeWidth="1.5" fill="none" opacity="0.4" />
        </g>;
      case 'hr6': // Bob
        return <g>
          <path d="M30 115 Q30 30 100 20 Q170 30 170 115 Q175 150 160 160 Q140 160 135 130 Q125 55 100 55 Q75 55 65 130 Q60 160 40 160 Q25 150 30 115 Z" fill={hair} />
          <path d="M 45 60 Q 45 120 45 140 M 155 60 Q 155 120 155 140" stroke={hairHighlight} strokeWidth="2" fill="none" opacity="0.3" />
        </g>;
      case 'hr7': // Space Buns
        return <g>
          <path d={CAP} fill={hair} />
          <circle cx="55" cy="35" r="22" fill={hair} />
          <circle cx="145" cy="35" r="22" fill={hair} />
          <circle cx="55" cy="35" r="12" fill={hairShadow} opacity="0.5" />
          <circle cx="145" cy="35" r="12" fill={hairShadow} opacity="0.5" />
        </g>;
      case 'hr8': // Slicked Back
        return <g>
          <path d={CAP} fill={hair} />
          <path d="M35 100 Q40 40 100 25 Q160 40 165 100 Q150 70 140 65 Q125 55 100 55 Q75 55 60 65 Q50 70 35 100Z" fill={hair} />
          <path d="M 60 50 Q 80 35 100 35 Q 120 35 140 50" stroke={hairHighlight} strokeWidth="2" fill="none" opacity="0.4" />
          <path d="M 70 60 Q 100 45 130 60" stroke={hairHighlight} strokeWidth="2" fill="none" opacity="0.4" />
        </g>;
      case 'hr9': // Dreadlocks
        return <g>
          <path d={CAP} fill={hair} />
          <g stroke={hair} strokeWidth="12" strokeLinecap="round" fill="none">
            <path d="M 45 90 Q 35 150 40 210" />
            <path d="M 65 100 Q 55 160 60 220" />
            <path d="M 135 100 Q 145 160 140 220" />
            <path d="M 155 90 Q 165 150 160 210" />
          </g>
          <g stroke={hairShadow} strokeWidth="12" strokeLinecap="round" strokeDasharray="8 6" fill="none" opacity="0.5">
            <path d="M 45 90 Q 35 150 40 210" />
            <path d="M 65 100 Q 55 160 60 220" />
            <path d="M 135 100 Q 145 160 140 220" />
            <path d="M 155 90 Q 165 150 160 210" />
          </g>
        </g>;
      case 'hr10': // Buzz Cut
        return <g>
          <path d="M35 110 Q35 50 100 35 Q165 50 165 110 Q150 90 140 80 Q125 60 100 60 Q75 60 60 80 Q50 90 35 110Z" fill={hair} />
          <path d="M 50 60 Q 100 45 150 60 M 60 70 Q 100 55 140 70 M 70 80 Q 100 65 130 80" stroke={hairShadow} strokeWidth="3" strokeDasharray="2 6" fill="none" opacity="0.6" />
        </g>;
      case 'hr11': // Mohawk
        return <g>
          <path d={CAP} fill={hair} />
          <path d="M 85 55 L 80 10 L 100 5 L 120 10 L 115 55 Z" fill={hair} />
          <path d="M 90 50 L 85 15 L 100 10 L 115 15 L 110 50 Z" fill={hairHighlight} />
        </g>;
      case 'hr12': // Pigtails
        return <g>
          <path d={CAP} fill={hair} />
          <path d="M 50 90 Q 20 120 25 180 Q 40 190 55 180 Q 60 140 60 90 Z" fill={hair} />
          <path d="M 150 90 Q 180 120 175 180 Q 160 190 145 180 Q 140 140 140 90 Z" fill={hair} />
          <rect x="42" y="85" width="20" height="8" rx="4" fill="#ff0055" />
          <rect x="138" y="85" width="20" height="8" rx="4" fill="#00d4ff" />
        </g>;
      default: // hr1 Short Wavy
        return <g>
          <path d={CAP} fill={hair} />
          <path d="M40 100 Q45 70 65 50 Q85 30 110 40 Q130 45 145 65 Q160 90 160 115 Q150 90 140 85 Q125 58 100 55 Q75 58 60 85 Q50 95 40 100Z" fill={hair} />
          <path d="M50 70 Q70 40 100 45 Q120 50 140 70" fill="none" stroke={hairHighlight} strokeWidth="2" opacity="0.4" />
        </g>;
    }
  };

  // Beard renderer
  const getBeard = () => {
    const bc = darken(hair, 0.05);
    switch (avatar.beardStyle) {
      case 'bd0': return null;
      case 'bd1': // Stubble
        return <g opacity="0.6">
          <path d="M 45 135 Q 100 190 155 135 Q 145 155 100 175 Q 55 155 45 135 Z" fill={bc} />
          <path d="M 75 128 Q 100 138 125 128 Q 130 135 100 145 Q 70 135 75 128 Z" fill={bc} />
        </g>;
      case 'bd2': // Goatee
        return <g>
          <path d="M 85 150 C 90 180, 110 180, 115 150 C 110 160, 90 160, 85 150 Z" fill={bc} />
          <path d="M 90 155 C 95 185, 105 185, 110 155" stroke={darken(bc, 0.2)} strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" />
        </g>;
      case 'bd3': // Full Beard
        return <g>
          <path d="M 40 115 C 35 150, 55 190, 100 190 C 145 190, 165 150, 160 115 C 145 135, 125 145, 100 145 C 75 145, 55 135, 40 115 Z" fill={bc} />
          <path d="M 75 135 Q 100 125 125 135 Q 115 145 100 145 Q 85 145 75 135 Z" fill={bc} />
          <path d="M 45 120 C 55 160, 75 180, 100 180 C 125 180, 145 160, 155 120" stroke={darken(bc, 0.2)} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.3" />
        </g>;
      case 'bd4': // Moustache
        return <g>
          <path d="M 70 135 C 85 120, 115 120, 130 135 C 120 142, 110 145, 100 142 C 90 145, 80 142, 70 135 Z" fill={bc} />
        </g>;
      case 'bd5': // Chinstrap
        return <g>
          <path d="M 40 115 C 35 150, 55 185, 100 185 C 145 185, 165 150, 160 115" stroke={bc} strokeWidth="8" fill="none" strokeLinecap="round" />
        </g>;
      case 'bd6': // Circle
        return <g>
          <path d="M 75 135 C 85 125, 115 125, 125 135 C 130 155, 115 165, 100 165 C 85 165, 70 155, 75 135 Z" fill={bc} />
          <ellipse cx="100" cy="144" rx="16" ry="6" fill={skin} />
        </g>;
      case 'bd7': // Van Dyke
        return <g>
          <path d="M 72 135 C 85 125, 115 125, 128 135 C 115 140, 105 135, 100 135 C 95 135, 85 140, 72 135 Z" fill={bc} />
          <path d="M 85 150 C 90 175, 110 175, 115 150 C 110 155, 90 155, 85 150 Z" fill={bc} />
          <path d="M 98 142 L 102 142 L 100 148 Z" fill={bc} />
        </g>;
      case 'bd8': // Balbo
        return <g>
          <path d="M 75 135 C 90 125, 110 125, 125 135 C 110 138, 90 138, 75 135 Z" fill={bc} />
          <path d="M 65 155 C 85 175, 115 175, 135 155 C 115 165, 85 165, 65 155 Z" fill={bc} />
          <path d="M 95 144 L 105 144 L 100 152 Z" fill={bc} />
        </g>;
      default: return null;
    }
  };

  // Body/Outfit — gender affects shoulder width, waist taper, hip width
  const getBody = () => {
    const outfitColors: Record<string, { main: string; accent: string }> = {
      m_of1: { main: '#1a0a1a', accent: '#ff0055' },
      m_of2: { main: '#2d0d2d', accent: '#e60039' },
      m_of3: { main: '#0d0d18', accent: '#ff0055' },
      m_of4: { main: '#18181b', accent: '#ff0055' },
      m_of5: { main: '#101015', accent: '#00d4ff' },
      m_of6: { main: '#333333', accent: '#ff4400' },
      m_of7: { main: '#0d1a2d', accent: '#00d4ff' },
      m_of8: { main: '#1a1a24', accent: '#00ff66' },
      m_of9: { main: '#1a0a00', accent: '#ffd700' },
      m_of10: { main: '#110022', accent: '#00ffcc' },
      m_of11: { main: '#3a3a45', accent: '#ffaa00' },
      m_of12: { main: '#0f172a', accent: '#ff00aa' },
      m_of13: { main: '#1a1d24', accent: '#ff6b00' },
      m_of14: { main: '#251c14', accent: '#adff00' },
      m_of15: { main: '#101524', accent: '#ff0055' },

      f_of1: { main: '#1a0a1a', accent: '#ff00a0' },
      f_of2: { main: '#2d0d2d', accent: '#ff0055' },
      f_of3: { main: '#0d0d18', accent: '#00d4ff' },
      f_of4: { main: '#18181b', accent: '#00ff66' },
      f_of5: { main: '#101015', accent: '#ff00ff' },
      f_of6: { main: '#333333', accent: '#ffd700' },
      f_of7: { main: '#0d1a2d', accent: '#ff0055' },
      f_of8: { main: '#1a1a24', accent: '#00ffcc' },
      f_of9: { main: '#1a0a00', accent: '#ffaa00' },
      f_of10: { main: '#110022', accent: '#ff00aa' },
      f_of11: { main: '#3a3a45', accent: '#00d4ff' },
      f_of12: { main: '#0f172a', accent: '#ff0055' },
      f_of13: { main: '#221122', accent: '#ff9900' },
      f_of14: { main: '#101524', accent: '#00ff99' },
      f_of15: { main: '#1d1a22', accent: '#ff00ff' },
    };
    const { main, accent } = outfitColors[avatar.outfitStyle] || outfitColors.m_of1;

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

    const renderOutfit = () => {
      const baseShirt = (
        <g>
          <path d={torsoPath} fill={main} />
          {isFemale && (
            <g>
              {/* Enhanced Bust Contour */}
              <path d="M 68 200 C 80 235, 96 225, 100 215 C 104 225, 120 235, 132 200" stroke={darken(main, 0.35)} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
              {/* Bust Highlights for volume */}
              <path d="M 75 185 Q 85 175 95 185" stroke={lighten(main, 0.3)} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
              <path d="M 125 185 Q 115 175 105 185" stroke={lighten(main, 0.3)} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
            </g>
          )}
        </g>
      );
      
      const standardSleeves = (
        <g>
          {pose === 'firingRight' ? (
            <>
              <path d={`M ${shoulderL + 4} 175 Q ${shoulderR} 178 ${shoulderR + 10} 182`} stroke={main} strokeWidth={armW + 2} strokeLinecap="round" fill="none" />
              <path d={`M ${shoulderR - 4} 175 Q ${shoulderR + 10} 175 ${shoulderR + 25} 178`} stroke={main} strokeWidth={armW + 2} strokeLinecap="round" fill="none" />
            </>
          ) : pose === 'firingLeft' ? (
            <>
              <path d={`M ${shoulderL + 4} 175 Q ${shoulderL - 10} 175 ${shoulderL - 25} 178`} stroke={main} strokeWidth={armW + 2} strokeLinecap="round" fill="none" />
              <path d={`M ${shoulderR - 4} 175 Q ${shoulderL} 178 ${shoulderL - 10} 182`} stroke={main} strokeWidth={armW + 2} strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              <path d={`M ${shoulderL + 4} 175 Q ${shoulderL - 8} 205 ${shoulderL - 10} 215`} stroke={main} strokeWidth={armW + 2} strokeLinecap="round" fill="none" />
              <path d={`M ${shoulderR - 4} 175 Q ${shoulderR + 8} 205 ${shoulderR + 10} 215`} stroke={main} strokeWidth={armW + 2} strokeLinecap="round" fill="none" />
            </>
          )}
        </g>
      );

      const baseId = avatar.outfitStyle.replace(/^[mf]_/, '');

      switch (baseId) {
        case 'of2': // Corporate Suit / Dress
          return <g>
            {baseShirt}
            {standardSleeves}
            <path d={`M 86 160 L 100 210 L 114 160 Z`} fill="#e0e0e0" />
            <path d={`M 97 180 L 100 230 L 103 180 Z M 95 170 L 105 170 L 100 185 Z`} fill={accent} />
            <path d={`M 86 160 L 70 250 L 100 210 Z`} fill={darken(main, 0.1)} />
            <path d={`M 114 160 L 130 250 L 100 210 Z`} fill={darken(main, 0.1)} />
            {isFemale && <path d={`M ${waistL} 255 C ${waistL} 265, ${waistR} 265, ${waistR} 255 L ${hipR} 315 L ${hipL} 315 Z`} fill={darken(main, 0.15)} />}
          </g>;
        case 'of3': // Hoodie / Dress
          return <g>
            <path d={`M ${shoulderL - 10} 160 C ${shoulderL - 10} 250, ${hipL - 10} 320, 100 320 C ${hipR + 10} 320, ${shoulderR + 10} 250, ${shoulderR + 10} 160 Z`} fill={main} />
            {standardSleeves}
            <path d={`M 70 160 C 70 140, 130 140, 130 160 C 140 190, 60 190, 70 160 Z`} fill={darken(main, 0.15)} />
            <path d={`M 90 180 Q 85 200 88 220 M 110 180 Q 115 200 112 220`} stroke={accent} strokeWidth="2" fill="none" />
            {isFemale ? (
              <path d={`M 70 280 C 85 270, 115 270, 130 280 L 140 320 L 60 320 Z`} fill={accent} opacity="0.8" />
            ) : (
              <path d={`M 60 260 L 140 260 L 145 310 L 55 310 Z`} fill={darken(main, 0.05)} />
            )}
          </g>;
        case 'of4': // Tactical Vest / Bra
          return <g>
            {baseShirt}
            {isFemale ? (
              <>
                <path d={`M 75 160 L 75 220 M 125 160 L 125 220`} stroke={darken(main, 0.3)} strokeWidth="8" />
                <path d={`M 60 220 Q 100 240 140 220 L 140 250 Q 100 260 60 250 Z`} fill={darken(main, 0.2)} />
                <rect x="90" y="225" width="20" height="20" fill={accent} />
              </>
            ) : (
              <>
                {standardSleeves}
                <rect x="70" y="170" width="60" height="40" rx="4" fill={darken(main, 0.2)} />
                <rect x="70" y="215" width="60" height="35" rx="4" fill={darken(main, 0.2)} />
                <rect x="75" y="255" width="50" height="35" rx="4" fill={darken(main, 0.2)} />
                <path d="M 70 160 L 70 315 M 130 160 L 130 315" stroke={accent} strokeWidth="5" opacity="0.8" />
              </>
            )}
          </g>;
        case 'of5': // Netrunner Suit / Bodysuit
          return <g>
            {baseShirt}
            <path d={`M ${shoulderL + 4} 175 Q ${shoulderL - 16} 220 ${shoulderL - 8} 265`} stroke={main} strokeWidth={armW + 1} strokeLinecap="round" fill="none" />
            <path d={`M ${shoulderR - 4} 175 Q ${shoulderR + 16} 220 ${shoulderR + 8} 265`} stroke={main} strokeWidth={armW + 1} strokeLinecap="round" fill="none" />
            <path d="M 100 160 L 100 310 M 70 200 L 100 220 L 130 200 M 60 250 L 100 270 L 140 250" stroke={accent} strokeWidth="2" fill="none" />
            {isFemale ? (
              <path d={`M 75 250 Q 100 290 125 250 L ${hipR} 315 L ${hipL} 315 Z`} fill={darken(main, 0.3)} />
            ) : (
              <circle cx="100" cy="220" r="4" fill={accent} />
            )}
          </g>;
        case 'of6': // Punk Vest / Top
          return <g>
            {baseShirt}
            <path d={`M 86 160 L 95 315 L ${hipL} 315 C ${hipL} 300 ${waistL} 280 ${waistL} 255 C ${waistL} 230 ${shoulderL} 210 ${shoulderL} 175 Q ${shoulderL} 160 86 160 Z`} fill={darken(main, 0.2)} />
            <path d={`M 114 160 L 105 315 L ${hipR} 315 C ${hipR} 300 ${waistR} 280 ${waistR} 255 C ${waistR} 230 ${shoulderR} 210 ${shoulderR} 175 Q ${shoulderR} 160 114 160 Z`} fill={darken(main, 0.2)} />
            {isFemale ? (
              <path d="M 70 220 Q 100 240 130 220 L 120 250 Q 100 270 80 250 Z" fill={accent} />
            ) : (
              <>
                <rect x="75" y="230" width="12" height="18" fill={accent} opacity="0.8" transform="rotate(10 81 239)" />
                <rect x="110" y="240" width="16" height="16" fill={accent} opacity="0.8" transform="rotate(-15 118 248)" />
              </>
            )}
          </g>;
        case 'of7': // Techwear Poncho / Jacket
          return <g>
            {standardSleeves}
            {baseShirt}
            {isFemale ? (
              <path d={`M 70 160 Q 100 220 130 160 L 140 240 Q 100 260 60 240 Z`} fill={darken(main, 0.1)} stroke={accent} strokeWidth="3" />
            ) : (
              <path d={`M 70 160 Q 140 160 160 180 Q 170 250 140 330 L 50 280 Q 40 220 70 160 Z`} fill={darken(main, 0.1)} />
            )}
            <path d={`M 80 160 L 130 320 M 150 200 L 100 280`} stroke={accent} strokeWidth="4" opacity="0.8" />
          </g>;
        case 'of8': // Minimalist
          return <g>
            {baseShirt}
            <path d={`M ${shoulderL + 4} 175 Q ${shoulderL - 6} 190 ${shoulderL - 7} 195`} stroke={main} strokeWidth={armW + 2} strokeLinecap="round" fill="none" />
            <path d={`M ${shoulderR - 4} 175 Q ${shoulderR + 6} 190 ${shoulderR + 7} 195`} stroke={main} strokeWidth={armW + 2} strokeLinecap="round" fill="none" />
            {isFemale ? (
              <path d={`M ${waistL} 230 C ${waistL} 250, ${waistR} 250, ${waistR} 230 L ${hipR} 315 L ${hipL} 315 Z`} fill={skin} />
            ) : (
              <circle cx="100" cy="200" r="14" stroke={accent} strokeWidth="3" fill="none" />
            )}
          </g>;
        case 'of9': // Racer
          return <g>
            {baseShirt}
            {standardSleeves}
            <path d={`M 85 160 L 85 315 M 115 160 L 115 315`} stroke={accent} strokeWidth="4" />
            {isFemale ? (
              <path d={`M 90 160 L 110 160 L 110 220 L 90 220 Z`} fill={accent} />
            ) : (
              <path d={`M 100 160 L 100 315`} stroke="#ccc" strokeWidth="2" strokeDasharray="4 2" />
            )}
          </g>;
        case 'of10': // Neon Samurai / Kunoichi
          return <g>
            {baseShirt}
            {isFemale ? (
              <>
                <path d={`M 75 160 L 125 240 L 120 250 L 70 170 Z`} fill={accent} />
                <path d={`M 125 160 L 75 240 L 80 250 L 130 170 Z`} fill={darken(accent, 0.2)} />
              </>
            ) : (
              <>
                <path d={`M ${shoulderL + 5} 175 L ${shoulderL - 40} 270 L ${shoulderL - 5} 270 L ${shoulderL - 5} 190 Z`} fill={main} />
                <path d={`M ${shoulderR - 5} 175 L ${shoulderR + 40} 270 L ${shoulderR + 5} 270 L ${shoulderR + 5} 190 Z`} fill={main} />
                <rect x="65" y="235" width="70" height="25" fill={darken(main, 0.3)} />
              </>
            )}
          </g>;
        case 'of11': // Mecha
          return <g>
            <path d={`M ${shoulderL + 10} 150 L ${shoulderL - 25} 190 L ${shoulderL - 10} 220 L ${shoulderL} 170 Z`} fill={darken(main, 0.2)} />
            <path d={`M ${shoulderR - 10} 150 L ${shoulderR + 25} 190 L ${shoulderR + 10} 220 L ${shoulderR} 170 Z`} fill={darken(main, 0.2)} />
            <path d={`M ${shoulderL - 15} 200 L ${shoulderL - 15} 270`} stroke={main} strokeWidth={armW + 10} strokeLinecap="round" />
            <path d={`M ${shoulderR + 15} 200 L ${shoulderR + 15} 270`} stroke={main} strokeWidth={armW + 10} strokeLinecap="round" />
            {isFemale ? (
              <path d={`M 75 160 Q 100 230 125 160 L 115 250 Q 100 280 85 250 Z`} fill={main} stroke={accent} strokeWidth="4" />
            ) : (
              <path d={`M 75 160 L 125 160 L 135 200 L 100 240 L 65 200 Z`} fill={main} stroke={darken(main, 0.3)} strokeWidth="4" />
            )}
            <circle cx="100" cy="200" r="8" fill={accent} />
          </g>;
        case 'of12': // Hacker Cloak
          return <g>
            {baseShirt}
            {isFemale ? (
              <path d={`M 65 170 C 40 200, 30 250, 40 300 L 160 300 C 170 250, 160 200, 135 170 C 120 220, 80 220, 65 170 Z`} fill={main} />
            ) : (
              <path d={`M 65 170 C 40 200, 20 280, 30 330 L 170 330 C 180 280, 160 200, 135 170 C 120 220, 80 220, 65 170 Z`} fill={main} />
            )}
            <path d={`M 65 170 C 80 220, 120 220, 135 170`} stroke={accent} strokeWidth="4" fill="none" />
          </g>;
        case 'of13': // Mercenary Gear
          return <g>
            {baseShirt}
            {standardSleeves}
            <rect x="70" y="180" width="25" height="40" fill={darken(main, 0.3)} stroke={accent} strokeWidth="2" />
            <rect x="105" y="180" width="25" height="40" fill={darken(main, 0.3)} stroke={accent} strokeWidth="2" />
            {isFemale && <path d="M 60 250 L 140 250 L 135 270 L 65 270 Z" fill={accent} />}
          </g>;
        case 'of14': // Nomad
          return <g>
            {baseShirt}
            <path d={`M ${shoulderL} 160 L 80 315 L 60 315 Z`} fill={darken(main, 0.1)} />
            <path d={`M ${shoulderR} 160 L 120 315 L 140 315 Z`} fill={darken(main, 0.1)} />
            {isFemale ? (
              <path d="M 80 180 Q 100 200 120 180" stroke={accent} strokeWidth="4" fill="none" />
            ) : (
              <rect x="90" y="180" width="20" height="30" fill={accent} />
            )}
          </g>;
        case 'of15': // Corp Sec
          return <g>
            {baseShirt}
            <path d="M 70 160 L 100 200 L 130 160 L 130 180 L 100 220 L 70 180 Z" fill={darken(main, 0.25)} />
            {isFemale ? (
              <path d={`M ${waistL} 240 Q 100 260 ${waistR} 240 L ${hipR} 315 Q 100 300 ${hipL} 315 Z`} fill={darken(main, 0.1)} stroke={accent} strokeWidth="2" />
            ) : (
              <path d="M 80 230 L 120 230 L 115 280 L 85 280 Z" fill={darken(main, 0.1)} stroke={accent} strokeWidth="2" />
            )}
          </g>;
        default: // of1 Cyber Tee / Crop
          return <g>
            {baseShirt}
            {standardSleeves}
            {isFemale ? (
              <path d={`M ${waistL - 5} 240 L ${waistR + 5} 240 L ${hipR} 315 L ${hipL} 315 Z`} fill={skin} />
            ) : (
              <>
                <path d="M 75 150 Q 100 160 125 150 L 115 165 Q 100 175 85 165 Z" fill={darken(main, 0.2)} />
                <path d="M 80 180 L 120 180 L 110 230 L 90 230 Z" fill={darken(main, 0.1)} />
                <text x="100" y="215" textAnchor="middle" fontSize="12" fill={accent} fontFamily="monospace" fontWeight="bold" opacity="0.9">CYBER</text>
              </>
            )}
          </g>;
      }
    };

    return (
      <g transform={`translate(${tx}, 0) scale(${bodyScale}, 1)`}>
        {/* Arms and Hands (Skin) */}
        {pose === 'firingRight' ? (
           <>
             <path d={`M ${shoulderL + 4} 175 Q ${shoulderR + 15} 180 ${shoulderR + 45} 185`} stroke={skin} strokeWidth={armW} strokeLinecap="round" fill="none" />
             <path d={`M ${shoulderR - 4} 175 Q ${shoulderR + 25} 175 ${shoulderR + 65} 178`} stroke={skin} strokeWidth={armW} strokeLinecap="round" fill="none" />
             <ellipse cx={shoulderR + 52} cy="185" rx={armW/2 + 4} ry={armW/2 + 1} fill={skin} />
             <ellipse cx={shoulderR + 72} cy="178" rx={armW/2 + 4} ry={armW/2 + 1} fill={skin} />
           </>
        ) : pose === 'firingLeft' ? (
           <>
             <path d={`M ${shoulderL + 4} 175 Q ${shoulderL - 25} 175 ${shoulderL - 65} 178`} stroke={skin} strokeWidth={armW} strokeLinecap="round" fill="none" />
             <path d={`M ${shoulderR - 4} 175 Q ${shoulderL - 15} 180 ${shoulderL - 45} 185`} stroke={skin} strokeWidth={armW} strokeLinecap="round" fill="none" />
             <ellipse cx={shoulderL - 72} cy="178" rx={armW/2 + 4} ry={armW/2 + 1} fill={skin} />
             <ellipse cx={shoulderL - 52} cy="185" rx={armW/2 + 4} ry={armW/2 + 1} fill={skin} />
           </>
        ) : (
           <>
             <path d={`M ${shoulderL + 4} 175 Q ${shoulderL - 16} 220 ${shoulderL - 8} 265`} stroke={skin} strokeWidth={armW} strokeLinecap="round" fill="none" />
             <path d={`M ${shoulderR - 4} 175 Q ${shoulderR + 16} 220 ${shoulderR + 8} 265`} stroke={skin} strokeWidth={armW} strokeLinecap="round" fill="none" />
             <ellipse cx={shoulderL - 8} cy="275" rx={armW/2 + 1} ry={armW/2 + 4} fill={skin} />
             <ellipse cx={shoulderR + 8} cy="275" rx={armW/2 + 4} ry={armW/2 + 4} fill={skin} />
           </>
        )}

        {/* Legs (Pants) */}
        <path d={`M ${hipL + 12} 310 Q ${hipL + 4} 360 ${hipL + 4} 405`} stroke={darken(main, 0.12)} strokeWidth={legW} strokeLinecap="round" fill="none" />
        <path d={`M ${hipR - 12} 310 Q ${hipR - 4} 360 ${hipR - 4} 405`} stroke={darken(main, 0.12)} strokeWidth={legW} strokeLinecap="round" fill="none" />

        {/* Feet */}
        <ellipse cx={hipL} cy="415" rx={legW/2 + 4} ry="12" fill={darken(main, 0.3)} />
        <ellipse cx={hipR} cy="415" rx={legW/2 + 4} ry="12" fill={darken(main, 0.3)} />

        {renderOutfit()}
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

  const getMiniViewBox = () => {
    // Space buns (hr11), tall hair (hr3, hr4, hr7, hr8, hr12) need more top room
    const needsTop = ['hr3', 'hr4', 'hr7', 'hr8', 'hr11', 'hr12'].includes(avatar.hairStyle);
    const topY = needsTop ? 10 : 25;
    
    // Long hair (hr2, hr5, hr10) needs more bottom room
    const needsBottom = ['hr2', 'hr5', 'hr10'].includes(avatar.hairStyle);
    const bottomY = needsBottom ? 245 : 170;
    
    return `30 ${topY} 140 ${bottomY - topY}`;
  };

  const viewBox = mini ? getMiniViewBox() : "0 0 200 420";

  return (
    <svg
      viewBox={viewBox}
      width={mini ? "100%" : size}
      height={mini ? "100%" : size * 1.6}
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
export { AvatarSVG, MiniAvatar, DEFAULT_AVATAR, SKIN_TONES, HAIR_COLORS, EYE_COLORS, GENDER_OPTIONS, EYE_STYLES, BROW_STYLES, NOSE_STYLES, FACE_SHAPES, LIPS_STYLES, EAR_STYLES, BEARD_STYLES, HAIR_STYLES, BODY_TYPES, OUTFIT_STYLES, AVATAR_SUB_CATEGORIES, getSkinColor };
export type { AvatarSubCategory, ColorOption, Option, MainTab };

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Lock, 
  ShieldCheck, 
  User, 
  Shirt, 
  Crown, 
  Palette,
  Glasses,
  Save,
  Zap,
  Circle,
  Triangle,
  Square,
  Boxes
} from 'lucide-react';

interface CosmeticOption {
  id: string;
  name: string;
  category: 'base' | 'color' | 'headwear' | 'outfit' | 'accessory';
  hex: string;
  symbol?: string;
  locked?: boolean;
  cost?: number;
  description?: string;
}

const BASE_SHAPES: CosmeticOption[] = [
  { id: 'shape-1', name: 'Humanoid Operative', category: 'base', hex: '#ff0055', description: 'Standard athletic cyber frame' },
  { id: 'shape-2', name: 'Robotic Android', category: 'base', hex: '#64748b', description: 'Reinforced metallic alloy chassis' },
  { id: 'shape-3', name: 'Holographic Ghost', category: 'base', hex: '#00f0ff', description: 'Translucent photon energy lattice' },
  { id: 'shape-4', name: 'Cyber Specimen #456', category: 'base', hex: '#10b981', description: 'Experimental bio-enhanced structure' },
];

const PRIMARY_COLORS: CosmeticOption[] = [
  { id: 'col-1', name: 'Crimson Pink', category: 'color', hex: '#ff0055' },
  { id: 'col-2', name: 'Cyber Cyan', category: 'color', hex: '#00f0ff' },
  { id: 'col-3', name: 'Emerald Green', category: 'color', hex: '#10b981' },
  { id: 'col-4', name: 'Royal Violet', category: 'color', hex: '#a855f7' },
  { id: 'col-5', name: 'Vanguard Gold', category: 'color', hex: '#f59e0b' },
  { id: 'col-6', name: 'Stealth Charcoal', category: 'color', hex: '#1e293b' },
];

const HEADWEAR_OPTIONS: CosmeticOption[] = [
  { id: 'head-1', name: 'Hooded Cloak', category: 'headwear', hex: '#e60039' },
  { id: 'head-2', name: 'LED Guard Mask (Circle)', category: 'headwear', hex: '#ff0055', symbol: '○' },
  { id: 'head-3', name: 'LED Guard Mask (Triangle)', category: 'headwear', hex: '#ff0055', symbol: '△' },
  { id: 'head-4', name: 'LED Guard Mask (Square)', category: 'headwear', hex: '#ff0055', symbol: '□' },
  { id: 'head-5', name: 'VR Visor Goggles', category: 'headwear', hex: '#00f0ff' },
  { id: 'head-6', name: 'Tactical Helmet', category: 'headwear', hex: '#334155' },
];

const OUTFIT_OPTIONS: CosmeticOption[] = [
  { id: 'outfit-1', name: 'Tracksuit #456', category: 'outfit', hex: '#10b981' },
  { id: 'outfit-2', name: 'Tactical Armor Plating', category: 'outfit', hex: '#1e293b' },
  { id: 'outfit-3', name: 'Casual Tech-Wear', category: 'outfit', hex: '#475569' },
  { id: 'outfit-4', name: 'Pink Operative Jumpsuit', category: 'outfit', hex: '#ff0055' },
  { id: 'outfit-5', name: 'Exosuit Plating', category: 'outfit', hex: '#0284c7' },
];

const ACCESSORY_OPTIONS: CosmeticOption[] = [
  { id: 'acc-1', name: 'Holographic Tag', category: 'accessory', hex: '#ff0055' },
  { id: 'acc-2', name: 'Laser Monocle', category: 'accessory', locked: true, cost: 1200, hex: '#ef4444' },
  { id: 'acc-3', name: 'Golden VIP Mask', category: 'accessory', locked: true, cost: 2500, hex: '#f59e0b' },
  { id: 'acc-4', name: 'Neon Katana Blade', category: 'accessory', locked: true, cost: 5000, hex: '#a855f7' },
];

export default function ClasslessAvatarStudio() {
  const router = useRouter();

  // Active Category Tab
  const [activeTab, setActiveTab] = useState<'base' | 'color' | 'headwear' | 'outfit' | 'accessory'>('base');

  // Independent Customization State (Free-form Mix and Match)
  const [selectedBaseShape, setSelectedBaseShape] = useState(BASE_SHAPES[0]);
  const [selectedColor, setSelectedColor] = useState(PRIMARY_COLORS[0]);
  const [selectedHeadwear, setSelectedHeadwear] = useState(HEADWEAR_OPTIONS[0]);
  const [selectedOutfit, setSelectedOutfit] = useState(OUTFIT_OPTIONS[0]);
  const [selectedAccessory, setSelectedAccessory] = useState(ACCESSORY_OPTIONS[0]);

  // Lock Alert State & Save State
  const [lockAlert, setLockAlert] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSelectCosmetic = (option: CosmeticOption) => {
    if (option.locked) {
      setLockAlert(`ITEM LOCKED: Requires ${option.cost?.toLocaleString()} PTS in Player Arena.`);
      setTimeout(() => setLockAlert(null), 3000);
      return;
    }

    setLockAlert(null);
    switch (option.category) {
      case 'base':
        setSelectedBaseShape(option);
        break;
      case 'color':
        setSelectedColor(option);
        break;
      case 'headwear':
        setSelectedHeadwear(option);
        break;
      case 'outfit':
        setSelectedOutfit(option);
        break;
      case 'accessory':
        setSelectedAccessory(option);
        break;
    }
  };

  const handleLockInAvatar = () => {
    setIsSaving(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#020005] text-white p-4 sm:p-6 lg:p-10 font-sans relative overflow-x-hidden flex flex-col justify-between select-none">
      {/* Ambient Crimson/Fuchsia Glow Accents */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-[#ff0055]/15 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/3 w-[600px] h-[600px] bg-[#e60039]/15 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-7xl w-full mx-auto space-y-6 relative z-10">
        
        {/* Top Header */}
        <header className="flex items-center justify-between pb-4 border-b border-[#ff0055]/30">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2.5 rounded-xl bg-[#0e0414] border border-[#ff0055]/30 text-[#ff0055] hover:bg-[#ff0055] hover:text-white transition-all shadow-[0_0_10px_rgba(255,0,85,0.2)]"
              title="Return to Player Arena"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#ff0055] tracking-widest uppercase">
                  FREE-FORM AVATAR ENGINE
                </span>
                <div className="flex items-center gap-1 text-[#ff0055] px-2 py-0.5 rounded-full bg-[#1c061e] border border-[#ff0055]/30">
                  <Circle className="w-2.5 h-2.5 fill-current" />
                  <Triangle className="w-2.5 h-2.5 fill-current" />
                  <Square className="w-2.5 h-2.5 fill-current" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-200 to-[#ff0055]">
                Classless Customization Studio
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-[#120315] border border-[#ff0055]/40 flex items-center gap-2 font-mono text-xs text-[#ff0055]">
              <Zap className="w-4 h-4" />
              <span>4,560 PTS</span>
            </div>
          </div>
        </header>

        {/* Lock Notification Alert */}
        <AnimatePresence>
          {lockAlert && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3.5 rounded-xl bg-red-950/90 border border-red-500 text-xs font-mono text-red-300 flex items-center justify-between shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            >
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-400" />
                <span>{lockAlert}</span>
              </div>
              <span className="text-[10px] text-zinc-400">EARN PTS IN ARENA TO UNLOCK</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Studio Split: Left Glowing Display Podium (1/3) + Right Scrollable Customization Grid (2/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT PANEL: Glowing Display Podium & Live Instant Character Preview */}
          <div className="lg:col-span-1 bg-[#0a030d]/85 rounded-3xl border-2 border-[#ff0055]/50 p-6 backdrop-blur-xl shadow-[0_0_45px_rgba(255,0,85,0.25)] flex flex-col items-center justify-between min-h-[500px] relative overflow-hidden">
            
            {/* Viewfinder Header */}
            <div className="w-full flex items-center justify-between text-[10px] font-mono text-[#ff0055] pb-2 border-b border-[#ff0055]/20">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ff0055] animate-ping" />
                PODIUM // FREE-FORM RENDER
              </span>
              <span>LIVE SYNC</span>
            </div>

            {/* LIVE CHARACTER PREVIEW ON GLOWING PODIUM */}
            <div className="my-8 relative w-56 h-64 flex flex-col items-center justify-center">
              
              {/* Primary Color Ambient Glow Aura */}
              <div 
                className="absolute w-52 h-52 rounded-full blur-3xl opacity-60 transition-colors duration-500"
                style={{ backgroundColor: selectedColor.hex }}
              />

              {/* Headwear / Mask Layer */}
              <motion.div 
                key={selectedHeadwear.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="z-30 mb-[-14px] flex items-center justify-center"
              >
                <div 
                  className="px-4 py-2 rounded-t-full border-2 border-white/30 text-xs font-mono font-bold text-white shadow-2xl flex items-center gap-1.5"
                  style={{ backgroundColor: selectedHeadwear.hex }}
                >
                  {selectedHeadwear.symbol && (
                    <span className="text-sm font-extrabold">{selectedHeadwear.symbol}</span>
                  )}
                  <span>{selectedHeadwear.name}</span>
                </div>
              </motion.div>

              {/* Base Shape Silhouette Layer */}
              <motion.div 
                key={selectedBaseShape.id}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="z-20 w-32 h-32 rounded-3xl border-2 border-white/40 flex flex-col items-center justify-center relative shadow-2xl overflow-hidden transition-colors duration-300"
                style={{ backgroundColor: selectedBaseShape.hex }}
              >
                {/* Center Core Element */}
                <div 
                  className="w-12 h-12 rounded-full border-2 border-white/50 flex items-center justify-center font-extrabold text-white text-lg shadow-inner"
                  style={{ backgroundColor: selectedColor.hex }}
                >
                  ★
                </div>

                {/* Visor Glare */}
                <div className="absolute top-2 left-2 w-14 h-4 bg-white/20 rounded-full transform -rotate-12 pointer-events-none" />
              </motion.div>

              {/* Outfit Layer */}
              <motion.div 
                key={selectedOutfit.id}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="z-10 w-40 h-24 mt-[-12px] rounded-t-3xl border-t-2 border-x-2 border-white/30 flex items-center justify-center text-xs font-mono font-bold text-white shadow-2xl transition-colors duration-300"
                style={{ backgroundColor: selectedOutfit.hex }}
              >
                {selectedOutfit.name}
              </motion.div>

              {/* Accessory Overlay Badge */}
              <motion.div 
                key={selectedAccessory.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-0 z-40 px-3 py-1 rounded-full text-[9px] font-mono font-bold text-white border border-white/40 shadow-xl"
                style={{ backgroundColor: selectedAccessory.hex }}
              >
                {selectedAccessory.name}
              </motion.div>

              {/* GLOWING PODIUM BASE */}
              <div 
                className="absolute bottom-[-16px] w-56 h-10 rounded-full blur-[2px] border-t-2 transition-colors duration-500 shadow-2xl flex items-center justify-center"
                style={{ 
                  backgroundColor: `${selectedColor.hex}33`, 
                  borderColor: selectedColor.hex,
                  boxShadow: `0 0 30px ${selectedColor.hex}`
                }}
              >
                <div className="w-40 h-4 rounded-full bg-white/10" />
              </div>
            </div>

            {/* Customization Combination Summary */}
            <div className="w-full p-3 rounded-xl bg-[#050008] border border-zinc-800 text-center font-mono text-xs space-y-1">
              <span className="text-zinc-400 block text-[10px]">COMBINATION CONFIG:</span>
              <div className="text-white font-bold truncate">
                {selectedHeadwear.name} + {selectedOutfit.name}
              </div>
              <div className="text-[10px] text-[#ff0055] font-semibold">
                THEME COLOR: {selectedColor.name}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Scrollable Customization Menu (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Customization Category Tabs */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0a030d]/85 border border-[#ff0055]/30 overflow-x-auto">
              <button
                onClick={() => setActiveTab('base')}
                className={`flex-1 py-3 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'base'
                    ? 'bg-[#ff0055] text-white shadow-[0_0_15px_#ff0055]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Boxes className="w-3.5 h-3.5" />
                Base Shape
              </button>

              <button
                onClick={() => setActiveTab('color')}
                className={`flex-1 py-3 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'color'
                    ? 'bg-[#ff0055] text-white shadow-[0_0_15px_#ff0055]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                Primary Color
              </button>

              <button
                onClick={() => setActiveTab('headwear')}
                className={`flex-1 py-3 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'headwear'
                    ? 'bg-[#ff0055] text-white shadow-[0_0_15px_#ff0055]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                Headwear
              </button>

              <button
                onClick={() => setActiveTab('outfit')}
                className={`flex-1 py-3 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'outfit'
                    ? 'bg-[#ff0055] text-white shadow-[0_0_15px_#ff0055]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Shirt className="w-3.5 h-3.5" />
                Outfit
              </button>

              <button
                onClick={() => setActiveTab('accessory')}
                className={`flex-1 py-3 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'accessory'
                    ? 'bg-[#ff0055] text-white shadow-[0_0_15px_#ff0055]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Glasses className="w-3.5 h-3.5" />
                Accessories
              </button>
            </div>

            {/* Options Cards Grid Container */}
            <div className="bg-[#0a030d]/85 rounded-3xl border border-[#ff0055]/30 p-6 backdrop-blur-xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#ff0055]" />
                  SELECT {activeTab.toUpperCase()} COSMETIC
                </h3>
                <span className="text-[10px] font-mono text-zinc-500">
                  CLASSLESS MIX &amp; MATCH
                </span>
              </div>

              {/* Items Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-1">
                {(activeTab === 'base'
                  ? BASE_SHAPES
                  : activeTab === 'color'
                  ? PRIMARY_COLORS
                  : activeTab === 'headwear'
                  ? HEADWEAR_OPTIONS
                  : activeTab === 'outfit'
                  ? OUTFIT_OPTIONS
                  : ACCESSORY_OPTIONS
                ).map((item) => {
                  const isSelected =
                    (activeTab === 'base' && selectedBaseShape.id === item.id) ||
                    (activeTab === 'color' && selectedColor.id === item.id) ||
                    (activeTab === 'headwear' && selectedHeadwear.id === item.id) ||
                    (activeTab === 'outfit' && selectedOutfit.id === item.id) ||
                    (activeTab === 'accessory' && selectedAccessory.id === item.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectCosmetic(item)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex items-center justify-between ${
                        item.locked
                          ? 'bg-[#050008]/50 border-zinc-800 opacity-60 hover:opacity-80'
                          : isSelected
                          ? 'bg-[#1e0720] border-2 border-[#ff0055] shadow-[0_0_20px_rgba(255,0,85,0.35)]'
                          : 'bg-[#050008] border-zinc-800 hover:border-[#ff0055]/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl border border-white/20 flex items-center justify-center font-mono font-bold text-white shadow shrink-0"
                          style={{ backgroundColor: item.hex }}
                        >
                          {item.symbol || item.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white tracking-tight">
                            {item.name}
                          </h4>
                          <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">
                            {item.locked
                              ? `Requires ${item.cost?.toLocaleString()} PTS`
                              : item.description || 'Unlocked Cosmetic'}
                          </span>
                        </div>
                      </div>

                      {/* Selection / Lock Badge */}
                      {item.locked ? (
                        <div className="p-2 rounded-lg bg-red-950/80 border border-red-600 text-red-400 shrink-0">
                          <Lock className="w-4 h-4" />
                        </div>
                      ) : isSelected ? (
                        <div className="p-2 rounded-lg bg-[#ff0055] text-white shadow-[0_0_10px_#ff0055] shrink-0">
                          <Check className="w-4 h-4" />
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BOTTOM RIGHT: Prominent 'LOCK IN AVATAR' Action Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleLockInAvatar}
                disabled={isSaving}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#ff0055] via-[#e60039] to-[#ff0055] text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-[0_0_30px_#ff0055] hover:scale-105 active:scale-95 border border-white/30 transition-all cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    LOCKING IN AVATAR...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    LOCK IN AVATAR →
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

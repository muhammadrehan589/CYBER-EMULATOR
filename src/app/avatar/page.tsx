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
  Glasses,
  Save,
  RotateCcw,
  Circle,
  Triangle,
  Square,
  Zap,
  Palette
} from 'lucide-react';

interface CustomizationOption {
  id: string;
  name: string;
  category: 'base' | 'mask' | 'suit' | 'accessory';
  locked?: boolean;
  cost?: number;
  color: string;
  symbol?: string;
}

const BASE_MODELS: CustomizationOption[] = [
  { id: 'base-1', name: 'Cyber Operative', category: 'base', color: '#ff0055' },
  { id: 'base-2', name: 'Guard Unit (Circle)', category: 'base', color: '#e60039', symbol: '○' },
  { id: 'base-3', name: 'VIP Spectator', category: 'base', color: '#fbbf24' },
  { id: 'base-4', name: 'Player #456 Frame', category: 'base', color: '#10b981' },
];

const MASKS_HEADWEAR: CustomizationOption[] = [
  { id: 'mask-1', name: 'Circle Guard Mask', category: 'mask', color: '#ff0055', symbol: '○' },
  { id: 'mask-2', name: 'Triangle Guard Mask', category: 'mask', color: '#ff0055', symbol: '△' },
  { id: 'mask-3', name: 'Square Guard Mask', category: 'mask', color: '#ff0055', symbol: '□' },
  { id: 'mask-4', name: 'Frontman Polished Visor', category: 'mask', color: '#111827' },
  { id: 'mask-[#5]', name: 'Cyber Monocle Helmet', category: 'mask', color: '#64748b' },
];

const SUIT_COLORS: CustomizationOption[] = [
  { id: 'suit-1', name: 'Pink Guard Jumpsuit', category: 'suit', color: '#ff0055' },
  { id: 'suit-2', name: 'Player Tracksuit #456', category: 'suit', color: '#10b981' },
  { id: 'suit-3', name: 'Frontman Trench Coat', category: 'suit', color: '#1e293b' },
  { id: 'suit-4', name: 'Stealth Tactical Black', category: 'suit', color: '#09090b' },
];

const ACCESSORIES: CustomizationOption[] = [
  { id: 'acc-1', name: 'Holographic Tag', category: 'accessory', color: '#ff0055' },
  { id: 'acc-2', name: 'Laser Monocle', category: 'accessory', locked: true, cost: 1200, color: '#ef4444' },
  { id: 'acc-3', name: 'Golden VIP Mask', category: 'accessory', locked: true, cost: 2500, color: '#f59e0b' },
  { id: 'acc-4', name: 'Neon Katana Blade', category: 'accessory', locked: true, cost: 5000, color: '#a855f7' },
];

export default function AvatarCreatorPage() {
  const router = useRouter();

  // Active Category Tab State
  const [activeTab, setActiveTab] = useState<'base' | 'mask' | 'suit' | 'accessory'>('base');

  // Selected Customization State
  const [selectedBase, setSelectedBase] = useState(BASE_MODELS[0]);
  const [selectedMask, setSelectedMask] = useState(MASKS_HEADWEAR[0]);
  const [selectedSuit, setSelectedSuit] = useState(SUIT_COLORS[0]);
  const [selectedAccessory, setSelectedAccessory] = useState(ACCESSORIES[0]);

  // Podium Lighting Aura Color
  const [podiumAura, setPodiumAura] = useState('#ff0055');

  // Lock Alert State
  const [lockAlert, setLockAlert] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSelectOption = (option: CustomizationOption) => {
    if (option.locked) {
      setLockAlert(`ITEM LOCKED: Requires ${option.cost?.toLocaleString()} PTS in Player Arena.`);
      setTimeout(() => setLockAlert(null), 3000);
      return;
    }

    setLockAlert(null);
    switch (option.category) {
      case 'base':
        setSelectedBase(option);
        break;
      case 'mask':
        setSelectedMask(option);
        break;
      case 'suit':
        setSelectedSuit(option);
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
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-[#ff0055]/15 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/3 w-[600px] h-[600px] bg-[#e60039]/15 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-7xl w-full mx-auto space-y-6 relative z-10">
        
        {/* Top Navigation Header */}
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
                  PHASE 2 // AVATAR STUDIO
                </span>
                <div className="flex items-center gap-1 text-[#ff0055] px-2 py-0.5 rounded-full bg-[#1c061e] border border-[#ff0055]/30">
                  <Circle className="w-2.5 h-2.5 fill-current" />
                  <Triangle className="w-2.5 h-2.5 fill-current" />
                  <Square className="w-2.5 h-2.5 fill-current" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-200 to-[#ff0055]">
                Operant Customization Matrix
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

        {/* Lock Notification Banner */}
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

        {/* Main Studio Grid: Left Glowing Display Podium (1/3) + Right Selectable Menu (2/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT PANEL: Glowing Display Podium & Live 3D/Vector Character Preview */}
          <div className="lg:col-span-1 bg-[#0a030d]/85 rounded-3xl border-2 border-[#ff0055]/50 p-6 backdrop-blur-xl shadow-[0_0_45px_rgba(255,0,85,0.25)] flex flex-col items-center justify-between min-h-[480px] relative overflow-hidden">
            
            {/* Viewfinder Header */}
            <div className="w-full flex items-center justify-between text-[10px] font-mono text-[#ff0055] pb-2 border-b border-[#ff0055]/20">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ff0055] animate-ping" />
                PODIUM // 3D PREVIEW
              </span>
              <span>LIVE RENDER</span>
            </div>

            {/* LIVE CHARACTER PREVIEW ON GLOWING PODIUM */}
            <div className="my-8 relative w-56 h-64 flex flex-col items-center justify-center">
              
              {/* Podium Ambient Glow Aura */}
              <div 
                className="absolute w-52 h-52 rounded-full blur-3xl opacity-50 transition-colors duration-500"
                style={{ backgroundColor: podiumAura }}
              />

              {/* Mask / Headwear Layer */}
              <motion.div 
                key={selectedMask.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="z-30 mb-[-14px] flex items-center justify-center"
              >
                <div 
                  className="px-4 py-2 rounded-t-full border-2 border-white/30 text-xs font-mono font-bold text-white shadow-2xl flex items-center gap-1.5"
                  style={{ backgroundColor: selectedMask.color }}
                >
                  {selectedMask.symbol && (
                    <span className="text-sm font-extrabold">{selectedMask.symbol}</span>
                  )}
                  <span>{selectedMask.name}</span>
                </div>
              </motion.div>

              {/* Base Model Frame Layer */}
              <motion.div 
                key={selectedBase.id}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="z-20 w-32 h-32 rounded-3xl border-2 border-white/40 flex flex-col items-center justify-center relative shadow-2xl overflow-hidden"
                style={{ backgroundColor: selectedBase.color }}
              >
                {/* Mask Symbol if Base Unit */}
                {selectedBase.symbol && (
                  <span className="text-4xl font-extrabold text-white font-mono drop-shadow-[0_0_12px_white]">
                    {selectedBase.symbol}
                  </span>
                )}

                {/* Metallic Lens Glare */}
                <div className="absolute top-2 left-2 w-14 h-4 bg-white/20 rounded-full transform -rotate-12 pointer-events-none" />
              </motion.div>

              {/* Suit Outfit Layer */}
              <motion.div 
                key={selectedSuit.id}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="z-10 w-40 h-24 mt-[-12px] rounded-t-3xl border-t-2 border-x-2 border-white/30 flex items-center justify-center text-xs font-mono font-bold text-white shadow-2xl"
                style={{ backgroundColor: selectedSuit.color }}
              >
                {selectedSuit.name}
              </motion.div>

              {/* Accessory Overlay Tag */}
              <motion.div 
                key={selectedAccessory.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-0 z-40 px-3 py-1 rounded-full text-[9px] font-mono font-bold text-white border border-white/40 shadow-xl"
                style={{ backgroundColor: selectedAccessory.color }}
              >
                {selectedAccessory.name}
              </motion.div>

              {/* GLOWING PODIUM BASE */}
              <div 
                className="absolute bottom-[-16px] w-56 h-10 rounded-full blur-[2px] border-t-2 transition-colors duration-500 shadow-2xl flex items-center justify-center"
                style={{ 
                  backgroundColor: `${podiumAura}33`, 
                  borderColor: podiumAura,
                  boxShadow: `0 0 30px ${podiumAura}`
                }}
              >
                <div className="w-40 h-4 rounded-full bg-white/10" />
              </div>
            </div>

            {/* Podium Lighting Selector */}
            <div className="w-full pt-4 border-t border-[#ff0055]/20 flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-mono text-[10px]">PODIUM AURA:</span>
              <div className="flex items-center gap-2">
                {['#ff0055', '#00f0ff', '#f59e0b', '#a855f7'].map((hex) => (
                  <button
                    key={hex}
                    onClick={() => setPodiumAura(hex)}
                    className={`w-5 h-5 rounded-full border border-white/40 transition-transform ${
                      podiumAura === hex ? 'scale-125 border-white shadow-md' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Sleek Customization Menu & Selectable Tabs */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Selectable Category Tabs */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0a030d]/85 border border-[#ff0055]/30 overflow-x-auto">
              <button
                onClick={() => setActiveTab('base')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'base'
                    ? 'bg-[#ff0055] text-white shadow-[0_0_15px_#ff0055]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <User className="w-4 h-4" />
                Base Model
              </button>

              <button
                onClick={() => setActiveTab('mask')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'mask'
                    ? 'bg-[#ff0055] text-white shadow-[0_0_15px_#ff0055]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Crown className="w-4 h-4" />
                Mask / Headwear
              </button>

              <button
                onClick={() => setActiveTab('suit')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'suit'
                    ? 'bg-[#ff0055] text-white shadow-[0_0_15px_#ff0055]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Shirt className="w-4 h-4" />
                Suit Color
              </button>

              <button
                onClick={() => setActiveTab('accessory')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'accessory'
                    ? 'bg-[#ff0055] text-white shadow-[0_0_15px_#ff0055]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Glasses className="w-4 h-4" />
                Accessories
              </button>
            </div>

            {/* Customization Options Cards Grid */}
            <div className="bg-[#0a030d]/85 rounded-3xl border border-[#ff0055]/30 p-6 backdrop-blur-xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#ff0055]" />
                  SELECT {activeTab.toUpperCase()} GEAR
                </h3>
                <span className="text-[10px] font-mono text-zinc-500">
                  INSTANT PREVIEW ACTIVE
                </span>
              </div>

              {/* Items Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(activeTab === 'base'
                  ? BASE_MODELS
                  : activeTab === 'mask'
                  ? MASKS_HEADWEAR
                  : activeTab === 'suit'
                  ? SUIT_COLORS
                  : ACCESSORIES
                ).map((item) => {
                  const isSelected =
                    (activeTab === 'base' && selectedBase.id === item.id) ||
                    (activeTab === 'mask' && selectedMask.id === item.id) ||
                    (activeTab === 'suit' && selectedSuit.id === item.id) ||
                    (activeTab === 'accessory' && selectedAccessory.id === item.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectOption(item)}
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
                          className="w-10 h-10 rounded-xl border border-white/20 flex items-center justify-center font-mono font-bold text-white shadow"
                          style={{ backgroundColor: item.color }}
                        >
                          {item.symbol || item.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white tracking-tight">
                            {item.name}
                          </h4>
                          <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">
                            {item.locked ? `Requires ${item.cost?.toLocaleString()} PTS` : 'Unlocked Equipment'}
                          </span>
                        </div>
                      </div>

                      {/* Selection / Lock Badge */}
                      {item.locked ? (
                        <div className="p-2 rounded-lg bg-red-950/80 border border-red-600 text-red-400">
                          <Lock className="w-4 h-4" />
                        </div>
                      ) : isSelected ? (
                        <div className="p-2 rounded-lg bg-[#ff0055] text-white shadow-[0_0_10px_#ff0055]">
                          <Check className="w-4 h-4" />
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BOTTOM RIGHT: Prominent 'LOCK IN AVATAR' Action Button */}
            <div className="flex justify-end pt-4">
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

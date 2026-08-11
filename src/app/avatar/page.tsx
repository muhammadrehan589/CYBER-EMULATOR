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
  Square
} from 'lucide-react';

interface CustomizationOption {
  id: string;
  name: string;
  category: 'base' | 'head' | 'suit' | 'accessory';
  locked?: boolean;
  cost?: number;
  color: string;
  iconSymbol?: string;
}

const BASE_MODELS: CustomizationOption[] = [
  { id: 'base-1', name: 'Cyber Operative', category: 'base', color: '#ff0055' },
  { id: 'base-2', name: 'Guard Mask (Circle)', category: 'base', color: '#e60039', iconSymbol: '○' },
  { id: 'base-3', name: 'VIP Spectator', category: 'base', color: '#fbbf24' },
  { id: 'base-4', name: 'Retro Player #456', category: 'base', color: '#10b981' },
];

const HEADWEAR: CustomizationOption[] = [
  { id: 'head-1', name: 'Cyber Visor', category: 'head', color: '#ff0055' },
  { id: 'head-2', name: 'Hooded Cape', category: 'head', color: '#e60039' },
  { id: 'head-3', name: 'Tactical Helmet', category: 'head', color: '#64748b' },
  { id: 'head-4', name: 'Sleek Undercut', category: 'head', color: '#a855f7' },
];

const SUITS: CustomizationOption[] = [
  { id: 'suit-1', name: 'Tracksuit #456', category: 'suit', color: '#10b981' },
  { id: 'suit-2', name: 'Pink Guard Jumpsuit', category: 'suit', color: '#ff0055' },
  { id: 'suit-3', name: 'Frontman Trenchcoat', category: 'suit', color: '#1e293b' },
  { id: 'suit-4', name: 'Stealth Armor', category: 'suit', color: '#475569' },
];

const ACCESSORIES: CustomizationOption[] = [
  { id: 'acc-1', name: 'Holographic Tag', category: 'accessory', color: '#ff0055' },
  { id: 'acc-2', name: 'Laser Monocle', category: 'accessory', locked: true, cost: 1200, color: '#ef4444' },
  { id: 'acc-3', name: 'Golden VIP Mask', category: 'accessory', locked: true, cost: 2500, color: '#f59e0b' },
  { id: 'acc-4', name: 'Neon Katana', category: 'accessory', locked: true, cost: 5000, color: '#a855f7' },
];

export default function AvatarCreatorPage() {
  const router = useRouter();

  // Active Category Tab
  const [activeTab, setActiveTab] = useState<'base' | 'head' | 'suit' | 'accessory'>('base');

  // Selected Items State
  const [selectedBase, setSelectedBase] = useState(BASE_MODELS[0]);
  const [selectedHead, setSelectedHead] = useState(HEADWEAR[0]);
  const [selectedSuit, setSelectedSuit] = useState(SUITS[0]);
  const [selectedAccessory, setSelectedAccessory] = useState(ACCESSORIES[0]);

  // Lock Alert State
  const [lockAlert, setLockAlert] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSelectOption = (option: CustomizationOption) => {
    if (option.locked) {
      setLockAlert(`ITEM LOCKED: Requires ${option.cost?.toLocaleString()} PTS to unlock.`);
      setTimeout(() => setLockAlert(null), 3000);
      return;
    }

    setLockAlert(null);
    switch (option.category) {
      case 'base':
        setSelectedBase(option);
        break;
      case 'head':
        setSelectedHead(option);
        break;
      case 'suit':
        setSelectedSuit(option);
        break;
      case 'accessory':
        setSelectedAccessory(option);
        break;
    }
  };

  const handleSaveAvatar = () => {
    setIsSaving(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#020005] text-white p-4 sm:p-6 lg:p-10 font-sans relative overflow-x-hidden flex flex-col justify-between select-none">
      {/* Glow Orbs */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-[#ff0055]/15 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/3 w-[600px] h-[600px] bg-[#e60039]/15 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-6xl w-full mx-auto space-y-6 relative z-10">
        
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
            <button
              onClick={handleSaveAvatar}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff0055] to-[#e60039] hover:from-[#e60039] hover:to-[#ff0055] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(255,0,85,0.5)] border border-white/20 transition-all active:scale-95 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  SAVING AVATAR...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Avatar
                </>
              )}
            </button>
          </div>
        </header>

        {/* Lock Alert Banner */}
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

        {/* Main Studio Grid: Left Avatar Preview (1/3) + Right Tabs & Options (2/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT: Live Avatar Preview Box */}
          <div className="lg:col-span-1 bg-[#0a030d]/80 rounded-3xl border-2 border-[#ff0055]/50 p-6 backdrop-blur-xl shadow-[0_0_40px_rgba(255,0,85,0.25)] flex flex-col items-center justify-between min-h-[440px] relative overflow-hidden">
            {/* Viewfinder Header */}
            <div className="w-full flex items-center justify-between text-[10px] font-mono text-[#ff0055]">
              <span>VIEWFINDER: 3D</span>
              <span className="animate-pulse">● RENDER LIVE</span>
              <span>P456</span>
            </div>

            {/* AVATAR VECTOR ILLUSTRATION */}
            <div className="my-6 relative w-48 h-56 flex flex-col items-center justify-center">
              
              {/* Outer Glow Halo */}
              <div 
                className="absolute w-44 h-44 rounded-full blur-2xl opacity-60 transition-colors duration-500"
                style={{ backgroundColor: selectedBase.color }}
              />

              {/* Headwear / Hair Layer */}
              <motion.div 
                key={selectedHead.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="z-30 mb-[-12px] flex items-center justify-center"
              >
                <div 
                  className="px-4 py-1.5 rounded-t-full border-2 border-white/20 text-xs font-mono font-bold shadow-lg"
                  style={{ backgroundColor: selectedHead.color }}
                >
                  {selectedHead.name}
                </div>
              </motion.div>

              {/* Base Head / Mask Layer */}
              <motion.div 
                key={selectedBase.id}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="z-20 w-28 h-28 rounded-3xl border-2 border-white/30 flex flex-col items-center justify-center relative shadow-2xl overflow-hidden"
                style={{ backgroundColor: selectedBase.color }}
              >
                {/* Mask Symbol if Guard */}
                {selectedBase.iconSymbol && (
                  <span className="text-3xl font-extrabold text-white font-mono drop-shadow-[0_0_10px_white]">
                    {selectedBase.iconSymbol}
                  </span>
                )}

                {/* Visor Glare */}
                <div className="absolute top-2 left-2 w-12 h-4 bg-white/20 rounded-full transform -rotate-12 pointer-events-none" />
              </motion.div>

              {/* Suit / Outfit Layer */}
              <motion.div 
                key={selectedSuit.id}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="z-10 w-36 h-20 mt-[-10px] rounded-t-3xl border-t-2 border-x-2 border-white/30 flex items-center justify-center text-xs font-mono font-bold text-white shadow-xl"
                style={{ backgroundColor: selectedSuit.color }}
              >
                {selectedSuit.name}
              </motion.div>

              {/* Accessory Overlay Tag */}
              <motion.div 
                key={selectedAccessory.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-2 z-40 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold text-white border border-white/40 shadow-lg"
                style={{ backgroundColor: selectedAccessory.color }}
              >
                {selectedAccessory.name}
              </motion.div>
            </div>

            {/* Avatar Summary Badge */}
            <div className="w-full p-3 rounded-xl bg-[#050008] border border-zinc-800 text-center font-mono text-xs">
              <span className="text-zinc-400 block text-[10px]">CONFIGURED OPERANT:</span>
              <span className="font-bold text-white">
                {selectedBase.name} + {selectedSuit.name}
              </span>
            </div>
          </div>

          {/* RIGHT: Customization Categories & Item Selector (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Category Navigation Tabs */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0a030d]/80 border border-[#ff0055]/30 overflow-x-auto">
              <button
                onClick={() => setActiveTab('base')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'base'
                    ? 'bg-[#ff0055] text-white shadow-[0_0_15px_#ff0055]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <User className="w-4 h-4" />
                Base Model
              </button>

              <button
                onClick={() => setActiveTab('head')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'head'
                    ? 'bg-[#ff0055] text-white shadow-[0_0_15px_#ff0055]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Crown className="w-4 h-4" />
                Headwear
              </button>

              <button
                onClick={() => setActiveTab('suit')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'suit'
                    ? 'bg-[#ff0055] text-white shadow-[0_0_15px_#ff0055]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Shirt className="w-4 h-4" />
                Suit Outfit
              </button>

              <button
                onClick={() => setActiveTab('accessory')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'accessory'
                    ? 'bg-[#ff0055] text-white shadow-[0_0_15px_#ff0055]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Glasses className="w-4 h-4" />
                Accessories
              </button>
            </div>

            {/* Customization Options Grid */}
            <div className="bg-[#0a030d]/80 rounded-3xl border border-[#ff0055]/30 p-6 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#ff0055]" />
                  SELECT {activeTab.toUpperCase()} GEAR
                </h3>
                <span className="text-[10px] font-mono text-zinc-500">
                  PLAYER BALANCE: 4,560 PTS
                </span>
              </div>

              {/* Items Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(activeTab === 'base'
                  ? BASE_MODELS
                  : activeTab === 'head'
                  ? HEADWEAR
                  : activeTab === 'suit'
                  ? SUITS
                  : ACCESSORIES
                ).map((item) => {
                  const isSelected =
                    (activeTab === 'base' && selectedBase.id === item.id) ||
                    (activeTab === 'head' && selectedHead.id === item.id) ||
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
                          ? 'bg-[#1e0720] border-2 border-[#ff0055] shadow-[0_0_20px_rgba(255,0,85,0.3)]'
                          : 'bg-[#050008] border-zinc-800 hover:border-[#ff0055]/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl border border-white/20 flex items-center justify-center font-mono font-bold text-white shadow"
                          style={{ backgroundColor: item.color }}
                        >
                          {item.iconSymbol || item.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white tracking-tight">
                            {item.name}
                          </h4>
                          <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">
                            {item.locked ? `Requires ${item.cost?.toLocaleString()} PTS` : 'Unlocked Gear'}
                          </span>
                        </div>
                      </div>

                      {/* Right Status Badge */}
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
          </div>
        </div>
      </div>
    </div>
  );
}

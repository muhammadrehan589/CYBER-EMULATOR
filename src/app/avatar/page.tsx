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
  Layers,
  Circle,
  Triangle,
  Square,
  Zap
} from 'lucide-react';

// Layer Interfaces for Modular Stacking
interface AvatarLayerOption {
  id: string;
  name: string;
  category: 'body' | 'hair' | 'top' | 'accessory';
  color: string;
  accentColor?: string;
  symbol?: string;
  locked?: boolean;
  cost?: number;
  description?: string;
}

// LayeredAvatar Component: Absolutely stacked modular layers
interface LayeredAvatarProps {
  baseBody: AvatarLayerOption;
  hairHeadwear: AvatarLayerOption;
  clothingTop: AvatarLayerOption;
  accessory: AvatarLayerOption;
  auraColor: string;
}

const LayeredAvatar: React.FC<LayeredAvatarProps> = ({
  baseBody,
  hairHeadwear,
  clothingTop,
  accessory,
  auraColor,
}) => {
  return (
    <div className="relative w-64 h-80 flex flex-col items-center justify-center">
      {/* Background Aura Light */}
      <div 
        className="absolute w-56 h-56 rounded-full blur-3xl opacity-50 transition-colors duration-500 pointer-events-none"
        style={{ backgroundColor: auraColor }}
      />

      {/* Layer 1 (Z-10): Base Body Silhouette */}
      <motion.div 
        key={baseBody.id}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-6 z-10 w-36 h-48 rounded-t-full border-2 border-white/20 shadow-2xl flex flex-col items-center justify-start pt-4 transition-colors duration-300"
        style={{ backgroundColor: baseBody.color }}
      >
        <span className="text-[10px] font-mono text-white/60 tracking-wider">
          {baseBody.name}
        </span>
      </motion.div>

      {/* Layer 2 (Z-20): Clothing / Top Outfit Layer */}
      <motion.div 
        key={clothingTop.id}
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-6 z-20 w-44 h-32 rounded-t-3xl border-t-2 border-x-2 border-white/30 flex flex-col items-center justify-center p-2 shadow-2xl transition-colors duration-300"
        style={{ backgroundColor: clothingTop.color }}
      >
        {/* Collar & Stripe Detail */}
        <div 
          className="w-full h-3 border-b border-white/20 mb-2 rounded-t-xl"
          style={{ backgroundColor: clothingTop.accentColor || '#ffffff22' }}
        />
        <span className="text-xs font-mono font-bold text-white text-center drop-shadow">
          {clothingTop.name}
        </span>
      </motion.div>

      {/* Layer 3 (Z-30): Head & Face Mask Layer */}
      <motion.div 
        key={hairHeadwear.id}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute top-8 z-30 w-32 h-32 rounded-3xl border-2 border-white/40 flex flex-col items-center justify-center relative shadow-2xl overflow-hidden transition-colors duration-300"
        style={{ backgroundColor: hairHeadwear.color }}
      >
        {/* Symbol overlay if Guard Mask */}
        {hairHeadwear.symbol ? (
          <span className="text-4xl font-extrabold text-white font-mono drop-shadow-[0_0_12px_white]">
            {hairHeadwear.symbol}
          </span>
        ) : (
          <div className="w-12 h-4 bg-black/60 rounded-full border border-white/30 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#ff0055] animate-ping" />
          </div>
        )}

        {/* Lens Glare */}
        <div className="absolute top-2 left-2 w-14 h-4 bg-white/20 rounded-full transform -rotate-12 pointer-events-none" />
      </motion.div>

      {/* Layer 4 (Z-40): Hair / Hood Top Trim */}
      <div 
        className="absolute top-5 z-40 px-4 py-1 rounded-t-full border-t-2 border-x-2 border-white/40 text-[10px] font-mono font-bold text-white shadow-xl"
        style={{ backgroundColor: hairHeadwear.color }}
      >
        {hairHeadwear.name}
      </div>

      {/* Layer 5 (Z-50): Accessory Overlay Tag */}
      <motion.div 
        key={accessory.id}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
        className="absolute top-4 right-0 z-50 px-3 py-1 rounded-full text-[9px] font-mono font-bold text-white border border-white/40 shadow-xl"
        style={{ backgroundColor: accessory.color }}
      >
        {accessory.name}
      </motion.div>

      {/* Podium Base */}
      <div 
        className="absolute -bottom-4 w-60 h-10 rounded-full blur-[2px] border-t-2 transition-colors duration-500 shadow-2xl flex items-center justify-center"
        style={{ 
          backgroundColor: `${auraColor}33`, 
          borderColor: auraColor,
          boxShadow: `0 0 30px ${auraColor}`
        }}
      >
        <div className="w-44 h-4 rounded-full bg-white/10" />
      </div>
    </div>
  );
};

// Data Sets for Modular Categories (No Blue)
const BODY_OPTIONS: AvatarLayerOption[] = [
  { id: 'body-1', name: 'Humanoid Operative', category: 'body', color: '#ff0055', description: 'Standard athletic cyber frame' },
  { id: 'body-2', name: 'Robotic Android', category: 'body', color: '#475569', description: 'Reinforced metallic alloy chassis' },
  { id: 'body-3', name: 'Emerald Bio-Specimen', category: 'body', color: '#10b981', description: 'Bio-luminescent energy lattice' },
  { id: 'body-4', name: 'Charcoal Stealth Unit', category: 'body', color: '#18181b', description: 'Radar-absorbing matte body' },
];

const HAIR_OPTIONS: AvatarLayerOption[] = [
  { id: 'hair-1', name: 'Hooded Cloak', category: 'hair', color: '#e60039' },
  { id: 'hair-2', name: 'Circle Guard Mask', category: 'hair', color: '#ff0055', symbol: '○' },
  { id: 'hair-3', name: 'Triangle Guard Mask', category: 'hair', color: '#ff0055', symbol: '△' },
  { id: 'hair-4', name: 'Square Guard Mask', category: 'hair', color: '#ff0055', symbol: '□' },
  { id: 'hair-5', name: 'Tactical Visor Helmet', category: 'hair', color: '#334155' },
  { id: 'hair-6', name: 'Sleek Undercut', category: 'hair', color: '#a855f7' },
];

const TOP_OPTIONS: AvatarLayerOption[] = [
  { id: 'top-1', name: 'Tracksuit #456', category: 'top', color: '#10b981', accentColor: '#ffffff' },
  { id: 'top-2', name: 'Pink Guard Jumpsuit', category: 'top', color: '#ff0055', accentColor: '#000000' },
  { id: 'top-3', name: 'Tactical Armor Plating', category: 'top', color: '#1e293b', accentColor: '#e60039' },
  { id: 'top-4', name: 'Casual Tech-Wear', category: 'top', color: '#3f3f46', accentColor: '#a855f7' },
  { id: 'top-5', name: 'Vanguard Gold Trench', category: 'top', color: '#f59e0b', accentColor: '#ffffff' },
];

const ACCESSORY_OPTIONS: AvatarLayerOption[] = [
  { id: 'acc-1', name: 'Holographic Tag', category: 'accessory', color: '#ff0055' },
  { id: 'acc-2', name: 'Laser Monocle', category: 'accessory', locked: true, cost: 1200, color: '#ef4444' },
  { id: 'acc-3', name: 'Golden VIP Mask', category: 'accessory', locked: true, cost: 2500, color: '#f59e0b' },
  { id: 'acc-4', name: 'Neon Katana Blade', category: 'accessory', locked: true, cost: 5000, color: '#a855f7' },
];

export default function LayeredAvatarStudio() {
  const router = useRouter();

  // Active Category Tab
  const [activeTab, setActiveTab] = useState<'body' | 'hair' | 'top' | 'accessory'>('body');

  // Selected Modular Layer States
  const [selectedBody, setSelectedBody] = useState(BODY_OPTIONS[0]);
  const [selectedHair, setSelectedHair] = useState(HAIR_OPTIONS[0]);
  const [selectedTop, setSelectedTop] = useState(TOP_OPTIONS[0]);
  const [selectedAccessory, setSelectedAccessory] = useState(ACCESSORY_OPTIONS[0]);

  // Lock Alert State & Save State
  const [lockAlert, setLockAlert] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSelectLayer = (option: AvatarLayerOption) => {
    if (option.locked) {
      setLockAlert(`ITEM LOCKED: Requires ${option.cost?.toLocaleString()} PTS in Player Arena.`);
      setTimeout(() => setLockAlert(null), 3000);
      return;
    }

    setLockAlert(null);
    switch (option.category) {
      case 'body':
        setSelectedBody(option);
        break;
      case 'hair':
        setSelectedHair(option);
        break;
      case 'top':
        setSelectedTop(option);
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
      {/* Ambient Glow Accents (No Blue) */}
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
                  MODULAR LAYERED AVATAR ENGINE
                </span>
                <div className="flex items-center gap-1 text-[#ff0055] px-2 py-0.5 rounded-full bg-[#1c061e] border border-[#ff0055]/30">
                  <Circle className="w-2.5 h-2.5 fill-current" />
                  <Triangle className="w-2.5 h-2.5 fill-current" />
                  <Square className="w-2.5 h-2.5 fill-current" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-200 to-[#ff0055]">
                Modular 2D/3D Avatar Creator
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

        {/* Main Studio Grid: Left LayeredAvatar Podium (1/3) + Right Customization Grid (2/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT PANEL: Modular LayeredAvatar Podium Display */}
          <div className="lg:col-span-1 bg-[#0a030d]/85 rounded-3xl border-2 border-[#ff0055]/50 p-6 backdrop-blur-xl shadow-[0_0_45px_rgba(255,0,85,0.25)] flex flex-col items-center justify-between min-h-[500px] relative overflow-hidden">
            
            {/* Viewfinder Header */}
            <div className="w-full flex items-center justify-between text-[10px] font-mono text-[#ff0055] pb-2 border-b border-[#ff0055]/20">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ff0055] animate-ping" />
                LAYERED STACK // LIVE RENDER
              </span>
              <span className="flex items-center gap-1">
                <Layers className="w-3 h-3 text-[#ff0055]" />
                5 LAYERS ACTIVE
              </span>
            </div>

            {/* MODULAR LAYERED AVATAR DISPLAY COMPONENT */}
            <div className="my-6">
              <LayeredAvatar
                baseBody={selectedBody}
                hairHeadwear={selectedHair}
                clothingTop={selectedTop}
                accessory={selectedAccessory}
                auraColor={selectedBody.color}
              />
            </div>

            {/* Layer Stack Summary */}
            <div className="w-full p-3 rounded-xl bg-[#050008] border border-zinc-800 text-center font-mono text-xs space-y-1">
              <span className="text-zinc-400 block text-[10px]">STACKED CONFIGURATION:</span>
              <div className="text-white font-bold truncate">
                {selectedHair.name} + {selectedTop.name}
              </div>
              <div className="text-[10px] text-[#ff0055] font-semibold">
                BODY BASE: {selectedBody.name}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Customization Grid (Tabs: Body, Hair, Top, Accessories) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Customization Tabs */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0a030d]/85 border border-[#ff0055]/30 overflow-x-auto">
              <button
                onClick={() => setActiveTab('body')}
                className={`flex-1 py-3 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'body'
                    ? 'bg-[#ff0055] text-white shadow-[0_0_15px_#ff0055]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Body
              </button>

              <button
                onClick={() => setActiveTab('hair')}
                className={`flex-1 py-3 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'hair'
                    ? 'bg-[#ff0055] text-white shadow-[0_0_15px_#ff0055]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                Hair / Headwear
              </button>

              <button
                onClick={() => setActiveTab('top')}
                className={`flex-1 py-3 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'top'
                    ? 'bg-[#ff0055] text-white shadow-[0_0_15px_#ff0055]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Shirt className="w-3.5 h-3.5" />
                Top / Clothing
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
                  SELECT {activeTab.toUpperCase()} LAYER
                </h3>
                <span className="text-[10px] font-mono text-zinc-500">
                  INSTANT MODULAR SYNC
                </span>
              </div>

              {/* Items Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-1">
                {(activeTab === 'body'
                  ? BODY_OPTIONS
                  : activeTab === 'hair'
                  ? HAIR_OPTIONS
                  : activeTab === 'top'
                  ? TOP_OPTIONS
                  : ACCESSORY_OPTIONS
                ).map((item) => {
                  const isSelected =
                    (activeTab === 'body' && selectedBody.id === item.id) ||
                    (activeTab === 'hair' && selectedHair.id === item.id) ||
                    (activeTab === 'top' && selectedTop.id === item.id) ||
                    (activeTab === 'accessory' && selectedAccessory.id === item.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectLayer(item)}
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
                          style={{ backgroundColor: item.color }}
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
                              : item.description || 'Unlocked Layer Asset'}
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

            {/* BOTTOM RIGHT: Action Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleLockInAvatar}
                disabled={isSaving}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#ff0055] via-[#e60039] to-[#ff0055] text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-[0_0_30px_#ff0055] hover:scale-105 active:scale-95 border border-white/30 transition-all cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    SAVING LAYERED CONFIG...
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

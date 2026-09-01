'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import { AvatarSVG, MiniAvatar, DEFAULT_AVATAR, SKIN_TONES, HAIR_COLORS, EYE_COLORS, GENDER_OPTIONS, EYE_STYLES, BROW_STYLES, NOSE_STYLES, FACE_SHAPES, LIPS_STYLES, EAR_STYLES, BEARD_STYLES, HAIR_STYLES, BODY_TYPES, OUTFIT_STYLES, AVATAR_SUB_CATEGORIES, getSkinColor, type AvatarState, type AvatarSubCategory, type ColorOption, type Option, type MainTab } from '../../components/Avatar';

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

  const handleSave = async () => {
    setIsSaving(true);
    
    const newWardrobe = [...savedWardrobe, avatar];
    setSavedWardrobe(newWardrobe);
    localStorage.setItem('cyberWardrobe', JSON.stringify(newWardrobe));

    const empId = localStorage.getItem('currentUserEmpId');
    if (empId) {
      try {
        await fetch('/api/users', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            empId,
            updates: { activeAvatar: avatar }
          }),
        });

        // Tell socket server to refresh leaderboard for everyone
        const { io } = await import('socket.io-client');
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || `http://${window.location.hostname}:3001`;
        const tempSocket = io(socketUrl, { transports: ['websocket'] });
        tempSocket.emit('trigger_refresh');
        setTimeout(() => tempSocket.disconnect(), 1000);
      } catch (err) {
        console.error('Failed to sync avatar to DB:', err);
      }
    }

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
          onClick={() => router.push('/')}
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

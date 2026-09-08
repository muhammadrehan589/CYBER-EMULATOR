'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Gamepad2, 
  ArrowLeft, 
  Trophy, 
  Sparkles, 
  Circle, 
  Triangle, 
  Square, 
  Wifi, 
  WifiOff,
  List,
  Bell,
  Play,
  X
} from 'lucide-react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { MiniAvatar, AvatarSVG, DEFAULT_AVATAR, type AvatarState } from '@/components/Avatar';
import ItemShopModal from '@/components/shop/ItemShopModal';
import PasswordQuest from '@/components/dashboard/PasswordQuest';
import InventoryModal from '@/components/dashboard/InventoryModal';
import { PreGameBriefing } from '@/components/PreGameBriefing';
import { useQuizStore } from '@/store/quizStore';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { LeaderboardPlayer, FloatingEmoji, FloatingStat } from '@/types/dashboard';
import { LeaderboardItem, BADGE_COLORS } from '@/components/dashboard/LeaderboardItem';
import { FullLeaderboardModal } from '@/components/dashboard/FullLeaderboardModal';
import { useToast } from '@/components/ui/Toast';



export default function Phase3RealtimeDashboard() {
  const router = useRouter();
  const { empId, role, isAuthenticated, isAuthReady } = useAuth();
  const { socket, isConnected } = useSocket(empId);
  const { leaderboard, setLeaderboard, fetchLeaderboard } = useLeaderboard(socket);

  const { coinsEarned, addCoins } = useQuizStore();
  const setMyScore = (s: number) => useQuizStore.setState({ score: s });
  const setCoins = (c: number) => useQuizStore.setState({ coinsEarned: c });
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    if (isAuthReady) {
      if (!isAuthenticated) {
        window.location.href = '/login';
      } else if (role === 'Admin') {
        window.location.href = '/admin';
      }
    }
  }, [isAuthReady, isAuthenticated, role, router]);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [floatingStats, setFloatingStats] = useState<FloatingStat[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [recentBattles, setRecentBattles] = useState<any[]>([]);
  const [expandedBattle, setExpandedBattle] = useState<string | null>(null);
  const [isBattlesExpanded, setIsBattlesExpanded] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showRecentBattlesModal, setShowRecentBattlesModal] = useState(false);
  const [selectedPool, setSelectedPool] = useState<'Technical' | 'Non-Technical' | null>(null);

  const [showPreBriefing, setShowPreBriefing] = useState(false);
  const [isFirstTimeBriefing, setIsFirstTimeBriefing] = useState(false);

  useEffect(() => {
    try {
      const hist = localStorage.getItem('battleHistory');
      if (hist) setRecentBattles(JSON.parse(hist));
      
      const hasSeenTour = localStorage.getItem('hasSeenTour');
      if (!hasSeenTour) {
        setShowPreBriefing(true);
        setIsFirstTimeBriefing(true);
      }
    } catch (e) {}
  }, []);

  const [reactionCounts, setReactionCounts] = useState<{ [key: string]: number }>({
    '🔥': 0,
    '⚡': 0,
    '💀': 0,
    '👑': 0,
    '🎯': 0,
  });
  
  const [selectedTarget, setSelectedTarget] = useState<LeaderboardPlayer | null>(null);
  
  const [isFullLeaderboardOpen, setIsFullLeaderboardOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isQuestOpen, setIsQuestOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [showOnline1v1, setShowOnline1v1] = useState(false);
  const [showOffline1v1, setShowOffline1v1] = useState(false);
  const [offlineSearchQuery, setOfflineSearchQuery] = useState('');
  const [incomingChallenge, setIncomingChallenge] = useState<{challengerId: string, challengerName: string} | null>(null);
  const [challengeTimer, setChallengeTimer] = useState<number | null>(null);
  const [duelCountdown, setDuelCountdown] = useState<number | null>(null);
  const [pendingChallengeTarget, setPendingChallengeTarget] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  
  const sendDuelChallenge = (targetId: string, targetName: string) => {
    if (!socket) return;
    const currentUser = leaderboard.find(p => p.empId === empId);
    setPendingChallengeTarget(targetId);
    socket.emit('initiate_1v1_challenge', { targetId, challengerName: currentUser?.name || 'A Player' });
    showToast(`Challenge sent to ${targetName.toUpperCase()}`, 'info');
  };

  const triggerDuelCountdown = (matchData?: { challengerId: string, targetId: string }) => {
    setDuelCountdown(4);
    const audio = new Audio('/game duel/make_more_sound-321-go-8-bit-video-game-sound-version-1-145007.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
    let timeLeft = 4;
    const timer = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft > 0) {
        setDuelCountdown(timeLeft);
      } else {
        clearInterval(timer);
        setDuelCountdown(null);
        
        if (matchData) {
          window.location.href = `/battle?matchId=battle_${matchData.challengerId}_${matchData.targetId}&challengerId=${matchData.challengerId}&targetId=${matchData.targetId}`;
        } else {
          window.location.href = '/simulation-matrix';
        }
      }
    }, 1000);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('online_users', (users: string[]) => {
      setOnlineUsers(users);
    });

    socket.on('send_emoji', (data: { empId: string; emoji: string; id: string; senderName?: string }) => {
      const emojiId = data.id || `${Date.now()}-${Math.random()}`;
      setFloatingEmojis((prev) => [...prev, { id: emojiId, empId: data.empId, emoji: data.emoji, senderName: data.senderName }]);
      setReactionCounts((prev) => ({
        ...prev,
        [data.emoji]: (prev[data.emoji] || 0) + 1,
      }));
      setTimeout(() => {
        setFloatingEmojis((prev) => prev.filter((e) => e.id !== emojiId));
      }, 1800);
    });

    socket.on('send_stat_animation', (data: FloatingStat) => {
      const statId = data.id || `stat-${Date.now()}-${Math.random()}`;
      setFloatingStats((prev) => [...prev, { ...data, id: statId }]);
      setTimeout(() => {
        setFloatingStats((prev) => prev.filter((s) => s.id !== statId));
      }, 2000);
    });

    socket.on('receive_1v1_challenge', (data: { challengerId: string, challengerName: string }) => {
      setIncomingChallenge(data);
      setChallengeTimer(15);
    });

    socket.on('1v1_challenge_accepted', (data: { challengerId: string, targetId: string }) => {
      triggerDuelCountdown(data);
    });

    socket.on('1v1_challenge_denied', (data: { reason: string }) => {
      showToast(`Challenge denied: ${data.reason}`, 'error');
    });

    socket.on('1v1_challenge_offline_accepted', (data: { targetId: string, matchId: string }) => {
      showToast('Target is offline — entering asynchronous ghost battle mode...', 'warning');
      window.location.href = `/battle?matchId=${data.matchId}&challengerId=${empId}&targetId=${data.targetId}&async=true`;
    });

    socket.on('pending_notifications', (notifs: any[]) => {
      setNotifications(notifs);
    });

    socket.on('new_notification', (notif: any) => {
      setNotifications(prev => [...prev, notif]);
      showToast(notif.message, 'info');
    });

    return () => {
      socket.off('online_users');
      socket.off('send_emoji');
      socket.off('send_stat_animation');
      socket.off('receive_1v1_challenge');
      socket.off('1v1_challenge_accepted');
      socket.off('1v1_challenge_denied');
      socket.off('1v1_challenge_offline_accepted');
      socket.off('pending_notifications');
      socket.off('new_notification');
    };
  }, [socket]);

  // Timer effect for challenge expiration
  useEffect(() => {
    if (challengeTimer === null || challengeTimer <= 0) return;
    const interval = setInterval(() => {
      setChallengeTimer((prev) => {
        if (prev && prev <= 1) {
          // Timer ended
          if (incomingChallenge && socket) {
            socket.emit('deny_1v1_challenge', { challengerId: incomingChallenge.challengerId, reason: 'Timeout' });
          }
          setIncomingChallenge(null);
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [challengeTimer, incomingChallenge, socket]);

  const handleScoreBoost = async (empId: string, xpAmount: number = 10, coinCost: number = 50) => {
    const currentEmpId = empId;
    if (!currentEmpId || currentEmpId === empId) return; // Cannot boost yourself

    const sender = leaderboard.find(p => p.empId === currentEmpId);
    if (!sender || (sender.coins || 0) < coinCost) {
      showToast(`Not enough coins! You need ${coinCost} coins to send ${xpAmount} XP.`, 'error');
      return;
    }

    try {
      await Promise.all([
        fetch('/api/users', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ empId: currentEmpId, inc: { coins: -coinCost } }),
        }),
        fetch('/api/users', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ empId, inc: { xp: xpAmount } }),
        })
      ]);

      // Trigger real-time refresh for all connected clients (no page reload needed)
      const statIdXP = `xp-${Date.now()}`;
      const statIdCoins = `coins-${Date.now()}`;
      const xpAnim: FloatingStat = { id: statIdXP, empId, type: 'xp_up', amount: xpAmount };
      const coinsAnim: FloatingStat = { id: statIdCoins, empId: currentEmpId, type: 'coins_down', amount: coinCost };

      if (socket && isConnected) {
        socket.emit('trigger_refresh');
        socket.emit('send_stat_animation', xpAnim);
        socket.emit('send_stat_animation', coinsAnim);
      } else {
        fetchLeaderboard();
        setFloatingStats(prev => [...prev, xpAnim, coinsAnim]);
        setTimeout(() => setFloatingStats(prev => prev.filter(s => s.id !== statIdXP && s.id !== statIdCoins)), 2000);
      }

      fetch('/api/activity-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empId,
          action: 'XP Boost',
          type: 'score',
          details: `XP boosted by +${xpAmount} from ${sender.name}.`,
        }),
      }).catch((err) => console.error('[Dashboard] Log persist failed:', err));
    } catch (err) {
      console.error('[Dashboard] XP transfer failed:', err);
    }
  };

  const handleEmitEmoji = (empId: string, emoji: string) => {
    const currentEmpId = empId;
    const sender = leaderboard.find(p => p.empId === currentEmpId);
    const senderName = sender ? sender.name : 'Unknown';

    const emojiObj = { empId, emoji, id: `emoji-${Date.now()}-${Math.random()}`, senderName };
    if (!socket || !isConnected) {
      setFloatingEmojis((prev) => [...prev, emojiObj]);
      setReactionCounts((prev) => ({ ...prev, [emoji]: (prev[emoji] || 0) + 1 }));
      setTimeout(() => {
        setFloatingEmojis((prev) => prev.filter((e) => e.id !== emojiObj.id));
      }, 1800);
    } else {
      socket.emit('send_emoji', emojiObj);
    }
  };

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      popoverClass: 'cyber-tour-theme',
      steps: [
        { element: '#tour-notifications', popover: { title: 'System Alerts', description: 'Check for incoming challenges and system events here.', side: "bottom", align: 'end' }},
        { element: '#tour-avatar', popover: { title: 'Edit Avatar', description: 'Customize your visual identity in the matrix.', side: "bottom", align: 'start' }},
        { element: '#tour-market', popover: { title: 'Black Market', description: 'Exchange your coins for items and upgrades.', side: "bottom", align: 'start' }},
        { element: '#tour-inventory', popover: { title: 'Inventory', description: 'View and equip your acquired items.', side: "bottom", align: 'start' }},
        { element: '#tour-profile', popover: { title: 'Operant Profile', description: 'Your basic identification and visual status.', side: "right", align: 'start' }},
        { element: '#tour-briefing', popover: { title: 'Mission Briefing', description: 'Review the rules and objectives of the simulation.', side: "right", align: 'start' }},
        { element: '#tour-guide', popover: { title: 'Survival Guide', description: 'Replay this tour anytime you need a refresher.', side: "right", align: 'start' }},
        { element: '#tour-stats', popover: { title: 'Stats Panel', description: 'Track your XP level and total coins.', side: "right", align: 'start' }},
        { element: '#tour-battles', popover: { title: 'Recent Battles', description: 'Your combat history and outcomes.', side: "right", align: 'start' }},
        { element: '#tour-pool-selector', popover: { title: 'Question Pool', description: 'Select the technical or non-technical category before entering the matrix.', side: "top", align: 'center' }},
        { element: '#tour-matrix', popover: { title: 'Simulation Matrix', description: 'Enter the main solo training environment.', side: "bottom", align: 'center' }},
        { element: '#tour-online', popover: { title: 'Online Duel', description: 'Challenge other Operants who are currently online.', side: "bottom", align: 'start' }},
        { element: '#tour-offline', popover: { title: 'Offline Duel', description: 'Challenge disconnected Operants asynchronously.', side: "bottom", align: 'start' }},
        { element: '#tour-leaderboard', popover: { title: 'Live Leaderboard', description: 'Track rankings and select targets from the active player list.', side: "left", align: 'start' }},
        { element: '#tour-full-leaderboard', popover: { title: 'Full Roster', description: 'View the complete historical player rankings.', side: "left", align: 'start' }},
        { element: '#tour-target-panel', popover: { title: 'Target Engagement', description: 'Once a target is locked from the leaderboard, send them reactions or coin-funded XP boosts!', side: "left", align: 'start' }},
      ]
    });
    driverObj.drive();
  };

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center text-red-500 font-mono tracking-[0.3em]">
        VERIFYING CLEARANCE...
      </div>
    );
  }

  const handleBriefingAcknowledge = () => {
    setShowPreBriefing(false);
    if (isFirstTimeBriefing) {
      setShowWelcome(true);
    }
  };

  const handleWelcomeAcknowledge = () => {
    setShowWelcome(false);
    localStorage.setItem('hasSeenTour', 'true');
    setTimeout(() => {
      startTour();
    }, 500);
  };

  return (
    <div className="min-h-screen h-screen bg-black text-white p-4 sm:p-6 lg:p-8 font-sans relative overflow-x-hidden flex flex-col justify-between select-none">
      {ToastContainer}
      
      {showPreBriefing && <PreGameBriefing isFirstTime={isFirstTimeBriefing} onAcknowledge={handleBriefingAcknowledge} />}
      
      {showWelcome && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-[#030303] border-2 border-[#ff0055] rounded-3xl p-8 max-w-lg w-full shadow-[0_0_50px_rgba(255,0,85,0.4)] text-center space-y-6">
            <h2 className="text-[#ff0055] font-black font-mono text-3xl uppercase tracking-widest drop-shadow-[0_0_10px_currentColor]">Welcome</h2>
            <p className="text-gray-300 font-mono text-sm leading-relaxed">
              You are now connected to ZERO DAY. Before jumping into the matrix, let's take a quick system orientation tour to help you get started.
            </p>
            <button 
              onClick={handleWelcomeAcknowledge}
              className="w-full py-4 bg-[#ff0055] text-white font-black font-mono tracking-widest uppercase hover:bg-white hover:text-[#ff0055] transition-all shadow-[0_0_20px_rgba(255,0,85,0.5)] active:scale-95 rounded-xl border-2 border-transparent hover:border-[#ff0055]"
            >
              START TOUR
            </button>
          </div>
        </div>
      )}
      
      {/* Fixed Floating Action Buttons on Far Left Edge */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        <button 
          id="tour-briefing"
          onClick={() => {
            setIsFirstTimeBriefing(false);
            setShowPreBriefing(true);
          }}
          className="bg-[#ff0055]/10 hover:bg-[#ff0055] text-[#ff0055] hover:text-white border-y border-r border-[#ff0055] py-10 px-4 rounded-r-3xl transition-all group backdrop-blur-md shadow-[0_0_25px_rgba(255,0,85,0.5)] cursor-pointer overflow-hidden relative"
        >
          <span className="absolute inset-0 border-y border-r border-white/20 rounded-r-3xl animate-pulse group-hover:border-transparent pointer-events-none"></span>
          <div className="flex flex-col gap-2 font-mono font-black text-xl uppercase relative z-10 items-center justify-center">
            <span>B</span><span>R</span><span>I</span><span>E</span><span>F</span><span>I</span><span>N</span><span>G</span>
          </div>
        </button>

        <button 
          id="tour-guide"
          onClick={startTour}
          className="bg-[#ff0055]/10 hover:bg-[#ff0055] text-[#ff0055] hover:text-white border-y border-r border-[#ff0055] py-10 px-4 rounded-r-3xl transition-all group backdrop-blur-md shadow-[0_0_25px_rgba(255,0,85,0.5)] cursor-pointer overflow-hidden relative"
        >
          <span className="absolute inset-0 border-y border-r border-white/20 rounded-r-3xl animate-pulse group-hover:border-transparent pointer-events-none"></span>
          <div className="flex flex-col gap-2 font-mono font-black text-xl uppercase relative z-10 items-center justify-center">
            <span>G</span><span>U</span><span>I</span><span>D</span><span>E</span>
          </div>
        </button>
      </div>
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#ff0055]/15 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#e60039]/15 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-[1600px] w-full mx-auto space-y-6 relative z-10 my-auto px-0 2xl:px-8">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#ff0055]/30">
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="p-2.5 rounded-xl bg-[#0e0414] border border-[#ff0055]/30 text-[#ff0055] hover:bg-[#ff0055] hover:text-white transition-all shadow-[0_0_10px_rgba(255,0,85,0.2)]"
              title="Sign Out to Login"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#ff0055]/20 border border-[#ff0055]/40 text-[#ff0055] shadow-[0_0_15px_#ff0055]">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-wider text-white">
                  ZERO DAY
                </span>
                <div className="flex items-center gap-1 text-[#ff0055] px-2 py-0.5 rounded-full bg-[#1c061e] border border-[#ff0055]/30">
                  <Circle className="w-2.5 h-2.5 fill-current" />
                  <Triangle className="w-2.5 h-2.5 fill-current" />
                  <Square className="w-2.5 h-2.5 fill-current" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              id="tour-market"
              onClick={() => setIsShopOpen(true)} 
              className="bg-black hover:bg-[#ff0055]/10 text-white px-4 py-2.5 rounded-xl font-bold border border-[#ff0055] font-mono tracking-widest text-xs shadow-[0_0_15px_rgba(255,0,85,0.4)] transition-all active:scale-95 cursor-pointer"
            >
              🛒 BLACK MARKET
            </button>
            <button 
              id="tour-inventory"
              onClick={() => setIsInventoryOpen(true)}
              className="bg-black hover:bg-[#ff0055]/10 text-white px-4 py-2.5 rounded-xl font-bold border border-[#ff0055] font-mono tracking-widest text-xs shadow-[0_0_15px_rgba(255,0,85,0.4)] transition-all active:scale-95 cursor-pointer"
            >
              📦 INVENTORY
            </button>
            <Link
              id="tour-avatar"
              href="/avatar"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff0055] to-[#e60039] hover:from-[#e60039] hover:to-[#ff0055] text-white text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(255,0,85,0.5)] border border-white/20 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white" />
              EDIT AVATAR
            </Link>
            <div className="relative">
              <button 
                id="tour-notifications"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative bg-[#ff0055] hover:bg-white text-white hover:text-[#ff0055] p-2.5 rounded-xl font-bold shadow-[0_0_15px_rgba(255,0,85,0.5)] transition-all active:scale-95 cursor-pointer border border-[#ff0055]"
              >
                <Bell className="w-5 h-5 fill-current" />
                {notifications.length > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black text-[#ff0055] border-2 border-[#ff0055] shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse">
                    {notifications.length}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <>
                  {/* Invisible backdrop to detect outside clicks */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsNotifOpen(false)}
                  ></div>
                  
                  <div className="absolute right-0 mt-3 w-80 bg-[#0a0a0a] border border-[#ff0055] rounded-xl shadow-[0_0_30px_rgba(255,0,85,0.4)] z-50 font-mono overflow-hidden flex flex-col">
                    <div className="p-3 border-b border-[#ff0055]/30 bg-[#ff0055]/10 flex justify-between items-center">
                      <span className="text-[#ff0055] font-black text-xs uppercase tracking-widest drop-shadow-[0_0_5px_currentColor]">System Alerts</span>
                      <button onClick={() => setNotifications([])} className="text-[10px] text-white hover:text-[#ff0055] transition-colors border border-transparent hover:border-[#ff0055]/50 px-2 rounded">CLEAR ALL</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto cyber-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: '#ff0055 transparent' }}>
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-zinc-600 text-xs tracking-widest flex flex-col items-center gap-2">
                          <Bell className="w-6 h-6 opacity-20" />
                          NO INCOMING ALERTS
                        </div>
                      ) : (
                        notifications.map((n, i) => (
                          <div key={i} className="p-4 border-b border-[#ff0055]/20 hover:bg-[#ff0055]/5 transition-colors group">
                            <p className="text-xs text-gray-300 mb-3 leading-relaxed">{n.message}</p>
                            {n.type === 'OFFLINE_CHALLENGE' && (
                              <button 
                                onClick={() => {
                                  setIsNotifOpen(false);
                                  window.location.href = `/battle?matchId=${n.matchId}&challengerId=${n.challengerId}&targetId=${empId}&async=true`;
                                }}
                                className="w-full py-2 bg-[#ff0055]/20 border border-[#ff0055] text-[#ff0055] group-hover:bg-[#ff0055] group-hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest rounded flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(255,0,85,0.2)]"
                              >
                                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                                ACCEPT ASYNC DUEL
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column */}
          <div className="lg:col-span-3 space-y-4">
            {(() => {
              const currentEmpId = typeof window !== 'undefined' ? empId : null;
              const me = leaderboard.find(p => p.empId === currentEmpId);
              return (
                <>
                  {/* Player Profile */}
                  <div id="tour-profile" className="bg-[#030303]/90 rounded-2xl p-6 border border-[#ff0055]/40 backdrop-blur-xl shadow-[0_0_20px_rgba(255,0,85,0.15)] flex flex-col space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded bg-gray-800 flex items-center justify-center border border-[#ff0055] overflow-hidden">
                        {me ? <MiniAvatar avatar={me.avatar as AvatarState} /> : <div className="text-xs text-gray-500">NO ID</div>}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">PLAYER</span>
                        <h2 className="text-xl font-extrabold text-white font-mono truncate">{me?.name || '—'}</h2>
                        <span className="text-xs text-[#ff0055] font-mono">@{me?.username || me?.name?.split(' ')[0].toLowerCase() || 'player'}</span>
                      </div>
                    </div>
                  </div>

                  {/* XP Dashboard and Coins (Horizontally aligned) */}
                  <div id="tour-stats" className="grid grid-cols-2 gap-4">
                    {/* MY XP */}
                    <div className="relative p-4 rounded-2xl bg-[#0a0a0a]/80 border border-[#ff0055]/30 backdrop-blur-md flex flex-col justify-between space-y-2">
                      <span className="text-[10px] font-mono text-[#ff0055] uppercase tracking-widest text-center">XP LEVEL</span>
                      <span className="text-xl font-extrabold text-white font-mono text-center">
                        {(me?.xp || 0).toLocaleString()}
                      </span>
                      <AnimatePresence>
                        {floatingStats.filter(s => s.empId === me?.empId && s.type === 'xp_up').map(s => (
                          <motion.div
                            key={s.id}
                            initial={{ y: 0, opacity: 1, scale: 1 }}
                            animate={{ y: -40, opacity: 0, scale: 1.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 2, ease: 'easeOut' }}
                            className="absolute right-4 top-2 text-[#ff0055] font-black font-mono text-lg drop-shadow-[0_0_10px_currentColor] z-50 pointer-events-none"
                          >
                            ↑ +{s.amount}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* MY COINS */}
                    <div className="relative p-4 rounded-2xl bg-[#0a0a0a]/80 border border-[#ff0055]/30 backdrop-blur-md flex flex-col justify-between space-y-2">
                      <span className="text-[10px] font-mono text-[#ff0055] uppercase tracking-widest text-center">COINS</span>
                      <span className="text-xl font-extrabold text-white font-mono tabular-nums text-center">
                        {(me?.coins || 0).toLocaleString()}
                      </span>
                      <AnimatePresence>
                        {floatingStats.filter(s => s.empId === me?.empId && s.type === 'coins_down').map(s => (
                          <motion.div
                            key={s.id}
                            initial={{ y: 0, opacity: 1, scale: 1 }}
                            animate={{ y: 40, opacity: 0, scale: 1.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 2, ease: 'easeOut' }}
                            className="absolute right-4 top-2 text-[#ff0055] font-black font-mono text-lg drop-shadow-[0_0_10px_currentColor] z-50 pointer-events-none"
                          >
                            ↓ -{s.amount}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </>
              );
            })()}

            {/* Recent Battles List Button */}
            <button 
              id="tour-battles" 
              onClick={() => setShowRecentBattlesModal(true)}
              className="bg-[#030303]/90 rounded-2xl p-4 border border-[#ff0055]/40 backdrop-blur-xl shadow-[0_0_20px_rgba(255,0,85,0.15)] flex justify-between items-center group transition-all hover:bg-[#ff0055]/10 w-full"
            >
              <h3 className="text-xs font-mono font-bold uppercase text-[#ff0055] tracking-widest">
                RECENT BATTLES
              </h3>
              <span className="text-[#ff0055] text-xs font-mono group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          {/* Center Column: Simulation Hub */}
          <div className="lg:col-span-6 flex flex-col h-full min-h-[500px]">
            <div className="bg-[#030303]/90 rounded-3xl p-8 sm:p-12 border border-[#ff0055]/50 backdrop-blur-xl shadow-[0_0_50px_rgba(255,0,85,0.2)] flex flex-col items-center justify-center flex-1 space-y-12 relative overflow-hidden">
              {/* Squid Game BG shapes aesthetic */}
              <div className="absolute inset-0 flex justify-center items-center opacity-10 pointer-events-none">
                <Circle className="w-64 h-64 text-[#ff0055] absolute -mt-32 -ml-32" strokeWidth={1} />
                <Triangle className="w-64 h-64 text-[#ff0055] absolute mt-32 ml-32" strokeWidth={1} />
                <Square className="w-64 h-64 text-[#ff0055] absolute -mr-64" strokeWidth={1} />
              </div>

              <div className="text-center z-10">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-mono tracking-[0.2em] text-white mb-3 drop-shadow-[0_0_15px_rgba(255,0,85,0.5)]">
                  SIMULATION HUB
                </h1>
              </div>

              <div className="flex flex-col items-center gap-10 w-full max-w-md z-10 pb-8">
                <div id="tour-pool-selector" className="flex bg-black border border-[#ff0055] rounded-xl overflow-hidden shadow-[0_0_15px_rgba(255,0,85,0.3)]">
                  <button
                    onClick={() => setSelectedPool('Technical')}
                    className={`px-6 py-3 font-mono font-bold tracking-widest text-sm uppercase transition-all ${
                      selectedPool === 'Technical'
                        ? 'bg-[#ff0055] text-white'
                        : 'text-[#ff0055] hover:bg-[#ff0055]/20'
                    }`}
                  >
                    Technical
                  </button>
                  <button
                    onClick={() => setSelectedPool('Non-Technical')}
                    className={`px-6 py-3 font-mono font-bold tracking-widest text-sm uppercase transition-all ${
                      selectedPool === 'Non-Technical'
                        ? 'bg-[#ff0055] text-white'
                        : 'text-[#ff0055] hover:bg-[#ff0055]/20'
                    }`}
                  >
                    Non-Technical
                  </button>
                </div>

                <div className="flex flex-col items-center text-center group">
                  <button 
                    id="tour-matrix"
                    disabled={!selectedPool}
                    onClick={() => {
                      if (selectedPool) {
                        localStorage.setItem('selectedPool', selectedPool);
                        window.location.href = '/simulation-matrix';
                      }
                    }}
                    className={`w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all relative z-10 mb-6 ${
                      selectedPool 
                        ? 'bg-[#ff0055] hover:bg-white text-white hover:text-[#ff0055] shadow-[0_0_50px_rgba(255,0,85,0.6)] hover:shadow-[0_0_80px_rgba(255,255,255,0.8)] active:scale-95 cursor-pointer' 
                        : 'bg-gray-800 text-gray-500 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <Play className="w-12 h-12 ml-2 fill-current" />
                  </button>
                  <h2 className="text-[#ff0055] font-black font-mono text-xl tracking-[0.2em] uppercase drop-shadow-[0_0_10px_rgba(255,0,85,0.5)]">
                    ENTER SIMULATION MATRIX
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  <button 
                    id="tour-online"
                    disabled={!selectedPool}
                    onClick={() => {
                      if (selectedPool) {
                        localStorage.setItem('selectedPool', selectedPool);
                        setShowOnline1v1(true);
                      }
                    }}
                    className={`py-4 rounded-xl border font-mono font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center ${selectedPool ? 'bg-black border-[#ff0055]/50 hover:border-[#ff0055] text-gray-300 hover:text-white hover:bg-[#ff0055]/10 shadow-[0_0_15px_rgba(255,0,85,0.1)] active:scale-95 cursor-pointer' : 'bg-gray-800 border-gray-600 text-gray-500 opacity-50 cursor-not-allowed'}`}
                  >
                    <span className="text-[#ff0055] mr-2">●</span>
                    ONLINE DUEL
                  </button>
                  <button 
                    id="tour-offline"
                    disabled={!selectedPool}
                    onClick={() => {
                      if (selectedPool) {
                        localStorage.setItem('selectedPool', selectedPool);
                        setShowOffline1v1(true);
                      }
                    }}
                    className={`py-4 rounded-xl border font-mono font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center ${selectedPool ? 'bg-black border-[#ff0055]/50 hover:border-[#ff0055] text-gray-300 hover:text-white hover:bg-[#ff0055]/10 shadow-[0_0_15px_rgba(255,0,85,0.1)] active:scale-95 cursor-pointer' : 'bg-gray-800 border-gray-600 text-gray-500 opacity-50 cursor-not-allowed'}`}
                  >
                    <span className="text-gray-500 mr-2">●</span>
                    OFFLINE DUEL
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Leaderboard */}
          <div id="tour-leaderboard" className="lg:col-span-3 bg-[#030303]/90 rounded-3xl p-6 border border-[#ff0055]/40 backdrop-blur-xl shadow-[0_0_35px_rgba(255,0,85,0.25)] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#ff0055]/30">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#ff0055]" />
                <h3 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                  LIVE LEADERBOARD
                </h3>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#ff0055]/20 text-[#ff0055] animate-pulse">
                REAL-TIME
              </span>
            </div>

            <div className="space-y-2 relative min-h-[280px] max-h-[350px] overflow-y-auto pr-2 cyber-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: '#ff0055 transparent' }}>
              {leaderboard.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[280px] text-zinc-600 font-mono text-xs text-center gap-2">
                  <Trophy className="w-8 h-8 opacity-30" />
                  <p>No players yet. Sign up to claim the #1 spot!</p>
                </div>
              ) : (
                leaderboard.map((player) => (
                  <LeaderboardItem
                    key={player.empId}
                    player={player}
                    floatingEmojis={floatingEmojis}
                    selectedTarget={selectedTarget}
                    setSelectedTarget={setSelectedTarget}
                  />
                ))
              )}
            </div>

            <button
              id="tour-full-leaderboard"
              onClick={() => setIsFullLeaderboardOpen(true)}
              className="w-full mt-4 py-3 rounded-xl bg-[#0a0a0a] border border-[#ff0055]/50 hover:border-[#ff0055] hover:bg-[#ff0055]/10 transition-all text-xs font-bold font-mono tracking-widest text-zinc-300 hover:text-white flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <List className="w-4 h-4 text-[#ff0055]" />
              FULL PLAYER LEADERBOARD
            </button>

            <div id="tour-target-panel" className="mt-6 border-t border-[#ff0055]/30 pt-6">
              <h4 className="text-xs text-[#ff0055] font-mono mb-4 uppercase tracking-[0.2em] text-center">
                {selectedTarget ? `TARGET LOCKED: ${selectedTarget.name}` : 'SELECT A TARGET TO ENGAGE'}
              </h4>
              
              {/* Reactions */}
              <div className="flex justify-between gap-2 mb-6">
                {['🔥', '⚡', '💀', '👑', '🎯'].map(emoji => (
                   <button 
                     key={emoji}
                     disabled={!selectedTarget}
                     onClick={() => selectedTarget && handleEmitEmoji(selectedTarget.empId, emoji)}
                     className="flex-1 bg-black py-3 rounded border border-[#ff0055]/30 hover:border-[#ff0055] hover:bg-[#ff0055]/20 disabled:opacity-20 transition-all text-xl cursor-pointer"
                   >
                     {emoji}
                   </button>
                ))}
              </div>

              {/* Coin-Based XP Boosts */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { xp: 50, cost: 10 }, 
                  { xp: 100, cost: 25 }, 
                  { xp: 250, cost: 50 }, 
                  { xp: 500, cost: 100 }
                ].map(tier => (
                  <button 
                     key={tier.xp}
                     disabled={!selectedTarget}
                     onClick={() => selectedTarget && handleScoreBoost(selectedTarget.empId, tier.xp, tier.cost)}
                     className="bg-black group flex justify-between items-center p-3 font-mono border border-[#ff0055]/30 hover:bg-[#ff0055]/20 hover:border-[#ff0055] disabled:opacity-20 rounded transition-all cursor-pointer"
                  >
                     <span className="text-[#ff0055] text-sm font-bold group-hover:text-white">+{tier.xp} XP</span>
                     <span className="text-zinc-500 group-hover:text-zinc-300 text-xs tracking-widest">{tier.cost} 🪙</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <FullLeaderboardModal
        isOpen={isFullLeaderboardOpen}
        onClose={() => setIsFullLeaderboardOpen(false)}
        leaderboard={leaderboard}
        floatingEmojis={floatingEmojis}
        floatingStats={floatingStats}
        selectedTarget={selectedTarget}
        setSelectedTarget={setSelectedTarget}
      />

      {isShopOpen && <ItemShopModal onClose={() => setIsShopOpen(false)} players={leaderboard} socket={socket} />}
      {isQuestOpen && <PasswordQuest onClose={() => setIsQuestOpen(false)} onClaimed={() => socket?.emit('trigger_refresh')} />}
        {isInventoryOpen && <InventoryModal onClose={() => setIsInventoryOpen(false)} />}
      
      {showRecentBattlesModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowRecentBattlesModal(false)}>
          <div className="bg-[#0a0a0a] border border-[#ff0055]/30 p-8 rounded-xl w-[600px] max-w-[90vw] shadow-[0_0_50px_rgba(255,0,85,0.15)] flex flex-col max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 border-b border-[#ff0055]/30 pb-4">
              <h3 className="text-[#ff0055] font-black tracking-widest text-xl flex items-center gap-2 uppercase">
                Recent Battles
              </h3>
              <button onClick={() => setShowRecentBattlesModal(false)} className="text-[#ff0055]/50 hover:text-[#ff0055] transition-colors"><X className="w-8 h-8" strokeWidth={2.5} /></button>
            </div>
            
            <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
              {recentBattles.length === 0 ? (
                <div className="text-center text-sm text-zinc-600 font-mono py-8">No recent battles recorded.</div>
              ) : (
                recentBattles.map((match, idx) => {
                  const isWin = match.result.includes('WIN');
                  const color = isWin ? 'text-green-500' : (match.result === 'DRAW' ? 'text-yellow-500' : 'text-red-500');
                  const isExpanded = expandedBattle === match.id + idx;
                  
                  return (
                    <div key={match.id + idx} className="flex flex-col bg-[#111] rounded-lg border border-white/5 overflow-hidden transition-all group">
                      <div 
                        onClick={() => setExpandedBattle(isExpanded ? null : match.id + idx)}
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5"
                      >
                        <div className="flex flex-col">
                          <span className="text-white text-sm font-bold font-mono">VS {match.opponent}</span>
                          <span className="text-gray-500 text-[10px] font-mono tracking-widest mt-1">{match.type}</span>
                        </div>
                        <span className={`${color} font-black font-mono text-sm uppercase tracking-wider flex items-center gap-3`}>
                          {match.result}
                          <span className="text-[10px] text-zinc-600 group-hover:text-white transition-colors">{isExpanded ? '▲' : '▼'}</span>
                        </span>
                      </div>
                      {isExpanded && (
                        <div className="p-4 bg-black border-t border-white/5 text-xs font-mono text-gray-400 space-y-2">
                          <p><strong className="text-zinc-500">TIME:</strong> {new Date(match.timestamp).toLocaleString()}</p>
                          <p><strong className="text-zinc-500">XP CHANGE:</strong> <span className={isWin ? 'text-green-400' : 'text-red-400'}>{match.xpChange || 'N/A'}</span></p>
                          <p><strong className="text-zinc-500">COINS:</strong> <span className={isWin ? 'text-yellow-400' : 'text-zinc-500'}>{match.coinsChange || 'N/A'}</span></p>
                          <p><strong className="text-zinc-500">MATCH ID:</strong> <span className="text-zinc-600">{match.id}</span></p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {showOnline1v1 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowOnline1v1(false)}>
          <div className="bg-[#0a0a0a] border border-emerald-500/30 p-8 rounded-xl w-[600px] max-w-[90vw] shadow-[0_0_50px_rgba(16,185,129,0.15)] flex flex-col max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
              <h3 className="text-emerald-400 font-black tracking-widest text-xl flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                1v1 ONLINE
              </h3>
              <button onClick={() => setShowOnline1v1(false)} className="text-emerald-500/50 hover:text-emerald-400 transition-colors"><X className="w-8 h-8" strokeWidth={2.5} /></button>
            </div>
            <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {leaderboard.filter(p => p.empId !== empId && onlineUsers.includes(p.empId)).map((player, idx) => (
                <div key={player.empId} className="flex items-center gap-4 bg-[#111] p-4 rounded-lg border border-white/5 hover:border-emerald-500/30 transition-colors">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500/50 flex-shrink-0 bg-[#050505]">
                    <MiniAvatar avatar={player.avatar as AvatarState} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-200 text-base font-bold">{player.name || `Operant-${idx}`}</span>
                    <span className="text-xs uppercase tracking-wider flex items-center gap-1 text-emerald-500 mt-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ONLINE</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      sendDuelChallenge(player.empId, player.name || player.username || `Operant-${idx}`);
                    }}
                    className="ml-auto bg-red-950/40 hover:bg-red-900 border border-red-700/50 text-red-500 hover:text-white px-4 py-2 rounded text-xs font-black tracking-widest transition-all shadow-[0_0_15px_rgba(255,0,0,0.2)]"
                  >
                    ⚔️ CHALLENGE
                  </button>
                </div>
              ))}
              {leaderboard.filter(p => p.empId !== empId && onlineUsers.includes(p.empId)).length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <WifiOff className="w-16 h-16 text-emerald-900/40" strokeWidth={1.5} />
                  <p className="text-emerald-500/70 font-black font-mono text-xl tracking-[0.2em] uppercase drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                    No Targets Online
                  </p>
                  <p className="text-zinc-500 font-mono text-sm max-w-sm tracking-wide">
                    The simulation grid is currently empty. Engage in offline asynchronous duels while waiting for connections.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showOffline1v1 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowOffline1v1(false)}>
          <div className="bg-[#0a0a0a] border border-purple-500/30 p-8 rounded-xl w-[600px] max-w-[90vw] shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
              <h3 className="text-purple-400 font-black tracking-widest text-xl flex items-center gap-2">
                1v1 OFFLINE
              </h3>
              <button onClick={() => setShowOffline1v1(false)} className="text-purple-500/50 hover:text-purple-400 transition-colors"><X className="w-8 h-8" strokeWidth={2.5} /></button>
            </div>
            
            <input 
              type="text"
              placeholder="SEARCH OPERANT ID / NAME..."
              value={offlineSearchQuery}
              onChange={e => setOfflineSearchQuery(e.target.value)}
              className="w-full bg-black border border-purple-500/30 text-white font-mono text-sm p-4 rounded-lg mb-4 focus:outline-none focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all"
            />

            <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {leaderboard.filter(p => p.empId !== empId && (p.name?.toLowerCase().includes(offlineSearchQuery.toLowerCase()) || p.empId.toLowerCase().includes(offlineSearchQuery.toLowerCase()))).map((player, idx) => (
                <div key={player.empId} className="flex items-center gap-4 bg-[#111] p-4 rounded-lg border border-white/5 hover:border-purple-500/30 transition-colors">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500/50 flex-shrink-0 bg-[#050505] grayscale">
                    <MiniAvatar avatar={player.avatar as AvatarState} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-200 text-base font-bold">{player.name || `Operant-${idx}`}</span>
                    <span className="text-xs uppercase tracking-wider text-gray-500 mt-1 flex items-center gap-1">
                      <WifiOff className="w-3 h-3" /> OFFLINE ASYNC
                    </span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/battle?matchId=offline_${empId}_${player.empId}_${Date.now()}&challengerId=${empId}&targetId=${player.empId}&async=true`;
                    }}
                    className="ml-auto bg-purple-950/40 hover:bg-purple-900 border border-purple-700/50 text-purple-400 hover:text-white px-4 py-2 rounded text-xs font-black tracking-widest transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                  >
                    ⚡ ENGAGE
                  </button>
                </div>
              ))}
              {leaderboard.filter(p => p.empId !== empId && !onlineUsers.includes(p.empId) && (p.name?.toLowerCase().includes(offlineSearchQuery.toLowerCase()) || p.username?.toLowerCase().includes(offlineSearchQuery.toLowerCase()))).length === 0 && (
                <div className="text-gray-600 text-center py-6 font-mono text-sm">NO OFFLINE OPERANTS FOUND</div>
              )}
            </div>
          </div>
        </div>
      )}

      {incomingChallenge && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md pointer-events-auto">
          <div className="bg-red-950/20 border-2 border-red-600 p-8 rounded-lg shadow-[0_0_80px_rgba(220,38,38,0.4)] text-center animate-pulse max-w-md w-full mx-4">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/></svg>
            </div>
            <h2 className="text-3xl font-black text-white tracking-widest mb-2 uppercase">1v1 DUEL INCOMING</h2>
            <p className="text-red-400 font-mono mb-8">
              <span className="text-white font-bold">{incomingChallenge.challengerName}</span> has challenged you to a rapid-fire matrix duel.
              <br />
              <span className="text-sm mt-2 block">Expires in: {challengeTimer}s</span>
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => {
                  socket?.emit('accept_1v1_challenge', { challengerId: incomingChallenge.challengerId });
                  triggerDuelCountdown({ challengerId: incomingChallenge.challengerId, targetId: empId || '' });
                  setIncomingChallenge(null);
                }}
                className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded font-black tracking-widest w-1/2 transition-colors"
              >
                ACCEPT
              </button>
              <button 
                onClick={() => {
                  socket?.emit('deny_1v1_challenge', { challengerId: incomingChallenge.challengerId, reason: 'Declined by player' });
                  setIncomingChallenge(null);
                }}
                className="bg-transparent border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 px-6 py-3 rounded font-black tracking-widest w-1/2 transition-colors"
              >
                DECLINE
              </button>
            </div>
          </div>
        </div>
      )}

      {duelCountdown !== null && (
        <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-black/95 backdrop-blur-lg pointer-events-auto">
          <div className="text-red-600 font-mono text-[15rem] font-black leading-none animate-ping">
            {duelCountdown}
          </div>
          <div className="text-red-500 font-black tracking-[1em] mt-8 animate-pulse text-2xl uppercase">
            PREPARE TO ENGAGE
          </div>
        </div>
      )}
    </div>
  );
}



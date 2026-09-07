const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Map of empId -> socket.id
const userSockets = new Map();

// === SHARED BATTLE STATE (module-level so all sockets share it) ===
const battleRooms = new Map(); // matchId -> { p1Hp, p2Hp, answersThisRound, p1Answer, p2Answer, round, isAsync }
const offlineNotifications = new Map(); // empId -> Array of notifications

// Healthcheck Endpoint
app.get('/', (req, res) => {
  res.json({ status: 'active', service: 'Cyber Simulator Realtime Socket Server', port: 3001 });
});

io.on('connection', (socket) => {
  console.log(`[SOCKET_SERVER] Client connected: ${socket.id}`);
  let currentEmpId = null;

  // Register user
  socket.on('register', (empId) => {
    currentEmpId = empId;
    userSockets.set(empId, socket.id);
    console.log(`[SOCKET_SERVER] User registered: ${empId} with socket ${socket.id}`);
    
    // Broadcast updated online users list
    io.emit('online_users', Array.from(userSockets.keys()));

    // Send pending offline notifications
    if (offlineNotifications.has(empId)) {
      const pending = offlineNotifications.get(empId);
      if (pending && pending.length > 0) {
        socket.emit('pending_notifications', pending);
        offlineNotifications.delete(empId);
      }
    }
  });

  // Event listener for sending real-time emoji reactions
  socket.on('player_ddos', (data) => {
    const targetSocketId = userSockets.get(data.targetId);
    if (targetSocketId) io.to(targetSocketId).emit('ddos_received', { attackerName: socket.empId || 'Anonymous' });
  });

  socket.on('player_screen_freeze', (data) => {
    const targetSocketId = userSockets.get(data.targetId);
    if (targetSocketId) {
      io.to(targetSocketId).emit('screen_freeze_received', { attackerName: socket.empId || 'Anonymous' });
    }
  });

  socket.on('player_sabotage', (data) => {
    // Forward sabotage to target player
    const targetSocketId = userSockets.get(data.targetId);
    if (targetSocketId) {
      io.to(targetSocketId).emit('sabotage_received', { attackerName: socket.empId || 'Anonymous', penaltyXp: data.penaltyXp || 150 });
    }
  });

  socket.on('send_emoji', (data) => {
    console.log(`[SOCKET_SERVER] Broadcast send_emoji:`, data);
    io.emit('send_emoji', data);
  });

  // Event listener for stat animations (XP boosts)
  socket.on('send_stat_animation', (data) => {
    console.log(`[SOCKET_SERVER] Broadcast send_stat_animation:`, data);
    io.emit('send_stat_animation', data);
  });

  // Event listener to trigger full leaderboard refresh
  socket.on('trigger_refresh', () => {
    console.log(`[SOCKET_SERVER] Broadcast refresh_leaderboard`);
    io.emit('refresh_leaderboard');
  });

  // Event listener for live score updates
  socket.on('update_score', async (data) => {
    console.log(`[SOCKET_SERVER] Broadcast update_score:`, data);
    io.emit('update_score', data);
    try {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      await fetch(`${frontendUrl}/api/users`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empId: data.empId,
          updates: { coins: data.newScore }
        })
      });
    } catch (err) {
      console.error(`[SOCKET_SERVER] Failed to persist score:`, err.message);
    }
  });

  // 1v1 Challenge
  socket.on('initiate_1v1_challenge', ({ targetId, challengerName, matchId }) => {
    const targetSocketId = userSockets.get(targetId);
    if (targetSocketId) {
      console.log(`[SOCKET_SERVER] Sending challenge from ${currentEmpId} to ${targetId}`);
      io.to(targetSocketId).emit('receive_1v1_challenge', {
        challengerId: currentEmpId,
        challengerName: challengerName || 'A Player'
      });
    } else {
      console.log(`[SOCKET_SERVER] Target ${targetId} not online. Saving offline challenge.`);
      const mId = matchId || `battle_${currentEmpId}_${targetId}_${Date.now()}`;
      if (!offlineNotifications.has(targetId)) offlineNotifications.set(targetId, []);
      offlineNotifications.get(targetId).push({
        type: 'OFFLINE_CHALLENGE',
        challengerId: currentEmpId,
        challengerName: challengerName || 'A Player',
        matchId: mId,
        timestamp: Date.now(),
        message: `Offline challenge arrived from ${challengerName || currentEmpId}`
      });
      // Tell challenger they can play async
      socket.emit('1v1_challenge_offline_accepted', { targetId, matchId: mId });
    }
  });

  socket.on('accept_1v1_challenge', ({ challengerId }) => {
    const challengerSocketId = userSockets.get(challengerId);
    if (challengerSocketId) {
      console.log(`[SOCKET_SERVER] ${currentEmpId} accepted challenge from ${challengerId}`);
      io.to(challengerSocketId).emit('1v1_challenge_accepted', { challengerId, targetId: currentEmpId });
      socket.emit('1v1_challenge_accepted', { challengerId, targetId: currentEmpId });
    }
  });

  socket.on('deny_1v1_challenge', ({ challengerId, reason }) => {
    const challengerSocketId = userSockets.get(challengerId);
    if (challengerSocketId) {
      console.log(`[SOCKET_SERVER] ${currentEmpId} denied challenge from ${challengerId}`);
      io.to(challengerSocketId).emit('1v1_challenge_denied', { reason: reason || 'Challenge was denied or timed out' });
    }
  });

  // === 1V1 BATTLE LOGIC ===
  socket.on('join_battle', ({ matchId, empId, isAsync }) => {
    socket.join(matchId);
    console.log(`[SOCKET_SERVER] ${empId} joined battle room ${matchId} (async: ${isAsync})`);
    
    if (isAsync) {
      if (!asyncBattleStats.has(matchId)) asyncBattleStats.set(matchId, {});
      const stats = asyncBattleStats.get(matchId);
      if (!stats.challengerId) stats.challengerId = empId;
      else stats.targetId = empId;
    }

    if (!battleRooms.has(matchId)) {
      battleRooms.set(matchId, { p1Hp: 100, p2Hp: 100, p1Correct: 0, p2Correct: 0, p1EmpId: isAsync ? empId : empId, answersThisRound: 0, p1Answer: null, p2Answer: null, round: 0, isAsync: isAsync || false });
      console.log(`[SOCKET_SERVER] Created new battle room: ${matchId}`);
      
      if (isAsync && asyncBattleStats.has(matchId) && asyncBattleStats.get(matchId).questions) {
        const savedQuestions = asyncBattleStats.get(matchId).questions;
        battleRooms.get(matchId).questions = savedQuestions;
        setTimeout(() => {
          socket.emit('battle_data_sync', { questions: savedQuestions });
        }, 500);
      }
    } else if (isAsync) {
      // Target is joining an EXISTING async room (challenger already played).
      // Reset HP + round state so the target starts fresh.
      const room = battleRooms.get(matchId);
      room.isAsync = true;
      room.p1Hp = 100;
      room.p2Hp = 100;
      room.round = 0;
      room.answersThisRound = 0;
      room.p1Answer = null;
      room.p2Answer = null;
      console.log(`[SOCKET_SERVER] Target joined async room ${matchId}. Room reset for target session.`);

      // Send the saved questions to this target player
      if (asyncBattleStats.has(matchId) && asyncBattleStats.get(matchId).questions) {
        const savedQuestions = asyncBattleStats.get(matchId).questions;
        room.questions = savedQuestions;
        setTimeout(() => {
          socket.emit('battle_data_sync', { questions: savedQuestions });
          console.log(`[SOCKET_SERVER] Sent ${savedQuestions.length} questions to async target.`);
        }, 500);
      } else {
        console.log(`[SOCKET_SERVER] WARNING: No saved questions found for async match ${matchId}`);
      }
    }
  });

  socket.on('init_battle_data', ({ matchId, questions }) => {
    const battle = battleRooms.get(matchId);
    if (battle) {
      battle.questions = questions;
      io.to(matchId).emit('battle_data_sync', { questions });
      
      if (battle.isAsync) {
        if (!asyncBattleStats.has(matchId)) asyncBattleStats.set(matchId, {});
        asyncBattleStats.get(matchId).questions = questions;
      }
    }
  });

  socket.on('submit_battle_answer', ({ matchId, empId, isCorrect, damage, isChallenger }) => {
    const battle = battleRooms.get(matchId);
    if (!battle) {
      console.log(`[SOCKET_SERVER] WARNING: No battle room found for ${matchId}. Current rooms: ${[...battleRooms.keys()].join(', ')}`);
      return;
    }

    console.log(`[SOCKET_SERVER] Answer from ${empId} (isChallenger=${isChallenger}): correct=${isCorrect}, damage=${damage}. AnswersThisRound BEFORE: ${battle.answersThisRound}`);

    if (isChallenger) {
      battle.p1Answer = { isCorrect, damage };
      if (isCorrect) battle.p1Correct = (battle.p1Correct || 0) + 1;
    } else {
      battle.p2Answer = { isCorrect, damage };
      if (isCorrect) battle.p2Correct = (battle.p2Correct || 0) + 1;
    }

    if (battle.isAsync) {
      // Process round for single player without ghost
      processRound(battle, matchId, io, isChallenger);
      return;
    }

    battle.answersThisRound++;
    console.log(`[SOCKET_SERVER] AnswersThisRound AFTER: ${battle.answersThisRound}`);

    if (battle.answersThisRound === 1) {
      // Start fallback timer
      battle.fallbackTimeout = setTimeout(() => {
        if (battleRooms.has(matchId)) {
          const b = battleRooms.get(matchId);
          if (b.answersThisRound === 1 && b.round === battle.round) {
            console.log(`[SOCKET_SERVER] Fallback timeout triggered for ${matchId} round ${b.round}`);
            const missingIsChallenger = !isChallenger;
            if (missingIsChallenger) b.p1Answer = { isCorrect: false, damage: 15 };
            else b.p2Answer = { isCorrect: false, damage: 15 };
            b.answersThisRound = 2;
            processRound(b, matchId, io);
          }
        }
      }, 15000); // 15s grace period
    }

    // When both players have answered
    if (battle.answersThisRound === 2) {
      if (battle.fallbackTimeout) clearTimeout(battle.fallbackTimeout);
      processRound(battle, matchId, io);
    }
  });

  socket.on('player_forfeit', ({ matchId, empId, isChallenger }) => {
    console.log(`[SOCKET_SERVER] ${empId} forfeited match ${matchId}`);
    const winner = isChallenger ? 'target' : 'challenger';
    io.to(matchId).emit('battle_over', { winner, reason: 'forfeit', forfeitedBy: empId });
    battleRooms.delete(matchId);
  });

  
  socket.on('disconnect', () => {
    console.log('[SOCKET_SERVER] Client disconnected:', socket.id);
    
    // Check if player was in any battle
    for (const [matchId, battle] of battleRooms.entries()) {
      if (battle.p1EmpId === currentEmpId || battle.p2EmpId === currentEmpId) {
        console.log(`[SOCKET_SERVER] Player ${currentEmpId} disconnected during battle ${matchId}. Forfeiting...`);
        const winner = battle.p1EmpId === currentEmpId ? 'target' : 'challenger';
        io.to(matchId).emit('battle_over', { winner, reason: 'forfeit', forfeitedBy: currentEmpId });
        battleRooms.delete(matchId);
      }
    }

    if (currentEmpId) {
      if (userSockets.get(currentEmpId) === socket.id) { userSockets.delete(currentEmpId); }
      // Broadcast updated online users list
      io.emit('online_users', Array.from(userSockets.keys()));
    }
  });
});


const asyncBattleStats = new Map(); // matchId -> { challengerFinalHp, targetFinalHp }

  const processRound = (battle, matchId, io, isChallengerAsync = null) => {
    console.log(`[SOCKET_SERVER] Processing round ${battle.round}... async: ${battle.isAsync}`);

    if (battle.isAsync) {
      // Async (Offline) Match processing
      let activeHp, activeAnswer;
      if (isChallengerAsync) {
        activeHp = battle.p1Hp;
        activeAnswer = battle.p1Answer;
        if (!activeAnswer.isCorrect) battle.p1Hp -= activeAnswer.damage;
      } else {
        activeHp = battle.p2Hp;
        activeAnswer = battle.p2Answer;
        if (!activeAnswer.isCorrect) battle.p2Hp -= activeAnswer.damage;
      }

      // Prevent negative HP
      battle.p1Hp = Math.max(0, battle.p1Hp);
      battle.p2Hp = Math.max(0, battle.p2Hp);

      const activeDead = isChallengerAsync ? battle.p1Hp <= 0 : battle.p2Hp <= 0;
      const outOfQuestions = battle.questions && battle.round >= battle.questions.length - 1;

      // Ensure we always provide both answers to the frontend to avoid null errors, even if one is dummy
      const dummyAnswer = { isCorrect: false, damage: 0, isDummy: true };

      io.to(matchId).emit('battle_update', {
        p1Hp: battle.p1Hp,
        p2Hp: battle.p2Hp,
        nextRound: !(activeDead || outOfQuestions),
        p1Answer: isChallengerAsync ? battle.p1Answer : dummyAnswer,
        p2Answer: !isChallengerAsync ? battle.p2Answer : dummyAnswer,
        gameOver: activeDead || outOfQuestions
      });

      if (activeDead || outOfQuestions) {
        if (!asyncBattleStats.has(matchId)) asyncBattleStats.set(matchId, {});
        const stats = asyncBattleStats.get(matchId);
        
        if (isChallengerAsync) {
          stats.challengerFinalHp = battle.p1Hp;
          stats.challengerCorrect = battle.p1Correct || 0;
          stats.challengerId = stats.challengerId || battle.p1EmpId;
          console.log(`[SOCKET_SERVER] Async Challenger finished with HP ${battle.p1Hp}, Correct: ${stats.challengerCorrect}`);
        } else {
          stats.targetFinalHp = battle.p2Hp;
          stats.targetCorrect = battle.p2Correct || 0;
          stats.targetId = stats.targetId || battle.p2EmpId;
          console.log(`[SOCKET_SERVER] Async Target finished with HP ${battle.p2Hp}, Correct: ${stats.targetCorrect}`);
        }

        if (stats.challengerFinalHp !== undefined && stats.targetFinalHp !== undefined) {
          let winner = 'draw';
          // Change 4: Win condition is based on correct answers recorded
          if (stats.challengerCorrect > stats.targetCorrect) winner = 'challenger';
          else if (stats.targetCorrect > stats.challengerCorrect) winner = 'target';
          else {
            // Tie breaker on HP
            if (stats.challengerFinalHp > stats.targetFinalHp) winner = 'challenger';
            else if (stats.targetFinalHp > stats.challengerFinalHp) winner = 'target';
          }
          
          console.log(`[SOCKET_SERVER] Async battle final result: ${winner} wins (challengerCorrect=${stats.challengerCorrect}, targetCorrect=${stats.targetCorrect})`);

          const challengerSocket = userSockets.get(stats.challengerId);
          const targetSocket = userSockets.get(stats.targetId);
          
          const challengerWon = winner === 'challenger';
          const targetWon = winner === 'target';

          if (challengerSocket) {
            io.to(challengerSocket).emit('new_notification', {
              type: 'ASYNC_RESULT',
              matchId,
              message: challengerWon ? 'ASYNC BATTLE RESULT: You WON! 🏆' : (winner === 'draw' ? 'ASYNC BATTLE RESULT: It was a DRAW!' : 'ASYNC BATTLE RESULT: You LOST the offline battle.'),
              timestamp: Date.now()
            });
          }
          if (targetSocket) {
            io.to(targetSocket).emit('new_notification', {
              type: 'ASYNC_RESULT',
              matchId,
              message: targetWon ? 'ASYNC BATTLE RESULT: You WON! 🏆' : (winner === 'draw' ? 'ASYNC BATTLE RESULT: It was a DRAW!' : 'ASYNC BATTLE RESULT: You LOST the offline battle.'),
              timestamp: Date.now()
            });
          }
          asyncBattleStats.delete(matchId);
        }
      } else {
        battle.round++;
      }
      return;
    }

    // Synchronous (Online) Match processing
    if (battle.p1Answer && battle.p2Answer) {
      if (battle.p1Answer.isCorrect && battle.p2Answer.isCorrect) {
        battle.p1Answer.damage = 0;
        battle.p2Answer.damage = 0;
      }
      battle.p1Hp -= battle.p1Answer.damage;
      battle.p2Hp -= battle.p2Answer.damage;
    }

    battle.p1Hp = Math.max(0, battle.p1Hp);
    battle.p2Hp = Math.max(0, battle.p2Hp);

    const p1Dead = battle.p1Hp <= 0;
    const p2Dead = battle.p2Hp <= 0;
    const outOfQuestions = battle.questions && battle.round >= battle.questions.length - 1;

    io.to(matchId).emit('battle_update', {
      p1Hp: battle.p1Hp,
      p2Hp: battle.p2Hp,
      nextRound: !(p1Dead || p2Dead || outOfQuestions),
      p1Answer: battle.p1Answer,
      p2Answer: battle.p2Answer,
      gameOver: p1Dead || p2Dead || outOfQuestions
    });

    if (p1Dead || p2Dead || outOfQuestions) {
      let winner = 'draw';
      if (battle.p1Hp > battle.p2Hp) winner = 'challenger';
      else if (battle.p2Hp > battle.p1Hp) winner = 'target';
      console.log(`[SOCKET_SERVER] Battle over! Winner: ${winner}`);
      setTimeout(() => {
        io.to(matchId).emit('battle_over', { winner });
        battleRooms.delete(matchId);
      }, 3000);
    } else {
      battle.answersThisRound = 0;
      battle.p1Answer = null;
      battle.p2Answer = null;
      battle.round++;
    }
  };

  const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Cyber Simulator Real-Time Socket Server active`);
  console.log(`📡 Listening on http://localhost:${PORT}`);
  console.log(`====================================================`);
});



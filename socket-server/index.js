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
  });

  // Event listener for sending real-time emoji reactions
  socket.on('send_emoji', (data) => {
    console.log(`[SOCKET_SERVER] Broadcast send_emoji:`, data);
    io.emit('send_emoji', data);
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
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3002';
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
  socket.on('initiate_1v1_challenge', ({ targetId, challengerName }) => {
    const targetSocketId = userSockets.get(targetId);
    if (targetSocketId) {
      console.log(`[SOCKET_SERVER] Sending challenge from ${currentEmpId} to ${targetId}`);
      io.to(targetSocketId).emit('receive_1v1_challenge', {
        challengerId: currentEmpId,
        challengerName: challengerName || 'A Player'
      });
    } else {
      console.log(`[SOCKET_SERVER] Challenge failed: target ${targetId} not online.`);
      socket.emit('1v1_challenge_denied', { reason: 'Player is not currently online' });
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
  const battleRooms = new Map(); // matchId -> { p1Hp: 100, p2Hp: 100, answersThisRound: 0, questions: [], round: 0 }

  socket.on('join_battle', ({ matchId, empId }) => {
    socket.join(matchId);
    console.log(`[SOCKET_SERVER] ${empId} joined battle room ${matchId}`);
    if (!battleRooms.has(matchId)) {
      battleRooms.set(matchId, { p1Hp: 100, p2Hp: 100, answersThisRound: 0, p1Answer: null, p2Answer: null });
    }
  });

  socket.on('init_battle_data', ({ matchId, questions }) => {
    const battle = battleRooms.get(matchId);
    if (battle) {
      battle.questions = questions;
      io.to(matchId).emit('battle_data_sync', { questions });
    }
  });

  socket.on('submit_battle_answer', ({ matchId, empId, isCorrect, damage, isChallenger }) => {
    const battle = battleRooms.get(matchId);
    if (!battle) return;

    if (isChallenger) {
      battle.p1Answer = { isCorrect, damage };
    } else {
      battle.p2Answer = { isCorrect, damage };
    }

    battle.answersThisRound++;

    // When both players have answered
    if (battle.answersThisRound === 2) {
      // If both are correct, 0 damage to both
      if (battle.p1Answer.isCorrect && battle.p2Answer.isCorrect) {
        battle.p1Answer.damage = 0;
        battle.p2Answer.damage = 0;
      }

      // Apply damage (you take damage if you are wrong)
      battle.p1Hp -= battle.p1Answer.damage;
      battle.p2Hp -= battle.p2Answer.damage;

      // Prevent negative HP
      battle.p1Hp = Math.max(0, battle.p1Hp);
      battle.p2Hp = Math.max(0, battle.p2Hp);

      const p1Dead = battle.p1Hp <= 0;
      const p2Dead = battle.p2Hp <= 0;

      // Send update WITH answers so frontend can animate before advancing
      io.to(matchId).emit('battle_update', {
        p1Hp: battle.p1Hp,
        p2Hp: battle.p2Hp,
        nextRound: !(p1Dead || p2Dead),
        p1Answer: battle.p1Answer,
        p2Answer: battle.p2Answer
      });

      if (p1Dead || p2Dead) {
        // Game Over
        let winner = null;
        if (battle.p1Hp > battle.p2Hp) winner = 'challenger';
        else if (battle.p2Hp > battle.p1Hp) winner = 'target';
        else winner = 'draw';
        
        // Wait for animations before sending battle_over
        setTimeout(() => {
          io.to(matchId).emit('battle_over', { winner });
          battleRooms.delete(matchId);
        }, 3000);
      } else {
        // Next round
        battle.answersThisRound = 0;
        battle.p1Answer = null;
        battle.p2Answer = null;
        if (battle.round === undefined) battle.round = 0;
        battle.round++;
      }
    }
  });

  socket.on('disconnect', () => {
    console.log(`[SOCKET_SERVER] Client disconnected: ${socket.id}`);
    if (currentEmpId) {
      userSockets.delete(currentEmpId);
      // Broadcast updated online users list
      io.emit('online_users', Array.from(userSockets.keys()));
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Cyber Simulator Real-Time Socket Server active`);
  console.log(`📡 Listening on http://localhost:${PORT}`);
  console.log(`====================================================`);
});

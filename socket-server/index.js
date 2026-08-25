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
          updates: { score: data.newScore }
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
      io.to(challengerSocketId).emit('1v1_challenge_accepted');
      socket.emit('1v1_challenge_accepted'); // also send to the acceptor so they start too
    }
  });

  socket.on('deny_1v1_challenge', ({ challengerId, reason }) => {
    const challengerSocketId = userSockets.get(challengerId);
    if (challengerSocketId) {
      console.log(`[SOCKET_SERVER] ${currentEmpId} denied challenge from ${challengerId}`);
      io.to(challengerSocketId).emit('1v1_challenge_denied', { reason: reason || 'Challenge was denied or timed out' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`[SOCKET_SERVER] Client disconnected: ${socket.id}`);
    if (currentEmpId) {
      userSockets.delete(currentEmpId);
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

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST'],
  },
});

// Healthcheck Endpoint
app.get('/', (req, res) => {
  res.json({ status: 'active', service: 'Cyber Simulator Realtime Socket Server', port: 3001 });
});

io.on('connection', (socket) => {
  console.log(`[SOCKET_SERVER] Client connected: ${socket.id}`);

  // Event listener for sending real-time emoji reactions
  socket.on('send_emoji', (data) => {
    console.log(`[SOCKET_SERVER] Broadcast send_emoji:`, data);
    // Broadcast emoji reaction to all connected clients
    io.emit('send_emoji', data);
  });

  // Event listener for live score updates
  socket.on('update_score', (data) => {
    console.log(`[SOCKET_SERVER] Broadcast update_score:`, data);
    // Broadcast updated score to all connected clients
    io.emit('update_score', data);
  });

  socket.on('disconnect', () => {
    console.log(`[SOCKET_SERVER] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Cyber Simulator Real-Time Socket Server active`);
  console.log(`📡 Listening on http://localhost:${PORT}`);
  console.log(`====================================================`);
});

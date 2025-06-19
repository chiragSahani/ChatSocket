const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const path = require('path');

const authRoutes = require('./routes/auth');
const initDb = require('./utils/initDb');
const db = require('./db/database');
const socketHandler = require('./socket'); // <— Socket logic moved to a separate module

dotenv.config();

// Initialize Express & HTTP Server
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // Change this to your frontend URL in production
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Friendly root route
app.get('/', (req, res) => {
  res.send('🎉 ChatRoom API is running! Welcome!');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/private', require('./routes/private'));

// Initialize DB schema
initDb();

// Socket.io Handler (all events handled in /socket/index.js)
socketHandler(io);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = { app, server, io };

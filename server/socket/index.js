const db = require('../db/database');

function socketHandler(io) {
  const onlineUsers = new Map(); // socket.id => userId

  io.on('connection', (socket) => {
    console.log('🟢 User connected:', socket.id);

    // JOIN SERVER
    socket.on('join_server', ({ userId }) => {
      onlineUsers.set(socket.id, userId);
      updateUserStatus(userId, 'online');
      io.emit('user_status_update', { userId, status: 'online' });
    });

    // JOIN ROOM
    socket.on('join_room', ({ roomId }) => {
      socket.join(`room_${roomId}`);
      console.log(`👥 User joined room_${roomId}`);
    });

    // LEAVE ROOM
    socket.on('leave_room', ({ roomId }) => {
      socket.leave(`room_${roomId}`);
      console.log(`🚪 User left room_${roomId}`);
    });

    // SEND MESSAGE
    socket.on('send_message', ({ roomId, senderId, content }) => {
      const query = `INSERT INTO messages (sender_id, room_id, content) VALUES (?, ?, ?)`;
      db.run(query, [senderId, roomId, content], function (err) {
        if (err) {
          console.error("DB error:", err.message);
          return;
        }

        const message = {
          id: this.lastID,
          senderId,
          roomId,
          content,
          createdAt: new Date().toISOString()
        };

        io.to(`room_${roomId}`).emit('receive_message', message);
      });
    });

    // TYPING
    socket.on('typing', ({ roomId, username }) => {
      socket.to(`room_${roomId}`).emit('user_typing', { username });
    });

    // DISCONNECT
    socket.on('disconnect', () => {
      const userId = onlineUsers.get(socket.id);
      if (userId) {
        updateUserStatus(userId, 'offline');
        io.emit('user_status_update', { userId, status: 'offline' });
      }
      onlineUsers.delete(socket.id);
      console.log('🔴 User disconnected:', socket.id);
    });
  });
}

// Update user's status in DB
function updateUserStatus(userId, status) {
  const query = `UPDATE users SET status = ? WHERE id = ?`;
  db.run(query, [status, userId], (err) => {
    if (err) console.error("Status update error:", err.message);
  });
}

module.exports = socketHandler;

const db = require('../db/database');

function sendMessage({ roomId = null, conversationId = null, senderId, content }, callback) {
  const sql = `INSERT INTO messages (room_id, conversation_id, sender_id, content) VALUES (?, ?, ?, ?)`;
  db.run(sql, [roomId, conversationId, senderId, content], function (err) {
    if (err) return callback(err);
    callback(null, { id: this.lastID, room_id: roomId, conversation_id: conversationId, sender_id: senderId, content });
  });
}

function getMessagesByRoom(roomId, callback) {
  const sql = `SELECT * FROM messages WHERE room_id = ? ORDER BY created_at ASC`;
  db.all(sql, [roomId], callback);
}

function getMessagesByConversation(conversationId, callback) {
  const sql = `SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC`;
  db.all(sql, [conversationId], callback);
}

function editMessage(messageId, newContent, callback) {
  const sql = `UPDATE messages SET content = ?, is_edited = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
  db.run(sql, [newContent, messageId], function (err) {
    if (err) return callback(err);
    callback(null, { id: messageId, content: newContent });
  });
}

function deleteMessage(messageId, callback) {
  const sql = `DELETE FROM messages WHERE id = ?`;
  db.run(sql, [messageId], function (err) {
    if (err) return callback(err);
    callback(null, { id: messageId });
  });
}

function getMessageById(messageId, callback) {
  const sql = `SELECT * FROM messages WHERE id = ?`;
  db.get(sql, [messageId], callback);
}

module.exports = {
  sendMessage,
  getMessagesByRoom,
  getMessagesByConversation,
  editMessage,
  deleteMessage,
  getMessageById
};

const db = require('../db/database');

function markMessageAsRead(messageId, userId, callback) {
  const sql = `INSERT OR IGNORE INTO message_reads (message_id, user_id) VALUES (?, ?)`;
  db.run(sql, [messageId, userId], function (err) {
    if (err) return callback(err);
    callback(null, { message_id: messageId, user_id: userId });
  });
}

function getReadReceiptsForMessage(messageId, callback) {
  const sql = `SELECT * FROM message_reads WHERE message_id = ?`;
  db.all(sql, [messageId], callback);
}

function getReadMessagesByUser(userId, callback) {
  const sql = `SELECT * FROM message_reads WHERE user_id = ?`;
  db.all(sql, [userId], callback);
}

module.exports = {
  markMessageAsRead,
  getReadReceiptsForMessage,
  getReadMessagesByUser
};

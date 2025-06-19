const db = require('../db/database');

function setUserStatus(userId, isOnline, callback) {
  const sql = `INSERT INTO statuses (user_id, is_online, last_seen) VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id) DO UPDATE SET is_online = excluded.is_online, last_seen = excluded.last_seen`;
  db.run(sql, [userId, isOnline ? 1 : 0], function (err) {
    if (err) return callback(err);
    callback(null, { user_id: userId, is_online: isOnline });
  });
}

function getUserStatus(userId, callback) {
  const sql = `SELECT * FROM statuses WHERE user_id = ?`;
  db.get(sql, [userId], callback);
}

function getOnlineUsers(callback) {
  const sql = `SELECT user_id FROM statuses WHERE is_online = 1`;
  db.all(sql, [], callback);
}

module.exports = {
  setUserStatus,
  getUserStatus,
  getOnlineUsers
};

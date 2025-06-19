const db = require('../db/database');

function createPrivateConversation(user1Id, user2Id, callback) {
  // Ensure user1Id < user2Id for uniqueness
  const [a, b] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];
  const sql = `INSERT OR IGNORE INTO private_conversations (user1_id, user2_id) VALUES (?, ?)`;
  db.run(sql, [a, b], function (err) {
    if (err) return callback(err);
    // Fetch the conversation (either newly created or existing)
    getPrivateConversationByUsers(a, b, callback);
  });
}

function getPrivateConversationByUsers(user1Id, user2Id, callback) {
  const [a, b] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];
  const sql = `SELECT * FROM private_conversations WHERE user1_id = ? AND user2_id = ?`;
  db.get(sql, [a, b], callback);
}

function getAllConversationsForUser(userId, callback) {
  const sql = `SELECT * FROM private_conversations WHERE user1_id = ? OR user2_id = ?`;
  db.all(sql, [userId, userId], callback);
}

module.exports = {
  createPrivateConversation,
  getPrivateConversationByUsers,
  getAllConversationsForUser
};

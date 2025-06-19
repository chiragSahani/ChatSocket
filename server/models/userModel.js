const db = require('../db/database');

function createUser(username, hashedPassword, callback) {
  const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
  db.run(sql, [username, hashedPassword], function (err) {
    if (err) return callback(err);
    callback(null, { id: this.lastID, username });
  });
}

function findUserByUsername(username, callback) {
  const sql = `SELECT * FROM users WHERE username = ?`;
  db.get(sql, [username], (err, row) => callback(err, row));
}

module.exports = { createUser, findUserByUsername };

const db = require('../db/database');

function createRoom(name, createdBy, callback) {
  const sql = `INSERT INTO rooms (name, created_by) VALUES (?, ?)`;
  db.run(sql, [name, createdBy], function (err) {
    if (err) return callback(err);
    callback(null, { id: this.lastID, name, created_by: createdBy });
  });
}

function getAllRooms(callback) {
  db.all(`SELECT * FROM rooms`, [], callback);
}

function getRoomById(id, callback) {
  db.get(`SELECT * FROM rooms WHERE id = ?`, [id], callback);
}

module.exports = { createRoom, getAllRooms, getRoomById };

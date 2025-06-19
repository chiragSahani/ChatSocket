const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./chat-app.db', (err) => {
  if (err) console.error("❌ DB Connection Error:", err.message);
  else console.log("✅ Connected to SQLite database.");
});

module.exports = db;


const fs = require('fs');
const path = require('path');
const db = require('../db/database');

function initDb() {
  const schema = fs.readFileSync(path.join(__dirname, '../migrations/init.sql'), 'utf8');
  db.exec(schema, (err) => {
    if (err) console.error("❌ Migration failed:", err.message);
    else console.log("✅ Database schema created.");
  });
}

module.exports = initDb;


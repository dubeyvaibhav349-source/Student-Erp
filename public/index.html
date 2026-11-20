const Database = require("better-sqlite3");
const path = require("path");
const db = new Database(path.join(__dirname, "..", "students.db"));
db.pragma("journal_mode = WAL");
db.exec(`
CREATE TABLE IF NOT EXISTS students (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 student_code TEXT NOT NULL UNIQUE,
 full_name TEXT NOT NULL,
 email TEXT NOT NULL UNIQUE,
 phone TEXT DEFAULT '',
 course TEXT NOT NULL,
 enrollment_date TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'Active'
   CHECK(status IN ('Active','Inactive','Graduated')),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)`);
module.exports = db;

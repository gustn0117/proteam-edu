import Database from "better-sqlite3";
import path from "path";
import { mkdirSync, existsSync } from "fs";

const dataDir = path.join(process.cwd(), "data");
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "proteam.db");

function getDb() {
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("busy_timeout = 5000");
  db.pragma("foreign_keys = ON");

  // Initialize tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      organization TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      newsletter INTEGER DEFAULT 0,
      role TEXT DEFAULT 'user',
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      duration TEXT NOT NULL,
      capacity INTEGER NOT NULL,
      location TEXT NOT NULL,
      status TEXT DEFAULT 'accepting',
      poster_url TEXT DEFAULT '',
      category TEXT DEFAULT 'offline',
      course_type TEXT DEFAULT '',
      fee INTEGER DEFAULT 0,
      description TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS enrollments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      payment_status TEXT DEFAULT 'unpaid',
      enrollment_status TEXT DEFAULT 'pending',
      certificate_name TEXT DEFAULT '',
      certificate_url TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (course_id) REFERENCES courses(id),
      UNIQUE(user_id, course_id)
    );
  `);

  // Migrations
  try {
    const courseCols = db.prepare("PRAGMA table_info(courses)").all() as { name: string }[];
    if (!courseCols.find((c) => c.name === "course_type")) {
      db.exec("ALTER TABLE courses ADD COLUMN course_type TEXT DEFAULT ''");
    }
    if (!courseCols.find((c) => c.name === "location_map_url")) {
      db.exec("ALTER TABLE courses ADD COLUMN location_map_url TEXT DEFAULT ''");
    }
    const enrollCols = db.prepare("PRAGMA table_info(enrollments)").all() as { name: string }[];
    if (!enrollCols.find((c) => c.name === "certificate_name")) {
      db.exec("ALTER TABLE enrollments ADD COLUMN certificate_name TEXT DEFAULT ''");
    }
    if (!enrollCols.find((c) => c.name === "payment_key")) {
      db.exec("ALTER TABLE enrollments ADD COLUMN payment_key TEXT DEFAULT ''");
    }
    if (!enrollCols.find((c) => c.name === "order_id")) {
      db.exec("ALTER TABLE enrollments ADD COLUMN order_id TEXT DEFAULT ''");
    }
  } catch {
    // columns may already exist
  }

  // Seed admin user if not exists
  const adminExists = db.prepare("SELECT id FROM users WHERE role = 'admin'").get();
  if (!adminExists) {
    const bcrypt = require("bcryptjs");
    const { v4: uuidv4 } = require("uuid");
    const hashedPw = bcrypt.hashSync("admin1234", 10);
    db.prepare(
      `INSERT OR IGNORE INTO users (id, email, password, name, organization, phone, role)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(uuidv4(), "admin@proteambiz.com", hashedPw, "관리자", "㈜프로앤팀", "02-0000-0000", "admin");
  }

  // Seed sample course if empty
  const courseExists = db.prepare("SELECT id FROM courses").get();
  if (!courseExists) {
    const { v4: uuidv4 } = require("uuid");
    db.prepare(
      `INSERT OR IGNORE INTO courses (id, name, start_date, end_date, duration, capacity, location, status, category, course_type, fee, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      uuidv4(), "글로벌 특허분쟁 대응 전략", "2026-04-15", "2026-04-15",
      "1일, 6시간", 35, "역삼동 과학기술회관", "accepting", "offline", "1DAY", 200000,
      "글로벌 특허분쟁에 효과적으로 대응하기 위한 전략과 실무를 학습하는 교육과정입니다."
    );
  }

  return db;
}

// Use a global singleton to avoid reopening during HMR
const globalForDb = globalThis as unknown as { __db: Database.Database | undefined };
const db = globalForDb.__db ?? getDb();
if (process.env.NODE_ENV !== "production") {
  globalForDb.__db = db;
}

export default db;

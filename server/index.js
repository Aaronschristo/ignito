/**
 * server/index.js
 * Express backend for IGNITO — backed by SQLite (better-sqlite3).
 *
 *  - POST   /api/auth/register              — create account
 *  - POST   /api/auth/login                 — get JWT
 *  - GET    /api/me/registrations           — get my event/comp registrations (auth required)
 *  - POST   /api/register/event/:id         — register for event
 *  - POST   /api/register/competition/:id   — register for competition
 *  - DELETE /api/register/event/:id         — unregister from event
 *  - DELETE /api/register/competition/:id   — unregister from competition
 *
 * Data is persisted to server/ignito.db (SQLite).
 */

import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import path from 'path'
import { fileURLToPath } from 'url'
import Database from 'better-sqlite3'

const __dirname  = path.dirname(fileURLToPath(import.meta.url))
const DB_FILE    = path.join(__dirname, 'ignito.db')
const JWT_SECRET = 'ignito-secret-2027' // hardcoded for simplicity

// ── Database setup ─────────────────────────────────────────────

const db = new Database(DB_FILE)

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL')
// Enforce foreign-key constraints
db.pragma('foreign_keys = ON')

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id       TEXT PRIMARY KEY,
      name     TEXT NOT NULL,
      email    TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS event_registrations (
      user_id  TEXT NOT NULL,
      event_id TEXT NOT NULL,
      PRIMARY KEY (user_id, event_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS competition_registrations (
      user_id        TEXT NOT NULL,
      competition_id TEXT NOT NULL,
      PRIMARY KEY (user_id, competition_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `)
}


initDb()

// ── Prepared statements ────────────────────────────────────────

const stmts = {
  findByEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
  findById:    db.prepare('SELECT id, name, email FROM users WHERE id = ?'),
  insertUser:  db.prepare('INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)'),

  getEventRegs: db.prepare(
    'SELECT event_id FROM event_registrations WHERE user_id = ?'
  ),
  getCompRegs: db.prepare(
    'SELECT competition_id FROM competition_registrations WHERE user_id = ?'
  ),

  insertEventReg: db.prepare(
    'INSERT OR IGNORE INTO event_registrations (user_id, event_id) VALUES (?, ?)'
  ),
  deleteEventReg: db.prepare(
    'DELETE FROM event_registrations WHERE user_id = ? AND event_id = ?'
  ),

  insertCompReg: db.prepare(
    'INSERT OR IGNORE INTO competition_registrations (user_id, competition_id) VALUES (?, ?)'
  ),
  deleteCompReg: db.prepare(
    'DELETE FROM competition_registrations WHERE user_id = ? AND competition_id = ?'
  ),
}

/** Return { events: string[], competitions: string[] } for a user id. */
function getRegistrations(userId) {
  const events       = stmts.getEventRegs.all(userId).map((r) => r.event_id)
  const competitions = stmts.getCompRegs.all(userId).map((r) => r.competition_id)
  return { events, competitions }
}

// ── Auth middleware ────────────────────────────────────────────

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' })
  try {
    req.user = jwt.verify(auth.slice(7), JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

// ── Express app ────────────────────────────────────────────────

const CORS_OPTIONS = {
  origin: true,
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
}

const app = express()
app.use(cors(CORS_OPTIONS))
app.use(express.json())

// ── Routes ─────────────────────────────────────────────────────

// Register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password)
    return res.status(400).json({ error: 'name, email and password are required' })

  if (stmts.findByEmail.get(email))
    return res.status(409).json({ error: 'Email already registered' })

  const hashed = await bcrypt.hash(password, 10)
  const id = Date.now().toString()
  stmts.insertUser.run(id, name, email, hashed)

  const token = jwt.sign({ id, name, email }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, user: { id, name, email } })
})

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ error: 'email and password are required' })

  const user = stmts.findByEmail.get(email)
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
})

// Get my registrations
app.get('/api/me/registrations', authMiddleware, (req, res) => {
  if (!stmts.findById.get(req.user.id))
    return res.status(404).json({ error: 'User not found' })

  res.json(getRegistrations(req.user.id))
})

// Register for event
app.post('/api/register/event/:id', authMiddleware, (req, res) => {
  if (!stmts.findById.get(req.user.id))
    return res.status(404).json({ error: 'User not found' })

  stmts.insertEventReg.run(req.user.id, req.params.id)
  res.json({ success: true, registrations: getRegistrations(req.user.id) })
})

// Unregister from event
app.delete('/api/register/event/:id', authMiddleware, (req, res) => {
  if (!stmts.findById.get(req.user.id))
    return res.status(404).json({ error: 'User not found' })

  stmts.deleteEventReg.run(req.user.id, req.params.id)
  res.json({ success: true, registrations: getRegistrations(req.user.id) })
})

// Register for competition
app.post('/api/register/competition/:id', authMiddleware, (req, res) => {
  if (!stmts.findById.get(req.user.id))
    return res.status(404).json({ error: 'User not found' })

  stmts.insertCompReg.run(req.user.id, req.params.id)
  res.json({ success: true, registrations: getRegistrations(req.user.id) })
})

// Unregister from competition
app.delete('/api/register/competition/:id', authMiddleware, (req, res) => {
  if (!stmts.findById.get(req.user.id))
    return res.status(404).json({ error: 'User not found' })

  stmts.deleteCompReg.run(req.user.id, req.params.id)
  res.json({ success: true, registrations: getRegistrations(req.user.id) })
})

// ── Start ──────────────────────────────────────────────────────
const PORT = 3001
app.listen(PORT, () => {
  console.log(`🚀 IGNITO API running on http://localhost:${PORT}`)
})

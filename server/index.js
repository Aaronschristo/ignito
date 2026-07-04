/**
 * server/index.js
 * Simple Express backend for IGNITO:
 *  - POST /api/auth/register   — create account
 *  - POST /api/auth/login      — get JWT
 *  - GET  /api/me/registrations — get my event/comp registrations (auth required)
 *  - POST /api/register/event/:id      — register for event
 *  - POST /api/register/competition/:id — register for competition
 *  - DELETE /api/register/event/:id    — unregister from event
 *  - DELETE /api/register/competition/:id — unregister from competition
 *
 * Data is persisted to server/data.json (flat JSON file, no DB needed).
 */

import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, 'data.json')
const JWT_SECRET = 'ignito-secret-2027' // hardcoded for simplicity

// ── Helpers ────────────────────────────────────────────────────
function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ users: [] }, null, 2))
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

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

const CORS_OPTIONS = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200, // some browsers send 204 but IE11 needs 200
}

// ── App ────────────────────────────────────────────────────────
const app = express()
app.use(cors(CORS_OPTIONS))
app.use(express.json())

// Register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password)
    return res.status(400).json({ error: 'name, email and password are required' })

  const db = loadData()
  if (db.users.find((u) => u.email === email))
    return res.status(409).json({ error: 'Email already registered' })

  const hashed = await bcrypt.hash(password, 10)
  const user = { id: Date.now().toString(), name, email, password: hashed, registrations: { events: [], competitions: [] } }
  db.users.push(user)
  saveData(db)

  const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
})

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ error: 'email and password are required' })

  const db = loadData()
  const user = db.users.find((u) => u.email === email)
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

  const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
})

// Get my registrations
app.get('/api/me/registrations', authMiddleware, (req, res) => {
  const db = loadData()
  const user = db.users.find((u) => u.id === req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(user.registrations)
})

// Register for event
app.post('/api/register/event/:id', authMiddleware, (req, res) => {
  const db = loadData()
  const user = db.users.find((u) => u.id === req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })

  const { id } = req.params
  if (!user.registrations.events.includes(id)) {
    user.registrations.events.push(id)
    saveData(db)
  }
  res.json({ success: true, registrations: user.registrations })
})

// Unregister from event
app.delete('/api/register/event/:id', authMiddleware, (req, res) => {
  const db = loadData()
  const user = db.users.find((u) => u.id === req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })

  user.registrations.events = user.registrations.events.filter((e) => e !== req.params.id)
  saveData(db)
  res.json({ success: true, registrations: user.registrations })
})

// Register for competition
app.post('/api/register/competition/:id', authMiddleware, (req, res) => {
  const db = loadData()
  const user = db.users.find((u) => u.id === req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })

  const { id } = req.params
  if (!user.registrations.competitions.includes(id)) {
    user.registrations.competitions.push(id)
    saveData(db)
  }
  res.json({ success: true, registrations: user.registrations })
})

// Unregister from competition
app.delete('/api/register/competition/:id', authMiddleware, (req, res) => {
  const db = loadData()
  const user = db.users.find((u) => u.id === req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })

  user.registrations.competitions = user.registrations.competitions.filter((c) => c !== req.params.id)
  saveData(db)
  res.json({ success: true, registrations: user.registrations })
})

// ── Start ──────────────────────────────────────────────────────
const PORT = 3001
app.listen(PORT, () => {
  console.log(`🚀 IGNITO API running on http://localhost:${PORT}`)
})

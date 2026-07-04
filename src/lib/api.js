/**
 * lib/api.js
 * All backend API calls in one place.
 */

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

function getToken() {
  return localStorage.getItem('ignito_token')
}

function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function apiRegisterUser({ name, email, password }) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Registration failed')
  return data
}

export async function apiLogin({ email, password }) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Login failed')
  return data
}

export async function apiGetRegistrations() {
  const res = await fetch(`${BASE}/me/registrations`, {
    headers: { ...authHeaders() },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Failed to fetch registrations')
  return data
}

export async function apiRegisterEvent(id) {
  const res = await fetch(`${BASE}/register/event/${id}`, {
    method: 'POST',
    headers: { ...authHeaders() },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Failed to register')
  return data
}

export async function apiUnregisterEvent(id) {
  const res = await fetch(`${BASE}/register/event/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Failed to unregister')
  return data
}

export async function apiRegisterCompetition(id) {
  const res = await fetch(`${BASE}/register/competition/${id}`, {
    method: 'POST',
    headers: { ...authHeaders() },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Failed to register')
  return data
}

export async function apiUnregisterCompetition(id) {
  const res = await fetch(`${BASE}/register/competition/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Failed to unregister')
  return data
}

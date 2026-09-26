import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import crypto from 'node:crypto'
import { z } from 'zod'
import { db, getUser, upsertUser } from './db.js'
import { validateInitData, type TelegramInitUser } from './telegram.js'
import { pickPrediction } from './predictions.js'

const app = express()
const port = Number(process.env.PORT || 3001)
const maxAge = Number(process.env.INIT_DATA_MAX_AGE_SECONDS || 86400)
const botToken = process.env.BOT_TOKEN || ''
const botUsername = process.env.BOT_USERNAME || ''

app.use(cors({ origin: process.env.FRONTEND_ORIGIN?.split(',').map((v) => v.trim()) || true }))
app.use(express.json({ limit: '32kb' }))

function auth(req: express.Request) {
  const initData = req.header('X-Telegram-Init-Data') || ''
  const result = validateInitData(initData, botToken, maxAge)
  upsertUser(result.user)
  return result.user
}

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

app.get('/health', (_req, res) => res.json({ ok: true, service: 'mystiq-backend' }))

app.get('/api/me', (req, res) => {
  try {
    const user = auth(req)
    const record = getUser(user.id)
    if (!record) return res.status(404).json({ ok: false, error: 'USER_NOT_FOUND' })
    return res.json({ ok: true, user: record })
  } catch (error) {
    return res.status(401).json({ ok: false, error: error instanceof Error ? error.message : 'UNAUTHORIZED' })
  }
})

const createAnonymousSchema = z.object({
  recipientUsername: z.string().trim().min(2).max(64),
  personalMessage: z.string().trim().max(300).default(''),
})

app.post('/api/anonymous-predictions', (req, res) => {
  try {
    const sender = auth(req)
    const input = createAnonymousSchema.parse(req.body)
    const user = getUser(sender.id)
    if (!user) return res.status(404).json({ ok: false, error: 'USER_NOT_FOUND' })

    const freeUntil = Number(user.anonymous_free_started_at) + 24 * 60 * 60 * 1000
    const paidAccessUntil = 0 // Reserved for the Stars entitlement layer.
    if (Date.now() >= freeUntil && Date.now() >= paidAccessUntil) {
      return res.status(402).json({ ok: false, error: 'STARS_REQUIRED', freeUntil })
    }

    const token = crypto.randomBytes(32).toString('base64url')
    const tokenHash = hashToken(token)
    const id = crypto.randomUUID()
    const now = Date.now()
    const expiresAt = now + 7 * 24 * 60 * 60 * 1000
    const prediction = pickPrediction()

    db.prepare(`
      INSERT INTO anonymous_predictions
      (id, sender_telegram_id, recipient_username, personal_message, prediction_json, token_hash, created_at, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, sender.id, input.recipientUsername, input.personalMessage, JSON.stringify(prediction), tokenHash, now, expiresAt)

    const startParam = `anon_${token}`
    const link = botUsername
      ? `https://t.me/${botUsername}?startapp=${encodeURIComponent(startParam)}`
      : `/anon/${encodeURIComponent(token)}`

    return res.json({ ok: true, id, link, token, expiresAt })
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ ok: false, error: error.issues[0]?.message || 'INVALID_INPUT' })
    return res.status(401).json({ ok: false, error: error instanceof Error ? error.message : 'UNAUTHORIZED' })
  }
})

app.get('/api/anonymous-predictions/:token', (req, res) => {
  const token = req.params.token.replace(/^anon_/, '')
  const tokenHash = hashToken(token)
  const row = db.prepare(`
    SELECT id, recipient_username, personal_message, prediction_json, created_at, expires_at, opened_at
    FROM anonymous_predictions WHERE token_hash = ?
  `).get(tokenHash) as any

  if (!row) return res.status(404).json({ ok: false, error: 'NOT_FOUND' })
  if (Date.now() > Number(row.expires_at)) return res.status(410).json({ ok: false, error: 'EXPIRED' })

  db.prepare('UPDATE anonymous_predictions SET opened_at = COALESCE(opened_at, ?) WHERE id = ?').run(Date.now(), row.id)

  return res.json({
    ok: true,
    prediction: JSON.parse(row.prediction_json),
    personalMessage: row.personal_message || '',
    recipientUsername: row.recipient_username,
    expiresAt: row.expires_at,
  })
})

app.listen(port, () => {
  console.log(`MYSTIQ backend listening on http://localhost:${port}`)
})

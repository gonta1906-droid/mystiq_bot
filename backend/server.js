import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT || 8787)
const BOT_USERNAME = process.env.BOT_USERNAME || 'mystiq_bot'
const MINI_APP_URL = process.env.MINI_APP_URL || `https://t.me/${BOT_USERNAME}/app`
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const REQUIRE_TELEGRAM_AUTH = process.env.REQUIRE_TELEGRAM_AUTH === 'true'
const DATA_FILE = path.join(__dirname, 'data.json')

const predictions = [
  { category: '💜 ПОЧУТТЯ', title: 'Слова мають значення', text: 'Одна коротка розмова сьогодні може мати більше значення, ніж здається зараз.' },
  { category: '✨ МОЖЛИВІСТЬ', title: 'Не поспішай відмовлятися', text: 'Те, що спочатку здається випадковістю, може відкрити новий напрямок.' },
  { category: '🌙 ЗНАК', title: 'Зверни увагу на деталі', text: 'Сьогодні відповідь може бути захована у маленькій деталі, яку легко пропустити.' },
  { category: '🔥 ЕНЕРГІЯ', title: 'Зроби перший крок', text: 'Навіть невелика дія сьогодні може запустити те, на що ти давно чекаєш.' },
]

function loadData(){
  try { return JSON.parse(fs.readFileSync(DATA_FILE,'utf8')) } catch { return { anonymous: {} } }
}
function saveData(data){
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}
function token(){ return crypto.randomBytes(32).toString('base64url') }
function hash(v){ return crypto.createHash('sha256').update(v).digest('hex') }

function validateTelegramInitData(initData){
  if (!BOT_TOKEN) return { ok: !REQUIRE_TELEGRAM_AUTH, user: null }
  if (!initData) return { ok:false, user:null }
  const params = new URLSearchParams(initData)
  const receivedHash = params.get('hash')
  const authDate = Number(params.get('auth_date') || 0)
  if (!receivedHash || !authDate) return { ok:false, user:null }
  if (Date.now()/1000 - authDate > 86400) return { ok:false, user:null }
  params.delete('hash')
  const dataCheckString = [...params.entries()].sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>`${k}=${v}`).join('\\n')
  const secret = crypto.createHmac('sha256','WebAppData').update(BOT_TOKEN).digest()
  const expected = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex')
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(receivedHash))) return { ok:false, user:null }
  let user=null
  try { user = JSON.parse(params.get('user') || 'null') } catch {}
  return { ok:true, user }
}

function auth(req,res){
  const result=validateTelegramInitData(req.get('x-telegram-init-data') || '')
  if(!result.ok){ res.status(401).json({error:'Telegram authorization required'}); return null }
  return result.user
}

const app=express()
app.use(cors({origin:true}))
app.use(express.json({limit:'32kb'}))

app.get('/health',(req,res)=>res.json({ok:true,service:'mystiq-backend'}))

app.post('/api/anonymous/create',(req,res)=>{
  const user=auth(req,res)
  if(!user && REQUIRE_TELEGRAM_AUTH) return
  const recipient=String(req.body?.recipient || '').trim()
  const message=String(req.body?.message || '').trim().slice(0,300)
  if(!recipient) return res.status(400).json({error:'Recipient is required'})
  if(recipient.length>120) return res.status(400).json({error:'Recipient is too long'})

  const rawToken=token()
  const prediction=predictions[Math.floor(Math.random()*predictions.length)]
  const now=Date.now()
  const record={
    tokenHash:hash(rawToken),
    senderTelegramUserId:user?.id ?? null,
    recipient,
    message,
    prediction,
    createdAt:now,
    expiresAt:now + 7*24*60*60*1000,
    openedAt:null,
  }
  const data=loadData(); data.anonymous[record.tokenHash]=record; saveData(data)
  const deepLink=`${MINI_APP_URL}?startapp=anon_${rawToken}`
  const shareUrl=`https://t.me/share/url?url=${encodeURIComponent(deepLink)}&text=${encodeURIComponent('🔮 Для тебе є анонімне передбачення від MYSTIQ')}`
  res.json({ok:true, deepLink, shareUrl, expiresAt:record.expiresAt})
})

app.get('/api/anonymous/:token',(req,res)=>{
  const raw=req.params.token
  if(!raw || raw.length<20) return res.status(400).json({error:'Invalid token'})
  const data=loadData(); const record=data.anonymous[hash(raw)]
  if(!record) return res.status(404).json({error:'Prediction not found'})
  if(Date.now()>record.expiresAt) return res.status(410).json({error:'Prediction expired'})
  if(!record.openedAt){ record.openedAt=Date.now(); saveData(data) }
  res.json({ok:true, recipient:record.recipient, message:record.message, prediction:record.prediction, openedAt:record.openedAt})
})

app.listen(PORT,()=>console.log(`MYSTIQ backend running on http://localhost:${PORT}`))

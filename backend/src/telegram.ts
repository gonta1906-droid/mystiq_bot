import crypto from 'node:crypto'

export type TelegramInitUser = {
  id: number
  first_name?: string
  last_name?: string
  username?: string
  language_code?: string
}

export function validateInitData(initData: string, botToken: string, maxAgeSeconds: number) {
  if (!initData) throw new Error('Missing Telegram initData')
  if (!botToken) throw new Error('BOT_TOKEN is not configured')

  const params = new URLSearchParams(initData)
  const receivedHash = params.get('hash')
  const authDate = Number(params.get('auth_date'))
  if (!receivedHash || !Number.isFinite(authDate)) throw new Error('Invalid Telegram initData')

  const age = Math.floor(Date.now() / 1000) - authDate
  if (age < -60 || age > maxAgeSeconds) throw new Error('Telegram initData expired')

  const pairs: string[] = []
  for (const [key, value] of params.entries()) {
    if (key !== 'hash') pairs.push(`${key}=${value}`)
  }
  pairs.sort()
  const dataCheckString = pairs.join('\n')

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest()
  const calculated = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex')

  const a = Buffer.from(calculated, 'hex')
  const b = Buffer.from(receivedHash, 'hex')
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error('Invalid Telegram signature')

  const rawUser = params.get('user')
  if (!rawUser) throw new Error('Telegram user is missing')
  const user = JSON.parse(rawUser) as TelegramInitUser
  return { user, authDate }
}

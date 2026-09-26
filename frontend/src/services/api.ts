const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8787').replace(/\/$/, '')

export async function createAnonymousPrediction(recipient: string, message: string) {
  const initData = window.Telegram?.WebApp?.initData || ''
  const response = await fetch(`${API_URL}/api/anonymous/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-telegram-init-data': initData },
    body: JSON.stringify({ recipient, message }),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'Не вдалося створити передбачення')
  return data as { ok: true; deepLink: string; shareUrl: string; expiresAt: number }
}

export async function getAnonymousPrediction(token: string) {
  const response = await fetch(`${API_URL}/api/anonymous/${encodeURIComponent(token)}`)
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'Передбачення недоступне')
  return data
}

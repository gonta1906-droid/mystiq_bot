export type TelegramUser = {
  id: number
  first_name?: string
  last_name?: string
  username?: string
  language_code?: string
}

export function getTelegramWebApp() {
  return window.Telegram?.WebApp
}

export function getTelegramUser(): TelegramUser | null {
  return getTelegramWebApp()?.initDataUnsafe?.user ?? null
}

export function initTelegram() {
  const tg = getTelegramWebApp()
  if (!tg) return

  tg.ready()
  tg.expand()
  tg.MainButton?.hide()

  const updateViewport = () => {
    const height = tg.viewportStableHeight || tg.viewportHeight || window.innerHeight
    document.documentElement.style.setProperty('--tg-viewport-height', `${height}px`)
  }

  updateViewport()
  window.addEventListener('resize', updateViewport)
}

let telegramBackHandler: (() => void) | null = null

export function setTelegramBackButton(onBack: (() => void) | null) {
  const tg = getTelegramWebApp()
  if (!tg?.BackButton) return

  if (telegramBackHandler) {
    tg.BackButton.offClick(telegramBackHandler)
    telegramBackHandler = null
  }

  if (onBack) {
    telegramBackHandler = onBack
    tg.BackButton.onClick(onBack)
    tg.BackButton.show()
  } else {
    tg.BackButton.hide()
  }
}

export function haptic(
  style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light',
) {
  getTelegramWebApp()?.HapticFeedback?.impactOccurred(style)
}

export function notificationHaptic(type: 'error' | 'success' | 'warning') {
  getTelegramWebApp()?.HapticFeedback?.notificationOccurred(type)
}

export async function shareText(text: string) {
  const encoded = encodeURIComponent(text)
  const shareUrl = `https://t.me/share/url?url=&text=${encoded}`
  const tg = getTelegramWebApp()

  if (tg?.openTelegramLink) {
    tg.openTelegramLink(shareUrl)
    return
  }

  if (navigator.share) {
    await navigator.share({ text })
    return
  }

  await navigator.clipboard?.writeText(text)
}

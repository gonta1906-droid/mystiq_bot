export type TelegramUser = {
  id: number
  first_name?: string
  last_name?: string
  username?: string
  language_code?: string
}

type TelegramWebAppLike = {
  initData?: string

  initDataUnsafe?: {
    user?: TelegramUser
  }

  viewportStableHeight?: number
  viewportHeight?: number

  ready?: () => void
  expand?: () => void

  MainButton?: {
    hide?: () => void
  }

  BackButton?: {
    onClick?: (callback: () => void) => void
    offClick?: (callback: () => void) => void
    show?: () => void
    hide?: () => void
  }

  HapticFeedback?: {
    impactOccurred?: (
      style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft',
    ) => void

    notificationOccurred?: (
      type: 'error' | 'success' | 'warning',
    ) => void
  }

  openTelegramLink?: (url: string) => void
}

export function getTelegramWebApp(): TelegramWebAppLike | undefined {
  return window.Telegram?.WebApp as TelegramWebAppLike | undefined
}

export function getTelegramUser(): TelegramUser | null {
  return getTelegramWebApp()?.initDataUnsafe?.user ?? null
}

export function initTelegram() {
  const tg = getTelegramWebApp()

  if (!tg) return

  tg.ready?.()
  tg.expand?.()
  tg.MainButton?.hide?.()

  const updateViewport = () => {
    const height =
      tg.viewportStableHeight ||
      tg.viewportHeight ||
      window.innerHeight

    document.documentElement.style.setProperty(
      '--tg-viewport-height',
      `${height}px`,
    )
  }

  updateViewport()

  window.addEventListener('resize', updateViewport)
}

let telegramBackHandler: (() => void) | null = null

export function setTelegramBackButton(
  onBack: (() => void) | null,
) {
  const tg = getTelegramWebApp()
  const backButton = tg?.BackButton

  if (!backButton) return

  if (telegramBackHandler) {
    backButton.offClick?.(telegramBackHandler)
    telegramBackHandler = null
  }

  if (onBack) {
    telegramBackHandler = onBack
    backButton.onClick?.(onBack)
    backButton.show?.()
  } else {
    backButton.hide?.()
  }
}

export function haptic(
  style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light',
) {
  const tg = getTelegramWebApp()

  if (!tg?.HapticFeedback?.impactOccurred) return

  tg.HapticFeedback.impactOccurred(style)
}

export function notificationHaptic(
  type: 'error' | 'success' | 'warning',
) {
  const tg = getTelegramWebApp()

  if (!tg?.HapticFeedback?.notificationOccurred) return

  tg.HapticFeedback.notificationOccurred(type)
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

  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text)
  }
}

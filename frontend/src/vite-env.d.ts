/// <reference types="vite/client" />

interface TelegramWebApp {
  ready: () => void
  expand: () => void
  close: () => void
  openTelegramLink?: (url: string) => void
  enableClosingConfirmation?: () => void
  disableClosingConfirmation?: () => void
  BackButton: {
    show: () => void
    hide: () => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
  }
  HapticFeedback?: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void
    selectionChanged: () => void
  }
  MainButton?: {
    hide: () => void
  }
  initData?: string
  initDataUnsafe?: {
    user?: {
      id: number
      first_name?: string
      last_name?: string
      username?: string
      language_code?: string
    }
  }
  colorScheme?: 'light' | 'dark'
  themeParams?: Record<string, string>
  viewportHeight?: number
  viewportStableHeight?: number
}

interface Window {
  Telegram?: {
    WebApp: TelegramWebApp
  }
}
interface TelegramWebApp {
  initData?: string
  initDataUnsafe?: {
    user?: {
      id: number
      first_name?: string
      last_name?: string
      username?: string
      photo_url?: string
    }
  }
  ready?: () => void
  expand?: () => void
  openInvoice?: (url: string, callback?: (status: string) => void) => void
  MainButton?: { hide?:()=>void }
  BackButton?: { onClick:(cb:()=>void)=>void; offClick:(cb:()=>void)=>void; show:()=>void; hide:()=>void }
  openTelegramLink?: (url:string)=>void
  viewportStableHeight?: number
  viewportHeight?: number
  HapticFeedback?: {
    impactOccurred?: (style: string) => void
  }
}

interface Window {
  Telegram?: {
    WebApp?: TelegramWebApp
  }
}

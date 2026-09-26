import { getDateKey } from '../data/predictions'

export type HistoryItem = {
  id: string
  predictionId: string
  topic: string
  title: string
  date: string
  text: string
}

export type Gift = {
  id: string
  title: string
  status: 'Створено' | 'Відправлено'
  text: string
  date: string
}

const HISTORY_KEY = 'mystiq_history'
const GIFTS_KEY = 'mystiq_gifts'

function read<T>(key: string, fallback: T): T {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null')
    return value ?? fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage can be unavailable in restricted browser modes.
  }
}

export function getHistory(): HistoryItem[] {
  const value = read<unknown>(HISTORY_KEY, [])
  return Array.isArray(value) ? value as HistoryItem[] : []
}

export function saveOpenedPrediction(item: Omit<HistoryItem, 'id'>) {
  const history = getHistory()
  const alreadySaved = history.some(
    (entry) => entry.date === item.date && entry.predictionId === item.predictionId,
  )

  if (alreadySaved) return history

  const next = [
    { ...item, id: `${item.date}-${item.predictionId}` },
    ...history,
  ].slice(0, 60)

  write(HISTORY_KEY, next)
  return next
}

export function getGifts(): Gift[] {
  const value = read<unknown>(GIFTS_KEY, [])
  return Array.isArray(value) ? value as Gift[] : []
}

export function saveGift(gift: Gift) {
  const next = [gift, ...getGifts()].slice(0, 60)
  write(GIFTS_KEY, next)
  return next
}

export function getStreak(): number {
  const dates = new Set(getHistory().map((item) => item.date))
  let cursor = new Date()
  let streak = 0

  while (dates.has(getDateKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}


export type ShopPurchase = {
  productId: string
  title: string
  price: number
  date: string
}

const SHOP_KEY = 'mystiq_shop_purchases'

export function getShopPurchases(): ShopPurchase[] {
  const value = read<unknown>(SHOP_KEY, [])
  return Array.isArray(value) ? value as ShopPurchase[] : []
}

export function saveShopPurchase(purchase: ShopPurchase): ShopPurchase[] {
  const existing = getShopPurchases()
  if (existing.some((item) => item.productId === purchase.productId)) return existing
  const next = [purchase, ...existing].slice(0, 50)
  write(SHOP_KEY, next)
  return next
}

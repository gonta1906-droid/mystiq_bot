import { useEffect, useMemo, useState } from 'react'
import { getTelegramUser } from '../services/telegram'

interface ProfileProps {
  onBack: () => void
  onHistory: () => void
  onGifts: () => void
}

export default function Profile({ onBack, onHistory, onGifts }: ProfileProps) {
  const [historyCount, setHistoryCount] = useState(0)
  const [giftCount, setGiftCount] = useState(0)
  const telegramUser = getTelegramUser()

  useEffect(() => {
    const syncCounts = () => {
      try {
        const history = JSON.parse(localStorage.getItem('mystiq_history') || '[]')
        const gifts = JSON.parse(localStorage.getItem('mystiq_gifts') || '[]')
        setHistoryCount(Array.isArray(history) ? history.length : 0)
        setGiftCount(Array.isArray(gifts) ? gifts.length : 0)
      } catch {
        setHistoryCount(0)
        setGiftCount(0)
      }
    }

    syncCounts()
    window.addEventListener('focus', syncCounts)
    return () => window.removeEventListener('focus', syncCounts)
  }, [])

  const displayName = useMemo(() => {
    if (!telegramUser) return 'Гість'
    return [telegramUser.first_name, telegramUser.last_name].filter(Boolean).join(' ') || 'Користувач Telegram'
  }, [telegramUser])

  const username = telegramUser?.username ? `@${telegramUser.username}` : 'Telegram Mini App'
  const avatarLetter = displayName.trim().charAt(0).toUpperCase() || 'M'

  return (
    <main className="sub-screen">
      <header className="sub-header">
        <button className="sub-back" onClick={onBack} aria-label="Назад">←</button>
        <div>
          <div className="sub-title">✦ ПРОФІЛЬ</div>
          <div className="sub-subtitle">ТВОЯ ІСТОРІЯ MYSTIQ</div>
        </div>
      </header>

      <section className="profile-hero mystiq-panel">
        <div className="profile-avatar">{avatarLetter}</div>
        <h1>{displayName}</h1>
        <p>{username}</p>

        <div className="profile-stats">
          <div><strong>7</strong><span>Серія</span></div>
          <div><strong>{historyCount}</strong><span>Знаків</span></div>
          <div><strong>{giftCount}</strong><span>Подарунків</span></div>
        </div>
      </section>

      <section className="profile-menu">
        <button className="profile-menu-item" onClick={onHistory}>
          <span className="menu-icon">🔮</span>
          <span><b>Моя історія</b><small>Переглянути попередні передбачення</small></span>
          <strong>›</strong>
        </button>

        <button className="profile-menu-item" onClick={onGifts}>
          <span className="menu-icon">🎁</span>
          <span><b>Мої подарунки</b><small>Відправлені та отримані знаки</small></span>
          <strong>›</strong>
        </button>
      </section>
    </main>
  )
}

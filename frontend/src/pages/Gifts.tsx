import { useEffect, useState } from 'react'
import { haptic } from '../services/telegram'

interface Gift {
  id: number
  title: string
  status: string
  text: string
  date?: string
}

interface GiftsProps {
  onBack: () => void
}

export default function Gifts({ onBack }: GiftsProps) {
  const [gifts, setGifts] = useState<Gift[]>([])

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('mystiq_gifts') || '[]')
      setGifts(Array.isArray(saved) ? saved : [])
    } catch {
      setGifts([])
    }
  }, [])

  return (
    <main className="sub-screen">
      <header className="sub-header">
        <button className="sub-back" onClick={onBack} aria-label="Назад">←</button>
        <div>
          <div className="sub-title">🎁 ПОДАРУНКИ</div>
          <div className="sub-subtitle">ТВОЇ ТАЄМНІ ПОСЛАННЯ</div>
        </div>
      </header>

      <section className="gift-intro mystiq-panel">
        <div className="gift-big-icon">🎁</div>
        <h1>Мої подарунки</h1>
        <p>Тут зберігаються передбачення, які ти відправив комусь.</p>
      </section>

      {gifts.length > 0 ? (
        <section className="gift-list">
          {gifts.map((gift) => (
            <article className="gift-row" key={gift.id}>
              <div className="gift-row-icon">🎁</div>
              <div className="gift-row-copy">
                <b>{gift.title}</b>
                <span>{gift.text}</span>
                <small>{gift.date || ''} · {gift.status}</small>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="empty-state mystiq-panel">
          <div>✨</div>
          <h2>Подарунків ще немає</h2>
          <p>Відкрий передбачення та натисни «Відправити комусь», щоб створити перший подарунок.</p>
        </section>
      )}

      <button
        className="profile-primary gifts-demo-button"
        onClick={() => {
          haptic('light')
          const demo: Gift = {
            id: Date.now(),
            title: 'Твоє таємне передбачення',
            status: 'Створено',
            text: 'Нове послання MYSTIQ чекає на свого отримувача.',
            date: new Intl.DateTimeFormat('uk-UA').format(new Date()),
          }
          const next = [demo, ...gifts]
          setGifts(next)
          localStorage.setItem('mystiq_gifts', JSON.stringify(next))
        }}
      >
        ✦ СТВОРИТИ ПОДАРУНОК
      </button>
    </main>
  )
}

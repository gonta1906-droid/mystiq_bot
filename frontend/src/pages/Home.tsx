import { useEffect, useState } from 'react'

interface HomeProps {
  onOpenPrediction: () => void
  onOpenProfile: () => void
  onOpenShop: () => void
  onOpenAnonymous: () => void
}

export default function Home({
  onOpenPrediction,
  onOpenProfile,
  onOpenShop,
  onOpenAnonymous,
}: HomeProps) {
  const [freeLeft, setFreeLeft] = useState('24:00:00')

  useEffect(() => {
    const key = 'mystiq_anonymous_free_started'
    let started = Number(localStorage.getItem(key) || 0)
    if (!started) {
      started = Date.now()
      localStorage.setItem(key, String(started))
    }
    const tick = () => {
      const remaining = Math.max(0, 24 * 60 * 60 * 1000 - (Date.now() - started))
      const h = String(Math.floor(remaining / 3600000)).padStart(2, '0')
      const m = String(Math.floor((remaining % 3600000) / 60000)).padStart(2, '0')
      const sec = String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0')
      setFreeLeft(`${h}:${m}:${sec}`)
    }
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [])
  const today = new Intl.DateTimeFormat('uk-UA', {
    day: 'numeric',
    month: 'long',
  }).format(new Date())

  return (
    <main className="app-shell home-screen">
      <header className="home-header">
        <div className="home-brand">
          <span className="home-brand-symbol">✦</span>
          <div>
            <div className="home-brand-name">MYSTIQ</div>
            <div className="home-brand-tagline">Your sign. Every day.</div>
          </div>
        </div>

        <button
          className="profile-button"
          aria-label="Профіль"
          onClick={onOpenProfile}
          type="button"
        >
          👤
        </button>
      </header>

      <section className="home-content">
        <button className="prediction-label prediction-label-button" onClick={onOpenAnonymous} type="button">🔮 АНОНІМНЕ ПЕРЕДБАЧЕННЯ</button>
        <div className="prediction-status">FREE · {freeLeft}</div>

        <div className="home-card-wrap" aria-hidden="true">
          <div className="home-card-glow" />
          <div className="prediction-card-preview">
            <div className="preview-inner">
              <div className="preview-orb">✦</div>
            </div>
          </div>
        </div>

        <h1>Твій знак уже чекає</h1>
        <p className="prediction-date">Сьогодні, {today}</p>

        <button
          className="primary-button open-card-button"
          onClick={onOpenPrediction}
          type="button"
        >
          ВІДКРИТИ <span>✦</span>
        </button>

        <div className="streak">🔥 Серія: <strong>7 днів</strong></div>
      </section>

      <nav className="bottom-navigation" aria-label="Основна навігація">
        <button className="nav-item active" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span>⌂</span>
          <small>Головна</small>
        </button>

        <button className="nav-item" type="button" onClick={onOpenPrediction}>
          <span>✦</span>
          <small>Передбачення</small>
        </button>

        <button className="nav-item" type="button" onClick={onOpenShop}>
          <span>🛍️</span>
          <small>Магазин</small>
        </button>

        <button className="nav-item" type="button" onClick={onOpenProfile}>
          <span>♙</span>
          <small>Профіль</small>
        </button>
      </nav>
    </main>
  )
}

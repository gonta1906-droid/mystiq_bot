import { useEffect, useState } from 'react'
import { haptic, notificationHaptic, shareText } from '../services/telegram'
import { todayPrediction } from '../data/predictions'

interface PredictionProps {
  onBack: () => void
}

export default function Prediction({ onBack }: PredictionProps) {
  const [opened, setOpened] = useState(false)

  const openPrediction = () => {
    if (opened) return
    haptic('medium')
    setOpened(true)
  }

  useEffect(() => {
    if (opened) {
      notificationHaptic('success')

      try {
        const current = JSON.parse(localStorage.getItem('mystiq_history') || '[]')
        const items = Array.isArray(current) ? current : []
        const today = new Intl.DateTimeFormat('uk-UA').format(new Date())
        const alreadySaved = items.some((item) => item.date === today && item.text === todayPrediction.text)

        if (!alreadySaved) {
          const next = [{
            id: Date.now(),
            topic: todayPrediction.category,
            date: today,
            text: todayPrediction.text,
          }, ...items].slice(0, 30)
          localStorage.setItem('mystiq_history', JSON.stringify(next))
        }
      } catch {
        // Local storage can be unavailable in restricted browser modes.
      }
    }
  }, [opened])

  const handleShare = async () => {
    haptic('light')
    await shareText(
      `🔮 MYSTIQ\n\n${todayPrediction.title}\n${todayPrediction.text}\n\nВідкрий своє передбачення в MYSTIQ.`,
    )
  }

  const handleGift = async () => {
    haptic('medium')

    const gift = {
      id: Date.now(),
      title: todayPrediction.title,
      status: 'Відправлено',
      text: todayPrediction.text,
      date: new Intl.DateTimeFormat('uk-UA').format(new Date()),
    }

    try {
      const current = JSON.parse(localStorage.getItem('mystiq_gifts') || '[]')
      const gifts = Array.isArray(current) ? current : []
      localStorage.setItem('mystiq_gifts', JSON.stringify([gift, ...gifts].slice(0, 30)))
    } catch {
      // Continue with Telegram share even if local storage is unavailable.
    }

    await shareText(
      `🎁 Тобі надіслали таємне передбачення MYSTIQ\n\n«${todayPrediction.title}»\n${todayPrediction.text}`,
    )
  }

  return (
    <main className="app-shell prediction-screen">
      <header className="prediction-header">
        <button
          className="circle-back"
          onClick={onBack}
          aria-label="Назад"
        >
          ←
        </button>

        <div className="prediction-heading">
          <div className="prediction-header-title">✦ ТВОЄ ПЕРЕДБАЧЕННЯ</div>
          <div className="prediction-header-subtitle">СЬОГОДНІШНІЙ ЗНАК</div>
        </div>
      </header>

      {!opened && (
        <div className="prediction-intro">
          ЗУПИНИСЬ НА МИТЬ. ВІДКРИЙ СВІЙ ЗНАК.
        </div>
      )}

      <section className={`card-stage ${opened ? 'is-opened' : ''}`}>
        <button
          className={`prediction-flip-card ${opened ? 'opened' : ''}`}
          onClick={!opened ? openPrediction : undefined}
          aria-label={opened ? 'Передбачення відкрито' : 'Відкрити передбачення'}
          type="button"
        >
          <div className="prediction-flip-inner">
            <div className="prediction-card-face prediction-card-front">
              <div className="front-card">
                <div className="front-orb">✦</div>
                <div className="front-brand">MYSTIQ</div>
                <div className="front-tagline">Your sign. Every day.</div>
                <div className="card-tap-hint">✦ торкнись, щоб відкрити</div>
              </div>
            </div>

            <div className="prediction-card-face prediction-card-back">
              <div className="card-back-glow" />
              <div className="prediction-card-category">{todayPrediction.category}</div>
              <h1>{todayPrediction.title}</h1>
              <div className="prediction-card-divider">✦</div>
              <p>{todayPrediction.text}</p>
              <div className="card-back-footer">MYSTIQ</div>
            </div>
          </div>
        </button>

        {!opened && (
          <button className="primary-button open-card-button" onClick={openPrediction}>
            ВІДКРИТИ <span>✦</span>
          </button>
        )}
      </section>

      <section className={`prediction-extra ${opened ? 'visible' : ''}`}>
        <div className="prediction-details">
          <div className="prediction-detail">
            <span className="detail-icon">◉</span>
            <div>
              <small>Щасливий момент</small>
              <strong>{todayPrediction.moment}</strong>
            </div>
          </div>

          <div className="prediction-detail">
            <span className="detail-icon">✦</span>
            <div>
              <small>Порада</small>
              <strong>{todayPrediction.advice}</strong>
            </div>
          </div>
        </div>

        <div className="prediction-quote">{todayPrediction.quote}</div>

        <div className="prediction-actions">
          <button className="primary-button share-button" onClick={handleShare}>
            ↗ ПОДІЛИТИСЯ
          </button>

          <button className="secondary-button gift-button" onClick={handleGift}>
            🎁 ВІДПРАВИТИ КОМУСЬ
          </button>
        </div>
      </section>
    </main>
  )
}
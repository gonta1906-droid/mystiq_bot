import { useEffect, useState } from 'react'
import {
  getAnonymousPredictionAccess,
  grantLocalAnonymousPredictionAccess,
} from '../services/anonymousPrediction'

interface AnonymousPredictionGateProps {
  onOpen: () => void
}

export default function AnonymousPredictionGate({
  onOpen,
}: AnonymousPredictionGateProps) {
  const [access, setAccess] = useState(() => getAnonymousPredictionAccess())

  useEffect(() => {
    setAccess(getAnonymousPredictionAccess())
  }, [])

  const buyWithStars = () => {
    /**
     * IMPORTANT:
     * This is only the frontend hook.
     * Do not treat this click as a successful Stars payment.
     *
     * Production flow:
     * 1. Ask backend to create a Telegram Stars invoice.
     * 2. Open Telegram.WebApp.openInvoice(invoiceUrl, ...).
     * 3. Backend verifies the successful payment.
     * 4. Backend grants access.
     * 5. Refresh access state from backend.
     */
    const tg = window.Telegram?.WebApp

    if (tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred('light')
    }

    // Temporary local demo so the UI can be tested.
    // Replace with confirmed backend payment response.
    grantLocalAnonymousPredictionAccess(1)
    setAccess(getAnonymousPredictionAccess())
  }

  if (access.isUnlocked) {
    return (
      <button
        className="anonymous-prediction-button"
        onClick={onOpen}
      >
        🔮 АНОНІМНЕ ПЕРЕДБАЧЕННЯ
        <span>{access.isFree ? '24 ГОДИНИ FREE' : 'ВІДКРИТО'}</span>
      </button>
    )
  }

  return (
    <section className="anonymous-prediction-paywall">
      <div className="anonymous-prediction-icon">🔮</div>

      <h2>Анонімне передбачення</h2>

      <p>
        Перші 24 години — безкоштовно.
        Після цього доступ відкривається за Telegram Stars.
      </p>

      <button
        className="anonymous-prediction-stars-button"
        onClick={buyWithStars}
      >
        ⭐ ВІДКРИТИ ЗА STARS
      </button>
    </section>
  )
}

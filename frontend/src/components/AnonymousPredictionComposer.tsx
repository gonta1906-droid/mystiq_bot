import { useState } from 'react'

interface AnonymousPredictionComposerProps {
  onBack: () => void
  onContinue: (recipient: string, message: string) => void
}

export default function AnonymousPredictionComposer({
  onBack,
  onContinue,
}: AnonymousPredictionComposerProps) {
  const [recipient, setRecipient] = useState('')
  const [message, setMessage] = useState('')

  const submit = () => {
    const value = recipient.trim()
    if (!value) return

    const tg = window.Telegram?.WebApp
    tg?.HapticFeedback?.impactOccurred?.('light')

    onContinue(value, message.trim())
  }

  return (
    <main className="anonymous-composer-screen">
      <header className="anonymous-composer-header">
        <button className="anonymous-composer-back" onClick={onBack} aria-label="Назад">
          ←
        </button>
        <div>
          <div className="anonymous-composer-kicker">🔮 АНОНІМНЕ</div>
          <h1>Передбачення для когось</h1>
        </div>
      </header>

      <section className="anonymous-composer-card">
        <div className="anonymous-composer-symbol">✦</div>

        <h2>Кому відправити?</h2>
        <p className="anonymous-composer-help">
          Вкажи @username або Telegram-посилання людини, для якої відкриється передбачення.
        </p>

        <label className="anonymous-field-label" htmlFor="anonymous-recipient">
          ОТРИМУВАЧ
        </label>
        <input
          id="anonymous-recipient"
          className="anonymous-field"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="@username"
          autoComplete="off"
          spellCheck={false}
        />

        <label className="anonymous-field-label" htmlFor="anonymous-message">
          ТЕКСТ ВІД ТЕБЕ · НЕОБОВʼЯЗКОВО
        </label>
        <textarea
          id="anonymous-message"
          className="anonymous-field anonymous-message"
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 300))}
          placeholder="Напиши щось від себе..."
          rows={5}
          maxLength={300}
        />

        <div className="anonymous-message-counter">
          {message.length}/300
        </div>

        <button
          className="anonymous-continue-button"
          onClick={submit}
          disabled={!recipient.trim()}
        >
          ПРОДОВЖИТИ <span>✦</span>
        </button>
      </section>
    </main>
  )
}

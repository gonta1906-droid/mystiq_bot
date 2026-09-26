interface AnonymousPredictionPreviewProps {
  recipient: string
  message: string
  onBack: () => void
  onSend: () => void
}

export default function AnonymousPredictionPreview({
  recipient,
  message,
  onBack,
  onSend,
}: AnonymousPredictionPreviewProps) {
  return (
    <main className="anonymous-preview-screen">
      <header className="anonymous-composer-header">
        <button className="anonymous-composer-back" onClick={onBack} aria-label="Назад">
          ←
        </button>
        <div>
          <div className="anonymous-composer-kicker">✦ ПЕРЕД ВІДПРАВКОЮ</div>
          <h1>Перевір повідомлення</h1>
        </div>
      </header>

      <section className="anonymous-preview-card">
        <div className="anonymous-preview-to">
          <small>ДЛЯ</small>
          <strong>{recipient}</strong>
        </div>

        {message && (
          <div className="anonymous-preview-message">
            <small>ТВОЄ ПОВІДОМЛЕННЯ</small>
            <p>{message}</p>
          </div>
        )}

        <div className="anonymous-preview-prediction">
          <div className="anonymous-preview-lock">🔮</div>
          <small>ПЕРЕДБАЧЕННЯ MYSTIQ</small>
          <p>
            Передбачення відкриється отримувачу після переходу за персональним
            посиланням.
          </p>
        </div>

        <button className="anonymous-continue-button" onClick={onSend}>
          ВІДПРАВИТИ АНОНІМНО <span>✦</span>
        </button>
      </section>
    </main>
  )
}

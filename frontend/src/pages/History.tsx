import { useEffect, useState } from 'react'

type HistoryItem = {
  id: number
  topic?: string
  date: string
  text: string
}

interface HistoryProps {
  onBack: () => void
  onOpenPrediction: () => void
}

export default function History({ onBack, onOpenPrediction }: HistoryProps) {
  const [items, setItems] = useState<HistoryItem[]>([])

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('mystiq_history') || '[]')
      setItems(Array.isArray(saved) ? saved : [])
    } catch {
      setItems([])
    }
  }, [])

  return (
    <main className="sub-screen">
      <header className="sub-header">
        <button className="sub-back" onClick={onBack} aria-label="Назад">←</button>
        <div>
          <div className="sub-title">🔮 МОЯ ІСТОРІЯ</div>
          <div className="sub-subtitle">ТВОЇ ПОПЕРЕДНІ ЗНАКИ</div>
        </div>
      </header>

      {items.length > 0 ? (
        <section className="history-list-new">
          {items.map((item) => (
            <article className="history-row mystiq-panel" key={item.id}>
              <div className="history-icon">✦</div>
              <div>
                <b>{item.topic || 'Передбачення'}</b>
                <small>{item.date}</small>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="empty-state mystiq-panel">
          <div>🔮</div>
          <h2>Історія поки порожня</h2>
          <p>Відкрий своє перше передбачення — і воно збережеться тут.</p>
          <button className="profile-primary" onClick={onOpenPrediction}>ВІДКРИТИ ЗНАК ✦</button>
        </section>
      )}
    </main>
  )
}

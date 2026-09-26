import { useMemo, useState } from 'react'
import { haptic, shareText } from '../services/telegram'
import { todayPrediction } from '../data/predictions'

interface AnonymousPredictionProps { onBack: () => void }

type Step = 'compose' | 'preview' | 'sent'

const ACCESS_KEY = 'mystiq_anonymous_free_started'
const FREE_MS = 24 * 60 * 60 * 1000

function hasFreeAccess() {
  const raw = localStorage.getItem(ACCESS_KEY)
  if (!raw) {
    localStorage.setItem(ACCESS_KEY, String(Date.now()))
    return true
  }
  return Date.now() - Number(raw) < FREE_MS
}

export default function AnonymousPrediction({ onBack }: AnonymousPredictionProps) {
  const [step, setStep] = useState<Step>('compose')
  const [recipient, setRecipient] = useState('')
  const [message, setMessage] = useState('')
  const [free, setFree] = useState(() => hasFreeAccess())
  const [link, setLink] = useState('')

  const expiresText = useMemo(() => {
    const raw = localStorage.getItem(ACCESS_KEY)
    if (!raw) return ''
    const remaining = Math.max(0, FREE_MS - (Date.now() - Number(raw)))
    const hours = Math.floor(remaining / 3600000)
    const minutes = Math.floor((remaining % 3600000) / 60000)
    return `${hours}г ${minutes}хв`
  }, [free])

  const continueFlow = () => {
    if (!recipient.trim()) return
    haptic('light')
    setStep('preview')
  }

  const send = async () => {
    haptic('medium')
    if (!free) {
      // Real Telegram Stars invoice will be connected to backend here.
      alert('Доступ за Stars буде підключено після backend + Telegram Payments.')
      return
    }

    const token = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const payload = { recipient: recipient.trim(), message: message.trim(), predictionId: todayPrediction.title, createdAt: Date.now() }
    localStorage.setItem(`mystiq_anon_${token}`, JSON.stringify(payload))
    const botUsername = 'mystiq_bot'
    const deepLink = `https://t.me/${botUsername}?startapp=anon_${token}`
    setLink(deepLink)
    setStep('sent')
  }

  if (step === 'sent') {
    return (
      <main className="sub-screen anonymous-screen">
        <header className="sub-header">
          <button className="sub-back" onClick={onBack}>←</button>
          <div><div className="sub-title">✦ ВІДПРАВЛЕНО</div><div className="sub-subtitle">АНОНІМНЕ ПЕРЕДБАЧЕННЯ</div></div>
        </header>
        <section className="anonymous-success mystiq-panel">
          <div className="success-orb">✓</div>
          <h1>Готово ✦</h1>
          <p>Посилання створено. Особа відправника не вказується в самому посиланні.</p>
          <button className="primary-button" onClick={() => shareText(`🔮 Тобі надіслали анонімне передбачення MYSTIQ\n\n${link}`)}>↗ ВІДПРАВИТИ ПОСИЛАННЯ</button>
          <button className="secondary-button" onClick={onBack}>ПОВЕРНУТИСЯ</button>
        </section>
      </main>
    )
  }

  return (
    <main className="sub-screen anonymous-screen">
      <header className="sub-header">
        <button className="sub-back" onClick={step === 'compose' ? onBack : () => setStep('compose')}>←</button>
        <div><div className="sub-title">🔮 АНОНІМНЕ ПЕРЕДБАЧЕННЯ</div><div className="sub-subtitle">ДЛЯ КОГОСЬ ОСОБЛИВОГО</div></div>
      </header>

      <section className="anonymous-hero mystiq-panel">
        <div className="anonymous-orb">✦</div>
        <h1>{step === 'compose' ? 'Кому відправити?' : 'Перевір повідомлення'}</h1>
        <p>{step === 'compose' ? 'Отримувач побачить передбачення, але не дізнається, хто його надіслав.' : 'Перед відправкою переконайся, що все виглядає так, як треба.'}</p>
      </section>

      {step === 'compose' ? (
        <section className="anonymous-form mystiq-panel">
          <div className="free-access">{free ? `✦ FREE · залишилось приблизно ${expiresText}` : '⭐ FREE завершено · доступ за Stars'}</div>
          <label>КОМУ ВІДПРАВИТИ</label>
          <input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="@username" autoComplete="off" />
          <label>ТЕКСТ ВІД ТЕБЕ · НЕОБОВʼЯЗКОВО</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value.slice(0, 300))} placeholder="Напиши щось від себе..." rows={5} />
          <div className="char-count">{message.length}/300</div>
          <button className="primary-button" onClick={continueFlow} disabled={!recipient.trim()}>ПРОДОВЖИТИ ✦</button>
        </section>
      ) : (
        <section className="anonymous-form mystiq-panel">
          <div className="preview-line"><small>ДЛЯ</small><strong>{recipient}</strong></div>
          {message && <div className="preview-line"><small>ТВОЄ ПОВІДОМЛЕННЯ</small><p>{message}</p></div>}
          <div className="preview-card-lock"><span>🔮</span><small>ПЕРЕДБАЧЕННЯ MYSTIQ</small><p>Передбачення відкриється отримувачу після переходу за персональним посиланням.</p></div>
          <button className="primary-button" onClick={send}>{free ? 'ВІДПРАВИТИ АНОНІМНО ✦' : '⭐ ВІДКРИТИ ЗА STARS'}</button>
        </section>
      )}
    </main>
  )
}

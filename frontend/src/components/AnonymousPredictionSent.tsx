import { useState } from 'react'
import { haptic } from '../services/telegram'

interface Props { deepLink: string; shareUrl: string; onDone:()=>void }
export default function AnonymousPredictionSent({deepLink,shareUrl,onDone}:Props){
  const [copied,setCopied]=useState(false)
  const share=()=>{ window.Telegram?.WebApp?.openTelegramLink?.(shareUrl); haptic('light') }
  const copy=async()=>{ try{ await navigator.clipboard.writeText(deepLink); setCopied(true); setTimeout(()=>setCopied(false),1600) }catch{} }
  return <main className="anonymous-preview-screen"><section className="anonymous-preview-card anonymous-sent-card">
    <div className="anonymous-preview-lock">✦</div><h1>Готово</h1>
    <p>Анонімне передбачення створено. Передай це посилання отримувачу.</p>
    <button className="anonymous-continue-button" onClick={share}>↗ ВІДПРАВИТИ В TELEGRAM</button>
    <button className="anonymous-copy-button" onClick={copy}>{copied?'СКОПІЙОВАНО':'КОПІЮВАТИ ПОСИЛАННЯ'}</button>
    <button className="anonymous-back-link" onClick={onDone}>ПОВЕРНУТИСЯ</button>
  </section></main>
}

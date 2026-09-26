import { useState } from 'react'
import { haptic } from '../services/telegram'

interface ShopProps {
  onBack: () => void
}

type Product = {
  id: string
  icon: string
  title: string
  description: string
  price: number
  badge?: string
}

const products: Product[] = [
  { id: 'pro7', icon: '✦', title: 'MYSTIQ PRO · 7 днів', description: 'Розширені передбачення та premium-функції.', price: 49, badge: 'POPULAR' },
  { id: 'feelings', icon: '💜', title: 'Колода «Почуття»', description: 'Особлива серія передбачень про стосунки.', price: 25 },
  { id: 'moon', icon: '🌙', title: 'Тема «Місячна ніч»', description: 'Нове оформлення для твого MYSTIQ.', price: 15 },
  { id: 'gift', icon: '🎁', title: 'Таємний подарунок', description: 'Відправ особливе анонімне послання.', price: 20 },
]

export default function Shop({ onBack }: ShopProps) {
  const [selected, setSelected] = useState<Product | null>(null)
  const [purchased, setPurchased] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('mystiq_shop_purchases') || '[]') } catch { return [] }
  })

  const buy = (product: Product) => {
    haptic('medium')
    const next = Array.from(new Set([...purchased, product.id]))
    setPurchased(next)
    localStorage.setItem('mystiq_shop_purchases', JSON.stringify(next))
    setSelected(null)
  }

  return (
    <main className="sub-screen shop-screen">
      <header className="sub-header">
        <button className="sub-back" onClick={onBack} aria-label="Назад">←</button>
        <div>
          <div className="sub-title">✦ MYSTIQ SHOP</div>
          <div className="sub-subtitle">ОБЕРИ ЩОСЬ ДЛЯ СЕБЕ</div>
        </div>
      </header>

      <section className="shop-hero mystiq-panel">
        <div className="shop-hero-orb">✦</div>
        <h1>Твій MYSTIQ</h1>
        <p>Premium-карти, теми та подарунки.</p>
        <div className="stars-balance">⭐ Stars · підготовлено до Telegram Payments</div>
      </section>

      <section className="shop-grid">
        {products.map((product) => {
          const isPurchased = purchased.includes(product.id)
          return (
            <article className="shop-product" key={product.id}>
              {product.badge && <span className="shop-badge">{product.badge}</span>}
              <div className="shop-product-icon">{product.icon}</div>
              <h2>{product.title}</h2>
              <p>{product.description}</p>
              <button
                className="shop-buy"
                onClick={() => setSelected(product)}
                disabled={isPurchased}
              >
                {isPurchased ? '✓ КУПЛЕНО' : `⭐ ${product.price}`}
              </button>
            </article>
          )
        })}
      </section>

      {selected && (
        <div className="shop-modal-backdrop" onClick={() => setSelected(null)}>
          <div className="shop-modal" onClick={(event) => event.stopPropagation()}>
            <div className="shop-modal-icon">{selected.icon}</div>
            <h2>{selected.title}</h2>
            <p>{selected.description}</p>
            <button className="shop-confirm" onClick={() => buy(selected)}>
              ⭐ ОПЛАТИТИ {selected.price} STARS
            </button>
            <button className="shop-cancel" onClick={() => setSelected(null)}>Скасувати</button>
          </div>
        </div>
      )}
    </main>
  )
}

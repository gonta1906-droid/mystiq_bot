import { useEffect, useState } from 'react'
import './App.css'
import './ProfileGifts.css'

import Splash from './pages/Splash'
import Home from './pages/Home'
import Prediction from './pages/Prediction'
import Profile from './pages/Profile'
import Gifts from './pages/Gifts'
import History from './pages/History'
import Shop from './pages/Shop'
import AnonymousPrediction from './pages/AnonymousPrediction'
import { initTelegram, setTelegramBackButton } from './services/telegram'

type Page = 'splash' | 'home' | 'prediction' | 'profile' | 'gifts' | 'history' | 'shop' | 'anonymous'

function App() {
  const [page, setPage] = useState<Page>('home')

  useEffect(() => {
    initTelegram()
  }, [])

  useEffect(() => {
    if (page === 'home') {
      setTelegramBackButton(null)
      return
    }

    setTelegramBackButton(() => setPage('home'))

    return () => setTelegramBackButton(null)
  }, [page])

  if (page === 'splash') return <Splash />

  if (page === 'prediction') {
    return <Prediction onBack={() => setPage('home')} />
  }

  if (page === 'profile') {
    return (
      <Profile
        onBack={() => setPage('home')}
        onHistory={() => setPage('history')}
        onGifts={() => setPage('gifts')}
      />
    )
  }

  if (page === 'gifts') {
    return <Gifts onBack={() => setPage('profile')} />
  }

  if (page === 'history') {
    return <History onBack={() => setPage('profile')} onOpenPrediction={() => setPage('prediction')} />
  }

  if (page === 'shop') {
    return <Shop onBack={() => setPage('home')} />
  }

  if (page === 'anonymous') {
    return <AnonymousPrediction onBack={() => setPage('home')} />
  }

  return (
    <Home
      onOpenPrediction={() => setPage('prediction')}
      onOpenProfile={() => setPage('profile')}
      onOpenShop={() => setPage('shop')}
      onOpenAnonymous={() => setPage('anonymous')}
    />
  )
}

export default App

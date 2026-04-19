import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminGuests from './pages/AdminGuests.jsx'
import { getToken } from './lib/auth.js'
import NeuralBackground from './components/NeuralBackground.jsx'

function ProtectedRoute({ children }) {
  const token = getToken()
  if (!token) return <Navigate to="/admin" replace />
  return children
}

export default function App() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches
    const next = saved ? saved === 'dark' : Boolean(prefersDark)
    document.documentElement.classList.toggle('dark', next)
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative min-h-screen bg-premium noise-overlay overflow-hidden">
      <NeuralBackground className="opacity-90" intensity={1} />
      <header className="max-w-6xl mx-auto px-4 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-white/70">
            <span className="font-semibold text-white">RSVP</span>
            <span className="mx-2 text-white/30">•</span>
            <span className="text-white/70">Invite</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-16">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/guests" element={<ProtectedRoute><AdminGuests /></ProtectedRoute>} />
        </Routes>
      </main>
      {/* Footer removed as requested */}
    </div>
  )
}

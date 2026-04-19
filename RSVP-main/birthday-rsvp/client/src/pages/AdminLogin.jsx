import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api.js'
import { setToken } from '../lib/auth.js'
import Toast from '../components/Toast.jsx'
import Card from '../components/Card.jsx'

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { data } = await api.post('/login', form)
      setToken(data.token)
      setToast({ type: 'success', message: 'Logged in' })
      navigate('/admin/guests', { replace: true })
    } catch (e) {
      setToast({ type: 'error', message: 'Invalid credentials' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-10">
      <Card className="max-w-md">
      <h1 className="text-2xl font-semibold mb-1 text-white">Admin Login</h1>
      <p className="text-sm text-white/60 mb-5">Sign in to view guest responses.</p>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1 text-white/80" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white/90 placeholder:text-white/40 outline-none backdrop-blur-sm transition hover:bg-white/10 focus:border-brand-300/60 focus:ring-4 focus:ring-brand-400/20"
            value={form.email}
            onChange={e=>setForm(f=>({...f,email:e.target.value}))}
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-white/80" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white/90 placeholder:text-white/40 outline-none backdrop-blur-sm transition hover:bg-white/10 focus:border-brand-300/60 focus:ring-4 focus:ring-brand-400/20"
            value={form.password}
            onChange={e=>setForm(f=>({...f,password:e.target.value}))}
            required
          />
        </div>
        <button
          disabled={loading}
          className="inline-flex items-center justify-center rounded-xl bg-brand-500 px-4 py-2.5 font-semibold text-white shadow-[0_14px_34px_rgba(10,132,255,0.25)] hover:bg-brand-400 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-brand-300/60"
        >
          {loading?'Logging in...':'Login'}
        </button>
      </form>
      {toast && <Toast {...toast} onClose={()=>setToast(null)} />}
      </Card>
    </div>
  )
}

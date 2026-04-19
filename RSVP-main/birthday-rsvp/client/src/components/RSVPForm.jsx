import React, { useState } from 'react'
import AttendingToggle from './AttendingToggle'
import { TextInput, TextArea } from './NeoInputs'
import api from '../lib/api.js'
import Toast from './Toast.jsx'
import ThankYouLoader from './ThankYouLoader.jsx'

export default function RSVPForm() {
  const [form, setForm] = useState({ name: '', attending: true, message: '' })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [result, setResult] = useState(null)
  const [showThankYou, setShowThankYou] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setToast({ type: 'error', message: 'Name is required' }); return }
    if (form.message.length > 300) { setToast({ type: 'error', message: 'Message too long' }); return }
    try {
      setLoading(true)
      const payload = { name: form.name, attending: Boolean(form.attending), message: form.message }
      await api.post('/rsvp', payload)
      setResult({ attending: payload.attending })
      setToast({ type: 'success', message: 'RSVP submitted!' })
      // Show thank-you loader screen until user refreshes
      setShowThankYou(true)
      setForm({ name: '', attending: true, message: '' })
    } catch (e) {
      setToast({ type: 'error', message: 'Submission failed' })
    } finally {
      setLoading(false)
    }
  }

  if (showThankYou) {
    return <ThankYouLoader />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm mb-1 text-white/80" htmlFor="name">Name <span className="text-white/50">*</span></label>
        <TextInput
          id="name"
          placeholder="Your full name"
          value={form.name}
          onChange={e=>setForm(f=>({...f,name:e.target.value}))}
          required
          maxLength={80}
        />
      </div>
      <div>
        <span className="block text-sm mb-1 text-white/80">Attending?</span>
        <div className="flex items-center">
          <AttendingToggle value={!!form.attending} onChange={(v)=>setForm(f=>({...f, attending: v}))} />
        </div>
      </div>
      <div>
        <label className="block text-sm mb-1 text-white/80" htmlFor="message">Message</label>
        <TextArea
          id="message"
          placeholder="Optional note…"
          value={form.message}
          onChange={e=>setForm(f=>({...f,message:e.target.value}))}
          maxLength={300}
          rows={3}
        />
        <div className="text-xs text-white/45 mt-1">{form.message.length}/300</div>
      </div>
      <button
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-brand-500 hover:bg-brand-400 shadow-[0_14px_34px_rgba(10,132,255,0.25)] disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-brand-300/60"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
      {toast && <Toast {...toast} onClose={()=>setToast(null)} />}
    </form>
  )
}

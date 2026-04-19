import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'

function format(seconds) {
  const s = Math.max(0, seconds)
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const pad = (n) => String(n).padStart(2, '0')
  return { d, h: pad(h), m: pad(m), s: pad(sec) }
}

export default function Countdown() {
  const target = new Date(import.meta.env.VITE_EVENT_DATE_ISO || '2026-05-11T20:30:00+05:30')
  const [left, setLeft] = useState(() => Math.max(0, differenceInSeconds(target, new Date())))
  useEffect(() => {
    const id = setInterval(() => setLeft(Math.max(0, differenceInSeconds(target, new Date()))), 1000)
    return () => clearInterval(id)
  }, [])
  const f = format(left)
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center tabular-nums">
      <div className="rounded-xl border border-white/10 bg-white/5 px-2 py-3">
        <div className="text-2xl sm:text-3xl font-semibold text-white">{f.d}</div>
        <div className="mt-1 text-[11px] uppercase tracking-wider text-white/55">Days</div>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 px-2 py-3">
        <div className="text-2xl sm:text-3xl font-semibold text-white">{f.h}</div>
        <div className="mt-1 text-[11px] uppercase tracking-wider text-white/55">Hours</div>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 px-2 py-3">
        <div className="text-2xl sm:text-3xl font-semibold text-white">{f.m}</div>
        <div className="mt-1 text-[11px] uppercase tracking-wider text-white/55">Minutes</div>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 px-2 py-3">
        <div className="text-2xl sm:text-3xl font-semibold text-white">{f.s}</div>
        <div className="mt-1 text-[11px] uppercase tracking-wider text-white/55">Seconds</div>
      </div>
    </div>
  )
}

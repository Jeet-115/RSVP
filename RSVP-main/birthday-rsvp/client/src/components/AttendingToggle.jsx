import React, { useId } from 'react'

export default function AttendingToggle({ value = true, onChange }) {
  const id = useId()
  const yesId = `${id}-attending-yes`
  const noId = `${id}-attending-no`

  return (
    <div className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur-sm">
      <button
        type="button"
        id={yesId}
        aria-pressed={!!value}
        onClick={() => onChange?.(true)}
        className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-300/60 ${
          value
            ? 'bg-emerald-500/20 text-emerald-50 shadow-[0_10px_24px_rgba(16,185,129,0.16)]'
            : 'text-white/70 hover:bg-white/5'
        }`}
      >
        <span className="text-base leading-none">✓</span>
        <span>Attending</span>
      </button>

      <button
        type="button"
        id={noId}
        aria-pressed={!value}
        onClick={() => onChange?.(false)}
        className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-300/60 ${
          !value
            ? 'bg-rose-500/20 text-rose-50 shadow-[0_10px_24px_rgba(244,63,94,0.14)]'
            : 'text-white/70 hover:bg-white/5'
        }`}
      >
        <span className="text-base leading-none">✕</span>
        <span>Not attending</span>
      </button>
    </div>
  )
}

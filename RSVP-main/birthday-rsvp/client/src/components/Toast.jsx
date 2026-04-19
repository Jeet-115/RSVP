import { useEffect } from 'react'

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(() => onClose?.(), 2500)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl border px-4 py-2.5 text-sm font-medium shadow-2xl backdrop-blur ${
        type === 'success'
          ? 'border-emerald-300/20 bg-emerald-500/15 text-emerald-50'
          : 'border-rose-300/20 bg-rose-500/15 text-rose-50'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-base leading-none">{type === 'success' ? '✓' : '!'}</span>
        <span>{message}</span>
      </div>
    </div>
  )
}

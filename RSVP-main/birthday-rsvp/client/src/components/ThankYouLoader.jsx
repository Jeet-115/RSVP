import React from 'react'
import { createPortal } from 'react-dom'

export default function ThankYouLoader() {
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex min-h-dvh items-center justify-center bg-ink-950/85 px-4"
      aria-live="polite"
      aria-label="Thank you screen"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-white/8 p-8 text-center text-white shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="pointer-events-none absolute -top-20 -left-16 h-44 w-44 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 -bottom-20 h-48 w-48 rounded-full bg-accentPurple/20 blur-3xl" />

        <div className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400/15 text-2xl text-emerald-50">
          ✓
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight">Thank you!</h2>
        <p className="mt-3 text-sm sm:text-base text-white/70">
          Your RSVP has been received successfully.
        </p>
        <p className="mt-1 text-xs sm:text-sm text-white/50">
          You can close this page or refresh if you want to submit another response.
        </p>

        <div className="mt-6 flex items-center justify-center gap-2" aria-hidden="true">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-300/80" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/70 [animation-delay:140ms]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accentPurple/80 [animation-delay:280ms]" />
        </div>
      </div>
    </div>,
    document.body
  )
}

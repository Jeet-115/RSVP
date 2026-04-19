import Countdown from '../components/Countdown.jsx'
import MapEmbed from '../components/MapEmbed.jsx'
import RSVPForm from '../components/RSVPForm.jsx'
import Card from '../components/Card.jsx'

export default function Landing() {
  const title = import.meta.env.VITE_EVENT_TITLE || ''
  const when = import.meta.env.VITE_EVENT_DATE_ISO || ''
  const where = import.meta.env.VITE_EVENT_ADDRESS || ''

  return (
    <div className="fade-in">
      <section className="pt-6 sm:pt-10 pb-8 sm:pb-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/70 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-brand-400 shadow-[0_0_0_4px_rgba(58,167,255,0.12)]" />
            <span>Invitation</span>
            {when && (
              <>
                <span className="text-white/30">•</span>
                <span>{new Date(when).toLocaleDateString()}</span>
              </>
            )}
          </div>

          <h1 className="mt-5 text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            {title || "You're invited"}
          </h1>

          {when && (
            <p className="mt-3 text-base sm:text-lg text-white/70">
              {new Date(when).toLocaleString()}
            </p>
          )}

          {where && (
            <p className="mt-2 text-sm sm:text-base text-white/65">
              <span className="text-white/50">Venue:</span> {where}
            </p>
          )}

          <div className="mt-8">
            <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm">
              <div className="text-xs font-medium text-white/60 mb-2">Countdown</div>
              <Countdown />
            </div>
          </div>
        </div>
      </section>

      {/* Top map removed; map shown inside RSVP card only */}

      <Card>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white">RSVP</h2>
            <p className="mt-1 text-sm text-white/60">
              Let us know if you’re coming — it only takes a few seconds.
            </p>
          </div>
        </div>
        <div className="mb-4">
          <MapEmbed
            className="rounded-xl"
          />
        </div>
        <RSVPForm />
      </Card>
    </div>
  )
}

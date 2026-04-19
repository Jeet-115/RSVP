export default function MapEmbed({ src: propSrc, href, query, className = '' }) {
  const envSrc = import.meta.env.VITE_MAPS_EMBED_SRC || ''
  // If a query is provided, prefer using it for a stable Maps embed
  const fromQuery = query ? `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed` : ''
  // If href is a direct Google Maps link, we can still derive from it; otherwise don't force Earth links into embed
  const isMapsHref = href && (href.includes('google.com/maps') || href.includes('maps.app.goo.gl'))
  const fromHref = isMapsHref ? `https://www.google.com/maps?q=${encodeURIComponent(href)}&output=embed` : ''
  const src = propSrc || fromQuery || fromHref || envSrc
  if (!src) return null
  const Inner = (
    <div className={`relative w-full aspect-[4/3] md:aspect-video rounded-xl overflow-hidden shadow-md border border-slate-700 bg-slate-900/30 backdrop-blur-sm hover:ring-2 hover:ring-cyan-500/30 hover:shadow-cyan-500/10 transition ${className}`}>
      <iframe
        title="Google Maps"
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  )
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Open location in Maps/Earth">
        {Inner}
      </a>
    )
  }
  return Inner
}

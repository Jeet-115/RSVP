import { useEffect, useMemo, useRef } from 'react'

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n))
}

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
}

function rand(seed) {
  // Mulberry32
  let t = seed >>> 0
  return () => {
    t += 0x6D2B79F5
    let x = Math.imul(t ^ (t >>> 15), 1 | t)
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

export default function NeuralBackground({
  className = '',
  intensity = 1,
}) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, active: false })
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 })

  const seed = useMemo(() => {
    // stable per tab load, randomized
    return (Date.now() ^ (Math.random() * 1e9)) | 0
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true })
    if (!ctx) return

    const reduced = prefersReducedMotion()
    const rng = rand(seed)

    const nodes = []
    const links = []

    const config = {
      // tuned for “premium subtle”, not busy
      nodeCount: clamp(Math.round(70 * intensity), 40, 120),
      linkDist: 150,
      linkMax: 3,
      speed: 0.22 * intensity,
      mouseRadius: 170,
    }

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const dpr = clamp(window.devicePixelRatio || 1, 1, 2)
      sizeRef.current = { w: rect.width, h: rect.height, dpr }
      canvas.width = Math.floor(rect.width * dpr)
      canvas.height = Math.floor(rect.height * dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const init = () => {
      nodes.length = 0
      links.length = 0
      const { w, h } = sizeRef.current
      for (let i = 0; i < config.nodeCount; i++) {
        const x = rng() * w
        const y = rng() * h
        const a = rng() * Math.PI * 2
        const s = (0.25 + rng() * 0.85) * config.speed
        nodes.push({
          x,
          y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          r: 1.1 + rng() * 1.6,
          p: 0.35 + rng() * 0.65, // “power” for glow
        })
      }
    }

    const recomputeLinks = () => {
      links.length = 0
      const { w, h } = sizeRef.current
      const dist = config.linkDist
      for (let i = 0; i < nodes.length; i++) {
        let count = 0
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < dist * dist) {
            links.push([i, j, Math.sqrt(d2)])
            count++
            if (count >= config.linkMax) break
          }
        }
      }
    }

    const onMove = (e) => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const m = mouseRef.current
      const nx = clamp(mx, 0, rect.width)
      const ny = clamp(my, 0, rect.height)
      m.vx = nx - m.x
      m.vy = ny - m.y
      m.x = nx
      m.y = ny
      m.active = true
    }

    const onLeave = () => {
      mouseRef.current.active = false
    }

    resize()
    init()
    recomputeLinks()

    const ro = new ResizeObserver(() => {
      resize()
      init()
      recomputeLinks()
    })
    ro.observe(canvas.parentElement || canvas)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseleave', onLeave, { passive: true })

    let last = performance.now()
    let linkTick = 0

    const draw = (t) => {
      rafRef.current = requestAnimationFrame(draw)
      const { w, h } = sizeRef.current
      if (!w || !h) return

      // throttle link recompute for perf (and “organic” feel)
      linkTick++
      if (linkTick % 14 === 0) recomputeLinks()

      const dt = clamp((t - last) / 16.67, 0.5, 2)
      last = t

      ctx.clearRect(0, 0, w, h)

      // soft vignette
      const g = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, Math.max(w, h) * 0.7)
      g.addColorStop(0, 'rgba(255,255,255,0.05)')
      g.addColorStop(1, 'rgba(0,0,0,0.20)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      const m = mouseRef.current
      const mx = m.x
      const my = m.y
      const mr = config.mouseRadius

      // update nodes
      for (const n of nodes) {
        if (!reduced) {
          n.x += n.vx * dt
          n.y += n.vy * dt
        }

        // wrap edges (smooth looping)
        if (n.x < -30) n.x = w + 30
        if (n.x > w + 30) n.x = -30
        if (n.y < -30) n.y = h + 30
        if (n.y > h + 30) n.y = -30

        if (m.active) {
          const dx = n.x - mx
          const dy = n.y - my
          const d2 = dx * dx + dy * dy
          if (d2 < mr * mr) {
            const d = Math.sqrt(d2) || 1
            const pull = (1 - d / mr) * 0.18 * intensity
            n.x += (m.vx * 0.02 - dx / d) * pull
            n.y += (m.vy * 0.02 - dy / d) * pull
          }
        }
      }

      // links
      ctx.lineWidth = 1
      for (const [ia, ib, d] of links) {
        const a = nodes[ia]
        const b = nodes[ib]
        const alpha = clamp(1 - d / config.linkDist, 0, 1) * 0.45
        // gradient-ish line color: brand -> purple
        ctx.strokeStyle = `rgba(58,167,255,${alpha * 0.55})`
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }

      // nodes (tiny glow)
      for (const n of nodes) {
        const glow = 0.18 + 0.55 * n.p
        ctx.fillStyle = `rgba(255,255,255,${glow * 0.35})`
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `rgba(10,132,255,${glow * 0.18})`
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * 2.2, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [seed, intensity])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  )
}


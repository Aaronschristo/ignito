/**
 * StarfieldBackground.jsx
 * Canvas-based animated starfield — no image files (per §7).
 * Respects prefers-reduced-motion: renders static stars when reduced.
 */
import { useEffect, useRef } from 'react'

const STAR_COUNT = 220

function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

function initStars(canvas) {
  return Array.from({ length: STAR_COUNT }, () => ({
    x: randomBetween(0, canvas.width),
    y: randomBetween(0, canvas.height),
    radius: randomBetween(0.3, 1.6),
    alpha: randomBetween(0.3, 1),
    delta: randomBetween(0.003, 0.012) * (Math.random() > 0.5 ? 1 : -1),
    speed: randomBetween(0.05, 0.2),
  }))
}

export function StarfieldBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let animId
    let stars = []

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      stars = initStars(canvas)
    }

    function drawStars() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const star of stars) {
        if (!prefersReduced) {
          star.alpha += star.delta
          if (star.alpha <= 0.2 || star.alpha >= 1) star.delta *= -1
          star.alpha = Math.max(0.2, Math.min(1, star.alpha))
        }

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`
        ctx.fill()
      }
    }

    function tick() {
      drawStars()
      if (!prefersReduced) {
        animId = requestAnimationFrame(tick)
      }
    }

    resize()
    window.addEventListener('resize', resize)
    tick()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}

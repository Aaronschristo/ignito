/**
 * StarfieldBackground.jsx
 * Canvas-based perspective starfield — no image files (per §7).
 * Stars approach the viewer from a central vanishing point and become static
 * when the user prefers reduced motion.
 */
import { useEffect, useRef } from 'react'

const MIN_STAR_COUNT = 100
const MAX_STAR_COUNT = 300
const NEAR_PLANE = 0.06

function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

function createStar(atFarPlane = false) {
  const colorRoll = Math.random()

  return {
    x: randomBetween(-1.05, 1.05),
    y: randomBetween(-1.05, 1.05),
    depth: atFarPlane ? 1 : randomBetween(NEAR_PLANE, 1),
    speed: randomBetween(0.018, 0.04),
    size: randomBetween(0.55, 1.25),
    color: colorRoll > 0.94 ? 'green' : colorRoll > 0.84 ? 'blue' : 'primary',
  }
}

function initStars(width, height) {
  const count = Math.min(
    MAX_STAR_COUNT,
    Math.max(MIN_STAR_COUNT, Math.round((width * height) / 6500)),
  )

  return Array.from({ length: count }, () => createStar())
}

function project(star, width, height, depth = star.depth) {
  return {
    x: width / 2 + (star.x / depth) * (width / 2),
    y: height / 2 + (star.y / depth) * (height / 2),
  }
}

export function StarfieldBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const rootStyles = getComputedStyle(document.documentElement)
    const colors = {
      primary: rootStyles.getPropertyValue('--color-text-primary').trim(),
      blue: rootStyles.getPropertyValue('--color-nebula-blue').trim(),
      green: rootStyles.getPropertyValue('--color-nebula-green').trim(),
    }

    let width = 0
    let height = 0
    let stars = []
    let animId
    let lastTime
    let prefersReduced = motionPreference.matches

    function resize() {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      stars = initStars(width, height)
      draw(0)
    }

    function resetStar(star) {
      Object.assign(star, createStar(true))
    }

    function draw(elapsed) {
      ctx.clearRect(0, 0, width, height)

      for (const star of stars) {
        if (!prefersReduced) star.depth -= star.speed * elapsed

        const position = project(star, width, height)
        const outsideViewport = position.x < -24
          || position.x > width + 24
          || position.y < -24
          || position.y > height + 24

        if (star.depth <= NEAR_PLANE || outsideViewport) {
          resetStar(star)
          continue
        }

        const proximity = 1 - star.depth
        const radius = star.size * (0.45 + proximity * 1.8)
        const alpha = 0.3 + proximity * 0.7

        if (!prefersReduced && proximity > 0.18) {
          const tail = project(star, width, height, Math.min(1, star.depth + 0.014))
          ctx.beginPath()
          ctx.moveTo(tail.x, tail.y)
          ctx.lineTo(position.x, position.y)
          ctx.strokeStyle = colors[star.color]
          ctx.globalAlpha = alpha * 0.42
          ctx.lineWidth = Math.max(0.35, radius * 0.42)
          ctx.stroke()
        }

        ctx.beginPath()
        ctx.arc(position.x, position.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = colors[star.color]
        ctx.globalAlpha = alpha
        ctx.fill()
      }

      ctx.globalAlpha = 1
    }

    function tick(time) {
      const elapsed = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0
      lastTime = time
      draw(elapsed)
      animId = requestAnimationFrame(tick)
    }

    function handleMotionPreference(event) {
      prefersReduced = event.matches
      cancelAnimationFrame(animId)
      lastTime = undefined

      if (prefersReduced) draw(0)
      else animId = requestAnimationFrame(tick)
    }

    resize()
    window.addEventListener('resize', resize)
    motionPreference.addEventListener('change', handleMotionPreference)

    if (!prefersReduced) animId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      motionPreference.removeEventListener('change', handleMotionPreference)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full pointer-events-none"
      aria-hidden="true"
    />
  )
}

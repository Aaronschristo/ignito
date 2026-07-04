/**
 * Hero.jsx
 * Full-viewport hero: starfield, display heading, countdown timer, CTAs, scroll indicator.
 * Parallax on heading via framer-motion useScroll.
 */
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, Rocket, Zap } from 'lucide-react'
import { StarfieldBackground } from '../ui/StarfieldBackground'
import { CountdownTimer } from '../ui/CountdownTimer'
import { Button } from '../ui/Button'

export function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Starfield canvas */}
      <StarfieldBackground />

      {/* Deep-space radial gradient overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(139,92,246,0.18),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(251,146,60,0.08),transparent)]" />

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto"
      >
        {/* Pre-title badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-nebula-violet/30 bg-nebula-violet/8 backdrop-blur-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-ignition-flame animate-pulse" />
          <span className="font-body text-xs font-semibold text-text-muted tracking-widest uppercase">
            Techfest 2027 — Mission Control Online
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="font-display font-bold leading-[1.05] tracking-tight"
        >
          <span className="block text-5xl sm:text-7xl lg:text-8xl text-text-primary">
            IGNITE
          </span>
          <span className="block text-5xl sm:text-7xl lg:text-8xl bg-gradient-to-r from-ignition-flame via-ignition-glow to-nebula-violet bg-clip-text text-transparent">
            THE FUTURE.
          </span>
        </motion.h1>

        {/* Sub-heading */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-6 font-body text-base sm:text-lg lg:text-xl text-text-muted max-w-2xl leading-relaxed"
        >
          Where engineers launch ideas, coders crack missions, and innovators redefine what's possible. Welcome to{' '}
          <span className="text-text-primary font-semibold">IGNITO</span> — the premier techfest.
        </motion.p>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <p className="font-body text-xs font-medium tracking-[0.2em] uppercase text-nebula-blue">
            T-minus to liftoff
          </p>
          <CountdownTimer />
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button variant="primary" onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}>
            <Rocket size={16} strokeWidth={2} />
            Explore Missions
          </Button>
          <Button variant="secondary" onClick={() => document.getElementById('competitions')?.scrollIntoView({ behavior: 'smooth' })}>
            <Zap size={16} strokeWidth={2} />
            View Competitions
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-text-faint hover:text-text-muted transition-colors"
        aria-label="Scroll down"
      >
        <span className="font-body text-[10px] tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} strokeWidth={1.5} />
        </motion.div>
      </motion.a>
    </section>
  )
}

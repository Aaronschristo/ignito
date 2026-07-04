/**
 * About.jsx
 * 2–3 line description of IGNITO + animated stat counters.
 * Counters increment from 0 when scrolled into view.
 */
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { SectionHeading } from '../ui/SectionHeading'
import { Orbit } from 'lucide-react'

const STATS = [
  { value: 500, suffix: '+', label: 'Participants' },
  { value: 20, suffix: '+', label: 'Events & Missions' },
  { value: 1, prefix: '₹', suffix: 'L+', label: 'Prize Pool' },
  { value: 3, suffix: ' Days', label: 'Of Innovation' },
]

function AnimatedCounter({ value, prefix = '', suffix = '', duration = 1500 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!inView) return
    if (prefersReduced) { setCount(value); return }

    let start = 0
    const step = value / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [inView, value, duration, prefersReduced])

  return (
    <span ref={ref} className="font-display text-4xl sm:text-5xl font-bold text-text-primary tabular-nums">
      {prefix}{count}{suffix}
    </span>
  )
}

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32 bg-space-bg overflow-hidden">
      {/* Subtle violet glow top */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-nebula-green/40 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-nebula-green/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          overline="Our Mission"
          title="What is IGNITO?"
          subtitle="IGNITO is more than a techfest — it's a launchpad. Every year, hundreds of students, engineers, and innovators converge to compete, collaborate, and push the boundaries of technology."
        />

        {/* Additional description */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 max-w-3xl mx-auto text-center"
        >
          <p className="font-body text-text-muted text-base sm:text-lg leading-relaxed">
            From hands-on workshops and electrifying hackathons to competitive robotics and groundbreaking talks — IGNITO delivers the full spectrum of technical excellence. Join the mission. Ignite your future.
          </p>
        </motion.div>

        {/* Orbit divider */}
        <div className="flex items-center justify-center my-12 gap-3">
          <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-space-border" />
          <Orbit size={18} className="text-nebula-green" strokeWidth={1.5} />
          <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-space-border" />
        </div>

        {/* Stat counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {STATS.map(({ value, prefix, suffix, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-space-surface/50 border border-space-border backdrop-blur-sm"
            >
              <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
              <span className="font-body text-sm text-text-muted mt-2 font-medium">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

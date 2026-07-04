/**
 * App.jsx
 * Root component — wires all sections together.
 * Ignition countdown loading state (T-minus 3…2…1…Liftoff).
 * Wrapped in AuthProvider for auth state across all components.
 */
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { AuthModal } from './components/ui/AuthModal'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { About } from './components/sections/About'
import { Events } from './components/sections/Events'
import { Competitions } from './components/sections/Competitions'
import { Contact } from './components/sections/Contact'

// ── Ignition loader ──────────────────────────────────────────
const SEQUENCE = ['T-minus 3', 'T-minus 2', 'T-minus 1', 'LIFTOFF 🚀']

function IgnitionLoader({ onComplete }) {
  const [step, setStep] = useState(0)
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (prefersReduced) { onComplete(); return }

    if (step < SEQUENCE.length - 1) {
      const t = setTimeout(() => setStep((s) => s + 1), step === SEQUENCE.length - 2 ? 900 : 700)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(onComplete, 700)
      return () => clearTimeout(t)
    }
  }, [step, onComplete, prefersReduced])

  return (
    <motion.div
      key="loader"
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-space-bg flex flex-col items-center justify-center gap-6"
    >
      {/* Glow rings */}
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.15, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
          className="absolute w-32 h-32 rounded-full bg-ignition-flame/20 blur-xl"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          className="w-16 h-16 rounded-full border-2 border-dashed border-ignition-flame/40"
        />
        <span className="absolute text-2xl">🚀</span>
      </div>

      {/* Countdown text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 1.05 }}
          transition={{ duration: 0.35 }}
          className={[
            'font-display font-bold tracking-wide',
            step === SEQUENCE.length - 1
              ? 'text-4xl text-ignition-flame'
              : 'text-2xl text-text-muted',
          ].join(' ')}
        >
          {SEQUENCE[step]}
        </motion.p>
      </AnimatePresence>

      <p className="font-body text-xs text-text-faint tracking-widest uppercase">
        Igniting IGNITO…
      </p>
    </motion.div>
  )
}

// ── App ──────────────────────────────────────────────────────
export default function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <AuthProvider>
      <div className="min-h-screen bg-space-bg text-text-primary font-body">
        <AnimatePresence mode="wait">
          {!loaded ? (
            <IgnitionLoader key="loader" onComplete={() => setLoaded(true)} />
          ) : (
            <motion.div
              key="site"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Navbar />
              <main>
                <Hero />
                <About />
                <Events />
                <Competitions />
                <Contact />
              </main>
              <Footer />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auth modal — always rendered so it can appear over any page state */}
        <AuthModal />
      </div>
    </AuthProvider>
  )
}

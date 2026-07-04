/**
 * Navbar.jsx
 * Sticky glassmorphism navbar with desktop anchor links and mobile slide-in drawer.
 * Highlights active section via IntersectionObserver.
 */
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Events', href: '#events' },
  { label: 'Competitions', href: '#competitions' },
  { label: 'Contact', href: '#contact' },
]

const SECTION_IDS = ['home', 'about', 'events', 'competitions', 'contact']

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeId, setActiveId] = useState('home')
  const [scrolled, setScrolled] = useState(false)

  // Highlight active section
  useEffect(() => {
    const observers = []

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id)
        },
        { rootMargin: '-40% 0px -55% 0px' },
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  // Shrink navbar on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLinkClick = () => setMenuOpen(false)

  return (
    <>
      <nav
        className={[
          'fixed top-0 inset-x-0 z-50',
          'transition-all duration-300',
          scrolled
            ? 'bg-space-bg/80 backdrop-blur-xl border-b border-space-border/60 py-3'
            : 'bg-transparent py-5',
        ].join(' ')}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 20, scale: 1.15 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <Rocket
                size={22}
                className="text-ignition-flame"
                strokeWidth={2}
              />
            </motion.div>
            <span className="font-display text-xl font-bold text-text-primary tracking-wide">
              IGNITO
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => {
              const id = href.slice(1)
              const isActive = activeId === id
              return (
                <li key={href}>
                  <a
                    href={href}
                    className={[
                      'relative px-4 py-2 rounded-lg font-body text-sm font-medium transition-colors duration-200',
                      isActive
                        ? 'text-text-primary'
                        : 'text-text-muted hover:text-text-primary',
                    ].join(' ')}
                  >
                    {label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-lg bg-nebula-violet/12 border border-nebula-violet/25"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                </li>
              )
            })}
          </ul>

          {/* CTA — desktop */}
          <a
            href="#contact"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ignition-flame text-space-bg font-body text-sm font-semibold transition-all duration-200 hover:bg-ignition-flame-dim shadow-[0_0_16px_rgba(251,146,60,0.3)] hover:shadow-[0_0_24px_rgba(251,146,60,0.55)]"
          >
            Register Now
          </a>

          {/* Hamburger — mobile */}
          <button
            className="md:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-space-surface/60 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-space-bg/60 backdrop-blur-sm md:hidden"
              onClick={() => setMenuOpen(false)}
            />

            {/* Panel */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-space-surface border-l border-space-border flex flex-col pt-20 pb-8 px-6 md:hidden"
            >
              <button
                className="absolute top-5 right-5 p-2 rounded-lg text-text-muted hover:text-text-primary"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>

              <ul className="flex flex-col gap-1 flex-1">
                {NAV_LINKS.map(({ label, href }) => {
                  const id = href.slice(1)
                  const isActive = activeId === id
                  return (
                    <li key={href}>
                      <a
                        href={href}
                        onClick={handleLinkClick}
                        className={[
                          'flex items-center px-4 py-3 rounded-xl font-body text-base font-medium transition-colors duration-150',
                          isActive
                            ? 'bg-nebula-violet/12 text-text-primary border border-nebula-violet/25'
                            : 'text-text-muted hover:text-text-primary hover:bg-space-card',
                        ].join(' ')}
                      >
                        {label}
                      </a>
                    </li>
                  )
                })}
              </ul>

              <a
                href="#contact"
                onClick={handleLinkClick}
                className="mt-4 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-ignition-flame text-space-bg font-body text-sm font-semibold shadow-[0_0_16px_rgba(251,146,60,0.3)]"
              >
                Register Now
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

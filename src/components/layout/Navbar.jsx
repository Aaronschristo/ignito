/**
 * Navbar.jsx
 * Sticky glassmorphism navbar with desktop anchor links and mobile slide-in drawer.
 * Highlights active section via IntersectionObserver.
 * Includes Login button and user avatar with logout.
 */
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, Menu, X, LogIn, LogOut, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

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
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout, openAuth } = useAuth()

  // Highlight active section
  useEffect(() => {
    const observers = []
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id) },
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
              <Rocket size={22} className="text-ignition-flame" strokeWidth={2} />
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
                      isActive ? 'text-text-primary' : 'text-text-muted hover:text-text-primary',
                    ].join(' ')}
                  >
                    {label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-lg bg-nebula-green/12 border border-nebula-green/25"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                </li>
              )
            })}
          </ul>

          {/* Right side — desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-space-surface border border-space-border text-text-primary hover:border-nebula-green/40 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-nebula-green flex items-center justify-center">
                    <User size={12} className="text-space-bg" strokeWidth={2.5} />
                  </div>
                  <span className="font-body text-sm font-medium max-w-[120px] truncate">{user.name}</span>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-space-surface border border-space-border rounded-xl shadow-xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-space-border">
                        <p className="font-body text-xs text-text-faint">Signed in as</p>
                        <p className="font-body text-sm font-medium text-text-primary truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false) }}
                        className="w-full flex items-center gap-2 px-4 py-3 font-body text-sm text-ignition-flame hover:bg-ignition-flame/8 transition-colors"
                      >
                        <LogOut size={15} strokeWidth={2} />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <button
                  onClick={() => openAuth('login')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-body text-sm font-medium text-text-muted border border-space-border hover:text-text-primary hover:border-nebula-green/40 transition-all"
                >
                  <LogIn size={15} strokeWidth={2} />
                  Login
                </button>
                <button
                  onClick={() => openAuth('register')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ignition-flame text-space-bg font-body text-sm font-semibold transition-all hover:bg-ignition-flame-dim shadow-[0_0_16px_rgba(251,146,60,0.3)] hover:shadow-[0_0_24px_rgba(251,146,60,0.55)]"
                >
                  Register Now
                </button>
              </>
            )}
          </div>

          {/* Hamburger — mobile */}
          <button
            className="md:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-space-surface/60 transition-colors"
            onClick={() => setMenuOpen(v => !v)}
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
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-space-bg/60 backdrop-blur-sm md:hidden"
              onClick={() => setMenuOpen(false)}
            />

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
                            ? 'bg-nebula-green/12 text-text-primary border border-nebula-green/25'
                            : 'text-text-muted hover:text-text-primary hover:bg-space-card',
                        ].join(' ')}
                      >
                        {label}
                      </a>
                    </li>
                  )
                })}
              </ul>

              {/* Mobile auth buttons */}
              {user ? (
                <div className="flex flex-col gap-2 mt-4">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-space-card border border-space-border">
                    <div className="w-8 h-8 rounded-full bg-nebula-green flex items-center justify-center">
                      <User size={14} className="text-space-bg" strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-body text-sm font-medium text-text-primary truncate">{user.name}</p>
                      <p className="font-body text-xs text-text-faint truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { logout(); handleLinkClick() }}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-body text-sm text-ignition-flame border border-ignition-flame/30 hover:bg-ignition-flame/8 transition-colors"
                  >
                    <LogOut size={15} strokeWidth={2} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-4">
                  <button
                    onClick={() => { openAuth('login'); handleLinkClick() }}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-body text-sm text-text-muted border border-space-border hover:text-text-primary transition-colors"
                  >
                    <LogIn size={15} strokeWidth={2} />
                    Login
                  </button>
                  <button
                    onClick={() => { openAuth('register'); handleLinkClick() }}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-ignition-flame text-space-bg font-body text-sm font-semibold shadow-[0_0_16px_rgba(251,146,60,0.3)]"
                  >
                    Register Now
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

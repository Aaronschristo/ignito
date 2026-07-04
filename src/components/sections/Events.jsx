/**
 * Events.jsx
 * Filterable event cards loaded from data/events.json.
 * Each card has a Register button wired to AuthContext.
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Rocket, Bot, Cpu, Satellite, Telescope, Orbit, Radar,
  Calendar, Clock, MapPin, CheckCircle, Loader,
} from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import eventsData from '../../data/events.json'
import { formatDate, getCategoryColors } from '../../lib/utils'
import { useAuth } from '../../context/AuthContext'

const ICON_MAP = { Rocket, Bot, Cpu, Satellite, Telescope, Orbit, Radar }
const CATEGORIES = ['All', ...new Set(eventsData.map((e) => e.category))]

function RegisterEventButton({ eventId }) {
  const { user, registrations, toggleEventRegistration, openAuth } = useAuth()
  const [loading, setLoading] = useState(false)
  const isRegistered = registrations.events.includes(eventId)

  const handleClick = async () => {
    if (!user) { openAuth('login'); return }
    setLoading(true)
    try { await toggleEventRegistration(eventId) }
    finally { setLoading(false) }
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={loading}
      whileHover={{ scale: loading ? 1 : 1.03 }}
      whileTap={{ scale: loading ? 1 : 0.97 }}
      className={[
        'w-full mt-3 py-2.5 rounded-xl font-body text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200',
        isRegistered
          ? 'bg-nebula-green/15 text-nebula-green border border-nebula-green/30 hover:bg-nebula-green/8'
          : 'bg-nebula-blue/10 text-nebula-blue border border-nebula-blue/30 hover:bg-nebula-blue/15 hover:shadow-[0_0_12px_rgba(34,211,238,0.2)]',
        loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      {loading ? (
        <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}>
          <Loader size={13} />
        </motion.span>
      ) : isRegistered ? (
        <CheckCircle size={13} strokeWidth={2.5} />
      ) : (
        <Rocket size={13} strokeWidth={2} />
      )}
      {loading ? 'Processing…' : isRegistered ? 'Registered ✓' : 'Register for Event'}
    </motion.button>
  )
}

export function Events() {
  const [active, setActive] = useState('All')
  const { registrations } = useAuth()

  const filtered =
    active === 'All' ? eventsData : eventsData.filter((e) => e.category === active)

  return (
    <section id="events" className="relative py-24 sm:py-32 bg-space-surface overflow-hidden">
      {/* Top accent */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-nebula-blue/40 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[260px] bg-nebula-blue/4 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          overline="Flight Plan"
          title="Events & Missions"
          subtitle="Every event is a mission. Choose your path — workshops, hackathons, talks, and more."
        />

        {/* Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10 flex flex-wrap justify-center gap-2"
        >
          {CATEGORIES.map((cat) => {
            const isActive = active === cat
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={[
                  'px-4 py-2 rounded-xl font-body text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-nebula-blue text-space-bg shadow-[0_0_16px_rgba(34,211,238,0.3)]'
                    : 'bg-space-card border border-space-border text-text-muted hover:text-text-primary hover:border-nebula-blue/30',
                ].join(' ')}
              >
                {cat}
              </button>
            )
          })}
        </motion.div>

        {/* Card grid */}
        <motion.div layout className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((event, i) => {
              const Icon = ICON_MAP[event.icon] ?? Rocket
              const colors = getCategoryColors(event.category)
              const isRegistered = registrations.events.includes(event.id)

              return (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <Card glowColor={isRegistered ? 'green' : 'blue'} className="h-full flex flex-col">
                    <div className="flex flex-col gap-4 flex-1">
                      {/* Icon + Category */}
                      <div className="flex items-start justify-between">
                        <div className={[
                          'p-2.5 rounded-xl border transition-colors',
                          isRegistered
                            ? 'bg-nebula-green/10 border-nebula-green/20'
                            : 'bg-nebula-blue/10 border-nebula-blue/20',
                        ].join(' ')}>
                          <Icon
                            size={20}
                            className={isRegistered ? 'text-nebula-green' : 'text-nebula-blue'}
                            strokeWidth={1.75}
                          />
                        </div>
                        <Badge label={event.category} colorClasses={colors} />
                      </div>

                      {/* Title + Description */}
                      <div className="flex-1">
                        <h3 className="font-display text-base font-semibold text-text-primary mb-1.5 leading-snug">
                          {event.title}
                        </h3>
                        <p className="font-body text-xs text-text-muted leading-relaxed line-clamp-3">
                          {event.description}
                        </p>
                      </div>

                      {/* Meta */}
                      <div className="flex flex-col gap-1.5 pt-3 border-t border-space-border/60">
                        <div className="flex items-center gap-2 text-xs text-text-faint font-body">
                          <Calendar size={11} strokeWidth={2} />
                          {formatDate(event.date)}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-text-faint font-body">
                          <Clock size={11} strokeWidth={2} />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-text-faint font-body">
                          <MapPin size={11} strokeWidth={2} />
                          {event.venue}
                        </div>
                      </div>
                    </div>

                    {/* Register button */}
                    <RegisterEventButton eventId={event.id} />
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

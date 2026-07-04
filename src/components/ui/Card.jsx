/**
 * Card.jsx
 * Glassmorphism card with hover tilt + glow via framer-motion.
 * Base card — used by Events and Competitions sections.
 */
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export function Card({ children, className = '', glowColor = 'violet', onClick }) {
  const glowMap = {
    violet: 'hover:shadow-[0_0_40px_rgba(139,92,246,0.18)] hover:border-nebula-violet/40',
    flame: 'hover:shadow-[0_0_40px_rgba(251,146,60,0.18)] hover:border-ignition-flame/40',
    blue: 'hover:shadow-[0_0_40px_rgba(34,211,238,0.18)] hover:border-nebula-blue/40',
  }

  return (
    <motion.div
      onClick={onClick}
      whileHover={{
        y: -4,
        rotateX: 1.5,
        rotateY: -1.5,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      style={{ transformPerspective: 800 }}
      className={cn(
        'relative rounded-2xl p-6',
        'bg-space-card/80 backdrop-blur-sm',
        'border border-space-border',
        'transition-all duration-300',
        glowMap[glowColor] ?? glowMap.violet,
        onClick ? 'cursor-pointer' : '',
        className,
      )}
    >
      {/* Subtle inner highlight */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
      {children}
    </motion.div>
  )
}

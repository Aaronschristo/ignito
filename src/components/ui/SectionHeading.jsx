/**
 * SectionHeading.jsx
 * Two-line heading: small overline label + large display title.
 * Scroll-reveal via framer-motion whileInView.
 */
import { motion } from 'framer-motion'

export function SectionHeading({ overline, title, subtitle, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`text-center ${className}`}
    >
      {overline && (
        <p className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-nebula-blue mb-3">
          {overline}
        </p>
      )}
      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="font-body text-text-muted mt-4 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}

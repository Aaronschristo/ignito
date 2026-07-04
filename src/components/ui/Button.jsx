/**
 * Button.jsx
 * Variants: primary (ignition-flame), secondary (nebula-green outline), ghost
 * Uses only named design tokens — no raw hex or arbitrary Tailwind values.
 */
import { motion } from 'framer-motion'

const variants = {
  primary: [
    'bg-ignition-flame text-space-bg font-semibold',
    'hover:bg-ignition-flame-dim',
    'shadow-[0_0_20px_rgba(251,146,60,0.35)] hover:shadow-[0_0_32px_rgba(251,146,60,0.6)]',
    'border border-ignition-flame',
  ].join(' '),

  secondary: [
    'bg-transparent text-nebula-green font-semibold',
    'border border-nebula-green',
    'hover:bg-nebula-green/10',
    'hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]',
  ].join(' '),

  ghost: [
    'bg-transparent text-text-muted font-medium',
    'border border-space-border',
    'hover:border-nebula-green/50 hover:text-text-primary',
  ].join(' '),
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  ...props
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.04 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={[
        'inline-flex items-center justify-center gap-2',
        'px-6 py-3 rounded-xl',
        'transition-colors duration-200',
        'cursor-pointer select-none',
        'font-body text-sm',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        variants[variant] ?? variants.primary,
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </motion.button>
  )
}

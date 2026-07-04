/**
 * Badge.jsx
 * Small pill badge for categories and difficulty levels.
 * Color-coded via utility helpers — no raw hex.
 */
import { cn } from '../../lib/utils'

export function Badge({ label, colorClasses, className = '' }) {
  const { text = 'text-text-muted', bg = 'bg-space-border/20', border = 'border-space-border' } =
    colorClasses ?? {}

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-body',
        'border',
        text,
        bg,
        border,
        className,
      )}
    >
      {label}
    </span>
  )
}

/**
 * lib/utils.js — small shared helpers
 */

/**
 * Join classNames conditionally (lightweight clsx alternative)
 * @param {...(string|false|null|undefined)} classes
 * @returns {string}
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

/**
 * Format an ISO date string to a human-readable date.
 * e.g. "2027-01-15" → "Jan 15, 2027"
 */
export function formatDate(isoString) {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Map a difficulty level string to Tailwind token class pairs.
 * Returns { text, bg, border } token classes.
 */
export function getDifficultyColors(difficulty) {
  switch (difficulty) {
    case 'Commander':
      return {
        text: 'text-ignition-flame',
        bg: 'bg-ignition-flame/10',
        border: 'border-ignition-flame/30',
      }
    case 'Pilot':
      return {
        text: 'text-nebula-green',
        bg: 'bg-nebula-green/10',
        border: 'border-nebula-green/30',
      }
    case 'Cadet':
    default:
      return {
        text: 'text-nebula-blue',
        bg: 'bg-nebula-blue/10',
        border: 'border-nebula-blue/30',
      }
  }
}

/**
 * Map an event category to a color class.
 */
export function getCategoryColors(category) {
  const map = {
    Hackathon: {
      text: 'text-ignition-flame',
      bg: 'bg-ignition-flame/10',
      border: 'border-ignition-flame/30',
    },
    Workshop: {
      text: 'text-nebula-blue',
      bg: 'bg-nebula-blue/10',
      border: 'border-nebula-blue/30',
    },
    Talk: {
      text: 'text-nebula-green',
      bg: 'bg-nebula-green/10',
      border: 'border-nebula-green/30',
    },
    Competition: {
      text: 'text-ignition-glow',
      bg: 'bg-ignition-glow/10',
      border: 'border-ignition-glow/30',
    },
  }
  return map[category] ?? {
    text: 'text-text-muted',
    bg: 'bg-space-border/20',
    border: 'border-space-border',
  }
}

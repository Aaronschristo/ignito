/**
 * CountdownTimer.jsx
 * Displays { days, hours, minutes, seconds } in frosted-glass tiles.
 * Consumes the useCountdown hook.
 */
import { useCountdown } from '../../hooks/useCountdown'

// Target date — January 15, 2027 (placeholder; update when real date confirmed)
const FEST_DATE = '2027-01-15T09:00:00'

function Tile({ value, label }) {
  const padded = String(value).padStart(2, '0')
  return (
    <div className="flex flex-col items-center">
      <div className="
        relative
        w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24
        flex items-center justify-center
        rounded-xl
        bg-space-surface/70 backdrop-blur-md
        border border-space-border
        shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]
      ">
        {/* Glow */}
        <div className="absolute inset-0 rounded-xl bg-nebula-violet/5 pointer-events-none" />
        <span className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary tabular-nums">
          {padded}
        </span>
      </div>
      <span className="font-body text-[10px] sm:text-xs font-medium tracking-widest uppercase text-text-muted mt-2">
        {label}
      </span>
    </div>
  )
}

function Colon() {
  return (
    <span className="font-display text-2xl sm:text-3xl font-bold text-text-faint self-start mt-4 sm:mt-5 select-none">
      :
    </span>
  )
}

export function CountdownTimer() {
  const { days, hours, minutes, seconds, expired } = useCountdown(FEST_DATE)

  if (expired) {
    return (
      <p className="font-display text-lg font-semibold text-ignition-flame tracking-wide">
        🚀 IGNITO is LIVE — T+00:00:00
      </p>
    )
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
      <Tile value={days} label="Days" />
      <Colon />
      <Tile value={hours} label="Hours" />
      <Colon />
      <Tile value={minutes} label="Minutes" />
      <Colon />
      <Tile value={seconds} label="Seconds" />
    </div>
  )
}

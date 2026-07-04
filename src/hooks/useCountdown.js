/**
 * useCountdown.js
 * Custom hook that calculates { days, hours, minutes, seconds }
 * from a target ISO date string, updating every second.
 */
import { useState, useEffect } from 'react'

function getTimeLeft(targetDate) {
  const total = Date.parse(targetDate) - Date.now()

  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  }

  const seconds = Math.floor((total / 1000) % 60)
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
  const days = Math.floor(total / (1000 * 60 * 60 * 24))

  return { days, hours, minutes, seconds, expired: false }
}

export function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return timeLeft
}

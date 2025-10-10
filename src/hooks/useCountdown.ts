/**
 * @title useCountdown Hook
 * @notice Real-time countdown timer hook
 * @dev KISS principle: Simple countdown with auto-refresh
 */

import { useEffect, useState } from 'react'

export interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
  totalSeconds: number
}

/**
 * Calculate time remaining until deadline
 * @param deadline - Unix timestamp in seconds
 * @returns Countdown time object
 */
export function useCountdown(deadline: bigint | number): CountdownTime {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>(() =>
    calculateTimeLeft(deadline)
  )

  useEffect(() => {
    // Update every second
    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(deadline)
      setTimeLeft(newTimeLeft)

      // Stop updating if expired
      if (newTimeLeft.isExpired) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [deadline])

  return timeLeft
}

/**
 * Calculate time difference
 */
function calculateTimeLeft(deadline: bigint | number): CountdownTime {
  const deadlineMs = Number(deadline) * 1000
  const now = Date.now()
  const difference = deadlineMs - now

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      totalSeconds: 0,
    }
  }

  const totalSeconds = Math.floor(difference / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
    totalSeconds,
  }
}

/**
 * Format countdown for display
 */
export function formatCountdown(time: CountdownTime): string {
  if (time.isExpired) {
    return 'Expired'
  }

  const parts: string[] = []

  if (time.days > 0) {
    parts.push(`${time.days}d`)
  }
  if (time.hours > 0 || time.days > 0) {
    parts.push(`${time.hours}h`)
  }
  if (time.minutes > 0 || time.hours > 0 || time.days > 0) {
    parts.push(`${time.minutes}m`)
  }
  parts.push(`${time.seconds}s`)

  return parts.join(' ')
}

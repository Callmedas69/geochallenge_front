/**
 * @title Rotating Text Hook
 * @notice Cycles through messages to keep users engaged during VRF wait
 * @dev KISS: Simple interval-based message rotation
 */

import { useState, useEffect } from 'react';

const WAITING_MESSAGES = [
  "Opening your pack...",
  "We are choosing the best random number for you...",
  "How's the weather today?",
  "Consulting the blockchain oracle...",
  "Shuffling the cards...",
  "Almost there...",
  "Good things take time...",
  "Randomness is being verified...",
  "Your cards are being minted...",
  "Patience is a virtue...",
];

/**
 * Hook to rotate through waiting messages
 * @param intervalMs - Milliseconds between message changes (default: 3000)
 * @returns Current message to display
 */
export function useRotatingText(intervalMs: number = 3000): string {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % WAITING_MESSAGES.length);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return WAITING_MESSAGES[currentIndex];
}

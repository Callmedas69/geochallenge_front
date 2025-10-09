/**
 * @title Validation Constants & Helpers
 * @notice KISS principle - simple validation rules
 * @dev Reasonable ranges for admin inputs
 */

import { parseEther } from "viem";

// Get validation limits from environment variables (configurable for different networks)
const getMaxPrizeETH = (): number => {
  const envValue = process.env.NEXT_PUBLIC_MAX_PRIZE_ETH;
  return envValue ? parseFloat(envValue) : 10; // Default: 10 ETH (reasonable for Base)
};

const getMinPrizeETH = (): number => {
  const envValue = process.env.NEXT_PUBLIC_MIN_PRIZE_ETH;
  return envValue ? parseFloat(envValue) : 0.001; // Default: 0.001 ETH
};

// Prize validation
export const PRIZE_VALIDATION = {
  MIN_ETH: getMinPrizeETH(),
  MAX_ETH: getMaxPrizeETH(),
  MIN_WEI: parseEther(getMinPrizeETH().toString()),
  MAX_WEI: parseEther(getMaxPrizeETH().toString()),
} as const;

// Deadline extension validation
export const DEADLINE_VALIDATION = {
  MIN_DAYS: 1,
  MAX_DAYS: 365,
} as const;

// Booster box validation
export const BOOSTER_VALIDATION = {
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 10000,
} as const;

/**
 * Validate prize amount
 */
export function validatePrizeAmount(amountStr: string): {
  valid: boolean;
  error?: string;
  value?: bigint;
} {
  try {
    const amount = parseEther(amountStr);

    if (amount <= 0n) {
      return { valid: false, error: "Prize amount must be greater than 0" };
    }

    if (amount < PRIZE_VALIDATION.MIN_WEI) {
      return {
        valid: false,
        error: `Prize amount must be at least ${PRIZE_VALIDATION.MIN_ETH} ETH`,
      };
    }

    if (amount > PRIZE_VALIDATION.MAX_WEI) {
      return {
        valid: false,
        error: `Prize amount must not exceed ${PRIZE_VALIDATION.MAX_ETH} ETH`,
      };
    }

    return { valid: true, value: amount };
  } catch (err) {
    return {
      valid: false,
      error: "Invalid prize amount. Please enter a valid number.",
    };
  }
}

/**
 * Validate deadline extension days
 */
export function validateExtendDays(daysStr: string): {
  valid: boolean;
  error?: string;
  value?: number;
} {
  const days = parseInt(daysStr);

  if (isNaN(days)) {
    return { valid: false, error: "Please enter a valid number of days" };
  }

  if (days < DEADLINE_VALIDATION.MIN_DAYS) {
    return {
      valid: false,
      error: `Extension must be at least ${DEADLINE_VALIDATION.MIN_DAYS} day`,
    };
  }

  if (days > DEADLINE_VALIDATION.MAX_DAYS) {
    return {
      valid: false,
      error: `Extension cannot exceed ${DEADLINE_VALIDATION.MAX_DAYS} days`,
    };
  }

  return { valid: true, value: days };
}

/**
 * Validate booster box quantity
 * @param allowZero - For "set" operation, allow 0 to disable booster boxes
 */
export function validateBoosterQuantity(
  qtyStr: string,
  allowZero: boolean = false
): {
  valid: boolean;
  error?: string;
  value?: number;
} {
  const qty = parseInt(qtyStr);

  if (isNaN(qty)) {
    return { valid: false, error: "Please enter a valid quantity" };
  }

  const minQty = allowZero ? 0 : BOOSTER_VALIDATION.MIN_QUANTITY;

  if (qty < minQty) {
    return {
      valid: false,
      error: `Quantity must be at least ${minQty}`,
    };
  }

  if (qty > BOOSTER_VALIDATION.MAX_QUANTITY) {
    return {
      valid: false,
      error: `Quantity cannot exceed ${BOOSTER_VALIDATION.MAX_QUANTITY}`,
    };
  }

  return { valid: true, value: qty };
}

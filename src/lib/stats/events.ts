/**
 * @title ABI Event References
 * @notice Extract event definitions from ABI
 * @dev CLAUDE.md Compliance: "Do not make assumption always refer to ABI Contract"
 * @security Never hardcode event signatures - always extract from ABI source of truth
 */

import { geoChallenge_implementation_ABI } from '@/abi';

/**
 * TicketPurchased Event
 * Emitted when a user purchases a competition ticket
 *
 * Event signature (from ABI):
 * event TicketPurchased(
 *   uint256 indexed competitionId,
 *   address indexed buyer,
 *   uint256 ticketId,
 *   uint256 price
 * )
 *
 * @security Extracted from ABI at runtime to prevent ABI drift issues
 */
export const TICKET_PURCHASED_EVENT = geoChallenge_implementation_ABI.find(
  (item) => item.type === 'event' && item.name === 'TicketPurchased'
);

// Validate event exists (fail fast if ABI changes)
if (!TICKET_PURCHASED_EVENT) {
  throw new Error(
    '[CRITICAL] TicketPurchased event not found in geoChallenge_implementation_ABI. ' +
    'This indicates an ABI mismatch. Please regenerate ABIs from contracts.'
  );
}

/**
 * Type guard to ensure event has required structure
 * @dev This provides TypeScript safety for event usage
 */
export function isTicketPurchasedEvent(event: any): event is {
  type: 'event';
  name: 'TicketPurchased';
  inputs: Array<{
    indexed: boolean;
    name: string;
    type: string;
  }>;
} {
  return (
    event &&
    event.type === 'event' &&
    event.name === 'TicketPurchased' &&
    Array.isArray(event.inputs)
  );
}

// Validate event structure
if (!isTicketPurchasedEvent(TICKET_PURCHASED_EVENT)) {
  throw new Error(
    '[CRITICAL] TicketPurchased event has unexpected structure. ' +
    'Expected indexed competitionId and buyer fields.'
  );
}

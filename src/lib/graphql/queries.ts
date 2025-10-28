/**
 * @title The Graph Query Definitions
 * @notice GraphQL queries for competition stats
 * @dev KISS principle: Simple, focused queries
 */

import { gql } from 'graphql-request';

/**
 * Query to get competition stats (participant count, tickets, revenue)
 */
export const GET_COMPETITION_STATS = gql`
  query GetCompetitionStats($competitionId: ID!) {
    competition(id: $competitionId) {
      id
      participantCount
      totalTickets
      totalRevenue
      firstPurchaseAt
      lastPurchaseAt
    }
  }
`;

/**
 * Query to get all participants for a competition
 */
export const GET_COMPETITION_PARTICIPANTS = gql`
  query GetCompetitionParticipants(
    $competitionId: ID!
    $first: Int = 1000
    $skip: Int = 0
  ) {
    participants(
      where: { competition: $competitionId }
      first: $first
      skip: $skip
      orderBy: ticketCount
      orderDirection: desc
    ) {
      id
      address
      ticketCount
      totalSpent
      firstPurchaseAt
      lastPurchaseAt
    }
  }
`;

/**
 * Query to get recent ticket purchases for a competition
 */
export const GET_RECENT_PURCHASES = gql`
  query GetRecentPurchases(
    $competitionId: ID!
    $first: Int = 10
  ) {
    ticketPurchases(
      where: { competition: $competitionId }
      first: $first
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      buyer
      price
      timestamp
      blockNumber
      transactionHash
    }
  }
`;

/**
 * Query to check if a specific address is a participant
 */
export const CHECK_PARTICIPANT = gql`
  query CheckParticipant($participantId: ID!) {
    participant(id: $participantId) {
      id
      address
      ticketCount
      totalSpent
    }
  }
`;

/**
 * Type definitions for query responses
 */

export interface Competition {
  id: string;
  participantCount: string; // BigInt as string
  totalTickets: string;
  totalRevenue: string;
  firstPurchaseAt: string | null;
  lastPurchaseAt: string | null;
}

export interface Participant {
  id: string;
  address: string; // Bytes as hex string
  ticketCount: string;
  totalSpent: string;
  firstPurchaseAt: string;
  lastPurchaseAt: string;
}

export interface TicketPurchase {
  id: string;
  buyer: string; // Bytes as hex string
  price: string;
  timestamp: string;
  blockNumber: string;
  transactionHash: string; // Bytes as hex string
}

export interface GetCompetitionStatsResponse {
  competition: Competition | null;
}

export interface GetCompetitionParticipantsResponse {
  participants: Participant[];
}

export interface GetRecentPurchasesResponse {
  ticketPurchases: TicketPurchase[];
}

export interface CheckParticipantResponse {
  participant: Participant | null;
}

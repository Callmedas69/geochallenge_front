/**
 * @title The Graph GraphQL Client
 * @notice Client for querying competition stats from The Graph subgraph
 * @dev KISS principle: Simple GraphQL client wrapper
 */

import { GraphQLClient } from 'graphql-request';

// Validate environment variable
if (!process.env.NEXT_PUBLIC_GRAPH_ENDPOINT) {
  throw new Error(
    '[CRITICAL] NEXT_PUBLIC_GRAPH_ENDPOINT not set in environment variables. ' +
    'Please add it to .env.local'
  );
}

/**
 * GraphQL Client for The Graph subgraph
 * @dev Configured with endpoint from environment variable
 */
export const graphClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_GRAPH_ENDPOINT,
  {
    // Optional: Add headers if needed (e.g., auth for production)
    headers: {},
  }
);

/**
 * Helper to handle GraphQL errors gracefully
 */
export async function queryGraph<T>(query: string, variables?: Record<string, any>): Promise<T> {
  try {
    return await graphClient.request<T>(query, variables);
  } catch (error) {
    console.error('[Graph Query Error]', error);
    throw new Error(
      error instanceof Error
        ? `Failed to query The Graph: ${error.message}`
        : 'Unknown GraphQL error'
    );
  }
}

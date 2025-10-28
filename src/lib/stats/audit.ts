/**
 * @title Audit Logging Utility
 * @notice Security audit trail for stats API endpoints
 * @dev KISS principle: Simple console logging with optional monitoring integration
 * @security Tracks all API access attempts for security monitoring
 */

/**
 * Log security audit events for stats API
 * @param endpoint - API endpoint name (e.g., 'STATS_API', 'REFRESH_API')
 * @param method - HTTP method (GET, POST, etc.)
 * @param details - Additional context (IP, competitionId, etc.)
 * @param success - Whether the request was successful
 * @param message - Human-readable message
 */
export function auditLog(
  endpoint: string,
  method: string,
  details: Record<string, any>,
  success: boolean,
  message: string
): void {
  const timestamp = new Date().toISOString();
  const status = success ? 'SUCCESS' : 'BLOCKED';

  // Log to console (captured by hosting platform logs)
  console.log(
    `[STATS_AUDIT] ${timestamp} | ${status} | ${endpoint} ${method} | ` +
    `${JSON.stringify(details)} | ${message}`
  );

  // Optional: Send to monitoring service in production
  if (!success && process.env.NODE_ENV === 'production') {
    // TODO: Integrate with monitoring service (Sentry, DataDog, etc.)
    // Example:
    // Sentry.captureMessage(`[STATS_AUDIT] ${status}: ${message}`, {
    //   level: 'warning',
    //   extra: { endpoint, method, details }
    // });
  }
}

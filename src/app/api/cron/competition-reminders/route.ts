/**
 * Competition Reminder Cron Job (OPTIONAL - Phase 2)
 *
 * @notice Sends reminder notifications 24h before competition ends
 * @dev ⚠️ KISS Principle Note: This adds infrastructure complexity
 * @dev For MVP, consider manual admin triggers or skip this feature
 *
 * @security Requires CRON_SECRET environment variable
 * @deployment Requires Vercel Cron or similar scheduler
 *
 * Setup Instructions:
 * 1. Add CRON_SECRET to .env.local (random string)
 * 2. Add to vercel.json:
 *    {
 *      "crons": [{
 *        "path": "/api/cron/competition-reminders",
 *        "schedule": "0 12 * * *"  // Daily at 12 PM UTC
 *      }]
 *    }
 * 3. Deploy to Vercel
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendNotificationToAllUsers } from '@/lib/farcaster/notification/sender';

export async function GET(request: NextRequest) {
  try {
    // 🔒 Security: Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.warn('[Cron] Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find competitions ending in 24 hours
    const tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 24);

    // Type for competition data from Supabase
    interface CompetitionRecord {
      id: number;
      name: string;
      end_date: string;
    }

    const { data: competitions, error } = await supabaseAdmin
      .from('competitions')
      .select('id, name, end_date')
      .eq('status', 'active')
      .lte('end_date', tomorrow.toISOString())
      .gt('end_date', new Date().toISOString()) as { data: CompetitionRecord[] | null; error: any };

    if (error) {
      console.error('[Cron] Database error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!competitions || competitions.length === 0) {
      console.log('[Cron] No competitions ending in 24 hours');
      return NextResponse.json({ success: true, notified: 0 });
    }

    // Send notification for each competition
    const results = await Promise.all(
      competitions.map(async (comp) => {
        try {
          const result = await sendNotificationToAllUsers({
            notificationId: `comp-ending-${comp.id}`,
            title: '⏰ Competition Ending Soon!',
            body: `${comp.name} ends in 24 hours. Don't miss out!`,
            targetUrl: `https://challenge.geoart.studio/miniapps/competitions/${comp.id}`
          });

          console.log(`[Cron] Sent reminder for "${comp.name}" to ${result.sent} users`);
          return result.sent || 0;
        } catch (error) {
          console.error(`[Cron] Failed to send reminder for "${comp.name}":`, error);
          return 0;
        }
      })
    );

    const totalNotified = results.reduce((sum, count) => sum + count, 0);

    console.log(`[Cron] ✅ Sent ${totalNotified} reminders for ${competitions.length} competitions`);

    return NextResponse.json({
      success: true,
      competitions: competitions.length,
      notified: totalNotified
    });

  } catch (error) {
    console.error('[Cron] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

/**
 * Alternative (KISS) Approach for MVP:
 *
 * Instead of cron jobs, create a manual admin endpoint:
 *
 * POST /api/admin/send-reminders
 * - Admin manually triggers reminders when needed
 * - No cron infrastructure required
 * - Simpler to test and debug
 * - Can be automated later if needed
 *
 * Example:
 * ```typescript
 * export async function POST(request: NextRequest) {
 *   // Verify admin signature (like featured competition route)
 *   // Find competitions ending soon
 *   // Send notifications
 * }
 * ```
 */

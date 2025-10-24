/**
 * @title PATCH Update Featured Priorities API (ADMIN ONLY)
 * @notice Updates priority order of featured competitions (admin-only operation)
 * @dev 6-layer security: Rate limit, input validation, request validation,
 *      signature verification, owner verification, audit logging
 * @security Follows api/proof/submit-completion security pattern
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { Database } from '@/lib/supabase/types';
import {
  checkRateLimit,
  auditLog,
  getClientIP,
  isValidEthereumAddress,
  validateCompetitionId,
  validatePriority,
  verifyAdmin,
} from '@/lib/supabase/security';

// Rate limiting configuration (stricter for admin routes)
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 10; // 10 requests per hour per IP

// ============================================================================
// PATCH /api/supabase/admin/featured/priority
// ============================================================================

export async function PATCH(request: NextRequest) {
  const ip = getClientIP(request);
  let walletAddress = 'unknown';

  try {
    // =========================================================================
    // Layer 1: Rate Limiting
    // =========================================================================
    if (!checkRateLimit(ip, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW)) {
      auditLog(
        'FEATURED_ADMIN_API',
        'PATCH_PRIORITY',
        { ip },
        false,
        'Rate limit exceeded (10 req/hour)'
      );

      return NextResponse.json(
        { error: 'Rate limit exceeded. Max 10 requests per hour.' },
        { status: 429 }
      );
    }

    // =========================================================================
    // Layer 2: Request Body Validation
    // =========================================================================
    const body = await request.json();
    const {
      updates,
      walletAddress: wallet,
      signature,
      message
    } = body;

    walletAddress = wallet;

    if (!updates || !walletAddress || !signature || !message) {
      auditLog(
        'FEATURED_ADMIN_API',
        'PATCH_PRIORITY',
        { ip, walletAddress },
        false,
        'Missing required fields'
      );

      return NextResponse.json(
        {
          error: 'Missing required fields',
          required: ['updates', 'walletAddress', 'signature', 'message']
        },
        { status: 400 }
      );
    }

    // Validate updates array
    if (!Array.isArray(updates) || updates.length === 0) {
      auditLog(
        'FEATURED_ADMIN_API',
        'PATCH_PRIORITY',
        { ip, walletAddress },
        false,
        'Invalid updates array'
      );

      return NextResponse.json(
        { error: 'updates must be a non-empty array' },
        { status: 400 }
      );
    }

    // Limit number of updates
    if (updates.length > 20) {
      auditLog(
        'FEATURED_ADMIN_API',
        'PATCH_PRIORITY',
        { ip, walletAddress },
        false,
        'Too many updates (max 20)'
      );

      return NextResponse.json(
        { error: 'Maximum 20 priority updates allowed per request' },
        { status: 400 }
      );
    }

    // =========================================================================
    // Layer 3: Input Validation
    // =========================================================================
    if (!isValidEthereumAddress(walletAddress)) {
      auditLog(
        'FEATURED_ADMIN_API',
        'PATCH_PRIORITY',
        { ip, walletAddress },
        false,
        'Invalid wallet address format'
      );

      return NextResponse.json(
        { error: 'Invalid Ethereum address format' },
        { status: 400 }
      );
    }

    // Validate each update entry
    const validatedUpdates: Array<{ competitionId: bigint; priority: number }> = [];

    for (const update of updates) {
      const { competitionId, priority } = update;

      // Validate competition ID
      const validatedCompId = validateCompetitionId(competitionId);
      if (!validatedCompId) {
        auditLog(
          'FEATURED_ADMIN_API',
          'PATCH_PRIORITY',
          { ip, walletAddress, invalidId: competitionId },
          false,
          `Invalid competition ID: ${competitionId}`
        );

        return NextResponse.json(
          { error: `Invalid competition ID: ${competitionId}` },
          { status: 400 }
        );
      }

      // Validate priority
      if (typeof priority !== 'number') {
        auditLog(
          'FEATURED_ADMIN_API',
          'PATCH_PRIORITY',
          { ip, walletAddress, competitionId },
          false,
          'Priority must be a number'
        );

        return NextResponse.json(
          { error: `Priority must be a number for competition ${competitionId}` },
          { status: 400 }
        );
      }

      const validatedPriority = validatePriority(priority);

      validatedUpdates.push({
        competitionId: validatedCompId,
        priority: validatedPriority
      });
    }

    // =========================================================================
    // Layer 4: Admin Verification (Signature + Owner Check)
    // =========================================================================
    const adminVerification = await verifyAdmin(walletAddress, signature, message);

    if (!adminVerification.isValid) {
      auditLog(
        'FEATURED_ADMIN_API',
        'PATCH_PRIORITY',
        { ip, walletAddress },
        false,
        `Admin verification failed: ${adminVerification.reason}`
      );

      return NextResponse.json(
        { error: 'Unauthorized', details: adminVerification.reason },
        { status: 403 }
      );
    }

    // =========================================================================
    // Layer 5: Update Priorities in Database
    // =========================================================================
    const updateResults: any[] = [];
    const errors: Array<{ competitionId: string; error: string }> = [];

    for (const update of validatedUpdates) {
      const updateData = {
        priority: update.priority
      };

      const { data, error } = await supabaseAdmin
        .from('featured_competitions')
        // @ts-ignore - Supabase client type inference issue with service role admin
        .update(updateData)
        .eq('competition_id', Number(update.competitionId))
        .select();

      if (error) {
        errors.push({
          competitionId: update.competitionId.toString(),
          error: error.message
        });
      } else if (data && data.length > 0) {
        updateResults.push(data[0]);
      } else {
        errors.push({
          competitionId: update.competitionId.toString(),
          error: 'Not found in featured list'
        });
      }
    }

    // =========================================================================
    // Layer 6: Success/Partial Success Response
    // =========================================================================
    if (errors.length > 0 && updateResults.length === 0) {
      // All updates failed
      auditLog(
        'FEATURED_ADMIN_API',
        'PATCH_PRIORITY',
        { ip, walletAddress, errors },
        false,
        'All priority updates failed'
      );

      return NextResponse.json(
        {
          error: 'Failed to update priorities',
          errors
        },
        { status: 500 }
      );
    }

    // Success or partial success
    auditLog(
      'FEATURED_ADMIN_API',
      'PATCH_PRIORITY',
      {
        ip,
        walletAddress,
        updated: updateResults.length,
        failed: errors.length
      },
      true,
      `Priorities updated: ${updateResults.length} successful, ${errors.length} failed`
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Priorities updated successfully',
        updated: updateResults.length,
        failed: errors.length,
        data: updateResults,
        errors: errors.length > 0 ? errors : undefined
      },
      { status: errors.length > 0 ? 207 : 200 } // 207 Multi-Status if partial success
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    auditLog(
      'FEATURED_ADMIN_API',
      'PATCH_PRIORITY',
      { ip, walletAddress },
      false,
      `Unhandled error: ${errorMessage}`
    );

    return NextResponse.json(
      {
        error: 'Failed to update priorities',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

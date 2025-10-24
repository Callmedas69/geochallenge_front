/**
 * @title DELETE Featured Competition API (ADMIN ONLY)
 * @notice Removes a competition from featured list (admin-only operation)
 * @dev 6-layer security: Rate limit, input validation, request validation,
 *      signature verification, owner verification, audit logging
 * @security Follows api/proof/submit-completion security pattern
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import {
  checkRateLimit,
  auditLog,
  getClientIP,
  isValidEthereumAddress,
  validateCompetitionId,
  verifyAdmin,
} from '@/lib/supabase/security';

// Rate limiting configuration (stricter for admin routes)
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 10; // 10 requests per hour per IP

// ============================================================================
// DELETE /api/supabase/admin/featured/[id]
// ============================================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIP(request);
  const { id } = await params;
  let walletAddress = 'unknown';

  try {
    // =========================================================================
    // Layer 1: Rate Limiting
    // =========================================================================
    if (!checkRateLimit(ip, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW)) {
      auditLog(
        'FEATURED_ADMIN_API',
        'DELETE',
        { ip, competitionId: id },
        false,
        'Rate limit exceeded (10 req/hour)'
      );

      return NextResponse.json(
        { error: 'Rate limit exceeded. Max 10 requests per hour.' },
        { status: 429 }
      );
    }

    // =========================================================================
    // Layer 2: Validate Competition ID from Route Param
    // =========================================================================
    const validatedCompId = validateCompetitionId(id);
    if (!validatedCompId) {
      auditLog(
        'FEATURED_ADMIN_API',
        'DELETE',
        { ip, competitionId: id },
        false,
        'Invalid competition ID in route'
      );

      return NextResponse.json(
        { error: 'Invalid competition ID (must be positive number)' },
        { status: 400 }
      );
    }

    // =========================================================================
    // Layer 3: Request Body Validation
    // =========================================================================
    const body = await request.json();
    const { walletAddress: wallet, signature, message } = body;

    walletAddress = wallet;

    if (!walletAddress || !signature || !message) {
      auditLog(
        'FEATURED_ADMIN_API',
        'DELETE',
        { ip, competitionId: id, walletAddress },
        false,
        'Missing required fields'
      );

      return NextResponse.json(
        {
          error: 'Missing required fields',
          required: ['walletAddress', 'signature', 'message']
        },
        { status: 400 }
      );
    }

    // =========================================================================
    // Layer 4: Input Validation
    // =========================================================================
    if (!isValidEthereumAddress(walletAddress)) {
      auditLog(
        'FEATURED_ADMIN_API',
        'DELETE',
        { ip, competitionId: id, walletAddress },
        false,
        'Invalid wallet address format'
      );

      return NextResponse.json(
        { error: 'Invalid Ethereum address format' },
        { status: 400 }
      );
    }

    // =========================================================================
    // Layer 5: Admin Verification (Signature + Owner Check)
    // =========================================================================
    const adminVerification = await verifyAdmin(walletAddress, signature, message);

    if (!adminVerification.isValid) {
      auditLog(
        'FEATURED_ADMIN_API',
        'DELETE',
        { ip, competitionId: id, walletAddress },
        false,
        `Admin verification failed: ${adminVerification.reason}`
      );

      return NextResponse.json(
        { error: 'Unauthorized', details: adminVerification.reason },
        { status: 403 }
      );
    }

    // =========================================================================
    // Layer 6: Delete from Database
    // =========================================================================
    const { data, error } = await supabaseAdmin
      .from('featured_competitions')
      .delete()
      .eq('competition_id', Number(validatedCompId))
      .select();

    if (error) {
      auditLog(
        'FEATURED_ADMIN_API',
        'DELETE',
        { ip, competitionId: id, walletAddress },
        false,
        `Database delete failed: ${error.message}`
      );

      return NextResponse.json(
        { error: 'Failed to remove featured competition', details: error.message },
        { status: 500 }
      );
    }

    // Check if competition was actually deleted
    if (!data || data.length === 0) {
      auditLog(
        'FEATURED_ADMIN_API',
        'DELETE',
        { ip, competitionId: id, walletAddress },
        false,
        'Competition not found in featured list'
      );

      return NextResponse.json(
        { error: 'Competition is not featured' },
        { status: 404 }
      );
    }

    // =========================================================================
    // Success - Audit Log
    // =========================================================================
    auditLog(
      'FEATURED_ADMIN_API',
      'DELETE',
      { ip, competitionId: id, walletAddress },
      true,
      `Competition #${id} removed from featured successfully`
    );

    return NextResponse.json(
      {
        success: true,
        message: `Competition #${id} removed from featured successfully`,
        data: data[0]
      },
      { status: 200 }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    auditLog(
      'FEATURED_ADMIN_API',
      'DELETE',
      { ip, competitionId: id, walletAddress },
      false,
      `Unhandled error: ${errorMessage}`
    );

    return NextResponse.json(
      {
        error: 'Failed to remove featured competition',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

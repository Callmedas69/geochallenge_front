/**
 * @title POST Add Featured Competition API (ADMIN ONLY)
 * @notice Adds a competition to featured list (admin-only operation)
 * @dev 7-layer security: Rate limit, input validation, request validation,
 *      signature verification, owner verification, on-chain validation, audit logging
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
  validatePriority,
  verifyAdmin,
  verifyCompetitionExists,
} from '@/lib/supabase/security';

// Rate limiting configuration (stricter for admin routes)
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 10; // 10 requests per hour per IP

// ============================================================================
// POST /api/supabase/admin/featured
// ============================================================================

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  let competitionId = 'unknown';
  let walletAddress = 'unknown';

  try {
    // =========================================================================
    // Layer 1: Rate Limiting
    // =========================================================================
    if (!checkRateLimit(ip, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW)) {
      auditLog(
        'FEATURED_ADMIN_API',
        'POST_ADD',
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
      competitionId: compId,
      priority,
      walletAddress: wallet,
      signature,
      message,
      notes
    } = body;

    competitionId = compId;
    walletAddress = wallet;

    if (!competitionId || !walletAddress || !signature || !message) {
      auditLog(
        'FEATURED_ADMIN_API',
        'POST_ADD',
        { ip, competitionId, walletAddress },
        false,
        'Missing required fields'
      );

      return NextResponse.json(
        {
          error: 'Missing required fields',
          required: ['competitionId', 'walletAddress', 'signature', 'message']
        },
        { status: 400 }
      );
    }

    // =========================================================================
    // Layer 3: Input Validation
    // =========================================================================

    // Validate wallet address format
    if (!isValidEthereumAddress(walletAddress)) {
      auditLog(
        'FEATURED_ADMIN_API',
        'POST_ADD',
        { ip, competitionId, walletAddress },
        false,
        'Invalid wallet address format'
      );

      return NextResponse.json(
        { error: 'Invalid Ethereum address format' },
        { status: 400 }
      );
    }

    // Validate competition ID
    const validatedCompId = validateCompetitionId(competitionId);
    if (!validatedCompId) {
      auditLog(
        'FEATURED_ADMIN_API',
        'POST_ADD',
        { ip, competitionId, walletAddress },
        false,
        'Invalid competition ID'
      );

      return NextResponse.json(
        { error: 'Invalid competition ID (must be positive number)' },
        { status: 400 }
      );
    }

    // Validate priority
    const validatedPriority = priority !== undefined
      ? validatePriority(priority)
      : 0;

    // =========================================================================
    // Layer 4: Admin Verification (Signature + Owner Check)
    // =========================================================================
    const adminVerification = await verifyAdmin(walletAddress, signature, message);

    if (!adminVerification.isValid) {
      auditLog(
        'FEATURED_ADMIN_API',
        'POST_ADD',
        { ip, competitionId, walletAddress },
        false,
        `Admin verification failed: ${adminVerification.reason}`
      );

      return NextResponse.json(
        { error: 'Unauthorized', details: adminVerification.reason },
        { status: 403 }
      );
    }

    // =========================================================================
    // Layer 5: On-Chain Validation (Competition Exists)
    // =========================================================================
    const competitionCheck = await verifyCompetitionExists(validatedCompId);

    if (!competitionCheck.exists) {
      auditLog(
        'FEATURED_ADMIN_API',
        'POST_ADD',
        { ip, competitionId, walletAddress },
        false,
        `Competition validation failed: ${competitionCheck.reason}`
      );

      return NextResponse.json(
        { error: 'Competition does not exist on-chain', details: competitionCheck.reason },
        { status: 404 }
      );
    }

    // =========================================================================
    // Layer 6: Check if Already Featured
    // =========================================================================
    const { data: existing, error: checkError } = await supabaseAdmin
      .from('featured_competitions')
      .select('competition_id')
      .eq('competition_id', Number(validatedCompId))
      .single();

    if (existing) {
      auditLog(
        'FEATURED_ADMIN_API',
        'POST_ADD',
        { ip, competitionId, walletAddress },
        false,
        'Competition already featured'
      );

      return NextResponse.json(
        { error: 'Competition is already featured' },
        { status: 409 } // Conflict
      );
    }

    // =========================================================================
    // Layer 7: Insert to Database
    // =========================================================================
    const { data, error } = await supabaseAdmin
      .from('featured_competitions')
      // @ts-ignore - Supabase client type inference issue with service role admin
      .insert({
        competition_id: Number(validatedCompId),
        priority: validatedPriority,
        created_by: walletAddress.toLowerCase(),
        notes: notes || null,
      })
      .select()
      .single();

    if (error) {
      auditLog(
        'FEATURED_ADMIN_API',
        'POST_ADD',
        { ip, competitionId, walletAddress },
        false,
        `Database insert failed: ${error.message}`
      );

      return NextResponse.json(
        { error: 'Failed to add featured competition', details: error.message },
        { status: 500 }
      );
    }

    // =========================================================================
    // Success - Audit Log
    // =========================================================================
    auditLog(
      'FEATURED_ADMIN_API',
      'POST_ADD',
      { ip, competitionId, walletAddress, priority: validatedPriority },
      true,
      `Competition #${competitionId} featured successfully`
    );

    return NextResponse.json(
      {
        success: true,
        message: `Competition #${competitionId} featured successfully`,
        data
      },
      { status: 201 }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    auditLog(
      'FEATURED_ADMIN_API',
      'POST_ADD',
      { ip, competitionId, walletAddress },
      false,
      `Unhandled error: ${errorMessage}`
    );

    return NextResponse.json(
      {
        error: 'Failed to add featured competition',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

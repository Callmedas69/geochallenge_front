import { NextResponse } from 'next/server';

export async function GET() {
  console.log('TEST ROUTE HIT');
  return NextResponse.json({
    success: true,
    message: 'Test route working',
    timestamp: new Date().toISOString()
  });
}

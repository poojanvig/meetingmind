import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'

export async function GET() {
  // Monitored files feature is not available in serverless environments
  return NextResponse.json([]);
}

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { fileName: string } }) {
  return NextResponse.json({ error: 'File not found' }, { status: 404 });
}

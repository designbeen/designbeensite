import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    await query('SELECT 1 AS ready');
    return NextResponse.json({ success: true, status: 'ok', database: 'ready' });
  } catch (error) {
    const databaseFailure = error instanceof Error ? error.message : 'Unknown database failure';
    return NextResponse.json({ success: false, status: 'degraded', database: 'unavailable', error: databaseFailure }, { status: 503 });
  }
}

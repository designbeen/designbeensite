import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/services/publicService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getSettings();
    return NextResponse.json({ success: true, data }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

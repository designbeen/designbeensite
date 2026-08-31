import { NextResponse } from 'next/server';
import { getTeam } from '@/lib/services/publicService';

export async function GET() {
  try {
    const data = await getTeam();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

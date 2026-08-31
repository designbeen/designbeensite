import { NextResponse } from 'next/server';
import { getNavigation } from '@/lib/services/publicService';

export async function GET() {
  try {
    const data = await getNavigation();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

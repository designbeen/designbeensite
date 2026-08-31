import { NextResponse } from 'next/server';
import { getHero } from '@/lib/services/publicService';

export async function GET(request, { params }) {
  try {
    const data = await getHero(params.page);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

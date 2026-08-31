import { NextResponse } from 'next/server';
import { getTestimonials } from '@/lib/services/publicService';

export async function GET() {
  try {
    const data = await getTestimonials();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

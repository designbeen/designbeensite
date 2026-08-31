import { NextResponse } from 'next/server';
import { getServiceBySlug } from '@/lib/services/publicService';

export async function GET(request, { params }) {
  try {
    const data = await getServiceBySlug(params.slug);
    if (!data) {
      return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

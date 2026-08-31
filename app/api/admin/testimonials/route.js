import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { listTestimonials, createTestimonial } from '@/lib/services/adminService';

export async function GET(request) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  const data = await listTestimonials();
  return NextResponse.json({ success: true, data });
}

export async function POST(request) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  const body = await request.json();
  const data = await createTestimonial(body);
  return NextResponse.json({ success: true, data }, { status: 201 });
}

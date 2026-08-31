import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getSettings, updateSettings } from '@/lib/services/adminService';

export async function GET(request) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  const data = await getSettings();
  return NextResponse.json({ success: true, data });
}

export async function PUT(request) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  const body = await request.json();
  const data = await updateSettings(body);
  return NextResponse.json({ success: true, data });
}

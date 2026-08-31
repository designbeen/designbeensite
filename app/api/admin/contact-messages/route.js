import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { listContactMessages } from '@/lib/services/adminService';

export async function GET(request) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  const data = await listContactMessages();
  return NextResponse.json({ success: true, data });
}

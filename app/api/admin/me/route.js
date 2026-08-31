import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getSessionUser } from '@/lib/services/adminService';

export async function GET(request) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  const sessionUser = await getSessionUser(user.id);
  if (!sessionUser) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  return NextResponse.json({ success: true, data: sessionUser });
}

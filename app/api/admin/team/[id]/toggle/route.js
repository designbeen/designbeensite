import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { toggleTeamMemberStatus } from '@/lib/services/adminService';

export async function PATCH(request, { params }) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  const data = await toggleTeamMemberStatus(params.id);
  return NextResponse.json({ success: true, data });
}

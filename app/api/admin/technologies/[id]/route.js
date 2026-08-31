import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { updateTechnology, deleteTechnology } from '@/lib/services/adminService';

export async function PUT(request, { params }) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  const body = await request.json();
  const data = await updateTechnology(params.id, body);
  return NextResponse.json({ success: true, data });
}

export async function DELETE(request, { params }) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  const data = await deleteTechnology(params.id);
  return NextResponse.json({ success: true, data });
}

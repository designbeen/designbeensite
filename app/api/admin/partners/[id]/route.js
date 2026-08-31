import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { updatePartner, deletePartner } from '@/lib/services/adminService';

export async function PUT(request, { params }) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  const body = await request.json();
  const data = await updatePartner(params.id, body);
  return NextResponse.json({ success: true, data });
}

export async function DELETE(request, { params }) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  const data = await deletePartner(params.id);
  return NextResponse.json({ success: true, data });
}

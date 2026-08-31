import { NextResponse } from 'next/server';
import { createContactMessage } from '@/lib/services/publicService';

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ success: false, message: 'Name, email, and message are required' }, { status: 400 });
    }

    const ip_address = request.headers.get('x-forwarded-for') || request.ip || null;
    const user_agent = request.headers.get('user-agent') || null;

    const data = await createContactMessage({
      ...body,
      ip_address,
      user_agent,
    });

    return NextResponse.json({ success: true, data, message: 'Message sent successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

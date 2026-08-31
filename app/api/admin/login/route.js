import { NextResponse } from 'next/server';
import { login } from '@/lib/services/adminService';

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await login(body);

    const response = NextResponse.json({
      success: true,
      data: result.user,
      message: 'Logged in successfully',
    });

    response.cookies.set('auth_token', result.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    const statusCode = error.statusCode || 400;
    return NextResponse.json({ success: false, message: error.message }, { status: statusCode });
  }
}

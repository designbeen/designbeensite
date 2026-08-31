import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production-jwt-secret-key-12345';

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function getAuthUser(request) {
  let token = null;

  if (request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    if (!token && request.cookies) {
      token = request.cookies.get('auth_token')?.value;
    }
  }

  if (!token) {
    try {
      const cookieStore = cookies();
      token = cookieStore.get('auth_token')?.value;
    } catch (e) {
      // Cookies not accessible in context
    }
  }

  if (!token) return null;
  return verifyToken(token);
}

export function requireAuth(handler) {
  return async (request, context) => {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }
    return handler(request, context, user);
  };
}

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const id = Number.parseInt(params.id, 10);
    if (!id || Number.isNaN(id)) {
      return new Response('Invalid upload ID', { status: 400 });
    }

    const [rows] = await query('SELECT mime_type, data FROM uploads WHERE id = ? LIMIT 1', [id]);
    const row = rows[0];

    if (!row) {
      return new Response('File not found', { status: 404 });
    }

    return new Response(row.data, {
      status: 200,
      headers: {
        'Content-Type': row.mime_type || 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving upload:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

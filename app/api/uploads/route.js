import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function POST(request) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') || formData.get('image') || formData.get('coverImage') || formData.get('avatar') || formData.get('logoFile') || formData.get('iconFile');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    const filename = file.name || 'upload.png';
    const mimeType = file.type || 'image/png';
    const buffer = Buffer.from(await file.arrayBuffer());
    const sizeBytes = buffer.length;

    const [result] = await query(
      `INSERT INTO uploads (filename, mime_type, data, size_bytes) VALUES (?, ?, ?, ?)`,
      [filename, mimeType, buffer, sizeBytes]
    );

    const uploadUrl = `/api/uploads/${result.insertId}`;

    return NextResponse.json({
      success: true,
      url: uploadUrl,
      data: {
        id: result.insertId,
        url: uploadUrl,
        filename,
      },
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

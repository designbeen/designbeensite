import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/services/publicService';

export async function GET() {
  try {
    const data = await getProjects();
    return NextResponse.json({ success: true, data }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

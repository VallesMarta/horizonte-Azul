import { NextResponse } from 'next/server';
import { getApiDocs } from '@/lib/swagger';

// Esto obliga a Next.js a generar el JSON siempre de nuevo
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const spec = getApiDocs();
    return NextResponse.json(spec);
  } catch (error) {
    return NextResponse.json({ error: "Error generando spec" }, { status: 500 });
  }
}
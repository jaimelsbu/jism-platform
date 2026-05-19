// app/api/init-db/route.ts
// Visit /api/init-db?secret=YOUR_SECRET once after first deploy to create tables.
// Protected by a secret so random people can't call it.
import { NextRequest, NextResponse } from 'next/server';
import { initDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');

  if (!secret || secret !== process.env.INIT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await initDb();
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    console.error('[init-db]', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

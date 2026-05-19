// app/api/events/route.ts
// Receives tracker events from client websites and stores in Vercel Postgres
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// Allow requests from any origin (clients embed tracker on their own sites)
const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function POST(req: NextRequest) {
  try {
    let body: Record<string, unknown>;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: CORS });
    }

    const { siteId, sessionId, pageId, type, url, device, ts, meta } = body as {
      siteId:    string;
      sessionId: string;
      pageId:    string;
      type:      string;
      url:       string;
      device:    string;
      ts:        number;
      meta:      Record<string, unknown>;
    };

    // Basic validation
    if (!siteId || !sessionId || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400, headers: CORS });
    }

    // Sanitize
    const safeSiteId    = String(siteId).slice(0, 100);
    const safeSessionId = String(sessionId).slice(0, 100);
    const safePageId    = String(pageId || '').slice(0, 100);
    const safeType      = String(type).slice(0, 50);
    const safeUrl       = String(url || '').slice(0, 500);
    const safeDevice    = String(device || 'unknown').slice(0, 20);
    const safeTs        = typeof ts === 'number' ? ts : Date.now();
    const safeMeta      = meta && typeof meta === 'object' ? meta : {};

    await sql`
      INSERT INTO vek_events
        (site_id, session_id, page_id, type, url, device, ts, meta)
      VALUES
        (${safeSiteId}, ${safeSessionId}, ${safePageId}, ${safeType},
         ${safeUrl}, ${safeDevice}, ${safeTs}, ${JSON.stringify(safeMeta)})
    `;

    return NextResponse.json({ ok: true }, { headers: CORS });

  } catch (err) {
    console.error('[events API]', err);
    // Always return 200 to tracker — don't break client sites on DB errors
    return NextResponse.json({ ok: true, warn: 'stored_failed' }, { headers: CORS });
  }
}

// /Users/jaimehernan/jism-platform/app/api/events/route.ts
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Permite peticiones desde cualquier origen (necesario para que los clientes envíen eventos)
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Manejo de peticiones preflight OPTIONS
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Tracker v2.0 envia estos campos estructurados
    const {
      siteId,
      sessionId,
      pageId,
      type,
      url,
      device,
      ts,
      meta,
    } = payload;

    if (!siteId || !type) {
      return new NextResponse('Missing required fields', { status: 400, headers: CORS_HEADERS });
    }

    const sql = neon(process.env.DATABASE_URL!);

    // 1. Validar si el sitio existe en Neon
    const sites = await sql`
      SELECT id, domain, plan, trial_ends
      FROM vek_sites
      WHERE id = ${siteId}
      LIMIT 1
    `;

    const site = sites[0];
    if (!site) {
      return new NextResponse('Site not found', { status: 404, headers: CORS_HEADERS });
    }

    // 2. Validación de Dominio (Se salta en localhost/desarrollo)
    const origin = request.headers.get('origin') || request.headers.get('referer') || '';
    const isDev = origin.includes('localhost') || origin.includes('127.0.0.1');

    if (!isDev && !origin.includes(site.domain)) {
      return new NextResponse('Unauthorized domain', { status: 403, headers: CORS_HEADERS });
    }

    // 3. Insertar el evento mapeando to_timestamp de forma segura para Neon
    await sql`
      INSERT INTO vek_events (site_id, session_id, page_id, type, url, device, ts, meta)
      VALUES (
        ${siteId},
        ${sessionId || null},
        ${pageId   || null},
        ${type},
        ${url      || null},
        ${device   || null},
        ${ts || Date.now()},
        ${JSON.stringify(meta || {})}
      )
    `;

    return NextResponse.json({ ok: true }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error('[vektorq/events]', error);
    // Respondemos con éxito simulado para no romper la ejecución de la web del cliente si falla Neon
    return NextResponse.json({ ok: true, warn: 'ingest_error' }, { headers: CORS_HEADERS });
  }
}
import { NextResponse } from 'next/server';
// import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { projectId, eventData } = payload; // projectId sent is 'maria-nails'
    
    // 1. Identify where the web request is originating from
    const origin = request.headers.get('origin') || request.headers.get('referer');
    if (!origin) {
      return new NextResponse('Missing Origin Header', { status: 403 });
    }

    // 2. Query Neon to match the configuration rules
    // const sql = neon(process.env.DATABASE_URL);
    // const sites = await sql`SELECT domain FROM vek_sites WHERE id = ${projectId} LIMIT 1`;
    // const site = sites[0];
    const mockSite = { id: 'maria-nails', domain: 'marianails.ca' }; // Mock database response

    if (!mockSite) {
      return new NextResponse('Project Profile Not Found', { status: 404 });
    }

    // 3. SECURITY CHECK: Domain Validation
    // Checks if 'marianails.ca' is present within the real originating web request URL
    if (!origin.includes(mockSite.domain)) {
      return new NextResponse('Security Violation: Unauthorized Host Domain', { status: 403 });
    }

    // 4. SOFT LOCK SUCCESS ACTION:
    // We intentionally skip checking the "trial_ends" date here so that data 
    // continues saving seamlessly into vek_events.
    /*
    await sql`
      INSERT INTO vek_events (site_id, session_id, page_id, type, url, device, ts, meta)
      VALUES (${projectId}, ${eventData.sessionId}, ${eventData.pageId}, ${eventData.type}, ${eventData.url}, ${eventData.device}, ${eventData.ts}, ${JSON.stringify(eventData.meta)})
    `;
    */

    return NextResponse.json({ success: true, message: 'Telemetry logged securely' });
  } catch (error) {
    return new NextResponse('Internal API Error', { status: 500 });
  }
}
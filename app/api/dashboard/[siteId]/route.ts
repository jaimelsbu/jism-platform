// app/api/dashboard/[siteId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  getOverview, getPageBreakdown, getRageClicks, getDeadClicks,
  getDeviceSplit, getDailyTrend, getFunnel, getSiteInfo,
} from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const { siteId } = await params;
  const days = parseInt(req.nextUrl.searchParams.get('days') || '30');

  try {
    const [overview, pages, rage, dead, devices, trend, funnel, site] = await Promise.all([
      getOverview(siteId, days),
      getPageBreakdown(siteId, days),
      getRageClicks(siteId, days),
      getDeadClicks(siteId, days),
      getDeviceSplit(siteId, days),
      getDailyTrend(siteId, days),
      getFunnel(siteId, days),
      getSiteInfo(siteId),
    ]);

    return NextResponse.json({ overview, pages, rage, dead, devices, trend, funnel, site });
  } catch (err) {
    console.error('[dashboard API]', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

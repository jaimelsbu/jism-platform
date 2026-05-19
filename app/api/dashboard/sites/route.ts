// app/api/dashboard/sites/route.ts
import { NextResponse } from 'next/server';
import { getAllSites } from '@/lib/db';

export async function GET() {
  try {
    const sites = await getAllSites();
    return NextResponse.json({ sites });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

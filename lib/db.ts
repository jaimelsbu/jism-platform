// /Users/jaimehernan/jism-platform/lib/db.ts
// ─────────────────────────────────────────────────────────────────────────────
// NEON Postgres Integration Engine for VektorQ
// ─────────────────────────────────────────────────────────────────────────────
import { neon } from '@neondatabase/serverless';

// Inicializa el cliente funcional de Neon Postgres utilizando la variable de entorno
const sql = neon(process.env.DATABASE_URL!);

// ── Schema Setup ──────────────────────────────────────────────────────────────
export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS vek_events (
      id          BIGSERIAL PRIMARY KEY,
      site_id     TEXT        NOT NULL,
      session_id  TEXT        NOT NULL,
      page_id     TEXT        NOT NULL,
      type        TEXT        NOT NULL,
      url         TEXT,
      device      TEXT,
      ts          BIGINT,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      meta        JSONB       NOT NULL DEFAULT '{}'
    );
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_vek_site_id    ON vek_events (site_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_vek_type       ON vek_events (type);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_vek_created_at ON vek_events (created_at DESC);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_vek_session    ON vek_events (session_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_vek_site_type  ON vek_events (site_id, type);`;

  await sql`
    CREATE TABLE IF NOT EXISTS vek_sites (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      domain      TEXT,
      client_name TEXT,
      client_email TEXT,
      plan        TEXT DEFAULT 'trial',
      trial_ends  TIMESTAMPTZ,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  return { ok: true };
}

// ── Query helpers ─────────────────────────────────────────────────────────────

// /Users/jaimehernan/jism-platform/lib/db.ts (Sección de Helpers)

export async function getOverview(siteId: string, days = 30) {
  const rows = await sql`
    SELECT
      COUNT(*)::int                                         AS total_events,
      COUNT(*) FILTER (WHERE type = 'pageview')::int        AS pageviews,
      COUNT(DISTINCT session_id)::int                       AS sessions,
      COUNT(*) FILTER (WHERE type = 'click')::int           AS clicks,
      COUNT(*) FILTER (WHERE meta->>'rage' = 'true')::int   AS rage_clicks,
      COUNT(*) FILTER (WHERE meta->>'dead' = 'true')::int   AS dead_clicks,
      COUNT(*) FILTER (WHERE type = 'form_submit')::int     AS form_submits,
      COUNT(*) FILTER (WHERE type = 'form_abandon')::int    AS form_abandons,
      COALESCE(ROUND(AVG(
        CASE WHEN type = 'pageleave'
        THEN (meta->>'timeOnPageMs')::numeric / 1000 END
      )), 0)::int                                           AS avg_time_on_page_s,
      COALESCE(ROUND(AVG(
        CASE WHEN type = 'pageleave'
        THEN (meta->>'scrollDepth')::numeric END
      )), 0)::int                                           AS avg_scroll_depth
    FROM vek_events
    WHERE site_id = ${siteId}
      AND created_at > NOW() - (${days} * INTERVAL '1 day')
  `;
  return rows[0];
}

export async function getPageBreakdown(siteId: string, days = 30) {
  return await sql`
    SELECT
      url,
      COUNT(*) FILTER (WHERE type = 'pageview')::int     AS views,
      COUNT(DISTINCT session_id)::int                    AS uniq_sessions,
      COALESCE(ROUND(AVG(
        CASE WHEN type = 'pageleave'
        THEN (meta->>'scrollDepth')::numeric END
      )), 0)::int                                        AS avg_scroll,
      COALESCE(ROUND(AVG(
        CASE WHEN type = 'pageleave'
        THEN (meta->>'timeOnPageMs')::numeric / 1000 END
      )), 0)::int                                        AS avg_time_s
    FROM vek_events
    WHERE site_id = ${siteId}
      AND created_at > NOW() - (${days} * INTERVAL '1 day')
    GROUP BY url
    ORDER BY views DESC
    LIMIT 20
  `;
}

export async function getDeviceSplit(siteId: string, days = 30) {
  return await sql`
    SELECT
      device,
      COUNT(DISTINCT session_id)::int AS sessions
    FROM vek_events
    WHERE site_id = ${siteId}
      AND type = 'pageview'
      AND created_at > NOW() - (${days} * INTERVAL '1 day')
    GROUP BY device
  `;
}

export async function getRageClicks(siteId: string, days = 30) {
  return await sql`
    SELECT
      meta->>'text'   AS element_text,
      meta->>'tag'    AS element_tag,
      meta->>'cls'    AS element_class,
      url,
      COUNT(*)::int        AS rage_count
    FROM vek_events
    WHERE site_id = ${siteId}
      AND type = 'click'
      AND meta->>'rage' = 'true'
      AND created_at > NOW() - (${days} * INTERVAL '1 day')
    GROUP BY meta->>'text', meta->>'tag', meta->>'cls', url
    ORDER BY rage_count DESC
    LIMIT 10
  `;
}

export async function getDeadClicks(siteId: string, days = 30) {
  return await sql`
    SELECT
      meta->>'text'   AS element_text,
      meta->>'tag'    AS element_tag,
      meta->>'cls'    AS element_class,
      url,
      COUNT(*)::int        AS dead_count
    FROM vek_events
    WHERE site_id = ${siteId}
      AND type = 'click'
      AND meta->>'dead' = 'true'
      AND created_at > NOW() - (${days} * INTERVAL '1 day')
    GROUP BY meta->>'text', meta->>'tag', meta->>'cls', url
    ORDER BY dead_count DESC
    LIMIT 10
  `;
}

export async function getClickHeatmap(siteId: string, url: string, days = 30) {
  return await sql`
    SELECT
      (meta->>'x')::int    AS x,
      (meta->>'y')::int    AS y,
      (meta->>'xPx')::int  AS x_px,
      (meta->>'yPx')::int  AS y_px,
      meta->>'text'        AS text,
      meta->>'href'        AS href,
      COUNT(*)::int             AS count
    FROM vek_events
    WHERE site_id = ${siteId}
      AND type    = 'click'
      AND url     = ${url}
      AND created_at > NOW() - (${days} * INTERVAL '1 day')
    GROUP BY
      (meta->>'x')::int,
      (meta->>'y')::int,
      (meta->>'xPx')::int,
      (meta->>'yPx')::int,
      meta->>'text',
      meta->>'href'
    ORDER BY count DESC
    LIMIT 200
  `;
}

export async function getDailyTrend(siteId: string, days = 30) {
  return await sql`
    SELECT
      TO_CHAR(created_at, 'YYYY-MM-DD')               AS day,
      COUNT(*) FILTER (WHERE type = 'pageview')::int   AS pageviews,
      COUNT(DISTINCT session_id)::int                  AS sessions
    FROM vek_events
    WHERE site_id = ${siteId}
      AND created_at > NOW() - (${days} * INTERVAL '1 day')
    GROUP BY TO_CHAR(created_at, 'YYYY-MM-DD')
    ORDER BY day ASC
  `;
}

export async function getFunnel(siteId: string, days = 30) {
  const rows = await sql`
    SELECT
      COUNT(DISTINCT session_id)::int                                           AS total_sessions,
      COUNT(DISTINCT session_id) FILTER (
        WHERE url NOT IN ('/', '')
      )::int                                                                    AS visited_inner_page,
      COUNT(DISTINCT session_id) FILTER (
        WHERE type = 'form_field_focus'
      )::int                                                                    AS started_form,
      COUNT(DISTINCT session_id) FILTER (
        WHERE type = 'form_submit'
      )::int                                                                    AS submitted_form
    FROM vek_events
    WHERE site_id = ${siteId}
      AND created_at > NOW() - (${days} * INTERVAL '1 day')
  `;
  return rows[0];
}

export async function getReferrers(siteId: string, days = 30) {
  return await sql`
    SELECT
      COALESCE(meta->>'referrer', 'direct') AS referrer,
      COUNT(DISTINCT session_id)::int            AS sessions
    FROM vek_events
    WHERE site_id = ${siteId}
      AND type = 'pageview'
      AND created_at > NOW() - (${days} * INTERVAL '1 day')
    GROUP BY meta->>'referrer'
    ORDER BY sessions DESC
    LIMIT 10
  `;
}

export async function getSiteInfo(siteId: string) {
  const rows = await sql`SELECT id, name, domain, plan, trial_ends FROM vek_sites WHERE id = ${siteId}`;
  return rows[0] || null;
}

export async function getAllSites() {
  return await sql`
    SELECT s.id, s.name, s.domain, s.plan, s.trial_ends,
      (SELECT COUNT(DISTINCT session_id) FROM vek_events
       WHERE site_id = s.id AND created_at > NOW() - INTERVAL '30 days')::int
       AS sessions_30d
    FROM vek_sites s
    ORDER BY s.created_at DESC
  `;
}
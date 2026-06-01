'use client';
// app/dashboard/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// VEKTORQ Dashboard
// Handles both Master Admin View and Secure Isolated Client Secret URLs.
// Visit: vektorq.com/dashboard (Admin) or vektorq.com/dashboard?client=maria-nails (Client)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────
type Site = {
  id: string; 
  name: string; 
  domain: string;
  client_name: string; 
  plan: string; 
  sessions_30d: number;
  trial_ends?: string; 
};

type Overview = {
  pageviews: string; sessions: string; clicks: string;
  rage_clicks: string; dead_clicks: string;
  form_submits: string; form_abandons: string;
  avg_time_on_page_s: string; avg_scroll_depth: string;
};

type PageRow  = { url: string; views: string; uniq_sessions: string; avg_scroll: string; avg_time_s: string };
type RageRow  = { element_text: string; element_tag: string; url: string; rage_count: string };
type DeadRow  = { element_text: string; element_tag: string; url: string; dead_count: string };
type DeviceRow = { device: string; sessions: string };
type TrendRow  = { day: string; pageviews: string; sessions: string };
type FunnelRow = { total_sessions: string; visited_inner_page: string; started_form: string; submitted_form: string };

type DashData = {
  overview: Overview;
  pages: PageRow[];
  rage: RageRow[];
  dead: DeadRow[];
  devices: DeviceRow[];
  trend: TrendRow[];
  funnel: FunnelRow;
};

// ── Password gate ─────────────────────────────────────────────────────────────
const DASH_PASSWORD = process.env.NEXT_PUBLIC_DASH_PASSWORD || 'vektorq2026';

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [pw, setPw]   = useState('');
  const [err, setErr] = useState(false);

  const attempt = () => {
    if (pw === DASH_PASSWORD) { onUnlock(); }
    else { setErr(true); setTimeout(() => setErr(false), 1500); }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0d0d0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{
        background: '#131314', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 20, padding: '48px 40px', width: 360, textAlign: 'center',
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12, margin: '0 auto 20px',
          background: 'linear-gradient(135deg,#4d8eff,#9b59ff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, fontWeight: 700, color: '#fff',
        }}>V</div>
        <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: '0 0 6px' }}>
          VEKTORQ Dashboard
        </h1>
        <p style={{ color: '#9ca3b0', fontSize: 13, margin: '0 0 28px' }}>
          Enter your access password
        </p>
        <input
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && attempt()}
          placeholder="Password"
          style={{
            width: '100%', padding: '12px 16px', borderRadius: 10,
            background: '#0e0e0f', border: err
              ? '1px solid rgba(255,75,75,0.5)'
              : '1px solid rgba(255,255,255,0.08)',
            color: '#fff', fontSize: 14, outline: 'none',
            boxSizing: 'border-box', marginBottom: 12,
          }}
        />
        <button
          onClick={attempt}
          style={{
            width: '100%', padding: '12px', borderRadius: 10,
            background: 'linear-gradient(135deg,#4d8eff,#9b59ff)',
            color: '#fff', fontWeight: 700, fontSize: 14,
            border: 'none', cursor: 'pointer',
          }}
        >
          Enter Dashboard
        </button>
        {err && <p style={{ color: '#ff6b6b', fontSize: 12, marginTop: 10 }}>Incorrect password</p>}
      </div>
    </div>
  );
}

// ── Stat card ──────────────────────────────────────────────────────────────────
function Stat({ label, value, sub, color, alert }: {
  label: string; value: string | number; sub?: string;
  color?: string; alert?: boolean;
}) {
  return (
    <div style={{
      background: '#131314',
      border: `1px solid ${alert ? 'rgba(255,100,100,0.3)' : 'rgba(255,255,255,0.07)'}`,
      borderRadius: 14, padding: '20px 22px',
    }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#424754', margin: '0 0 8px' }}>
        {label}
      </p>
      <p style={{ fontSize: 28, fontWeight: 700, color: color || (alert ? '#ff6b6b' : '#fff'), margin: 0, letterSpacing: '-0.02em' }}>
        {value ?? '—'}
      </p>
      {sub && <p style={{ fontSize: 11, color: '#424754', margin: '4px 0 0' }}>{sub}</p>}
    </div>
  );
}

// ── Mini bar chart ─────────────────────────────────────────────────────────────
function TrendChart({ data }: { data: TrendRow[] }) {
  if (!data || !data.length) return <p style={{ color: '#424754', fontSize: 13 }}>No data yet</p>;
  const max = Math.max(...data.map(d => parseInt(d.pageviews) || 0), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 60 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <div style={{
            width: '100%', borderRadius: '3px 3px 0 0',
            height: Math.max(3, ((parseInt(d.pageviews) || 0) / max) * 54),
            background: i === data.length - 1
              ? 'linear-gradient(180deg,#4d8eff,#9b59ff)'
              : 'rgba(255,255,255,0.1)',
          }} />
        </div>
      ))}
    </div>
  );
}

// ── Funnel ─────────────────────────────────────────────────────────────────────
function Funnel({ data }: { data: FunnelRow }) {
  if (!data) return null;
  const total    = parseInt(data.total_sessions)     || 0;
  const inner    = parseInt(data.visited_inner_page) || 0;
  const started  = parseInt(data.started_form)       || 0;
  const submitted = parseInt(data.submitted_form)    || 0;
  const pct = (n: number) => total > 0 ? Math.round((n / total) * 100) : 0;

  const steps = [
    { label: 'Visited site',    n: total,     color: '#4d8eff' },
    { label: 'Explored pages',  n: inner,     color: '#7b6fff' },
    { label: 'Started booking', n: started,   color: '#9b59ff' },
    { label: 'Completed',       n: submitted, color: '#34d399' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {steps.map((s, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: '#9ca3b0' }}>{s.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>
              {s.n} <span style={{ color: '#424754', fontWeight: 400 }}>({pct(s.n)}%)</span>
            </span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.05)' }}>
            <div style={{
              height: '100%', borderRadius: 3,
              width: pct(s.n) + '%',
              background: s.color,
              transition: 'width 0.6s ease',
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Device breakdown ──────────────────────────────────────────────────────────
function DeviceBreakdown({ data }: { data: DeviceRow[] }) {
  if (!data || !data.length) return <p style={{ color: '#424754', fontSize: 13 }}>No data</p>;
  const total = data.reduce((s, d) => s + parseInt(d.sessions), 0);
  const colors: Record<string, string> = {
    mobile: '#4d8eff', desktop: '#9b59ff', tablet: '#ffb786',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {data.map(d => {
        const pct = total > 0 ? Math.round((parseInt(d.sessions) / total) * 100) : 0;
        return (
          <div key={d.device}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 12, color: '#9ca3b0', textTransform: 'capitalize' }}>{d.device}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{pct}%</span>
            </div>
            <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.05)' }}>
              <div style={{
                height: '100%', borderRadius: 3,
                width: pct + '%',
                background: colors[d.device] || '#424754',
                transition: 'width 0.6s ease',
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Alert badge ───────────────────────────────────────────────────────────────
function AlertBadge({ type, count, text }: { type: 'rage' | 'dead'; count: number; text: string }) {
  const colors = {
    rage: { bg: 'rgba(255,100,100,0.08)', border: 'rgba(255,100,100,0.25)', text: '#ff6b6b', icon: '😤' },
    dead: { bg: 'rgba(255,183,134,0.08)', border: 'rgba(255,183,134,0.25)', text: '#ffb786', icon: '🖱️' },
  };
  const c = colors[type];
  return (
    <div style={{
      background: c.bg, border: `1px solid ${c.border}`,
      borderRadius: 10, padding: '12px 14px',
      display: 'flex', alignItems: 'flex-start', gap: 10,
    }}>
      <span style={{ fontSize: 16 }}>{c.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: c.text, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {type === 'rage' ? 'Rage Click' : 'Dead Click'} ×{count}
        </p>
        <p style={{ fontSize: 12, color: '#9ca3b0', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {text || '(no text)'}
        </p>
      </div>
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [isClientMode, setIsClientMode] = useState(false);
  const [sites, setSites]       = useState<Site[]>([]);
  const [activeSite, setActiveSite] = useState<string | null>(null);
  const [days, setDays]         = useState(30);
  const [data, setData]         = useState<DashData | null>(null);
  const [loading, setLoading]   = useState(false);
  const [tab, setTab]           = useState<'overview' | 'pages' | 'alerts' | 'funnel'>('overview');

  // Check URL Search Params on initial page setup
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const clientParam = params.get('client');

    if (clientParam) {
      // Secret URL is active! Bypass the global admin password screen
      setIsClientMode(true);
      setUnlocked(true);
      setActiveSite(clientParam);
    }
  }, []);

  // Fetch system site configurations profiles
  useEffect(() => {
    if (!unlocked) return;
    
    fetch('/api/dashboard/sites')
      .then(r => r.json())
      .then(d => {
        setSites(d.sites || []);
        // If we are looking as the admin master account, set up the default view index
        if (d.sites?.length && !isClientMode) {
          setActiveSite(d.sites[0].id);
        }
      })
      .catch(console.error);
  }, [unlocked, isClientMode]);

  // Load site telemetry data blocks when active site values shift
  const loadData = useCallback(async () => {
    if (!activeSite) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/dashboard/${activeSite}?days=${days}`);
      const d = await r.json();
      setData(d);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [activeSite, days]);

  useEffect(() => { loadData(); }, [loadData]);

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

  // Find metadata matching current view selection
  const currentSiteProfile = sites.find(s => s.id === activeSite);

  // Soft Lock Rule: Evaluate if trial timestamp window has run out
  const isTrialExpired = currentSiteProfile?.trial_ends 
    ? new Date() > new Date(currentSiteProfile.trial_ends)
    : false;

  const ov = data?.overview;

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d0f', color: '#e5e2e3', fontFamily: 'system-ui, sans-serif', position: 'relative' }}>

      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(13,13,15,0.92)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 24px',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'linear-gradient(135deg,#4d8eff,#9b59ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 13, color: '#fff',
            }}>V</div>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>VEKTORQ</span>
            <span style={{ fontSize: 11, color: '#424754', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 20 }}>
              {isClientMode ? 'Customer Insights Portal' : 'Admin Console'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Admin Site Dropdown Selector — Hidden if accessing via client secret parameter */}
            {sites.length > 0 && !isClientMode && (
              <select
                value={activeSite || ''}
                onChange={e => setActiveSite(e.target.value)}
                style={{
                  background: '#131314', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#e5e2e3', padding: '6px 12px', borderRadius: 8, fontSize: 13,
                  outline: 'none', cursor: 'pointer',
                }}
              >
                {sites.map(s => (
                  <option key={s.id} value={s.id}>{s.name || s.domain}</option>
                ))}
              </select>
            )}

            {/* Days selector */}
            <select
              value={days}
              onChange={e => setDays(Number(e.target.value))}
              style={{
                background: '#131314', border: '1px solid rgba(255,255,255,0.1)',
                color: '#e5e2e3', padding: '6px 10px', borderRadius: 8, fontSize: 13,
                outline: 'none', cursor: 'pointer',
              }}
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            {!isClientMode && <a href="/" style={{ fontSize: 12, color: '#424754', textDecoration: 'none' }}>← Home</a>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 24px' }}>

        {/* Catch empty admin states */}
        {sites.length === 0 && !loading && !isClientMode && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: 32 }}>📊</p>
            <h2 style={{ color: '#fff', marginBottom: 8 }}>No clients yet</h2>
            <p style={{ color: '#9ca3b0', fontSize: 14, maxWidth: 400, margin: '0 auto 24px' }}>
              Add your first client site into Neon database, then send over their code script.
            </p>
          </div>
        )}

        {activeSite && (
          <>
            {/* Header Text Blocks */}
            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: 0 }}>
                  {currentSiteProfile ? currentSiteProfile.name : 'Loading Workspace...'}
                </h1>
                <p style={{ fontSize: 13, color: '#9ca3b0', margin: '3px 0 0' }}>
                  {currentSiteProfile?.domain} ·{' '}
                  <span style={{ color: isTrialExpired ? '#ff6b6b' : '#34d399' }}>
                    {currentSiteProfile?.plan} {isTrialExpired ? '(Trial Expired)' : 'plan'}
                  </span>
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {/* Generate PDF Button hidden from view if it is an untrusted client dashboard visitor */}
                {!isClientMode && (
                  <a
                    href={`/proposal?prefill=${activeSite}`}
                    style={{
                      padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                      background: isTrialExpired ? '#424754' : 'linear-gradient(135deg,#4d8eff,#9b59ff)',
                      color: '#fff', textDecoration: 'none',
                      pointerEvents: isTrialExpired ? 'none' : 'auto',
                      opacity: isTrialExpired ? 0.5 : 1,
                    }}
                  >
                    Generate Report PDF
                  </a>
                )}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 0 }}>
              {(['overview', 'pages', 'alerts', 'funnel'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => !isTrialExpired && setTab(t)}
                  disabled={isTrialExpired}
                  style={{
                    padding: '8px 18px', borderRadius: '8px 8px 0 0',
                    background: tab === t ? '#131314' : 'transparent',
                    border: tab === t ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
                    borderBottom: tab === t ? '1px solid #0d0d0f' : 'none',
                    color: isTrialExpired ? '#2c2e35' : (tab === t ? '#fff' : '#9ca3b0'),
                    fontSize: 13, fontWeight: tab === t ? 600 : 400,
                    cursor: isTrialExpired ? 'not-allowed' : 'pointer',
                    textTransform: 'capitalize',
                    marginBottom: -1,
                  }}
                >
                  {t === 'alerts' && (data?.rage?.length || data?.dead?.length) ? `⚠ ${t}` : t}
                </button>
              ))}
            </div>

            {loading && (
              <div style={{ textAlign: 'center', padding: 60, color: '#424754' }}>
                Querying server analytics database...
              </div>
            )}

            {/* Interactive Soft Lock UI Shield overlay */}
            <div style={{ position: 'relative' }}>
              {isTrialExpired && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, minHeight: 350,
                  backgroundColor: 'rgba(13,13,15,0.65)', backdropFilter: 'blur(6px)',
                  zIndex: 40, borderRadius: 14, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', padding: 24, boxSizing: 'border-box'
                }}>
                  <div style={{
                    maxWidth: 400, padding: 32, textAlign: 'center',
                    background: '#121214', border: '1px solid rgba(77,142,255,0.15)',
                    borderRadius: 16, boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                  }}>
                    <div style={{ fontSize: 40, marginBottom: 16 }}>📊</div>
                    <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: '0 0 10px' }}>
                      Your Free Trial Has Wrapped Up
                    </h3>
                    <p style={{ color: '#9ca3b0', fontSize: 13, lineHeight: '1.6', margin: '0 0 20px' }}>
                      VEKTORQ is still securely collecting your site clickmaps and drop-off histories in the background. Upgrade your subscription to unlock your tracking reports instantly without losing historical records.
                    </p>
                    <a 
                      href="mailto:jachircano@yahoo.com?subject=Upgrade Vektorq Plan"
                      style={{
                        display: 'block', width: '100%', padding: '12px 0', borderRadius: 10,
                        background: 'linear-gradient(135deg,#4d8eff,#9b59ff)', textDecoration: 'none',
                        color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer'
                      }}
                    >
                      Contact to Unlock Reports
                    </a>
                  </div>
                </div>
              )}

              {/* Graphic charts engine block (Burs if isTrialExpired = true) */}
              <div style={{ 
                filter: isTrialExpired ? 'blur(5px)' : 'none',
                pointerEvents: isTrialExpired ? 'none' : 'auto',
                userSelect: isTrialExpired ? 'none' : 'auto',
                transition: 'filter 0.3s ease'
              }}>
                {!loading && data && (
                  <>
                    {/* OVERVIEW TAB */}
                    {tab === 'overview' && (
                      <div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
                          <Stat label="Sessions"      value={ov?.sessions || 0}        color="#4d8eff" />
                          <Stat label="Page Views"    value={ov?.pageviews || 0}       color="#7b6fff" />
                          <Stat label="Clicks"        value={ov?.clicks || 0}          />
                          <Stat label="Avg Time"      value={(ov?.avg_time_on_page_s || 0) + 's'} sub="on page" />
                          <Stat label="Scroll Depth"  value={(ov?.avg_scroll_depth || 0) + '%'} sub="avg reached" />
                          <Stat label="Form Submits"  value={ov?.form_submits || 0}    color="#34d399" />
                          <Stat label="Rage Clicks"   value={ov?.rage_clicks || 0}     alert={(parseInt(ov?.rage_clicks || '0')) > 0} />
                          <Stat label="Dead Clicks"   value={ov?.dead_clicks || 0}     alert={(parseInt(ov?.dead_clicks || '0')) > 0} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                          {/* Trend */}
                          <div style={{ background: '#131314', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 20 }}>
                            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#424754', margin: '0 0 16px' }}>
                              Daily Trend — Page Views
                            </p>
                            <TrendChart data={data.trend} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                              <span style={{ fontSize: 10, color: '#424754' }}>{data.trend[0]?.day}</span>
                              <span style={{ fontSize: 10, color: '#424754' }}>{data.trend[data.trend.length - 1]?.day}</span>
                            </div>
                          </div>

                          {/* Devices */}
                          <div style={{ background: '#131314', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 20 }}>
                            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#424754', margin: '0 0 16px' }}>
                              Device Breakdown
                            </p>
                            <DeviceBreakdown data={data.devices} />
                            <p style={{ fontSize: 11, color: '#424754', marginTop: 14 }}>
                              Most small business customers browse on mobile.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PAGES TAB */}
                    {tab === 'pages' && (
                      <div style={{ background: '#131314', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                              {['Page URL', 'Views', 'Sessions', 'Avg Scroll', 'Avg Time'].map(h => (
                                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#424754' }}>
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {data.pages.map((p, i) => (
                              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                <td style={{ padding: '11px 16px', color: '#6ea8fe', fontFamily: 'monospace', fontSize: 12 }}>{p.url || '/'}</td>
                                <td style={{ padding: '11px 16px', color: '#fff', fontWeight: 600 }}>{p.views}</td>
                                <td style={{ padding: '11px 16px', color: '#9ca3b0' }}>{p.uniq_sessions}</td>
                                <td style={{ padding: '11px 16px', color: parseInt(p.avg_scroll) < 40 ? '#ff6b6b' : '#34d399' }}>{p.avg_scroll}%</td>
                                <td style={{ padding: '11px 16px', color: '#9ca3b0' }}>{p.avg_time_s}s</td>
                              </tr>
                            ))}
                            {!data.pages.length && (
                              <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#424754' }}>No page data yet</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* ALERTS TAB */}
                    {tab === 'alerts' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div>
                          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#ff6b6b', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                            😤 Rage Clicks
                            <span style={{ fontSize: 11, color: '#424754', fontWeight: 400 }}>— users clicking frantically</span>
                          </h3>
                          {data.rage.length === 0 && <p style={{ color: '#34d399', fontSize: 13 }}>✓ No rage clicks detected</p>}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {data.rage.map((r, i) => (
                              <AlertBadge key={i} type="rage" count={parseInt(r.rage_count)} text={r.element_text || r.element_tag} />
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#ffb786', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                            🖱️ Dead Clicks
                            <span style={{ fontSize: 11, color: '#424754', fontWeight: 400 }}>— clicking non-interactive elements</span>
                          </h3>
                          {data.dead.length === 0 && <p style={{ color: '#34d399', fontSize: 13 }}>✓ No dead clicks detected</p>}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {data.dead.map((d, i) => (
                              <AlertBadge key={i} type="dead" count={parseInt(d.dead_count)} text={d.element_text || d.element_tag} />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* FUNNEL TAB */}
                    {tab === 'funnel' && (
                      <div style={{ maxWidth: 480 }}>
                        <div style={{ background: '#131314', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24 }}>
                          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#424754', margin: '0 0 20px' }}>
                            Visitor Funnel
                          </p>
                          <Funnel data={data.funnel} />
                          <p style={{ fontSize: 12, color: '#424754', marginTop: 20 }}>
                            This shows how many visitors reach each stage of your booking process.
                            A big drop between stages = something to fix.
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
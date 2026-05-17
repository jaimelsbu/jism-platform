'use client';

// app/proposal/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// JIMS Proposal Generator
// Visit /proposal to fill in client details and download a branded PDF.
// Share /proposal/view?c=NAME&p=PLAN&b=BUSINESS for a client-facing link.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useCallback } from 'react';

// ── Plan definitions ──────────────────────────────────────────────────────────
const PLANS = {
  starter: {
    name: 'Starter',
    price: '$99',
    period: '/month',
    tagline: 'Perfect to get started with insights',
    color: '#6ea8fe',
    features: [
      'Heatmap & click tracking on up to 3 pages',
      'Monthly plain-English insights report (PDF)',
      'Drop-off analysis for 1 key page',
      'Email support within 48 hours',
      'Setup included — we handle everything',
    ],
    notIncluded: ['Session recordings', 'Custom integrations', 'Priority support'],
  },
  growth: {
    name: 'Growth',
    price: '$199',
    period: '/month',
    tagline: 'Most popular for growing businesses',
    color: '#b98fff',
    features: [
      'Full-site heatmaps & click tracking',
      'Monthly + quarterly deep-dive reports',
      'Session recordings (up to 500/mo)',
      'Drop-off analysis across all key pages',
      'Mobile vs desktop breakdown',
      'Priority email & chat support',
      'Setup included — we handle everything',
    ],
    notIncluded: ['Custom integrations'],
  },
  premium: {
    name: 'Premium',
    price: '$349',
    period: '/month',
    tagline: 'Full-service for serious growth',
    color: '#ffb786',
    features: [
      'Everything in Growth',
      'Unlimited session recordings',
      'Custom integration with your booking system',
      'Weekly check-in call (15 min)',
      'A/B test recommendations',
      'Competitor benchmarking report (quarterly)',
      'Dedicated account manager',
    ],
    notIncluded: [],
  },
};

type PlanKey = keyof typeof PLANS;

// ── PDF generation using browser print / jsPDF ───────────────────────────────
async function generatePDF(
  clientName: string,
  businessName: string,
  businessType: string,
  selectedPlans: PlanKey[],
  note: string
) {
  // Dynamically import jsPDF only when needed
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210;
  const H = 297;
  const margin = 18;
  const contentW = W - margin * 2;
  let y = 0;

  // ── helpers ──────────────────────────────────────────────────────────────
  const hex2rgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b] as [number, number, number];
  };

  const setFont = (size: number, style: 'normal' | 'bold' = 'normal', color = '#e5e2e3') => {
    doc.setFontSize(size);
    doc.setFont('helvetica', style);
    const [r, g, b] = hex2rgb(color);
    doc.setTextColor(r, g, b);
  };

  const fillRect = (x: number, ry: number, w: number, h: number, color: string) => {
    const [r, g, b] = hex2rgb(color);
    doc.setFillColor(r, g, b);
    doc.rect(x, ry, w, h, 'F');
  };

  const line = (x1: number, ly: number, x2: number, color = '#2a2a2b') => {
    const [r, g, b] = hex2rgb(color);
    doc.setDrawColor(r, g, b);
    doc.setLineWidth(0.3);
    doc.line(x1, ly, x2, ly);
  };

  // ── PAGE 1 — COVER ────────────────────────────────────────────────────────

  // Dark background
  fillRect(0, 0, W, H, '#0d0d0f');

  // Blue/purple gradient band at top (simulated with two rects)
  fillRect(0, 0, W / 2, 68, '#1a2a4a');
  fillRect(W / 2, 0, W / 2, 68, '#1a0d2e');
  // Overlay with the true dark to soften
  fillRect(0, 0, W, 68, '#0d0d0f');

  // Accent bar top
  fillRect(0, 0, W, 3, '#4d8eff');
  // Gradient effect — two colored slivers
  fillRect(0, 0, W * 0.6, 3, '#4d8eff');
  fillRect(W * 0.6, 0, W * 0.4, 3, '#9b59ff');

  y = 22;

  // Logo mark — simple geometric "J"
  fillRect(margin, y, 9, 9, '#1a2a4a');
  doc.setDrawColor(78, 140, 255);
  doc.setLineWidth(0.5);
  doc.rect(margin, y, 9, 9);
  setFont(7, 'bold', '#6ea8fe');
  doc.text('JIMS', margin + 1.5, y + 6);

  // Company name
  setFont(9, 'bold', '#e5e2e3');
  doc.text('JIMS Software Inc.', margin + 12, y + 5.5);
  setFont(7, 'normal', '#6ea8fe');
  doc.text('Customer Insights for Small Business', margin + 12, y + 10);

  // Date top-right
  const dateStr = new Date().toLocaleDateString('en-CA', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  setFont(7, 'normal', '#424754');
  doc.text(dateStr, W - margin, y + 5.5, { align: 'right' });

  y = 70;

  // "PROPOSAL" label
  setFont(8, 'bold', '#4d8eff');
  doc.text('SERVICE PROPOSAL', margin, y);
  setFont(7, 'normal', '#424754');
  doc.text('Prepared exclusively for:', W - margin, y, { align: 'right' });

  y += 8;

  // Client name — big
  setFont(26, 'bold', '#ffffff');
  doc.text(businessName || clientName, margin, y);

  y += 7;
  setFont(11, 'normal', '#9ca3b0');
  doc.text(businessType, margin, y);

  y += 5;
  setFont(9, 'normal', '#6ea8fe');
  doc.text(`Attn: ${clientName}`, margin, y);

  y += 14;
  line(margin, y, W - margin, '#2a2a2b');
  y += 10;

  // Intro paragraph
  setFont(9, 'normal', '#9ca3b0');
  const intro = `Thank you for taking the time to speak with us. Based on our conversation, we have prepared this proposal outlining how JIMS Software Inc. can help ${businessName || 'your business'} understand your customers better — and turn that understanding into more bookings and sales.`;
  const introLines = doc.splitTextToSize(intro, contentW);
  doc.text(introLines, margin, y);
  y += introLines.length * 5 + 8;

  // "What you'll get" section header
  setFont(10, 'bold', '#ffffff');
  doc.text('What You Will Get', margin, y);
  y += 7;

  const whatYouGet = [
    ['Heatmaps & Click Tracking', 'See exactly where customers tap and click on your website'],
    ["Drop-Off Analysis", 'Know where customers leave so you can fix what is broken'],
    ['Monthly Insight Reports', 'Plain-English PDF every month — no tech knowledge needed'],
    ['Full Setup Included', 'We install and configure everything — nothing for you to do'],
    ['Mobile-First Focus', 'Most customers browse on phones — we make sure it works'],
  ];

  for (const [title, desc] of whatYouGet) {
    // Check mark
    fillRect(margin, y - 3, 4, 4, '#1a3a2a');
    doc.setDrawColor(52, 211, 153);
    doc.setLineWidth(0.3);
    doc.rect(margin, y - 3, 4, 4);
    setFont(7, 'bold', '#34d399');
    doc.text('✓', margin + 0.8, y);

    setFont(8, 'bold', '#ffffff');
    doc.text(title, margin + 7, y);
    setFont(7, 'normal', '#9ca3b0');
    doc.text(desc, margin + 7, y + 4);
    y += 12;
  }

  y += 4;
  line(margin, y, W - margin, '#2a2a2b');
  y += 10;

  // Why JIMS vs big tools
  setFont(10, 'bold', '#ffffff');
  doc.text('Why JIMS Instead of Enterprise Tools?', margin, y);
  y += 8;

  const comparisons: [string, string, string][] = [
    ['Cost', '$300–$1,000/month', 'From $99/month'],
    ['Setup', 'Your IT team required', 'We handle everything'],
    ['Reports', 'Complex dashboards', 'Plain English PDF'],
    ['Support', 'Ticket system', 'Direct contact with us'],
    ['Contract', 'Annual commitment', 'Month-to-month'],
  ];

  // Table header
  fillRect(margin, y - 4, contentW, 7, '#1c1b1c');
  setFont(7, 'bold', '#9ca3b0');
  doc.text('Feature', margin + 3, y);
  doc.text('Enterprise Tools', margin + 55, y);
  doc.text('JIMS Software', margin + 115, y);
  y += 5;

  for (const [feature, enterprise, jims] of comparisons) {
    fillRect(margin, y - 3.5, contentW, 7, y % 14 === 0 ? '#1a1a1b' : '#161516');
    setFont(7, 'normal', '#9ca3b0');
    doc.text(feature, margin + 3, y);
    setFont(7, 'normal', '#ff6b6b');
    doc.text(enterprise, margin + 55, y);
    setFont(7, 'bold', '#34d399');
    doc.text(jims, margin + 115, y);
    y += 7;
  }

  y += 6;

  // Footer page 1
  line(margin, H - 14, W - margin, '#1c1b1c');
  setFont(6.5, 'normal', '#424754');
  doc.text('JIMS Software Inc.  ·  jims-platform.vercel.app  ·  jachircano@yahoo.com', W / 2, H - 9, { align: 'center' });
  setFont(6.5, 'normal', '#424754');
  doc.text('Page 1 of 2', W - margin, H - 9, { align: 'right' });

  // ── PAGE 2 — PLANS ───────────────────────────────────────────────────────
  doc.addPage();
  fillRect(0, 0, W, H, '#0d0d0f');
  fillRect(0, 0, W, 3, '#4d8eff');
  fillRect(W * 0.6, 0, W * 0.4, 3, '#9b59ff');

  y = 18;
  setFont(14, 'bold', '#ffffff');
  doc.text('Your Recommended Plan(s)', margin, y);
  setFont(8, 'normal', '#9ca3b0');
  doc.text(
    selectedPlans.length > 1
      ? 'We have included multiple options so you can choose the best fit.'
      : 'Based on our conversation, here is our recommendation.',
    margin,
    y + 7
  );
  y += 18;

  for (const planKey of selectedPlans) {
    const plan = PLANS[planKey];
    const [pr, pg, pb] = hex2rgb(plan.color);

    // Card background
    fillRect(margin, y, contentW, selectedPlans.length === 1 ? 95 : 75, '#131314');
    doc.setDrawColor(pr, pg, pb);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, contentW, selectedPlans.length === 1 ? 95 : 75, 3, 3, 'S');

    // Colored left accent bar
    doc.setFillColor(pr, pg, pb);
    doc.roundedRect(margin, y, 3, selectedPlans.length === 1 ? 95 : 75, 1.5, 1.5, 'F');

    const cx = margin + 8;
    let cy = y + 10;

    // Plan name + price
    setFont(13, 'bold', '#ffffff');
    doc.text(plan.name, cx, cy);
    doc.setTextColor(pr, pg, pb);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(plan.price, W - margin - 3, cy, { align: 'right' });
    setFont(8, 'normal', '#9ca3b0');
    doc.text(plan.period, W - margin - 3, cy + 6, { align: 'right' });

    cy += 6;
    setFont(7.5, 'normal', '#9ca3b0');
    doc.text(plan.tagline, cx, cy);
    cy += 8;

    // Divider
    doc.setDrawColor(pr, pg, pb);
    doc.setLineWidth(0.2);
    doc.line(cx, cy, W - margin - 5, cy);
    cy += 6;

    // Features
    const colBreak = Math.ceil(plan.features.length / 2);
    const col1 = plan.features.slice(0, colBreak);
    const col2 = plan.features.slice(colBreak);
    const col2x = cx + (contentW - 13) / 2;

    for (let i = 0; i < Math.max(col1.length, col2.length); i++) {
      if (col1[i]) {
        setFont(7, 'bold', '#34d399');
        doc.text('✓', cx, cy);
        setFont(7, 'normal', '#e5e2e3');
        doc.text(col1[i], cx + 5, cy);
      }
      if (col2[i]) {
        setFont(7, 'bold', '#34d399');
        doc.text('✓', col2x, cy);
        setFont(7, 'normal', '#e5e2e3');
        doc.text(col2[i], col2x + 5, cy);
      }
      cy += 6;
    }

    y += selectedPlans.length === 1 ? 103 : 83;
  }

  y += 4;

  // Custom note
  if (note.trim()) {
    line(margin, y, W - margin, '#2a2a2b');
    y += 8;
    setFont(9, 'bold', '#ffffff');
    doc.text('Personal Note', margin, y);
    y += 7;
    setFont(8, 'normal', '#9ca3b0');
    const noteLines = doc.splitTextToSize(note, contentW);
    doc.text(noteLines, margin, y);
    y += noteLines.length * 5 + 8;
  }

  // Next steps box
  line(margin, y, W - margin, '#2a2a2b');
  y += 8;
  fillRect(margin, y - 4, contentW, 32, '#0f1a2e');
  doc.setDrawColor(78, 140, 255);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y - 4, contentW, 32, 2, 2, 'S');

  setFont(9, 'bold', '#6ea8fe');
  doc.text('Next Steps', margin + 5, y + 4);
  setFont(7.5, 'normal', '#9ca3b0');
  const nextSteps = `Reply to this proposal or contact us directly to confirm your plan. We will send a simple agreement, collect your website details, and have everything set up within 48 hours. No technical knowledge required on your end.`;
  const nsLines = doc.splitTextToSize(nextSteps, contentW - 10);
  doc.text(nsLines, margin + 5, y + 11);

  y += 40;
  setFont(8, 'bold', '#ffffff');
  doc.text('Ready to get started?', margin, y);
  setFont(8, 'normal', '#6ea8fe');
  doc.text('jachircano@yahoo.com', margin, y + 6);
  doc.text('jims-platform.vercel.app', margin, y + 12);

  // Footer page 2
  line(margin, H - 14, W - margin, '#1c1b1c');
  setFont(6.5, 'normal', '#424754');
  doc.text('JIMS Software Inc.  ·  jims-platform.vercel.app  ·  jachircano@yahoo.com', W / 2, H - 9, { align: 'center' });
  setFont(6.5, 'normal', '#424754');
  doc.text('Page 2 of 2', W - margin, H - 9, { align: 'right' });

  // Save
  const filename = `JIMS-Proposal-${(businessName || clientName).replace(/\s+/g, '-')}.pdf`;
  doc.save(filename);
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ProposalPage() {
  const [clientName, setClientName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [selectedPlans, setSelectedPlans] = useState<PlanKey[]>(['growth']);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const togglePlan = (plan: PlanKey) => {
    setSelectedPlans((prev) =>
      prev.includes(plan) ? prev.filter((p) => p !== plan) : [...prev, plan]
    );
  };

  const handleGenerate = async () => {
    if (!clientName || !selectedPlans.length) return;
    setLoading(true);
    try {
      await generatePDF(clientName, businessName, businessType, selectedPlans, note);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    const base = window.location.origin;
    const params = new URLSearchParams({
      c: clientName,
      b: businessName,
      t: businessType,
      p: selectedPlans.join(','),
    });
    navigator.clipboard.writeText(`${base}/proposal/view?${params.toString()}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // ── shared input style ──
  const inputCls = 'w-full px-4 py-3 rounded-lg text-sm text-white placeholder:text-zinc-600 outline-none transition-all';
  const inputSt = {
    background: '#0e0e0f',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#e5e2e3',
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: '#0d0d0f', color: '#e5e2e3', fontFamily: 'system-ui, sans-serif' }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between"
        style={{
          background: 'rgba(13,13,15,0.9)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ background: 'linear-gradient(135deg,#4d8eff,#9b59ff)', color: '#fff' }}
          >
            J
          </div>
          <div>
            <p className="text-sm font-bold text-white">JIMS Proposal Generator</p>
            <p className="text-xs" style={{ color: '#424754' }}>Internal tool — not public</p>
          </div>
        </div>
        <a
          href="/"
          className="text-xs px-3 py-1.5 rounded-lg transition-colors"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#9ca3b0',
            textDecoration: 'none',
          }}
        >
          ← Back to site
        </a>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">

        {/* Title */}
        <div className="space-y-2">
          <p
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: '#4d8eff' }}
          >
            Step 1 of 2 — Client Details
          </p>
          <h1 className="text-2xl font-bold text-white">Create a Proposal</h1>
          <p className="text-sm" style={{ color: '#9ca3b0' }}>
            Fill in the client details, choose their plan(s), and download a branded PDF
            to send by email — or copy a link they can open themselves.
          </p>
        </div>

        {/* Client details card */}
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{
            background: '#131314',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <p className="text-xs font-bold tracking-wider uppercase" style={{ color: '#9ca3b0' }}>
            Client Information
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold tracking-wider uppercase" style={{ color: '#9ca3b0' }}>
                Contact Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Maria Santos"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className={inputCls}
                style={inputSt}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold tracking-wider uppercase" style={{ color: '#9ca3b0' }}>
                Business Name
              </label>
              <input
                type="text"
                placeholder="e.g. Maria's Nail Studio"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className={inputCls}
                style={inputSt}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold tracking-wider uppercase" style={{ color: '#9ca3b0' }}>
              Business Type
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className={`${inputCls} appearance-none`}
              style={{ ...inputSt, color: businessType ? '#e5e2e3' : '#52525b' }}
            >
              <option value="">Select business type...</option>
              <option>Hair or Beauty Salon</option>
              <option>Nail Studio</option>
              <option>Restaurant or Café</option>
              <option>Grocery / Convenience Store</option>
              <option>Fitness Studio</option>
              <option>Home or Cleaning Service</option>
              <option>Pet Services</option>
              <option>Other Local Business</option>
            </select>
          </div>
        </div>

        {/* Plan selector */}
        <div className="space-y-3">
          <p
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: '#4d8eff' }}
          >
            Step 2 of 2 — Select Plan(s)
          </p>
          <p className="text-xs" style={{ color: '#9ca3b0' }}>
            You can include multiple plans so the client can choose. The recommended one will be highlighted.
          </p>

          <div className="space-y-3">
            {(Object.entries(PLANS) as [PlanKey, typeof PLANS.starter][]).map(([key, plan]) => {
              const active = selectedPlans.includes(key);
              const [pr, pg, pb] = [
                parseInt(plan.color.slice(1, 3), 16),
                parseInt(plan.color.slice(3, 5), 16),
                parseInt(plan.color.slice(5, 7), 16),
              ];
              return (
                <button
                  key={key}
                  onClick={() => togglePlan(key)}
                  className="w-full text-left rounded-xl p-4 transition-all"
                  style={{
                    background: active
                      ? `rgba(${pr},${pg},${pb},0.08)`
                      : '#131314',
                    border: active
                      ? `1px solid rgba(${pr},${pg},${pb},0.4)`
                      : '1px solid rgba(255,255,255,0.07)',
                    cursor: 'pointer',
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                        style={{
                          background: active ? plan.color : 'rgba(255,255,255,0.06)',
                          color: active ? '#000' : '#666',
                        }}
                      >
                        {active ? '✓' : ''}
                      </div>
                      <span className="font-bold text-white">{plan.name}</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: `rgba(${pr},${pg},${pb},0.12)`,
                          color: plan.color,
                        }}
                      >
                        {plan.tagline}
                      </span>
                    </div>
                    <span className="font-bold text-lg" style={{ color: plan.color }}>
                      {plan.price}
                      <span className="text-xs font-normal" style={{ color: '#9ca3b0' }}>
                        {plan.period}
                      </span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 pl-8">
                    {plan.features.slice(0, 3).map((f) => (
                      <span key={f} className="text-xs" style={{ color: '#9ca3b0' }}>
                        ✓ {f}
                      </span>
                    ))}
                    {plan.features.length > 3 && (
                      <span className="text-xs" style={{ color: '#424754' }}>
                        +{plan.features.length - 3} more
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Personal note */}
        <div
          className="rounded-2xl p-6 space-y-3"
          style={{
            background: '#131314',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <label className="block text-xs font-bold tracking-wider uppercase" style={{ color: '#9ca3b0' }}>
            Personal Note (optional)
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Great to meet you Maria! Based on our call I think the Growth plan is perfect for your nail studio..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={`${inputCls} resize-none`}
            style={inputSt}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleGenerate}
            disabled={!clientName || !selectedPlans.length || loading}
            className="flex-1 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
            style={{
              background:
                !clientName || !selectedPlans.length
                  ? 'rgba(78,140,255,0.3)'
                  : 'linear-gradient(135deg,#4d8eff,#9b59ff)',
              color: '#fff',
              cursor: !clientName || !selectedPlans.length ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              border: 'none',
            }}
          >
            {loading ? (
              <>
                <span
                  className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
                  style={{ flexShrink: 0 }}
                />
                Generating PDF...
              </>
            ) : (
              <>⬇ Download PDF Proposal</>
            )}
          </button>

          <button
            onClick={handleCopyLink}
            disabled={!clientName || !selectedPlans.length}
            className="flex-1 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)',
              color: copied ? '#34d399' : '#e5e2e3',
              cursor: !clientName || !selectedPlans.length ? 'not-allowed' : 'pointer',
              opacity: !clientName || !selectedPlans.length ? 0.4 : 1,
            }}
          >
            {copied ? '✓ Link Copied!' : '🔗 Copy Shareable Link'}
          </button>
        </div>

        {clientName && selectedPlans.length > 0 && (
          <p className="text-xs text-center" style={{ color: '#424754' }}>
            PDF will be named:{' '}
            <span style={{ color: '#6ea8fe' }}>
              JIMS-Proposal-{(businessName || clientName).replace(/\s+/g, '-')}.pdf
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

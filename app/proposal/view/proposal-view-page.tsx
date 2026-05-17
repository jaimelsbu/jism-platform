'use client';

// app/proposal/view/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Public-facing proposal viewer.
// URL: /proposal/view?c=Maria&b=Maria+Nails&t=Nail+Studio&p=growth
// Client opens this link, reads the proposal, clicks Download PDF.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';

const PLANS = {
  starter: {
    name: 'Starter',
    price: '$99',
    period: '/month',
    tagline: 'Perfect to get started',
    color: '#6ea8fe',
    features: [
      'Heatmap & click tracking on up to 3 pages',
      'Monthly plain-English insights report',
      'Drop-off analysis for 1 key page',
      'Email support within 48 hours',
      'Setup included — we handle everything',
    ],
  },
  growth: {
    name: 'Growth',
    price: '$199',
    period: '/month',
    tagline: 'Most popular',
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
  },
  premium: {
    name: 'Premium',
    price: '$349',
    period: '/month',
    tagline: 'Full-service',
    color: '#ffb786',
    features: [
      'Everything in Growth',
      'Unlimited session recordings',
      'Custom booking system integration',
      'Weekly 15-min check-in call',
      'A/B test recommendations',
      'Quarterly competitor benchmarking',
      'Dedicated account manager',
    ],
  },
};

type PlanKey = keyof typeof PLANS;

export default function ProposalViewPage() {
  const [params, setParams] = useState<{
    clientName: string;
    businessName: string;
    businessType: string;
    plans: PlanKey[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const plansRaw = sp.get('p') || 'growth';
    const validPlans = plansRaw
      .split(',')
      .filter((p): p is PlanKey => p in PLANS) as PlanKey[];
    setParams({
      clientName: sp.get('c') || 'Valued Client',
      businessName: sp.get('b') || '',
      businessType: sp.get('t') || '',
      plans: validPlans.length ? validPlans : ['growth'],
    });
  }, []);

  const handleDownload = async () => {
    if (!params) return;
    setLoading(true);
    try {
      const { jsPDF } = await import('jspdf');
      // Re-use same PDF logic — import from proposal page
      // For simplicity, inline a minimal version here
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const W = 210; const margin = 18;
      const fillRect = (x: number, y: number, w: number, h: number, color: string) => {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        doc.setFillColor(r, g, b);
        doc.rect(x, y, w, h, 'F');
      };

      fillRect(0, 0, W, 297, '#0d0d0f');
      fillRect(0, 0, W, 3, '#4d8eff');
      fillRect(W * 0.6, 0, W * 0.4, 3, '#9b59ff');

      doc.setFontSize(22); doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('Service Proposal', margin, 30);

      doc.setFontSize(10); doc.setFont('helvetica', 'normal');
      doc.setTextColor(155, 163, 176);
      doc.text(`Prepared for: ${params.businessName || params.clientName}`, margin, 40);
      doc.text(`Attn: ${params.clientName}`, margin, 47);

      let y = 65;
      for (const planKey of params.plans) {
        const plan = PLANS[planKey];
        const pr = parseInt(plan.color.slice(1, 3), 16);
        const pg = parseInt(plan.color.slice(3, 5), 16);
        const pb = parseInt(plan.color.slice(5, 7), 16);
        doc.setFillColor(pr, pg, pb);
        doc.rect(margin, y, 3, 60, 'F');
        doc.setFontSize(14); doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(plan.name, margin + 8, y + 10);
        doc.setTextColor(pr, pg, pb);
        doc.setFontSize(16);
        doc.text(plan.price + plan.period, W - margin, y + 10, { align: 'right' });
        doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
        doc.setTextColor(155, 163, 176);
        plan.features.forEach((f, i) => {
          doc.setTextColor(52, 211, 153);
          doc.text('✓', margin + 8, y + 22 + i * 6);
          doc.setTextColor(229, 226, 227);
          doc.text(f, margin + 14, y + 22 + i * 6);
        });
        y += 70;
      }

      doc.setFontSize(8); doc.setFont('helvetica', 'normal');
      doc.setTextColor(66, 71, 84);
      doc.text('JIMS Software Inc.  ·  jims-platform.vercel.app  ·  jachircano@yahoo.com', W / 2, 285, { align: 'center' });

      doc.save(`JIMS-Proposal-${(params.businessName || params.clientName).replace(/\s+/g, '-')}.pdf`);
    } finally {
      setLoading(false);
    }
  };

  if (!params) {
    return (
      <div style={{ minHeight: '100vh', background: '#0d0d0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid rgba(78,140,255,0.2)', borderTopColor: '#4d8eff', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d0f', color: '#e5e2e3', fontFamily: 'system-ui, sans-serif' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Top accent */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, #4d8eff 0%, #9b59ff 100%)' }} />

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'linear-gradient(135deg,#4d8eff,#9b59ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 14, color: '#fff',
          }}>J</div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 14, color: '#fff', margin: 0 }}>JIMS Software Inc.</p>
            <p style={{ fontSize: 11, color: '#424754', margin: 0 }}>Customer Insights for Small Business</p>
          </div>
        </div>

        {/* Greeting */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(78,140,255,0.08), rgba(155,89,255,0.05))',
          border: '1px solid rgba(78,140,255,0.2)',
          borderRadius: 16, padding: '28px 32px', marginBottom: 32,
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6ea8fe', margin: '0 0 8px' }}>
            Service Proposal
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            {params.businessName || params.clientName}
          </h1>
          {params.businessType && (
            <p style={{ fontSize: 13, color: '#9ca3b0', margin: '0 0 4px' }}>{params.businessType}</p>
          )}
          <p style={{ fontSize: 13, color: '#6ea8fe', margin: 0 }}>Attn: {params.clientName}</p>

          <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: 8 }}>
            <p style={{ fontSize: 13, color: '#9ca3b0', margin: 0, lineHeight: 1.6 }}>
              Thank you for speaking with us. Below you will find the plan we recommend for your business,
              with full details on what is included. Feel free to reach out with any questions before getting started.
            </p>
          </div>
        </div>

        {/* Plans */}
        <div style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {params.plans.map((planKey, idx) => {
            const plan = PLANS[planKey];
            const pr = parseInt(plan.color.slice(1, 3), 16);
            const pg = parseInt(plan.color.slice(3, 5), 16);
            const pb = parseInt(plan.color.slice(5, 7), 16);
            const isFirst = idx === 0 && params.plans.length > 1;

            return (
              <div
                key={planKey}
                style={{
                  background: '#131314',
                  border: `1px solid rgba(${pr},${pg},${pb},${isFirst ? 0.45 : 0.2})`,
                  borderRadius: 16,
                  padding: '24px 24px 24px 28px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: isFirst ? `0 0 32px rgba(${pr},${pg},${pb},0.1)` : 'none',
                }}
              >
                {/* Left accent */}
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
                  background: plan.color, borderRadius: '4px 0 0 4px',
                }} />

                {isFirst && (
                  <div style={{
                    position: 'absolute', top: 16, right: 16,
                    background: 'linear-gradient(135deg,#4d8eff,#9b59ff)',
                    color: '#fff', fontSize: 9, fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    padding: '3px 10px', borderRadius: 20,
                  }}>
                    Recommended
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <p style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>{plan.name}</p>
                    <p style={{ fontSize: 12, color: '#9ca3b0', margin: 0 }}>{plan.tagline}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 28, fontWeight: 700, color: plan.color }}>{plan.price}</span>
                    <span style={{ fontSize: 12, color: '#9ca3b0' }}>{plan.period}</span>
                  </div>
                </div>

                <div style={{ height: 1, background: `rgba(${pr},${pg},${pb},0.2)`, marginBottom: 16 }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ color: '#34d399', flexShrink: 0, fontSize: 12, marginTop: 1 }}>✓</span>
                      <span style={{ fontSize: 12, color: '#e5e2e3', lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* What happens next */}
        <div style={{
          background: 'rgba(78,140,255,0.05)',
          border: '1px solid rgba(78,140,255,0.15)',
          borderRadius: 12, padding: '20px 24px', marginBottom: 32,
        }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#6ea8fe', margin: '0 0 8px' }}>
            What happens next?
          </p>
          {[
            'Reply to this proposal or email us directly',
            "We send a simple one-page agreement (no surprise fees)",
            "We set everything up within 48 hours — nothing for you to do",
            "You receive your first insights report within 30 days",
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 6, alignItems: 'flex-start' }}>
              <span style={{
                width: 18, height: 18, borderRadius: '50%',
                background: 'rgba(78,140,255,0.15)',
                color: '#6ea8fe', fontSize: 9, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>{i + 1}</span>
              <p style={{ fontSize: 12, color: '#9ca3b0', margin: 0, lineHeight: 1.5 }}>{step}</p>
            </div>
          ))}
        </div>

        {/* Download CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <button
            onClick={handleDownload}
            disabled={loading}
            style={{
              width: '100%', maxWidth: 400,
              padding: '16px 32px',
              background: 'linear-gradient(135deg,#4d8eff,#9b59ff)',
              color: '#fff', fontWeight: 700, fontSize: 15,
              border: 'none', borderRadius: 12, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Generating...' : '⬇ Download Your Proposal PDF'}
          </button>
          <p style={{ fontSize: 12, color: '#424754', textAlign: 'center' }}>
            Questions? Email us at{' '}
            <a href="mailto:jachircano@yahoo.com" style={{ color: '#6ea8fe' }}>
              jachircano@yahoo.com
            </a>
          </p>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 60, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: '#424754' }}>
            © 2026 JIMS Software Inc. — Customer Insights for Small Business
          </p>
        </div>
      </div>
    </div>
  );
}

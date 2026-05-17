// app/page.tsx
import { Hero } from './components/Hero';
import { PlatformInsights } from './components/PlatformInsights';
import { JimsLogo } from './components/JimsLogo';
import { Button } from './components/Button';
import { ContactForm } from './components/ContactForm';

// ─── Services ────────────────────────────────────────────────────────────────
const services = [
  {
    icon: '🔥',
    title: 'Heatmaps & Click Tracking',
    description:
      'See exactly where your customers tap, click, and stop. Know which buttons get ignored and which ones convert.',
    tags: ['Heatmaps', 'Click Maps', 'Scroll Depth'],
  },
  {
    icon: '📉',
    title: 'Drop-Off Analysis',
    description:
      'Find the exact moment customers leave your booking page, menu, or checkout — and fix it.',
    tags: ['Funnel Analysis', 'Session Replay', 'Exit Points'],
  },
  {
    icon: '📊',
    title: 'Monthly Insight Reports',
    description:
      'Plain-language reports delivered to your inbox. No dashboards to learn — we tell you what to improve.',
    tags: ['PDF Reports', 'Plain English', 'Action Items'],
  },
  {
    icon: '📱',
    title: 'Mobile-First Analytics',
    description:
      'Most small business customers browse on phones. We make sure your mobile experience converts.',
    tags: ['Mobile UX', 'Device Breakdown', 'Speed Insights'],
  },
];

// ─── How It Works steps ───────────────────────────────────────────────────────
const steps = [
  {
    number: '01',
    title: 'Free 30-Min Discovery Call',
    description:
      "We learn about your business — your website, your goals, and what's frustrating you. No tech knowledge needed.",
    icon: '📞',
  },
  {
    number: '02',
    title: 'We Set Everything Up',
    description:
      'We install the tracking on your website silently in the background. Nothing for you to do. Usually done within 48 hours.',
    icon: '⚙️',
  },
  {
    number: '03',
    title: 'Data Starts Flowing',
    description:
      'Within days we have real data on how your customers behave — where they click, where they drop off, what they ignore.',
    icon: '📡',
  },
  {
    number: '04',
    title: 'You Get a Clear Report',
    description:
      'Every month we send you a plain-English report with 3–5 specific things to improve. We can implement them for you too.',
    icon: '📋',
  },
];

// ─── Industry verticals ───────────────────────────────────────────────────────
const industries = [
  { icon: '💈', label: 'Hair & Beauty Salons' },
  { icon: '💅', label: 'Nail Studios' },
  { icon: '🛒', label: 'Grocery & Convenience' },
  { icon: '🍕', label: 'Restaurants & Cafés' },
  { icon: '🏋️', label: 'Fitness Studios' },
  { icon: '🐾', label: 'Pet Services' },
  { icon: '🧹', label: 'Cleaning Services' },
  { icon: '🔧', label: 'Home Services' },
];

// ─── Trust signals (placeholder until you have real clients) ──────────────────
const trustStats = [
  { value: 'Free', label: 'Discovery call — always' },
  { value: '48h', label: 'Setup turnaround' },
  { value: '100%', label: 'Plain-English reports' },
  { value: 'No lock-in', label: 'Cancel any time' },
];

// ─── Tech Stack ───────────────────────────────────────────────────────────────
const stack = ['Next.js', 'TypeScript', 'Python', 'AWS', 'PostgreSQL', 'OpenAI', 'Docker', 'Vercel'];

export default function Home() {
  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-on-surface)' }}
    >

      {/* ── NAV ── */}
      <nav
        className="sticky top-0 z-50 w-full"
        style={{
          backgroundColor: 'rgba(13, 13, 15, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex justify-between items-center">
          <JimsLogo size={34} showText />
          <div
            className="hidden md:flex items-center gap-8 text-sm"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            {[
              { label: 'Services', id: 'services' },
              { label: 'How It Works', id: 'how-it-works' },
              { label: 'Who We Help', id: 'industries' },
              { label: 'Contact', id: 'contact' },
            ].map(({ label, id }) => (
              <a
                key={id}
                href={`#${id}`}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {label}
              </a>
            ))}
          </div>
          <div className="hidden md:block">
            <Button variant="primary" size="sm" href="#contact">
              Book Free Call
            </Button>
          </div>
          <button
            className="md:hidden text-xl"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-on-surface-variant)',
              cursor: 'pointer',
            }}
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <Hero />

      {/* ── TRUST STATS BAR ── */}
      <div
        className="w-full py-6"
        style={{
          background: 'rgba(78,140,255,0.04)',
          borderTop: '1px solid rgba(78,140,255,0.1)',
          borderBottom: '1px solid rgba(78,140,255,0.1)',
        }}
      >
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustStats.map(({ value, label }) => (
              <div key={label} className="text-center space-y-1">
                <p
                  className="text-xl font-bold tracking-tight"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {value}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── LIVE DASHBOARD PREVIEW ── */}
      <div className="px-4 pb-8 pt-4">
        <p className="text-center section-label mb-2">Live Preview — What You'll See</p>
        <PlatformInsights />
      </div>

      <hr className="section-divider" />

      {/* ── SERVICES ── */}
      <section id="services" className="max-w-[1280px] mx-auto px-6 py-20">
        <div className="text-center mb-12 space-y-3">
          <p className="section-label">What You Get</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Know Exactly Why Customers{' '}
            <span className="gradient-text">Leave or Stay</span>
          </h2>
          <p
            className="max-w-xl mx-auto text-base leading-relaxed"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            Tools like FullStory cost $300–$1,000/month and need a tech team to run them.
            JIMS gives you the same insights, explained in plain English, at a fraction of the cost.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map(({ icon, title, description, tags }) => (
            <div key={title} className="jims-card p-6 space-y-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                style={{
                  background: 'rgba(78,140,255,0.1)',
                  border: '1px solid rgba(78,140,255,0.15)',
                }}
              >
                {icon}
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm mb-1.5">{title}</h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: 'var(--color-on-surface-variant)' }}
                >
                  {description}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      background: 'rgba(110,168,254,0.07)',
                      color: 'var(--color-primary)',
                      border: '1px solid rgba(110,168,254,0.15)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="max-w-[1280px] mx-auto px-6 py-20">
        <div className="text-center mb-14 space-y-3">
          <p className="section-label">Simple Process</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Up and Running in{' '}
            <span className="gradient-text">Under a Week</span>
          </h2>
          <p
            className="max-w-lg mx-auto text-base leading-relaxed"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            You don't need to understand the tech. We handle everything — you just read the results.
          </p>
        </div>

        {/* Steps — connected timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical connector line (desktop hidden on mobile) */}
          <div
            className="absolute left-8 top-10 bottom-10 w-px hidden md:block"
            style={{ background: 'linear-gradient(180deg, rgba(78,140,255,0.4) 0%, rgba(155,89,255,0.1) 100%)' }}
          />

          <div className="space-y-8">
            {steps.map(({ number, title, description, icon }, i) => (
              <div key={number} className="flex gap-6 items-start">
                {/* Step number circle */}
                <div
                  className="relative z-10 w-16 h-16 rounded-full flex-shrink-0 flex flex-col items-center justify-center font-mono text-xs font-bold"
                  style={{
                    background:
                      i === 0
                        ? 'linear-gradient(135deg, #4d8eff, #9b59ff)'
                        : 'var(--color-surface-container)',
                    border: i === 0 ? 'none' : '1px solid rgba(78,140,255,0.2)',
                    color: i === 0 ? '#fff' : 'var(--color-primary)',
                    boxShadow: i === 0 ? '0 0 20px rgba(78,140,255,0.3)' : 'none',
                  }}
                >
                  <span className="text-lg">{icon}</span>
                  <span style={{ fontSize: '9px', opacity: 0.7 }}>{number}</span>
                </div>

                {/* Content */}
                <div
                  className="flex-1 p-5 rounded-xl"
                  style={{
                    background: 'var(--color-surface-container-low)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <h3 className="font-semibold text-white mb-2">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Button variant="primary" size="lg" href="#contact">
            Book My Free Call →
          </Button>
          <p className="text-xs mt-3" style={{ color: 'var(--color-on-surface-variant)' }}>
            No credit card. No commitment. Just a conversation.
          </p>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── WHO WE HELP — Industry verticals ── */}
      <section id="industries" className="py-16" style={{ background: 'rgba(255,255,255,0.015)' }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-10 space-y-2">
            <p className="section-label">Who We Help</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Built for <span className="gradient-text">Local Small Businesses</span>
            </h2>
            <p
              className="max-w-md mx-auto text-sm leading-relaxed pt-1"
              style={{ color: 'var(--color-on-surface-variant)' }}
            >
              You don't need to be a tech company to benefit from knowing how your customers behave online.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {industries.map(({ icon, label }) => (
              <div
                key={label}
                className="jims-card p-4 text-center space-y-2"
              >
                <div className="text-3xl">{icon}</div>
                <p className="text-xs font-medium text-white leading-tight">{label}</p>
              </div>
            ))}
          </div>

          {/* "Coming soon" client banner placeholder */}
          <div
            className="mt-14 rounded-2xl p-8 text-center space-y-3"
            style={{
              background: 'var(--color-surface-container-low)',
              border: '1px dashed rgba(110,168,254,0.2)',
            }}
          >
            <p className="section-label">Early Adopters</p>
            <h3 className="text-lg font-semibold text-white">
              Be one of our first featured clients
            </h3>
            <p
              className="text-sm max-w-md mx-auto"
              style={{ color: 'var(--color-on-surface-variant)' }}
            >
              We're onboarding our first 5 small businesses at a{' '}
              <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                founding member rate
              </span>
              . Your logo will appear here. Book a call to learn more.
            </p>
            <div className="pt-2">
              <Button variant="secondary" size="sm" href="#contact">
                Claim a Founding Spot
              </Button>
            </div>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── TECH STACK (kept minimal, builds credibility) ── */}
      <section className="py-10 overflow-hidden">
        <p className="text-center section-label mb-6">Built With Industry-Standard Technology</p>
        <div className="flex flex-wrap justify-center gap-3 px-6">
          {stack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: 'var(--color-surface-container)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: 'var(--color-on-surface-variant)',
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── ABOUT / FOUNDER ── */}
      <section id="about" className="max-w-[1280px] mx-auto px-6 py-20">
        <div className="max-w-2xl mx-auto text-center space-y-5">
          <div
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl font-bold"
            style={{
              background: 'linear-gradient(135deg, rgba(78,140,255,0.2), rgba(155,89,255,0.2))',
              border: '2px solid rgba(110,168,254,0.3)',
              color: 'var(--color-primary)',
            }}
          >
            J
          </div>
          <div>
            <p className="section-label mb-2">About JIMS</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Enterprise Insights.{' '}
              <span className="gradient-text">Small Business Price.</span>
            </h2>
            <p
              className="text-base leading-relaxed"
              style={{ color: 'var(--color-on-surface-variant)' }}
            >
              Based in Canada, JIMS Software Inc. was built for one reason: the tools big companies use
              to understand their customers are locked behind enterprise price tags. We bring the same
              technology — heatmaps, session analytics, drop-off tracking — to hair salons, restaurants,
              and local shops at a price that makes sense.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {['Based in Canada', 'AWS Certified', 'AI/ML', 'No Tech Jargon', '5+ Years Exp'].map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: 'var(--color-surface-container)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: 'var(--color-on-surface-variant)',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── CONTACT ── */}
      <section id="contact" className="max-w-[1280px] mx-auto px-6 py-20">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10 space-y-3">
            <p className="section-label">Let's Talk</p>
            <h2 className="text-3xl font-bold tracking-tight">
              Book Your{' '}
              <span className="gradient-text">Free Discovery Call</span>
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--color-on-surface-variant)' }}
            >
              Tell us about your business. We'll show you exactly what insights you're missing —
              and send you a custom pricing proposal after the call.
            </p>
          </div>

          <ContactForm />

          {/* Pricing hint — anchors expectation without exposing numbers */}
          <div
            className="mt-6 p-4 rounded-xl text-center"
            style={{
              background: 'rgba(78,140,255,0.05)',
              border: '1px solid rgba(78,140,255,0.12)',
            }}
          >
            <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
              💡 Plans start at{' '}
              <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>
                $99/month
              </span>{' '}
              — we'll send you a full pricing PDF after your call.
              No pressure, no commitment.
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="mt-4 py-12"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(0,0,0,0.3)',
        }}
      >
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10">
            <div className="space-y-3 max-w-xs">
              <JimsLogo size={30} showText />
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                Enterprise-grade customer insights for local small businesses.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-10 text-sm">
              <div className="space-y-3">
                <p
                  className="text-xs font-bold tracking-wider uppercase"
                  style={{ color: 'var(--color-on-surface-variant)' }}
                >
                  Product
                </p>
                {[
                  { label: 'Services', id: 'services' },
                  { label: 'How It Works', id: 'how-it-works' },
                  { label: 'Who We Help', id: 'industries' },
                ].map(({ label, id }) => (
                  <p key={id}>
                    <a
                      href={`#${id}`}
                      className="transition-colors hover:text-white text-xs"
                      style={{ color: 'var(--color-on-surface-variant)' }}
                    >
                      {label}
                    </a>
                  </p>
                ))}
              </div>
              <div className="space-y-3">
                <p
                  className="text-xs font-bold tracking-wider uppercase"
                  style={{ color: 'var(--color-on-surface-variant)' }}
                >
                  Company
                </p>
                {['About', 'Contact', 'Privacy Policy'].map((l) => (
                  <p key={l}>
                    <a
                      href={l === 'About' ? '#about' : l === 'Contact' ? '#contact' : '#'}
                      className="transition-colors hover:text-white text-xs"
                      style={{ color: 'var(--color-on-surface-variant)' }}
                    >
                      {l}
                    </a>
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div
            className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 text-xs"
            style={{
              borderTop: '1px solid rgba(255,255,255,0.05)',
              color: 'var(--color-on-surface-variant)',
            }}
          >
            <span>© 2026 JIMS Software Inc. — Customer Insights for Small Business.</span>
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase"
              style={{
                fontFamily: 'var(--font-mono)',
                background: 'rgba(52,211,153,0.08)',
                color: '#34d399',
                border: '1px solid rgba(52,211,153,0.2)',
              }}
            >
              ● All Systems Operational
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}

// app/components/Hero.tsx
import { Button } from './Button';

export const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-6 max-w-[1280px] mx-auto pt-24 pb-16 overflow-hidden">
      {/* Glow orbs */}
      <div
        className="glow-orb glow-orb-blue"
        style={{ width: 560, height: 560, top: '-80px', left: '-60px' }}
      />
      <div
        className="glow-orb glow-orb-purple"
        style={{ width: 480, height: 480, bottom: '-60px', right: '-40px' }}
      />

      <div className="relative z-10 max-w-4xl space-y-7 stagger">

        {/* Badge */}
        <div className="animate-float-up">
          <span className="trust-badge">
            <span
              className="animate-pulse-dot inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: '#34d399' }}
            />
            Now accepting small businesses — first 5 get founding rate
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.08] animate-float-up"
          style={{ animationDelay: '60ms' }}
        >
          Find Out Why Customers{' '}
          <br className="hidden sm:block" />
          <span className="gradient-text">Leave Your Website</span>
        </h1>

        {/* Sub-headline — written for salon/shop owners, not engineers */}
        <p
          className="max-w-2xl mx-auto text-base md:text-lg leading-relaxed animate-float-up"
          style={{ color: 'var(--color-on-surface-variant)', animationDelay: '120ms' }}
        >
          We show hair salons, nail studios, and local shops exactly where customers click,
          where they get confused, and where they leave — so you can fix it and get more bookings.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 animate-float-up"
          style={{ animationDelay: '180ms' }}
        >
          <Button variant="primary" size="lg" href="#contact">
            Book Free 30-Min Call →
          </Button>
          <Button variant="secondary" size="lg" href="#how-it-works">
            See How It Works
          </Button>
        </div>

        {/* Social proof — value-focused, not vanity metrics */}
        <div
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-4 animate-float-up"
          style={{ animationDelay: '240ms' }}
        >
          {[
            { value: 'No tech skills', label: 'needed from you' },
            { value: 'Setup in 48h', label: 'we handle everything' },
            { value: 'Plain English', label: 'reports every month' },
          ].map(({ value, label }) => (
            <div key={value} className="flex items-center gap-2">
              <span
                className="text-sm font-bold"
                style={{ color: 'var(--color-primary)' }}
              >
                {value}
              </span>
              <span
                className="text-xs"
                style={{ color: 'var(--color-on-surface-variant)' }}
              >
                — {label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

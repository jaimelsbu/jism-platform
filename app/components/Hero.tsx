import { Button } from './Button';

export const Hero = () => {
  return (
    <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-4 max-w-[1280px] mx-auto pt-20">
      <div className="glow-bg top-10 left-1/4" />
      <div className="glow-bg bottom-10 right-1/4" />

      <div className="z-10 max-w-4xl space-y-6">
        <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full border border-primary/20">
          ● Now Booking for Q1 2026
        </span>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
          AI Analytics & Modern <br />
          <span className="text-transparent bg-clip-text bg-brand-gradient">
            Software Engineering
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base md:text-lg text-zinc-400 font-light">
          Building intelligent dashboards, AI-powered insights, scalable web platforms, and cloud-native applications.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button variant="primary">
            View Projects <span>→</span>
          </Button>
          <Button variant="secondary">Book Consultation</Button>
        </div>
      </div>
    </section>
  );
};
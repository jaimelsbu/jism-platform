import { Hero } from './components/Hero';
import { PlatformInsights } from './components/PlatformInsights';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-white pb-24">
      {/* Simple Top Navigation Bar matching mockup */}
      <nav className="w-full max-w-[1280px] mx-auto px-6 py-4 flex justify-between items-center border-b border-white/[0.05]">
        <div className="flex items-center gap-2 font-bold tracking-tight">
          <div className="w-4 h-4 rounded-full bg-brand-gradient" />
          JI Software Inc.
        </div>
        <div className="text-zinc-400 hover:text-white cursor-pointer md:hidden">
          ☰
        </div>
        <div className="hidden md:flex gap-6 text-sm text-zinc-400">
          <span className="hover:text-white cursor-pointer">Services</span>
          <span className="hover:text-white cursor-pointer">Portfolio</span>
          <span className="hover:text-white cursor-pointer">Contact</span>
        </div>
      </nav>

      {/* Hero Content Section */}
      <Hero />

      {/* Real-time Insights Dynamic Panel Section */}
      <div className="px-4">
        <PlatformInsights />
      </div>
    </main>
  );
}
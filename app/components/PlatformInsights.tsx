// app/components/PlatformInsights.tsx
'use client';

export const PlatformInsights = () => {
  return (
    <div className="stitch-card p-6 max-w-2xl mx-auto space-y-6 shadow-2xl relative overflow-hidden my-12">
      {/* Decorative mesh */}
      <div
        className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at top right, rgba(110,168,254,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/[0.07] pb-4">
        <div>
          <h3 className="text-base font-semibold text-white">Platform Insights</h3>
          <p
            className="text-xs mt-0.5"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-on-surface-variant)' }}
          >
            Live Machine Intelligence Dashboard
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="animate-pulse-dot inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--color-primary)' }}
          />
          <span className="text-xs" style={{ color: 'var(--color-primary)' }}>
            LIVE
          </span>
        </div>
      </div>

      {/* Metric cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Bar chart */}
        <div
          className="border border-white/[0.05] p-4 rounded-lg space-y-3"
          style={{ backgroundColor: 'var(--color-surface-container-lowest)' }}
        >
          <p className="text-xs font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>
            User Growth
          </p>
          <div className="h-16 flex items-end gap-1.5 pt-2">
            {[25, 45, 32, 58, 42, 80, 95].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm transition-all"
                style={{
                  height: `${h}%`,
                  background:
                    i >= 5
                      ? 'linear-gradient(180deg, #4d8eff 0%, #9b59ff 100%)'
                      : 'rgba(255,255,255,0.1)',
                }}
              />
            ))}
          </div>
          <p className="text-[10px]" style={{ color: 'var(--color-on-surface-variant)' }}>
            Last 7 weeks
          </p>
        </div>

        {/* Confidence dial */}
        <div
          className="border border-white/[0.05] p-4 rounded-lg flex flex-col items-center justify-center text-center gap-3"
          style={{ backgroundColor: 'var(--color-surface-container-lowest)' }}
        >
          <p className="text-xs font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>
            AI Confidence
          </p>
          <div
            className="relative w-16 h-16 rounded-full flex items-center justify-center"
            style={{ border: '3px solid rgba(185,143,255,0.15)' }}
          >
            <div
              className="absolute inset-0 rounded-full animate-spin-slow"
              style={{
                border: '3px solid transparent',
                borderTopColor: 'var(--color-secondary)',
                borderRightColor: 'rgba(185,143,255,0.3)',
              }}
            />
            <span
              className="text-sm font-bold"
              style={{ fontFamily: 'var(--font-mono)', color: '#fff' }}
            >
              84%
            </span>
          </div>
          <p className="text-[10px]" style={{ color: 'var(--color-on-surface-variant)' }}>
            Model accuracy
          </p>
        </div>
      </div>

      {/* Regional heatmap */}
      <div
        className="border border-white/[0.05] p-4 rounded-lg space-y-3"
        style={{ backgroundColor: 'var(--color-surface-container-lowest)' }}
      >
        <p className="text-xs font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>
          Regional Activity
        </p>
        <div className="grid grid-cols-8 gap-1.5">
          {[5, 10, 60, 80, 45, 20, 8, 12].map((intensity, i) => (
            <div
              key={i}
              className="h-5 rounded-sm"
              style={{
                background: `rgba(78, 140, 255, ${intensity / 100})`,
                border: '1px solid rgba(78,140,255,0.1)',
              }}
            />
          ))}
        </div>
        <p className="text-[10px]" style={{ color: 'var(--color-on-surface-variant)' }}>
          N. America → Europe → APAC
        </p>
      </div>

      {/* Status badges */}
      <div className="flex flex-wrap gap-2">
        <span
          className="px-2.5 py-1 rounded border text-[10px] font-semibold tracking-wider uppercase"
          style={{
            fontFamily: 'var(--font-mono)',
            background: 'rgba(52,211,153,0.08)',
            color: '#34d399',
            borderColor: 'rgba(52,211,153,0.2)',
          }}
        >
          ● Deployment: Active
        </span>
        <span
          className="px-2.5 py-1 rounded border text-[10px] font-semibold tracking-wider uppercase"
          style={{
            fontFamily: 'var(--font-mono)',
            background: 'rgba(110,168,254,0.08)',
            color: 'var(--color-primary)',
            borderColor: 'rgba(110,168,254,0.2)',
          }}
        >
          Nodes: 12
        </span>
        <span
          className="px-2.5 py-1 rounded border text-[10px] font-semibold tracking-wider uppercase"
          style={{
            fontFamily: 'var(--font-mono)',
            background: 'rgba(185,143,255,0.08)',
            color: 'var(--color-secondary)',
            borderColor: 'rgba(185,143,255,0.2)',
          }}
        >
          Uptime: 99.9%
        </span>
      </div>
    </div>
  );
};

export const PlatformInsights = () => {
    return (
      <div className="stitch-card p-6 max-w-2xl mx-auto space-y-6 shadow-2xl relative overflow-hidden my-12">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gradient opacity-[0.04] blur-xl" />
  
        <div className="flex justify-between items-center border-b border-white/[0.08] pb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Platform Insights</h3>
            <p className="text-xs text-zinc-400 font-mono">Live Machine Intelligence Dashboard</p>
          </div>
          <div className="text-primary text-xl">📊</div>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-container-lowest border border-white/[0.04] p-4 rounded-lg space-y-4">
            <p className="text-xs font-medium text-zinc-400">User Growth</p>
            <div className="h-16 flex items-end gap-2 pt-2">
              <div className="w-full bg-white/10 h-1/4 rounded-sm" />
              <div className="w-full bg-white/20 h-2/4 rounded-sm" />
              <div className="w-full bg-white/10 h-1/3 rounded-sm" />
              <div className="w-full bg-primary/60 h-4/5 rounded-sm" />
            </div>
          </div>
  
          <div className="bg-surface-container-lowest border border-white/[0.04] p-4 rounded-lg flex flex-col items-center justify-center text-center">
            <p className="text-xs font-medium text-zinc-400 mb-2">AI Confidence</p>
            <div className="relative w-16 h-16 rounded-full border-4 border-secondary/20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-secondary border-t-transparent animate-spin" style={{ animationDuration: '3s' }} />
              <span className="text-xs font-mono font-bold text-white">84%</span>
            </div>
          </div>
        </div>
  
        <div className="bg-surface-container-lowest border border-white/[0.04] p-4 rounded-lg space-y-2">
          <p className="text-xs font-medium text-zinc-400">Regional Heatmap</p>
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`h-6 rounded-sm ${i === 2 || i === 3 ? 'bg-primary/40' : 'bg-white/5'}`} />
            ))}
          </div>
        </div>
  
        <div className="flex gap-2 text-[10px] font-mono tracking-wider">
          <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded border border-green-500/20">DEPLOYMENT: ACTIVE</span>
          <span className="px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20">NODES: 12</span>
        </div>
      </div>
    );
  };
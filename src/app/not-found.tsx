export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#faf4ec] px-6 py-10 font-bricolage">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Glow Effects */}
      <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-[#1230f5]/10 blur-3xl" />
      <div className="absolute bottom-[-140px] right-[-140px] h-[360px] w-[360px] rounded-full bg-[#1230f5]/10 blur-3xl" />

      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-14 lg:flex-row lg:justify-between">
        {/* Left Side */}
        <div className="max-w-xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1230f5]/10 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#1230f5] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#1230f5] animate-pulse" />
            Error 404
          </div>

          <h1 className="mt-6 text-7xl font-black leading-none tracking-[-0.08em] text-[#0f172a] sm:text-9xl">
            Oops.
          </h1>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0f172a] sm:text-5xl">
            This route is missing.
          </h2>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-[#64748b] sm:text-lg">
            Looks like the page you’re trying to access has either been removed,
            renamed, or never existed in this portal.
          </p>

        
        </div>

        {/* Right Side Creative UI */}
        <div className="relative flex items-center justify-center">
          {/* Floating cards */}
          <div className="absolute -left-10 top-6 hidden w-36 rotate-[-8deg] rounded-3xl border border-white/70 bg-white/80 p-4 shadow-xl backdrop-blur-md lg:block">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#1230f5]" />
              <div className="h-2 w-16 rounded-full bg-[#e2e8f0]" />
            </div>

            <div className="mt-4 space-y-2">
              <div className="h-2 rounded-full bg-[#f1f5f9]" />
              <div className="h-2 w-2/3 rounded-full bg-[#f1f5f9]" />
            </div>
          </div>

          <div className="absolute -right-8 bottom-10 hidden w-32 rotate-[10deg] rounded-3xl border border-white/70 bg-white/80 p-4 shadow-xl backdrop-blur-md lg:block">
            <div className="h-16 rounded-2xl bg-[#eef2ff]" />
            <div className="mt-3 h-2 rounded-full bg-[#f1f5f9]" />
          </div>

          {/* Main Error Window */}
          <div className="hidden md:block relative w-[340px] overflow-hidden rounded-[34px] border border-white/70 bg-white/80 shadow-2xl backdrop-blur-xl">
            {/* Window top */}
            <div className="flex items-center justify-between border-b border-[#eef2f7] px-5 py-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#f87171]" />
                <div className="h-3 w-3 rounded-full bg-[#facc15]" />
                <div className="h-3 w-3 rounded-full bg-[#4ade80]" />
              </div>

              <div className="rounded-full bg-[#f8fafc] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8]">
                Missing Route
              </div>
            </div>

            <div className="p-6">
              <div className="rounded-3xl bg-[#0f172a] p-6 text-white shadow-inner">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/50">
                      System
                    </p>
                    <p className="mt-2 text-3xl font-black tracking-tight">
                      404
                    </p>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4" />
                      <path d="M12 16h.01" />
                    </svg>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm font-bold text-white/70">
                    <span>Route status</span>
                    <span className="text-[#fca5a5]">Unavailable</span>
                  </div>

                  <div className="mt-4 overflow-hidden rounded-full bg-white/10">
                    <div className="h-2 w-full animate-pulse rounded-full bg-[#1230f5]" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { loadApis } from '@/lib/data'
import { NavBar } from '@/components/NavBar'
import { ApiGrid } from '@/components/ApiGrid'

export default function Home() {
  const apis = loadApis()
  const liveCount = apis.filter(a => a.status.alive).length
  const freeCount = apis.filter(a => a.freeTier.available).length
  const lastChecked = apis[0]?.status.lastChecked ?? ''

  const stats = [
    { num: apis.length, label: 'APIs tracked' },
    { num: liveCount, label: 'Live right now' },
    { num: freeCount, label: 'Free tier' },
    { num: '24h', label: 'Check interval' },
  ]

  return (
    <>
      <NavBar liveCount={liveCount} apis={apis} />

      <main className="relative z-[1] overflow-x-hidden pb-[100px]">

        {/* Hero */}
        <section className="hero relative overflow-hidden px-5 pt-14 pb-10 sm:px-10 md:px-12 md:pt-20 md:pb-16">

          {/* Animated grid background */}
          <div className="hero-grid" aria-hidden="true" />

          {/* Accent glow behind headline */}
          <div aria-hidden="true" className="pointer-events-none absolute -top-20 left-1/2 h-[300px] w-full max-w-[600px] -translate-x-1/2" style={{
            background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
          }} />

          <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>

            {/* Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              background: 'rgba(139, 92, 246, 0.08)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '20px',
              padding: '5px 13px',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--accent-bright)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '28px',
              animation: 'fade-up 0.5s ease both',
            }}>
              <div style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: 'var(--live)',
                animation: 'pulse-dot 2s ease-in-out infinite',
              }} />
              Updated daily
            </div>

            {/* Main headline */}
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(42px, 6vw, 68px)',
              lineHeight: 1.05,
              letterSpacing: '-2px',
              color: 'var(--text)',
              marginBottom: '18px',
              animation: 'fade-up 0.5s ease 0.08s both',
            }}>
              Every AI API.<br />
              <span className="grad">Live-tested.</span>{' '}
              Free tiers first.
            </h1>

            {/* Subheadline */}
            <p style={{
              fontSize: '16px',
              lineHeight: 1.65,
              color: 'var(--text-2)',
              maxWidth: '520px',
              margin: '0 auto 44px',
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              animation: 'fade-up 0.5s ease 0.15s both',
            }}>
              The only AI API directory that checks if APIs are actually working today
              and shows you how to use them in one click.
            </p>

            {/* Stats row */}
            <div
              className="hero-stats grid grid-cols-2 gap-y-6 sm:flex sm:justify-center"
              style={{ marginBottom: '48px', animation: 'fade-up 0.5s ease 0.22s both' }}
            >
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`hero-stat px-2 text-center sm:flex-none sm:px-8${i < stats.length - 1 ? ' sm:border-r sm:border-[var(--border)]' : ''}`}
                >
                  <div className="hero-stat-num" style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '36px',
                    letterSpacing: '-1px',
                    color: 'var(--text)',
                    lineHeight: 1,
                    animation: `counter-in 0.4s ease ${0.28 + i * 0.07}s both`,
                  }}>
                    {stat.num}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--text-3)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginTop: '6px',
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Cards + filters */}
        <div className="section-pad px-5 sm:px-10 md:px-12">
          <div id="api-grid">
            <ApiGrid apis={apis} />
          </div>
        </div>

        {/* Footer */}
        <footer
          className="site-footer mt-20 flex flex-col items-center gap-3 border-t border-[var(--border)] px-5 pt-6 text-center sm:flex-row sm:justify-between sm:px-10 sm:text-left md:px-12"
          style={{ fontSize: '12px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}
        >
          <span>
            last check:{' '}
            {lastChecked
              ? new Date(lastChecked).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'unknown'}
          </span>
          <span className="flex gap-5">
            <a href="https://github.com/KP-MobileTechie/ai-api-hub" style={{ color: 'var(--accent-bright)', textDecoration: 'none' }}>
              GitHub
            </a>
            <a href="https://github.com/KP-MobileTechie/ai-api-hub/issues/new?template=submit-api.md" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>
              Submit an API
            </a>
          </span>
        </footer>
      </main>
    </>
  )
}

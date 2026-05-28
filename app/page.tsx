import { loadApis } from '@/lib/data'
import { NavBar } from '@/components/NavBar'
import { ApiGrid } from '@/components/ApiGrid'

export default function Home() {
  const apis = loadApis()
  const liveCount = apis.filter(a => a.status.alive).length
  const freeCount = apis.filter(a => a.freeTier.available).length
  const lastChecked = apis[0]?.status.lastChecked ?? ''

  return (
    <>
      <NavBar liveCount={liveCount} apis={apis} />
      <main className="relative z-10 px-10 pb-20">
        <div className="max-w-[640px] mx-auto text-center pt-16 pb-10">
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold mb-5 uppercase tracking-wide"
            style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)', color: '#c084fc' }}
          >
            Updated daily
          </div>

          <h1 className="font-bold text-[44px] leading-[1.1] tracking-[-1.5px] mb-3.5" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Every AI API.<br />
            <span className="grad">Live-tested.</span> Free tiers first.
          </h1>

          <p className="text-[15px] leading-[1.6] mb-7" style={{ color: 'var(--text-2)' }}>
            The only AI API directory that checks if APIs are actually working today and shows you how to use them in one click.
          </p>

          <div className="flex justify-center gap-8 mb-9">
            {[
              { num: apis.length, label: 'APIs tracked' },
              { num: liveCount, label: 'Live right now' },
              { num: freeCount, label: 'Free tier' },
              { num: '24h', label: 'Check interval' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div
                  className="font-extrabold text-[28px]"
                  style={{ background: 'linear-gradient(135deg, var(--accent-1), var(--accent-2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'Manrope, sans-serif' }}
                >
                  {stat.num}
                </div>
                <div className="text-[11px] uppercase tracking-wide mt-0.5" style={{ color: 'var(--text-3)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div id="api-grid">
          <ApiGrid apis={apis} />
        </div>

        <footer className="mt-14 pt-6 flex justify-between items-center text-xs" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-3)' }}>
          <span>
            Last health check:{' '}
            {lastChecked
              ? new Date(lastChecked).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'unknown'}
          </span>
          <span>
            Built in public{' '}
            <a href="https://github.com/yourusername/ai-api-hub" style={{ color: 'var(--accent-1)', textDecoration: 'none' }}>
              Contribute on GitHub
            </a>
            {' '}·{' '}
            <a href="https://github.com/yourusername/ai-api-hub/issues/new" style={{ color: 'var(--accent-1)', textDecoration: 'none' }}>
              Submit an API
            </a>
          </span>
        </footer>
      </main>
    </>
  )
}

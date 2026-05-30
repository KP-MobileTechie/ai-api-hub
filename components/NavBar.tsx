'use client'

import { useState } from 'react'
import type { ApiEntry } from '@/types/api'
import { CompareModal } from './CompareModal'

interface Props {
  liveCount: number
  apis: ApiEntry[]
}

function LogoMark() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6d28d9" />
          <stop offset="1" stopColor="#4338ca" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Background — squircle */}
      <rect width="34" height="34" rx="10" fill="url(#logoGrad)" />
      <rect width="34" height="34" rx="10" fill="url(#logoGrad)" opacity="0.4" />

      {/* Hub mark — central node + 3 satellites */}
      {/* Center node */}
      <circle cx="17" cy="17" r="3.2" fill="white" filter="url(#glow)" />

      {/* Top node */}
      <circle cx="17" cy="7.5" r="2" fill="white" opacity="0.75" />
      {/* Bottom-right node */}
      <circle cx="25.3" cy="22" r="2" fill="white" opacity="0.75" />
      {/* Bottom-left node */}
      <circle cx="8.7" cy="22" r="2" fill="white" opacity="0.75" />

      {/* Connecting lines */}
      <line x1="17" y1="13.8" x2="17" y2="9.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.45" />
      <line x1="19.7" y1="19.2" x2="23.7" y2="20.4" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.45" />
      <line x1="14.3" y1="19.2" x2="10.3" y2="20.4" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.45" />
    </svg>
  )
}

export function NavBar({ liveCount, apis }: Props) {
  const [showCompare, setShowCompare] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  function handleBrowse(e: React.MouseEvent) {
    e.preventDefault()
    document.getElementById('api-grid')?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleCategories(e: React.MouseEvent) {
    e.preventDefault()
    document.getElementById('filter-chips')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  function handleGitHub() {
    showToast('Opening GitHub repo...')
    setTimeout(() => window.open('https://github.com/KP-MobileTechie/ai-api-hub', '_blank'), 600)
  }

  const linkStyle: React.CSSProperties = {
    color: 'var(--text-2)',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 500,
    letterSpacing: '0.01em',
    transition: 'color 0.15s',
    fontFamily: 'var(--font-body)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 0',
  }

  return (
    <>
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        background: 'rgba(3,3,5,0.82)',
        borderBottom: '1px solid rgba(255,255,255,0.055)',
        boxShadow: '0 1px 0 0 rgba(109,40,217,0.07)',
      }}>

        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '11px', cursor: 'default', userSelect: 'none' }}>
          <LogoMark />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1px', lineHeight: 1 }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
              fontSize: '15px',
              color: 'var(--accent-bright)',
              letterSpacing: '0.04em',
            }}>
              api
            </span>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '18px',
              color: 'var(--text)',
              letterSpacing: '-0.5px',
            }}>
              Hub
            </span>
          </div>
        </div>

        {/* Center nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
          <a href="#browse" onClick={handleBrowse} style={linkStyle}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-2)')}
          >
            Browse
          </a>
          <a href="#categories" onClick={handleCategories} style={linkStyle}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-2)')}
          >
            Categories
          </a>
          <button onClick={() => setShowCompare(true)} style={linkStyle}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-2)')}
          >
            Compare
          </button>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'rgba(16,185,129,0.07)',
            border: '1px solid rgba(16,185,129,0.18)',
            borderRadius: '20px',
            padding: '5px 12px',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--live)',
          }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: 'var(--live)',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }} />
            {liveCount} live
          </div>
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <a
            href="https://github.com/KP-MobileTechie/ai-api-hub/issues/new?template=submit-api.md"
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...linkStyle, textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-2)')}
          >
            Submit API
          </a>

          <button
            onClick={handleGitHub}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              fontSize: '13.5px', fontWeight: 600,
              padding: '8px 18px',
              borderRadius: '9px',
              border: '1px solid rgba(139,92,246,0.3)',
              cursor: 'pointer',
              color: '#fff',
              fontFamily: 'var(--font-body)',
              background: 'linear-gradient(135deg, rgba(109,40,217,0.6), rgba(67,56,202,0.6))',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 0 20px rgba(109,40,217,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
              transition: 'opacity 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 0 28px rgba(109,40,217,0.4), inset 0 1px 0 rgba(255,255,255,0.08)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(109,40,217,0.2), inset 0 1px 0 rgba(255,255,255,0.08)'
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Star on GitHub
          </button>
        </div>
      </nav>

      {showCompare && <CompareModal apis={apis} onClose={() => setShowCompare(false)} />}

      {toast && (
        <div style={{
          position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          padding: '10px 20px', borderRadius: '10px',
          fontSize: '13px', zIndex: 50,
          background: 'rgba(109,40,217,0.15)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(139,92,246,0.25)',
          color: '#c4b5fd',
          fontFamily: 'var(--font-mono)',
          whiteSpace: 'nowrap',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          {toast}
        </div>
      )}
    </>
  )
}

'use client'

import { useEffect, useRef } from 'react'

interface Props {
  value: string
  onChange: (val: string) => void
}

export function SearchBar({ value, onChange }: Props) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        ref.current?.focus()
      }
      if (e.key === 'Escape' && document.activeElement === ref.current) {
        onChange('')
        ref.current?.blur()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onChange])

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', position: 'relative' }}>
      <span style={{
        position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
        color: 'var(--text-3)', fontSize: '14px', pointerEvents: 'none',
        fontFamily: 'var(--font-mono)',
      }}>
        ⌕
      </span>
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search by name, model, or tag..."
        style={{
          width: '100%',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '13px 48px 13px 42px',
          fontSize: '14px',
          color: 'var(--text)',
          fontFamily: 'var(--font-body)',
          outline: 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
        onFocus={e => {
          e.target.style.borderColor = 'rgba(139,92,246,0.45)'
          e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.08)'
        }}
        onBlur={e => {
          e.target.style.borderColor = 'var(--border)'
          e.target.style.boxShadow = 'none'
        }}
      />
      {value ? (
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid var(--border)',
            borderRadius: '5px',
            padding: '2px 8px',
            fontSize: '10px',
            color: 'var(--text-2)',
            fontFamily: 'var(--font-mono)',
            cursor: 'pointer',
          }}
        >
          esc
        </button>
      ) : (
        <span style={{
          position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border)',
          borderRadius: '5px',
          padding: '2px 7px',
          fontSize: '10px',
          color: 'var(--text-3)',
          fontFamily: 'var(--font-mono)',
          pointerEvents: 'none',
        }}>
          ⌘K
        </span>
      )}
    </div>
  )
}

'use client'

interface Props {
  value: string
  onChange: (val: string) => void
}

export function SearchBar({ value, onChange }: Props) {
  return (
    <div className="max-w-[560px] mx-auto relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base pointer-events-none" style={{ color: 'var(--text-3)' }}>
        🔍
      </span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search by name, model, or tag..."
        className="w-full rounded-[14px] py-3.5 pl-12 pr-14 text-sm outline-none"
        style={{
          background: 'var(--surface)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
        }}
      />
      {value ? (
        <button
          onClick={() => onChange('')}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded px-2 py-0.5 text-xs"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid var(--border)',
            color: 'var(--text-2)',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          }}
        >
          clear
        </button>
      ) : (
        <span
          className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded px-2 py-0.5 text-[10px] pointer-events-none font-mono"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-3)' }}
        >
          Ctrl+K
        </span>
      )}
    </div>
  )
}

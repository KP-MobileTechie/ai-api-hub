'use client'

import type { ApiEntry, Category } from '@/types/api'

interface UseCasePickerProps {
  apis: ApiEntry[]
  onPick: (useCase: Category | null) => void
  active: Category | null
}

const USE_CASES: { key: Category; label: string }[] = [
  { key: 'inference', label: 'Chat / LLM' },
  { key: 'embeddings', label: 'Embeddings' },
  { key: 'image-gen', label: 'Image' },
  { key: 'speech', label: 'Speech' },
  { key: 'code', label: 'Code' },
  { key: 'multimodal', label: 'Multimodal' },
  { key: 'vision', label: 'Vision' },
]

export function UseCasePicker({ apis, onPick, active }: UseCasePickerProps) {
  // Only surface use cases that actually have matching APIs.
  const available = USE_CASES.filter(uc => apis.some(a => a.category === uc.key))
  const cases = available.length > 0 ? available : USE_CASES

  return (
    <div className="flex flex-col gap-3 mb-5">
      <div className="flex items-baseline gap-2 flex-wrap">
        <span
          className="text-[13px] font-semibold"
          style={{ color: 'var(--text)', fontFamily: 'Manrope, sans-serif' }}
        >
          What are you building?
        </span>
        <span className="text-[12px]" style={{ color: 'var(--text-3)' }}>
          Pick a use case for a ranked shortlist
        </span>
      </div>

      <div className="control-bar" role="group" aria-label="Pick a use case">
        {cases.map(uc => {
          const isActive = active === uc.key
          return (
            <button
              key={uc.key}
              type="button"
              className={`chip ${isActive ? 'active' : ''}`}
              aria-pressed={isActive}
              aria-label={`Recommend APIs for ${uc.label}`}
              onClick={() => onPick(isActive ? null : uc.key)}
            >
              {uc.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

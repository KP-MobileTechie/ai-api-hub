import { recommend } from '@/lib/recommend'
import type { ApiEntry } from '@/types/api'

const mk = (over: Partial<ApiEntry>): ApiEntry => ({
  id: over.id ?? 'x', name: over.name ?? 'X', description: '', url: '', docsUrl: '',
  category: over.category ?? 'inference', models: [], auth: 'api_key', tags: [],
  freeTier: over.freeTier ?? { available: false, details: '' },
  status: over.status ?? { alive: true, lastChecked: '', latencyMs: 100 },
  snippets: { python: '', javascript: '', curl: '' },
})

describe('recommend', () => {
  it('returns only APIs in the requested category', () => {
    const list = [mk({ id: 'a', category: 'inference' }), mk({ id: 'b', category: 'speech' })]
    const out = recommend(list, 'inference')
    expect(out.map(s => s.api.id)).toEqual(['a'])
  })

  it('ranks alive above down', () => {
    const list = [
      mk({ id: 'down', status: { alive: false, lastChecked: '', latencyMs: null } }),
      mk({ id: 'up', status: { alive: true, lastChecked: '', latencyMs: 100 } }),
    ]
    expect(recommend(list, 'inference')[0].api.id).toBe('up')
  })

  it('ranks lower latency higher among alive APIs', () => {
    const list = [
      mk({ id: 'slow', status: { alive: true, lastChecked: '', latencyMs: 900 } }),
      mk({ id: 'fast', status: { alive: true, lastChecked: '', latencyMs: 80 } }),
    ]
    expect(recommend(list, 'inference')[0].api.id).toBe('fast')
  })

  it('boosts APIs with a free tier', () => {
    const list = [
      mk({ id: 'paid', freeTier: { available: false, details: '' } }),
      mk({ id: 'free', freeTier: { available: true, details: 'yes' } }),
    ]
    expect(recommend(list, 'inference')[0].api.id).toBe('free')
  })

  it('returns empty array when no API matches the use case', () => {
    expect(recommend([mk({ category: 'speech' })], 'vision')).toEqual([])
  })
})

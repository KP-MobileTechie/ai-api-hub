import { filterApis, sortApis } from '../filter'
import type { ApiEntry } from '@/types/api'

const makeApi = (overrides: Partial<ApiEntry>): ApiEntry => ({
  id: 'test',
  name: 'Test API',
  description: 'A test API.',
  url: 'https://test.com',
  docsUrl: 'https://test.com/docs',
  category: 'inference',
  models: [],
  freeTier: { available: true, details: 'Free' },
  auth: 'api_key',
  status: { alive: true, lastChecked: '2026-05-29T06:00:00Z', latencyMs: 100 },
  tags: [],
  snippets: { python: '', javascript: '', curl: '' },
  ...overrides,
})

const apis: ApiEntry[] = [
  makeApi({ id: 'groq', name: 'Groq', category: 'inference', tags: ['fast'], freeTier: { available: true, details: '14k/day' }, status: { alive: true, lastChecked: '', latencyMs: 200 } }),
  makeApi({ id: 'cohere', name: 'Cohere', category: 'embeddings', tags: ['rag'], freeTier: { available: false, details: 'Paid' }, status: { alive: false, lastChecked: '', latencyMs: null } }),
  makeApi({ id: 'stability', name: 'Stability AI', category: 'image-gen', tags: ['sdxl'], freeTier: { available: true, details: '25 credits' }, status: { alive: true, lastChecked: '', latencyMs: 1800 } }),
]

describe('filterApis', () => {
  it('returns all APIs when query is empty and filter is all', () => {
    expect(filterApis(apis, '', 'all')).toHaveLength(3)
  })

  it('filters by name query', () => {
    const result = filterApis(apis, 'groq', 'all')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('groq')
  })

  it('filters by tag query', () => {
    const result = filterApis(apis, 'rag', 'all')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('cohere')
  })

  it('filters by category query', () => {
    const result = filterApis(apis, 'image', 'all')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('stability')
  })

  it('returns empty array when nothing matches', () => {
    expect(filterApis(apis, 'zzz_no_match', 'all')).toHaveLength(0)
  })

  it('filters to only free tier APIs', () => {
    const result = filterApis(apis, '', 'free')
    expect(result.every(a => a.freeTier.available)).toBe(true)
    expect(result).toHaveLength(2)
  })

  it('filters to only live APIs', () => {
    const result = filterApis(apis, '', 'live')
    expect(result.every(a => a.status.alive)).toBe(true)
    expect(result).toHaveLength(2)
  })

  it('filters by category', () => {
    const result = filterApis(apis, '', 'embeddings')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('cohere')
  })

  it('combines search query with filter', () => {
    const result = filterApis(apis, 'groq', 'free')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('groq')
  })

  it('query is case-insensitive', () => {
    expect(filterApis(apis, 'GROQ', 'all')).toHaveLength(1)
  })
})

describe('sortApis', () => {
  it('recommended keeps the original order (stable)', () => {
    const result = sortApis(apis, 'recommended')
    expect(result.map(a => a.id)).toEqual(['groq', 'cohere', 'stability'])
  })

  it('recommended returns the same array reference (no copy)', () => {
    expect(sortApis(apis, 'recommended')).toBe(apis)
  })

  it('name sorts alphabetically by name', () => {
    const result = sortApis(apis, 'name')
    expect(result.map(a => a.name)).toEqual(['Cohere', 'Groq', 'Stability AI'])
  })

  it('latency puts alive APIs first, then ascending latency, nulls last', () => {
    const result = sortApis(apis, 'latency')
    expect(result.map(a => a.id)).toEqual(['groq', 'stability', 'cohere'])
  })

  it('uptime puts alive APIs first, then ascending latency as a proxy', () => {
    const result = sortApis(apis, 'uptime')
    expect(result.map(a => a.id)).toEqual(['groq', 'stability', 'cohere'])
  })

  it('does not mutate the input array', () => {
    const before = apis.map(a => a.id)
    sortApis(apis, 'name')
    expect(apis.map(a => a.id)).toEqual(before)
  })
})

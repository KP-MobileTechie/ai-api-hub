import { encodeView, decodeView, DEFAULT_VIEW } from '@/lib/urlState'

it('round-trips a non-default view', () => {
  const v = { query: 'groq', filter: 'free' as const, sort: 'latency' as const }
  const decoded = decodeView(new URLSearchParams(encodeView(v)))
  expect(decoded).toEqual(v)
})

it('omits defaults from the encoded string', () => {
  expect(encodeView(DEFAULT_VIEW)).toBe('')
})

it('falls back to defaults for missing/unknown params', () => {
  expect(decodeView(new URLSearchParams(''))).toEqual(DEFAULT_VIEW)
  expect(decodeView(new URLSearchParams('s=bogus')).sort).toBe(DEFAULT_VIEW.sort)
})

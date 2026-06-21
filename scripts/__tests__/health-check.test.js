/**
 * @jest-environment node
 */
const { classifyResponse, buildStatusUpdate, collectDown } = require('../health-check')
const { renderBadge } = require('../generate-badges')

describe('classifyResponse', () => {
  it('marks alive for 200 status', () => {
    expect(classifyResponse(200, 150)).toEqual({ alive: true, latencyMs: 150 })
  })

  it('marks alive for 401 (auth error means API is up)', () => {
    expect(classifyResponse(401, 200)).toEqual({ alive: true, latencyMs: 200 })
  })

  it('marks alive for 403', () => {
    expect(classifyResponse(403, 180)).toEqual({ alive: true, latencyMs: 180 })
  })

  it('marks down for 500', () => {
    expect(classifyResponse(500, 100)).toEqual({ alive: false, latencyMs: null })
  })

  it('marks down for null (timeout)', () => {
    expect(classifyResponse(null, null)).toEqual({ alive: false, latencyMs: null })
  })
})

describe('buildStatusUpdate', () => {
  it('returns a status object with current timestamp', () => {
    const result = buildStatusUpdate(true, 210)
    expect(result.alive).toBe(true)
    expect(result.latencyMs).toBe(210)
    expect(result.lastChecked).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })
})

describe('collectDown', () => {
  it('returns only APIs whose status is not alive', () => {
    const apis = [
      { id: 'a', name: 'A', status: { alive: true } },
      { id: 'b', name: 'B', status: { alive: false } },
      { id: 'c', name: 'C' },
    ]
    expect(collectDown(apis)).toEqual([
      { id: 'b', name: 'B' },
      { id: 'c', name: 'C' },
    ])
  })

  it('returns an empty array when all APIs are alive', () => {
    const apis = [{ id: 'a', name: 'A', status: { alive: true } }]
    expect(collectDown(apis)).toEqual([])
  })
})

describe('renderBadge', () => {
  it('uses green for up', () => {
    const svg = renderBadge('Groq', 'up', true)
    expect(svg).toContain('#10b981')
    expect(svg).toContain('Groq')
    expect(svg).toContain('up')
  })

  it('uses red for down', () => {
    const svg = renderBadge('Groq', 'down', false)
    expect(svg).toContain('#ef4444')
    expect(svg).toContain('down')
  })
})

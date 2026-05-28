/**
 * @jest-environment node
 */
const { classifyResponse, buildStatusUpdate } = require('../health-check')

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

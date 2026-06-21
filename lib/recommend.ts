import type { ApiEntry, Category } from '@/types/api'

export interface ScoredApi { api: ApiEntry; score: number }
export interface RecommendWeights { alive: number; latency: number; freeTier: number }

export const DEFAULT_WEIGHTS: RecommendWeights = { alive: 100, latency: 40, freeTier: 30 }

// Latency normalized to 0..1 (lower is better); 1000ms+ scores ~0.
function latencyScore(ms: number | null): number {
  if (ms == null) return 0
  return Math.max(0, 1 - ms / 1000)
}

export function recommend(
  apis: ApiEntry[],
  useCase: Category,
  weights: RecommendWeights = DEFAULT_WEIGHTS,
): ScoredApi[] {
  return apis
    .filter((api) => api.category === useCase)
    .map((api) => {
      const score =
        (api.status.alive ? weights.alive : 0) +
        latencyScore(api.status.latencyMs) * weights.latency +
        (api.freeTier.available ? weights.freeTier : 0)
      return { api, score }
    })
    .sort((a, b) => b.score - a.score)
}

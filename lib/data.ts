import { readFileSync } from 'fs'
import { join } from 'path'
import type { ApiEntry, History } from '@/types/api'

export function loadApis(): ApiEntry[] {
  const raw = readFileSync(join(process.cwd(), 'data/apis.json'), 'utf-8')
  return JSON.parse(raw)
}

export function loadHistory(): History {
  const raw = readFileSync(join(process.cwd(), 'data/history.json'), 'utf-8')
  return JSON.parse(raw)
}

import type { Store } from '../types'
import { emptyStore } from './schedule'

export const STORAGE_KEY = 'tapped-in:v1'

export function loadStore(): Store {
  try {
    if (typeof localStorage === 'undefined') return emptyStore()
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyStore()
    const parsed = JSON.parse(raw) as Store
    if (typeof parsed.completedSessions !== 'number' || typeof parsed.cards !== 'object') {
      return emptyStore()
    }
    return {
      completedSessions: parsed.completedSessions,
      cards: parsed.cards ?? {},
      current: parsed.current
        ? {
            ...parsed.current,
            choices: parsed.current.choices ?? [],
            finished: parsed.current.finished ?? false,
          }
        : null,
    }
  } catch {
    return emptyStore()
  }
}

export function saveStore(store: Store): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

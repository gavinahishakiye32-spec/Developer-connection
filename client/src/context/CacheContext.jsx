/**
 * Global in-memory cache with stale-while-revalidate.
 *
 * How it works:
 * - First visit to a page: data is fetched, stored in cache, shown immediately
 * - Return visit: cached data shown INSTANTLY (no spinner), then silently
 *   re-fetched in the background and updated if changed
 * - TTL: cache entries expire after 60 seconds, forcing a fresh fetch
 */
import { createContext, useContext, useRef, useCallback } from 'react'

const CacheContext = createContext(null)

const TTL = 60_000 // 60 seconds

export function CacheProvider({ children }) {
  const store = useRef({}) // { [key]: { data, ts, promise } }

  const get = useCallback((key) => {
    const entry = store.current[key]
    if (!entry) return null
    if (Date.now() - entry.ts > TTL) return null // expired
    return entry.data
  }, [])

  const set = useCallback((key, data) => {
    store.current[key] = { data, ts: Date.now() }
  }, [])

  const invalidate = useCallback((key) => {
    delete store.current[key]
  }, [])

  const invalidatePrefix = useCallback((prefix) => {
    Object.keys(store.current).forEach(k => {
      if (k.startsWith(prefix)) delete store.current[k]
    })
  }, [])

  // Deduplicate in-flight requests — if two components request the same key
  // at the same time, only one HTTP call is made
  const getOrFetch = useCallback(async (key, fetcher) => {
    const cached = get(key)
    if (cached !== null) return cached

    // If already in-flight, wait for the same promise
    if (store.current[key]?.promise) {
      return store.current[key].promise
    }

    const promise = fetcher().then(data => {
      set(key, data)
      delete store.current[key].promise
      return data
    })

    store.current[key] = { ...(store.current[key] || {}), promise }
    return promise
  }, [get, set])

  return (
    <CacheContext.Provider value={{ get, set, invalidate, invalidatePrefix, getOrFetch }}>
      {children}
    </CacheContext.Provider>
  )
}

export const useCache = () => useContext(CacheContext)

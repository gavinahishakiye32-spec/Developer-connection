/**
 * Global cache — in-memory + sessionStorage backed.
 *
 * - In-memory: instant reads within the same JS session
 * - sessionStorage: survives React re-mounts and Suspense unmounts
 *   so navigating back to a page never triggers a reload
 * - TTL: 60 seconds — after that, data is re-fetched silently in background
 */
import { createContext, useContext, useRef, useCallback } from 'react'

const CacheContext = createContext(null)
const TTL = 60_000
const SS_PREFIX = 'dc_cache_'

// Read from sessionStorage on init so cache survives component remounts
const readFromStorage = (key) => {
  try {
    const raw = sessionStorage.getItem(SS_PREFIX + key)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > TTL) { sessionStorage.removeItem(SS_PREFIX + key); return null }
    return data
  } catch { return null }
}

const writeToStorage = (key, data) => {
  try {
    sessionStorage.setItem(SS_PREFIX + key, JSON.stringify({ data, ts: Date.now() }))
  } catch { /* storage full — ignore */ }
}

export function CacheProvider({ children }) {
  const store = useRef({})

  const get = useCallback((key) => {
    // Check in-memory first
    const mem = store.current[key]
    if (mem && Date.now() - mem.ts <= TTL) return mem.data
    // Fall back to sessionStorage
    const ss = readFromStorage(key)
    if (ss !== null) {
      store.current[key] = { data: ss, ts: Date.now() }
      return ss
    }
    return null
  }, [])

  const set = useCallback((key, data) => {
    store.current[key] = { data, ts: Date.now() }
    writeToStorage(key, data)
  }, [])

  const invalidate = useCallback((key) => {
    delete store.current[key]
    try { sessionStorage.removeItem(SS_PREFIX + key) } catch { /* ignore */ }
  }, [])

  const invalidatePrefix = useCallback((prefix) => {
    Object.keys(store.current).forEach(k => {
      if (k.startsWith(prefix)) {
        delete store.current[k]
        try { sessionStorage.removeItem(SS_PREFIX + k) } catch { /* ignore */ }
      }
    })
  }, [])

  return (
    <CacheContext.Provider value={{ get, set, invalidate, invalidatePrefix }}>
      {children}
    </CacheContext.Provider>
  )
}

export const useCache = () => useContext(CacheContext)

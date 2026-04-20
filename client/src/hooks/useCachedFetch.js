/**
 * useCachedFetch — stale-while-revalidate hook
 *
 * - If cache has data: returns it IMMEDIATELY (no loading state shown)
 * - Simultaneously re-fetches in background and updates if data changed
 * - If no cache: fetches normally and shows loading
 */
import { useState, useEffect, useRef } from 'react'
import { useCache } from '../context/CacheContext'

export function useCachedFetch(key, fetcher, deps = []) {
  const cache = useCache()
  const cached = key ? cache.get(key) : null

  const [data, setData] = useState(cached)
  const [loading, setLoading] = useState(!cached)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  useEffect(() => {
    if (!key || !fetcher) return

    const run = async () => {
      const fresh = cache.get(key)
      if (fresh !== null) {
        // Show cached data instantly
        if (mountedRef.current) {
          setData(fresh)
          setLoading(false)
        }
        // Still revalidate silently in background
        try {
          const result = await fetcher()
          cache.set(key, result)
          if (mountedRef.current) setData(result)
        } catch { /* silent background refresh failure is fine */ }
      } else {
        // No cache — show loading, fetch, then show
        if (mountedRef.current) setLoading(true)
        try {
          const result = await fetcher()
          cache.set(key, result)
          if (mountedRef.current) setData(result)
        } catch (err) {
          console.error(err)
        } finally {
          if (mountedRef.current) setLoading(false)
        }
      }
    }

    run()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, ...deps])

  const mutate = (updater) => {
    const next = typeof updater === 'function' ? updater(data) : updater
    cache.set(key, next)
    setData(next)
  }

  return { data: data ?? [], loading, mutate }
}

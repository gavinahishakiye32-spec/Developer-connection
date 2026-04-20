/**
 * usePrefetch — start fetching data when the user hovers a nav link.
 * By the time they click, the data is already in cache.
 */
import { useCallback } from 'react'
import { useCache } from '../context/CacheContext'
import { postsAPI, jobsAPI, notificationsAPI, applicationsAPI, invitationsAPI } from '../services/api'

const prefetchers = {
  '/feed':         { key: 'posts',            fn: () => postsAPI.getAll().then(r => r.data) },
  '/jobs':         { key: 'jobs:all',         fn: () => jobsAPI.getAll().then(r => r.data) },
  '/notifications':{ key: 'notifications',    fn: () => notificationsAPI.getAll().then(r => r.data) },
  '/applications': { key: 'my-applications',  fn: () => applicationsAPI.getMy().then(r => r.data) },
  '/invitations':  { key: 'invitations',      fn: () => invitationsAPI.getAll().then(r => r.data) },
}

export function usePrefetch() {
  const cache = useCache()

  const prefetch = useCallback((path) => {
    const entry = prefetchers[path]
    if (!entry) return
    // Only prefetch if not already cached
    if (cache.get(entry.key) !== null) return
    entry.fn().then(data => cache.set(entry.key, data)).catch(() => {})
  }, [cache])

  return prefetch
}

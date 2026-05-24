import { useEffect, useState } from 'react'
import { apiClient } from '../api/client'

const imageCache = new Map()

export function usePresignedImage(key) {
  const cached = key ? imageCache.get(key) : null
  const [state, setState] = useState({
    url: cached || '',
    loading: Boolean(key && !cached),
    error: null,
  })

  useEffect(() => {
    if (!key) {
      setState({ url: '', loading: false, error: null })
      return
    }

    if (imageCache.has(key)) {
      setState({ url: imageCache.get(key), loading: false, error: null })
      return
    }

    let cancelled = false
    setState({ url: '', loading: true, error: null })

    apiClient
      .presignGet({ key })
      .then((data) => {
        if (cancelled) return
        imageCache.set(key, data.url)
        setState({ url: data.url, loading: false, error: null })
      })
      .catch((error) => {
        if (cancelled) return
        setState({ url: '', loading: false, error })
      })

    return () => {
      cancelled = true
    }
  }, [key])

  return state
}

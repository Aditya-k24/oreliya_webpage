import { useState, useCallback, useRef } from 'react'

interface SignedUrlResult {
  success: boolean
  signedUrl?: string
  expiresAt?: string
  message?: string
}

interface UseSignedUrlOptions {
  expiresIn?: number // Default 1 hour
  cacheTime?: number // How long to cache the signed URL (default 30 minutes)
}

export const useSignedUrl = (options: UseSignedUrlOptions = {}) => {
  const { expiresIn = 3600, cacheTime = 1800 } = options // Default 1 hour expiry, 30 min cache
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Cache for signed URLs to avoid unnecessary API calls
  const urlCache = useRef<Map<string, { url: string; expiresAt: string; cachedAt: number }>>(new Map())

  const getSignedUrl = useCallback(async (filePath: string): Promise<SignedUrlResult> => {
    setIsLoading(true)
    setError(null)

    try {
      // Check cache first
      const cached = urlCache.current.get(filePath)
      if (cached) {
        const now = Date.now()
        const cacheExpiry = cached.cachedAt + (cacheTime * 1000)
        const urlExpiry = new Date(cached.expiresAt).getTime()
        
        // Return cached URL if it's still valid and not expired
        if (now < cacheExpiry && now < urlExpiry) {
          setIsLoading(false)
          return {
            success: true,
            signedUrl: cached.url,
            expiresAt: cached.expiresAt
          }
        }
        
        // Remove expired cache entry
        urlCache.current.delete(filePath)
      }

      const response = await fetch('/api/images/signed-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filePath,
          expiresIn
        })
      })

      const result: SignedUrlResult = await response.json()

      if (!result.success) {
        setError(result.message || 'Failed to generate signed URL')
        return result
      }

      // Cache the signed URL
      if (result.signedUrl && result.expiresAt) {
        urlCache.current.set(filePath, {
          url: result.signedUrl,
          expiresAt: result.expiresAt,
          cachedAt: Date.now()
        })
      }

      return result
    } catch (err) {
      console.error('Signed URL error:', err)
      setError('An unexpected error occurred while generating signed URL.')
      return { success: false, message: 'An unexpected error occurred.' }
    } finally {
      setIsLoading(false)
    }
  }, [expiresIn, cacheTime])

  const clearCache = useCallback(() => {
    urlCache.current.clear()
  }, [])

  const clearCacheForFile = useCallback((filePath: string) => {
    urlCache.current.delete(filePath)
  }, [])

  return {
    getSignedUrl,
    isLoading,
    error,
    clearCache,
    clearCacheForFile
  }
}

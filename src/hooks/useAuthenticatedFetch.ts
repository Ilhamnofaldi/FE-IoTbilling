import { useCallback } from 'react'
import AuthMiddleware from '../lib/authMiddleware'
import { useAuth } from '../contexts/AuthContext'

interface RequestConfig {
  method?: string
  headers?: Record<string, string>
  body?: string
}

// Hook untuk melakukan authenticated fetch
export const useAuthenticatedFetch = () => {
  const { logout } = useAuth()

  const authenticatedFetch = useCallback(async (url: string, config: RequestConfig = {}) => {
    try {
      return await AuthMiddleware.authenticatedFetch(url, config)
    } catch (error) {
      // Jika authentication gagal, logout user
      if (error instanceof Error && error.message === 'Authentication failed') {
        logout()
      }
      throw error
    }
  }, [logout])

  return { authenticatedFetch }
}

// Hook untuk check authentication status
export const useAuthStatus = () => {
  const isAuthenticated = useCallback(() => {
    return AuthMiddleware.isAuthenticated()
  }, [])

  return { isAuthenticated }
}
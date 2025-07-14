// Auth middleware untuk mengelola request dengan token

interface RequestConfig {
  method?: string
  headers?: Record<string, string>
  body?: string
}

class AuthMiddleware {
  private static getAccessToken(): string | null {
    return localStorage.getItem('accessToken')
  }

  private static getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken')
  }

  // Method untuk membuat authenticated request
  static async authenticatedFetch(url: string, config: RequestConfig = {}): Promise<Response> {
    const accessToken = this.getAccessToken()
    
    if (!accessToken) {
      throw new Error('No access token available')
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      ...config.headers,
    }

    const requestConfig = {
      ...config,
      headers,
    }

    try {
      const response = await fetch(url, requestConfig)
      
      // Jika token expired (401), coba refresh token
      if (response.status === 401) {
        const refreshed = await this.refreshAccessToken()
        if (refreshed) {
          // Retry request dengan token baru
          const newAccessToken = this.getAccessToken()
          const newHeaders = {
            ...headers,
            'Authorization': `Bearer ${newAccessToken}`,
          }
          return fetch(url, { ...requestConfig, headers: newHeaders })
        } else {
          // Redirect ke login jika refresh gagal
          this.redirectToLogin()
          throw new Error('Authentication failed')
        }
      }

      return response
    } catch (error) {
      console.error('Authenticated fetch error:', error)
      throw error
    }
  }

  // Method untuk refresh access token
  private static async refreshAccessToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken()
    
    if (!refreshToken) {
      return false
    }

    try {
      const response = await fetch('http://34.101.143.2:3000/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('accessToken', data.data.accessToken)
        if (data.data.refreshToken) {
          localStorage.setItem('refreshToken', data.data.refreshToken)
        }
        return true
      }
    } catch (error) {
      console.error('Token refresh error:', error)
    }

    return false
  }

  // Method untuk redirect ke login
  private static redirectToLogin(): void {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    window.location.href = '/login'
  }

  // Method untuk check apakah user sudah login
  static isAuthenticated(): boolean {
    return !!this.getAccessToken()
  }

  // Method untuk logout
  static logout(): void {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    window.location.href = '/login'
  }
}

export default AuthMiddleware
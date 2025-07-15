import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  type: string
  name?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'))
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'))
  const [isLoading, setIsLoading] = useState(true)

  // Initialize user data from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser && accessToken) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [accessToken])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://34.101.143.2:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      
      // Set user data
      setUser(data.data.user)
      
      // Set tokens
      setAccessToken(data.data.accessToken)
      setRefreshToken(data.data.refreshToken)
      
      // Store tokens and user data in localStorage
      localStorage.setItem('accessToken', data.data.accessToken)
      localStorage.setItem('refreshToken', data.data.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.data.user))
      
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setAccessToken(null)
    setRefreshToken(null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  return <AuthContext.Provider value={{ user, accessToken, refreshToken, isLoading, login, logout, updateUser }}>{children}</AuthContext.Provider>
}

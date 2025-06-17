"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar: string
  status: "online" | "offline"
}

interface AuthContextType {
  user: User | null
  login: (email: string) => Promise<void>
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
  const [user, setUser] = useState<User | null>({
    id: "1",
    name: "Joe Natania",
    email: "joenatania@gmail.com",
    avatar: "https://placehold.co/200x200/2d3748/ffffff?text=JN",
    status: "online",
  })

  const login = async (email: string) => {
    // Simulate login
    setUser({
      id: "1",
      name: "Joe Natania",
      email: email,
      avatar: "https://placehold.co/200x200/2d3748/ffffff?text=JN",
      status: "online",
    })
  }

  const logout = () => {
    setUser(null)
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  return <AuthContext.Provider value={{ user, login, logout, updateUser }}>{children}</AuthContext.Provider>
}

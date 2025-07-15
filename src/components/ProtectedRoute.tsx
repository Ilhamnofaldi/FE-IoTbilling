import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AuthMiddleware from '../lib/authMiddleware'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, accessToken, isLoading } = useAuth()

  // Show loading while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  }

  // Check jika user sudah login dan memiliki token
  const isAuthenticated = AuthMiddleware.isAuthenticated() && user && accessToken

  // Jika tidak authenticated, redirect ke login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
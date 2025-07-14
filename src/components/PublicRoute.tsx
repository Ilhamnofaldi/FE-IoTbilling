import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AuthMiddleware from '../lib/authMiddleware'

interface PublicRouteProps {
  children: React.ReactNode
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, accessToken, isLoading } = useAuth()

  // Show loading while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  }

  // Check jika user sudah login dan memiliki token
  const isAuthenticated = AuthMiddleware.isAuthenticated() && user && accessToken

  // Jika sudah authenticated, redirect ke dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default PublicRoute
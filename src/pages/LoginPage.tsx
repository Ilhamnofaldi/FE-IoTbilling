"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, Lock, EyeOff, Eye } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      navigate("/")
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-8">
        <div className="w-full max-w-md">
          {/* Logo/Brand area */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">Selamat Datang</h1>
            <p className="text-gray-600 text-sm">Masuk ke akun Anda untuk melanjutkan</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <Mail className="w-4 h-4 mr-2 text-purple-600" />
                Email
              </label>
              <div className="relative group">
                <Input
                  type="email"
                  placeholder="Ketik email anda"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border-2 border-gray-200 focus:border-purple-500 focus:bg-white transition-all duration-300 pl-4 pr-4 py-3 rounded-xl shadow-sm hover:shadow-md focus:shadow-lg"
                  required
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <Lock className="w-4 h-4 mr-2 text-purple-600" />
                Password
              </label>
              <div className="relative group">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Ketik password anda"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50 border-2 border-gray-200 focus:border-purple-500 focus:bg-white transition-all duration-300 pl-4 pr-12 py-3 rounded-xl shadow-sm hover:shadow-md focus:shadow-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-purple-600 transition-colors duration-200 focus:outline-none"
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Masuk...
                </div>
              ) : (
                "Masuk"
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Right side - Purple background with enhanced geometric patterns */}
      <div className="flex-1 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 relative overflow-hidden">
        {/* Enhanced Geometric patterns with animations */}
        <div className="absolute inset-0">
          {/* Floating geometric shapes with animations */}
          <div className="absolute top-10 left-10 w-8 h-8 border-2 border-white/30 transform rotate-45 animate-pulse"></div>
          <div className="absolute top-20 right-20 w-6 h-6 border-2 border-white/40 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-20 left-20 w-4 h-4 border-2 border-white/30 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-10 right-10 w-10 h-10 border-2 border-white/40 transform rotate-45 animate-pulse" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-6 h-6 border-2 border-white/30 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/3 right-1/3 w-8 h-8 border-2 border-white/40 animate-pulse" style={{animationDelay: '2.5s'}}></div>
          
          {/* Additional decorative elements */}
          <div className="absolute top-1/4 left-1/2 w-12 h-12 border border-white/20 rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
          <div className="absolute bottom-1/4 right-1/4 w-16 h-16 border border-white/15 rounded-full animate-spin" style={{animationDuration: '25s', animationDirection: 'reverse'}}></div>
          
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent"></div>
        </div>
        
        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-8">
            <h2 className="text-4xl font-bold mb-4 opacity-90">IoT Admin</h2>
            <p className="text-lg opacity-75 max-w-md">Kelola perangkat IoT Anda dengan mudah dan efisien</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

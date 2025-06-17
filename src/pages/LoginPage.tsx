"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, Lock, EyeOff } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
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
      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Masuk</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </label>
              <Input
                type="email"
                placeholder="Ketik email anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-100 border-0"
                required
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 mr-2" />
                Password
              </label>
              <div className="relative">
                <Input
                  type="password"
                  placeholder="Ketik password anda"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-100 border-0 pr-10"
                  required
                />
                <EyeOff className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
              disabled={loading}
            >
              {loading ? "Masuk..." : "Masuk"}
            </Button>
          </form>
        </div>
      </div>

      {/* Right side - Purple background with geometric patterns */}
      <div className="flex-1 bg-gradient-to-br from-purple-600 to-purple-800 relative overflow-hidden">
        {/* Geometric patterns */}
        <div className="absolute inset-0 opacity-20">
          {/* TODO: Add geometric pattern elements */}
          <div className="absolute top-10 left-10 w-8 h-8 border-2 border-white transform rotate-45"></div>
          <div className="absolute top-20 right-20 w-6 h-6 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-20 left-20 w-4 h-4 border-2 border-white"></div>
          <div className="absolute bottom-10 right-10 w-10 h-10 border-2 border-white transform rotate-45"></div>
          <div className="absolute top-1/2 left-1/4 w-6 h-6 border-2 border-white rounded-full"></div>
          <div className="absolute top-1/3 right-1/3 w-8 h-8 border-2 border-white"></div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

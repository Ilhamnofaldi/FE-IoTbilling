import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Edit } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"

const EditAkunPage = () => {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateUser({ name, email })
    navigate("/")
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Edit Akun</h1>
      </div>

      <div className="bg-white rounded-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              {/* TODO: Ganti dengan gambar asli */}
              <img
                src={user?.avatar || "/placeholder.svg"}
                alt={user?.name}
                className="w-32 h-32 rounded-lg object-cover"
              />
              <button
                type="button"
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama pengguna</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-100 border-0"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-100 border-0"
              required
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 mt-8">
            Simpan perubahan
          </Button>
        </form>
      </div>
    </div>
  )
}

export default EditAkunPage

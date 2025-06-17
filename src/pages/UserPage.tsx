import { Users } from "lucide-react"

const UserPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Users className="w-6 h-6 text-purple-600" />
        <h1 className="text-2xl font-bold text-gray-800">User</h1>
      </div>

      <div className="bg-white rounded-lg p-8 text-center">
        <p className="text-gray-500">Halaman User - Coming Soon</p>
      </div>
    </div>
  )
}

export default UserPage

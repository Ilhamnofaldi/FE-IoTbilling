import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Progress } from "../components/ui/progress"
import { Gamepad2, Layers } from "lucide-react"

const PerangkatPage = () => {
  // Mock device data
  const devices = [
    {
      id: 1,
      name: "Perangkat 1",
      category: "Kategori 1",
      status: "ON",
      timeRemaining: 20,
      progress: 80,
    },
    {
      id: 2,
      name: "Perangkat 2",
      category: "Kategori 1",
      status: "ON",
      timeRemaining: 5,
      progress: 90,
    },
    {
      id: 12,
      name: "Perangkat 12",
      category: "Kategori 2",
      status: "OFF",
      timeRemaining: 0,
      progress: 0,
    },
  ]

  const nearCompletionDevice = {
    name: "Perangkat 10",
    category: "Kategori 1",
    timeRemaining: 5,
    progress: 95,
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-2">
        <Gamepad2 className="w-6 h-6 text-purple-600" />
        <h1 className="text-2xl font-bold text-gray-800">Perangkat</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Perangkat sedang berjalan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              <span className="text-orange-500">35</span>
              <span className="text-purple-600">/50</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Perangkat siap digunakan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              <span className="text-orange-500">15</span>
              <span className="text-purple-600">/50</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device List */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-800">Semua perangkat</CardTitle>
              <div className="w-6 h-6 border-2 border-dashed border-gray-400" aria-label="Filter icon"></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {devices.map((device) => (
              <div key={device.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-purple-600">{device.name}</h3>
                    <p className="text-sm text-purple-500">{device.category}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${device.status === "ON" ? "bg-green-500" : "bg-gray-400"}`}
                    ></div>
                    <span className="text-sm font-medium">{device.status}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Progress value={device.progress} className="h-2" />
                  <p className="text-sm text-gray-600">
                    {device.timeRemaining > 0 ? `${device.timeRemaining} menit tersisa` : "0 menit tersisa"}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Device Near Completion */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
              <div className="w-6 h-6 bg-orange-500 rounded mr-2" aria-label="Warning icon"></div>
              Device Near Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <Gamepad2 className="w-5 h-5 text-purple-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{nearCompletionDevice.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-purple-600">{nearCompletionDevice.category}</span>
                  <span className="text-sm text-gray-600">{nearCompletionDevice.timeRemaining} menit tersisa</span>
                </div>
              </div>
            </div>
            <Progress value={nearCompletionDevice.progress} className="h-2 mt-3" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PerangkatPage

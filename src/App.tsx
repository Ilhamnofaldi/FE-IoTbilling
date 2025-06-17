import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import LoginPage from "./pages/LoginPage"
import DashboardLayout from "./components/layout/DashboardLayout"
import HomePage from "./pages/HomePage"
import PerangkatPage from "./pages/PerangkatPage"
import KategoriPage from "./pages/KategoriPage"
import RiwayatPage from "./pages/RiwayatPage"
import UserPage from "./pages/UserPage"
import EditAkunPage from "./pages/EditAkunPage"
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<HomePage />} />
            <Route path="perangkat" element={<PerangkatPage />} />
            <Route path="kategori" element={<KategoriPage />} />
            <Route path="riwayat" element={<RiwayatPage />} />
            <Route path="user" element={<UserPage />} />
            <Route path="edit-akun" element={<EditAkunPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

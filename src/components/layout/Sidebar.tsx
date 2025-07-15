import type React from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Swal from "sweetalert2";

// Definisikan item menu dalam sebuah array agar mudah dikelola
const menuItems = [
  { icon: "/dashboard-icon.svg", label: "Dashboard", path: "/" },
  { icon: "/kategori-icon.svg", label: "Kategori", path: "/kategori" },
  { icon: "/perangkat-icon.svg", label: "Perangkat", path: "/perangkat" },
  { icon: "/riwayat-icon.svg", label: "Riwayat", path: "/riwayat" },
  { icon: "/user-icon.svg", label: "User", path: "/user" },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Konfirmasi Logout',
      text: 'Apakah Anda yakin ingin keluar dari sistem?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          title: 'Berhasil!',
          text: 'Anda telah berhasil logout.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  return (
    <div className={`relative bg-white h-screen p-4 sm:p-6 transition-all duration-300 ${isCollapsed ? 'w-[60px] sm:w-[80px]' : 'w-full sm:w-[233px]'} max-w-[233px] flex flex-col`}>
      {/* Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="relative w-[16px] h-[14px] ml-2 hover:opacity-70 transition-opacity cursor-pointer mb-6 sm:mb-6"
      >
        <img className="w-full h-full" alt="Toggle Menu" src="/hamburger-menu.svg" />
      </button>

      {/* Title */}
      {!isCollapsed && (
        <div className="relative self-stretch mt-[-1.00px] font-bold text-[#220636] text-lg sm:text-2xl tracking-[0] leading-[normal] font-['Lato'] mb-8 sm:mb-16 ml-2">
          Billing System
        </div>
      )}

      {/* Navigation Menu */}
      <div className="flex-col items-start gap-2 sm:gap-4 flex relative self-stretch w-full flex-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`items-center rounded-lg flex relative self-stretch w-full flex-[0_0_auto] transition-all duration-200 ${isActive ? "bg-[#f5d5e0]" : "hover:bg-gray-50"} ${isCollapsed ? 'justify-center py-3 sm:py-4' : 'p-3 sm:p-4 gap-2'}`}
            >
              <img src={item.icon} alt={item.label} className="relative w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] flex-shrink-0" />
              {!isCollapsed && (
                <div className={`relative w-fit mt-[-1.00px] font-normal text-sm sm:text-base tracking-[0] leading-[normal] whitespace-nowrap font-['Lato'] ${
                  isActive ? "text-[#430d4b]" : "text-[#430d4b]"
                }`}>
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Logout Button - Fixed at bottom */}
      <div className="mt-auto mb-4 flex-shrink-0">
        <button
          onClick={handleLogout}
          className={`items-center rounded-lg flex relative w-full transition-all duration-200 hover:bg-red-50 ${isCollapsed ? 'justify-center py-3 sm:py-4' : 'p-3 sm:p-4 gap-2'}`}
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 28 28" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="relative w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] flex-shrink-0"
          >
            <mask id="mask0_530_431" style={{maskType: 'alpha'}} maskUnits="userSpaceOnUse" x="0" y="0" width="28" height="28">
              <rect width="28" height="28" fill="#D9D9D9"/>
            </mask>
            <g mask="url(#mask0_530_431)">
              <path d="M5.83333 24.5C5.19167 24.5 4.64236 24.2715 4.18542 23.8146C3.72847 23.3576 3.5 22.8083 3.5 22.1667V5.83333C3.5 5.19167 3.72847 4.64236 4.18542 4.18542C4.64236 3.72847 5.19167 3.5 5.83333 3.5H14V5.83333H5.83333V22.1667H14V24.5H5.83333ZM18.6667 19.8333L17.0625 18.1417L20.0375 15.1667H10.5V12.8333H20.0375L17.0625 9.85833L18.6667 8.16667L24.5 14L18.6667 19.8333Z" fill="#9A0000"/>
            </g>
          </svg>
          {!isCollapsed && (
            <div className="relative w-fit mt-[-1.00px] font-normal text-sm sm:text-base tracking-[0] leading-[normal] whitespace-nowrap font-['Lato'] text-[#9A0000]">
              Keluar
            </div>
          )}
        </button>
      </div>
    </div>
   );
};

export default Sidebar;
import type React from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

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

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`flex flex-col items-start gap-4 sm:gap-7 relative bg-white h-screen p-4 sm:p-6 transition-all duration-300 ${isCollapsed ? 'w-[60px] sm:w-[80px]' : 'w-full sm:w-[233px]'} max-w-[233px]`}>
      {/* Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="relative w-[16px] h-[14px] hover:opacity-70 transition-opacity cursor-pointer"
      >
        <img className="w-full h-full" alt="Toggle Menu" src="/hamburger-menu.svg" />
      </button>

      <div className="flex-col items-start gap-8 sm:gap-16 flex relative self-stretch w-full flex-[0_0_auto]">
        {/* Title */}
        {!isCollapsed && (
          <div className="relative self-stretch mt-[-1.00px] font-bold text-[#220636] text-lg sm:text-2xl tracking-[0] leading-[normal] font-['Lato']">
            Billing System
          </div>
        )}

        {/* Navigation Menu */}
        <div className="flex-col items-start gap-2 sm:gap-4 flex relative self-stretch w-full flex-[0_0_auto]">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isSvgIcon = typeof item.icon === 'string';

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`items-center rounded-lg flex relative self-stretch w-full flex-[0_0_auto] transition-all duration-200 ${isActive ? "bg-[#f5d5e0]" : "hover:bg-gray-50"} ${isCollapsed ? 'justify-center py-3 sm:py-4' : 'p-3 sm:p-4 gap-2'}`}
              >
                {isSvgIcon ? (
                  <img src={item.icon} alt={item.label} className="relative w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] flex-shrink-0" />
                ) : (
                  <item.icon className="relative w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] flex-shrink-0" />
                )}
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
      </div>
    </div>
  );
};

export default Sidebar;
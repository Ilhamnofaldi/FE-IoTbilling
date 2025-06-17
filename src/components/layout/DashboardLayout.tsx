"use client";

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-50 lg:hidden" 
          onClick={toggleMobileSidebar}
        >
          <div 
            className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-10"
           // Mencegah klik di sidebar menutup sidebar
          >
            <Sidebar />
          </div>
        </div>
      )}
      
      <div className="relative z-0 flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="relative bg-white border-b border-[#EAEAEA]">
          <svg width="100%" height="63" viewBox="0 0 1149 63" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <mask id="path-1-inside-1_654_569" fill="white">
      
            </mask>
            <path d="M0 0H1149V63H0V0Z" fill="white"/>
            <path d="M1149 63V62H0V63V64H1149V63Z" fill="#EAEAEA" mask="url(#path-1-inside-1_654_569)"/>
          </svg>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileSidebar}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Profile Picture */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <img 
              src="/download-2.svg" 
              alt="Profile" 
              className="w-8 h-8 rounded-full"
            />
          </div>
        </div>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-2 sm:p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
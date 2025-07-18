"use client";
import {
  Bars3Icon,
  BellIcon,
  CalendarDaysIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export default function AdminHeader({ setSidebarOpen }) {
  const currentDate = new Date();
  const timeString = currentDate.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateString = currentDate.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/50 sticky top-0 z-30">
      <div className="flex items-center justify-between h-20 px-6">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            className="lg:hidden p-3 rounded-2xl text-gray-500 hover:text-gray-700 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-200 hover:scale-105"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="flex items-center space-x-4">
            {/* Logo/Icon */}
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl">
              <SparklesIcon className="h-6 w-6 text-white" />
            </div>

            {/* Title */}
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-900 bg-clip-text text-transparent">
                Panel Administrasi
              </h2>
              <p className="text-sm text-gray-600">
                Kelola berita dan pengumuman Kelurahan Kemayoran
              </p>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-6">
          {/* Date & Time */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200/50">
              <div className="flex items-center space-x-2">
                <CalendarDaysIcon className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  {dateString}
                </span>
              </div>
              <div className="w-px h-4 bg-green-300"></div>
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  {timeString}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

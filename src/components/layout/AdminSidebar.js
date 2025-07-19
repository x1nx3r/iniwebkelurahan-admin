// iniwebumkm-admin/src/components/layout/AdminSidebar.js
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  NewspaperIcon,
  BuildingStorefrontIcon,
  XMarkIcon,
  UserCircleIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: HomeIcon,
    color: "from-green-400 to-green-600",
    description: "Ringkasan & overview",
  },
  {
    name: "Semua Berita",
    href: "/berita",
    icon: NewspaperIcon,
    color: "from-green-500 to-emerald-600",
    description: "Kelola konten berita",
  },
  {
    name: "Kelola UMKM",
    href: "/umkm",
    icon: BuildingStorefrontIcon,
    color: "from-emerald-500 to-teal-600",
    description: "Manajemen UMKM lokal",
  },
];

export default function AdminSidebar({ open, setOpen }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile sidebar overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-white/50
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          <div className="relative flex items-center justify-between h-20 px-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <BuildingOfficeIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  Admin Kelurahan
                </h1>
                <p className="text-xs text-white/80">Kemayoran</p>
              </div>
            </div>
            <button
              className="lg:hidden p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
              onClick={() => setOpen(false)}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <div className="space-y-3">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group relative flex items-center px-4 py-4 text-sm font-medium rounded-2xl transition-all duration-200 hover:scale-105
                    ${
                      isActive
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 shadow-lg border border-green-200/50"
                        : "text-gray-600 hover:bg-green-50 hover:text-green-900"
                    }
                  `}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-r-full"></div>
                  )}

                  {/* Icon container */}
                  <div
                    className={`
                      flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-all duration-200
                      ${
                        isActive
                          ? `bg-gradient-to-br ${item.color} shadow-lg`
                          : "bg-gray-100 group-hover:bg-green-100"
                      }
                    `}
                  >
                    <item.icon
                      className={`h-5 w-5 transition-colors duration-200 ${
                        isActive
                          ? "text-white"
                          : "text-gray-500 group-hover:text-green-700"
                      }`}
                    />
                  </div>

                  {/* Text content */}
                  <div className="flex-1">
                    <div className="font-semibold">{item.name}</div>
                    <div
                      className={`text-xs ${
                        isActive
                          ? "text-green-600"
                          : "text-gray-500 group-hover:text-green-600"
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>

                  {/* Arrow for active */}
                  {isActive && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200/50 bg-gradient-to-t from-gray-50/80 to-transparent backdrop-blur-sm">
          <div className="flex items-center space-x-3 p-4 bg-white/60 rounded-2xl border border-white/50 shadow-lg">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <UserCircleIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">Admin</p>
              <p className="text-xs text-gray-600 truncate">
                Kelurahan Kemayoran
              </p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-xs text-green-600 font-medium">
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

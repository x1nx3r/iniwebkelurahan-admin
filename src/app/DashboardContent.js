"use client";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { getBeritaStats, getAllBerita } from "@/lib/firestore";
import { formatRelativeTime } from "@/lib/utils";
import Link from "next/link";
import {
  NewspaperIcon,
  EyeIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  CalendarDaysIcon,
  UserIcon,
  SparklesIcon,
  ChartBarIcon,
  PlusCircleIcon,
  ArrowRightIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function DashboardContent() {
  const [stats, setStats] = useState(null);
  const [recentBerita, setRecentBerita] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, beritaData] = await Promise.all([
        getBeritaStats(),
        getAllBerita(),
      ]);

      setStats(statsData);
      setRecentBerita(beritaData.slice(0, 5)); // Get 5 most recent
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <SparklesIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="space-y-8 p-6">
          {/* Enhanced Welcome Section */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
            <div className="relative p-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                    <SparklesIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      Selamat Datang di Admin Panel
                    </h1>
                    <p className="text-green-100 text-lg">
                      Kelola berita dan pengumuman Kelurahan Kemayoran dengan
                      mudah
                    </p>
                    <div className="flex items-center mt-3 space-x-4">
                      <div className="flex items-center space-x-2 text-sm text-green-100">
                        <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                        <span>Dashboard aktif</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-green-100">
                        <ClockIcon className="h-4 w-4" />
                        <span>
                          {new Date().toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                    <ChartBarIcon className="h-12 w-12 text-white/80" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-6 group-hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      Total Berita
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats?.totalBerita || 0}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <NewspaperIcon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-6 group-hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      Dipublikasi
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats?.publishedBerita || 0}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <EyeIcon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-6 group-hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      Draft
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats?.draftBerita || 0}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <DocumentTextIcon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-6 group-hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      Kategori
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats?.categories
                        ? Object.keys(stats.categories).length
                        : 0}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <PencilSquareIcon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enhanced Recent Berita */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <NewspaperIcon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Berita Terbaru
                      </h3>
                    </div>
                    <Link
                      href="/berita"
                      className="group flex items-center space-x-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                    >
                      <span>Lihat semua</span>
                      <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  {recentBerita.length > 0 ? (
                    <div className="space-y-4">
                      {recentBerita.map((item, index) => (
                        <div
                          key={item.id}
                          className="group flex items-start space-x-4 p-4 bg-gradient-to-r from-gray-50/50 to-white/50 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                        >
                          <div className="flex-shrink-0">
                            <div
                              className={`
                                w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg
                                ${
                                  item.kategori === "pengumuman"
                                    ? "bg-gradient-to-br from-red-500 to-red-600"
                                    : item.kategori === "kegiatan"
                                      ? "bg-gradient-to-br from-blue-500 to-blue-600"
                                      : item.kategori === "berita"
                                        ? "bg-gradient-to-br from-green-500 to-green-600"
                                        : "bg-gradient-to-br from-purple-500 to-purple-600"
                                }
                              `}
                            >
                              <NewspaperIcon className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-green-700 transition-colors duration-200">
                                  {item.judul}
                                </p>
                                <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                                  <div className="flex items-center space-x-1">
                                    <CalendarDaysIcon className="h-3 w-3" />
                                    <span>
                                      {formatRelativeTime(item.created_at)}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <UserIcon className="h-3 w-3" />
                                    <span>{item.penulis}</span>
                                  </div>
                                </div>
                              </div>
                              <span
                                className={`
                                  ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
                                  ${
                                    item.status === "published"
                                      ? "bg-green-100 text-green-700 border-green-200"
                                      : "bg-yellow-100 text-yellow-700 border-yellow-200"
                                  }
                                `}
                              >
                                {item.status === "published"
                                  ? "📢 Published"
                                  : "📝 Draft"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <NewspaperIcon className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Belum ada berita
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Mulai dengan membuat berita pertama Anda.
                      </p>
                      <Link
                        href="/berita"
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 hover:scale-105 shadow-lg"
                      >
                        <PlusCircleIcon className="h-5 w-5" />
                        <span>Buat Berita</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Sidebar */}
            <div className="space-y-6">
              {/* Enhanced Quick Actions */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <SparklesIcon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Aksi Cepat
                    </h3>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <Link
                    href="/berita"
                    className="group w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <PlusCircleIcon className="h-5 w-5" />
                      <span>Buat Berita Baru</span>
                    </div>
                    <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                  <Link
                    href="/berita?filter=draft"
                    className="group w-full flex items-center justify-between px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-semibold transition-all duration-200 hover:scale-105"
                  >
                    <div className="flex items-center space-x-3">
                      <DocumentTextIcon className="h-5 w-5" />
                      <span>Lihat Draft</span>
                    </div>
                    <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                  <Link
                    href="/berita?kategori=pengumuman"
                    className="group w-full flex items-center justify-between px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-semibold transition-all duration-200 hover:scale-105"
                  >
                    <div className="flex items-center space-x-3">
                      <NewspaperIcon className="h-5 w-5" />
                      <span>Kelola Pengumuman</span>
                    </div>
                    <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>

              {/* Enhanced Category Breakdown */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <ChartBarIcon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Breakdown Kategori
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  {stats?.categories ? (
                    <div className="space-y-4">
                      {Object.entries(stats.categories).map(
                        ([category, count], index) => (
                          <div
                            key={category}
                            className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100"
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  index === 0
                                    ? "bg-green-500"
                                    : index === 1
                                      ? "bg-blue-500"
                                      : index === 2
                                        ? "bg-yellow-500"
                                        : "bg-purple-500"
                                }`}
                              ></div>
                              <span className="text-sm font-semibold text-gray-700 capitalize">
                                {category}
                              </span>
                            </div>
                            <span className="text-lg font-bold text-gray-900">
                              {count}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">
                        Belum ada data kategori
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

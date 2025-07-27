// iniwebumkm-admin/src/app/DashboardContent.js
"use client";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { apiClient } from "@/lib/api-client";
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
  ExclamationTriangleIcon,
  BuildingStorefrontIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export default function DashboardContent() {
  const [beritaStats, setBeritaStats] = useState(null);
  const [umkmStats, setUmkmStats] = useState(null);
  const [recentBerita, setRecentBerita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔍 Loading dashboard data...");

      const [beritaStatsData, umkmStatsData, beritaData] = await Promise.all([
        apiClient.getBeritaStats().catch((err) => {
          console.warn("Failed to load berita stats:", err);
          return null;
        }),
        apiClient.getUMKMStats().catch((err) => {
          console.warn("Failed to load UMKM stats:", err);
          return null;
        }),
        apiClient.fetchBerita({ limit: 5 }).catch((err) => {
          console.warn("Failed to load recent berita:", err);
          return [];
        }),
      ]);

      console.log("✅ Dashboard data loaded:", {
        beritaStats: beritaStatsData,
        umkmStats: umkmStatsData,
        recentBerita: beritaData.length,
      });

      setBeritaStats(beritaStatsData);
      setUmkmStats(umkmStatsData);
      setRecentBerita(beritaData);
    } catch (error) {
      console.error("❌ Error loading dashboard data:", error);
      setError(error.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadDashboardData();
  };

  // Error state
  if (error && !loading && !beritaStats && !umkmStats) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-8 max-w-md w-full mx-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Gagal Memuat Dashboard
                </h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={handleRetry}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 mx-auto"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                  <span>Coba Lagi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Loading state
  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="space-y-8 p-6">
            {/* Welcome Section Skeleton */}
            <div className="bg-gray-200 rounded-3xl h-32 animate-pulse"></div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white/80 rounded-3xl p-6 animate-pulse"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-8 bg-gray-200 rounded w-12"></div>
                    </div>
                    <div className="w-14 h-14 bg-gray-200 rounded-2xl"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Content Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white/80 rounded-3xl h-96 animate-pulse"></div>
              <div className="space-y-6">
                <div className="bg-white/80 rounded-3xl h-64 animate-pulse"></div>
                <div className="bg-white/80 rounded-3xl h-64 animate-pulse"></div>
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
                      Kelola berita, pengumuman, dan UMKM Kelurahan Kemayoran
                      dengan mudah
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

          {/* Enhanced Stats Cards - Now includes UMKM */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Berita Stats */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-6 group-hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      Total Berita
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {beritaStats?.totalBerita || 0}
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
                      {beritaStats?.publishedBerita || 0}
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
                      {beritaStats?.draftBerita || 0}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <DocumentTextIcon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* UMKM Stats */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-6 group-hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      Total UMKM
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {umkmStats?.totalUMKM || 0}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <BuildingStorefrontIcon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-6 group-hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      UMKM Aktif
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {umkmStats?.activeUMKM || 0}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <SparklesIcon className="h-7 w-7 text-white" />
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
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleRetry}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        title="Refresh data"
                      >
                        <ArrowPathIcon className="h-4 w-4" />
                      </button>
                      <Link
                        href="/berita"
                        className="group flex items-center space-x-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                      >
                        <span>Lihat semua</span>
                        <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </Link>
                    </div>
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
                                      {item.created_at
                                        ? formatRelativeTime(item.created_at)
                                        : formatRelativeTime(item.tanggal)}
                                    </span>
                                  </div>
                                  {item.penulis && (
                                    <div className="flex items-center space-x-1">
                                      <UserIcon className="h-3 w-3" />
                                      <span>{item.penulis}</span>
                                    </div>
                                  )}
                                  {item.priority && item.priority > 0 && (
                                    <div className="flex items-center space-x-1">
                                      <SparklesIcon className="h-3 w-3" />
                                      <span>P{item.priority}</span>
                                    </div>
                                  )}
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
                    href="/umkm"
                    className="group w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-2xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <BuildingStorefrontIcon className="h-5 w-5" />
                      <span>Kelola UMKM</span>
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
                      Statistik
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {/* Berita Categories */}
                    {beritaStats?.categories &&
                      Object.keys(beritaStats.categories).length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">
                            Kategori Berita
                          </h4>
                          <div className="space-y-2">
                            {Object.entries(beritaStats.categories).map(
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
                        </div>
                      )}

                    {/* UMKM Status */}
                    {umkmStats && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                          Status UMKM
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                              <span className="text-sm font-semibold text-green-700">
                                Aktif
                              </span>
                            </div>
                            <span className="text-lg font-bold text-green-900">
                              {umkmStats.activeUMKM}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 rounded-full bg-red-500"></div>
                              <span className="text-sm font-semibold text-red-700">
                                Tidak Aktif
                              </span>
                            </div>
                            <span className="text-lg font-bold text-red-900">
                              {umkmStats.inactiveUMKM}
                            </span>
                          </div>
                          {umkmStats.featuredUMKM > 0 && (
                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
                              <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <span className="text-sm font-semibold text-yellow-700">
                                  Featured
                                </span>
                              </div>
                              <span className="text-lg font-bold text-yellow-900">
                                {umkmStats.featuredUMKM}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* No data state */}
                    {(!beritaStats?.categories ||
                      Object.keys(beritaStats.categories).length === 0) &&
                      !umkmStats && (
                        <div className="text-center py-8">
                          <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm text-gray-500">
                            Belum ada data statistik
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

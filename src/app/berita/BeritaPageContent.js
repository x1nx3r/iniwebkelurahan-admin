"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import BeritaList from "@/components/berita/BeritaList";
import BeritaFormModal from "@/components/berita/BeritaFormModal";
import BeritaViewModal from "@/components/berita/BeritaViewModal";
import { getAllBerita } from "@/lib/firestore";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  FunnelIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const categories = [
  { value: "all", label: "Semua Kategori", color: "from-gray-400 to-gray-600" },
  { value: "berita", label: "Berita", color: "from-green-400 to-green-600" },
  {
    value: "pengumuman",
    label: "Pengumuman",
    color: "from-red-400 to-red-600",
  },
  { value: "kegiatan", label: "Kegiatan", color: "from-blue-400 to-blue-600" },
  {
    value: "layanan",
    label: "Layanan",
    color: "from-purple-400 to-purple-600",
  },
];

const statusOptions = [
  { value: "all", label: "Semua Status", color: "from-gray-400 to-gray-600" },
  {
    value: "published",
    label: "Dipublikasi",
    color: "from-green-400 to-green-600",
  },
  { value: "draft", label: "Draft", color: "from-yellow-400 to-yellow-600" },
];

export default function BeritaPageContent() {
  const searchParams = useSearchParams();
  const [berita, setBerita] = useState([]);
  const [filteredBerita, setFilteredBerita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("kategori") || "all",
  );
  const [selectedStatus, setSelectedStatus] = useState(
    searchParams.get("filter") || "all",
  );

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedBerita, setSelectedBerita] = useState(null);

  useEffect(() => {
    loadBerita();
  }, []);

  useEffect(() => {
    filterBerita();
  }, [berita, searchTerm, selectedCategory, selectedStatus]);

  const loadBerita = async () => {
    try {
      setLoading(true);
      const data = await getAllBerita();
      setBerita(data);
    } catch (error) {
      console.error("Error loading berita:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterBerita = () => {
    let filtered = [...berita];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.konten.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.penulis?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.kategori === selectedCategory);
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((item) => item.status === selectedStatus);
    }

    setFilteredBerita(filtered);
  };

  const handleBeritaUpdate = () => {
    loadBerita(); // Reload data after update/delete
    setCreateModalOpen(false);
    setEditModalOpen(false);
    setSelectedBerita(null);
  };

  const handleView = (berita) => {
    setSelectedBerita(berita);
    setViewModalOpen(true);
  };

  const handleEdit = (berita) => {
    setSelectedBerita(berita);
    setEditModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedBerita(null);
    setCreateModalOpen(true);
  };

  const isFiltered =
    searchTerm || selectedCategory !== "all" || selectedStatus !== "all";

  const selectedCategoryData = categories.find(
    (cat) => cat.value === selectedCategory,
  );
  const selectedStatusData = statusOptions.find(
    (status) => status.value === selectedStatus,
  );

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="space-y-8 p-6">
          {/* Enhanced Header */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl">
                      <DocumentTextIcon className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                      <SparklesIcon className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-900 bg-clip-text text-transparent">
                      Kelola Berita
                    </h1>
                    <p className="text-lg text-gray-600 mt-2">
                      Kelola semua berita dan pengumuman Kelurahan Kemayoran
                    </p>
                    <div className="flex items-center space-x-4 mt-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>{berita.length} total berita</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <span>{filteredBerita.length} ditampilkan</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={handleCreate}
                    className="group relative overflow-hidden bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center space-x-3">
                      <PlusIcon className="h-5 w-5" />
                      <span>Buat Berita Baru</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Filters */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <FunnelIcon className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Filter & Pencarian
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Search */}
                <div className="lg:col-span-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Pencarian Global
                  </label>
                  <div className="relative group">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" />
                    <input
                      type="text"
                      placeholder="Cari berita, judul, konten, atau penulis..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Category filter */}
                <div className="lg:col-span-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Kategori
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-4 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm appearance-none cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    <div
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gradient-to-br ${selectedCategoryData?.color} rounded-full`}
                    ></div>
                  </div>
                </div>

                {/* Status filter */}
                <div className="lg:col-span-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-4 py-4 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm appearance-none cursor-pointer"
                    >
                      {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                    <div
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gradient-to-br ${selectedStatusData?.color} rounded-full`}
                    ></div>
                  </div>
                </div>

                {/* Reset button */}
                <div className="lg:col-span-1 flex items-end">
                  {isFiltered && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("all");
                        setSelectedStatus("all");
                      }}
                      className="w-full px-4 py-4 bg-gradient-to-r from-red-100 to-pink-100 hover:from-red-200 hover:to-pink-200 text-red-700 rounded-2xl font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center"
                      title="Reset semua filter"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Enhanced Results summary */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-700">
                      {filteredBerita.length} dari {berita.length} berita
                    </span>
                  </div>

                  {isFiltered && (
                    <div className="flex flex-wrap gap-2">
                      {searchTerm && (
                        <span className="px-3 py-1.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-lg border border-yellow-200">
                          Pencarian: &quot;{searchTerm}&quot;
                        </span>
                      )}
                      {selectedCategory !== "all" && (
                        <span className="px-3 py-1.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-lg border border-blue-200">
                          Kategori:{" "}
                          {
                            categories.find((c) => c.value === selectedCategory)
                              ?.label
                          }
                        </span>
                      )}
                      {selectedStatus !== "all" && (
                        <span className="px-3 py-1.5 bg-green-100 text-green-800 text-xs font-medium rounded-lg border border-green-200">
                          Status:{" "}
                          {
                            statusOptions.find(
                              (s) => s.value === selectedStatus,
                            )?.label
                          }
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {isFiltered && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                      setSelectedStatus("all");
                    }}
                    className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-slate-100 hover:from-gray-200 hover:to-slate-200 text-gray-700 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                  >
                    <XMarkIcon className="h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                    <span>Reset Filter</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Berita List with enhanced container */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-rose-500/5 rounded-3xl blur-3xl"></div>
            <div className="relative">
              <BeritaList
                berita={filteredBerita}
                loading={loading}
                onUpdate={handleBeritaUpdate}
                onView={handleView}
                onEdit={handleEdit}
              />
            </div>
          </div>

          {/* Enhanced Modals */}
          <BeritaFormModal
            open={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onSuccess={handleBeritaUpdate}
            title="✨ Buat Berita Baru"
          />

          <BeritaFormModal
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            onSuccess={handleBeritaUpdate}
            initialData={selectedBerita}
            isEdit={true}
            title="📝 Edit Berita"
          />

          <BeritaViewModal
            open={viewModalOpen}
            onClose={() => setViewModalOpen(false)}
            berita={selectedBerita}
            onEdit={() => {
              setViewModalOpen(false);
              setEditModalOpen(true);
            }}
          />
        </div>
      </div>
    </AdminLayout>
  );
}

// iniwebumkm-admin/src/components/berita/BeritaList.js
"use client";
import { useState } from "react";
import Image from "next/image";
import {
  formatDate,
  formatRelativeTime,
  getCategoryColor,
  getStatusColor,
} from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import DeleteConfirmModal from "./DeleteConfirmModal";
import toast from "react-hot-toast";
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CalendarDaysIcon,
  UserIcon,
  TagIcon,
  PhotoIcon,
  StarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export default function BeritaList({
  berita,
  loading,
  onUpdate,
  onView,
  onEdit,
  error,
  onRetry,
}) {
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (item) => {
    try {
      setDeleting(true);
      console.log("🗑️ Deleting berita:", item.id, item.judul);

      await apiClient.deleteBerita(item.id);

      toast.success("✅ Berita berhasil dihapus!");
      console.log("✅ Successfully deleted berita:", item.id);

      onUpdate();
      setDeleteModal({ open: false, item: null });
    } catch (error) {
      console.error("❌ Error deleting berita:", error);
      toast.error(
        `❌ Gagal menghapus berita: ${error.message || "Unknown error"}`,
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleViewClick = (item) => {
    console.log("👁️ Viewing berita:", item.id, item.judul);
    onView(item);
  };

  const handleEditClick = (item) => {
    console.log("✏️ Editing berita:", item.id, item.judul);
    onEdit(item);
  };

  // Error state
  if (error && !loading) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl">
        <div className="p-16 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Gagal Memuat Berita
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
            >
              <ArrowPathIcon className="h-4 w-4" />
              <span>Coba Lagi</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl">
        <div className="p-8">
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex space-x-4">
                  <div className="w-20 h-16 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-200 rounded-lg w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                    <div className="flex space-x-2">
                      <div className="h-3 bg-gray-200 rounded-full w-16"></div>
                      <div className="h-3 bg-gray-200 rounded-full w-20"></div>
                      <div className="h-3 bg-gray-200 rounded-full w-24"></div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (berita.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl">
        <div className="p-16 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <TagIcon className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Tidak ada berita ditemukan
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Mulai dengan membuat berita baru atau ubah filter pencarian untuk
            menemukan konten yang Anda cari.
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-4 inline-flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <ArrowPathIcon className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl overflow-hidden">
        <div className="divide-y divide-gray-100">
          {berita.map((item, index) => (
            <div
              key={item.id}
              className="p-6 hover:bg-white/50 transition-all duration-200 group"
            >
              <div className="flex items-start space-x-4">
                {/* Image */}
                <div className="flex-shrink-0 w-20 h-16 relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 group-hover:scale-105 transition-transform duration-200">
                  {item.gambar ? (
                    <Image
                      src={item.gambar}
                      alt={item.gambar_alt || item.judul}
                      fill
                      className="object-cover"
                      sizes="80px"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center ${item.gambar ? "hidden" : "flex"}`}
                  >
                    <PhotoIcon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Title and badges */}
                  <div className="flex items-start justify-between mb-3">
                    <h3
                      className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 cursor-pointer hover:text-blue-600 transition-colors duration-200 group-hover:text-blue-700"
                      onClick={() => handleViewClick(item)}
                      title={item.judul}
                    >
                      {item.judul}
                    </h3>
                    <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                      {/* Priority indicator for high priority items */}
                      {item.priority && item.priority >= 7 && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200 flex items-center space-x-1">
                          <ChartBarIcon className="h-3 w-3" />
                          <span>P{item.priority}</span>
                        </span>
                      )}

                      {/* Category badge */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.kategori)}`}
                      >
                        {item.kategori}
                      </span>

                      {/* Status badge */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === "published"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                        }`}
                      >
                        {item.status === "published"
                          ? "📢 Published"
                          : "📝 Draft"}
                      </span>

                      {/* Featured badge */}
                      {item.featured && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200 flex items-center space-x-1">
                          <StarIcon className="h-3 w-3" />
                          <span>Featured</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  {item.ringkasan && (
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                      {item.ringkasan}
                    </p>
                  )}

                  {/* Meta information */}
                  <div className="flex items-center flex-wrap gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <CalendarDaysIcon className="h-4 w-4" />
                      <span title={formatDate(item.created_at || item.tanggal)}>
                        {formatRelativeTime(item.created_at || item.tanggal)}
                      </span>
                    </div>

                    {item.penulis && (
                      <div className="flex items-center space-x-1">
                        <UserIcon className="h-4 w-4" />
                        <span>{item.penulis}</span>
                      </div>
                    )}

                    {item.view_count !== undefined && (
                      <div className="flex items-center space-x-1">
                        <EyeIcon className="h-4 w-4" />
                        <span>{item.view_count} views</span>
                      </div>
                    )}

                    {item.priority && item.priority !== 5 && (
                      <div className="flex items-center space-x-1">
                        <ChartBarIcon className="h-4 w-4" />
                        <span>Priority {item.priority}</span>
                      </div>
                    )}

                    {/* Show updated date if different from created date */}
                    {item.updated_at &&
                      item.updated_at !== item.created_at &&
                      item.updated_at !== item.tanggal && (
                        <div className="flex items-center space-x-1 text-orange-600">
                          <CalendarDaysIcon className="h-4 w-4" />
                          <span title={formatDate(item.updated_at)}>
                            Edited {formatRelativeTime(item.updated_at)}
                          </span>
                        </div>
                      )}
                  </div>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <TagIcon className="h-4 w-4 text-gray-400" />
                      <div className="flex flex-wrap gap-2">
                        {item.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-flex items-center px-2 py-1 rounded-lg text-xs bg-gray-100 text-gray-600 border border-gray-200"
                          >
                            #{tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="text-xs text-gray-500 px-2 py-1">
                            +{item.tags.length - 3} lainnya
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Category-specific info */}
                  {item.kategori === "kegiatan" &&
                    (item.lokasi || item.pendaftaran) && (
                      <div className="mt-2 text-xs text-blue-600">
                        {item.lokasi && <span>📍 {item.lokasi}</span>}
                        {item.lokasi && item.pendaftaran && (
                          <span className="mx-2">•</span>
                        )}
                        {item.pendaftaran && <span>📝 {item.pendaftaran}</span>}
                      </div>
                    )}

                  {(item.kategori === "pengumuman" ||
                    item.kategori === "layanan") &&
                    item.kontak && (
                      <div className="mt-2 text-xs text-green-600">
                        📞 Info kontak tersedia
                      </div>
                    )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center space-x-1 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleViewClick(item)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                    title="Lihat detail"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEditClick(item)}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-110"
                    title="Edit"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteModal({ open: true, item })}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                    title="Hapus"
                    disabled={deleting}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, item: null })}
        onConfirm={() => handleDelete(deleteModal.item)}
        title={deleteModal.item?.judul}
        loading={deleting}
        description={`Artikel "${deleteModal.item?.judul}" akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`}
      />
    </>
  );
}

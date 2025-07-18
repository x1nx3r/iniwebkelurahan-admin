"use client";
import { useState } from "react";
import Image from "next/image";
import {
  formatDate,
  formatRelativeTime,
  getCategoryColor,
  getStatusColor,
} from "@/lib/utils";
import { deleteBerita } from "@/lib/firestore";
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
} from "@heroicons/react/24/outline";

export default function BeritaList({
  berita,
  loading,
  onUpdate,
  onView,
  onEdit,
}) {
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (item) => {
    try {
      setDeleting(true);
      await deleteBerita(item.id);
      toast.success("✅ Berita berhasil dihapus!");
      onUpdate();
      setDeleteModal({ open: false, item: null });
    } catch (error) {
      console.error("Error deleting berita:", error);
      toast.error("❌ Gagal menghapus berita");
    } finally {
      setDeleting(false);
    }
  };

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
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                      <PhotoIcon className="h-6 w-6 text-blue-600" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Title and badges */}
                  <div className="flex items-start justify-between mb-3">
                    <h3
                      className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 cursor-pointer hover:text-blue-600 transition-colors duration-200 group-hover:text-blue-700"
                      onClick={() => onView(item)}
                    >
                      {item.judul}
                    </h3>
                    <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                      {/* Category badge */}
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
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
                      <span title={formatDate(item.created_at)}>
                        {formatRelativeTime(item.created_at)}
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
                    <div className="flex items-center space-x-1">
                      <ChartBarIcon className="h-4 w-4" />
                      <span>Priority {item.priority || 5}</span>
                    </div>
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
                </div>

                {/* Action buttons */}
                <div className="flex items-center space-x-1 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => onView(item)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                    title="Lihat detail"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEdit(item)}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-110"
                    title="Edit"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteModal({ open: true, item })}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                    title="Hapus"
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
      />
    </>
  );
}

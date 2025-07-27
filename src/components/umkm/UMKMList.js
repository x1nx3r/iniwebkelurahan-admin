// iniwebumkm-admin/src/components/umkm/UMKMList.js
"use client";
import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import DeleteConfirmModal from "../berita/DeleteConfirmModal";
import toast from "react-hot-toast";
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MapPinIcon,
  PhoneIcon,
  BuildingStorefrontIcon,
  StarIcon,
  TagIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

export default function UMKMList({
  umkm,
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

      // Determine the correct document ID to use for deletion
      let documentId;

      if (
        item.docId &&
        typeof item.docId === "string" &&
        item.docId.length > 0
      ) {
        documentId = item.docId;
      } else if (
        item.slug &&
        typeof item.slug === "string" &&
        item.slug.length > 0
      ) {
        documentId = item.slug;
      } else if (item.id && typeof item.id === "string" && item.id.length > 0) {
        documentId = item.id;
      } else {
        throw new Error("Unable to determine document ID for deletion");
      }

      console.log("🗑️ Deleting UMKM:", {
        nama: item.nama,
        documentId,
        availableIds: {
          id: item.id,
          slug: item.slug,
          docId: item.docId,
        },
      });

      await apiClient.deleteUMKM(documentId);

      toast.success("✅ UMKM berhasil dihapus!");
      console.log("✅ Successfully deleted UMKM:", documentId);

      onUpdate();
      setDeleteModal({ open: false, item: null });
    } catch (error) {
      console.error("❌ Error deleting UMKM:", error);
      toast.error(
        `❌ Gagal menghapus UMKM: ${error.message || "Unknown error"}`,
      );

      // Log detailed error info for debugging
      console.error("🔍 Delete error details:", {
        message: error.message,
        item: {
          nama: item.nama,
          id: item.id,
          slug: item.slug,
          docId: item.docId,
        },
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleViewClick = (item) => {
    console.log("👁️ Viewing UMKM:", item.nama);
    onView(item);
  };

  const handleEditClick = (item) => {
    console.log("✏️ Editing UMKM:", item.nama);
    onEdit(item);
  };

  const getSocialMediaIcon = (platform) => {
    // Simple mapping for common platforms
    const iconMap = {
      whatsapp: "📱",
      instagram: "📸",
      facebook: "📘",
      tiktok: "🎵",
      twitter: "🐦",
      youtube: "📺",
      linkedin: "💼",
      telegram: "✈️",
    };
    return iconMap[platform.toLowerCase()] || "🌐";
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
            Gagal Memuat UMKM
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
                  <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-200 rounded-lg w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
                    <div className="flex space-x-2">
                      <div className="h-3 bg-gray-200 rounded-full w-16"></div>
                      <div className="h-3 bg-gray-200 rounded-full w-20"></div>
                      <div className="h-3 bg-gray-200 rounded-full w-24"></div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
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
  if (umkm.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl">
        <div className="p-16 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BuildingStorefrontIcon className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Tidak ada UMKM ditemukan
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Mulai dengan menambahkan UMKM baru atau ubah filter pencarian untuk
            menemukan UMKM yang Anda cari.
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
          {umkm.map((item, index) => (
            <div
              key={item.docId || item.slug || item.id || index}
              className="p-6 hover:bg-white/50 transition-all duration-200 group"
            >
              <div className="flex items-start space-x-4">
                {/* Image/Icon */}
                <div className="flex-shrink-0 w-16 h-16 relative rounded-xl overflow-hidden bg-gradient-to-br from-green-100 to-emerald-200 group-hover:scale-105 transition-transform duration-200 flex items-center justify-center">
                  {item.foto ? (
                    <img
                      src={item.foto}
                      alt={item.nama}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center ${item.foto ? "hidden" : "flex"}`}
                  >
                    <BuildingStorefrontIcon className="h-8 w-8 text-green-600" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Title and badges */}
                  <div className="flex items-start justify-between mb-3">
                    <h3
                      className="text-lg font-semibold text-gray-900 line-clamp-1 flex-1 cursor-pointer hover:text-green-600 transition-colors duration-200 group-hover:text-green-700"
                      onClick={() => handleViewClick(item)}
                      title={item.nama}
                    >
                      {item.nama}
                    </h3>
                    <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                      {/* Status badge */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === "active"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                      >
                        {item.status === "active"
                          ? "🟢 Aktif"
                          : "🔴 Tidak Aktif"}
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

                  {/* Owner and Category */}
                  <div className="flex items-center space-x-4 mb-3 text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium">Pemilik:</span>{" "}
                      {item.pemilik}
                    </p>
                    {item.kategori && (
                      <p className="text-blue-600">
                        <span className="font-medium">Kategori:</span>{" "}
                        {item.kategori}
                      </p>
                    )}
                  </div>

                  {/* Product/Service */}
                  {item.produk && (
                    <p className="text-gray-600 mb-3 text-sm">
                      <span className="font-medium">Produk/Layanan:</span>{" "}
                      {item.produk}
                    </p>
                  )}

                  {/* Description */}
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                    {item.deskripsi}
                  </p>

                  {/* Contact information */}
                  <div className="flex items-center flex-wrap gap-4 text-sm text-gray-500 mb-3">
                    {item.alamat && (
                      <div className="flex items-center space-x-1">
                        <MapPinIcon className="h-4 w-4" />
                        <span className="line-clamp-1" title={item.alamat}>
                          {item.alamat.length > 30
                            ? `${item.alamat.substring(0, 30)}...`
                            : item.alamat}
                        </span>
                      </div>
                    )}

                    {item.telefon && (
                      <div className="flex items-center space-x-1">
                        <PhoneIcon className="h-4 w-4" />
                        <span>{item.telefon}</span>
                      </div>
                    )}

                    {item.views !== undefined && (
                      <div className="flex items-center space-x-1">
                        <EyeIcon className="h-4 w-4" />
                        <span>{item.views} views</span>
                      </div>
                    )}

                    {/* Created/Updated date */}
                    {(item.createdAt || item.updatedAt) && (
                      <div className="flex items-center space-x-1">
                        <TagIcon className="h-4 w-4" />
                        <span>
                          {item.updatedAt && item.updatedAt !== item.createdAt
                            ? `Diperbarui ${new Date(item.updatedAt.seconds ? item.updatedAt.toDate() : item.updatedAt).toLocaleDateString("id-ID")}`
                            : item.createdAt
                              ? `Dibuat ${new Date(item.createdAt.seconds ? item.createdAt.toDate() : item.createdAt).toLocaleDateString("id-ID")}`
                              : ""}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Social media indicators */}
                  {item.sosialMedia &&
                    Object.keys(item.sosialMedia).length > 0 && (
                      <div className="flex items-center space-x-2">
                        <GlobeAltIcon className="h-4 w-4 text-gray-400" />
                        <div className="flex flex-wrap gap-2">
                          {Object.keys(item.sosialMedia)
                            .slice(0, 4)
                            .map((platform, platformIndex) => (
                              <span
                                key={platformIndex}
                                className="inline-flex items-center px-2 py-1 rounded-lg text-xs bg-gray-100 text-gray-600 border border-gray-200 capitalize"
                                title={`${platform}: ${item.sosialMedia[platform]}`}
                              >
                                <span className="mr-1">
                                  {getSocialMediaIcon(platform)}
                                </span>
                                {platform}
                              </span>
                            ))}
                          {Object.keys(item.sosialMedia).length > 4 && (
                            <span className="text-xs text-gray-500 px-2 py-1">
                              +{Object.keys(item.sosialMedia).length - 4}{" "}
                              lainnya
                            </span>
                          )}
                        </div>
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
        title={deleteModal.item?.nama}
        loading={deleting}
        description={`UMKM "${deleteModal.item?.nama}" akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`}
      />
    </>
  );
}

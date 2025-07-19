// iniwebumkm-admin/src/components/umkm/UMKMList.js
"use client";
import { useState } from "react";
import { deleteUMKM } from "@/lib/firestore";
import DeleteConfirmModal from "../berita/DeleteConfirmModal"; // Reuse the same component
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
} from "@heroicons/react/24/outline";

export default function UMKMList({ umkm, loading, onUpdate, onView, onEdit }) {
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (item) => {
    try {
      setDeleting(true);
      await deleteUMKM(item.id);
      toast.success("✅ UMKM berhasil dihapus!");
      onUpdate();
      setDeleteModal({ open: false, item: null });
    } catch (error) {
      console.error("Error deleting UMKM:", error);
      toast.error("❌ Gagal menghapus UMKM");
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
              key={item.id}
              className="p-6 hover:bg-white/50 transition-all duration-200 group"
            >
              <div className="flex items-start space-x-4">
                {/* Icon placeholder */}
                <div className="flex-shrink-0 w-16 h-16 relative rounded-xl overflow-hidden bg-gradient-to-br from-green-100 to-emerald-200 group-hover:scale-105 transition-transform duration-200 flex items-center justify-center">
                  {item.foto ? (
                    <img
                      src={item.foto}
                      alt={item.nama}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BuildingStorefrontIcon className="h-8 w-8 text-green-600" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Title and badges */}
                  <div className="flex items-start justify-between mb-3">
                    <h3
                      className="text-lg font-semibold text-gray-900 line-clamp-1 flex-1 cursor-pointer hover:text-green-600 transition-colors duration-200 group-hover:text-green-700"
                      onClick={() => onView(item)}
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

                  {/* Owner */}
                  <p className="text-gray-600 mb-3 text-sm">
                    <span className="font-medium">Pemilik:</span> {item.pemilik}
                  </p>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                    {item.deskripsi}
                  </p>

                  {/* Contact information */}
                  <div className="flex items-center flex-wrap gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <MapPinIcon className="h-4 w-4" />
                      <span className="line-clamp-1">{item.alamat}</span>
                    </div>
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
                  </div>

                  {/* Social media indicators */}
                  {item.sosialMedia &&
                    Object.keys(item.sosialMedia).length > 0 && (
                      <div className="flex items-center space-x-2">
                        <TagIcon className="h-4 w-4 text-gray-400" />
                        <div className="flex flex-wrap gap-2">
                          {Object.keys(item.sosialMedia)
                            .slice(0, 3)
                            .map((platform, platformIndex) => (
                              <span
                                key={platformIndex}
                                className="inline-flex items-center px-2 py-1 rounded-lg text-xs bg-gray-100 text-gray-600 border border-gray-200 capitalize"
                              >
                                {platform}
                              </span>
                            ))}
                          {Object.keys(item.sosialMedia).length > 3 && (
                            <span className="text-xs text-gray-500 px-2 py-1">
                              +{Object.keys(item.sosialMedia).length - 3}{" "}
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
        title={deleteModal.item?.nama}
        loading={deleting}
      />
    </>
  );
}

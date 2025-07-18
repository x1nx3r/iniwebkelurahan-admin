// admin-kelurahan/src/components/berita/BeritaViewModal.js
"use client";
import {
  XMarkIcon,
  PencilIcon,
  CalendarDaysIcon,
  UserIcon,
  TagIcon,
  EyeIcon,
  MapPinIcon,
  PhoneIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { formatDate, getCategoryColor, getStatusColor } from "@/lib/utils";
import Image from "next/image";

export default function BeritaViewModal({ open, onClose, berita, onEdit }) {
  if (!open || !berita) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-white/20">
        {/* Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 p-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h2 className="text-xl font-bold text-gray-900">
                  Preview Berita
                </h2>
              </div>

              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm ${getCategoryColor(berita.kategori)}`}
                >
                  {berita.kategori}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm ${getStatusColor(berita.status)}`}
                >
                  {berita.status === "published" ? "Dipublikasi" : "Draft"}
                </span>
                {berita.featured && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg">
                    <StarIcon className="h-4 w-4 mr-1" />
                    Featured
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={onEdit}
                className="p-3 hover:bg-green-50 rounded-xl transition-all duration-200 text-green-600 hover:text-green-700 hover:scale-105"
                title="Edit berita"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-180px)]">
          {/* Hero Image */}
          {berita.gambar && (
            <div className="relative h-56 md:h-72 overflow-hidden">
              <Image
                src={berita.gambar}
                alt={berita.gambar_alt || berita.judul}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>

              {/* Floating action on image */}
              <div className="absolute bottom-4 right-4">
                <button
                  onClick={onEdit}
                  className="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-white transition-all duration-200 shadow-lg hover:scale-105"
                >
                  <PencilIcon className="h-4 w-4 inline mr-2" />
                  Quick Edit
                </button>
              </div>
            </div>
          )}

          <div className="p-8">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
              {berita.judul}
            </h1>

            {/* Meta information with glassmorphism effect */}
            <div className="bg-gradient-to-r from-gray-50/80 to-blue-50/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/50 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {berita.penulis && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Penulis</p>
                      <p className="font-semibold text-gray-900">
                        {berita.penulis}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                    <CalendarDaysIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Dibuat</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(berita.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                    <EyeIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Views</p>
                    <p className="font-semibold text-gray-900">
                      {berita.view_count || 0}
                    </p>
                  </div>
                </div>
              </div>

              {berita.updated_at && berita.updated_at !== berita.created_at && (
                <div className="mt-4 pt-4 border-t border-gray-200/50">
                  <p className="text-sm text-gray-600">
                    <CalendarDaysIcon className="h-4 w-4 inline mr-1" />
                    Terakhir diupdate: {formatDate(berita.updated_at)}
                  </p>
                </div>
              )}
            </div>

            {/* Summary with enhanced styling */}
            {berita.ringkasan && (
              <div className="mb-8">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-r-2xl shadow-sm">
                  <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-xs font-bold">R</span>
                    </div>
                    Ringkasan
                  </h3>
                  <p className="text-green-700 leading-relaxed text-lg">
                    {berita.ringkasan}
                  </p>
                </div>
              </div>
            )}

            {/* Main content with better typography */}
            <div className="mb-8">
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-sm">
                <div
                  className="text-gray-800 leading-relaxed whitespace-pre-wrap prose prose-lg max-w-none"
                  style={{
                    lineHeight: "1.8",
                    fontSize: "1.1rem",
                  }}
                >
                  {berita.konten}
                </div>
              </div>
            </div>

            {/* Category specific information with enhanced cards */}
            {berita.kategori === "kegiatan" &&
              (berita.lokasi || berita.pendaftaran) && (
                <div className="mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200/50 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-blue-800 mb-6 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mr-3">
                        <MapPinIcon className="h-5 w-5 text-white" />
                      </div>
                      Detail Kegiatan
                    </h3>
                    <div className="space-y-4">
                      {berita.lokasi && (
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <MapPinIcon className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <span className="font-semibold text-blue-800">
                              Lokasi:
                            </span>
                            <p className="text-blue-700 mt-1">
                              {berita.lokasi}
                            </p>
                          </div>
                        </div>
                      )}
                      {berita.pendaftaran && (
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <UserIcon className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <span className="font-semibold text-blue-800">
                              Pendaftaran:
                            </span>
                            <p className="text-blue-700 mt-1">
                              {berita.pendaftaran}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            {(berita.kategori === "pengumuman" ||
              berita.kategori === "layanan") &&
              berita.kontak && (
                <div className="mb-8">
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200/50 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-yellow-800 mb-6 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mr-3">
                        <PhoneIcon className="h-5 w-5 text-white" />
                      </div>
                      Informasi Kontak
                    </h3>
                    <div className="bg-white/50 rounded-xl p-4 text-yellow-700 whitespace-pre-wrap leading-relaxed font-medium">
                      {berita.kontak}
                    </div>
                  </div>
                </div>
              )}

            {/* Tags with modern design */}
            {berita.tags && berita.tags.length > 0 && (
              <div className="mb-8">
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200/50 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <TagIcon className="h-5 w-5 text-gray-600 mr-2" />
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {berita.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Admin information panel with glassmorphism */}
            <div className="bg-gradient-to-br from-gray-50/80 to-blue-50/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
              <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-700 rounded-lg flex items-center justify-center mr-3">
                  <EyeIcon className="h-5 w-5 text-white" />
                </div>
                Informasi Admin
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white/60 rounded-xl p-4 border border-white/50">
                  <span className="text-sm font-medium text-gray-600">
                    ID Dokumen
                  </span>
                  <p className="font-mono text-sm text-gray-800 mt-1 break-all bg-gray-100/50 px-2 py-1 rounded">
                    {berita.id}
                  </p>
                </div>

                <div className="bg-white/60 rounded-xl p-4 border border-white/50">
                  <span className="text-sm font-medium text-gray-600">
                    Prioritas
                  </span>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {berita.priority || 5} / 10
                  </p>
                </div>

                <div className="bg-white/60 rounded-xl p-4 border border-white/50">
                  <span className="text-sm font-medium text-gray-600">
                    Featured
                  </span>
                  <p className="text-lg font-bold mt-1">
                    {berita.featured ? (
                      <span className="text-green-600">✅ Ya</span>
                    ) : (
                      <span className="text-gray-500">❌ Tidak</span>
                    )}
                  </p>
                </div>
              </div>

              {berita.gambar && (
                <div className="mt-4 bg-white/60 rounded-xl p-4 border border-white/50">
                  <span className="text-sm font-medium text-gray-600">
                    URL Gambar
                  </span>
                  <p className="font-mono text-xs text-gray-700 mt-1 break-all bg-gray-100/50 px-2 py-1 rounded">
                    {berita.gambar}
                  </p>
                </div>
              )}
            </div>

            {/* Preview note with modern styling */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <EyeIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-blue-900 mb-2">
                    Preview Mode
                  </h4>
                  <p className="text-blue-700 leading-relaxed">
                    Ini adalah tampilan preview untuk berita{" "}
                    <span className="font-semibold">
                      &quot;{berita.judul}&quot;
                    </span>
                    .
                    {berita.status === "published"
                      ? " Berita ini sudah dipublikasi dan dapat dilihat oleh pengunjung website."
                      : " Berita ini masih dalam status draft dan belum terlihat oleh pengunjung."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with glassmorphism */}
        <div className="sticky bottom-0 bg-white/90 backdrop-blur-xl border-t border-gray-200/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${berita.status === "published" ? "bg-green-500" : "bg-yellow-500"}`}
                ></div>
                <span className="font-medium text-gray-700">
                  {berita.status === "published" ? "Dipublikasi" : "Draft"}
                </span>
              </div>
              <div className="text-gray-500">•</div>
              <span className="text-gray-600">
                <span className="font-medium capitalize">
                  {berita.kategori}
                </span>
              </span>
              <div className="text-gray-500">•</div>
              <span className="text-gray-600">
                Prioritas{" "}
                <span className="font-medium">{berita.priority || 5}</span>
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 hover:scale-105"
              >
                Tutup
              </button>
              <button
                onClick={onEdit}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg inline-flex items-center"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit Berita
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// iniwebumkm-admin/src/components/umkm/UMKMViewModal.js
"use client";
import {
  XMarkIcon,
  PencilIcon,
  MapPinIcon,
  PhoneIcon,
  BuildingStorefrontIcon,
  StarIcon,
  EyeIcon,
  UserIcon,
  ClockIcon,
  TagIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

export default function UMKMViewModal({ open, onClose, umkm, onEdit }) {
  if (!open || !umkm) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Get social media icon
  const getSocialIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case "whatsapp":
        return "💬";
      case "instagram":
        return "📸";
      case "facebook":
        return "👥";
      case "tiktok":
        return "🎵";
      case "twitter":
        return "🐦";
      case "youtube":
        return "📺";
      case "linkedin":
        return "💼";
      case "telegram":
        return "✈️";
      default:
        return "🌐";
    }
  };

  // Get social media URL
  const getSocialMediaUrl = (platform, handle) => {
    const cleanHandle = handle.replace(/[@#]/g, "");

    switch (platform.toLowerCase()) {
      case "whatsapp":
        const phoneNumber = cleanHandle.replace(/\D/g, "");
        return `https://wa.me/${phoneNumber}`;
      case "instagram":
        return `https://instagram.com/${cleanHandle}`;
      case "facebook":
        return `https://facebook.com/${cleanHandle}`;
      case "tiktok":
        return `https://tiktok.com/@${cleanHandle}`;
      case "twitter":
        return `https://twitter.com/${cleanHandle}`;
      case "youtube":
        return `https://youtube.com/@${cleanHandle}`;
      case "linkedin":
        return `https://linkedin.com/in/${cleanHandle}`;
      case "telegram":
        return `https://t.me/${cleanHandle}`;
      default:
        if (handle.startsWith("http")) {
          return handle;
        } else {
          return `https://${cleanHandle}`;
        }
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
                <h2 className="text-xl font-bold text-gray-900">Detail UMKM</h2>
              </div>

              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm ${
                    umkm.status === "active"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-red-100 text-red-700 border border-red-200"
                  }`}
                >
                  {umkm.status === "active" ? "🟢 Aktif" : "🔴 Tidak Aktif"}
                </span>
                {umkm.featured && (
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
                title="Edit UMKM"
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
          {umkm.foto && (
            <div className="relative h-56 md:h-72 overflow-hidden">
              <Image
                src={umkm.foto}
                alt={umkm.nama}
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
              {umkm.nama}
            </h1>

            {/* Meta information */}
            <div className="bg-gradient-to-r from-gray-50/80 to-blue-50/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/50 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pemilik</p>
                    <p className="font-semibold text-gray-900">
                      {umkm.pemilik}
                    </p>
                  </div>
                </div>

                {umkm.kategori && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                      <TagIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Kategori</p>
                      <p className="font-semibold text-gray-900 capitalize">
                        {umkm.kategori}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                    <EyeIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Views</p>
                    <p className="font-semibold text-gray-900">
                      {umkm.views || 0}
                    </p>
                  </div>
                </div>
              </div>

              {umkm.updatedAt && (
                <div className="mt-4 pt-4 border-t border-gray-200/50">
                  <p className="text-sm text-gray-600 flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    Terakhir diupdate: {formatDate(umkm.updatedAt)}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-r-2xl shadow-sm">
                <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-xs font-bold">D</span>
                  </div>
                  Deskripsi
                </h3>
                <p className="text-green-700 leading-relaxed text-lg">
                  {umkm.deskripsi}
                </p>
              </div>
            </div>

            {/* Extended Description */}
            {umkm.deskripsi_lengkap && (
              <div className="mb-8">
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Deskripsi Lengkap
                  </h3>
                  <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {umkm.deskripsi_lengkap}
                  </div>
                </div>
              </div>
            )}

            {/* Products/Services */}
            {umkm.produk_layanan && (
              <div className="mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200/50 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mr-3">
                      <BuildingStorefrontIcon className="h-5 w-5 text-white" />
                    </div>
                    Produk & Layanan
                  </h3>
                  <div className="text-blue-700 leading-relaxed whitespace-pre-wrap">
                    {umkm.produk_layanan}
                  </div>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="mb-8">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200/50 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
                <h3 className="text-xl font-bold text-yellow-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mr-3">
                    <PhoneIcon className="h-5 w-5 text-white" />
                  </div>
                  Informasi Kontak
                </h3>

                <div className="space-y-4">
                  {/* Address */}
                  {umkm.alamat && (
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <MapPinIcon className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <span className="font-semibold text-yellow-800">
                          Alamat:
                        </span>
                        <p className="text-yellow-700 mt-1">{umkm.alamat}</p>
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  {umkm.telefon && (
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <PhoneIcon className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <span className="font-semibold text-yellow-800">
                          Telepon:
                        </span>
                        <p className="text-yellow-700 mt-1">
                          <a
                            href={`tel:${umkm.telefon}`}
                            className="hover:underline"
                          >
                            {umkm.telefon}
                          </a>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Operating Hours */}
                  {umkm.jam_operasional && (
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <ClockIcon className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <span className="font-semibold text-yellow-800">
                          Jam Operasional:
                        </span>
                        <p className="text-yellow-700 mt-1">
                          {umkm.jam_operasional}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Social Media */}
            {umkm.sosialMedia && Object.keys(umkm.sosialMedia).length > 0 && (
              <div className="mb-8">
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200/50 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <GlobeAltIcon className="h-5 w-5 text-gray-600 mr-2" />
                    Media Sosial
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(umkm.sosialMedia).map(
                      ([platform, handle], index) => (
                        <a
                          key={platform}
                          href={getSocialMediaUrl(platform, handle)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-3 p-4 bg-white/60 rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-200 hover:scale-105 group"
                        >
                          <span className="text-2xl">
                            {getSocialIcon(platform)}
                          </span>
                          <div>
                            <div className="text-sm font-medium text-gray-700 capitalize">
                              {platform}
                            </div>
                            <div className="text-sm text-green-600 group-hover:text-green-700 transition-colors duration-200">
                              {handle}
                            </div>
                          </div>
                        </a>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Admin Information */}
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
                    {umkm.id}
                  </p>
                </div>

                <div className="bg-white/60 rounded-xl p-4 border border-white/50">
                  <span className="text-sm font-medium text-gray-600">
                    Slug
                  </span>
                  <p className="font-mono text-sm text-gray-800 mt-1 break-all bg-gray-100/50 px-2 py-1 rounded">
                    {umkm.slug}
                  </p>
                </div>

                <div className="bg-white/60 rounded-xl p-4 border border-white/50">
                  <span className="text-sm font-medium text-gray-600">
                    Featured
                  </span>
                  <p className="text-lg font-bold mt-1">
                    {umkm.featured ? (
                      <span className="text-green-600">✅ Ya</span>
                    ) : (
                      <span className="text-gray-500">❌ Tidak</span>
                    )}
                  </p>
                </div>
              </div>

              {umkm.foto && (
                <div className="mt-4 bg-white/60 rounded-xl p-4 border border-white/50">
                  <span className="text-sm font-medium text-gray-600">
                    URL Foto
                  </span>
                  <p className="font-mono text-xs text-gray-700 mt-1 break-all bg-gray-100/50 px-2 py-1 rounded">
                    {umkm.foto}
                  </p>
                </div>
              )}
            </div>

            {/* Preview note */}
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
                    Ini adalah tampilan preview untuk UMKM{" "}
                    <span className="font-semibold">
                      &quot;{umkm.nama}&quot;
                    </span>
                    .
                    {umkm.status === "active"
                      ? " UMKM ini sudah aktif dan dapat dilihat oleh pengunjung website."
                      : " UMKM ini tidak aktif dan belum terlihat oleh pengunjung."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/90 backdrop-blur-xl border-t border-gray-200/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${umkm.status === "active" ? "bg-green-500" : "bg-red-500"}`}
                ></div>
                <span className="font-medium text-gray-700">
                  {umkm.status === "active" ? "Aktif" : "Tidak Aktif"}
                </span>
              </div>
              <div className="text-gray-500">•</div>
              <span className="text-gray-600">
                <span className="font-medium capitalize">
                  {umkm.kategori || "Kategori belum diset"}
                </span>
              </span>
              <div className="text-gray-500">•</div>
              <span className="text-gray-600">
                Featured{" "}
                <span className="font-medium">
                  {umkm.featured ? "Ya" : "Tidak"}
                </span>
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
                Edit UMKM
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

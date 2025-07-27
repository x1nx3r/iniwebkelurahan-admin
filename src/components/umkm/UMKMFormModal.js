// iniwebumkm-admin/src/components/umkm/UMKMFormModal.js
"use client";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import ImageUpload from "@/components/ui/ImageUpload";
import {
  XMarkIcon,
  BuildingStorefrontIcon,
  UserIcon,
  CogIcon,
  PhotoIcon,
  MapPinIcon,
  PhoneIcon,
  SparklesIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const statusOptions = [
  { value: "active", label: "Aktif", color: "from-green-400 to-green-600" },
  { value: "inactive", label: "Tidak Aktif", color: "from-red-400 to-red-600" },
];

const socialMediaPlatforms = [
  { key: "whatsapp", label: "WhatsApp", placeholder: "081234567890" },
  { key: "instagram", label: "Instagram", placeholder: "@nama_akun atau URL" },
  { key: "facebook", label: "Facebook", placeholder: "nama.akun atau URL" },
  { key: "tiktok", label: "TikTok", placeholder: "@nama_akun atau URL" },
  { key: "twitter", label: "Twitter", placeholder: "@nama_akun atau URL" },
  { key: "youtube", label: "YouTube", placeholder: "@nama_channel atau URL" },
  { key: "linkedin", label: "LinkedIn", placeholder: "nama-profil atau URL" },
  { key: "telegram", label: "Telegram", placeholder: "@nama_akun atau URL" },
];

export default function UMKMFormModal({
  open,
  onClose,
  onSuccess,
  initialData = null,
  isEdit = false,
  title = "Tambah UMKM Baru",
}) {
  const [formData, setFormData] = useState({
    nama: "",
    pemilik: "",
    deskripsi: "",
    alamat: "",
    telefon: "",
    status: "active",
    featured: false,
    foto: "",
    sosialMedia: {},
    kategori: "",
    produk: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [socialMediaInputs, setSocialMediaInputs] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && initialData) {
      // Debug logging
      console.log("🔄 Initializing UMKM form with data:", initialData);
      console.log("📋 Available ID fields:", {
        id: initialData.id,
        slug: initialData.slug,
        docId: initialData.docId,
      });

      setFormData({
        nama: initialData.nama || "",
        pemilik: initialData.pemilik || "",
        deskripsi: initialData.deskripsi || "",
        alamat: initialData.alamat || "",
        telefon: initialData.telefon || "",
        status: initialData.status || "active",
        featured: initialData.featured || false,
        foto: initialData.foto || "",
        sosialMedia: initialData.sosialMedia || {},
        kategori: initialData.kategori || "",
        produk: initialData.produk || "",
        // Preserve the document ID for editing
        slug: initialData.slug || initialData.id,
        docId: initialData.docId, // Keep original docId for reference
      });

      if (initialData.foto) {
        setImageData({
          url: initialData.foto,
          alt: initialData.nama,
          filename: initialData.foto.split("/").pop(),
        });
      }

      // Set social media inputs
      setSocialMediaInputs(initialData.sosialMedia || {});
    } else if (open && !initialData) {
      // Reset form for new UMKM
      console.log("🆕 Resetting form for new UMKM");
      setFormData({
        nama: "",
        pemilik: "",
        deskripsi: "",
        alamat: "",
        telefon: "",
        status: "active",
        featured: false,
        foto: "",
        sosialMedia: {},
        kategori: "",
        produk: "",
      });
      setImageData(null);
      setSocialMediaInputs({});
    }

    // Reset error when modal opens/closes
    if (open) {
      setError(null);
    }
  }, [open, initialData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSocialMediaChange = (platform, value) => {
    const newSocialMedia = { ...socialMediaInputs };

    if (value.trim() === "") {
      delete newSocialMedia[platform];
    } else {
      newSocialMedia[platform] = value.trim();
    }

    setSocialMediaInputs(newSocialMedia);
    setFormData((prev) => ({
      ...prev,
      sosialMedia: newSocialMedia,
    }));
  };

  const handleImageUpload = (uploadedImage) => {
    setImageData(uploadedImage);
    setFormData((prev) => ({
      ...prev,
      foto: uploadedImage.url,
    }));
  };

  const handleImageRemove = () => {
    setImageData(null);
    setFormData((prev) => ({
      ...prev,
      foto: "",
    }));
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (
      !formData.nama.trim() ||
      !formData.pemilik.trim() ||
      !formData.deskripsi.trim()
    ) {
      const errorMsg = "Nama UMKM, pemilik, dan deskripsi wajib diisi";
      toast.error(errorMsg);
      setError(errorMsg);
      return;
    }

    try {
      setSubmitting(true);
      console.log("💾 Submitting UMKM form:", {
        ...formData,
        sosialMedia: Object.keys(formData.sosialMedia).length,
      });

      const dataToSubmit = {
        ...formData,
        // Generate slug for new UMKM, preserve existing slug for updates
        slug: isEdit
          ? formData.slug || generateSlug(formData.nama)
          : generateSlug(formData.nama),
        // Ensure empty strings for optional fields instead of undefined
        alamat: formData.alamat || "",
        telefon: formData.telefon || "",
        kategori: formData.kategori || "",
        produk: formData.produk || "",
        foto: formData.foto || "",
        sosialMedia: formData.sosialMedia || {},
      };

      // Remove internal fields that shouldn't be sent to API
      const { docId, ...cleanDataToSubmit } = dataToSubmit;

      if (isEdit && initialData) {
        // Determine the correct document ID to use for API call
        let documentId;

        // Try different ID fields in order of preference
        if (
          initialData.docId &&
          typeof initialData.docId === "string" &&
          initialData.docId.length > 0
        ) {
          documentId = initialData.docId;
        } else if (
          initialData.slug &&
          typeof initialData.slug === "string" &&
          initialData.slug.length > 0
        ) {
          documentId = initialData.slug;
        } else if (
          initialData.id &&
          typeof initialData.id === "string" &&
          initialData.id.length > 0
        ) {
          documentId = initialData.id;
        } else {
          // Fallback: generate from name
          documentId = generateSlug(initialData.nama);
        }

        console.log("📝 Updating UMKM:", {
          documentId,
          initialData: {
            id: initialData.id,
            slug: initialData.slug,
            docId: initialData.docId,
            nama: initialData.nama,
          },
          dataKeys: Object.keys(cleanDataToSubmit),
        });

        if (!documentId || typeof documentId !== "string") {
          throw new Error("Invalid document ID for update operation");
        }

        await apiClient.updateUMKM(documentId, cleanDataToSubmit);
        toast.success("UMKM berhasil diperbarui!");
      } else {
        console.log("✨ Creating new UMKM:", cleanDataToSubmit.nama);
        const result = await apiClient.createUMKM(cleanDataToSubmit);
        console.log("✅ Created UMKM:", result);
        toast.success("UMKM berhasil ditambahkan!");
      }

      onSuccess();
    } catch (error) {
      console.error("❌ Error saving UMKM:", error);
      const errorMsg = error.message || "Gagal menyimpan UMKM";
      setError(errorMsg);
      toast.error(errorMsg);

      // Log detailed error info for debugging
      console.error("🔍 Error details:", {
        message: error.message,
        initialData,
        formData: {
          nama: formData.nama,
          isEdit,
          hasSlug: !!formData.slug,
          hasDocId: !!formData.docId,
        },
        stack: error.stack,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !submitting) {
      onClose();
    }
  };

  if (!open) return null;

  const selectedStatus = statusOptions.find(
    (status) => status.value === formData.status,
  );

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
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 bg-gradient-to-br ${selectedStatus?.color || "from-gray-400 to-gray-600"} rounded-xl flex items-center justify-center`}
                >
                  <BuildingStorefrontIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                  <p className="text-sm text-gray-600">
                    {isEdit
                      ? "Perbarui informasi UMKM"
                      : "Tambahkan UMKM baru ke database"}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={submitting}
              className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 disabled:opacity-50 hover:scale-105"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-red-800">
                    Terjadi Kesalahan
                  </h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-200px)]">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Basic Information */}
                <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <BuildingStorefrontIcon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Informasi Dasar
                    </h3>
                  </div>

                  <div className="space-y-6">
                    {/* Nama UMKM */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Nama UMKM <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="nama"
                        value={formData.nama}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        placeholder="Contoh: Warung Makan Bu Sari"
                        disabled={submitting}
                      />
                    </div>

                    {/* Pemilik */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Nama Pemilik <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="pemilik"
                        value={formData.pemilik}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        placeholder="Contoh: Ibu Sari Wijaya"
                        disabled={submitting}
                      />
                    </div>

                    {/* Kategori */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Kategori Usaha
                      </label>
                      <input
                        type="text"
                        name="kategori"
                        value={formData.kategori}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        placeholder="Contoh: Kuliner, Fashion, Kerajinan"
                        disabled={submitting}
                      />
                    </div>

                    {/* Produk */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Produk/Layanan
                      </label>
                      <input
                        type="text"
                        name="produk"
                        value={formData.produk}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        placeholder="Contoh: Nasi Gudeg, Pakaian Muslim, Tas Rajut"
                        disabled={submitting}
                      />
                    </div>

                    {/* Deskripsi */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Deskripsi UMKM <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="deskripsi"
                        value={formData.deskripsi}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none"
                        placeholder="Deskripsi lengkap tentang UMKM ini..."
                        disabled={submitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <MapPinIcon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Informasi Kontak
                    </h3>
                  </div>

                  <div className="space-y-6">
                    {/* Alamat */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Alamat Lengkap
                      </label>
                      <textarea
                        name="alamat"
                        value={formData.alamat}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none"
                        placeholder="Alamat lengkap UMKM..."
                        disabled={submitting}
                      />
                    </div>

                    {/* Telefon */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Nomor Telepon
                      </label>
                      <input
                        type="tel"
                        name="telefon"
                        value={formData.telefon}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        placeholder="Contoh: 081234567890"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-gradient-to-r from-cyan-50/80 to-blue-50/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <GlobeAltIcon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Media Sosial
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {socialMediaPlatforms.map((platform) => (
                      <div key={platform.key}>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                          {platform.label}
                        </label>
                        <input
                          type="text"
                          value={socialMediaInputs[platform.key] || ""}
                          onChange={(e) =>
                            handleSocialMediaChange(
                              platform.key,
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm text-sm"
                          placeholder={platform.placeholder}
                          disabled={submitting}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    Isi dengan username, nomor telepon, atau URL lengkap.
                    Kosongkan jika tidak ada.
                  </p>
                </div>

                {/* Image Upload */}
                <div className="bg-gradient-to-r from-yellow-50/80 to-orange-50/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <PhotoIcon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Foto UMKM
                    </h3>
                  </div>

                  <ImageUpload
                    value={imageData}
                    onChange={handleImageUpload}
                    onRemove={handleImageRemove}
                    title="Foto UMKM"
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Settings */}
                <div className="bg-gradient-to-br from-gray-50/80 to-slate-50/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-slate-600 rounded-lg flex items-center justify-center">
                      <CogIcon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Pengaturan
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Status UMKM
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                        disabled={submitting}
                      >
                        {statusOptions.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-2">
                        {formData.status === "active"
                          ? "🟢 UMKM akan terlihat di website publik"
                          : "🔴 UMKM tidak akan terlihat di website publik"}
                      </p>
                    </div>

                    <div className="bg-white/60 rounded-xl p-4 border border-white/50">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleInputChange}
                          disabled={submitting}
                          className="h-5 w-5 text-yellow-600 rounded border-gray-300 focus:ring-yellow-500"
                        />
                        <div>
                          <label className="text-sm font-semibold text-gray-700">
                            UMKM Unggulan
                          </label>
                          <p className="text-xs text-gray-500">
                            Akan ditampilkan di section UMKM utama
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <SparklesIcon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Preview</h3>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`font-medium ${formData.status === "active" ? "text-green-600" : "text-red-600"}`}
                      >
                        {formData.status === "active" ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Featured:</span>
                      <span className="font-medium">
                        {formData.featured ? "⭐ Ya" : "❌ Tidak"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Foto:</span>
                      <span className="font-medium">
                        {imageData ? "📷 Ada" : "❌ Tidak ada"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kategori:</span>
                      <span className="font-medium">
                        {formData.kategori || "Belum diisi"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sosial Media:</span>
                      <span className="font-medium">
                        {Object.keys(socialMediaInputs).length} platform
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kontak:</span>
                      <span className="font-medium">
                        {formData.telefon ? "📞 Ada" : "❌ Tidak ada"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/90 backdrop-blur-xl border-t border-gray-200/50 p-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 hover:scale-105"
              disabled={submitting}
            >
              Batal
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 flex items-center space-x-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <BuildingStorefrontIcon className="h-4 w-4" />
                  <span>{isEdit ? "Perbarui UMKM" : "Simpan UMKM"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

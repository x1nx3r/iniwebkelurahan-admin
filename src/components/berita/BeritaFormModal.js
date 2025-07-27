// iniwebumkm-admin/src/components/berita/BeritaFormModal.js
"use client";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import ImageUpload from "@/components/ui/ImageUpload";
import {
  XMarkIcon,
  DocumentTextIcon,
  TagIcon,
  CogIcon,
  PhotoIcon,
  MapPinIcon,
  PhoneIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const categories = [
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

export default function BeritaFormModal({
  open,
  onClose,
  onSuccess,
  initialData = null,
  isEdit = false,
  title = "Buat Berita Baru",
}) {
  const [formData, setFormData] = useState({
    judul: "",
    ringkasan: "",
    konten: "",
    kategori: "berita",
    status: "draft",
    penulis: "",
    tags: [],
    featured: false,
    gambar: "",
    gambar_alt: "",
    priority: 5,
    lokasi: "",
    pendaftaran: "",
    kontak: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && initialData) {
      console.log("🔄 Initializing form with data:", initialData);
      setFormData({
        ...initialData,
        tags: initialData.tags || [],
        priority: initialData.priority || 5,
      });

      if (initialData.gambar) {
        setImageData({
          url: initialData.gambar,
          alt: initialData.gambar_alt || initialData.judul,
          filename: initialData.gambar.split("/").pop(),
        });
      }
    } else if (open && !initialData) {
      // Reset form for new berita
      console.log("🆕 Resetting form for new berita");
      setFormData({
        judul: "",
        ringkasan: "",
        konten: "",
        kategori: "berita",
        status: "draft",
        penulis: "",
        tags: [],
        featured: false,
        gambar: "",
        gambar_alt: "",
        priority: 5,
        lokasi: "",
        pendaftaran: "",
        kontak: "",
      });
      setImageData(null);
      setTagInput("");
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

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleImageUpload = (uploadedImage) => {
    setImageData(uploadedImage);
    setFormData((prev) => ({
      ...prev,
      gambar: uploadedImage.url,
      gambar_alt: uploadedImage.alt,
    }));
  };

  const handleImageRemove = () => {
    setImageData(null);
    setFormData((prev) => ({
      ...prev,
      gambar: "",
      gambar_alt: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.judul.trim() || !formData.konten.trim()) {
      const errorMsg = "Judul dan konten wajib diisi";
      toast.error(errorMsg);
      setError(errorMsg);
      return;
    }

    try {
      setSubmitting(true);
      console.log("💾 Submitting form data:", {
        ...formData,
        tags: formData.tags.length,
      });

      const dataToSubmit = {
        ...formData,
        view_count: formData.view_count || 0,
        priority: Number(formData.priority),
        // Ensure empty strings for optional fields instead of undefined
        lokasi: formData.lokasi || "",
        pendaftaran: formData.pendaftaran || "",
        kontak: formData.kontak || "",
        penulis: formData.penulis || "",
        ringkasan: formData.ringkasan || "",
        gambar_alt: formData.gambar_alt || "",
      };

      if (isEdit && initialData?.id) {
        console.log("📝 Updating berita with ID:", initialData.id);
        await apiClient.updateBerita(initialData.id, dataToSubmit);
        toast.success("Berita berhasil diperbarui!");
      } else {
        console.log("✨ Creating new berita");
        const result = await apiClient.createBerita(dataToSubmit);
        console.log("✅ Created berita:", result);
        toast.success("Berita berhasil dibuat!");
      }

      onSuccess();
    } catch (error) {
      console.error("❌ Error saving berita:", error);
      const errorMsg = error.message || "Gagal menyimpan berita";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveAs = async (status) => {
    setError(null);

    if (!formData.judul.trim() || !formData.konten.trim()) {
      const errorMsg = "Judul dan konten wajib diisi";
      toast.error(errorMsg);
      setError(errorMsg);
      return;
    }

    try {
      setSubmitting(true);
      console.log(`💾 Saving as ${status}:`, formData.judul);

      const dataToSubmit = {
        ...formData,
        status,
        view_count: formData.view_count || 0,
        priority: Number(formData.priority),
        lokasi: formData.lokasi || "",
        pendaftaran: formData.pendaftaran || "",
        kontak: formData.kontak || "",
        penulis: formData.penulis || "",
        ringkasan: formData.ringkasan || "",
        gambar_alt: formData.gambar_alt || "",
      };

      if (isEdit && initialData?.id) {
        await apiClient.updateBerita(initialData.id, dataToSubmit);
        toast.success(
          `Berita berhasil ${status === "published" ? "dipublikasi" : "disimpan sebagai draft"}!`,
        );
      } else {
        const result = await apiClient.createBerita(dataToSubmit);
        console.log("✅ Created berita:", result);
        toast.success(
          `Berita berhasil ${status === "published" ? "dipublikasi" : "disimpan sebagai draft"}!`,
        );
      }

      onSuccess();
    } catch (error) {
      console.error("❌ Error saving berita:", error);
      const errorMsg = error.message || "Gagal menyimpan berita";
      setError(errorMsg);
      toast.error(errorMsg);
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

  const selectedCategory = categories.find(
    (cat) => cat.value === formData.kategori,
  );

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-white/20">
        {/* Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 p-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 bg-gradient-to-br ${selectedCategory?.color || "from-gray-400 to-gray-600"} rounded-xl flex items-center justify-center`}
                >
                  <DocumentTextIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                  <p className="text-sm text-gray-600">
                    {isEdit
                      ? "Perbarui konten berita"
                      : "Buat konten berita baru"}
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
          <form id="berita-form-modal" onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Title Section */}
                <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <DocumentTextIcon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Informasi Utama
                    </h3>
                  </div>

                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Judul Berita <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="judul"
                        value={formData.judul}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        placeholder="Masukkan judul berita yang menarik..."
                        disabled={submitting}
                      />
                    </div>

                    {/* Summary */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Ringkasan
                      </label>
                      <textarea
                        name="ringkasan"
                        value={formData.ringkasan}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none"
                        placeholder="Ringkasan singkat yang akan ditampilkan di daftar berita..."
                        disabled={submitting}
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Ringkasan akan membantu pembaca memahami inti berita
                        dengan cepat
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <DocumentTextIcon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Konten Berita
                    </h3>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Konten Lengkap <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="konten"
                      value={formData.konten}
                      onChange={handleInputChange}
                      required
                      rows={12}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none"
                      placeholder="Tulis konten berita lengkap di sini..."
                      disabled={submitting}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Gunakan paragraf yang jelas dan mudah dibaca. Tekan Enter
                      dua kali untuk paragraf baru.
                    </p>
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <PhotoIcon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Media</h3>
                  </div>

                  <ImageUpload
                    value={imageData}
                    onChange={handleImageUpload}
                    onRemove={handleImageRemove}
                    title="Gambar Berita"
                    disabled={submitting}
                  />
                </div>

                {/* Category specific fields */}
                {formData.kategori === "kegiatan" && (
                  <div className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 shadow-sm">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                        <MapPinIcon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-blue-800">
                        Detail Kegiatan
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-blue-700 mb-3">
                          Lokasi Kegiatan
                        </label>
                        <input
                          type="text"
                          name="lokasi"
                          value={formData.lokasi}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                          placeholder="Contoh: Balai Kelurahan Kemayoran"
                          disabled={submitting}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-blue-700 mb-3">
                          Info Pendaftaran
                        </label>
                        <input
                          type="text"
                          name="pendaftaran"
                          value={formData.pendaftaran}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                          placeholder="Contoh: Daftar di kantor kelurahan"
                          disabled={submitting}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {(formData.kategori === "pengumuman" ||
                  formData.kategori === "layanan") && (
                  <div className="bg-gradient-to-r from-yellow-50/80 to-orange-50/80 backdrop-blur-sm rounded-2xl p-6 border border-yellow-200/50 shadow-sm">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <PhoneIcon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-yellow-800">
                        Informasi Kontak
                      </h3>
                    </div>

                    <textarea
                      name="kontak"
                      value={formData.kontak}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-yellow-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white/80 backdrop-blur-sm resize-none"
                      placeholder="Contoh:&#10;Telp: (031) 123-4567&#10;Email: info@kemayoran.go.id&#10;WhatsApp: 081234567890"
                      disabled={submitting}
                    />
                  </div>
                )}
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
                        Kategori
                      </label>
                      <select
                        name="kategori"
                        value={formData.kategori}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                        disabled={submitting}
                      >
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Status Publikasi
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                        disabled={submitting}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Dipublikasi</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-2">
                        {formData.status === "published"
                          ? "🌟 Akan terlihat di website publik"
                          : "📝 Hanya terlihat di admin panel"}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Penulis
                      </label>
                      <input
                        type="text"
                        name="penulis"
                        value={formData.penulis}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                        placeholder="Nama penulis atau tim..."
                        disabled={submitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Prioritas (1-10)
                      </label>
                      <input
                        type="number"
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        min="1"
                        max="10"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                        disabled={submitting}
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>Rendah</span>
                        <span>Tinggi</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Berita dengan prioritas tinggi akan muncul di atas
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
                            Tampilkan di beranda
                          </label>
                          <p className="text-xs text-gray-500">
                            Akan ditampilkan di section berita utama
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <TagIcon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Tags</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleTagInputKeyPress}
                        placeholder="Tambah tag..."
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-l-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                        disabled={submitting}
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        disabled={submitting || !tagInput.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-r-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 font-medium transition-all duration-200"
                      >
                        Tambah
                      </button>
                    </div>

                    {formData.tags.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                          Tags aktif:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200"
                            >
                              #{tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                disabled={submitting}
                                className="ml-2 text-green-600 hover:text-green-800 hover:bg-green-200 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-gray-500">
                      Tags membantu pengunjung menemukan berita terkait dengan
                      mudah
                    </p>
                  </div>
                </div>

                {/* Quick Preview */}
                <div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <SparklesIcon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Preview</h3>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kategori:</span>
                      <span className="font-medium capitalize">
                        {formData.kategori}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`font-medium ${formData.status === "published" ? "text-green-600" : "text-yellow-600"}`}
                      >
                        {formData.status === "published"
                          ? "Dipublikasi"
                          : "Draft"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prioritas:</span>
                      <span className="font-medium">
                        {formData.priority}/10
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Featured:</span>
                      <span className="font-medium">
                        {formData.featured ? "⭐ Ya" : "❌ Tidak"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tags:</span>
                      <span className="font-medium">
                        {formData.tags.length} tag(s)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gambar:</span>
                      <span className="font-medium">
                        {imageData ? "📷 Ada" : "❌ Tidak ada"}
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

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => handleSaveAs("draft")}
                disabled={submitting}
                className="px-6 py-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-xl font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 flex items-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-yellow-800 border-t-transparent rounded-full animate-spin"></div>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <span>💾 Simpan Draft</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleSaveAs("published")}
                disabled={submitting}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 flex items-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Mempublikasi...</span>
                  </>
                ) : (
                  <>
                    <span>🚀 Publikasikan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// admin-kelurahan/src/components/ui/ImageUpload.js
"use client";
import { useState, useRef } from "react";
import { uploadImage } from "@/lib/imageUpload";
import {
  PhotoIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  ExclamationTriangleIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import toast from "react-hot-toast";

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  title = "Upload Gambar",
  disabled = false,
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Check if CDN token exists
    if (!process.env.NEXT_PUBLIC_CDN_TOKEN) {
      toast.error("CDN token tidak dikonfigurasi. Hubungi administrator.");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(10);

      console.log("🚀 Starting upload for:", file.name);

      // Simulate progress (since we can't track real progress with fetch)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev < 80) return prev + 10;
          return prev;
        });
      }, 200);

      const result = await uploadImage(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      onChange({
        url: result.url,
        alt: `${title} - Kelurahan Kemayoran`,
        filename: result.filename,
        originalName: result.originalName,
        size: result.size,
      });

      toast.success("🎉 Gambar berhasil diupload!");

      // Reset progress after a short delay
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadProgress(0);

      // Show user-friendly error messages
      if (
        error.message.includes("NetworkError") ||
        error.message.includes("Failed to fetch")
      ) {
        toast.error("❌ Koneksi terputus. Periksa internet dan coba lagi.");
      } else {
        toast.error(error.message || "❌ Gagal mengupload gambar");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (value?.url) {
    return (
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-gray-700">
          {title}
        </label>
        <div className="relative group">
          <div className="relative w-full h-64 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <Image
              src={value.url}
              alt={value.alt || "Uploaded image"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-200 disabled:opacity-50 shadow-lg hover:scale-110"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>

          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
            <div className="flex items-center text-green-600">
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">Berhasil diupload</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
          <div className="text-xs text-gray-600 space-y-1">
            <p>
              <span className="font-medium">File:</span>{" "}
              {value.originalName || value.filename}
            </p>
            {value.size && (
              <p>
                <span className="font-medium">Ukuran:</span>{" "}
                {(value.size / 1024 / 1024).toFixed(2)} MB
              </p>
            )}
            <p>
              <span className="font-medium">URL:</span>{" "}
              <span className="font-mono text-xs break-all">{value.url}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700">
        {title}
      </label>

      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300
          ${
            dragOver
              ? "border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 scale-105"
              : "border-gray-300 hover:border-green-400 hover:bg-gray-50"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${uploading ? "pointer-events-none" : ""}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={disabled || uploading}
          className="hidden"
        />

        <div className="text-center">
          {uploading ? (
            <div className="space-y-4">
              <div className="relative">
                <CloudArrowUpIcon className="mx-auto h-16 w-16 text-green-500 animate-bounce" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-green-700">
                  Mengupload gambar...
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">{uploadProgress}%</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <PhotoIcon className="mx-auto h-16 w-16 text-gray-400 group-hover:text-green-500 transition-colors duration-200" />
                <ArrowUpTrayIcon className="absolute -top-2 -right-2 h-6 w-6 text-green-500" />
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-green-600 hover:text-green-700">
                    Klik untuk upload
                  </span>
                  <span className="text-gray-500"> atau drag & drop</span>
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, JPEG, WebP (max. 5MB)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Debug info (only in development) */}
      {process.env.NODE_ENV === "development" && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
          <div className="text-xs text-blue-700">
            <p className="font-medium mb-1">Debug Info:</p>
            <p>
              CDN Token:{" "}
              {process.env.NEXT_PUBLIC_CDN_TOKEN
                ? "✅ Configured"
                : "❌ Missing"}
            </p>
            <p>Upload URL: https://uploads.x1nx3r.uk/v1/upload</p>
          </div>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              Tips untuk gambar yang baik:
            </p>
            <ul className="mt-2 space-y-1 text-xs text-amber-700">
              <li>• Gunakan rasio 16:9 atau 4:3 untuk hasil terbaik</li>
              <li>• Resolusi minimal 800x600 piksel</li>
              <li>• Pastikan gambar relevan dengan konten berita</li>
              <li>• Kompres gambar jika ukuran terlalu besar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// admin-kelurahan/src/lib/imageUpload.js
export async function uploadImage(file) {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Tipe file tidak didukung. Gunakan JPEG, PNG, atau WebP.",
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error("Ukuran file terlalu besar. Maksimal 5MB.");
    }

    // Check if environment variables are configured
    const uploadUrl = process.env.NEXT_PUBLIC_CDN_UPLOAD_URL;
    const token = process.env.NEXT_PUBLIC_CDN_TOKEN;

    if (!uploadUrl) {
      throw new Error(
        "CDN upload URL tidak dikonfigurasi. Hubungi administrator.",
      );
    }

    if (!token) {
      throw new Error("CDN token tidak dikonfigurasi. Hubungi administrator.");
    }

    console.log("🔍 Uploading to:", uploadUrl);
    console.log("📁 File info:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    console.log("📡 Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Upload failed:", response.status, errorText);
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log("✅ Upload success:", result);

    if (!result.success) {
      throw new Error(result.message || "Upload gagal");
    }

    return {
      url: result.url,
      filename: result.filename,
      originalName: result.file.originalName,
      size: result.file.size,
      type: result.file.type,
    };
  } catch (error) {
    console.error("🚨 Image upload error:", error);

    // More specific error messages
    if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("NetworkError")
    ) {
      throw new Error(
        "Tidak dapat terhubung ke server upload. Periksa koneksi internet Anda.",
      );
    }

    if (error.message.includes("401")) {
      throw new Error("Token CDN tidak valid. Hubungi administrator.");
    }

    if (error.message.includes("413")) {
      throw new Error("File terlalu besar. Maksimal 5MB.");
    }

    throw error;
  }
}

export function generateImageAlt(filename, title) {
  return `${title} - Kelurahan Kemayoran`;
}

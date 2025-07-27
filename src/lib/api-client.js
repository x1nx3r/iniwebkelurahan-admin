// iniwebumkm-admin/src/lib/api-client.js (Client-side)
class ApiClient {
  async fetchBerita() {
    const response = await fetch("/api/berita");
    if (!response.ok) {
      throw new Error("Failed to fetch berita");
    }
    return response.json();
  }

  async getBeritaStats() {
    const response = await fetch("/api/berita?action=stats");
    if (!response.ok) {
      throw new Error("Failed to fetch berita stats");
    }
    return response.json();
  }

  async createBerita(beritaData) {
    const response = await fetch("/api/berita", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(beritaData),
    });

    if (!response.ok) {
      throw new Error("Failed to create berita");
    }
    return response.json();
  }

  async updateBerita(id, updates) {
    const response = await fetch(`/api/berita/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error("Failed to update berita");
    }
    return response.json();
  }

  async deleteBerita(id) {
    const response = await fetch(`/api/berita/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete berita");
    }
    return response.json();
  }

  // Similar methods for UMKM...
  async fetchUMKM() {
    const response = await fetch("/api/umkm");
    if (!response.ok) {
      throw new Error("Failed to fetch UMKM");
    }
    return response.json();
  }

  async getUMKMStats() {
    const response = await fetch("/api/umkm?action=stats");
    if (!response.ok) {
      throw new Error("Failed to fetch UMKM stats");
    }
    return response.json();
  }

  // Add these methods to your existing api-client.js

  async fetchUMKM(options = {}) {
    const params = new URLSearchParams();
    if (options.kategori) params.append("kategori", options.kategori);
    if (options.status) params.append("status", options.status);
    if (options.limit) params.append("limit", options.limit.toString());

    const url = `/api/umkm${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch UMKM");
    }
    return response.json();
  }

  async getUMKMStats() {
    const response = await fetch("/api/umkm?action=stats");
    if (!response.ok) {
      throw new Error("Failed to fetch UMKM stats");
    }
    return response.json();
  }

  async createUMKM(umkmData) {
    const response = await fetch("/api/umkm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(umkmData),
    });

    if (!response.ok) {
      throw new Error("Failed to create UMKM");
    }
    return response.json();
  }

  async updateUMKM(slug, updates) {
    const response = await fetch(`/api/umkm/${slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error("Failed to update UMKM");
    }
    return response.json();
  }

  async deleteUMKM(slug) {
    const response = await fetch(`/api/umkm/${slug}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete UMKM");
    }
    return response.json();
  }
}

export const apiClient = new ApiClient();

// iniwebumkm-admin/src/lib/firestore-admin.js (Server-side only)
import { FieldValue } from "firebase-admin/firestore";
import { db } from "./firebase-admin.js";

const BERITA_COLLECTION = "berita";
const UMKM_COLLECTION = "umkm";

// Helper function to convert Firestore document to plain object
function docToObject(doc) {
  if (!doc.exists) return null;

  const data = doc.data();

  // Convert Timestamps to Date objects for JSON serialization
  const convertTimestamps = (obj) => {
    const converted = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value.toDate === "function") {
        converted[key] = value.toDate();
      } else if (value && typeof value === "object" && !Array.isArray(value)) {
        converted[key] = convertTimestamps(value);
      } else {
        converted[key] = value;
      }
    }
    return converted;
  };

  return {
    id: doc.id,
    ...convertTimestamps(data),
  };
}

// ===== BERITA FUNCTIONS =====

export async function getAllBerita() {
  try {
    const snapshot = await db
      .collection(BERITA_COLLECTION)
      .orderBy("created_at", "desc")
      .get();

    const berita = [];
    snapshot.forEach((doc) => {
      const data = docToObject(doc);
      if (data) berita.push(data);
    });

    return berita;
  } catch (error) {
    console.error("Error getting all berita:", error);
    throw error;
  }
}

export async function getBerita(options = {}) {
  try {
    const {
      kategori = null,
      limit: queryLimit = 50,
      lastDocId = null,
      status = "published",
    } = options;

    let query = db.collection(BERITA_COLLECTION);

    if (status) {
      query = query.where("status", "==", status);
    }

    if (kategori && kategori !== "all") {
      query = query.where("kategori", "==", kategori);
    }

    query = query.orderBy("priority", "desc").orderBy("tanggal", "desc");

    if (lastDocId) {
      const lastDoc = await db
        .collection(BERITA_COLLECTION)
        .doc(lastDocId)
        .get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    if (queryLimit) {
      query = query.limit(queryLimit);
    }

    const snapshot = await query.get();
    const berita = [];

    snapshot.forEach((doc) => {
      const data = docToObject(doc);
      if (data) berita.push(data);
    });

    return berita;
  } catch (error) {
    console.error("Error getting berita:", error);
    throw error;
  }
}

export async function getBeritaById(id) {
  try {
    const doc = await db.collection(BERITA_COLLECTION).doc(id).get();
    return docToObject(doc);
  } catch (error) {
    console.error("Error getting berita by ID:", error);
    throw error;
  }
}

export async function createBerita(beritaData) {
  try {
    const data = {
      ...beritaData,
      tanggal: FieldValue.serverTimestamp(),
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
      status: beritaData.status || "published",
      priority: beritaData.priority || 0,
    };

    const docRef = await db.collection(BERITA_COLLECTION).add(data);
    return docRef.id;
  } catch (error) {
    console.error("Error creating berita:", error);
    throw error;
  }
}

export async function updateBerita(id, updates) {
  try {
    const data = {
      ...updates,
      updated_at: FieldValue.serverTimestamp(),
    };

    await db.collection(BERITA_COLLECTION).doc(id).update(data);
  } catch (error) {
    console.error("Error updating berita:", error);
    throw error;
  }
}

export async function deleteBerita(id) {
  try {
    await db.collection(BERITA_COLLECTION).doc(id).delete();
  } catch (error) {
    console.error("Error deleting berita:", error);
    throw error;
  }
}

export async function getBeritaStats() {
  try {
    const snapshot = await db.collection(BERITA_COLLECTION).get();

    let totalBerita = 0;
    let publishedBerita = 0;
    let draftBerita = 0;
    let categories = {};

    snapshot.forEach((doc) => {
      const data = doc.data();
      totalBerita++;

      if (data.status === "published") {
        publishedBerita++;
      } else {
        draftBerita++;
      }

      categories[data.kategori] = (categories[data.kategori] || 0) + 1;
    });

    return {
      totalBerita,
      publishedBerita,
      draftBerita,
      categories,
    };
  } catch (error) {
    console.error("Error getting berita stats:", error);
    throw error;
  }
}

// ===== UMKM FUNCTIONS =====

export async function getAllUMKM(options = {}) {
  try {
    const {
      kategori = null,
      limit: queryLimit = 100,
      lastDocId = null,
      status = null,
    } = options;

    let query = db.collection(UMKM_COLLECTION);

    if (status && status !== "all") {
      query = query.where("status", "==", status);
    }

    if (kategori && kategori !== "all") {
      query = query.where("kategori", "==", kategori);
    }

    query = query.orderBy("nama");

    if (lastDocId) {
      const lastDoc = await db.collection(UMKM_COLLECTION).doc(lastDocId).get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    if (queryLimit) {
      query = query.limit(queryLimit);
    }

    const snapshot = await query.get();
    const umkm = [];

    snapshot.forEach((doc) => {
      const data = docToObject(doc);
      if (data) {
        umkm.push({
          ...data,
          docId: doc.id,
        });
      }
    });

    return umkm;
  } catch (error) {
    console.error("Error getting UMKM:", error);
    throw error;
  }
}

export async function getUMKMBySlug(slug) {
  try {
    const doc = await db.collection(UMKM_COLLECTION).doc(slug).get();
    const data = docToObject(doc);

    if (data) {
      return {
        ...data,
        docId: doc.id,
      };
    }

    return null;
  } catch (error) {
    console.error("Error getting UMKM by slug:", error);
    throw error;
  }
}

export async function createUMKM(umkmData) {
  try {
    const slug = umkmData.slug || generateSlug(umkmData.nama);
    const timestamp = Date.now();
    const numericId = parseInt(timestamp.toString().slice(-6));

    const data = {
      ...umkmData,
      id: numericId,
      slug,
      status: umkmData.status || "active",
      featured: umkmData.featured || false,
      views: 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await db.collection(UMKM_COLLECTION).doc(slug).set(data);
    return slug;
  } catch (error) {
    console.error("Error creating UMKM:", error);
    throw error;
  }
}

export async function updateUMKM(docId, umkmData) {
  try {
    const { docId: _, ...cleanData } = umkmData;
    const filteredData = Object.fromEntries(
      Object.entries(cleanData).filter(
        ([_, value]) => value !== undefined && value !== null,
      ),
    );

    await db
      .collection(UMKM_COLLECTION)
      .doc(docId)
      .update({
        ...filteredData,
        updatedAt: FieldValue.serverTimestamp(),
      });
  } catch (error) {
    console.error("Error updating UMKM:", error);
    throw error;
  }
}

export async function deleteUMKM(docId) {
  try {
    await db.collection(UMKM_COLLECTION).doc(docId).delete();
  } catch (error) {
    console.error("Error deleting UMKM:", error);
    throw error;
  }
}

export async function getUMKMStats() {
  try {
    const umkmData = await getAllUMKM();

    return {
      totalUMKM: umkmData.length,
      activeUMKM: umkmData.filter((item) => item.status === "active").length,
      inactiveUMKM: umkmData.filter((item) => item.status === "inactive")
        .length,
      featuredUMKM: umkmData.filter((item) => item.featured).length,
    };
  } catch (error) {
    console.error("Error getting UMKM stats:", error);
    throw error;
  }
}

function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

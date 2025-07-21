// iniwebumkm-admin/src/lib/firestore.js
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc, // Add this import
  query,
  orderBy,
  where,
  limit,
  startAfter, // Add this import
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase.js";

const BERITA_COLLECTION = "berita";

// Get all berita (for admin - includes drafts)
export async function getAllBerita() {
  try {
    const q = query(
      collection(db, BERITA_COLLECTION),
      orderBy("created_at", "desc"),
    );

    const querySnapshot = await getDocs(q);
    const berita = [];

    querySnapshot.forEach((doc) => {
      berita.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return berita;
  } catch (error) {
    console.error("Error getting all berita:", error);
    throw error;
  }
}

// Get all berita with optional filtering and pagination (same as client-side)
export async function getBerita(options = {}) {
  try {
    const {
      kategori = null,
      limit: queryLimit = 50,
      lastDoc = null,
      status = "published",
    } = options;

    let q = collection(db, BERITA_COLLECTION);

    // Build query
    const constraints = [];

    // Filter by status (published/draft)
    if (status) {
      constraints.push(where("status", "==", status));
    }

    // Filter by category
    if (kategori && kategori !== "all") {
      constraints.push(where("kategori", "==", kategori));
    }

    // Order by date (newest first)
    constraints.push(orderBy("tanggal", "desc"));

    // Limit results
    if (queryLimit) {
      constraints.push(limit(queryLimit));
    }

    // Pagination
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    q = query(q, ...constraints);

    const querySnapshot = await getDocs(q);
    const berita = [];

    querySnapshot.forEach((doc) => {
      berita.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return berita;
  } catch (error) {
    console.error("Error getting berita:", error);
    throw error;
  }
}

// Get latest berita for homepage (same as client-side)
export async function getLatestBerita(count = 6) {
  return getBerita({ limit: count, status: "published" });
}

// Get featured berita (same as client-side)
export async function getFeaturedBerita(count = 3) {
  try {
    const q = query(
      collection(db, BERITA_COLLECTION),
      where("status", "==", "published"),
      where("featured", "==", true),
      orderBy("tanggal", "desc"),
      limit(count),
    );

    const querySnapshot = await getDocs(q);
    const berita = [];

    querySnapshot.forEach((doc) => {
      berita.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return berita;
  } catch (error) {
    console.error("Error getting featured berita:", error);
    // Fallback to regular latest berita
    return getBerita({ limit: count });
  }
}

// Get single berita by ID
export async function getBeritaById(id) {
  try {
    const docRef = doc(db, BERITA_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting berita by ID:", error);
    throw error;
  }
}

// Create new berita (same as client-side)
export async function createBerita(beritaData) {
  try {
    const data = {
      ...beritaData,
      tanggal: serverTimestamp(),
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      status: beritaData.status || "published",
    };

    const docRef = await addDoc(collection(db, BERITA_COLLECTION), data);
    return docRef.id;
  } catch (error) {
    console.error("Error creating berita:", error);
    throw error;
  }
}

// Update berita
export async function updateBerita(id, updates) {
  try {
    const docRef = doc(db, BERITA_COLLECTION, id);
    const data = {
      ...updates,
      updated_at: serverTimestamp(),
    };

    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Error updating berita:", error);
    throw error;
  }
}

// Delete berita
export async function deleteBerita(id) {
  try {
    const docRef = doc(db, BERITA_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting berita:", error);
    throw error;
  }
}

// Get stats for dashboard
export async function getBeritaStats() {
  try {
    const q = query(collection(db, BERITA_COLLECTION));
    const querySnapshot = await getDocs(q);

    let totalBerita = 0;
    let publishedBerita = 0;
    let draftBerita = 0;
    let categories = {};

    querySnapshot.forEach((doc) => {
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

// UMKM Collection reference
const UMKM_COLLECTION = "umkm";

/**
 * Get all UMKM with optional filtering
 */
export async function getAllUMKM(options = {}) {
  try {
    const {
      kategori = null,
      limit: queryLimit = 100,
      lastDoc = null,
      status = null,
    } = options;

    let q = collection(db, UMKM_COLLECTION);
    const constraints = [];

    // Filter by status
    if (status && status !== "all") {
      constraints.push(where("status", "==", status));
    }

    // Order by name
    constraints.push(orderBy("nama"));

    // Limit results
    if (queryLimit) {
      constraints.push(limit(queryLimit));
    }

    // Pagination
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    q = query(q, ...constraints);
    const querySnapshot = await getDocs(q);
    const umkm = [];

    querySnapshot.forEach((doc) => {
      umkm.push({
        id: doc.id, // Use the document ID (slug) as the primary ID
        docId: doc.id, // Keep document ID for reference
        ...doc.data(),
      });
    });

    return umkm;
  } catch (error) {
    console.error("Error getting UMKM:", error);
    throw error;
  }
}

/**
 * Get UMKM by ID
 */
export async function getUMKMBySlug(slug) {
  try {
    const docRef = doc(db, UMKM_COLLECTION, slug);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id, // This will be the slug
        docId: docSnap.id, // Keep the document ID separate
        ...docSnap.data(),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting UMKM by slug:", error);
    throw error;
  }
}

/**
 * Create new UMKM
 */
export async function createUMKM(umkmData) {
  try {
    // Generate slug if not provided
    const slug = umkmData.slug || generateSlug(umkmData.nama);

    // Generate a new numeric ID for internal reference (optional)
    const timestamp = Date.now();
    const numericId = parseInt(timestamp.toString().slice(-6)); // Use last 6 digits of timestamp

    const data = {
      ...umkmData,
      id: numericId, // Keep numeric ID for compatibility
      slug,
      status: umkmData.status || "active",
      featured: umkmData.featured || false,
      views: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Use slug as document ID
    const docRef = doc(db, UMKM_COLLECTION, slug);
    await setDoc(docRef, data);

    return slug;
  } catch (error) {
    console.error("Error creating UMKM:", error);
    throw error;
  }
}

/**
 * Update UMKM
 */
export async function updateUMKM(docId, umkmData) {
  try {
    console.log("Updating UMKM with document ID:", docId);

    const docRef = doc(db, UMKM_COLLECTION, docId);

    // Remove any undefined or null values and the docId from the update data
    const { docId: _, ...cleanData } = umkmData;
    const filteredData = Object.fromEntries(
      Object.entries(cleanData).filter(
        ([_, value]) => value !== undefined && value !== null,
      ),
    );

    await updateDoc(docRef, {
      ...filteredData,
      updatedAt: serverTimestamp(),
    });

    console.log("Successfully updated UMKM:", docId);
  } catch (error) {
    console.error("Error updating UMKM:", error);
    console.error("Document ID:", docId);
    throw error;
  }
}

/**
 * Delete UMKM
 */
export async function deleteUMKM(docId) {
  try {
    console.log("Deleting UMKM with document ID:", docId);
    const docRef = doc(db, UMKM_COLLECTION, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting UMKM:", error);
    throw error;
  }
}

/**
 * Get UMKM statistics
 */
export async function getUMKMStats() {
  try {
    const umkmData = await getAllUMKM();

    const stats = {
      totalUMKM: umkmData.length,
      activeUMKM: umkmData.filter((item) => item.status === "active").length,
      inactiveUMKM: umkmData.filter((item) => item.status === "inactive")
        .length,
      featuredUMKM: umkmData.filter((item) => item.featured).length,
    };

    return stats;
  } catch (error) {
    console.error("Error getting UMKM stats:", error);
    throw error;
  }
}

/**
 * Helper function to generate slug
 */
function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
}

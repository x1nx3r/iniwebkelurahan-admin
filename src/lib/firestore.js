// admin-kelurahan/src/lib/firestore.js
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  limit,
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

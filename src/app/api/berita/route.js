// iniwebumkm-admin/src/app/api/berita/route.js
import { NextResponse } from "next/server";
import {
  getAllBerita,
  createBerita,
  getBeritaStats,
} from "@/lib/firestore-admin";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "stats") {
      const stats = await getBeritaStats();
      return NextResponse.json(stats);
    }

    const berita = await getAllBerita();
    return NextResponse.json(berita);
  } catch (error) {
    console.error("Error in GET /api/berita:", error);
    return NextResponse.json(
      { error: "Failed to fetch berita" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const beritaData = await request.json();
    const id = await createBerita(beritaData);
    return NextResponse.json({ id, success: true });
  } catch (error) {
    console.error("Error in POST /api/berita:", error);
    return NextResponse.json(
      { error: "Failed to create berita" },
      { status: 500 },
    );
  }
}

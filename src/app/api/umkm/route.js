// iniwebumkm-admin/src/app/api/umkm/route.js
import { NextResponse } from "next/server";
import { getAllUMKM, createUMKM, getUMKMStats } from "@/lib/firestore-admin";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "stats") {
      const stats = await getUMKMStats();
      return NextResponse.json(stats);
    }

    // Get all UMKM with optional filtering
    const kategori = searchParams.get("kategori");
    const status = searchParams.get("status");
    const limit = searchParams.get("limit");

    const options = {};
    if (kategori) options.kategori = kategori;
    if (status) options.status = status;
    if (limit) options.limit = parseInt(limit);

    const umkm = await getAllUMKM(options);
    return NextResponse.json(umkm);
  } catch (error) {
    console.error("Error in GET /api/umkm:", error);
    return NextResponse.json(
      { error: "Failed to fetch UMKM" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const umkmData = await request.json();
    const slug = await createUMKM(umkmData);
    return NextResponse.json({ slug, success: true });
  } catch (error) {
    console.error("Error in POST /api/umkm:", error);
    return NextResponse.json(
      { error: "Failed to create UMKM" },
      { status: 500 },
    );
  }
}

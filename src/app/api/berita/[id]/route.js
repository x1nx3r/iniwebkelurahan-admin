// iniwebumkm-admin/src/app/api/berita/[id]/route.js
import { NextResponse } from "next/server";
import {
  getBeritaById,
  updateBerita,
  deleteBerita,
} from "@/lib/firestore-admin";

export async function GET(request, { params }) {
  try {
    const berita = await getBeritaById(params.id);
    if (!berita) {
      return NextResponse.json({ error: "Berita not found" }, { status: 404 });
    }
    return NextResponse.json(berita);
  } catch (error) {
    console.error("Error in GET /api/berita/[id]:", error);
    return NextResponse.json(
      { error: "Failed to fetch berita" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const updates = await request.json();
    await updateBerita(params.id, updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in PUT /api/berita/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update berita" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await deleteBerita(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/berita/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete berita" },
      { status: 500 },
    );
  }
}

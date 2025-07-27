import { NextResponse } from "next/server";
import { getUMKMBySlug, updateUMKM, deleteUMKM } from "@/lib/firestore-admin";

// GET /api/umkm/[id]
export async function GET(request, props) {
  const params = await props.params;
  try {
    const umkm = await getUMKMBySlug(params.id);
    if (!umkm) {
      return NextResponse.json({ error: "UMKM not found" }, { status: 404 });
    }
    return NextResponse.json(umkm);
  } catch (error) {
    console.error("Error in GET /api/umkm/[id]:", error);
    return NextResponse.json(
      { error: "Failed to fetch UMKM" },
      { status: 500 },
    );
  }
}

// PUT /api/umkm/[id]
export async function PUT(request, props) {
  const params = await props.params;
  try {
    const updates = await request.json();
    await updateUMKM(params.id, updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in PUT /api/umkm/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update UMKM" },
      { status: 500 },
    );
  }
}

// DELETE /api/umkm/[id]
export async function DELETE(request, props) {
  const params = await props.params;
  try {
    await deleteUMKM(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/umkm/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete UMKM" },
      { status: 500 },
    );
  }
}

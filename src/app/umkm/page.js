// iniwebumkm-admin/src/app/umkm/page.js
"use client";
import { Suspense } from "react";
import UMKMPageContent from "./UMKMPageContent";
import AdminLayout from "@/components/layout/AdminLayout";
import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";

function UMKMPageFallback() {
  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="flex items-center justify-center h-64">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BuildingStorefrontIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function UMKMPage() {
  return (
    <Suspense fallback={<UMKMPageFallback />}>
      <UMKMPageContent />
    </Suspense>
  );
}

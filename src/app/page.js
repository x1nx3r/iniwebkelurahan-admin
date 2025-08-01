"use client";
import { Suspense } from "react";
import DashboardContent from "./DashboardContent";
import AdminLayout from "@/components/layout/AdminLayout";
import { SparklesIcon } from "@heroicons/react/24/outline";

function DashboardFallback() {
  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="flex items-center justify-center h-64">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <SparklesIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardContent />
    </Suspense>
  );
}

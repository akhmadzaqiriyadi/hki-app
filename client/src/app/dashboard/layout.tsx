// src/app/(dashboard)/layout.tsx
"use client"; // Jadikan komponen ini sebagai Client Component

import DashboardSidebar from "@/components/shared/DashboardSidebar";
import DashboardHeader from "@/components/shared/DashboardHeader";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  // Middleware sudah menangani proteksi, jadi tidak perlu logika auth di sini.
  
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr]">
      {/* Sidebar untuk Desktop */}
      <div className="hidden border-r bg-white md:block">
        <DashboardSidebar />
      </div>

      {/* Konten Utama (Header + Halaman) */}
      <div className="flex flex-col">
        <DashboardHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}
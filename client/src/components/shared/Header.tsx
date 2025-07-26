// src/components/shared/Header.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  // Fungsi-fungsi ini nanti akan dihubungkan dengan navigasi
  const handleLogin = () => console.log("Navigasi ke halaman login");
  const handleRegister = () => console.log("Navigasi ke halaman register");

  return (
    <header className="sticky top-0 z-50 px-4 lg:px-28 h-16 flex items-center backdrop-blur-md bg-white/90 border-b border-slate-200/60 shadow-sm">
      <Link href="/" className="flex items-center gap-x-2">
        {/* Anda bisa menambahkan logo di sini nanti */}
        <span className="font-bold text-xl bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent">
          Portal UTY HKI
        </span>
      </Link>

      <nav className="ml-auto hidden md:flex items-center gap-4">
        <Link
          href="/#fitur"
          className="text-sm font-medium text-slate-600 hover:text-blue-800 transition-colors"
        >
          Fitur
        </Link>
        <Link
          href="/#alur"
          className="text-sm font-medium text-slate-600 hover:text-blue-800 transition-colors"
        >
          Alur Pendaftaran
        </Link>
        <Button variant="ghost" onClick={handleLogin}>
          Masuk
        </Button>
        <Button
          className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          onClick={handleRegister}
        >
          Daftar Sekarang
        </Button>
      </nav>
      {/* Tombol menu mobile akan kita tambahkan di iterasi berikutnya */}
    </header>
  );
}
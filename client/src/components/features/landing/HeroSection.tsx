// src/components/features/landing/HeroSection.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HeroSection() {
  const router = useRouter();
  const handleRegister = () => router.push('/register');

  return (
    <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden bg-white">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-800/10 rounded-full mix-blend-multiply filter blur-2xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-900/10 rounded-full mix-blend-multiply filter blur-2xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative container px-4 md:px-6 mx-auto">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="flex flex-col justify-center space-y-8">
            <div className="flex items-center gap-2 text-sm text-blue-800 bg-blue-50 rounded-full px-4 py-2 w-fit border border-blue-200/60">
              <CheckCircle className="h-4 w-4 text-blue-700" />
              Platform Resmi Universitas Teknologi Yogyakarta
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Portal{" "}
                <span className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                  HKI UTY
                </span>{" "}
                Creative Hub
              </h1>
              <p className="max-w-[600px] text-lg md:text-xl text-slate-600 leading-relaxed">
                Platform terintegrasi untuk pendaftaran Hak Kekayaan Intelektual bagi mahasiswa, dosen, dan masyarakat umum.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 h-14 px-8"
                onClick={handleRegister}
              >
                Mulai Pendaftaran
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="hidden lg:block relative mx-4">
             {/* Placeholder untuk gambar, bisa ditambahkan nanti */}
            <div className="relative bg-gradient-to-br from-slate-100 to-blue-100 rounded-3xl p-8 shadow-2xl">
              <div className="aspect-square bg-white rounded-2xl shadow-inner flex items-center justify-center">
                 <p className="text-slate-400">Illustrasi Halaman Depan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
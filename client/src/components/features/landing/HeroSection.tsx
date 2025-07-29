import React from 'react';
import { ArrowRight, CheckCircle, GraduationCap} from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';

type HeaderProps = {
  onRegister: () => void;
};

export default function HeroSection({ onRegister }: HeaderProps) {
  return (
    <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-800/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-900/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-slate-800/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative container px-4 md:px-6 mx-auto">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="flex flex-col justify-center space-y-8">
            {/* Trust badge */}
            <div className="flex items-center gap-2 text-sm text-blue-800 bg-blue-50 backdrop-blur-sm rounded-full px-4 py-2 -mt-8 w-fit border border-blue-200/60">
              <CheckCircle className="h-4 w-4 text-blue-700" />
              Dipercaya civitas akademika UTY
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
                Platform resmi Universitas Teknologi Yogyakarta untuk pendaftaran Hak Kekayaan Intelektual. 
                Khusus untuk mahasiswa, dosen, dan masyarakat umum dengan proses yang mudah dan terintegrasi.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                className="flex flex-row items-center justify-center bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                onClick={onRegister}
              >
                Mulai Pendaftaran HKI
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link href="https://drive.google.com/file/d/1v7G20iSnZ8BVJYy42lZMKdQU3jHFI9x0/view?usp=sharing" className="flex items-center justify-center" target="_blank" rel="noopener noreferrer">
                <button className="border-2 border-blue-800 hover:border-blue-700 text-blue-800 hover:text-blue-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:bg-blue-50">
                  Panduan Lengkap
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-200/60">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900">500+</div>
                <div className="text-sm text-slate-600">HKI Terdaftar</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900">98%</div>
                <div className="text-sm text-slate-600">Tingkat Approval</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900">UTY</div>
                <div className="text-sm text-slate-600">Creative Hub</div>
              </div>
            </div>
          </div>

          {/* Enhanced Hero Image */}
          <div className="relative mx-4">
            <div className="relative bg-gradient-to-br from-blue-300 to-blue-400 rounded-3xl p-8 shadow-2xl">
              <div className="aspect-square bg-gradient-to-br from-blue-300 to-blue-200 rounded-2xl shadow-inner flex items-center justify-center">
                <Image
                  src="/Hero.svg"
                  alt="Hero Image"
                  width={400}
                  height={400}
                  className="rounded-2xl object-cover"
                />
              </div>
            </div>
            {/* Floating cards */}
            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-blue-200/60">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-semibold text-blue-800">Aktif 24/7</span>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-blue-200/60">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-blue-800" />
                <span className="text-sm font-medium text-blue-800">Civitas UTY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
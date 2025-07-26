// src/components/features/landing/CTASection.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function CTASection() {
  const router = useRouter();
  const handleRegister = () => router.push('/register');
  
  const whatsAppLink = `https://wa.me/6288238644750`;

  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-r from-blue-900 via-blue-800 to-slate-800">
      <div className="container px-4 md:px-6 mx-auto text-center">
        <div className="space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Siap Daftarkan Karya Anda?
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-blue-100">
            Lindungi karya intelektual Anda sekarang. Klik tombol di bawah untuk memulai atau hubungi kami jika Anda memiliki pertanyaan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-blue-900 hover:bg-blue-50 font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 h-14 px-8"
              onClick={handleRegister}
            >
              Mulai Pendaftaran
            </Button>
            <a 
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-900 font-semibold text-lg transition-all duration-200 h-14 px-8 w-full"
              >
                Hubungi via WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
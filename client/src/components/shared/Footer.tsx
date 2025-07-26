// src/components/shared/Footer.tsx
import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="container px-4 md:px-6 mx-auto py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h2 className="font-bold text-xl text-slate-900">Portal UTY HKI</h2>
            <p className="text-slate-600">
              Platform resmi Universitas Teknologi Yogyakarta untuk pendaftaran Hak Kekayaan Intelektual.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Layanan</h3>
            <ul className="space-y-2 text-slate-600">
              <li><Link href="/hakcipta" className="hover:text-blue-800 transition-colors">Hak Cipta</Link></li>
              <li><p className="text-slate-400">Paten (Segera Hadir)</p></li>
              <li><p className="text-slate-400">Desain Industri (Segera Hadir)</p></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Kontak</h3>
            <ul className="space-y-2 text-slate-600">
                <li><p>UTY Creative Hub</p></li>
                <li><p>sentrahki@uty.ac.id</p></li>
                <li><p>+62 882-3864-4750</p></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 mt-12 pt-8 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} UTY Creative Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
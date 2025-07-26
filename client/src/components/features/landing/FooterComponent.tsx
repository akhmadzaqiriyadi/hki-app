import React from 'react';
import { GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="container px-4 md:px-6 mx-auto py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900 to-blue-800">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="ml-3 font-bold text-xl text-slate-900">UTY HKI Portal</span>
            </div>
            <p className="text-slate-600">
              Platform resmi Universitas Teknologi Yogyakarta untuk pendaftaran Hak Kekayaan Intelektual melalui Creative Hub.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Layanan HKI</h3>
            <ul className="space-y-2 text-slate-600">
              <li><a href="#" className="hover:text-blue-800 transition-colors">Hak Cipta</a></li>
              <li><a href="#" className="hover:text-blue-800 transition-colors">Paten (coming soon)</a></li>
              <li><a href="#" className="hover:text-blue-800 transition-colors">Merek Dagang (coming soon)</a></li>
              <li><a href="#" className="hover:text-blue-800 transition-colors">Desain Industri (coming soon)</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">UTY Creative Hub</h3>
            <ul className="space-y-2 text-slate-600">
              <li><a href="#" className="hover:text-blue-800 transition-colors">Tentang Creative Hub</a></li>
              <li><a href="#" className="hover:text-blue-800 transition-colors">Tim</a></li>
              <li><a href="#" className="hover:text-blue-800 transition-colors">Program</a></li>
              <li><a href="#" className="hover:text-blue-800 transition-colors">Kontak</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} UTY Creative Hub. Universitas Teknologi Yogyakarta.
          </p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="text-sm text-slate-500 hover:text-blue-800 transition-colors">
              Ketentuan Layanan
            </a>
            <a href="#" className="text-sm text-slate-500 hover:text-blue-800 transition-colors">
              Kebijakan Privasi
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
// src/components/features/landing/FeaturesSection.tsx
import React from 'react';
import { FileText, BarChart, ShieldCheck, Clock, Users, GraduationCap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const features = [
    {
      icon: FileText,
      title: "Formulir Digital Terpadu",
      description: "Isi data HKI dengan mudah melalui formulir online yang tervalidasi secara otomatis.",
    },
    {
      icon: BarChart,
      title: "Lacak Status Real-time",
      description: "Pantau progres pendaftaran Anda dari tahap pengajuan hingga sertifikat terbit.",
    },
    {
      icon: ShieldCheck,
      title: "Verifikasi Bertahap",
      description: "Sistem review oleh admin untuk memastikan kelengkapan dan kebenaran dokumen.",
    },
    {
      icon: Clock,
      title: "Proses Efisien",
      description: "Alur kerja yang jelas dan disederhanakan untuk mempercepat proses pendaftaran HKI Anda.",
    },
    {
      icon: Users,
      title: "Dukungan Penuh",
      description: "Dapatkan bantuan teknis dan konsultasi dari tim Creative Hub UTY selama proses pendaftaran.",
    },
    {
      icon: GraduationCap,
      title: "Untuk Semua Kalangan",
      description: "Terbuka untuk mahasiswa, dosen, civitas akademika UTY, serta masyarakat umum.",
    }
];

export default function FeaturesSection() {
  return (
    <section id="fitur" className="w-full py-16 md:py-24 bg-slate-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Kenapa Menggunakan{" "}
            <span className="bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent">
              Portal HKI UTY?
            </span>
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-slate-600 leading-relaxed">
            Kami menyediakan platform terintegrasi yang dirancang untuk membuat proses pendaftaran HKI lebih mudah, cepat, dan transparan.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group bg-white rounded-2xl px-4 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-blue-200 hover:-translate-y-2">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-700 to-blue-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
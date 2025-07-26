import React from 'react';
import { FileText, BarChart, ShieldCheck, Clock, Users, Award, GraduationCap } from "lucide-react";
import FeatureCard from './FeatureCard';

export default function FeaturesSection() {
  const features = [
    {
      icon: FileText,
      title: "Formulir Digital Terintegrasi",
      description: "Sistem formulir online yang memudahkan pengisian data HKI dengan validasi otomatis dan panduan lengkap.",
      color: "from-blue-700 to-blue-800"
    },
    {
      icon: BarChart,
      title: "Tracking Status Real-time",
      description: "Pantau progress pendaftaran HKI Anda dari tahap administratif hingga persetujuan final dengan notifikasi otomatis.",
      color: "from-blue-700 to-blue-800"
    },
    {
      icon: ShieldCheck,
      title: "Verifikasi Bertahap",
      description: "Sistem review dua tahap oleh admin untuk memastikan kelengkapan substansi, administratif, dan dokumen pendukung.",
      color: "from-blue-700 to-blue-800"
    },
    {
      icon: Clock,
      title: "Proses Efisien",
      description: "Workflow yang disederhanakan mulai dari upload dokumen, review, hingga finalisasi dengan timeline yang jelas.",
      color: "from-blue-700 to-blue-800"
    },
    {
      icon: Users,
      title: "Dukungan UTY Creative Hub",
      description: "Bantuan penuh dari tim Creative Hub UTY untuk bimbingan teknis dan konsultasi selama proses pendaftaran.",
      color: "from-blue-700 to-blue-800"
    },
    {
      icon: GraduationCap,
      title: "Fleksibilitas Civitas Akademika",
      description: "Diperuntukkan untuk mahasiswa, dosen UTY, dan masyarakat umum dengan prosedur yang disesuaikan kebutuhan akademik.",
      color: "from-blue-700 to-blue-800"
    }
  ];

  return (
    <section id="fitur" className="w-full py-16 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
            <Award className="h-4 w-4" />
            Fitur Unggulan
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Mengapa Memilih{" "}
            <span className="bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent">
              UTY HKI Portal?
            </span>
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-slate-600 leading-relaxed">
            Platform terintegrasi yang memudahkan civitas akademika UTY dan masyarakat umum dalam proses pendaftaran HKI dengan dukungan penuh dari Creative Hub.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
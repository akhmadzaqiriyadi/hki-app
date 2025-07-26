import React from 'react';
import ProcessStep from './ProcessStepComponent';

export default function ProcessSection() {
  const processSteps = [
    {
      step: "01",
      title: "Login & Registrasi",
      description: "Akses portal menggunakan email dan lengkapi profil Anda sebagai civitas UTY atau masyarakat umum."
    },
    {
      step: "02", 
      title: "Upload Dokumen",
      description: "Lengkapi formulir HKI dan upload dokumen: KTP, contoh karya, materai, dan bukti pembayaran."
    },
    {
      step: "03",
      title: "Review Tahap 1",
      description: "Admin melakukan verifikasi substansi dan administratif. Notifikasi dikirim jika ada revisi."
    },
    {
      step: "04",
      title: "Finalisasi & Approval",
      description: "Upload surat pernyataan untuk review tahap 2. Status berubah menjadi disetujui setelah lengkap."
    }
  ];

  return (
    <section className="w-full py-16 md:py-24 bg-slate-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Alur Pendaftaran{" "}
            <span className="bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent">
              HKI
            </span>
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-slate-600 leading-relaxed">
            Proses pendaftaran HKI yang mudah dan terintegrasi dengan sistem review bertahap untuk memastikan kualitas pengajuan.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((process, index) => (
            <ProcessStep
              key={index}
              step={process.step}
              title={process.title}
              description={process.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
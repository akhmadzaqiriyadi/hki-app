"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  FileText,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/features/landing/HeaderComponent";
import { useRouter } from "next/navigation";
import Footer from "@/components/features/landing/FooterComponent";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Import the copyrightCategories from the master file
import { copyrightCategories } from "@/lib/master/copyrightCategories";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

const HakCiptaPage = () => {
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [activePdfPath, setActivePdfPath] = useState<string | null>(null);
  const [isObjectSectionVisible, setIsObjectSectionVisible] = useState(true);
  const router = useRouter();

  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const [pdfWidth, setPdfWidth] = useState(0);
  const [numPages, setNumPages] = useState<number | null>(null);

  useEffect(() => {
    const container = pdfContainerRef.current;

    if (showPdfViewer && container) {
      const observer = new ResizeObserver(() => {
        setPdfWidth(container.clientWidth);
      });
      observer.observe(container);

      return () => {
        observer.disconnect();
      };
    }
  }, [showPdfViewer]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const handleRegister = () => {
    router.push("/register");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  // Administrative steps data updated with KTP guide link
  const adminSteps = [
    {
      title: "Kartu Tanda Penduduk (KTP)",
      description:
        "Lampirkan salinan KTP pemohon dan pencipta. Untuk keamanan, kami sarankan untuk menambahkan watermark. Himpun semua KTP dalam satu file PDF.",
      hasDownload: false,
      guideLink:
        "https://drive.google.com/file/d/1mLO8mjlEPyCpUZhWHdBnb0sm3pld0-pg/view?usp=sharing",
      guideText: "Panduan Watermark KTP",
    },
    {
      title: "Surat Pernyataan Pencatatan Hak Cipta",
      description:
        "Isi template surat pernyataan, bubuhkan meterai Rp. 10.000, lalu scan dan simpan dalam format PDF.",
      hasDownload: false, // Will be handled by the helper documents section
    },
    {
      title: "Surat Pengalihan Hak Cipta (jika diperlukan)",
      description:
        "Diisi jika nama pencipta dan pemegang hak cipta berbeda. Tanda tangan tidak dapat diwakilkan. Scan dan simpan dalam format PDF.",
      hasDownload: false, // Will be handled by the helper documents section
    },
    {
      title: "Lampiran Karya Ciptaan",
      description:
        "Sertakan soft file dari karya yang akan dicatatkan. Cermati daftar di bawah untuk melihat jenis file yang sesuai.",
      hasDownload: false,
      hasPdfViewer: true,
    },
  ];

  const feeStructure = [
    {
      category: "Lembaga Pendidikan",
      nonSoftware: "Rp. 225.000",
      software: "Rp. 325.000",
      unit: "Per Permohonan",
    },
    {
      category: "Umum",
      nonSoftware: "Rp. 450.000",
      software: "Rp. 650.000",
      unit: "Per Permohonan",
    },
  ];

  const handlePdfView = (pdfName: string) => {
    setActivePdfPath(`/hakcipta/${pdfName}.pdf`);
    setShowPdfViewer(true);
  };

  const closePdfViewer = () => {
    setShowPdfViewer(false);
    setActivePdfPath(null);
    setNumPages(null);
  };

  const toggleObjectSection = () => {
    setIsObjectSectionVisible(!isObjectSectionVisible);
  };

  return (
    <>
      <Header onLogin={handleLogin} onRegister={handleRegister} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          {/* Introduction */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8 mb-4 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-800" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  Pendaftaran Hak Cipta
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-4xl">
                  Berikut dijabarkan tahapan dan berkas administrasi untuk
                  pencatatan hak cipta.
                </p>
              </div>
            </div>
          </div>

          {/* Section A: Objek Perlindungan */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg mb-4 sm:mb-8">
            <div className="p-4 sm:p-8 pb-3 sm:pb-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-800 text-white rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-base">
                    A
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-slate-900 leading-tight">
                    MENENTUKAN OBJEK PERLINDUNGAN HAK CIPTA
                  </h3>
                </div>
                <button
                  onClick={toggleObjectSection}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <span className="text-xs sm:text-sm font-medium hidden sm:inline">
                    {isObjectSectionVisible ? "Sembunyikan" : "Tampilkan"}
                  </span>
                  {isObjectSectionVisible ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            {isObjectSectionVisible && (
              <div className="px-4 sm:px-8 pb-4 sm:pb-8">
                <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8 leading-relaxed">
                  Penentuan objek jenis ciptaan dapat mempermudah pencipta dalam
                  pengisian dokumen pengajuan. Pilih objek jenis karya lalu
                  sesuaikan dengan subjenisnya. Dilarang memberi nama sendiri.
                  Cermat daftar di bawah untuk melihat objek jenis dan subjenis
                  ciptaan yang dapat dilindungi.
                </p>
                <Tabs defaultValue="KARYA_TULIS" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 h-auto p-1 bg-slate-100 gap-1">
                    {Object.entries(copyrightCategories).map(([key, data]) => {
                      const IconComponent = data.icon;
                      return (
                        <TabsTrigger
                          key={key}
                          value={key}
                          className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md"
                        >
                          <IconComponent className="h-4 w-4" />
                          <span className="text-center leading-tight hidden md:inline">
                            {data.label}
                          </span>
                          <span className="text-center leading-tight md:hidden">
                            {data.shortLabel}
                          </span>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                  {Object.entries(copyrightCategories).map(([key, data]) => (
                    <TabsContent key={key} value={key} className="mt-4 sm:mt-6">
                      <div className="bg-slate-50 rounded-xl p-4 sm:p-6">
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                          <div
                            className={`w-6 h-6 sm:w-8 sm:h-8 ${data.color} rounded-lg flex items-center justify-center`}
                          >
                            <data.icon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          </div>
                          <h4 className="text-sm sm:text-base font-semibold text-slate-900">
                            {data.label} - Sub Jenis
                          </h4>
                        </div>
                        {data.subCategories.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                            {data.subCategories.map((subCategory, index) => (
                              <div
                                key={index}
                                className="bg-white rounded-lg p-2 sm:p-3 border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
                              >
                                <span className="text-slate-700 text-xs sm:text-sm font-medium">
                                  {index + 1}. {subCategory}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-white rounded-lg p-4 sm:p-6 border border-slate-200">
                            <p className="text-slate-500 italic text-center text-sm sm:text-base">
                              Tidak ada sub kategori untuk kategori ini.
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
                <div className="mt-4 sm:mt-6 text-center">
                  <p className="text-xs sm:text-sm text-slate-500">
                    sumber: e-hakcipta.dgip.go.id
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section B: Berkas Administrasi */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8 mb-4 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-800 text-white rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-base">
                B
              </div>
              <h3 className="text-base sm:text-xl font-bold text-slate-900">
                BERKAS ADMINISTRASI
              </h3>
            </div>
            <div className="space-y-4 sm:space-y-6">
              {adminSteps.map((step, index) => (
                <div
                  key={index}
                  className="border-l-4 border-blue-200 pl-4 sm:pl-6 pb-4 sm:pb-6 last:pb-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm sm:text-base font-semibold text-slate-900 mb-2">
                        {index + 1}. {step.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                        {step.description}
                      </p>
                      {step.guideLink && (
                        <a
                          href={step.guideLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 underline text-xs sm:text-sm font-medium"
                        >
                          {step.guideText}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {step.hasPdfViewer && (
                        <div className="mt-4">
                          <button
                            onClick={() => handlePdfView("copyright-works")}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm"
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">
                              Lihat Daftar Karya Ciptaan
                            </span>
                            <span className="sm:hidden">Lihat Daftar</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Helper Documents Section */}
            <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/50 rounded-lg sm:rounded-xl border border-blue-200/50">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
                <Download className="h-4 w-4" />
                Dokumen Pendukung
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-xs sm:text-sm text-blue-700">
                  <p className="font-medium mb-1">
                    📄 Surat Pernyataan Hak Cipta:
                  </p>
                  <div className="pl-3 space-y-1">
                    <div>
                      <a
                        href="https://docs.google.com/document/d/1ITJ1x1-GkMzKBir93K8sGEw1ZIiN1exF/edit?usp=sharing&ouid=113467600800970467072&rtpof=true&sd=true"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                      >
                        Template <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <div>
                      <a
                        href="https://drive.google.com/file/d/1E6Rkh9Sfb-tS27a9WktLcboIi4ZEPcYh/view?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 underline flex items-center gap-1"
                      >
                        Contoh <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-blue-700 pt-2 md:pt-0 md:border-l border-blue-200/50 md:pl-4">
                  <p className="font-medium mb-1">📄 Surat Pengalihan Hak:</p>
                  <div className="pl-3 space-y-1">
                    <div>
                      <a
                        href="https://docs.google.com/document/d/1WrA-AbbXnSJoGHTXwkzZoFf4NzSCERue/edit?usp=sharing&ouid=113467600800970467072&rtpof=true&sd=true"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                      >
                        Template <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <div>
                      <a
                        href="https://drive.google.com/file/d/14W_7HJNnXe2q44AQG1_jouAW8Yn_jcrm/view?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 underline flex items-center gap-1"
                      >
                        Contoh <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              {/* --- NEW CONTENT ADDED HERE --- */}
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-green-900">
                      Tanda Tangan Rektor
                    </h5>
                    <p className="text-xs text-green-800 mt-1 leading-relaxed">
                      Untuk mendapatkan tanda tangan Rektor, silakan kirimkan
                      berkas fisik (hardfile) Surat Pengalihan Hak ke{" "}
                      <strong>Sekretariat Sentra HKI UCH</strong> di Kampus 1
                      UTY (Lokasi: Depan Ruang Kelas E02).
                    </p>
                  </div>
                </div>
              </div>
              {/* --- END OF NEW CONTENT --- */}
            </div>

            <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-amber-800">
                    <strong>Penting:</strong> Pastikan data pada formulir sama
                    persis dengan data pada surat pernyataan dan pengalihan.
                    Kesalahan data akan berpengaruh pada sertifikat. Hubungi{" "}
                    <strong>sentrahki@uty.ac.id</strong> atau{" "}
                    <strong>+62 882-3864-4750</strong> untuk bantuan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section C: Biaya Pencatatan */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8 mb-4 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-800 text-white rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-base">
                C
              </div>
              <h3 className="text-base sm:text-xl font-bold text-slate-900">
                BIAYA & PEMBAYARAN
              </h3>
            </div>

            <div className="text-xs sm:text-sm text-slate-600 mb-4 sm:mb-6 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p>
                  Untuk mewujudkan inovasi Anda menjadi aset yang terlindungi,
                  Sentra HKI UTY menyediakan skema biaya yang terjangkau.
                  Silakan cermati rincian biaya pada tabel di samping sesuai
                  kategori Anda.
                </p>
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="font-semibold text-blue-900 mb-2">
                    Informasi Pembayaran
                  </p>
                  <p className="text-blue-800">
                    Setelah melengkapi berkas, silakan lakukan pembayaran ke
                     Nomor berikut:
                  </p>
                  <div className="mt-2 space-y-1 text-slate-800 font-mono">
                    <p>
                      <span className="font-sans font-medium text-slate-600">
                        E-Wallet:
                      </span>{" "}
                      DANA
                    </p>
                    <p>
                      <span className="font-sans font-medium text-slate-600">
                        No:
                      </span>{" "}
                      082336623249
                    </p>
                    <p>
                      <span className="font-sans font-medium text-slate-600">
                      Atas Nama:
                      </span>{" "}
                      SINDHI KHARISMA
                    </p>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300 text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-300 px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-slate-900">
                        KATEGORI
                      </th>
                      <th className="border border-slate-300 px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-slate-900">
                        NON-SOFTWARE
                      </th>
                      <th className="border border-slate-300 px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-slate-900">
                        SOFTWARE
                      </th>
                      <th className="border border-slate-300 px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-slate-900">
                        SATUAN
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {feeStructure.map((fee, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                      >
                        <td className="border border-slate-300 px-2 sm:px-4 py-2 sm:py-3 font-medium text-slate-900">
                          {fee.category}
                        </td>
                        <td className="border border-slate-300 px-2 sm:px-4 py-2 sm:py-3 text-slate-700">
                          {fee.nonSoftware}
                        </td>
                        <td className="border border-slate-300 px-2 sm:px-4 py-2 sm:py-3 text-slate-700">
                          {fee.software}
                        </td>
                        <td className="border border-slate-300 px-2 sm:px-4 py-2 sm:py-3 text-slate-700">
                          {fee.unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* PDF Viewer Modal */}
        {showPdfViewer && activePdfPath && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-2 sm:p-4">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl h-full sm:h-5/6 flex flex-col">
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200">
                <h3 className="text-sm sm:text-xl font-bold text-slate-900 leading-tight">
                  Daftar Karya Ciptaan yang Dapat Dicatatkan
                </h3>
                <button
                  onClick={closePdfViewer}
                  className="text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              <div
                ref={pdfContainerRef}
                className="flex-1 p-4 sm:p-6 overflow-auto bg-slate-100"
              >
                <Document
                  file={activePdfPath}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={(error) =>
                    console.error("Error loading PDF:", error.message)
                  }
                  loading={
                    <div className="text-center text-slate-600">
                      Memuat PDF...
                    </div>
                  }
                  error={
                    <div className="text-center text-red-600">
                      Gagal memuat PDF. Pastikan file tersedia di path:{" "}
                      {activePdfPath}
                    </div>
                  }
                >
                  {pdfWidth > 0 &&
                    Array.from(new Array(numPages || 0), (el, index) => (
                      <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        width={pdfWidth}
                        className="mb-4 shadow-md"
                      />
                    ))}
                </Document>
              </div>

              <div className="p-4 sm:p-6 border-t border-slate-200 flex justify-between items-center">
                <p className="text-sm text-slate-600">
                  Total Halaman: {numPages || "..."}
                </p>
                <div className="flex justify-end gap-2 sm:gap-4">
                  <button
                    onClick={closePdfViewer}
                    className="px-3 sm:px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors text-sm"
                  >
                    Tutup
                  </button>
                  <a
                    href={activePdfPath}
                    download
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                    Unduh PDF
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        <Footer />
      </div>
    </>
  );
};

export default HakCiptaPage;

"use client";

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useGetRegistrationById } from '@/queries/queries/useGetRegistrationById';
import { useDownloadFile } from '@/queries/mutations/useDownloadFile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  AlertCircle, 
  Edit, 
  FileText, 
  Download, 
  User, 
  UploadCloud,
  GraduationCap,
  CheckCircle,
  Clock,
  ArrowLeft
} from 'lucide-react';
import PaymentUploadForm from '@/components/features/pendaftaran/PaymentUploadForm';
import { Pendaftaran, Pencipta, StatusPendaftaran } from '@/lib/types';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { FinalizeButton } from '@/components/features/pendaftaran/FinalizeButton';

const getStatusVariant = (status: StatusPendaftaran) => {
    const variants: Record<string, "success" | "info" | "destructive" | "warning" | "secondary"> = {
        approved: "success", granted: "success", submitted_to_djki: "info",
        revisi: "destructive", submitted: "warning", review: "warning",
        draft: "secondary", rejected: "destructive", diproses_hki: "info",
    };
    return variants[status] || "secondary";
};

const getStatusLabel = (status: StatusPendaftaran) => {
    const labels: Record<string, string> = {
        draft: 'Draft', submitted: 'Submitted', review: 'Reviewed', revisi: 'Revised',
        approved: 'Approved', submitted_to_djki: 'Submitted to DJKI', granted: 'Granted',
        rejected: 'Rejected', diproses_hki: 'Submitted to DJKI'
    };
    return labels[status] || status;
};

const getStatusIcon = (status: StatusPendaftaran) => {
  switch (status) {
    case "approved":
    case "granted":
      return CheckCircle;
    case "revisi":
    case "rejected":
      return AlertCircle;
    case "submitted":
    case "review":
    case "submitted_to_djki":
    case "diproses_hki":
      return Clock;
    default:
      return Clock;
  }
};

// Helper untuk menampilkan item detail agar rapi
function DetailItem({ label, value }: { label: string; value: string | null | undefined }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 py-3 border-b border-blue-100/50 last:border-b-0">
      <dt className="text-sm font-medium text-slate-600">{label}</dt>
      <dd className="text-sm col-span-2 font-semibold break-words text-slate-800">{value}</dd>
    </div>
  );
}

// Helper untuk menampilkan link file yang aman
function FilePreviewLink({ url, label }: { url?: string | null; label: string }) {
  const downloadMutation = useDownloadFile();

  if (!url) {
    return (
      <div className="p-4 border border-slate-200 rounded-xl text-center bg-gradient-to-br from-slate-50/50 to-slate-100/30">
        <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
          <FileText className="h-6 w-6 text-slate-500" />
        </div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-xs text-slate-500">Tidak ada file.</p>
      </div>
    );
  }

  const filename = url.split('/').pop();
  const protectedUrl = `/api/pendaftaran/file/${filename}`;

  const handleDownload = () => {
    downloadMutation.mutate(protectedUrl);
  };

  return (
    <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        <div className="border border-blue-200/50 rounded-xl p-3 flex items-center justify-between bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center shadow-md">
                  <FileText className="h-5 w-5 text-blue-700" />
                </div>
                <span className="text-sm truncate font-mono text-slate-700" title={filename}>
                    {filename}
                </span>
            </div>
            <Button 
              onClick={handleDownload} 
              variant="outline" 
              size="sm" 
              disabled={downloadMutation.isPending}
              className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md transition-all duration-200 hover:scale-105"
            >
                {downloadMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Lihat
            </Button>
        </div>
    </div>
  );
}

export default function DetailPendaftaranPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: pendaftaran, isLoading, isError, error } = useGetRegistrationById(id);

  if (isLoading) {
    return (
      <div className="relative min-h-screen">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 -right-20 w-96 h-96 bg-blue-800/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-40 -left-20 w-80 h-80 bg-blue-900/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="relative text-center p-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
          </div>
          <p className="text-slate-600 font-medium">Memuat detail pendaftaran...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="relative min-h-screen">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 -right-20 w-96 h-96 bg-blue-800/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-40 -left-20 w-80 h-80 bg-blue-900/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="relative text-center p-8">
          <Card className="border-red-200/50 bg-gradient-to-br from-red-50/80 to-white backdrop-blur-sm shadow-xl max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <AlertCircle className="h-8 w-8 text-red-700" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Terjadi Kesalahan</h3>
              <p className="text-slate-600">{error.message}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!pendaftaran) {
    return (
      <div className="relative min-h-screen">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 -right-20 w-96 h-96 bg-blue-800/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-40 -left-20 w-80 h-80 bg-blue-900/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="relative text-center p-8">
          <Card className="border-amber-200/50 bg-gradient-to-br from-amber-50/80 to-white backdrop-blur-sm shadow-xl max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FileText className="h-8 w-8 text-amber-700" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Data Tidak Ditemukan</h3>
              <p className="text-slate-600">Data pendaftaran tidak ditemukan.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background decorations matching sidebar */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -right-20 w-96 h-96 bg-blue-800/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 -left-20 w-80 h-80 bg-blue-900/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-slate-800/3 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative space-y-6">
        {/* Navigation */}
        <div className="mb-4">
          <Button 
            asChild
            variant="ghost" 
            className="hover:bg-blue-50 hover:shadow-md transition-all duration-200"
          >
            <Link href="/dashboard/pendaftaran" className="flex items-center gap-2 text-xl">
              <ArrowLeft style={{ width: '24px', height: '24px' }} />
              Kembali ke Daftar Pendaftaran
            </Link>
          </Button>
        </div>

        {/* Header Section */}
        <div className="relative">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Icon hanya muncul dari sm (tablet) ke atas */}
              <div className="hidden sm:flex w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl sm:rounded-2xl items-center justify-center shadow-xl">
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                  {pendaftaran.judul}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-mono">ID: {pendaftaran.id}</p>
              </div>
            </div>
            
            {pendaftaran.status === 'draft' ? (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <Button 
                      asChild 
                      variant="outline"
                      className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md transition-all duration-200 hover:scale-105"
                    >
                        <Link href={`/dashboard/pendaftaran/edit/${pendaftaran.id}`}>
                          <Edit className="mr-2 h-4 w-4" /> 
                          Lanjutkan Edit
                        </Link>
                    </Button>
                    <FinalizeButton pendaftaranId={pendaftaran.id} />
                </div>
            ) : (
                <Badge 
                  variant={getStatusVariant(pendaftaran.status)} 
                  className="gap-1 px-4 py-2 font-semibold text-base"
                >
                    {React.createElement(getStatusIcon(pendaftaran.status), { className: "h-4 w-4" })}
                    {getStatusLabel(pendaftaran.status)}
                </Badge>
            )}
          </div>
        </div>
        
        {pendaftaran.status === 'revisi' && (
          <Card className="border-red-200/50 bg-gradient-to-br from-red-50/80 to-white backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Perlu Perbaikan
              </CardTitle>
              <CardDescription className="text-red-700">
                  Admin memberikan catatan revisi. Silakan perbaiki dan kirim ulang.
                  <br/>
                  <strong className="block mt-2 whitespace-pre-wrap">Catatan: {pendaftaran.catatan_revisi || "Tidak ada catatan."}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                asChild
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Link href={`/dashboard/pendaftaran/edit/${pendaftaran.id}`}>
                  <Edit className="mr-2 h-4 w-4" /> 
                  Perbaiki Pendaftaran
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {pendaftaran.status === 'approved' && (
          <div className="space-y-4">
            <PaymentUploadForm 
              pendaftaranId={pendaftaran.id} 
              jenisPemilik={pendaftaran.jenis_pemilik || 'Umum'} 
              jenisKarya={pendaftaran.jenis_karya || 'KARYA_TULIS'} 
            />
          </div>
        )}

        {pendaftaran.status === 'granted' && pendaftaran.sertifikat_hki_url && (
           <Card className="border-green-200/50 bg-gradient-to-br from-green-50/80 to-white backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Sertifikat Tersedia
              </CardTitle>
               <CardDescription className="text-green-700 font-medium">
                 Selamat! Sertifikat HKI Anda telah terbit.
               </CardDescription>
            </CardHeader>
            <CardContent>
               <FilePreviewLink url={pendaftaran.sertifikat_hki_url} label="File Sertifikat HKI"/>
            </CardContent>
          </Card>
        )}

        {/* --- DETAIL KARYA --- */}
        <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-700" />
              </div>
              Informasi Karya
            </CardTitle>
          </CardHeader>
          <CardContent>
              <dl>
                  <DetailItem label="Jenis Pemilik" value={pendaftaran.jenis_pemilik} />
                  <DetailItem label="Produk Hasil" value={pendaftaran.produk_hasil} />
                  <DetailItem label="Jenis Karya" value={pendaftaran.jenis_karya} />
                  <DetailItem label="Sub-Jenis Karya" value={pendaftaran.sub_jenis_karya} />
                  <DetailItem label="Kota Diumumkan" value={pendaftaran.kota_diumumkan} />
                  <DetailItem label="Tanggal Diumumkan" value={pendaftaran.tanggal_diumumkan ? format(new Date(pendaftaran.tanggal_diumumkan), 'dd MMMM yyyy', { locale: localeID }) : '-'} />
                  <DetailItem label="Deskripsi" value={pendaftaran.deskripsi_karya} />
                  <DetailItem label="Tanggal Dibuat" value={format(new Date(pendaftaran.createdAt), 'dd MMMM yyyy, HH:mm', { locale: localeID })} />
                  <DetailItem label="Terakhir Diperbarui" value={format(new Date(pendaftaran.updatedAt), 'dd MMMM yyyy, HH:mm', { locale: localeID })} />
              </dl>
          </CardContent>
        </Card>
        
        {/* --- DETAIL PENCIPTA --- */}
        {pendaftaran.pencipta && pendaftaran.pencipta.length > 0 && (
          <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-700" />
                  </div>
                  Data Pencipta
                </CardTitle>
              </CardHeader>
              <CardContent>
                  {pendaftaran.pencipta.map((p, index) => (
                      <div key={p.id || index} className="p-4 border border-blue-200/50 rounded-xl mb-4 bg-gradient-to-br from-blue-50/50 to-slate-50/30 backdrop-blur-sm shadow-md">
                          <h4 className="font-semibold mb-4 pb-2 border-b border-blue-200/50 text-slate-800">
                            Pencipta {index + 1}
                          </h4>
                          <dl className="space-y-1 text-sm">
                              <DetailItem label="Nama Lengkap" value={p.nama_lengkap} />
                              <DetailItem label="NIK" value={p.nik} />
                              <DetailItem label="NIP/NIM/NUPTK/NPM" value={p.nip_nim} />
                              <DetailItem label="Email" value={p.email} />
                              <DetailItem label="No. HP" value={p.no_hp} />
                              <DetailItem label="Jenis Kelamin" value={p.jenis_kelamin} />
                              <DetailItem label="Fakultas" value={p.fakultas} />
                              <DetailItem label="Program Studi" value={p.program_studi} />
                              <DetailItem label="Alamat" value={`${p.alamat_lengkap || ''}, ${p.kelurahan || ''}, ${p.kecamatan || ''}, ${p.kota || ''}, ${p.provinsi || ''} ${p.kode_pos || ''}`} />
                              <DetailItem label="Kewarganegaraan" value={p.kewarganegaraan} />
                          </dl>
                      </div>
                  ))}
              </CardContent>
          </Card>
        )}

        {/* --- DOKUMEN TERLAMPIR --- */}
        <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <UploadCloud className="h-4 w-4 text-blue-700" />
              </div>
              Dokumen Terlampir
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <FilePreviewLink url={pendaftaran.lampiran_karya_url} label="Lampiran Karya" />
              <FilePreviewLink url={pendaftaran.surat_pernyataan_url} label="Surat Pernyataan" />
              <FilePreviewLink url={pendaftaran.scan_ktp_kolektif_url} label="Scan KTP (Kolektif)" />
              <FilePreviewLink url={pendaftaran.surat_pengalihan_url} label="Surat Pengalihan Hak" />
              <FilePreviewLink url={pendaftaran.bukti_transfer_url} label="Bukti Pembayaran" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
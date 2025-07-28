"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetRegistrationDetailForAdmin } from "@/queries/queries/useGetRegistrationDetailForAdmin";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale";

import {
  Loader2,
  AlertCircle,
  FileText,
  Users,
  UploadCloud,
  ArrowLeft,
  GraduationCap,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DetailItem, FilePreviewLink } from "@/components/features/pendaftaran/DetailHelpers";
import { AdminStatusActions } from "@/components/features/admin/AdminStatusActions";
import { SertifikatUpload } from "@/components/features/admin/SertifikatUpload";
import { StatusPendaftaran } from "@/lib/types";

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
        draft: 'Draft', submitted: 'Submitted', review: 'Under Review', revisi: 'Needs Revision',
        approved: 'Approved', submitted_to_djki: 'Submitted to DJKI', granted: 'Granted',
        rejected: 'Rejected', diproses_hki: 'Processing at DJKI'
    };
    return labels[status] || status;
};
const getStatusIcon = (status: StatusPendaftaran) => {
  switch (status) {
    case "approved": case "granted": return CheckCircle;
    case "revisi": case "rejected": return AlertCircle;
    default: return Clock;
  }
};


export default function AdminDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: pendaftaran, isLoading, isError, error } = useGetRegistrationDetailForAdmin(id);

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (isError) return <div className="text-center p-8 text-red-600"><AlertCircle className="mx-auto mb-2" /> Error: {error.message}</div>;
  if (!pendaftaran) return <div className="text-center p-8">Pendaftaran tidak ditemukan.</div>;

  const StatusIcon = getStatusIcon(pendaftaran.status);

  return (
    <div className="relative min-h-screen">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -right-20 w-96 h-96 bg-blue-800/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 -left-20 w-80 h-80 bg-blue-900/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative space-y-6">
        {/* Back Button */}
        <Button asChild variant="ghost" className="pl-0 text-slate-600 hover:text-slate-900 text-nomal">
            <Link href="/admin/pendaftaran"><ArrowLeft style={{ width: '20px', height: '20px' }} /> Kembali ke Daftar</Link>
        </Button>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl sm:rounded-2xl items-center justify-center shadow-xl flex-shrink-0">
                <GraduationCap className="h-6 w-6 sm:h-8  text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                  {pendaftaran.judul}
                </h1>
                <p className="text-base text-slate-600 font-mono">ID: {pendaftaran.id}</p>
              </div>
            </div>
            <Badge variant={getStatusVariant(pendaftaran.status)} className="gap-2 px-4 py-2 text-base font-semibold w-fit">
                <StatusIcon className="h-4 w-4" />
                {getStatusLabel(pendaftaran.status)}
            </Badge>
        </div>
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            {pendaftaran.status === "revisi" && pendaftaran.catatan_revisi && (
              <Card className="border-red-200/50 bg-gradient-to-br from-red-50/80 to-white backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="text-red-800 flex items-center gap-2"><AlertCircle className="h-5 w-5" />Catatan Revisi untuk Pengguna</CardTitle>
                </CardHeader>
                <CardContent className="whitespace-pre-wrap font-medium text-red-700">
                  {pendaftaran.catatan_revisi}
                </CardContent>
              </Card>
            )}

            <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3"><FileText className="text-blue-700" /> Informasi Karya</CardTitle>
              </CardHeader>
              <CardContent>
                <dl>
                  <DetailItem label="Jenis Pemilik" value={pendaftaran.jenis_pemilik} />
                  <DetailItem label="Produk Hasil" value={pendaftaran.produk_hasil} />
                  <DetailItem label="Jenis Karya" value={pendaftaran.jenis_karya} />
                  <DetailItem label="Sub-Jenis Karya" value={pendaftaran.sub_jenis_karya} />
                  <DetailItem label="Kota Diumumkan" value={pendaftaran.kota_diumumkan} />
                  <DetailItem label="Tanggal Diumumkan" value={ pendaftaran.tanggal_diumumkan ? format(new Date(pendaftaran.tanggal_diumumkan), "dd MMMM yyyy", { locale: localeID }) : "-" } />
                  <DetailItem label="Deskripsi" value={pendaftaran.deskripsi_karya} />
                </dl>
              </CardContent>
            </Card>

            {pendaftaran.pencipta?.length > 0 && (
              <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3"><Users className="text-blue-700" /> Data Pencipta</CardTitle>
                </CardHeader>
                <CardContent>
                  {pendaftaran.pencipta.map((p, index) => (
                    <div key={p.id || index} className="p-4 border border-blue-200/30 rounded-xl mb-4 bg-blue-50/30">
                      <h4 className="font-semibold mb-4 border-b border-blue-200/50 pb-2 text-slate-800">Pencipta {index + 1}</h4>
                      <dl className="space-y-1 text-sm">
                        <DetailItem label="Nama Lengkap" value={p.nama_lengkap} />
                        <DetailItem label="NIK" value={p.nik} />
                        <DetailItem label="NIP/NIM" value={p.nip_nim} />
                        <DetailItem label="Email" value={p.email} />
                        <DetailItem label="No. HP" value={p.no_hp} />
                        <DetailItem label="Alamat" value={`${p.alamat_lengkap || ""}, ${p.kelurahan || ""}, ${p.kecamatan || ""}, ${p.kota || ""}, ${p.provinsi || ""} ${p.kode_pos || ""}`} />
                      </dl>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3"><UploadCloud className="text-blue-700" /> Dokumen Terlampir</CardTitle>
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

          {/* Right Column: Admin Actions */}
          <div className="space-y-6">
            <AdminStatusActions pendaftaranId={pendaftaran.id} currentStatus={pendaftaran.status} />
            
            {pendaftaran.status === "approved" && <SertifikatUpload pendaftaranId={pendaftaran.id} />}

            {pendaftaran.status === "granted" && pendaftaran.sertifikat_hki_url && (
              <Card className="border-green-200/50 bg-gradient-to-br from-green-50/80 to-white backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-green-800 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5"/>
                    Sertifikat Terunggah
                  </CardTitle>
                  <CardDescription className="text-base text-green-700 font-medium">
                    Sertifikat HKI untuk pendaftaran ini telah diterbitkan dan diunggah.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FilePreviewLink url={pendaftaran.sertifikat_hki_url} label="File Sertifikat HKI"/>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
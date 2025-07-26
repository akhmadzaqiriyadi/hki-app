"use client";

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useGetRegistrationById } from '@/queries/queries/useGetRegistrationById';
import { useDownloadFile } from '@/queries/mutations/useDownloadFile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Edit, FileText, Download, User, UploadCloud } from 'lucide-react';
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

// Helper untuk menampilkan item detail agar rapi
function DetailItem({ label, value }: { label: string; value: string | null | undefined }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 py-3 border-b last:border-b-0">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm col-span-2 font-semibold break-words">{value}</dd>
    </div>
  );
}

// Helper untuk menampilkan link file yang aman
function FilePreviewLink({ url, label }: { url?: string | null; label: string }) {
  const downloadMutation = useDownloadFile();

  if (!url) {
    return (
      <div className="p-4 border rounded-lg text-center bg-muted/50">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">Tidak ada file.</p>
      </div>
    );
  }

  const filename = url.split('/').pop();
  const protectedUrl = `/api/pendaftaran/file/${filename}`;

  const handleDownload = () => {
    downloadMutation.mutate(protectedUrl);
  };

  return (
    <div>
        <p className="text-sm font-medium mb-2">{label}</p>
        <div className="border rounded-lg p-2 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="h-8 w-8 text-blue-600 flex-shrink-0" />
                <span className="text-sm truncate font-mono" title={filename}>
                    {filename}
                </span>
            </div>
            <Button onClick={handleDownload} variant="outline" size="sm" disabled={downloadMutation.isPending}>
                {downloadMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
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
    return <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }
  if (isError) {
    return <div className="text-red-600 p-8 text-center"><AlertCircle className="mx-auto mb-2 h-8 w-8" /> Terjadi kesalahan: {error.message}</div>;
  }
  if (!pendaftaran) {
    return <div className="text-center p-8">Data pendaftaran tidak ditemukan.</div>;
  }

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{pendaftaran.judul}</h1>
            <p className="text-muted-foreground font-mono text-xs">ID: {pendaftaran.id}</p>
          </div>
          {pendaftaran.status === 'draft' ? (
              <div className="flex items-center gap-2">
                  <Button asChild variant="outline">
                      <Link href={`/dashboard/pendaftaran/edit/${pendaftaran.id}`}><Edit className="mr-2 h-4 w-4" /> Lanjutkan Edit</Link>
                  </Button>
                  <FinalizeButton pendaftaranId={pendaftaran.id} />
              </div>
          ) : (
              <Badge variant={getStatusVariant(pendaftaran.status)} className="capitalize text-base py-2 px-4">
                  {getStatusLabel(pendaftaran.status)}
              </Badge>
          )}
        </div>
      
      {pendaftaran.status === 'revisi' && (
        <Card className="border-destructive bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Perlu Perbaikan</CardTitle>
            <CardDescription className="text-destructive/90">
                Admin memberikan catatan revisi. Silakan perbaiki dan kirim ulang.
                <br/>
                <strong className="block mt-2 whitespace-pre-wrap">Catatan: {pendaftaran.catatan_revisi || "Tidak ada catatan."}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild><Link href={`/dashboard/pendaftaran/edit/${pendaftaran.id}`}><Edit className="mr-2 h-4 w-4" /> Perbaiki Pendaftaran</Link></Button>
          </CardContent>
        </Card>
      )}

      {pendaftaran.status === 'approved' && (
        <PaymentUploadForm pendaftaranId={pendaftaran.id} jenisPemilik={pendaftaran.jenis_pemilik || 'Umum'} jenisKarya={pendaftaran.jenis_karya || 'KARYA_TULIS'} />
      )}

      {pendaftaran.status === 'granted' && pendaftaran.sertifikat_hki_url && (
         <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-green-800">Sertifikat Tersedia</CardTitle>
             <CardDescription>Selamat! Sertifikat HKI Anda telah terbit.</CardDescription>
          </CardHeader>
          <CardContent>
             <FilePreviewLink url={pendaftaran.sertifikat_hki_url} label="File Sertifikat HKI"/>
          </CardContent>
        </Card>
      )}

      {/* --- DETAIL KARYA --- */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><FileText /> Informasi Karya</CardTitle></CardHeader>
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
        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><User /> Data Pencipta</CardTitle></CardHeader>
            <CardContent>
                {pendaftaran.pencipta.map((p, index) => (
                    <div key={p.id || index} className="p-4 border rounded-md mb-4 bg-slate-50">
                        <h4 className="font-semibold mb-4 border-b pb-2">Pencipta {index + 1}</h4>
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
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><UploadCloud /> Dokumen Terlampir</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <FilePreviewLink url={pendaftaran.lampiran_karya_url} label="Lampiran Karya" />
            <FilePreviewLink url={pendaftaran.surat_pernyataan_url} label="Surat Pernyataan" />
            <FilePreviewLink url={pendaftaran.scan_ktp_kolektif_url} label="Scan KTP (Kolektif)" />
            <FilePreviewLink url={pendaftaran.surat_pengalihan_url} label="Surat Pengalihan Hak" />
            <FilePreviewLink url={pendaftaran.bukti_transfer_url} label="Bukti Pembayaran" />
        </CardContent>
      </Card>

    </div>
  );
}
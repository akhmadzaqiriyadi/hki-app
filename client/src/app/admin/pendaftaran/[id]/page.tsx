"use client";

import React from "react";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DetailItem,
  FilePreviewLink,
} from "@/components/features/pendaftaran/DetailHelpers";
import { AdminStatusActions } from "@/components/features/admin/AdminStatusActions";
import { SertifikatUpload } from "@/components/features/admin/SertifikatUpload";
import { StatusPendaftaran } from "@/lib/types";

const getStatusVariant = (status: StatusPendaftaran) => {
  const variants: Record<
    string,
    "success" | "info" | "destructive" | "warning" | "secondary"
  > = {
    approved: "success",
    granted: "success",
    submitted_to_djki: "info",
    revisi: "destructive",
    submitted: "warning",
    review: "warning",
    draft: "secondary",
    rejected: "destructive",
    diproses_hki: "info",
  };
  return variants[status] || "secondary";
};
const getStatusLabel = (status: StatusPendaftaran) => {
  const labels: Record<string, string> = {
    draft: "Draft",
    submitted: "Submitted",
    review: "Reviewed",
    revisi: "Revised",
    approved: "Approved",
    submitted_to_djki: "Submitted to DJKI",
    granted: "Granted",
    rejected: "Rejected",
    diproses_hki: "Submitted to DJKI",
  };
  return labels[status] || status;
};

export default function AdminDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const {
    data: pendaftaran,
    isLoading,
    isError,
    error,
  } = useGetRegistrationDetailForAdmin(id);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  if (isError)
    return (
      <div className="text-red-500 p-8 text-center">
        <AlertCircle className="mx-auto mb-2" />
        Error: {error.message}
      </div>
    );
  if (!pendaftaran)
    return <div className="text-center p-8">Pendaftaran tidak ditemukan.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Kolom Kiri: Detail Pendaftaran */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">{pendaftaran.judul}</h1>
                <p className="text-sm text-muted-foreground font-mono">
                  {pendaftaran.id}
                </p>
              </div>
              <Badge
                variant={getStatusVariant(pendaftaran.status)}
                className="w-fit h-fit capitalize text-base py-2 px-4"
              >
                {getStatusLabel(pendaftaran.status)}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {pendaftaran.status === "revisi" && pendaftaran.catatan_revisi && (
          <Card className="border-destructive bg-destructive/5 text-destructive">
            <CardHeader>
              <CardTitle>Catatan Revisi untuk Pengguna</CardTitle>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap font-medium">
              {pendaftaran.catatan_revisi}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText /> Informasi Karya
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl>
              <DetailItem
                label="Jenis Pemilik"
                value={pendaftaran.jenis_pemilik}
              />
              <DetailItem
                label="Produk Hasil"
                value={pendaftaran.produk_hasil}
              />
              <DetailItem label="Jenis Karya" value={pendaftaran.jenis_karya} />
              <DetailItem
                label="Sub-Jenis Karya"
                value={pendaftaran.sub_jenis_karya}
              />
              <DetailItem
                label="Kota Diumumkan"
                value={pendaftaran.kota_diumumkan}
              />
              <DetailItem
                label="Tanggal Diumumkan"
                value={
                  pendaftaran.tanggal_diumumkan
                    ? format(
                        new Date(pendaftaran.tanggal_diumumkan),
                        "dd MMMM yyyy",
                        { locale: localeID }
                      )
                    : "-"
                }
              />
              <DetailItem
                label="Deskripsi"
                value={pendaftaran.deskripsi_karya}
              />
            </dl>
          </CardContent>
        </Card>

        {pendaftaran.pencipta && pendaftaran.pencipta.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users /> Data Pencipta
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendaftaran.pencipta.map((p, index) => (
                <div
                  key={p.id || index}
                  className="p-4 border rounded-md mb-4 bg-slate-50"
                >
                  <h4 className="font-semibold mb-4 border-b pb-2">
                    Pencipta {index + 1}
                  </h4>
                  <dl className="space-y-1 text-sm">
                    <DetailItem label="Nama Lengkap" value={p.nama_lengkap} />
                    <DetailItem label="NIK" value={p.nik} />
                    <DetailItem label="NIP/NIM/NUPTK/NPM" value={p.nip_nim} />
                    <DetailItem label="Email" value={p.email} />
                    <DetailItem label="No. HP" value={p.no_hp} />
                    <DetailItem
                      label="Alamat"
                      value={`${p.alamat_lengkap || ""}, ${
                        p.kelurahan || ""
                      }, ${p.kecamatan || ""}, ${p.kota || ""}, ${
                        p.provinsi || ""
                      } ${p.kode_pos || ""}`}
                    />
                  </dl>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadCloud /> Dokumen Terlampir
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <FilePreviewLink
              url={pendaftaran.lampiran_karya_url}
              label="Lampiran Karya"
            />
            <FilePreviewLink
              url={pendaftaran.surat_pernyataan_url}
              label="Surat Pernyataan"
            />
            <FilePreviewLink
              url={pendaftaran.scan_ktp_kolektif_url}
              label="Scan KTP (Kolektif)"
            />
            <FilePreviewLink
              url={pendaftaran.surat_pengalihan_url}
              label="Surat Pengalihan Hak"
            />
            <FilePreviewLink
              url={pendaftaran.bukti_transfer_url}
              label="Bukti Pembayaran"
            />
          </CardContent>
        </Card>
      </div>

      {/* Kolom Kanan: Aksi Admin */}
      <div className="space-y-6">
        <AdminStatusActions
          pendaftaranId={pendaftaran.id}
          currentStatus={pendaftaran.status}
        />
        {pendaftaran.status === "approved" && (
          <SertifikatUpload pendaftaranId={pendaftaran.id} />
        )}
      </div>
    </div>
  );
}

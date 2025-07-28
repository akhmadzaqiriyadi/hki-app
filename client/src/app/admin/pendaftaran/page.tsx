"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useGetAllRegistrationsForAdmin } from "@/queries/queries/useGetAllRegistrationsForAdmin";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertCircle, Eye, Search, Filter, Shield, X, Download } from "lucide-react";
import { Pendaftaran, StatusPendaftaran } from "@/lib/types";
import { apiClient } from "@/lib/api-client"; // <-- Import apiClient
import { toast } from "sonner"; // <-- Import toast untuk notifikasi

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
    return labels[status] || "secondary";
};

const statusOptions = [
    { value: "all", label: "Semua Status" }, { value: "draft", label: "Draft" },
    { value: "submitted", label: "Submitted" }, { value: "review", label: "Under Review" },
    { value: "revisi", label: "Needs Revision" }, { value: "approved", label: "Approved" },
    { value: "granted", label: "Granted" }, { value: "rejected", label: "Rejected" },
];

export default function AdminPendaftaranPage() {
  const { data: pendaftaran, isLoading, isError, error } = useGetAllRegistrationsForAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isGeneratingPdfId, setIsGeneratingPdfId] = useState<string | null>(null); // State untuk loading

  const statusCounts = useMemo(() => {
    if (!pendaftaran) return {};
    const counts: Record<string, number> = { all: pendaftaran.length };
    statusOptions.forEach(opt => { if(opt.value !== 'all') counts[opt.value] = 0; });
    pendaftaran.forEach(item => { if (counts.hasOwnProperty(item.status)) { counts[item.status]++; } });
    return counts;
  }, [pendaftaran]);

  const filteredData = useMemo(() => {
    if (!pendaftaran) return [];
    return pendaftaran.filter(item => {
        const matchesSearch = item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (item.user?.nama_lengkap || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
  }, [pendaftaran, searchTerm, statusFilter]);

  const clearFilters = () => { setSearchTerm(""); setStatusFilter("all"); };
  const hasActiveFilters = searchTerm !== "" || statusFilter !== "all";
  const hasData = !isLoading && !isError && pendaftaran && pendaftaran.length > 0;

  const handleDownloadLaporan = () => {
    // ... (fungsi unduh laporan massal tidak berubah)
  };
  
  const handleDownloadSinglePDF = async (pendaftaranId: string) => {
    setIsGeneratingPdfId(pendaftaranId);
    try {
        // Langkah 1: Ambil data lengkap dari server
        const item: Pendaftaran = await apiClient(`/admin/pendaftaran/${pendaftaranId}`);

        const doc = new jsPDF();
        let yPos = 22;

        const writeDetail = (label: string, value: string | undefined | null) => {
            if (value) {
                doc.setFont("helvetica", "bold");
                doc.text(label, 14, yPos);
                doc.setFont("helvetica", "normal");
                const textLines = doc.splitTextToSize(value, 150);
                doc.text(textLines, 60, yPos);
                yPos += (textLines.length * 5) + 4;
            }
        };
        
        doc.setFontSize(18).setFont("helvetica", "bold");
        doc.text("Detail Pendaftaran Hak Cipta", 14, yPos);
        yPos += 10;

        doc.setFontSize(14).setFont("helvetica", "bold");
        doc.text("1. Informasi Karya", 14, yPos);
        yPos += 8;
        doc.setFontSize(10);
        writeDetail("ID Pendaftaran:", item.id);
        writeDetail("Judul Karya:", item.judul);
        writeDetail("Status:", getStatusLabel(item.status));
        writeDetail("Jenis Pemilik:", item.jenis_pemilik);
        writeDetail("Jenis Karya:", item.jenis_karya);
        writeDetail("Tanggal Diumumkan:", item.tanggal_diumumkan ? format(new Date(item.tanggal_diumumkan), 'dd MMMM yyyy', { locale: localeID }) : '-');
        writeDetail("Deskripsi:", item.deskripsi_karya);
        yPos += 5;

        doc.setFontSize(14).setFont("helvetica", "bold");
        doc.text("2. Informasi Pemohon", 14, yPos);
        yPos += 8;
        doc.setFontSize(10);
        writeDetail("Nama Lengkap:", item.user?.nama_lengkap);
        writeDetail("Email:", item.user?.email);
        yPos += 5;
        
        doc.setFontSize(14).setFont("helvetica", "bold");
        doc.text("3. Data Pencipta", 14, yPos);
        yPos += 8;

        (item.pencipta || []).forEach((p, index) => {
            if (yPos > 240) { doc.addPage(); yPos = 22; }
            doc.setFontSize(12).setFont("helvetica", "bold");
            doc.text(`Pencipta ${index + 1}`, 14, yPos);
            yPos += 8;
            doc.setFontSize(10);
            writeDetail("Nama Lengkap:", p.nama_lengkap);
            writeDetail("NIK:", p.nik);
            writeDetail("NIP/NIM:", p.nip_nim);
            writeDetail("Email:", p.email);
            writeDetail("No. HP:", p.no_hp);
            writeDetail("Alamat:", `${p.alamat_lengkap || ""}, ${p.kelurahan || ""}, ${p.kecamatan || ""}, ${p.kota || ""} ${p.provinsi || ""} ${p.kode_pos || ""}`);
            yPos += 5;
        });

        if (yPos > 260) { doc.addPage(); yPos = 22; }

        doc.setFontSize(14).setFont("helvetica", "bold");
        doc.text("4. Kelengkapan Dokumen", 14, yPos);
        const dokumenColumns = ["Nama Dokumen", "Status"];
        const dokumenRows = [
            ["Lampiran Karya", item.lampiran_karya_url ? "Ada" : "Tidak Ada"],
            ["Surat Pernyataan", item.surat_pernyataan_url ? "Ada" : "Tidak Ada"],
            ["Scan KTP Kolektif", item.scan_ktp_kolektif_url ? "Ada" : "Tidak Ada"],
            ["Surat Pengalihan Hak", item.surat_pengalihan_url ? "Ada" : "Tidak Ada"],
            ["Bukti Pembayaran", item.bukti_transfer_url ? "Ada" : "Tidak Ada"],
            ["Sertifikat HKI", item.sertifikat_hki_url ? "Ada" : "Tidak Ada"],
        ];
        autoTable(doc, {
            head: [dokumenColumns], body: dokumenRows,
            startY: yPos + 2, theme: 'grid', headStyles: { fillColor: [41, 128, 185] },
        });

        doc.save(`detail-pendaftaran-${item.id}.pdf`);
    } catch (err: any) {
        toast.error("Gagal Membuat PDF", { description: err.message });
    } finally {
        setIsGeneratingPdfId(null);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="relative min-h-screen">
       <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -right-20 w-96 h-96 bg-blue-800/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 -left-20 w-80 h-80 bg-blue-900/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>
      <div className="relative space-y-8">
        <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl sm:rounded-2xl items-center justify-center shadow-xl flex-shrink-0">
                <Shield className="h-6 w-6 sm:h-8 text-white" />
            </div>
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                    Verifikasi Pendaftaran
                </h1>
                <p className="text-base text-slate-600 font-medium">
                    Review dan kelola semua pendaftaran HKI yang masuk dari pengguna.
                </p>
            </div>
        </div>
        {!isError && (
            <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-xl">
                <CardHeader className="pb-4">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-bold text-slate-800">Daftar Semua Pendaftaran</CardTitle>
                    <CardDescription className="text-base text-slate-600 font-medium">
                      {hasData ? `Menampilkan ${filteredData.length} dari ${pendaftaran?.length} pendaftaran` : "Belum ada pendaftaran yang masuk."}
                    </CardDescription>
                  </div>
                  {hasData && (
                    <>
                      <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent my-4" />
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center"><Filter className="h-3 w-3 text-blue-700" /></div>
                            Filter & Pencarian
                        </div>
                        <div className="flex flex-col lg:flex-row gap-4">
                          <div className="relative flex-1 min-w-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <Input placeholder="Cari berdasarkan judul atau nama pemohon..." className="pl-10 border-blue-200/50 bg-white/80 focus:border-blue-300" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                          </div>
                          <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full lg:w-[240px] border-blue-200/50 bg-white/80 focus:border-blue-300">
                              <SelectValue placeholder="Filter status" />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex items-center justify-between w-full">
                                    <span>{option.label}</span>
                                    <Badge variant="secondary" className="ml-2 bg-slate-100 text-slate-800">{statusCounts[option.value] || 0}</Badge>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button onClick={handleDownloadLaporan} variant="outline" className="border-blue-200 hover:bg-blue-50">
                              <Download className="mr-2 h-4 w-4"/>
                              Unduh Laporan
                          </Button>
                          {hasActiveFilters && (
                            <Button variant="ghost" onClick={clearFilters} className="hover:bg-blue-50"><X className="mr-2 h-4 w-4" />Hapus Filter</Button>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </CardHeader>
                <CardContent className="p-0">
                  {hasData && (
                    <div className="rounded-xl border border-blue-200/50 bg-white/80 backdrop-blur-sm overflow-hidden mx-6 mb-6">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gradient-to-r from-blue-50/80 to-slate-50/50 border-b-blue-200/30">
                                <TableHead className="w-[40%] pl-6 font-semibold text-slate-700">Judul & Pemohon</TableHead>
                                <TableHead className="font-semibold text-slate-700">Status</TableHead>
                                <TableHead className="font-semibold text-slate-700">Tanggal Masuk</TableHead>
                                <TableHead className="text-right pr-6 font-semibold text-slate-700">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.length > 0 ? filteredData.map((item) => (
                                <TableRow key={item.id} className="hover:bg-blue-50/50">
                                    <TableCell className="pl-6">
                                        <div className="font-semibold text-slate-800">{item.judul}</div>
                                        <div className="text-xs text-slate-600">{item.user?.nama_lengkap || 'Tidak diketahui'}</div>
                                    </TableCell>
                                    <TableCell><Badge variant={getStatusVariant(item.status)}>{getStatusLabel(item.status)}</Badge></TableCell>
                                    <TableCell className="text-slate-600">{item.createdAt ? format(new Date(item.createdAt), 'dd MMM yyyy', { locale: localeID }) : '-'}</TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex gap-2 justify-end">
                                            <Button onClick={() => handleDownloadSinglePDF(item.id)} disabled={isGeneratingPdfId === item.id} variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50">
                                                {isGeneratingPdfId === item.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Download className="mr-2 h-4 w-4"/>}
                                                Cetak PDF
                                            </Button>
                                            <Button asChild variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50">
                                                <Link href={`/admin/pendaftaran/${item.id}`}><Eye className="mr-2 h-4 w-4" />Review</Link>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                )) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center text-slate-600">Tidak ada pendaftaran yang cocok dengan filter Anda.</TableCell>
                                </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                  )}
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
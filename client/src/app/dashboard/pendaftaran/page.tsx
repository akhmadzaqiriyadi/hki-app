"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useGetMyRegistrations } from "@/queries/queries/useGetMyRegistrations";
import { useCreateDraftRegistration } from "@/queries/mutations/useCreateDraftRegistration";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Loader2, AlertCircle, FileText, Search } from "lucide-react";
import { Pendaftaran, StatusPendaftaran } from "@/lib/types";
import { PendaftaranActions } from "@/components/features/pendaftaran/PendaftaranActions";

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

export default function PendaftaranListPage() {
  const { data: pendaftaran, isLoading, isError, error } = useGetMyRegistrations();
  const createDraftMutation = useCreateDraftRegistration();

  // --- STATE BARU UNTUK FILTER ---
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // --- LOGIKA UNTUK MEMFILTER DATA ---
  const filteredData = useMemo(() => {
    if (!pendaftaran) return [];
    return pendaftaran.filter(item => {
        const matchesSearch = item.judul.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
  }, [pendaftaran, searchTerm, statusFilter]);

  const handleCreateDraft = () => {
    createDraftMutation.mutate();
  };
  
  const hasData = !isLoading && !isError && pendaftaran && pendaftaran.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pendaftaran Saya</h1>
          <p className="text-muted-foreground">Kelola semua pendaftaran hak cipta Anda.</p>
        </div>
        <Button onClick={handleCreateDraft} disabled={createDraftMutation.isPending}>
          {createDraftMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
          Daftarkan Karya Baru
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pendaftaran</CardTitle>
          <CardDescription>
            Gunakan filter di bawah untuk mencari pendaftaran spesifik.
          </CardDescription>
          {/* --- BAGIAN FILTER BARU --- */}
          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Cari berdasarkan judul karya..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter berdasarkan status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="review">Reviewed</SelectItem>
                    <SelectItem value="revisi">Revised</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="granted">Granted</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}
          {isError && <div className="text-red-600 p-8 text-center"><AlertCircle className="mx-auto mb-2 h-8 w-8" /> Terjadi kesalahan: {error.message}</div>}
          
          {hasData ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Judul Karya</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* --- TAMPILKAN DATA YANG SUDAH DIFILTER --- */}
                {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.judul || "Tanpa Judul"}</TableCell>
                        <TableCell>
                        <Badge variant={getStatusVariant(item.status)} className="capitalize">
                            {getStatusLabel(item.status)}
                        </Badge>
                        </TableCell>
                        <TableCell>
                        {item.createdAt ? format(new Date(item.createdAt), 'dd MMM yyyy', { locale: localeID }) : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                            <PendaftaranActions pendaftaran={item} />
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">
                            Tidak ada pendaftaran yang cocok dengan filter Anda.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            !isLoading && !isError && (
                <div className="text-center py-16 px-6">
                    <FileText className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">Belum Ada Pendaftaran</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Klik tombol "Daftarkan Karya Baru" untuk memulai.
                    </p>
                </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
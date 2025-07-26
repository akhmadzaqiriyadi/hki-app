"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useGetAllRegistrationsForAdmin } from "@/queries/queries/useGetAllRegistrationsForAdmin";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle, Eye, Search } from "lucide-react";
import { StatusPendaftaran } from "@/lib/types";

// Helper yang sama dari dasbor pengguna, kita bisa pindahkan ke utils nanti
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

export default function AdminPendaftaranPage() {
  const { data: pendaftaran, isLoading, isError, error } = useGetAllRegistrationsForAdmin();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!pendaftaran) return [];
    return pendaftaran.filter(item => 
        item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.user?.nama_lengkap || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pendaftaran, searchTerm]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Verifikasi Pendaftaran</h1>
        <p className="text-muted-foreground">Review dan kelola semua pendaftaran HKI yang masuk.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Semua Pendaftaran</CardTitle>
          <CardDescription>
            Terdapat {filteredData.length} pendaftaran untuk direview.
          </CardDescription>
          <div className="relative pt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Cari berdasarkan judul atau nama pemohon..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}
          {isError && <div className="text-red-600 p-8 text-center"><AlertCircle className="mx-auto mb-2 h-8 w-8" /> Terjadi kesalahan: {error.message}</div>}
          
          {filteredData && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Judul & Pemohon</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal Masuk</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                        <div className="font-medium">{item.judul}</div>
                        <div className="text-xs text-muted-foreground">{item.user?.nama_lengkap || 'Tidak diketahui'}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(item.status)} className="capitalize">
                        {getStatusLabel(item.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.createdAt ? format(new Date(item.createdAt), 'dd MMM yyyy', { locale: localeID }) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm">
                            <Link href={`/admin/pendaftaran/${item.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Review
                            </Link>
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
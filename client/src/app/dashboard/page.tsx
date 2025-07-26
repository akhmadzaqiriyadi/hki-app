"use client";

import Link from "next/link";
import { useGetMyRegistrations } from "@/queries/queries/useGetMyRegistrations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, FileText, CheckCircle, Clock, AlertCircle, Loader2, PlusCircle, BookOpen } from "lucide-react";
import { Pendaftaran, StatusPendaftaran } from "@/lib/types";
import React from "react";
import { useAuth } from "@/hooks/useAuth";

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

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: pendaftaran, isLoading } = useGetMyRegistrations();

  const stats = React.useMemo(() => {
    if (!pendaftaran) return { total: 0, approved: 0, inProgress: 0, revision: 0 };
    return {
      total: pendaftaran.length,
      approved: pendaftaran.filter(p => p.status === "approved" || p.status === "granted").length,
      inProgress: pendaftaran.filter(p => p.status === "submitted" || p.status === "review" || p.status === "submitted_to_djki").length,
      revision: pendaftaran.filter(p => p.status === "revisi").length,
    };
  }, [pendaftaran]);
  
  const recentRegistrations = pendaftaran?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Selamat Datang, {user?.nama_lengkap || 'Pengguna'}!</h1>
        <p className="text-muted-foreground">Kelola dan pantau semua pendaftaran HKI Anda di sini.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Pendaftaran</CardTitle><FileText className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Disetujui/Selesai</CardTitle><CheckCircle className="h-4 w-4 text-green-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.approved}</div></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Dalam Proses</CardTitle><Clock className="h-4 w-4 text-yellow-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.inProgress}</div></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Perlu Revisi</CardTitle><AlertCircle className="h-4 w-4 text-red-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.revision}</div></CardContent></Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div><CardTitle>Pendaftaran Terbaru</CardTitle><CardDescription>5 pendaftaran terakhir Anda.</CardDescription></div>
                    <Button asChild variant="outline" size="sm"><Link href="/dashboard/pendaftaran">Lihat Semua <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Judul</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {recentRegistrations.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.judul}</TableCell>
                                    <TableCell><Badge variant={getStatusVariant(item.status)} className="capitalize">{getStatusLabel(item.status)}</Badge></TableCell>
                                    <TableCell className="text-right"><Button asChild variant="ghost" size="sm"><Link href={`/dashboard/pendaftaran/${item.id}`}>Detail</Link></Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Pintasan</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <Button asChild className="w-full justify-start"><Link href="/dashboard/pendaftaran"><PlusCircle className="mr-2 h-4 w-4"/>Daftarkan Karya Baru</Link></Button>
                    <Button asChild variant="outline" className="w-full justify-start"><Link href="/panduan"><BookOpen className="mr-2 h-4 w-4"/>Baca Panduan</Link></Button>
                </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
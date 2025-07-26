"use client";

import { useGetAllRegistrationsForAdmin } from "@/queries/queries/useGetAllRegistrationsForAdmin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Clock, AlertCircle, Activity, Eye, CheckCircle } from "lucide-react";
import React from "react";
import { Pendaftaran, StatusPendaftaran } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale";

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

export default function AdminDashboardPage() {
  const { data: pendaftaran, isLoading } = useGetAllRegistrationsForAdmin();

  const stats = React.useMemo(() => {
    if (!pendaftaran) {
      return { total: 0, users: 0, inProgress: 0, revision: 0, granted: 0 };
    }
    const uniqueUsers = new Set(pendaftaran.map(p => p.userId));
    return {
      total: pendaftaran.length,
      users: uniqueUsers.size,
      inProgress: pendaftaran.filter(p => p.status === "submitted" || p.status === "review").length,
      revision: pendaftaran.filter(p => p.status === "revisi").length,
      granted: pendaftaran.filter(p => p.status === "granted").length,
    };
  }, [pendaftaran]);

  const recentRegistrations = pendaftaran?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dasbor Admin</h1>
      
      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Pendaftaran Masuk</CardTitle><FileText className="h-4 w-4 text-muted-foreground" /></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Pengguna Unik</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats.users}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Menunggu Review</CardTitle><Clock className="h-4 w-4 text-yellow-500" /></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats.inProgress}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Perlu Revisi</CardTitle><AlertCircle className="h-4 w-4 text-red-500" /></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats.revision}</div></CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Aktivitas Terbaru</CardTitle>
                    <CardDescription>5 pendaftaran terakhir yang masuk dari semua pengguna.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Judul Karya</TableHead>
                                <TableHead>Pemohon</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentRegistrations.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.judul}</TableCell>
                                    <TableCell className="text-muted-foreground">{item.user?.nama_lengkap || 'N/A'}</TableCell>
                                    <TableCell><Badge variant={getStatusVariant(item.status)} className="capitalize">{getStatusLabel(item.status)}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/admin/pendaftaran/${item.id}`}><Eye className="mr-2 h-4 w-4" />Review</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
      )}
    </div>
  );
}
"use client";

import Link from "next/link";
import { useGetMyRegistrations } from "@/queries/queries/useGetMyRegistrations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowRight, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Loader2, 
  PlusCircle, 
  BookOpen,
  TrendingUp,
  Eye
} from "lucide-react";
import { StatusPendaftaran } from "@/lib/types";
import React from "react";
import { useAuth } from "@/hooks/useAuth";

const getStatusVariant = (status: StatusPendaftaran) => {
    const variants: Record<string, "success" | "info" | "destructive" | "warning" | "secondary"> = {
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
        draft: 'Draft', 
        submitted: 'Submitted', 
        review: 'Under Review', 
        revisi: 'Needs Revision',
        approved: 'Approved', 
        submitted_to_djki: 'Submitted to DJKI', 
        granted: 'Granted',
        rejected: 'Rejected', 
        diproses_hki: 'Processing at DJKI'
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
      inProgress: pendaftaran.filter(p => p.status === "submitted" || p.status === "review" || p.status === "submitted_to_djki" || p.status === "diproses_hki").length,
      revision: pendaftaran.filter(p => p.status === "revisi").length,
    };
  }, [pendaftaran]);
  
  const recentRegistrations = pendaftaran?.slice(0, 5) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Selamat Datang, {user?.nama_lengkap || 'Pengguna'}! 👋
        </h1>
        <p className="text-lg text-muted-foreground">
          Kelola dan pantau semua pendaftaran HKI Anda dalam satu tempat.
        </p>
      </div>

      <Separator />

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pendaftaran
            </CardTitle>
            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total karya terdaftar
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Disetujui/Selesai
            </CardTitle>
            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Berhasil disetujui
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dalam Proses
            </CardTitle>
            <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900">
              <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Sedang diproses
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Perlu Revisi
            </CardTitle>
            <div className="rounded-full bg-red-100 p-2 dark:bg-red-900">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.revision}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Memerlukan perbaikan
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600" />
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Registrations */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl">Pendaftaran Terbaru</CardTitle>
                <CardDescription>
                  5 pendaftaran terakhir Anda dengan status terkini
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm" className="shrink-0">
                <Link href="/dashboard/pendaftaran" className="flex items-center gap-2">
                  Lihat Semua 
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {recentRegistrations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Judul Karya</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-6">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRegistrations.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell className="pl-6">
                        <div className="space-y-1">
                          <p className="font-medium leading-none">{item.judul}</p>
                          <p className="text-xs text-muted-foreground">ID: {item.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={getStatusVariant(item.status)} 
                          className="font-medium"
                        >
                          {getStatusLabel(item.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/dashboard/pendaftaran/${item.id}`} className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Detail
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-3">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    Belum ada pendaftaran. Mulai daftarkan karya Anda!
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions & Stats */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Aksi Cepat</CardTitle>
              <CardDescription>
                Pintasan untuk aksi yang sering digunakan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start h-12" size="lg">
                <Link href="/dashboard/pendaftaran" className="flex items-center gap-3">
                  <div className="rounded-full bg-white p-1">
                    <PlusCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Daftarkan Karya Baru</p>
                    <p className="text-xs text-white/80">Mulai proses pendaftaran</p>
                  </div>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full justify-start h-12" size="lg">
                <Link href="/panduan" className="flex items-center gap-3">
                  <div className="rounded-full bg-muted p-1">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Baca Panduan</p>
                    <p className="text-xs text-muted-foreground">Pelajari proses HKI</p>
                  </div>
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Success Rate */}
          {stats.total > 0 && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Tingkat Keberhasilan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {Math.round((stats.approved / stats.total) * 100)}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Dari {stats.total} pendaftaran
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Disetujui</span>
                      <span>{stats.approved}/{stats.total}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(stats.approved / stats.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
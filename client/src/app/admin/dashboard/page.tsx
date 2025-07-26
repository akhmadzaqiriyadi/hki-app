"use client";

import { useGetAllRegistrationsForAdmin } from "@/queries/queries/useGetAllRegistrationsForAdmin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  FileText, 
  Clock, 
  AlertCircle, 
  Activity, 
  Eye, 
  CheckCircle,
  Loader2,
  TrendingUp,
  Calendar,
  UserCheck,
  FileCheck,
  FileClock,
  FileX,
  ArrowRight,
  Shield
} from "lucide-react";
import React from "react";
import { Pendaftaran, StatusPendaftaran } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format, subDays, isAfter } from "date-fns";
import { id as localeID } from "date-fns/locale";

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

export default function AdminDashboardPage() {
  const { data: pendaftaran, isLoading } = useGetAllRegistrationsForAdmin();

  const stats = React.useMemo(() => {
    if (!pendaftaran) {
      return { 
        total: 0, 
        users: 0, 
        inProgress: 0, 
        revision: 0, 
        granted: 0,
        approved: 0,
        rejected: 0,
        submitted: 0,
        newThisWeek: 0,
        completionRate: 0
      };
    }

    const uniqueUsers = new Set(pendaftaran.map(p => p.userId));
    const oneWeekAgo = subDays(new Date(), 7);
    const newThisWeek = pendaftaran.filter(p => 
      p.createdAt && isAfter(new Date(p.createdAt), oneWeekAgo)
    ).length;

    const completed = pendaftaran.filter(p => 
      p.status === "granted" || p.status === "approved"
    ).length;
    
    const completionRate = pendaftaran.length > 0 
      ? Math.round((completed / pendaftaran.length) * 100) 
      : 0;

    return {
      total: pendaftaran.length,
      users: uniqueUsers.size,
      inProgress: pendaftaran.filter(p => 
        p.status === "submitted" || p.status === "review" || p.status === "submitted_to_djki" || p.status === "diproses_hki"
      ).length,
      revision: pendaftaran.filter(p => p.status === "revisi").length,
      granted: pendaftaran.filter(p => p.status === "granted").length,
      approved: pendaftaran.filter(p => p.status === "approved").length,
      rejected: pendaftaran.filter(p => p.status === "rejected").length,
      submitted: pendaftaran.filter(p => p.status === "submitted").length,
      newThisWeek,
      completionRate
    };
  }, [pendaftaran]);

  const recentRegistrations = pendaftaran?.slice(0, 8) || [];
  const urgentReviews = pendaftaran?.filter(p => 
    p.status === "submitted" || p.status === "revisi"
  ).slice(0, 5) || [];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Kelola dan pantau semua pendaftaran HKI dari seluruh pengguna
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Main Stats Grid */}
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
              {stats.newThisWeek} baru minggu ini
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pengguna Aktif
            </CardTitle>
            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
              <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.users}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pengguna terdaftar
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Menunggu Review
            </CardTitle>
            <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900">
              <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Perlu perhatian segera
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tingkat Keberhasilan
            </CardTitle>
            <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
              <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Dari semua pendaftaran
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600" />
        </Card>
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Submitted</CardTitle>
            <FileClock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.submitted}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Granted</CardTitle>
            <FileCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{stats.granted}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Needs Revision</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.revision}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
            <FileX className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Aktivitas Terbaru
                </CardTitle>
                <CardDescription>
                  8 pendaftaran terakhir dari semua pengguna
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/pendaftaran" className="flex items-center gap-2">
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
                    <TableHead>Pemohon</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Tanggal
                      </div>
                    </TableHead>
                    <TableHead className="text-right pr-6">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRegistrations.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium pl-6">
                        <div className="space-y-1">
                          <p className="font-medium leading-none">{item.judul}</p>
                          <p className="text-xs text-muted-foreground">ID: {item.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {item.user?.nama_lengkap || 'N/A'}
                          </span>
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
                      <TableCell className="text-muted-foreground text-sm">
                        {item.createdAt 
                          ? format(new Date(item.createdAt), 'dd MMM yyyy', { locale: localeID })
                          : '-'
                        }
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/pendaftaran/${item.id}`} className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Review
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
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    Belum ada aktivitas pendaftaran
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Priority Actions */}
        <div className="space-y-6">
          {/* System Overview */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Ringkasan Sistem
              </CardTitle>
              <CardDescription>
                Statistik performa dan aktivitas sistem
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Tingkat Persetujuan</span>
                  <span className="text-sm text-muted-foreground">{stats.completionRate}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stats.completionRate}%` }}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                {[
                  { label: "Rata-rata per Hari", value: Math.round(stats.total / 30), color: "text-blue-600" },
                  { label: "Pending Review", value: stats.inProgress, color: "text-yellow-600" },
                  { label: "Berhasil Disetujui", value: stats.approved + stats.granted, color: "text-green-600" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className={`text-sm font-medium ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="pt-2">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/admin/reports" className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Lihat Laporan Detail
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start h-12" size="lg">
                <Link href="/admin/pendaftaran" className="flex items-center gap-3">
                  <div className="rounded-full bg-white p-1">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Kelola Pendaftaran</p>
                    <p className="text-xs text-white/80">Review semua pendaftaran</p>
                  </div>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full justify-start h-12" size="lg">
                <Link href="/admin/users" className="flex items-center gap-3">
                  <div className="rounded-full bg-muted p-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Kelola Pengguna</p>
                    <p className="text-xs text-muted-foreground">Manajemen user</p>
                  </div>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
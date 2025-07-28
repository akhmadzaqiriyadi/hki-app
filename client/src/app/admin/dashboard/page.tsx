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
  Shield,
  ArrowRight,
  FileCheck,
  FileClock,
  FileX,
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
      return { total: 0, users: 0, inProgress: 0, revision: 0, granted: 0, approved: 0, rejected: 0, submitted: 0, newThisWeek: 0, completionRate: 0 };
    }
    const uniqueUsers = new Set(pendaftaran.map(p => p.userId));
    const oneWeekAgo = subDays(new Date(), 7);
    const newThisWeek = pendaftaran.filter(p => p.createdAt && isAfter(new Date(p.createdAt), oneWeekAgo)).length;
    const completed = pendaftaran.filter(p => p.status === "granted" || p.status === "approved").length;
    const completionRate = pendaftaran.length > 0 ? Math.round((completed / pendaftaran.length) * 100) : 0;
    return {
      total: pendaftaran.length,
      users: uniqueUsers.size,
      inProgress: pendaftaran.filter(p => ["submitted", "review", "submitted_to_djki", "diproses_hki"].includes(p.status)).length,
      revision: pendaftaran.filter(p => p.status === "revisi").length,
      granted: pendaftaran.filter(p => p.status === "granted").length,
      approved: pendaftaran.filter(p => p.status === "approved").length,
      rejected: pendaftaran.filter(p => p.status === "rejected").length,
      submitted: pendaftaran.filter(p => p.status === "submitted").length,
      newThisWeek,
      completionRate
    };
  }, [pendaftaran]);

  const recentRegistrations = pendaftaran?.slice(0, 5) || [];

  if (isLoading) {
    // ... Loading state can be improved later if needed
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="relative min-h-screen">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -right-20 w-96 h-96 bg-blue-800/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 -left-20 w-80 h-80 bg-blue-900/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative space-y-8">
        {/* Header Section */}
        <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl sm:rounded-2xl items-center justify-center shadow-xl flex-shrink-0">
                <Shield className="h-6 w-6 sm:h-8  text-white" />
            </div>
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                    Admin Dashboard
                </h1>
                <p className="text-base text-slate-600 font-medium">
                    Kelola dan pantau semua pendaftaran HKI dari seluruh pengguna.
                </p>
            </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          <Card className="relative overflow-hidden border-blue-200/50 bg-gradient-to-br from-blue-50/80 to-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
             <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">Total Pendaftaran</p>
                        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900">{stats.total}</p>
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">{stats.newThisWeek} baru minggu ini</p>
             </CardContent>
          </Card>
          <Card className="relative overflow-hidden border-green-200/50 bg-gradient-to-br from-green-50/80 to-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
             <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">Pengguna Terdaftar</p>
                        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700">{stats.users}</p>
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Total pengguna aktif</p>
             </CardContent>
          </Card>
          <Card className="relative overflow-hidden border-amber-200/50 bg-gradient-to-br from-amber-50/80 to-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
             <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">Menunggu Review</p>
                        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-700">{stats.inProgress}</p>
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                        <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                </div>
                 <p className="text-xs text-slate-500 mt-2">Perlu perhatian segera</p>
             </CardContent>
          </Card>
           <Card className="relative overflow-hidden border-purple-200/50 bg-gradient-to-br from-purple-50/80 to-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
             <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">Tingkat Keberhasilan</p>
                        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-700">{stats.completionRate}%</p>
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Dari semua pendaftaran</p>
             </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-xl">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
              <div>
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Aktivitas Terbaru
                </CardTitle>
                <CardDescription className="text-base text-slate-600 font-medium">
                  Beberapa pendaftaran terakhir dari semua pengguna.
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md transition-all">
                <Link href="/admin/pendaftaran" className="flex items-center gap-2">
                  Lihat Semua Pendaftaran <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
                {recentRegistrations.length > 0 ? (
                    <div className="rounded-xl border border-blue-200/50 bg-white/80 backdrop-blur-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gradient-to-r from-blue-50/80 to-slate-50/50 border-b-blue-200/30">
                                    <TableHead className="font-semibold text-slate-700">Judul Karya</TableHead>
                                    <TableHead className="font-semibold text-slate-700">Pemohon</TableHead>
                                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                                    <TableHead className="text-center font-semibold text-slate-700">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {recentRegistrations.map((item) => (
                                <TableRow key={item.id} className="hover:bg-blue-50/50">
                                    <TableCell className="font-semibold text-slate-800">{item.judul}</TableCell>
                                    <TableCell className="text-slate-600">{item.user?.nama_lengkap || 'N/A'}</TableCell>
                                    <TableCell><Badge variant={getStatusVariant(item.status)}>{getStatusLabel(item.status)}</Badge></TableCell>
                                    <TableCell className="text-center">
                                        <Button asChild variant="ghost" size="sm">
                                            <Link href={`/admin/pendaftaran/${item.id}`}><Eye className="mr-2 h-4 w-4" />Review</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Belum ada aktivitas pendaftaran.</p>
                    </div>
                )}
            </CardContent>
          </Card>

          {/* Quick Actions & Stats */}
          <div className="space-y-6">
            <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-800">Ringkasan Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50/50 rounded-lg">
                      <div className="flex items-center gap-2 font-medium text-green-800"><FileCheck className="h-4 w-4"/> Selesai (Granted)</div>
                      <Badge variant="success">{stats.granted}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-amber-50/50 rounded-lg">
                      <div className="flex items-center gap-2 font-medium text-amber-800"><FileClock className="h-4 w-4"/> Perlu Direview</div>
                      <Badge variant="warning">{stats.submitted}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50/50 rounded-lg">
                      <div className="flex items-center gap-2 font-medium text-red-800"><AlertCircle className="h-4 w-4"/> Perlu Revisi</div>
                      <Badge variant="destructive">{stats.revision}</Badge>
                  </div>
                   <div className="flex justify-between items-center p-3 bg-slate-50/50 rounded-lg">
                      <div className="flex items-center gap-2 font-medium text-slate-800"><FileX className="h-4 w-4"/> Ditolak</div>
                      <Badge variant="secondary">{stats.rejected}</Badge>
                  </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
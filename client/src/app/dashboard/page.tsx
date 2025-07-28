// This file is part of the Sentra HKI project
"use client";

import Link from "next/link";
import { useGetMyRegistrations } from "@/queries/queries/useGetMyRegistrations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Loader2, 
  PlusCircle, 
  BookOpen,
  TrendingUp,
  Eye,
  GraduationCap,
  Award,
  Sparkles,
  Download,
  ExternalLink
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

const getStatusIcon = (status: StatusPendaftaran) => {
  switch (status) {
    case "approved":
    case "granted":
      return CheckCircle;
    case "revisi":
    case "rejected":
      return AlertCircle;
    case "submitted":
    case "review":
    case "submitted_to_djki":
    case "diproses_hki":
      return Clock;
    default:
      return Clock;
  }
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: pendaftaran, isLoading } = useGetMyRegistrations();

  // Pendaftaran dianggap ada setelah disubmit (bukan 'draft').
  // Filter pendaftaran dan hitung statistik dalam satu memoized block.
  const { stats, recentRegistrations } = React.useMemo(() => {
    if (!pendaftaran) {
      return {
        stats: { total: 0, approved: 0, inProgress: 0, revision: 0 },
        recentRegistrations: [],
      };
    }

    const submitted = pendaftaran.filter(p => p.status !== 'draft');

    const calculatedStats = {
      total: submitted.length,
      approved: submitted.filter(p => p.status === "approved" || p.status === "granted").length,
      inProgress: submitted.filter(p => p.status === "submitted" || p.status === "review" || p.status === "submitted_to_djki" || p.status === "diproses_hki").length,
      revision: submitted.filter(p => p.status === "revisi").length,
    };

    return {
      stats: calculatedStats,
      recentRegistrations: submitted.slice(0, 10),
    };
  }, [pendaftaran]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
          <p className="text-sm text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background decorations matching sidebar */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -right-20 w-96 h-96 bg-blue-800/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 -left-20 w-80 h-80 bg-blue-900/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-slate-800/3 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative space-y-8">
        {/* Welcome Header */}
        <div className="relative">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Icon hanya muncul dari sm (tablet) ke atas */}
              <div className="hidden sm:flex w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl sm:rounded-2xl items-center justify-center shadow-xl">
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                  Selamat Datang, {user?.nama_lengkap || 'Pengguna'}! <span className="text-blue-900">👋</span>
                </h1>
                <p className="text-sm sm:text-base text-slate-600 font-medium">
                  Kelola dan pantau semua pendaftaran HKI Anda dalam satu tempat
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          <Card className="relative overflow-hidden border-blue-200/50 bg-gradient-to-br from-blue-50/80 to-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-blue-900/5 rounded-full -translate-y-6 translate-x-6 sm:-translate-y-8 sm:translate-x-8 md:-translate-y-10 md:translate-x-10"></div>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">
                    Total Pendaftaran
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900">
                    {stats.total}
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-green-200/50 bg-gradient-to-br from-green-50/80 to-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-green-500/5 rounded-full -translate-y-6 translate-x-6 sm:-translate-y-8 sm:translate-x-8 md:-translate-y-10 md:translate-x-10"></div>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">
                    Disetujui/Selesai
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700">
                    {stats.approved}
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-amber-200/50 bg-gradient-to-br from-amber-50/80 to-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-amber-500/5 rounded-full -translate-y-6 translate-x-6 sm:-translate-y-8 sm:translate-x-8 md:-translate-y-10 md:translate-x-10"></div>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">
                    Dalam Proses
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-700">
                    {stats.inProgress}
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-red-200/50 bg-gradient-to-br from-red-50/80 to-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-red-500/5 rounded-full -translate-y-6 translate-x-6 sm:-translate-y-8 sm:translate-x-8 md:-translate-y-10 md:translate-x-10"></div>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">
                    Perlu Revisi
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-red-700">
                    {stats.revision}
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Recent Registrations */}
          <Card className="lg:col-span-2 border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-xl">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
              <div>
                <CardTitle className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
                  Pendaftaran Terbaru
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-slate-600 font-medium">
                  Beberapa pendaftaran terakhir Anda dengan status terkini
                </CardDescription>
              </div>
              <Button
                asChild
                size="sm"
                className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-xs sm:text-sm px-3 sm:px-4"
              >
                <Link href="/dashboard/pendaftaran">
                  <Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Lihat Semua</span>
                  <span className="sm:hidden">Semua</span>
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentRegistrations.length > 0 ? (
                <div className="rounded-xl border border-blue-200/50 bg-white/80 backdrop-blur-sm overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-blue-50/80 to-slate-50/50 border-blue-200/30">
                        <TableHead className="font-semibold text-slate-700">
                          Judul Karya
                        </TableHead>
                        <TableHead className="hidden md:table-cell font-semibold text-slate-700">
                          ID
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700">
                          Status
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700">
                          <span className="sr-only">Aksi</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentRegistrations.map((item) => {
                        const StatusIcon = getStatusIcon(item.status);
                        return (
                          <TableRow
                            key={item.id}
                            className="hover:bg-blue-50/50 transition-colors duration-200"
                          >
                            <TableCell className="font-semibold text-slate-800">
                              {item.judul}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-slate-600 text-xs">
                              {item.id}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={getStatusVariant(item.status)}
                                className="gap-1 px-3 py-1 font-semibold"
                              >
                                <StatusIcon className="h-3 w-3" />
                                {getStatusLabel(item.status)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md transition-all duration-200 hover:scale-105 text-xs px-2 sm:px-3"
                              >
                                <Link
                                  href={`/dashboard/pendaftaran/${item.id}`}
                                >
                                  <Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                  <span className="hidden sm:inline">
                                    Detail
                                  </span>
                                  <span className="sm:hidden">Detail</span>
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 bg-gradient-to-br from-blue-50/50 to-slate-50/30 rounded-xl border border-blue-200/30">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <FileText className="h-8 w-8 text-blue-700" />
                  </div>
                  <p className="text-slate-600 font-medium mb-4">
                    Belum ada pendaftaran HKI. Mulai daftarkan karya Anda!
                  </p>
                  <Button
                    asChild
                    size="sm"
                    className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-xs sm:text-sm px-3 sm:px-4"
                  >
                    <Link href="/dashboard/pendaftaran">
                      <PlusCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">
                        Mulai Pendaftaran Pertama
                      </span>
                      <span className="sm:hidden">Mulai Daftar</span>
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Panel */}
          <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 text-blue-700" />
                Aksi Cepat & Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">

              {/* Quick Actions */}
              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full justify-start h-12 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  size="lg"
                >
                  <Link href="/dashboard/pendaftaran" className="flex items-center gap-3">
                    <div className="rounded-full bg-white p-1">
                      <PlusCircle className="h-4 w-4 text-blue-900" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Daftarkan Karya Baru</p>
                      <p className="text-xs text-white/80">Mulai proses pendaftaran</p>
                    </div>
                  </Link>
                </Button>
                
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start h-12 border-blue-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                  size="lg"
                >
                  <Link href="/panduan" className="flex items-center gap-3">
                    <div className="rounded-full bg-blue-50 p-1">
                      <BookOpen className="h-4 w-4 text-blue-700" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-slate-800">Baca Panduan</p>
                      <p className="text-xs text-slate-600">Pelajari proses HKI</p>
                    </div>
                  </Link>
                </Button>
              </div>

              {/* Success Rate */}
              {stats.total > 0 && (
                <div className="p-3 sm:p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/50 rounded-lg sm:rounded-xl border border-green-200/50">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                    Tingkat Keberhasilan
                  </h4>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-green-700">
                        {Math.round((stats.approved / stats.total) * 100)}%
                      </div>
                      <p className="text-xs sm:text-sm text-green-600">
                        Dari {stats.total} pendaftaran
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm text-green-700">
                        <span>Disetujui</span>
                        <span>{stats.approved}/{stats.total}</span>
                      </div>
                      <div className="w-full bg-green-100 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(stats.approved / stats.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Tips */}
              <div className="p-3 sm:p-4 bg-gradient-to-r from-amber-50/80 to-orange-50/50 rounded-lg sm:rounded-xl border border-amber-200/50">
                <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2 text-sm sm:text-base">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  Tips Cepat
                </h4>
                <p className="text-xs sm:text-sm text-amber-700 leading-relaxed">
                  Pastikan dokumen lengkap dan sesuai format untuk mempercepat
                  proses review HKI Anda.
                </p>
              </div>

              {/* Helper Documents */}
              <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/50 rounded-lg sm:rounded-xl border border-blue-200/50">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                  Dokumen Pembantu
                </h4>
                <div className="space-y-2">
                  <div className="text-xs sm:text-sm text-blue-700">
                    <p className="font-medium mb-1">📄 Surat Pernyataan Hak Cipta:</p>
                    <div className="pl-3 space-y-1">
                      <div>
                        <a 
                          href="https://docs.google.com/document/d/1ITJ1x1-GkMzKBir93K8sGEw1ZIiN1exF/edit?usp=sharing&ouid=113467600800970467072&rtpof=true&sd=true"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                        >
                          Template <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div>
                        <a 
                          href="https://drive.google.com/file/d/1E6Rkh9Sfb-tS27a9WktLcboIi4ZEPcYh/view?usp=sharing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 underline flex items-center gap-1"
                        >
                          Contoh <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs sm:text-sm text-blue-700 pt-2 border-t border-blue-200/50">
                    <p className="font-medium mb-1">📄 Surat Pengalihan Hak:</p>
                    <div className="pl-3 space-y-1">
                      <div>
                        <a 
                          href="https://docs.google.com/document/d/1WrA-AbbXnSJoGHTXwkzZoFf4NzSCERue/edit?usp=sharing&ouid=113467600800970467072&rtpof=true&sd=true"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                        >
                          Template <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div>
                        <a 
                          href="https://drive.google.com/file/d/14W_7HJNnXe2q44AQG1_jouAW8Yn_jcrm/view?usp=sharing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 underline flex items-center gap-1"
                        >
                          Contoh <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
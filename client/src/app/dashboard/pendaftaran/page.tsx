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
import { 
    PlusCircle, 
    Loader2, 
    AlertCircle, 
    FileText, 
    Search, 
    Filter,
    Calendar,
    X,
    GraduationCap,
    CheckCircle,
    Clock,
    Download,
    ExternalLink
} from "lucide-react";
import { Pendaftaran, StatusPendaftaran } from "@/lib/types";
import { PendaftaranActions } from "@/components/features/pendaftaran/PendaftaranActions";

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

const statusOptions = [
    { value: "all", label: "Semua Status", count: 0 },
    { value: "draft", label: "Draft", count: 0 },
    { value: "submitted", label: "Submitted", count: 0 },
    { value: "review", label: "Under Review", count: 0 },
    { value: "revisi", label: "Needs Revision", count: 0 },
    { value: "approved", label: "Approved", count: 0 },
    { value: "granted", label: "Granted", count: 0 },
];

export default function PendaftaranListPage() {
  const { data: pendaftaran, isLoading, isError, error } = useGetMyRegistrations();
  const createDraftMutation = useCreateDraftRegistration();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Calculate status counts
  const statusCounts = useMemo(() => {
    if (!pendaftaran) return {};
    
    const counts: Record<string, number> = {
      all: pendaftaran.length,
      draft: 0,
      submitted: 0,
      review: 0,
      revisi: 0,
      approved: 0,
      granted: 0,
    };

    pendaftaran.forEach(item => {
      if (counts.hasOwnProperty(item.status)) {
        counts[item.status]++;
      }
    });

    return counts;
  }, [pendaftaran]);

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

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  const hasActiveFilters = searchTerm !== "" || statusFilter !== "all";
  const hasData = !isLoading && !isError && pendaftaran && pendaftaran.length > 0;

  if (isLoading) {
    return (
      <div className="relative min-h-screen">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 -right-20 w-96 h-96 bg-blue-800/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-40 -left-20 w-80 h-80 bg-blue-900/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="relative space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg" />
              <div className="h-4 w-64 bg-slate-200 animate-pulse rounded-lg" />
            </div>
            <div className="h-10 w-36 bg-slate-200 animate-pulse rounded-lg" />
          </div>
          <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <div className="h-6 w-32 bg-slate-200 animate-pulse rounded-lg mb-2" />
              <div className="h-4 w-80 bg-slate-200 animate-pulse rounded-lg" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-slate-200 animate-pulse rounded-lg" />
                ))}
              </div>
            </CardContent>
          </Card>
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
        {/* Header Section */}
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Icon hanya muncul dari sm (tablet) ke atas */}
              <div className="hidden sm:flex w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl sm:rounded-2xl items-center justify-center shadow-xl">
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>

              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                  Pendaftaran Saya
                </h1>
                <p className="text-sm sm:text-base text-slate-600 font-medium">
                  Kelola dan pantau semua pendaftaran hak cipta Anda
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleCreateDraft} 
              disabled={createDraftMutation.isPending}
              size="lg"
              className="shrink-0 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {createDraftMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PlusCircle className="mr-2 h-4 w-4" />
              )}
              Daftarkan Karya Baru
            </Button>
          </div>
        </div>
                <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-xl">
            <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Download className="h-5 w-5 text-blue-700" />
                    Dokumen Pendukung
                </CardTitle>
                <CardDescription>
                    Unduh template dokumen yang diperlukan untuk proses pendaftaran.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-sm text-blue-700 p-4 bg-blue-50/50 rounded-lg border border-blue-200/50">
                    <p className="font-semibold mb-2 text-blue-800">📄 Surat Pernyataan Hak Cipta:</p>
                    <div className="space-y-2">
                        <Button asChild variant="link" className="p-0 h-auto">
                            <a href="https://docs.google.com/document/d/1ITJ1x1-GkMzKBir93K8sGEw1ZIiN1exF/edit?usp=sharing&ouid=113467600800970467072&rtpof=true&sd=true" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                Unduh Template <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                        </Button>
                        <Button asChild variant="link" className="p-0 h-auto">
                            <a href="https://drive.google.com/file/d/1E6Rkh9Sfb-tS27a9WktLcboIi4ZEPcYh/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800">
                                Lihat Contoh <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                        </Button>
                    </div>
                  </div>
                  <div className="text-sm text-blue-700 p-4 bg-blue-50/50 rounded-lg border border-blue-200/50">
                    <p className="font-semibold mb-2 text-blue-800">📄 Surat Pengalihan Hak:</p>
                    <div className="space-y-2">
                       <Button asChild variant="link" className="p-0 h-auto">
                            <a href="https://docs.google.com/document/d/1WrA-AbbXnSJoGHTXwkzZoFf4NzSCERue/edit?usp=sharing&ouid=113467600800970467072&rtpof=true&sd=true" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                Unduh Template <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                        </Button>
                       <Button asChild variant="link" className="p-0 h-auto">
                           <a href="https://drive.google.com/file/d/14W_7HJNnXe2q44AQG1_jouAW8Yn_jcrm/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800">
                                Lihat Contoh <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                        </Button>
                        <p className="italic text-amber-700">* Wajib untuk Civitas UTY</p>
                    </div>
                  </div>
                </div>
            </CardContent>
        </Card>

        {/* Error State */}
        {isError && (
          <Card className="border-red-200/50 bg-gradient-to-br from-red-50/80 to-white backdrop-blur-sm shadow-xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center text-center p-8">
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <AlertCircle className="h-8 w-8 text-red-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">Terjadi Kesalahan</h3>
                  <p className="text-slate-600">{error?.message}</p>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                    className="border-red-200 hover:bg-red-50 hover:border-red-300 hover:shadow-md transition-all duration-200"
                  >
                    Coba Lagi
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        {!isError && (
          <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg sm:text-xl font-bold text-slate-800">Daftar Pendaftaran</CardTitle>
                  <CardDescription className="text-sm sm:text-base text-slate-600 font-medium">
                    {hasData 
                      ? `Menampilkan ${filteredData.length} dari ${pendaftaran?.length} pendaftaran`
                      : "Belum ada pendaftaran yang dibuat"
                    }
                  </CardDescription>
                </div>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-8 px-2 lg:px-3 hover:bg-blue-50 hover:shadow-md transition-all duration-200"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear filters
                  </Button>
                )}
              </div>

              {/* Filter Section */}
              {hasData && (
                <>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent my-4" />
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <Filter className="h-3 w-3 text-blue-700" />
                      </div>
                      Filter & Pencarian
                    </div>
                    
                    <div className="flex flex-col lg:flex-row gap-4">
                      {/* Search Input */}
                      <div className="relative flex-1 min-w-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input 
                          placeholder="Cari berdasarkan judul karya..."
                          className="border-blue-200/50 bg-white/80 backdrop-blur-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-200/50"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>

                      {/* Status Filter */}
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full lg:w-[200px] border-blue-200/50 bg-white/80 backdrop-blur-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-200/50">
                          <SelectValue placeholder="Filter status" />
                        </SelectTrigger>
                        <SelectContent className="border-blue-200/50 bg-white/95 backdrop-blur-sm">
                          <SelectItem value="all">
                            <div className="flex items-center justify-between w-full">
                              <span>Semua Status</span>
                              <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                                {statusCounts.all || 0}
                              </Badge>
                            </div>
                          </SelectItem>
                          {statusOptions.slice(1).map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center justify-between w-full">
                                <span>{option.label}</span>
                                <Badge variant="secondary" className="ml-2 bg-slate-100 text-slate-800">
                                  {statusCounts[option.value] || 0}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Active Filters Display */}
                    {hasActiveFilters && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-slate-600 font-medium">Active filters:</span>
                        {searchTerm && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                            Search: "{searchTerm}"
                            <button
                              onClick={() => setSearchTerm("")}
                              className="ml-1 hover:bg-blue-200/50 rounded-full p-0.5 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )}
                        {statusFilter !== "all" && (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
                            Status: {statusOptions.find(opt => opt.value === statusFilter)?.label}
                            <button
                              onClick={() => setStatusFilter("all")}
                              className="ml-1 hover:bg-amber-200/50 rounded-full p-0.5 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardHeader>

            <CardContent className="p-0">
              {hasData ? (
                <div className="rounded-xl border border-blue-200/50 bg-white/80 backdrop-blur-sm overflow-hidden mx-6 mb-6">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-blue-50/80 to-slate-50/50 border-blue-200/30">
                        <TableHead className="w-[40%] pl-6 font-semibold text-slate-700">Judul Karya</TableHead>
                        <TableHead className="font-semibold text-slate-700">Status</TableHead>
                        <TableHead className="font-semibold text-slate-700">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Tanggal Dibuat
                          </div>
                        </TableHead>
                        <TableHead className="text-right pr-6 font-semibold text-slate-700">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.length > 0 ? (
                        filteredData.map((item) => {
                          const StatusIcon = getStatusIcon(item.status);
                          return (
                            <TableRow key={item.id} className="hover:bg-blue-50/50 transition-colors duration-200">
                              <TableCell className="font-medium pl-6">
                                <div className="space-y-1">
                                  <p className="font-semibold leading-none text-slate-800">
                                    {item.judul || "Tanpa Judul"}
                                  </p>
                                  <p className="text-xs text-slate-600">
                                    ID: {item.id}
                                  </p>
                                </div>
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
                              <TableCell className="text-slate-600">
                                {item.createdAt 
                                  ? format(new Date(item.createdAt), 'dd MMM yyyy', { locale: localeID })
                                  : '-'
                                }
                              </TableCell>
                              <TableCell className="text-right pr-6">
                                <PendaftaranActions pendaftaran={item} />
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="h-32">
                            <div className="flex items-center justify-center text-center">
                              <div className="space-y-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                                  <Search className="h-6 w-6 text-slate-600" />
                                </div>
                                <h3 className="font-medium text-slate-800">Tidak ada hasil</h3>
                                <p className="text-sm text-slate-600">
                                  Tidak ada pendaftaran yang cocok dengan filter Anda.
                                </p>
                                {hasActiveFilters && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={clearFilters}
                                    className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                                  >
                                    Reset Filter
                                  </Button>
                                )}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                !isLoading && (
                  <div className="flex items-center justify-center py-16 px-6">
                    <div className="text-center space-y-4 max-w-md">
                      <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-xl">
                        <FileText className="h-10 w-10 text-blue-700" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-800">Belum Ada Pendaftaran</h3>
                        <p className="text-slate-600 font-medium">
                          Mulai lindungi karya Anda dengan mendaftarkan hak cipta. 
                          Proses pendaftaran mudah dan cepat.
                        </p>
                      </div>
                      <Button 
                        onClick={handleCreateDraft} 
                        size="lg" 
                        className="mt-4 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Daftarkan Karya Pertama
                      </Button>
                    </div>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
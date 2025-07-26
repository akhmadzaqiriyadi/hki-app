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
import { Separator } from "@/components/ui/separator";
import { 
    PlusCircle, 
    Loader2, 
    AlertCircle, 
    FileText, 
    Search, 
    Filter,
    Calendar,
    ChevronDown,
    X
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-10 w-36 bg-muted animate-pulse rounded" />
        </div>
        <Card>
          <CardHeader>
            <div className="h-6 w-32 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 w-80 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">Pendaftaran Saya</h1>
          <p className="text-lg text-muted-foreground">
            Kelola dan pantau semua pendaftaran hak cipta Anda
          </p>
        </div>
        <Button 
          onClick={handleCreateDraft} 
          disabled={createDraftMutation.isPending}
          size="lg"
          className="shrink-0"
        >
          {createDraftMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <PlusCircle className="mr-2 h-4 w-4" />
          )}
          Daftarkan Karya Baru
        </Button>
      </div>

      <Separator />

      {/* Error State */}
      {isError && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center text-center p-8">
              <div className="space-y-3">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                <h3 className="text-lg font-semibold">Terjadi Kesalahan</h3>
                <p className="text-muted-foreground">{error?.message}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Coba Lagi
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      {!isError && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl">Daftar Pendaftaran</CardTitle>
                <CardDescription>
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
                  className="h-8 px-2 lg:px-3"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear filters
                </Button>
              )}
            </div>

            {/* Filter Section */}
            {hasData && (
              <>
                <Separator className="my-4" />
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Filter className="h-4 w-4" />
                    Filter & Pencarian
                  </div>
                  
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1 min-w-0">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Cari berdasarkan judul karya..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full lg:w-[200px]">
                        <SelectValue placeholder="Filter status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          <div className="flex items-center justify-between w-full">
                            <span>Semua Status</span>
                            <Badge variant="secondary" className="ml-2">
                              {statusCounts.all || 0}
                            </Badge>
                          </div>
                        </SelectItem>
                        {statusOptions.slice(1).map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center justify-between w-full">
                              <span>{option.label}</span>
                              <Badge variant="secondary" className="ml-2">
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
                      <span className="text-sm text-muted-foreground">Active filters:</span>
                      {searchTerm && (
                        <Badge variant="secondary">
                          Search: "{searchTerm}"
                          <button
                            onClick={() => setSearchTerm("")}
                            className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                      {statusFilter !== "all" && (
                        <Badge variant="secondary">
                          Status: {statusOptions.find(opt => opt.value === statusFilter)?.label}
                          <button
                            onClick={() => setStatusFilter("all")}
                            className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
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
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%] pl-6">Judul Karya</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Tanggal Dibuat
                        </div>
                      </TableHead>
                      <TableHead className="text-right pr-6">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => (
                        <TableRow key={item.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium pl-6">
                            <div className="space-y-1">
                              <p className="font-medium leading-none">
                                {item.judul || "Tanpa Judul"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                ID: {item.id}
                              </p>
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
                          <TableCell className="text-muted-foreground">
                            {item.createdAt 
                              ? format(new Date(item.createdAt), 'dd MMM yyyy', { locale: localeID })
                              : '-'
                            }
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <PendaftaranActions pendaftaran={item} />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-32">
                          <div className="flex items-center justify-center text-center">
                            <div className="space-y-3">
                              <Search className="h-8 w-8 text-muted-foreground mx-auto" />
                              <h3 className="font-medium">Tidak ada hasil</h3>
                              <p className="text-sm text-muted-foreground">
                                Tidak ada pendaftaran yang cocok dengan filter Anda.
                              </p>
                              {hasActiveFilters && (
                                <Button variant="outline" size="sm" onClick={clearFilters}>
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
                    <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">Belum Ada Pendaftaran</h3>
                      <p className="text-muted-foreground">
                        Mulai lindungi karya Anda dengan mendaftarkan hak cipta. 
                        Proses pendaftaran mudah dan cepat.
                      </p>
                    </div>
                    <Button onClick={handleCreateDraft} size="lg" className="mt-4">
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
  );
}
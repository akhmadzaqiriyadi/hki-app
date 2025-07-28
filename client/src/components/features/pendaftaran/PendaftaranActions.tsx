"use client";

import React from "react";
import Link from "next/link";
import { useDeleteRegistration } from "@/queries/mutations/useDeleteRegistration";
import { useFinalizeRegistration } from "@/queries/mutations/useFinalizeRegistration";
import { Pendaftaran } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2, Loader2, Send, CheckCircle } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { FinalizeButton } from "./FinalizeButton";

// Enhanced FinalizeButton Component sudah dipindah ke file terpisah

export function PendaftaranActions({ pendaftaran }: { pendaftaran: Pendaftaran }) {
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const deleteMutation = useDeleteRegistration();

  const isDraft = pendaftaran.status === "draft";
  const isRevisi = pendaftaran.status === "revisi";

  const handleDelete = () => {
    deleteMutation.mutate(pendaftaran.id, {
        onSuccess: () => setIsConfirmOpen(false),
    });
  };

  return (
    <>
      {/* Enhanced Alert Dialog with improved styling */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="border-red-200/50 bg-gradient-to-br from-red-50/80 to-white backdrop-blur-sm shadow-xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center shadow-lg">
                <Trash2 className="h-6 w-6 text-red-700" />
              </div>
              <div>
                <AlertDialogTitle className="text-lg font-bold text-slate-800">
                  Konfirmasi Penghapusan
                </AlertDialogTitle>
              </div>
            </div>
            <AlertDialogDescription className="text-slate-600 font-medium">
              Aksi ini tidak dapat dibatalkan. Pendaftaran "<span className="font-semibold text-slate-800">{pendaftaran.judul || 'Tanpa Judul'}</span>" akan dihapus secara permanen dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md transition-all duration-200">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={deleteMutation.isPending}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {deleteMutation.isPending ? 'Menghapus...' : 'Ya, Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Enhanced Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0 hover:bg-blue-50 hover:shadow-md transition-all duration-200 border border-transparent hover:border-blue-200"
          >
            <span className="sr-only">Buka menu aksi</span>
            <MoreHorizontal className="h-4 w-4 text-slate-600" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-56 border-blue-200/50 bg-white/95 backdrop-blur-sm shadow-xl"
        >
          {/* View Detail */}
          <DropdownMenuItem asChild className="focus:bg-blue-50 focus:text-blue-700 transition-colors duration-200">
            <Link href={`/dashboard/pendaftaran/${pendaftaran.id}`} className="flex items-center gap-3 py-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <Eye className="h-4 w-4 text-blue-700" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">Lihat Detail</div>
                <div className="text-xs text-slate-500">Informasi lengkap pendaftaran</div>
              </div>
            </Link>
          </DropdownMenuItem>

          {/* Edit for Draft/Revision */}
          {(isDraft || isRevisi) && (
            <DropdownMenuItem asChild className="focus:bg-amber-50 focus:text-amber-700 transition-colors duration-200">
              <Link href={`/dashboard/pendaftaran/edit/${pendaftaran.id}`} className="flex items-center gap-3 py-2.5">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center">
                  <Edit className="h-4 w-4 text-amber-700" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {isRevisi ? 'Perbaiki' : 'Lanjutkan'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {isRevisi ? 'Revisi sesuai catatan' : 'Lengkapi pendaftaran'}
                  </div>
                </div>
              </Link>
            </DropdownMenuItem>
          )}

          {/* Draft-specific actions */}
          {isDraft && (
            <>
              <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
              
              {/* Finalize Button */}
              <DropdownMenuItem 
                onSelect={(e) => e.preventDefault()} 
                className="focus:bg-green-50 focus:text-green-700 transition-colors duration-200 p-0"
              >
                <div className="flex items-center gap-3 py-2.5 px-2 w-full">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                    <Send className="h-4 w-4 text-green-700" />
                  </div>
                  <div className="flex-1">
                    <FinalizeButton 
                      pendaftaranId={pendaftaran.id} 
                      variant="menuItem"
                      showIcon={false}
                    />
                    <div className="text-xs text-slate-500 mt-0.5">Submit untuk review</div>
                  </div>
                </div>
              </DropdownMenuItem>

              {/* Delete Draft */}
              <DropdownMenuItem 
                onClick={() => setIsConfirmOpen(true)} 
                className="focus:bg-red-50 focus:text-red-700 transition-colors duration-200"
              >
                <div className="flex items-center gap-3 py-2.5">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                    <Trash2 className="h-4 w-4 text-red-700" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Hapus Draf</div>
                    <div className="text-xs text-slate-500">Hapus permanen dari sistem</div>
                  </div>
                </div>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
"use client";

import React from "react";
import Link from "next/link";
import { useDeleteRegistration } from "@/queries/mutations/useDeleteRegistration";
import { Pendaftaran } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2, Loader2, Send } from "lucide-react"; // <-- Impor ikon Send
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FinalizeButton } from "./FinalizeButton"; // <-- Impor komponen FinalizeButton

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
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Anda Yakin?</AlertDialogTitle><AlertDialogDescription>Aksi ini tidak dapat dibatalkan. Draf pendaftaran akan dihapus secara permanen.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteMutation.isPending} className="bg-destructive hover:bg-destructive/90">
                {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Buka menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/pendaftaran/${pendaftaran.id}`}><Eye className="mr-2 h-4 w-4" />Lihat Detail</Link>
          </DropdownMenuItem>
          {(isDraft || isRevisi) && (
            <DropdownMenuItem asChild>
                <Link href={`/dashboard/pendaftaran/edit/${pendaftaran.id}`}><Edit className="mr-2 h-4 w-4" />Perbaiki / Lanjutkan</Link>
            </DropdownMenuItem>
          )}
          {isDraft && (
            <>
              <DropdownMenuSeparator />
              {/* --- PERBAIKAN UX DI SINI --- */}
              {/* Tombol Finalisasi sekarang ada di dalam menu */}
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-green-600 focus:text-green-700 focus:bg-green-50">
                  {/* Kita bungkus FinalizeButton di dalam menu item */}
                  <FinalizeButton pendaftaranId={pendaftaran.id} />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsConfirmOpen(true)} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />Hapus Draf
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
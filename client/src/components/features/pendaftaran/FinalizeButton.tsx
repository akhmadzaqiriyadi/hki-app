"use client";

import React from "react";
import { useFinalizeRegistration } from "@/queries/mutations/useFinalizeRegistration";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function FinalizeButton({ pendaftaranId }: { pendaftaranId: string }) {
  const finalizeMutation = useFinalizeRegistration();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <Send className="mr-2 h-4 w-4" /> Finalisasi & Kirim
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Anda Yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Setelah difinalisasi, pendaftaran akan dikirim untuk direview dan Anda tidak dapat mengubah datanya lagi.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={() => finalizeMutation.mutate(pendaftaranId)} disabled={finalizeMutation.isPending}>
            {finalizeMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Ya, Kirim Sekarang
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
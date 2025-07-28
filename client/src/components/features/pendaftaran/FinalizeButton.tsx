"use client";

import React from "react";
import { useFinalizeRegistration } from "@/queries/mutations/useFinalizeRegistration";
import { Button } from "@/components/ui/button";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";

interface FinalizeButtonProps {
  pendaftaranId: string;
  className?: string;
  showIcon?: boolean;
  variant?: "default" | "menuItem";
  children?: React.ReactNode;
}

export function FinalizeButton({ 
  pendaftaranId, 
  className = "", 
  showIcon = true,
  variant = "default",
  children
}: FinalizeButtonProps) {
  const finalizeMutation = useFinalizeRegistration();

  const defaultClassName = variant === "menuItem" 
    ? "w-full justify-start p-0 h-auto bg-transparent hover:bg-transparent text-inherit font-medium text-sm"
    : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105";

  const buttonContent = children || (
    <>
      {showIcon && <Send className="mr-2 h-4 w-4" />}
      {variant === "menuItem" ? "Finalisasi & Kirim" : "Finalisasi & Kirim"}
    </>
  );
  
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className={className || defaultClassName}>
          {buttonContent}
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent className="border-green-200/50 bg-gradient-to-br from-green-50/80 to-white backdrop-blur-sm shadow-xl">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center shadow-lg">
              <Send className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <AlertDialogTitle className="text-lg font-bold text-slate-800">
                Konfirmasi Finalisasi
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="text-slate-600 font-medium">
            Setelah difinalisasi, pendaftaran akan dikirim untuk direview dan Anda tidak dapat mengubah datanya lagi. Pastikan semua informasi sudah benar dan lengkap.
          </AlertDialogDescription>
          
          {/* Additional Info Box */}
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 border border-green-200/50 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mt-0.5">
                <CheckCircle className="h-4 w-4 text-blue-700" />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-semibold text-sm text-slate-800">Yang akan terjadi:</h4>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                    Pendaftaran akan masuk ke sistem review
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                    Status berubah menjadi "Submitted"
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                    Data tidak dapat diubah lagi
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel className="border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md transition-all duration-200">
            Periksa Kembali
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => finalizeMutation.mutate(pendaftaranId)} 
            disabled={finalizeMutation.isPending}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:scale-100"
          >
            {finalizeMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Ya, Kirim Sekarang
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
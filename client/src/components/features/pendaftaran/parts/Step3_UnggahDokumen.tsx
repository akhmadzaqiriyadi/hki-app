"use client";
import React, { useState } from "react";
import { useFormContext, useController } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { 
    Wallet, 
    Upload, 
    FileText, 
    Download, 
    Loader2, 
    Replace,
    ExternalLink,
    CheckCircle
} from "lucide-react";
import { FormValues } from "@/lib/pendaftaran/schema";
import { useDownloadFile } from "@/queries/mutations/useDownloadFile";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Helper Component untuk menampilkan field upload file (tetap sama)
const FileUploadField = ({ name, label, isRequired }: { name: keyof FormValues, label:string, isRequired: boolean }) => {
  const { control, register, setValue, formState: { errors } } = useFormContext<FormValues>();
  const { field } = useController({ name, control });
  const [isReplacing, setIsReplacing] = useState(false);
  const downloadMutation = useDownloadFile();
  
  const currentFileUrl = typeof field.value === 'string' ? field.value : null;

  const handleDownload = () => {
    if (currentFileUrl) {
      const filename = currentFileUrl.split('/').pop() || 'downloaded-file';
      const protectedUrl = `/api/pendaftaran/file/${filename}`;
      downloadMutation.mutate(protectedUrl);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setValue(name, e.target.files as any, { shouldValidate: true });
      if(isReplacing) setIsReplacing(false);
    }
  }

  const hasError = !!errors[name];

  return (
    <FormItem>
      <FormLabel className="text-slate-700 font-semibold">
        {label}{isRequired && '*'}
      </FormLabel>
      {currentFileUrl && !isReplacing ? (
        <div className="border border-blue-200/50 rounded-xl p-3 flex items-center justify-between bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-md">
          <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center shadow-md">
                <FileText className="h-5 w-5 text-blue-700" />
              </div>
              <span className="text-sm truncate font-mono text-slate-700" title={currentFileUrl.split('/').pop()}>
                  {currentFileUrl.split('/').pop()}
              </span>
          </div>
          <div className="flex gap-2">
            <Button 
              type="button"
              onClick={handleDownload} 
              variant="outline" 
              size="sm" 
              disabled={downloadMutation.isPending}
              className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              {downloadMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            </Button>
            <Button
              type="button"
              onClick={() => setIsReplacing(true)}
              variant="secondary"
              size="sm"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 hover:shadow-md transition-all duration-200"
            >
              <Replace className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <FormControl>
           <Input 
             type="file" 
             onChange={handleFileChange} 
             className={cn("border-blue-200/50 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80 backdrop-blur-sm", hasError && "border-destructive")}
           />
        </FormControl>
      )}
      <FormMessage />
    </FormItem>
  )
}

const formInputStyle = "border-blue-200/50 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80 backdrop-blur-sm";

export function Step3UnggahDokumen() {
  const { watch } = useFormContext<FormValues>();
  const jenisPemilik = watch("jenis_pemilik");

  return (
    <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-3">
          <Upload className="h-6 w-6" />
          Langkah 3: Unggah Dokumen
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-slate-600 font-medium">
          Lengkapi semua dokumen yang diperlukan. File yang sudah diunggah akan ditampilkan di sini.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <Alert className="bg-gradient-to-r from-blue-50/80 to-indigo-50/50 rounded-lg border border-blue-200/50 text-blue-800">
          <Wallet className="h-4 w-4" />
          <AlertTitle className="font-semibold text-blue-900">
            Informasi Pembayaran
          </AlertTitle>
          <AlertDescription className="text-xs sm:text-sm leading-relaxed text-blue-800">
            Anda belum perlu melakukan pembayaran saat ini. Tagihan dan instruksi pembayaran akan muncul di dasbor Anda setelah pendaftaran disetujui oleh admin.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <FileUploadField name="lampiran_karya_url" label="Lampiran Contoh Karya" isRequired={true} />
          <FileUploadField name="surat_pernyataan_url" label="Surat Pernyataan" isRequired={true} />
          <FileUploadField name="scan_ktp_kolektif_url" label="Scan KTP Kolektif (dalam 1 PDF)" isRequired={true} />

          {jenisPemilik === 'Civitas Akademik UTY' && (
            <FileUploadField name="surat_pengalihan_url" label="Surat Pengalihan Hak" isRequired={false} />
          )}
        </div>

        {/* --- KONTEN BARU DITAMBAHKAN DI SINI --- */}
        <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/50 rounded-lg sm:rounded-xl border border-blue-200/50">
          <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
            <Download className="h-4 w-4" />
            Dokumen Pendukung
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-xs sm:text-sm text-blue-700">
              <p className="font-medium mb-1">
                📄 Surat Pernyataan Hak Cipta:
              </p>
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

            <div className="text-xs sm:text-sm text-blue-700 pt-2 md:pt-0 md:border-l border-blue-200/50 md:pl-4">
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
          
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-semibold text-green-900">
                  Tanda Tangan Rektor
                </h5>
                <p className="text-xs text-green-800 mt-1 leading-relaxed">
                  Untuk mendapatkan tanda tangan Rektor, silakan kirimkan
                  berkas fisik (hardfile) Surat Pengalihan Hak ke{" "}
                  <strong>Sekretariat Sentra HKI UCH</strong> di Kampus 1
                  UTY (Lokasi: Depan Ruang Kelas E02).
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* --- AKHIR DARI KONTEN BARU --- */}
      </CardContent>
    </Card>
  );
}
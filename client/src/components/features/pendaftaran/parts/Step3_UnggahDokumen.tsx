"use client";
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Wallet } from 'lucide-react';

export function Step3UnggahDokumen() {
  const { control, register } = useFormContext(); // Ambil 'register' dari context

  return (
    <Card>
      <CardHeader>
        <CardTitle>Langkah 3: Unggah Dokumen</CardTitle>
        <CardDescription>
            Lengkapi semua dokumen yang diperlukan. Pastikan format dan ukurannya sesuai.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-blue-50 border-blue-200 text-blue-800">
            <Wallet className="h-4 w-4" />
            <AlertTitle className="font-semibold">Informasi Pembayaran</AlertTitle>
            <AlertDescription className="text-xs leading-relaxed">
                Anda tidak perlu melakukan pembayaran saat ini. Tagihan dan instruksi pembayaran akan muncul di dasbor Anda setelah pendaftaran disetujui.
            </AlertDescription>
        </Alert>
        
        <FormField
          control={control}
          name="lampiran_karya_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lampiran Contoh Karya*</FormLabel>
              <FormControl>
                {/* Gunakan register untuk menghubungkan input file */}
                <Input type="file" {...register("lampiran_karya_url")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="surat_pernyataan_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Surat Pernyataan*</FormLabel>
              <FormControl>
                <Input type="file" {...register("surat_pernyataan_url")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="scan_ktp_kolektif_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scan KTP Kolektif (dalam 1 PDF)*</FormLabel>
              <FormControl>
                <Input type="file" {...register("scan_ktp_kolektif_url")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="surat_pengalihan_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Surat Pengalihan Hak (Opsional)</FormLabel>
              <FormControl>
                <Input type="file" {...register("surat_pengalihan_url")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
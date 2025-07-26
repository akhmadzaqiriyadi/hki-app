"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, Download, Loader2 } from 'lucide-react';
import { useDownloadFile } from '@/queries/mutations/useDownloadFile';

// Helper untuk menampilkan item detail (Label dan Value)
export function DetailItem({ label, value }: { label: string; value: string | null | undefined }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 py-3 border-b last:border-b-0">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm col-span-2 font-semibold break-words">{value}</dd>
    </div>
  );
}

// Helper untuk menampilkan link unduh file yang aman
export function FilePreviewLink({ url, label }: { url?: string | null; label: string }) {
  const downloadMutation = useDownloadFile();

  if (!url) {
    return (
      <div className="p-4 border rounded-lg text-center bg-muted/50">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">Tidak ada file.</p>
      </div>
    );
  }

  const filename = url.split('/').pop();
  const protectedUrl = `/api/pendaftaran/file/${filename}`;

  const handleDownload = () => {
    downloadMutation.mutate(protectedUrl);
  };

  return (
    <div>
        <p className="text-sm font-medium mb-2">{label}</p>
        <div className="border rounded-lg p-2 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="h-8 w-8 text-blue-600 flex-shrink-0" />
                <span className="text-sm truncate font-mono" title={filename}>
                    {filename}
                </span>
            </div>
            <Button onClick={handleDownload} variant="outline" size="sm" disabled={downloadMutation.isPending}>
                {downloadMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                Lihat
            </Button>
        </div>
    </div>
  );
}
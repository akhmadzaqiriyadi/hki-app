"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, Download, Loader2 } from 'lucide-react';
import { useDownloadFile } from '@/queries/mutations/useDownloadFile';

export function DetailItem({ label, value }: { label: string; value: string | null | undefined }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 py-3 border-b border-blue-100/50 last:border-b-0">
      <dt className="text-sm font-medium text-slate-600">{label}</dt>
      <dd className="text-sm col-span-2 font-semibold break-words text-slate-800">{value}</dd>
    </div>
  );
}

export function FilePreviewLink({ url, label }: { url?: string | null; label: string }) {
  const downloadMutation = useDownloadFile();

  if (!url) {
    return (
      <div className="p-4 border border-slate-200 rounded-xl text-center bg-gradient-to-br from-slate-50/50 to-slate-100/30">
        <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
          <FileText className="h-6 w-6 text-slate-500" />
        </div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-xs text-slate-500">Tidak ada file.</p>
      </div>
    );
  }

  const filename = url.split('/').pop();
  const protectedUrl = `/api/pendaftaran/file/${filename}`;

  const handleDownload = () => {
    downloadMutation.mutate(protectedUrl);
  };

  return (
    <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        <div className="border border-blue-200/50 rounded-xl p-3 flex items-center justify-between bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-16 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center shadow-md">
                  <FileText className="h-5 w-5 text-blue-700" />
                </div>
                <span className="text-sm truncate font-mono text-slate-700" title={filename}>{filename}</span>
            </div>
            <Button onClick={handleDownload} variant="outline" size="sm" disabled={downloadMutation.isPending} className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md transition-all duration-200 hover:scale-105">
                {downloadMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                Lihat
            </Button>
        </div>
    </div>
  );
}
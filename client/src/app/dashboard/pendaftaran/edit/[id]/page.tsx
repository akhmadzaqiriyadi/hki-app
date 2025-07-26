// src/app/(dashboard)/pendaftaran/edit/[id]/page.tsx
"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { useGetRegistrationById } from '@/queries/queries/useGetRegistrationById';
import PendaftaranForm from '@/components/features/pendaftaran/PendaftaranForm';
import { Loader2, AlertCircle } from 'lucide-react';

export default function EditPendaftaranPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: pendaftaran, isLoading, isError, error } = useGetRegistrationById(id);

  if (isLoading) {
    return <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  if (isError) {
    return <div className="text-red-600 p-8 text-center"><AlertCircle className="mx-auto mb-2 h-8 w-8" /> Terjadi kesalahan: {error.message}</div>;
  }

  // Cek apakah statusnya bisa diedit
  if (pendaftaran && pendaftaran.status !== 'draft' && pendaftaran.status !== 'revisi') {
     return <div className="text-amber-600 p-8 text-center"><AlertCircle className="mx-auto mb-2 h-8 w-8" /> Pendaftaran ini sudah tidak bisa diedit karena statusnya adalah "{pendaftaran.status}".</div>;
  }

  return (
    <div className="space-y-6">
       <div>
          <h1 className="text-3xl font-bold">Edit Pendaftaran</h1>
          <p className="text-muted-foreground">Lanjutkan pengisian draf untuk karya "{pendaftaran?.judul}".</p>
        </div>
      {pendaftaran && <PendaftaranForm pendaftaran={pendaftaran} />}
    </div>
  );
}
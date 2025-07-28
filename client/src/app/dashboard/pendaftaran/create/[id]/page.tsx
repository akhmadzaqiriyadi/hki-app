"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { useGetRegistrationById } from '@/queries/queries/useGetRegistrationById';
import PendaftaranForm from '@/components/features/pendaftaran/PendaftaranForm';
import { Loader2, AlertCircle } from 'lucide-react';
import FormPageHeader from '@/components/features/pendaftaran/FormPageHeader';

export default function CreatePendaftaranPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: pendaftaran, isLoading, isError, error } = useGetRegistrationById(id);

  if (isLoading) {
    return <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  if (isError) {
    return <div className="text-red-600 p-8 text-center"><AlertCircle className="mx-auto mb-2 h-8 w-8" /> Terjadi kesalahan: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <FormPageHeader 
        title="Form Pendaftaran HKI"
        description="Lengkapi informasi berikut untuk mendaftarkan karya Anda"
      />
      {pendaftaran && <PendaftaranForm pendaftaran={pendaftaran} />}
    </div>
  );
}
"use client";

import React, { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pendaftaran } from '@/lib/types';
import { formSchema, FormValues, defaultPencipta } from '@/lib/pendaftaran/schema';
import { useUpdateRegistration } from '@/queries/mutations/useUpdateRegistration';
import { format } from 'date-fns';

// Import UI and Step Components
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Save, Send, Loader2 } from 'lucide-react';
import { Step1InformasiKarya } from './parts/Step1_InformasiKarya';
import { Step2DataPencipta } from './parts/Step2_DataPencipta';
import { Step3UnggahDokumen } from './parts/Step3_UnggahDokumen';

// Tipe data untuk wilayah
interface Wilayah {
  id: string;
  name: string;
}

interface PendaftaranFormProps {
  pendaftaran: Pendaftaran;
}

export default function PendaftaranForm({ pendaftaran }: PendaftaranFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const updateMutation = useUpdateRegistration();

  const [provinces, setProvinces] = useState<Wilayah[]>([]);
  const [cities, setCities] = useState<Wilayah[][]>([[]]);
  const [districts, setDistricts] = useState<Wilayah[][]>([[]]);
  const [villages, setVillages] = useState<Wilayah[][]>([[]]);

  // Fungsi untuk membersihkan data dari nilai null agar tidak error di form
  const sanitizeData = (data: Pendaftaran): Partial<FormValues> => {
    const sanitized: any = {};
    for (const key in data) {
      const value = (data as any)[key];
      sanitized[key] = value === null ? '' : value;
    }
    return {
        ...sanitized,
        tanggal_diumumkan: data.tanggal_diumumkan ? new Date(data.tanggal_diumumkan) : undefined,
        pencipta: data.pencipta?.length > 0 ? data.pencipta.map((p: any) => {
            const sanitizedPencipta: any = {};
            for (const pKey in p) {
                const pValue = (p as any)[pKey];
                sanitizedPencipta[pKey] = pValue === null ? '' : pValue;
            }
            return sanitizedPencipta;
        }) : [defaultPencipta],
    };
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: sanitizeData(pendaftaran),
    mode: "onChange",
  });

  useEffect(() => {
    const getProvinces = async () => {
      const API_KEY = process.env.NEXT_PUBLIC_BINDERBYTE_API_KEY;
      try {
        const response = await fetch(`https://api.binderbyte.com/wilayah/provinsi?api_key=${API_KEY}`);
        const data = await response.json();
        if (data && Array.isArray(data.value)) setProvinces(data.value);
      } catch (error) { console.error("Gagal mengambil data provinsi:", error); }
    };
    getProvinces();
  }, []);

  const processSubmit = (status: 'draft' | 'submitted') => {
    const values = form.getValues();
    const formData = new FormData();
    
    // Mengubah ID wilayah menjadi nama sebelum mengirim ke backend
    const resolvedPencipta = values.pencipta.map((p, index) => {
        const provinceName = provinces.find(prov => prov.id === p.provinsi)?.name || p.provinsi;
        const cityName = (cities[index] || []).find(city => city.id === p.kota)?.name || p.kota;
        const districtName = (districts[index] || []).find(dist => dist.id === p.kecamatan)?.name || p.kecamatan;
        const villageName = (villages[index] || []).find(vill => vill.id === p.kelurahan)?.name || p.kelurahan;

        return {
            ...p,
            provinsi: provinceName,
            kota: cityName,
            kecamatan: districtName,
            kelurahan: villageName,
        };
    });

    Object.entries(values).forEach(([key, value]) => {
      if (key === 'pencipta') {
        formData.append(key, JSON.stringify(resolvedPencipta));
      } else if (key === 'tanggal_diumumkan' && value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (key.endsWith('_url') && value instanceof FileList) {
        if (value.length > 0) {
          formData.append(key, value[0]);
        }
      } else if (value != null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    formData.append('status', status);
    updateMutation.mutate({ id: pendaftaran.id, formData });
  };

  const isPending = updateMutation.isPending;

  return (
    <FormProvider {...form}>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div>
          {currentStep === 1 && <Step1InformasiKarya />}
          {currentStep === 2 && (
            <Step2DataPencipta
              provinces={provinces}
              cities={cities}
              districts={districts}
              villages={villages}
              setCities={setCities}
              setDistricts={setDistricts}
              setVillages={setVillages}
            />
          )}
          {currentStep === 3 && <Step3UnggahDokumen />}
        </div>
        <div className="flex justify-between items-center pt-6 border-t">
          <Button type="button" variant="outline" onClick={() => setCurrentStep(s => Math.max(s - 1, 1))} disabled={currentStep === 1 || isPending}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
          <div className="flex gap-4">
            {currentStep === 3 ? (
              <>
                <Button variant="secondary" onClick={() => processSubmit('draft')} disabled={isPending}>
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Simpan Draf
                </Button>
                <Button onClick={form.handleSubmit(() => processSubmit('submitted'))} disabled={isPending}>
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  Finalisasi & Kirim
                </Button>
              </>
            ) : (
              <Button type="button" onClick={() => setCurrentStep(s => Math.min(s + 1, 3))} disabled={isPending}>
                Selanjutnya <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
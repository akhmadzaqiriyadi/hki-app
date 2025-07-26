"use client";

import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { FormValues, defaultPencipta } from '@/lib/pendaftaran/schema';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PenciptaFormCard } from './PenciptaFormCard';

// Tipe data untuk wilayah dari API
interface Wilayah {
  id: string;
  name: string;
}

// Props yang diterima komponen ini (sama seperti di file placeholder Anda)
interface Step2Props {
    provinces: Wilayah[];
    cities: Wilayah[][];
    districts: Wilayah[][];
    villages: Wilayah[][];
    setCities: React.Dispatch<React.SetStateAction<Wilayah[][]>>;
    setDistricts: React.Dispatch<React.SetStateAction<Wilayah[][]>>;
    setVillages: React.Dispatch<React.SetStateAction<Wilayah[][]>>;
}

export function Step2DataPencipta({ provinces, cities, districts, villages, setCities, setDistricts, setVillages }: Step2Props) {
  const { control } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "pencipta",
  });

  return (
    <Card>
        <CardHeader>
            <CardTitle>Langkah 2: Data Pencipta</CardTitle>
            <CardDescription>
                Isi data lengkap untuk semua pencipta karya. Anda bisa menambahkan lebih dari satu.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {fields.map((field, index) => (
                <PenciptaFormCard
                    key={field.id}
                    index={index}
                    onRemove={remove}
                    provinces={provinces}
                    cities={cities[index] || []}
                    districts={districts[index] || []}
                    villages={villages[index] || []}
                    setCitiesForIndex={(newCities) => {
                        const allCities = [...cities];
                        allCities[index] = newCities;
                        setCities(allCities);
                    }}
                    setDistrictsForIndex={(newDistricts) => {
                        const allDistricts = [...districts];
                        allDistricts[index] = newDistricts;
                        setDistricts(allDistricts);
                    }}
                    setVillagesForIndex={(newVillages) => {
                        const allVillages = [...villages];
                        allVillages[index] = newVillages;
                        setVillages(allVillages);
                    }}
                />
            ))}
            <Button
                type="button"
                variant="outline"
                onClick={() => {
                    append(defaultPencipta);
                    // Juga tambahkan slot kosong untuk state alamat
                    setCities(c => [...c, []]);
                    setDistricts(d => [...d, []]);
                    setVillages(v => [...v, []]);
                }}
            >
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah Pencipta
            </Button>
        </CardContent>
    </Card>
  );
}
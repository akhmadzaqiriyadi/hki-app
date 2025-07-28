"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { PlusCircle, Users, Info } from "lucide-react";

import { FormValues, defaultPencipta } from "@/lib/pendaftaran/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PenciptaFormCard } from "./PenciptaFormCard";

// Tipe data untuk wilayah dari API
interface Wilayah {
  id: string;
  name: string;
}

// Props yang diterima komponen
interface Step2Props {
  provinces: Wilayah[];
  cities: Wilayah[][];
  districts: Wilayah[][];
  villages: Wilayah[][];
  setCities: React.Dispatch<React.SetStateAction<Wilayah[][]>>;
  setDistricts: React.Dispatch<React.SetStateAction<Wilayah[][]>>;
  setVillages: React.Dispatch<React.SetStateAction<Wilayah[][]>>;
}

export function Step2DataPencipta({
  provinces,
  cities,
  districts,
  villages,
  setCities,
  setDistricts,
  setVillages,
}: Step2Props) {
  const { control } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "pencipta",
  });

  return (
    <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-3">
          <Users className="h-6 w-6" />
          Langkah 2: Data Pencipta
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-slate-600 font-medium">
          Lengkapi data untuk semua pencipta karya. Anda bisa menambahkan lebih
          dari satu pencipta jika karya dibuat secara kolektif.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Info card untuk data pencipta */}
        <div className="p-3 bg-gradient-to-r from-blue-50/80 to-indigo-50/50 rounded-lg border border-blue-200/50 flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-700 flex-shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-blue-800">
            <strong>Penting:</strong> Pastikan data pencipta yang diisi sesuai
            dengan KTP. Data ini akan tercantum pada sertifikat hak cipta.
            Pencipta pertama yang Anda tambahkan akan dianggap sebagai
            koordinator.
          </p>
        </div>

        <div className="space-y-6">
          {fields.map((field, index) => (
            <PenciptaFormCard
              key={field.id}
              index={index}
              onRemove={() => remove(index)}
              isOnlyOne={fields.length === 1}
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
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto border-blue-200/50 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80 backdrop-blur-sm hover:bg-blue-50 text-slate-700 font-semibold"
          onClick={() => {
            append(defaultPencipta);
            setCities((c) => [...c, []]);
            setDistricts((d) => [...d, []]);
            setVillages((v) => [...v, []]);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Pencipta
        </Button>
      </CardContent>
    </Card>
  );
}
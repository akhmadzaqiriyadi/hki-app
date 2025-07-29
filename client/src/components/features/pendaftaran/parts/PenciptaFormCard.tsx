"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Trash2,
  User,
  Contact,
  MapPin,
  GraduationCap,
  Briefcase,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { FormValues } from "@/lib/pendaftaran/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const programStudiUTY = [
  "-",
  "D3 Akuntansi",
  "D3 Sistem Informasi",
  "D4 Destinasi Pariwisata",
  "S1 Akuntansi",
  "S1 Arsitektur",
  "S1 Bimbingan dan Konseling",
  "S1 Ilmu Hubungan Internasional",
  "S1 Ilmu Komunikasi",
  "S1 Informatika",
  "S1 Informatika Medis",
  "S1 Manajemen",
  "S1 Pendidikan Bahasa Inggris",
  "S1 Pendidikan Teknologi Informasi",
  "S1 Perencanaan Wilayah dan Kota",
  "S1 Psikologi",
  "S1 Sains Data",
  "S1 Sastra Inggris",
  "S1 Sistem Informasi",
  "S1 Teknik Elektro",
  "S1 Teknik Industri",
  "S1 Teknik Komputer",
  "S1 Teknik Sipil",
  "S2 Manajemen",
  "S2 Teknologi Informasi",
  "S3 Ilmu Manajemen"
];

interface PenciptaFormCardProps {
  index: number;
  onRemove: (index: number) => void;
  isOnlyOne: boolean;
  provinces: any[];
  cities: any[];
  districts: any[];
  villages: any[];
  setCitiesForIndex: (cities: any[]) => void;
  setDistrictsForIndex: (districts: any[]) => void;
  setVillagesForIndex: (villages: any[]) => void;
}

const formInputStyle =
  "border-blue-200/50 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80 backdrop-blur-sm";

export function PenciptaFormCard({
  index,
  onRemove,
  isOnlyOne,
  provinces,
  cities,
  districts,
  villages,
  setCitiesForIndex,
  setDistrictsForIndex,
  setVillagesForIndex,
}: PenciptaFormCardProps) {
  const { control, setValue } = useFormContext<FormValues>();
  const [isLoading, setIsLoading] = useState({
    cities: false,
    districts: false,
    villages: false,
  });
  const API_KEY = process.env.NEXT_PUBLIC_BINDERBYTE_API_KEY;

  const getCities = async (provinceId: string) => {
    if (!provinceId) return;
    setIsLoading((prev) => ({ ...prev, cities: true }));
    setValue(`pencipta.${index}.kota`, "");
    setValue(`pencipta.${index}.kecamatan`, "");
    setValue(`pencipta.${index}.kelurahan`, "");
    setCitiesForIndex([]);
    setDistrictsForIndex([]);
    setVillagesForIndex([]);
    try {
      const response = await fetch(
        `https://api.binderbyte.com/wilayah/kabupaten?api_key=${API_KEY}&id_provinsi=${provinceId}`
      );
      const data = await response.json();
      setCitiesForIndex(data.value || []);
    } catch (error) {
      console.error("Gagal mengambil data kota:", error);
      setCitiesForIndex([]);
    } finally {
      setIsLoading((prev) => ({ ...prev, cities: false }));
    }
  };

  const getDistricts = async (cityId: string) => {
    if (!cityId) return;
    setIsLoading((prev) => ({ ...prev, districts: true }));
    setValue(`pencipta.${index}.kecamatan`, "");
    setValue(`pencipta.${index}.kelurahan`, "");
    setDistrictsForIndex([]);
    setVillagesForIndex([]);
    try {
      const response = await fetch(
        `https://api.binderbyte.com/wilayah/kecamatan?api_key=${API_KEY}&id_kabupaten=${cityId}`
      );
      const data = await response.json();
      setDistrictsForIndex(data.value || []);
    } catch (error) {
      console.error("Gagal mengambil data kecamatan:", error);
      setDistrictsForIndex([]);
    } finally {
      setIsLoading((prev) => ({ ...prev, districts: false }));
    }
  };

  const getVillages = async (districtId: string) => {
    if (!districtId) return;
    setIsLoading((prev) => ({ ...prev, villages: true }));
    setValue(`pencipta.${index}.kelurahan`, "");
    setVillagesForIndex([]);
    try {
      const response = await fetch(
        `https://api.binderbyte.com/wilayah/kelurahan?api_key=${API_KEY}&id_kecamatan=${districtId}`
      );
      const data = await response.json();
      setVillagesForIndex(data.value || []);
    } catch (error) {
      console.error("Gagal mengambil data kelurahan:", error);
      setVillagesForIndex([]);
    } finally {
      setIsLoading((prev) => ({ ...prev, villages: false }));
    }
  };


  return (
    <Card className="border-blue-200/50 bg-white/70 backdrop-blur-sm shadow-lg">
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-3">
            <User className="h-5 w-5" />
            Pencipta {index + 1}
          </CardTitle>
          {index === 0 && (
            <CardDescription className="text-xs sm:text-sm text-slate-600 mt-1">
              Koordinator
            </CardDescription>
          )}
        </div>
        {!isOnlyOne && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onRemove(index)}
            className="flex-shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Informasi Personal */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-700 font-semibold border-b border-blue-100 pb-2">
            <Briefcase className="h-4 w-4 text-blue-700" />
            <span className="text-sm sm:text-base">Identitas Diri</span>
          </div>
          <FormField
            control={control}
            name={`pencipta.${index}.nama_lengkap`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-semibold">
                  Nama Lengkap (Sesuai KTP)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Contoh: Budi Sanjaya"
                    {...field}
                    className={formInputStyle}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name={`pencipta.${index}.nik`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">
                    NIK
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="340xxxxxxxxxxxxx"
                      {...field}
                      className={formInputStyle}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`pencipta.${index}.kewarganegaraan`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">
                    Kewarganegaraan
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Indonesia"
                      {...field}
                      className={formInputStyle}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Informasi Kontak */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-700 font-semibold border-b border-blue-100 pb-2">
            <Contact className="h-4 w-4 text-blue-700" />
            <span className="text-sm sm:text-base">Informasi Kontak</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name={`pencipta.${index}.email`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">
                    Email Aktif
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="budi.sanjaya@example.com"
                      {...field}
                      className={formInputStyle}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`pencipta.${index}.no_hp`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">
                    No. HP (WhatsApp)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0812xxxxxxxx"
                      {...field}
                      className={formInputStyle}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Informasi Akademik (Opsional) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-700 font-semibold border-b border-blue-100 pb-2">
            <GraduationCap className="h-4 w-4 text-blue-700" />
            <span className="text-sm sm:text-base">
              Informasi Akademik (Khusus civitas UTY)
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name={`pencipta.${index}.nip_nim`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">
                    NUPTK/NPM
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="NUPTK atau NPM..."
                      {...field}
                      className={formInputStyle}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`pencipta.${index}.program_studi`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">
                    Program Studi
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className={formInputStyle}>
                        <SelectValue placeholder="Pilih prodi..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {programStudiUTY.map((prodi) => (
                        <SelectItem key={prodi} value={prodi}>
                          {prodi}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Alamat Sesuai KTP */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-700 font-semibold border-b border-blue-100 pb-2">
            <MapPin className="h-4 w-4 text-blue-700" />
            <span className="text-sm sm:text-base">Alamat Sesuai KTP</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Provinsi */}
            <FormField
              control={control}
              name={`pencipta.${index}.provinsi`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">
                    Provinsi
                  </FormLabel>
                  <Select
                    onValueChange={(v) => {
                      field.onChange(v);
                      getCities(v);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className={formInputStyle}>
                        <SelectValue placeholder="Pilih provinsi..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {provinces.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Kota/Kabupaten */}
            <FormField
              control={control}
              name={`pencipta.${index}.kota`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">
                    Kota/Kabupaten
                  </FormLabel>
                  <Select
                    onValueChange={(v) => {
                      field.onChange(v);
                      getDistricts(v);
                    }}
                    value={field.value}
                    disabled={isLoading.cities || cities.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          formInputStyle,
                          (isLoading.cities || cities.length === 0) &&
                            "opacity-60 cursor-not-allowed"
                        )}
                      >
                        <SelectValue
                          placeholder={
                            isLoading.cities ? "Memuat..." : "Pilih kota..."
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cities.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Kecamatan */}
             <FormField
              control={control}
              name={`pencipta.${index}.kecamatan`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">Kecamatan</FormLabel>
                  <Select
                    onValueChange={(v) => {
                      field.onChange(v);
                      getVillages(v);
                    }}
                    value={field.value}
                    disabled={isLoading.districts || districts.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger className={cn(
                          formInputStyle,
                          (isLoading.districts || districts.length === 0) &&
                            "opacity-60 cursor-not-allowed"
                        )}>
                        <SelectValue
                          placeholder={
                            isLoading.districts
                              ? "Memuat..."
                              : "Pilih kecamatan..."
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {districts.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Kelurahan */}
            <FormField
              control={control}
              name={`pencipta.${index}.kelurahan`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">Kelurahan/Desa</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading.villages || villages.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger className={cn(
                          formInputStyle,
                          (isLoading.villages || villages.length === 0) &&
                            "opacity-60 cursor-not-allowed"
                        )}>
                        <SelectValue
                          placeholder={
                            isLoading.villages
                              ? "Memuat..."
                              : "Pilih kelurahan..."
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {villages.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={control}
            name={`pencipta.${index}.alamat_lengkap`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-semibold">
                  Nama Jalan, Gedung, RT/RW
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Contoh: Jl. Ringroad Utara, Jombor, No. 12, RT 01/RW 02"
                    {...field}
                    className={cn(formInputStyle, "min-h-[100px] resize-none")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`pencipta.${index}.kode_pos`}
            render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">Kode Pos</FormLabel>
                  <FormControl>
                    <Input {...field} className={formInputStyle} placeholder="Contoh: 55284"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
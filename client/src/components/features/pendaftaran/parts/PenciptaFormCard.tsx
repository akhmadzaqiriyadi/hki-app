"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Trash2,
  User,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  Globe,
} from "lucide-react";

import { FormValues } from "@/lib/pendaftaran/schema";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const programStudiUTY = [
  "Informatika - S1",
  "Sistem Informasi - S1",
  "Teknik Komputer - S1",
  "Teknik Elektro - S1",
  "Teknik Industri - S1",
  "Arsitektur - S1",
  "Perencanaan Wilayah & Kota - S1",
  "Manajemen - S1",
  "Akuntansi - S1",
  "Psikologi - S1",
  "Sastra Inggris - S1",
  "Ilmu Komunikasi - S1",
  "Bimbingan dan Konseling - S1",
  "Pendidikan Teknologi Informasi - S1",
  "Agroindustri - S1",
  "Sistem Informasi - D3",
  "Manajemen Perusahaan - D3",
  "Akuntansi - D3",
  "Bahasa Inggris - D3",
  "Teknologi Informasi - S2 (Pascasarjana)",
  "Manajemen - S2 (Pascasarjana)",
];

interface PenciptaFormCardProps {
  index: number;
  onRemove: (index: number) => void;
  provinces: any[];
  cities: any[];
  districts: any[];
  villages: any[];
  setCitiesForIndex: (cities: any[]) => void;
  setDistrictsForIndex: (districts: any[]) => void;
  setVillagesForIndex: (villages: any[]) => void;
}

export function PenciptaFormCard({
  index,
  onRemove,
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
    <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <User className="h-6 w-6 text-blue-800" />
            <span>Pencipta {index + 1}</span>
          </div>
          {index > 0 && (
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onRemove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* All FormFields go here, the code is long so I will omit it for brevity, but your existing code is correct */}
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="font-semibold border-b pb-2">Informasi Personal</h3>
          <FormField
            control={control}
            name={`pencipta.${index}.nama_lengkap`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`pencipta.${index}.nik`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIK</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`pencipta.${index}.nip_nim`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIP/NIM/NUPTK/NPM</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`pencipta.${index}.jenis_kelamin`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Kelamin</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                      <SelectItem value="Perempuan">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`pencipta.${index}.kewarganegaraan`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kewarganegaraan</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="font-semibold border-b pb-2">Informasi Kontak</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`pencipta.${index}.email`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
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
                  <FormLabel>No. HP</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Academic Information */}
        <div className="space-y-4">
          <h3 className="font-semibold border-b pb-2">
            Informasi Akademik (Opsional, khusus civitas UTY)
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`pencipta.${index}.fakultas`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fakultas</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Program Studi</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
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

        {/* Address Information */}
        <div className="space-y-4">
          <h3 className="font-semibold border-b pb-2">Alamat Sesuai KTP</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`pencipta.${index}.provinsi`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provinsi</FormLabel>
                  <Select
                    onValueChange={(v) => {
                      field.onChange(v);
                      getCities(v);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
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
            <FormField
              control={control}
              name={`pencipta.${index}.kota`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kota/Kabupaten</FormLabel>
                  <Select
                    onValueChange={(v) => {
                      field.onChange(v);
                      getDistricts(v);
                    }}
                    value={field.value}
                    disabled={isLoading.cities || cities.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
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
            <FormField
              control={control}
              name={`pencipta.${index}.kecamatan`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kecamatan</FormLabel>
                  <Select
                    onValueChange={(v) => {
                      field.onChange(v);
                      getVillages(v);
                    }}
                    value={field.value}
                    disabled={isLoading.districts || districts.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
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
            <FormField
              control={control}
              name={`pencipta.${index}.kelurahan`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kelurahan/Desa</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading.villages || villages.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
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
                <FormLabel>Alamat Lengkap</FormLabel>
                <FormControl>
                  <Textarea {...field} />
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
                <FormLabel>Kode Pos</FormLabel>
                <FormControl>
                  <Input {...field} />
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

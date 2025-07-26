"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormValues } from "@/lib/pendaftaran/schema";
import { copyrightCategories } from "@/lib/master/copyrightCategories"; // Asumsi file ini ada

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function Step1InformasiKarya() {
  const { control, setValue, watch } = useFormContext<FormValues>();

  const selectedJenisKarya = watch("jenis_karya");
  const selectedCategoryData = copyrightCategories[selectedJenisKarya as keyof typeof copyrightCategories];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Langkah 1: Informasi Karya</CardTitle>
        <CardDescription>Lengkapi semua detail mengenai karya yang akan didaftarkan.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="judul"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul Karya</FormLabel>
              <FormControl><Input placeholder="Contoh: Aplikasi Portal HKI" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="jenis_pemilik"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Pemilik</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Pilih jenis pemilik..." /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="Civitas Akademik UTY">Civitas Akademik UTY</SelectItem>
                  <SelectItem value="Umum">Umum</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={control}
          name="produk_hasil"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Produk Hasil</FormLabel>
              <FormControl><Input placeholder="Contoh: Perangkat Lunak, Buku, Lagu" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={control}
            name="jenis_karya"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Jenis Karya</FormLabel>
                <Select onValueChange={(value) => { field.onChange(value); setValue("sub_jenis_karya", ""); }} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Pilih jenis..." /></SelectTrigger></FormControl>
                    <SelectContent>
                    {Object.entries(copyrightCategories).map(([key, category]) => (
                        <SelectItem key={key} value={key}>{category.label}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={control}
            name="sub_jenis_karya"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Sub-Jenis Karya</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCategoryData}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Pilih sub-jenis..." /></SelectTrigger></FormControl>
                    <SelectContent>
                    {selectedCategoryData?.subCategories.map((sub, index) => (
                        <SelectItem key={index} value={sub}>{sub}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={control}
                name="kota_diumumkan"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Kota Pertama Diumumkan</FormLabel>
                    <FormControl><Input placeholder="Yogyakarta" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="tanggal_diumumkan"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Tanggal Pertama Diumumkan</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "PPP") : <span>Pilih tanggal</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <FormField
          control={control}
          name="deskripsi_karya"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi Karya</FormLabel>
              <FormControl><Textarea placeholder="Jelaskan secara singkat tentang karya Anda..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
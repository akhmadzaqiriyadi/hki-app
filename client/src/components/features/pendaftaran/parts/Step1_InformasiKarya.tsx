"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import {
  CalendarIcon,
  FileText,
  Building2,
  Package,
  Calendar,
  MapPin,
  Edit3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FormValues } from "@/lib/pendaftaran/schema";
import { copyrightCategories } from "@/lib/master/copyrightCategories"; // Asumsi file ini ada

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function Step1InformasiKarya() {
  const { control, setValue, watch } = useFormContext<FormValues>();

  const selectedJenisKarya = watch("jenis_karya");
  const selectedCategoryData =
    copyrightCategories[selectedJenisKarya as keyof typeof copyrightCategories];

  return (
    <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-xl">
      <CardHeader className="relative">
        <CardTitle className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-3">
          Langkah 1: Informasi Karya
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-slate-600 font-medium">
          Lengkapi semua detail mengenai karya yang akan didaftarkan dengan
          teliti.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8 relative">
        {/* Judul Karya */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <Edit3 className="h-4 w-4 text-blue-700" />
            <span className="text-sm sm:text-base">Identitas Karya</span>
          </div>

          <FormField
            control={control}
            name="judul"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-semibold">
                  Judul Karya
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Contoh: Aplikasi Portal HKI"
                    {...field}
                    className="border-blue-200/50 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80 backdrop-blur-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Jenis Pemilik & Produk Hasil */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <Building2 className="h-4 w-4 text-blue-700" />
            <span className="text-sm sm:text-base">Kepemilikan & Kategori</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="jenis_pemilik"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">
                    Jenis Pemilik
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-blue-200/50 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80 backdrop-blur-sm">
                        <SelectValue placeholder="Pilih jenis pemilik..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Civitas Akademik UTY">
                        Civitas Akademik UTY
                      </SelectItem>
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
                  <FormLabel className="text-slate-700 font-semibold">
                    Produk Hasil
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: Perangkat Lunak, Buku, Lagu"
                      {...field}
                      className="border-blue-200/50 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80 backdrop-blur-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Jenis & Sub-Jenis Karya */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <Package className="h-4 w-4 text-blue-700" />
            <span className="text-sm sm:text-base">Klasifikasi Karya</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="jenis_karya"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">
                    Jenis Karya
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setValue("sub_jenis_karya", "");
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-blue-200/50 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80 backdrop-blur-sm">
                        <SelectValue placeholder="Pilih jenis..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(copyrightCategories).map(
                        ([key, category]) => (
                          <SelectItem key={key} value={key}>
                            {category.label}
                          </SelectItem>
                        )
                      )}
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
                  <FormLabel className="text-slate-700 font-semibold">
                    Sub-Jenis Karya
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedCategoryData}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "border-blue-200/50 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80 backdrop-blur-sm",
                          !selectedCategoryData && "opacity-60"
                        )}
                      >
                        <SelectValue placeholder="Pilih sub-jenis..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedCategoryData?.subCategories.map((sub, index) => (
                        <SelectItem key={index} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Info card untuk sub-jenis */}
          {!selectedJenisKarya && (
            <div className="p-3 bg-gradient-to-r from-amber-50/80 to-orange-50/50 rounded-lg border border-amber-200/50">
              <p className="text-xs sm:text-sm text-amber-700">
                💡 Pilih jenis karya terlebih dahulu untuk melihat pilihan
                sub-jenis
              </p>
            </div>
          )}
        </div>

        {/* Informasi Publikasi */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <MapPin className="h-4 w-4 text-blue-700" />
            <span className="text-sm sm:text-base">Informasi Publikasi</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="kota_diumumkan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">
                    Kota Pertama Diumumkan
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Yogyakarta"
                      {...field}
                      className="border-blue-200/50 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80 backdrop-blur-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="tanggal_diumumkan"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-slate-700 font-semibold">
                    Tanggal Pertama Diumumkan
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal border-blue-200/50 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80 backdrop-blur-sm hover:bg-blue-50",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pilih tanggal</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Info card untuk tanggal */}
          <div className="p-3 bg-gradient-to-r from-blue-50/80 to-indigo-50/50 rounded-lg border border-blue-200/50">
            <p className="text-xs sm:text-sm text-blue-700">
              📅 Tanggal diumumkan adalah tanggal pertama kali karya
              dipublikasikan atau diperkenalkan kepada publik
            </p>
          </div>
        </div>

        {/* Deskripsi Karya */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <Edit3 className="h-4 w-4 text-blue-700" />
            <span className="text-sm sm:text-base">Deskripsi Karya</span>
          </div>

          <FormField
            control={control}
            name="deskripsi_karya"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-semibold">
                  Deskripsi Karya
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Jelaskan secara singkat tentang karya Anda, meliputi tujuan, fungsi, dan keunikan karya..."
                    {...field}
                    className="border-blue-200/50 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80 backdrop-blur-sm min-h-[120px] resize-none"
                    rows={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Info card untuk deskripsi */}
          <div className="p-3 bg-gradient-to-r from-green-50/80 to-emerald-50/50 rounded-lg border border-green-200/50">
            <p className="text-xs sm:text-sm text-green-700">
              ✏️ Deskripsi yang baik mencakup: tujuan karya, fitur utama,
              keunikan, dan manfaat bagi pengguna
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

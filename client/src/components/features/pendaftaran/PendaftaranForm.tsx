// src/components/features/pendaftaran/PendaftaranForm.tsx

"use client";

import React, { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pendaftaran } from "@/lib/types";
import {
  formSchema,
  FormValues,
  defaultPencipta,
} from "@/lib/pendaftaran/schema";
import { useUpdateRegistration } from "@/queries/mutations/useUpdateRegistration";

// Import UI and Step Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Send,
  Loader2,
  User,
  Upload,
  CheckCircle2,
  FileIcon,
} from "lucide-react";
import { Step1InformasiKarya } from "./parts/Step1_InformasiKarya";
import { Step2DataPencipta } from "./parts/Step2_DataPencipta";
import { Step3UnggahDokumen } from "./parts/Step3_UnggahDokumen";

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

  const sanitizeData = (data: Pendaftaran): Partial<FormValues> => {
    const sanitized: any = {};
    for (const key in data) {
      const value = (data as any)[key];
      sanitized[key] = value === null ? "" : value;
    }
    return {
      ...sanitized,
      tanggal_diumumkan: data.tanggal_diumumkan
        ? new Date(data.tanggal_diumumkan)
        : undefined,
      pencipta:
        data.pencipta?.length > 0
          ? data.pencipta.map((p: any) => {
              const sanitizedPencipta: any = {};
              for (const pKey in p) {
                const pValue = (p as any)[pKey];
                sanitizedPencipta[pKey] = pValue === null ? "" : pValue;
              }
              return sanitizedPencipta;
            })
          : [defaultPencipta],
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
        const response = await fetch(
          `https://api.binderbyte.com/wilayah/provinsi?api_key=${API_KEY}`
        );
        const data = await response.json();
        if (data && Array.isArray(data.value)) setProvinces(data.value);
      } catch (error) {
        console.error("Gagal mengambil data provinsi:", error);
      }
    };
    getProvinces();
  }, []);

  const processSubmit = (status: "draft" | "submitted") => {
    const values = form.getValues();
    const formData = new FormData();
    const resolvedPencipta = values.pencipta.map((p, index) => {
      const provinceName =
        provinces.find((prov) => prov.id === p.provinsi)?.name || p.provinsi;
      const cityName =
        (cities[index] || []).find((city) => city.id === p.kota)?.name ||
        p.kota;
      const districtName =
        (districts[index] || []).find((dist) => dist.id === p.kecamatan)
          ?.name || p.kecamatan;
      const villageName =
        (villages[index] || []).find((vill) => vill.id === p.kelurahan)?.name ||
        p.kelurahan;
      return {
        ...p,
        provinsi: provinceName,
        kota: cityName,
        kecamatan: districtName,
        kelurahan: villageName,
      };
    });
    Object.entries(values).forEach(([key, value]) => {
      if (key === "pencipta") {
        formData.append(key, JSON.stringify(resolvedPencipta));
      } else if (key === "tanggal_diumumkan" && value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (key.endsWith("_url") && value instanceof FileList) {
        if (value.length > 0) {
          formData.append(key, value[0]);
        }
      } else if (value != null && value !== undefined) {
        formData.append(key, String(value));
      }
    });
    formData.append("status", status);
    updateMutation.mutate({ id: pendaftaran.id, formData });
  };

  const isPending = updateMutation.isPending;

  const steps = [
    {
      number: 1,
      title: "Informasi Karya",
      icon: FileIcon,
      description: "Detail karya yang akan didaftarkan",
    },
    {
      number: 2,
      title: "Data Pencipta",
      icon: User,
      description: "Informasi lengkap pencipta",
    },
    {
      number: 3,
      title: "Unggah Dokumen",
      icon: Upload,
      description: "Upload dokumen pendukung",
    },
  ];

  return (
    <div className="relative min-h-screen">
      <div className="relative space-y-8">
        <div className="relative">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6">
            {steps.map((step) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              return (
                <Card
                  key={step.number}
                  className={`relative overflow-hidden transition-all duration-300 ${
                    isActive
                      ? "border-blue-500/50 bg-gradient-to-br from-blue-50/80 to-white shadow-lg scale-[1.02]"
                      : isCompleted
                      ? "border-green-200/50 bg-gradient-to-br from-green-50/80 to-white shadow-md"
                      : "border-slate-200/50 bg-gradient-to-br from-slate-50/50 to-white shadow-sm"
                  }`}
                >
                  <div
                    className={`absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 ${
                      isActive
                        ? "bg-blue-500/10"
                        : isCompleted
                        ? "bg-green-500/10"
                        : "bg-slate-300/10"
                    } rounded-full -translate-y-6 translate-x-6 sm:-translate-y-8 sm:translate-x-8`}
                  ></div>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shadow-md ${
                          isActive
                            ? "bg-gradient-to-br from-blue-900 to-blue-800"
                            : isCompleted
                            ? "bg-gradient-to-br from-green-600 to-green-700"
                            : "bg-gradient-to-br from-slate-400 to-slate-500"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        ) : (
                          <StepIcon
                            className={`h-4 w-4 sm:h-5 sm:w-5 ${
                              isActive ? "text-white" : "text-white"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-xs sm:text-sm font-semibold truncate ${
                              isActive
                                ? "text-blue-900"
                                : isCompleted
                                ? "text-green-800"
                                : "text-slate-600"
                            }`}
                          >
                            {step.title}
                          </p>
                          {isActive && (
                            <Badge
                              variant="secondary"
                              className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800"
                            >
                              Aktif
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate hidden sm:block">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <FormProvider {...form}>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-6">
              <div className="transition-all duration-300 ease-in-out">
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

              <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-xl">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep((s) => Math.max(s - 1, 1))}
                      disabled={currentStep === 1 || isPending}
                      className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                    </Button>
                    <div className="flex gap-3">
                      {currentStep === 3 ? (
                        <>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => processSubmit("draft")}
                            disabled={isPending}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 hover:shadow-md transition-all duration-200"
                          >
                            {isPending ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="mr-2 h-4 w-4" />
                            )}
                            Simpan Draf
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                disabled={isPending}
                                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                              >
                                <Send className="mr-2 h-4 w-4" />
                                Finalisasi & Kirim
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="border-green-200/50 bg-gradient-to-br from-green-50/80 to-white backdrop-blur-sm shadow-xl">
                              <AlertDialogHeader>
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center shadow-lg">
                                    <Send className="h-6 w-6 text-green-700" />
                                  </div>
                                  <div>
                                    <AlertDialogTitle className="text-lg font-bold text-slate-800">
                                      Konfirmasi Finalisasi
                                    </AlertDialogTitle>
                                  </div>
                                </div>
                                <AlertDialogDescription className="text-slate-600 font-medium">
                                  Setelah difinalisasi, pendaftaran akan dikirim untuk direview dan Anda tidak dapat mengubah datanya lagi. Pastikan semua informasi sudah benar.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="gap-3">
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={form.handleSubmit(() =>
                                    processSubmit("submitted")
                                  )}
                                  disabled={isPending}
                                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
                                >
                                  {isPending ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : (
                                    <Send className="mr-2 h-4 w-4" />
                                  )}
                                  Ya, Kirim Sekarang
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      ) : (
                        <Button
                          type="button"
                          onClick={() =>
                            setCurrentStep((s) => Math.min(s + 1, 3))
                          }
                          disabled={isPending}
                          className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                          Selanjutnya <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
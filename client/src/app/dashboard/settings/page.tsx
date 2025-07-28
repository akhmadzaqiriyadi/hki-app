"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGetMyProfile } from "@/queries/queries/useGetMyProfile";
import { useUpdateMyProfile } from "@/queries/mutations/useUpdateMyProfile";
import { ChangePasswordForm } from "@/components/features/auth/ChangePasswordForm";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserCog, User, KeyRound } from "lucide-react"; // Import ikon baru

const profileSchema = z.object({
  nama_lengkap: z.string().min(3, "Nama lengkap minimal 3 karakter."),
  email: z.string().email(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function AccountSettingsPage() {
  const { data: profile, isLoading, isError, error } = useGetMyProfile();
  const updateMutation = useUpdateMyProfile();
  
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset(profile);
    }
  }, [profile, reset]);
  
  const onSubmit = (data: ProfileFormValues) => {
    updateMutation.mutate({ nama_lengkap: data.nama_lengkap });
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (isError) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className="relative min-h-screen">
       {/* Background decorations */}
       <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -right-20 w-96 h-96 bg-blue-800/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 -left-20 w-80 h-80 bg-blue-900/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative space-y-8">
        {/* Header Section */}
        <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl sm:rounded-2xl items-center justify-center shadow-xl flex-shrink-0">
                <UserCog className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                Pengaturan Akun
                </h1>
                <p className="text-base text-slate-600 font-medium">
                Kelola informasi profil dan keamanan akun Anda.
                </p>
            </div>
        </div>

        {/* Profile Card */}
        <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-700" />
                </div>
                Profil Saya
              </CardTitle>
              <CardDescription className="text-base text-slate-600 font-medium">
                Perbarui nama lengkap Anda di sini. Email tidak dapat diubah.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nama_lengkap" className="font-semibold text-slate-700 mt-4">Nama Lengkap</Label>
                <Input id="nama_lengkap" {...register("nama_lengkap")} className="border-blue-200/50 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80 backdrop-blur-sm" />
                {errors.nama_lengkap && <p className="text-sm text-red-600 mt-1">{errors.nama_lengkap.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold text-slate-700">Email (Tidak dapat diubah)</Label>
                <Input id="email" type="email" {...register("email")} disabled className="bg-slate-100 cursor-not-allowed"/>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={!isDirty || updateMutation.isPending} className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 mt-4">
                {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Perubahan
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Change Password Card */}
        <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-xl">
            <CardHeader>
               <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <KeyRound className="h-4 w-4 text-blue-700" />
                    </div>
                    Ubah Password
                </CardTitle>
                <CardDescription className="text-base text-slate-600 font-medium">
                    Masukkan password Anda saat ini dan password baru yang lebih aman.
                </CardDescription>
            </CardHeader>
            <ChangePasswordForm />
        </Card>
      </div>
    </div>
  );
}
"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGetMyProfile } from "@/queries/queries/useGetMyProfile";
import { useUpdateMyProfile } from "@/queries/mutations/useUpdateMyProfile";
import { ChangePasswordForm } from "@/components/features/auth/ChangePasswordForm"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";

const profileSchema = z.object({
  nama_lengkap: z.string().min(3, "Nama lengkap minimal 3 karakter."),
  email: z.string().email(), // Email tidak bisa diubah, jadi tidak perlu validasi min
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function AccountSettingsPage() {
  const { data: profile, isLoading, isError, error } = useGetMyProfile();
  const updateMutation = useUpdateMyProfile();
  
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  // Isi form dengan data dari API setelah selesai loading
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pengaturan Akun</h1>
        <p className="text-muted-foreground">Kelola informasi profil dan akun Anda.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Profil Saya</CardTitle>
            <CardDescription>Perbarui nama lengkap Anda di sini. Email tidak dapat diubah.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
              <Input id="nama_lengkap" {...register("nama_lengkap")} />
              {errors.nama_lengkap && <p className="text-sm text-red-600 mt-1">{errors.nama_lengkap.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (Tidak dapat diubah)</Label>
              <Input id="email" type="email" {...register("email")} disabled />
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit" disabled={!isDirty || updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Perubahan
            </Button>
          </CardFooter>
        </Card>
      </form>
      <ChangePasswordForm />
    </div>
  );
}
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister, RegisterFormValues } from "@/queries/mutations/useRegister";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2, UserPlus } from "lucide-react";

const registerSchema = z.object({
  nama_lengkap: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useRegister();

  const onSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };

  return (
    <Card className="w-full shadow-xl border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent">
          Buat Akun Baru
        </CardTitle>
        <CardDescription className="text-slate-600 text-base">
          Mulai kelola hak kekayaan intelektual Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {registerMutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Registrasi Gagal</AlertTitle>
              <AlertDescription>{(registerMutation.error as Error).message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
            <Input id="nama_lengkap" {...register("nama_lengkap")} />
            {errors.nama_lengkap && <p className="text-xs font-medium text-red-600 mt-1">{errors.nama_lengkap.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-xs font-medium text-red-600 mt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && <p className="text-xs font-medium text-red-600 mt-1">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
            Buat Akun
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
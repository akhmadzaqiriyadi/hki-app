'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin, LoginFormValues } from "@/queries/mutations/useLogin";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Lock, Mail, Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password tidak boleh kosong"),
});

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useLogin();

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <Card className="w-full shadow-xl border-0 bg-white/95 backdrop-blur-sm  py-12">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent">
          Selamat Datang
        </CardTitle>
        <CardDescription className="text-slate-600 text-base">
          Masuk ke Portal UTY HKI untuk melanjutkan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {loginMutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Gagal Masuk</AlertTitle>
              <AlertDescription>{(loginMutation.error as Error).message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input id="email" type="email" placeholder="nama@email.com" className="pl-10" {...register("email")} />
            </div>
            {errors.email && <p className="text-xs font-medium text-red-600 mt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
             <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input id="password" type="password" placeholder="Masukkan password" className="pl-10" {...register("password")} />
            </div>
            {errors.password && <p className="text-xs font-medium text-red-600 mt-1">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
            Masuk
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
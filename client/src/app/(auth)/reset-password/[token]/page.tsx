"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResetPassword } from '@/queries/mutations/useResetPassword';
import { useParams, useRouter } from 'next/navigation'; // Import useRouter
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Loader2 } from 'lucide-react';

// Import Header and Footer components
import Header from '@/components/features/landing/HeaderComponent';
import Footer from '@/components/features/landing/FooterComponent';

const schema = z.object({
  password: z.string().min(8, "Password baru minimal 8 karakter."),
});
type FormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const params = useParams();
  const token = params.token as string;
  const router = useRouter(); // Initialize router
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const resetPasswordMutation = useResetPassword();

  const onSubmit = (data: FormValues) => {
    resetPasswordMutation.mutate({ token, password: data.password });
  };

  // Handlers for the Header component
  const handleRegister = () => {
    router.push('/register');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <>
      <Header onLogin={handleLogin} onRegister={handleRegister} />
      <main className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="w-full max-w-md">
          <Card className="w-full shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent">
                Reset Password
              </CardTitle>
              <CardDescription className="text-slate-600 text-base">
                Masukkan password baru Anda.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="password">Password Baru</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input id="password" type="password" placeholder="Minimal 8 karakter" className="pl-10" {...register("password")} />
                  </div>
                  {errors.password && <p className="text-xs font-medium text-red-600 mt-1">{errors.password.message}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={resetPasswordMutation.isPending}>
                  {resetPasswordMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
                  Simpan Password Baru
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
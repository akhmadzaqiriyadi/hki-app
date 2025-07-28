"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForgotPassword } from '@/queries/mutations/useForgotPassword';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';

// --- TAMBAHAN BARU ---
import { useRouter } from 'next/navigation';
import Header from '@/components/features/landing/HeaderComponent';
import Footer from '@/components/features/landing/FooterComponent';
// --- AKHIR TAMBAHAN ---

const schema = z.object({
  email: z.string().email("Format email tidak valid."),
});
type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const forgotPasswordMutation = useForgotPassword();
  
  // --- TAMBAHAN BARU ---
  const router = useRouter();

  const handleRegister = () => {
    router.push('/register');
  };

  const handleLogin = () => {
    router.push('/login');
  };
  // --- AKHIR TAMBAHAN ---

  const onSubmit = (data: FormValues) => {
    forgotPasswordMutation.mutate(data);
  };

  return (
    // --- MODIFIKASI STRUKTUR ---
    <>
      <Header onLogin={handleLogin} onRegister={handleRegister} />
      <main className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="w-full max-w-md">
          <Card className="w-full shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent">
                Lupa Password
              </CardTitle>
              <CardDescription className="text-slate-600 text-base">
                Masukkan email Anda untuk menerima link reset password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input id="email" type="email" placeholder="nama@email.com" className="pl-10" {...register("email")} />
                  </div>
                  {errors.email && <p className="text-xs font-medium text-red-600 mt-1">{errors.email.message}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={forgotPasswordMutation.isPending}>
                  {forgotPasswordMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                  Kirim Link Reset
                </Button>
              </form>
            </CardContent>
          </Card>
          <div className="mt-6 text-center text-sm text-slate-600">
            <Link href="/login" className="font-medium text-blue-800 hover:text-blue-900 transition-colors inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Kembali ke Login
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
    // --- AKHIR MODIFIKASI ---
  );
}
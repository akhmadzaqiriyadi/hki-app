// src/app/(auth)/register/page.tsx
"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Footer from "@/components/features/landing/FooterComponent";
import Header from '@/components/features/landing/HeaderComponent';
import { RegisterForm } from "@/components/features/auth/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
  
    const handleRegister = () => {
      // Navigate to registration page
      router.push('/register');
      console.log("Navigate to register");
    };
  
    const handleLogin = () => {
      // Navigate to login page
      router.push('/login');
      console.log("Navigate to login");
    };
  return (
    <>
      <Header onLogin={handleLogin} onRegister={handleRegister} />
      <div className="flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="w-full max-w-md">
          <RegisterForm />
          <p className="mt-6 text-center text-sm text-slate-600">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-800 hover:underline"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

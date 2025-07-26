"use client"; // Pastikan ini adalah komponen klien

import { LoginForm } from "@/components/features/auth/LoginForm";
import React from 'react';
import { useRouter } from 'next/navigation';
import Footer from "@/components/features/landing/FooterComponent";
import Header from '@/components/features/landing/HeaderComponent';
import Link from "next/link";

export default function LoginPage() {
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
    <main className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="w-full max-w-md">
        <LoginForm />
        <div className="mt-6 text-center text-sm text-slate-600">
          Belum punya akun?{" "}
          <Link 
            href="/register" 
            className="font-medium text-blue-800 hover:text-blue-900 transition-colors underline"
          >
            Daftar di sini
          </Link>
        </div>
      </div>
    </main>
    <Footer />
    </>
  );
}
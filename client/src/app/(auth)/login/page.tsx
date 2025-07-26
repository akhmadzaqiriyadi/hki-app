"use client"; // Pastikan ini adalah komponen klien

import { LoginForm } from "@/components/features/auth/LoginForm";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <>
    <Header />
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
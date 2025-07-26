// src/app/(auth)/register/page.tsx
"use client"; // Pastikan ini adalah komponen klien

import { RegisterForm } from "@/components/features/auth/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-blue-50/30 min-h-screen">
      <div className="w-full max-w-md">
        <RegisterForm />
         <p className="mt-6 text-center text-sm text-slate-600">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-blue-800 hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
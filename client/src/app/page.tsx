'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/features/landing/HeaderComponent';
import HeroSection from '@/components/features/landing/HeroSection';
import FeaturesSection from '@/components/features/landing/FeaturesSection';
import ProcessSection from '@/components/features/landing/ProcessSection';
import CTASection from '@/components/features/landing/CTAComponent';
import Footer from '@/components/features/landing/FooterComponent';

export default function HomePage() {
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header onLogin={handleLogin} onRegister={handleRegister} />
      
      <main className="flex-1">
        <HeroSection onRegister={handleRegister} />
        <FeaturesSection />
        <ProcessSection />
        <CTASection onRegister={handleRegister} />
      </main>

      <Footer />
    </div>
  );
}
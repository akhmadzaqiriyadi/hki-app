// src/app/page.tsx
import HeroSection from "@/components/features/landing/HeroSection";
import FeaturesSection from "@/components/features/landing/FeaturesSection";
import CTASection from "@/components/features/landing/CTASection";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <div>
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </div>
      <Footer />
    </>
  );
}
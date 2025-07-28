import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sentra Portal UTY HKI - Creative Hub | Universitas Teknologi Yogyakarta",
  description: "Platform resmi Universitas Teknologi Yogyakarta untuk pendaftaran Hak Kekayaan Intelektual. Khusus untuk mahasiswa, dosen, dan masyarakat umum dengan proses yang mudah dan terintegrasi melalui UTY Creative Hub.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <QueryProvider>
          {children}
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
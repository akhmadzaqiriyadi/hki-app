import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

// Definisikan tipe data yang diharapkan dari API backend
interface AnalyticsData {
  hkiTypeDistribution: any[];
  hkiRegistrationsPerYear: any[];
  hkiStatusDistribution: any[];
}

// Fungsi async untuk memanggil endpoint backend
const getAnalyticsData = (): Promise<AnalyticsData> => {
  // Panggil endpoint /api/analytics yang sudah kita buat di Express
  return apiClient<AnalyticsData>("/analytics");
};

// Custom hook untuk digunakan di komponen
export const useGetAnalyticsData = () => {
  return useQuery<AnalyticsData, Error>({
    queryKey: ["hkiAnalytics"], // Kunci unik untuk caching
    queryFn: getAnalyticsData,
  });
};
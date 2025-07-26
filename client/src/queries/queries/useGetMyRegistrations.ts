import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Pendaftaran } from "@/lib/types";

// Fungsi ini sekarang benar-benar memanggil API backend
const getMyRegistrations = async (): Promise<Pendaftaran[]> => {
  // Mengambil data dari endpoint yang sudah kita proteksi
  return apiClient<Pendaftaran[]>("/pendaftaran");
};

export const useGetMyRegistrations = () => {
  return useQuery<Pendaftaran[], Error>({
    queryKey: ["myRegistrations"], // Kunci unik untuk query ini
    queryFn: getMyRegistrations,
  });
};
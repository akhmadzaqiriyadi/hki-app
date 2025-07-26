import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Pendaftaran } from "@/lib/types";

// Fungsi ini sekarang benar-benar memanggil API backend
const getRegistrationById = async (id: string): Promise<Pendaftaran> => {
  // Memastikan tidak ada ID yang 'undefined' atau 'null' yang dikirim
  if (!id) {
    throw new Error("ID Pendaftaran tidak valid.");
  }
  return apiClient<Pendaftaran>(`/pendaftaran/${id}`);
};

export const useGetRegistrationById = (id: string) => {
  return useQuery<Pendaftaran, Error>({
    queryKey: ["registration", id],
    queryFn: () => getRegistrationById(id),
    // Query hanya akan dijalankan jika 'id' memiliki nilai (bukan undefined)
    enabled: !!id, 
  });
};
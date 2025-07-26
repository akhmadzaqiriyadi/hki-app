import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Pendaftaran } from "@/lib/types"; // Menggunakan tipe Pendaftaran yang sama

// Fungsi ini memanggil endpoint khusus admin
const getAllRegistrationsForAdmin = async (): Promise<Pendaftaran[]> => {
  return apiClient<Pendaftaran[]>("/admin/pendaftaran");
};

export const useGetAllRegistrationsForAdmin = () => {
  return useQuery<Pendaftaran[], Error>({
    queryKey: ["allRegistrationsAdmin"], // Kunci query yang unik untuk data admin
    queryFn: getAllRegistrationsForAdmin,
  });
};
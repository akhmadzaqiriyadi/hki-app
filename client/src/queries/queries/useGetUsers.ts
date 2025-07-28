import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

// Definisikan tipe data untuk User, tanpa password
export interface User {
  id: string;
  nama_lengkap: string;
  email: string;
  role: 'User' | 'Admin';
  createdAt: string;
}

const getUsers = async (): Promise<User[]> => {
  // Panggil endpoint admin yang sudah kita buat
  return apiClient<User[]>("/admin/users");
};

export const useGetUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ["users"], // Kunci unik untuk data ini
    queryFn: getUsers,
  });
};
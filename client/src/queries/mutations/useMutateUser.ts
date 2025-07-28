import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { User } from "../queries/useGetUsers"; // Impor tipe User

// Tipe data untuk form
export interface UserFormValues {
  id?: string; // id bersifat opsional, ada saat update
  nama_lengkap: string;
  email: string;
  password?: string; // Password opsional, hanya diisi jika ingin diubah/dibuat
  role: 'User' | 'Admin';
}

// Fungsi ini akan menangani create atau update
const mutateUser = (data: UserFormValues): Promise<User> => {
  const { id, ...payload } = data;

  // Jika tidak ada password, hapus dari payload agar tidak mengirim string kosong
  if (payload.password === '') {
    delete payload.password;
  }

  const method = id ? "PUT" : "POST";
  const endpoint = id ? `/admin/users/${id}` : "/admin/users";

  return apiClient(endpoint, {
    method,
    body: JSON.stringify(payload),
  });
};

export const useMutateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutateUser,
    onSuccess: (data, variables) => {
      toast.success(variables.id ? "Pengguna berhasil diperbarui!" : "Pengguna baru berhasil dibuat!");
      // Invalidate query 'users' agar tabel otomatis ter-refresh
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: Error) => {
      toast.error("Operasi Gagal", {
        description: error.message,
      });
    },
  });
};
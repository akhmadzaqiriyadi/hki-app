import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { setToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

// Skema validasi untuk form login
const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password tidak boleh kosong"),
});

// Mengekspor tipe data yang di-infer dari skema untuk digunakan di komponen form
export type LoginFormValues = z.infer<typeof loginSchema>;

// Tipe data yang diharapkan sebagai respons dari API login
interface LoginResponse {
  token: string;
  user: {
    id: string;
    nama_lengkap: string;
    email: string;
    role: 'User' | 'Admin';
  };
}

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginFormValues>({
    // Fungsi yang akan dijalankan saat mutasi dipicu
    mutationFn: (data) => apiClient<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    
    // Aksi yang dijalankan jika mutasi berhasil
    onSuccess: (response) => {
      // 1. Simpan token ke cookie
      setToken(response.token);

      // 2. Bersihkan cache query untuk memulai sesi baru yang bersih
      queryClient.clear();
      
      toast.success(`Selamat datang, ${response.user.nama_lengkap}!`);

      // 3. Alihkan pengguna berdasarkan peran (role)
      if (response.user.role === 'Admin') {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard"); 
      }
    },
    
    // Aksi yang dijalankan jika mutasi gagal
    onError: (error) => {
        toast.error("Login Gagal", {
            description: error.message,
        });
    }
  });
};
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

const registerSchema = z.object({
  nama_lengkap: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const useRegister = () => {
  const router = useRouter();

  return useMutation<any, Error, RegisterFormValues>({
    mutationFn: (data) => apiClient("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      toast.success("Registrasi Berhasil!", {
        description: "Akun Anda berhasil dibuat. Kami telah mengirimkan email selamat datang ke alamat email Anda.",
      });
      router.push("/login");
    },
    onError: (error) => {
      toast.error("Registrasi Gagal", {
        description: error.message,
      });
    },
  });
};
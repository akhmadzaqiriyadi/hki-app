import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ResetPasswordPayload {
  token: string;
  password: string;
}

const resetPassword = (data: ResetPasswordPayload) => {
  return apiClient(`/auth/reset-password/${data.token}`, {
    method: "PUT",
    body: JSON.stringify({ password: data.password }),
  });
};

export const useResetPassword = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (data: any) => {
      toast.success("Password Berhasil Direset", {
        description: "Silakan login dengan password baru Anda.",
      });
      // Arahkan pengguna kembali ke halaman login setelah berhasil
      router.push("/login");
    },
    onError: (error: Error) => {
      toast.error("Gagal Mereset Password", {
        description: error.message,
      });
    },
  });
};
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

interface ForgotPasswordPayload {
  email: string;
}

const forgotPassword = (data: ForgotPasswordPayload) => {
  return apiClient("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data: any) => {
      // Menggunakan toast.info untuk pesan informatif
      toast.info("Proses Reset Password", {
        description: data.message,
      });
    },
    onError: (error: Error) => {
      toast.error("Gagal Mengirim Link", { 
        description: error.message 
      });
    },
  });
};
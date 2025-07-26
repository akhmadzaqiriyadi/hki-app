import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import * as z from "zod";

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Password saat ini wajib diisi."),
  newPassword: z.string().min(8, "Password baru minimal 8 karakter."),
});

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

const changePassword = (payload: ChangePasswordFormValues) => {
  return apiClient("/user/change-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: (data: any) => {
      toast.success(data.message || "Password berhasil diperbarui.");
    },
    onError: (error: Error) => {
      toast.error("Gagal mengubah password", {
        description: error.message,
      });
    },
  });
};
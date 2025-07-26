import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

interface UpdateProfilePayload {
  nama_lengkap: string;
}

const updateMyProfile = (payload: UpdateProfilePayload) => {
  return apiClient("/user/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      toast.success("Profil berhasil diperbarui.");
      // Invalidate query profil agar data yang ditampilkan selalu fresh
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
    onError: (error: Error) => {
      toast.error("Gagal memperbarui profil", {
        description: error.message,
      });
    },
  });
};
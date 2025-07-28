import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

const deleteUser = (id: string) => {
  return apiClient(`/admin/users/${id}`, {
    method: "DELETE",
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success("Pengguna berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: Error) => {
      toast.error("Gagal Menghapus", {
        description: error.message,
      });
    },
  });
};
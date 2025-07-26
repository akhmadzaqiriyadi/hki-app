import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

const deleteRegistration = async (id: string): Promise<any> => {
  return apiClient(`/pendaftaran/${id}`, {
    method: "DELETE",
  });
};

export const useDeleteRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRegistration,
    onSuccess: () => {
      toast.success("Draf pendaftaran berhasil dihapus.");
      queryClient.invalidateQueries({ queryKey: ["myRegistrations"] });
    },
    onError: (error) => {
      toast.error("Gagal menghapus draf", {
        description: error.message,
      });
    },
  });
};
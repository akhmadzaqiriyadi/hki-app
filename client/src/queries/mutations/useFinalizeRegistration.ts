import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

const finalizeRegistration = (id: string) => {
  return apiClient(`/pendaftaran/${id}/finalize`, { method: "POST" });
};

export const useFinalizeRegistration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: finalizeRegistration,
    onSuccess: (data: any, id: string) => {
      toast.success(data.message || "Pendaftaran berhasil difinalisasi.");
      queryClient.invalidateQueries({ queryKey: ["myRegistrations"] });
      queryClient.invalidateQueries({ queryKey: ["registration", id] });
    },
    onError: (error: Error) => {
      toast.error("Gagal finalisasi", { description: error.message });
    },
  });
};
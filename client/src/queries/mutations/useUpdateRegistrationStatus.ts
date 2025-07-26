import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { Pendaftaran, StatusPendaftaran } from "@/lib/types";

interface UpdateStatusPayload {
  id: string;
  status: StatusPendaftaran;
  catatan_revisi?: string;
}

const updateRegistrationStatus = async (payload: UpdateStatusPayload) => {
  return apiClient(`/admin/pendaftaran/${payload.id}/status`, {
    method: "PUT",
    body: JSON.stringify({
      status: payload.status,
      catatan_revisi: payload.catatan_revisi,
    }),
  });
};

export const useUpdateRegistrationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRegistrationStatus,
    onSuccess: (data: any, variables) => {
      toast.success(data.message || "Status berhasil diperbarui.");
      // Invalidate data di halaman detail dan halaman daftar admin
      queryClient.invalidateQueries({ queryKey: ["registrationAdmin", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["allRegistrationsAdmin"] });
    },
    onError: (error: Error) => {
      toast.error("Gagal memperbarui status", {
        description: error.message,
      });
    },
  });
};
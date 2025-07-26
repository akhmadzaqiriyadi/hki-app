import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

interface UploadSertifikatPayload {
  id: string;
  formData: FormData;
}

const uploadSertifikat = async (payload: UploadSertifikatPayload) => {
  return apiClient(`/admin/pendaftaran/${payload.id}/sertifikat`, {
    method: "POST",
    body: payload.formData,
  });
};

export const useUploadSertifikat = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uploadSertifikat,
        onSuccess: (data: any, variables) => {
            toast.success(data.message || "Sertifikat berhasil diunggah.");
            queryClient.invalidateQueries({ queryKey: ["registrationAdmin", variables.id] });
            queryClient.invalidateQueries({ queryKey: ["allRegistrationsAdmin"] });
        },
        onError: (error: Error) => {
            toast.error("Gagal mengunggah sertifikat", {
                description: error.message,
            });
        }
    });
};
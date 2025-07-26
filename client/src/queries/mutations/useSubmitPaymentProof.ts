import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

interface SubmitProofPayload {
  pendaftaranId: string;
  formData: FormData;
}

const submitPaymentProof = async (payload: SubmitProofPayload) => {
  // Endpoint ini akan kita buat di backend selanjutnya
  return apiClient(`/pendaftaran/${payload.pendaftaranId}/submit-payment`, {
    method: "POST",
    body: payload.formData,
  });
};

export const useSubmitPaymentProof = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitPaymentProof,
    onSuccess: (data: any) => {
      toast.success(data.message || "Bukti pembayaran berhasil dikirim.");
      queryClient.invalidateQueries({ queryKey: ["registration", data.id] });
    },
    onError: (error: Error) => {
      toast.error("Gagal mengirim bukti pembayaran", {
        description: error.message,
      });
    },
  });
};
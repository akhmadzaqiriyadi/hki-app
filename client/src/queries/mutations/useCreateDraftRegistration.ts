import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Pendaftaran } from "@/lib/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const createDraftRegistration = async (): Promise<Pendaftaran> => {
  return apiClient<Pendaftaran>("/pendaftaran", {
    method: "POST",
  });
};

export const useCreateDraftRegistration = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<Pendaftaran, Error>({
    mutationFn: createDraftRegistration,
    onSuccess: (data) => {
      toast.success("Draf baru berhasil dibuat!");
      queryClient.invalidateQueries({ queryKey: ["myRegistrations"] });
      // Arahkan ke halaman create yang baru dengan ID draf
      router.push(`/dashboard/pendaftaran/create/${data.id}`);
    },
    onError: (error) => {
      toast.error("Gagal membuat draf", {
        description: error.message,
      });
    },
  });
};
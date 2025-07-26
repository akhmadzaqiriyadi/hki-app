import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Pendaftaran } from "@/lib/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Fungsi ini sekarang memanggil API untuk membuat draf
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
      // Invalidate query agar daftar pendaftaran otomatis refresh
      queryClient.invalidateQueries({ queryKey: ["myRegistrations"] });
      // Redirect ke halaman edit untuk draf yang baru dibuat
      router.push(`/dashboard/pendaftaran/edit/${data.id}`);
    },
    onError: (error) => {
      toast.error("Gagal membuat draf", {
        description: error.message,
      });
    },
  });
};
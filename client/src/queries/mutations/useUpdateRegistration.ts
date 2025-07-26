import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Pendaftaran } from "@/lib/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UpdatePayload {
  id: string;
  // Kita tidak lagi mengirim status dan data terpisah, cukup FormData
  formData: FormData; 
}

// Mock API call diganti dengan API call asli
const updateRegistration = async (payload: UpdatePayload): Promise<Pendaftaran> => {
    return apiClient<Pendaftaran>(`/pendaftaran/${payload.id}`, { 
        method: "PUT", 
        body: payload.formData 
    });
}

export const useUpdateRegistration = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation<Pendaftaran, Error, UpdatePayload>({
        mutationFn: updateRegistration,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['myRegistrations'] });
            queryClient.invalidateQueries({ queryKey: ['registration', data.id] });
            
            if (data.status === 'submitted') {
                toast.success("Pendaftaran berhasil difinalisasi dan dikirim!");
                router.push('/dashboard/pendaftaran');
            } else {
                toast.success("Draf berhasil disimpan.");
            }
            router.push('/dashboard/pendaftaran');
            router.refresh();
        },
        onError: (error) => {
            toast.error("Gagal menyimpan pendaftaran", {
                description: error.message,
            });
        }
    });
}
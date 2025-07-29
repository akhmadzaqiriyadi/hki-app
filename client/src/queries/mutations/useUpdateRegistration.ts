// src/queries/mutations/useUpdateRegistration.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Pendaftaran } from "@/lib/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UpdatePayload {
  id: string;
  formData: FormData;
}

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
            // Invalidate queries agar data di-refresh
            queryClient.invalidateQueries({ queryKey: ['myRegistrations'] });
            queryClient.invalidateQueries({ queryKey: ['registration', data.id] });

            if (data.status === 'submitted') {
                toast.success("Pendaftaran berhasil difinalisasi dan dikirim!");
                // Jika status 'submitted', arahkan ke halaman detail
                router.push(`/dashboard/pendaftaran/${data.id}`);
            } else {
                toast.success("Draf berhasil disimpan.");
                // Jika status 'draft', arahkan ke halaman daftar
                router.push('/dashboard/pendaftaran');
            }
            // Tidak perlu lagi router.refresh() karena invalidasi query akan memicu update
        },
        onError: (error) => {
            toast.error("Gagal menyimpan pendaftaran", {
                description: error.message,
            });
        }
    });
}
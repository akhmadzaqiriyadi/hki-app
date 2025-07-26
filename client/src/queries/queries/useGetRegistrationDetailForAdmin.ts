import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Pendaftaran } from "@/lib/types";

const getRegistrationDetailForAdmin = async (id: string): Promise<Pendaftaran> => {
  if (!id) throw new Error("ID Pendaftaran diperlukan.");
  return apiClient<Pendaftaran>(`/admin/pendaftaran/${id}`);
};

export const useGetRegistrationDetailForAdmin = (id: string) => {
  return useQuery<Pendaftaran, Error>({
    queryKey: ["registrationAdmin", id],
    queryFn: () => getRegistrationDetailForAdmin(id),
    enabled: !!id,
  });
};
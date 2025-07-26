import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

// Definisikan tipe data yang diharapkan dari API
interface UserProfile {
  id: string;
  nama_lengkap: string;
  email: string;
  role: 'User' | 'Admin';
  createdAt: string;
}

const getMyProfile = async (): Promise<UserProfile> => {
  return apiClient<UserProfile>("/user/me");
};

export const useGetMyProfile = () => {
  return useQuery<UserProfile, Error>({
    queryKey: ["myProfile"], // Kunci unik untuk data profil
    queryFn: getMyProfile,
  });
};
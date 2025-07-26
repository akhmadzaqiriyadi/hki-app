import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Cookies from 'js-cookie';

const downloadFile = async (url: string) => {
  const token = Cookies.get('hki_portal_token');
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Gagal mengunduh file');
  }
  
  return response.blob();
};

export const useDownloadFile = () => {
  return useMutation({
    mutationFn: downloadFile,
    onSuccess: (blob, variables) => {
      const filename = variables.split('/').pop() || 'downloaded-file';
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success("Unduhan dimulai...");
    },
    onError: (error: Error) => {
      toast.error("Gagal Mengunduh", {
        description: error.message,
      });
    },
  });
};
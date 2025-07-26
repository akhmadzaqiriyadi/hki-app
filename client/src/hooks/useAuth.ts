"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, removeToken } from '@/lib/auth';
import { jwtDecode } from 'jwt-decode';
import { useQueryClient } from '@tanstack/react-query';

// Definisikan struktur payload dari token JWT Anda
interface JwtPayload {
  userId: string;
  role: 'User' | 'Admin';
  nama_lengkap: string;
  email: string;
  iat: number;
  exp: number;
}

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        // Cek jika token sudah kadaluarsa
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
          setIsAuthenticated(true);
        } else {
          // Token kadaluarsa, hapus token
          removeToken();
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        removeToken();
        setIsAuthenticated(false);
      }
    } else {
        setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  const logout = () => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
    queryClient.clear(); // Hapus semua cache data
    router.push('/login');
  };

  return { user, isAuthenticated, isLoading, logout };
};
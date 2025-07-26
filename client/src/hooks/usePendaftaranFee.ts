"use client";

import { useState, useEffect } from 'react';

// Konfigurasi biaya pendaftaran terpusat di sini
const BiayaPendaftaranConfig = {
  "Civitas Akademik UTY": {
    SOFTWARE: 325000,
    NON_SOFTWARE: 225000,
  },
  "Umum": {
    SOFTWARE: 650000,
    NON_SOFTWARE: 550000,
  },
};

/**
 * Custom hook untuk menghitung biaya pendaftaran secara dinamis.
 * @param jenisPemilik - Status pemilik hak cipta ('Civitas Akademik UTY' atau 'Umum').
 * @param jenisKarya - Kode jenis karya yang dipilih dari form.
 * @returns {number} Nominal biaya pendaftaran yang telah dihitung.
 */
export function usePendaftaranFee(jenisPemilik?: string, jenisKarya?: string): number {
  const [biaya, setBiaya] = useState(0);

  useEffect(() => {
    if (jenisPemilik && jenisKarya) {
      // "KARYA_LAINNYA" dianggap sebagai software.
      const tipeKarya = jenisKarya === "KARYA_LAINNYA" ? "SOFTWARE" : "NON_SOFTWARE";
      
      const calculatedBiaya = BiayaPendaftaranConfig[jenisPemilik as keyof typeof BiayaPendaftaranConfig]?.[tipeKarya] || 0;
      
      setBiaya(calculatedBiaya);
    } else {
      setBiaya(0);
    }
  }, [jenisPemilik, jenisKarya]);

  return biaya;
}
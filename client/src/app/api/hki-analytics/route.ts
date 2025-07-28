// src/app/api/hki-analytics/route.ts (untuk App Router)

import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server'; // Sesuaikan import jika Pages Router: import type { NextApiRequest, NextApiResponse } from 'next';

export async function GET(request: NextRequest) { // Sesuaikan parameter jika Pages Router: req: NextApiRequest, res: NextApiResponse
  try {
    // Konfigurasi otentikasi Akun Layanan
    // Kredensial ini harus disimpan dengan aman menggunakan Environment Variables
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Penting: private_key dari JSON seringkali mengandung \n yang perlu diubah
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'], // Hanya butuh akses baca
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Ganti dengan ID Spreadsheet Anda dan range data yang relevan
    const spreadsheetId = process.env.GOOGLE_SHEET_ID; // Ambil dari Environment Variables
    const range = 'Sheet1!A:K'; // Contoh: ganti 'Sheet1' dengan nama sheet Anda, dan 'A:K' dengan kolom data HKI Anda

    if (!spreadsheetId) {
        return NextResponse.json({ message: 'Google Sheet ID is not configured.' }, { status: 500 });
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: 'Tidak ada data ditemukan di spreadsheet.' }, { status: 404 });
    }

    // Asumsikan baris pertama adalah header
    const headers = rows[0];
    const rawData = rows.slice(1).map(row => {
      let obj: { [key: string]: any } = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });

    // --- Bagian Pemrosesan Data untuk Analitik ---
    // Di sini Anda bisa memproses 'rawData' untuk membuat data yang siap untuk grafik.
    // Contoh ini mengadopsi struktur data yang saya hasilkan sebelumnya di Python.

    // Menghitung Distribusi Jenis HKI
    const hkiTypeCounts: { [key: string]: number } = {};
    rawData.forEach(item => {
      const jenis = item['jenis_hki']; // Sesuaikan dengan nama kolom 'jenis_hki' di spreadsheet Anda
      if (jenis) {
        hkiTypeCounts[jenis] = (hkiTypeCounts[jenis] || 0) + 1;
      }
    });
    const hkiTypeDistribution = Object.keys(hkiTypeCounts).map(key => ({
      "Jenis HKI": key,
      "Jumlah": hkiTypeCounts[key]
    }));

    // Menghitung Pendaftaran HKI per Tahun
    const hkiYearCounts: { [key: string]: number } = {};
    rawData.forEach(item => {
      const tahun = item['tahun_hki']; // Sesuaikan dengan nama kolom 'tahun_hki' di spreadsheet Anda
      if (tahun) {
        hkiYearCounts[tahun] = (hkiYearCounts[tahun] || 0) + 1;
      }
    });
    const hkiRegistrationsPerYear = Object.keys(hkiYearCounts)
      .sort((a, b) => parseInt(a) - parseInt(b)) // Urutkan berdasarkan tahun
      .map(key => ({
        "Tahun HKI": parseInt(key),
        "Jumlah": hkiYearCounts[key]
      }));

    // Menghitung Distribusi Status Pendaftaran HKI
    const hkiStatusCounts: { [key: string]: number } = {};
    rawData.forEach(item => {
      const status = item['status']; // Sesuaikan dengan nama kolom 'status' di spreadsheet Anda
      if (status) {
        hkiStatusCounts[status] = (hkiStatusCounts[status] || 0) + 1;
      }
    });
    const hkiStatusDistribution = Object.keys(hkiStatusCounts).map(key => ({
      "Status": key,
      "Jumlah": hkiStatusCounts[key]
    }));

    // Mengembalikan semua data analitik
    return NextResponse.json({
      hkiTypeDistribution,
      hkiRegistrationsPerYear,
      hkiStatusDistribution,
      // Anda juga bisa mengembalikan rawData jika perlu untuk tampilan tabel atau filter
      // rawData
    });

  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    return NextResponse.json({ message: 'Gagal mengambil data dari Google Sheets.' }, { status: 500 });
  }
}
import { Request, Response } from 'express';
import { google } from 'googleapis';

export const getHkiAnalytics = async (req: Request, res: Response) => {
  try {
    // 1. Konfigurasi otentikasi
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = 'Sheet1!A:K'; // Sesuaikan dengan nama Sheet dan range kolom Anda

    if (!spreadsheetId || !process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
        return res.status(500).json({ message: 'Konfigurasi Google Sheets API belum lengkap di server.' });
    }

    // 2. Ambil data dari Spreadsheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'Tidak ada data ditemukan di spreadsheet.' });
    }

    // 3. Proses data mentah menjadi data analitik
    const headers = rows[0];
    const rawData = rows.slice(1).map(row => {
      let obj: { [key: string]: any } = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });

    // Menghitung Distribusi Jenis HKI
    const hkiTypeCounts: { [key: string]: number } = {};
    rawData.forEach(item => {
      const jenis = item['jenis_hki'];
      if (jenis) hkiTypeCounts[jenis] = (hkiTypeCounts[jenis] || 0) + 1;
    });
    const hkiTypeDistribution = Object.keys(hkiTypeCounts).map(key => ({
      "Jenis HKI": key,
      "Jumlah": hkiTypeCounts[key]
    }));

    // Menghitung Pendaftaran per Tahun
    const hkiYearCounts: { [key: string]: number } = {};
    rawData.forEach(item => {
      const tahun = item['tahun_hki'];
      if (tahun) hkiYearCounts[tahun] = (hkiYearCounts[tahun] || 0) + 1;
    });
    const hkiRegistrationsPerYear = Object.keys(hkiYearCounts)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map(key => ({
        "Tahun HKI": parseInt(key),
        "Jumlah": hkiYearCounts[key]
      }));

    // Menghitung Distribusi Status
    const hkiStatusCounts: { [key: string]: number } = {};
    rawData.forEach(item => {
      const status = item['status'];
      if (status) hkiStatusCounts[status] = (hkiStatusCounts[status] || 0) + 1;
    });
    const hkiStatusDistribution = Object.keys(hkiStatusCounts).map(key => ({
      "Status": key,
      "Jumlah": hkiStatusCounts[key]
    }));

    // 4. Kirim response JSON
    res.status(200).json({
      hkiTypeDistribution,
      hkiRegistrationsPerYear,
      hkiStatusDistribution,
    });

  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    res.status(500).json({ message: 'Gagal mengambil data dari Google Sheets.' });
  }
};
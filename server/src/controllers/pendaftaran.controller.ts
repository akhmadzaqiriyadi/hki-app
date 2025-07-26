import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import path from 'path'; // <-- Tambahkan impor 'path'
import fs from 'fs'; 

// ... (fungsi createDraftPendaftaran, getMyPendaftaran, getPendaftaranById tidak berubah)
export const createDraftPendaftaran = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Otentikasi diperlukan' });
  }
  try {
    const newDraft = await prisma.pendaftaran.create({
      data: {
        userId: userId,
        judul: 'Draf Baru Tanpa Judul',
        jenis_pemilik: 'Umum',
        status: 'draft',
      },
    });
    res.status(201).json(newDraft);
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat draf pendaftaran' });
  }
};

export const getMyPendaftaran = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  try {
    const pendaftaran = await prisma.pendaftaran.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(pendaftaran);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data pendaftaran' });
  }
};

export const getPendaftaranById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  try {
    const pendaftaran = await prisma.pendaftaran.findUnique({
      where: { id },
      include: { pencipta: true },
    });
    if (!pendaftaran || pendaftaran.userId !== userId) {
      return res.status(404).json({ message: 'Pendaftaran tidak ditemukan' });
    }
    res.status(200).json(pendaftaran);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil detail pendaftaran' });
  }
};


// --- PERBAIKAN UTAMA DI FUNGSI INI ---
export const updatePendaftaran = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  
  const { pencipta: penciptaJson, ...formData } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  try {
    const existingPendaftaran = await prisma.pendaftaran.findFirst({
        where: { id, userId }
    });
    if (!existingPendaftaran) {
      return res.status(404).json({ message: 'Pendaftaran tidak ditemukan atau Anda tidak memiliki akses.' });
    }
    
    // 1. Ambil semua data dari body, KECUALI yang tidak boleh diubah
    const {
      id: bodyId,
      userId: bodyUserId,
      createdAt,
      updatedAt,
      ...safeFormData
    } = formData;

    const pendaftaranData: any = { ...safeFormData };

    // 2. Konversi dan bersihkan data
    if (pendaftaranData.tanggal_diumumkan) {
      pendaftaranData.tanggal_diumumkan = new Date(pendaftaranData.tanggal_diumumkan);
    }
    
    // Perbaiki masalah status array: jika status adalah array, ambil elemen terakhir
    if (Array.isArray(pendaftaranData.status)) {
        pendaftaranData.status = pendaftaranData.status.pop();
    }
    
    Object.keys(pendaftaranData).forEach(key => {
        if (pendaftaranData[key] === '' || pendaftaranData[key] === 'undefined' || pendaftaranData[key] === 'null') {
            pendaftaranData[key] = null;
        }
    });

    // 3. Tambahkan URL file yang diunggah
    if (files) {
      for (const key in files) {
        const file = files[key][0];
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        pendaftaranData[key] = fileUrl;
      }
    }

    const penciptaData = penciptaJson ? JSON.parse(penciptaJson) : [];
    
    const transaction = await prisma.$transaction(async (tx) => {
      await tx.pencipta.deleteMany({ where: { pendaftaranId: id } });

      if (penciptaData && penciptaData.length > 0) {
        await tx.pencipta.createMany({
          data: penciptaData.map((p: any) => {
            const { id: penciptaId, pendaftaranId, ...rest } = p;
            return { ...rest, pendaftaranId: id };
          }),
        });
      }
      
      const updatedPendaftaran = await tx.pendaftaran.update({
        where: { id },
        data: pendaftaranData,
        include: { pencipta: true }
      });

      return updatedPendaftaran;
    });

    res.status(200).json(transaction);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: 'Gagal memperbarui pendaftaran' });
  }
};

// --- FUNGSI BARU UNTUK MENGHAPUS PENDAFTARAN ---
export const deletePendaftaran = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  try {
    // 1. Cari draf pendaftaran berdasarkan ID dan ID pengguna
    const draft = await prisma.pendaftaran.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    // 2. Jika tidak ditemukan, kirim error 404
    if (!draft) {
      return res.status(404).json({ message: 'Draf pendaftaran tidak ditemukan atau Anda tidak memiliki akses.' });
    }

    // 3. Hanya izinkan penghapusan jika statusnya adalah 'draft'
    if (draft.status !== 'draft') {
      return res.status(403).json({ message: 'Hanya pendaftaran dengan status draf yang bisa dihapus.' });
    }

    // 4. Jika semua validasi lolos, hapus pendaftaran
    await prisma.pendaftaran.delete({
      where: { id: id },
    });

    res.status(200).json({ message: 'Draf pendaftaran berhasil dihapus.' });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: 'Gagal menghapus pendaftaran' });
  }
};

// --- FUNGSI BARU UNTUK MENGAMBIL FILE SECARA AMAN ---
export const getProtectedFile = async (req: Request, res: Response) => {
  const { filename } = req.params;
  const userId = req.user?.userId;

  try {
    const pendaftaran = await prisma.pendaftaran.findFirst({
      where: {
        userId: userId,
        OR: [
          { lampiran_karya_url: { contains: filename } },
          { surat_pernyataan_url: { contains: filename } },
          { scan_ktp_kolektif_url: { contains: filename } },
          { surat_pengalihan_url: { contains: filename } },
          { bukti_transfer_url: { contains: filename } },
          { sertifikat_hki_url: { contains: filename } },
        ],
      },
    });

    if (!pendaftaran) {
      return res.status(404).json({ message: 'File tidak ditemukan atau Anda tidak memiliki akses.' });
    }

    // --- PERBAIKAN DI SINI ---
    // Gunakan path.resolve agar konsisten dengan middleware upload
    const filePath = path.resolve(process.cwd(), 'public/uploads', filename);

    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      return res.status(404).json({ message: 'File tidak ditemukan di server.' });
    }

  } catch (error) {
    console.error("Get file error:", error);
    res.status(500).json({ message: 'Gagal mengambil file' });
  }
};

export const submitPaymentProof = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  const file = req.file; // File diakses dari req.file karena kita akan pakai upload.single()

  if (!file) {
    return res.status(400).json({ message: 'File bukti pembayaran tidak ditemukan.' });
  }

  try {
    // 1. Cek apakah pendaftaran ini milik pengguna dan statusnya 'approved'
    const pendaftaran = await prisma.pendaftaran.findFirst({
      where: { id: id, userId: userId },
    });

    if (!pendaftaran) {
      return res.status(404).json({ message: 'Pendaftaran tidak ditemukan atau Anda tidak memiliki akses.' });
    }

    if (pendaftaran.status !== 'approved') {
      return res.status(403).json({ message: 'Pembayaran hanya bisa dilakukan untuk pendaftaran yang sudah disetujui.' });
    }

    // 2. Buat URL publik untuk file yang diunggah
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

    // 3. Update pendaftaran dengan URL bukti bayar dan ubah statusnya ke 'review'
    const updatedPendaftaran = await prisma.pendaftaran.update({
      where: { id: id },
      data: {
        bukti_transfer_url: fileUrl,
        status: 'review', // Status kembali ke 'review' untuk verifikasi admin
      },
    });
    
    res.status(200).json({ message: 'Bukti pembayaran berhasil diunggah.', pendaftaran: updatedPendaftaran });

  } catch (error) {
    console.error("Submit payment error:", error);
    res.status(500).json({ message: 'Gagal memproses pembayaran' });
  }
};

// --- FUNGSI BARU UNTUK FINALISASI ---
export const finalizePendaftaran = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  try {
    const draft = await prisma.pendaftaran.findFirst({
      where: { id, userId, status: 'draft' },
    });

    if (!draft) {
      return res.status(404).json({ message: 'Draf tidak ditemukan atau Anda tidak memiliki akses.' });
    }

    const updatedPendaftaran = await prisma.pendaftaran.update({
      where: { id },
      data: { status: 'submitted' },
    });

    res.status(200).json({ message: 'Pendaftaran berhasil difinalisasi.', pendaftaran: updatedPendaftaran });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memfinalisasi pendaftaran.' });
  }
};
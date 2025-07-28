import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import path from 'path';
import fs from 'fs'; 
import { Prisma } from '@prisma/client'; // <-- TAMBAHKAN IMPORT INI

export const createDraftPendaftaran = async (req: Request, res: Response) => {
  // PERBAIKAN: Gunakan 'id' bukan 'userId'
  const userId = req.user?.id; 
  if (!userId) {
    return res.status(401).json({ message: 'Otentikasi diperlukan' });
  }
  try {
    const newDraft = await prisma.pendaftaran.create({
      data: {
        userId: userId,
        judul: 'Draf Baru Tanpa Judul',
        jenis_pemilik: 'Umum', // Default value
        status: 'draft',
      },
    });
    res.status(201).json(newDraft);
  } catch (error) {
    console.error("Create draft error:", error);
    res.status(500).json({ message: 'Gagal membuat draf pendaftaran' });
  }
};

export const getMyPendaftaran = async (req: Request, res: Response) => {
  // PERBAIKAN: Gunakan 'id' bukan 'userId'
  const userId = req.user?.id; 
  try {
    const pendaftaran = await prisma.pendaftaran.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(pendaftaran);
  } catch (error) {
    console.error("Get my pendaftaran error:", error);
    res.status(500).json({ message: 'Gagal mengambil data pendaftaran' });
  }
};

export const getPendaftaranById = async (req: Request, res: Response) => {
  const { id } = req.params;
  // PERBAIKAN: Gunakan 'id' bukan 'userId'
  const userId = req.user?.id; 
  try {
    const pendaftaran = await prisma.pendaftaran.findUnique({
      where: { id },
      include: { pencipta: true, user: { select: { nama_lengkap: true, email: true } } },
    });

    // Hanya user pemilik atau admin yang bisa melihat detail
    if (!pendaftaran || (pendaftaran.userId !== userId && req.user?.role !== 'Admin')) {
      return res.status(404).json({ message: 'Pendaftaran tidak ditemukan' });
    }
    res.status(200).json(pendaftaran);
  } catch (error) {
    console.error("Get pendaftaran by id error:", error);
    res.status(500).json({ message: 'Gagal mengambil detail pendaftaran' });
  }
};

export const updatePendaftaran = async (req: Request, res: Response) => {
  const { id } = req.params;
  // PERBAIKAN: Gunakan 'id' bukan 'userId'
  const userId = req.user?.id; 
  
  const { pencipta: penciptaJson, ...formData } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  try {
    const existingPendaftaran = await prisma.pendaftaran.findFirst({
        where: { id, userId }
    });
    if (!existingPendaftaran) {
      return res.status(404).json({ message: 'Pendaftaran tidak ditemukan atau Anda tidak memiliki akses.' });
    }
    
    const {
      id: bodyId,
      userId: bodyUserId,
      createdAt,
      updatedAt,
      ...safeFormData
    } = formData;

    const pendaftaranData: any = { ...safeFormData };

    if (pendaftaranData.tanggal_diumumkan) {
      pendaftaranData.tanggal_diumumkan = new Date(pendaftaranData.tanggal_diumumkan);
    }
    
    if (Array.isArray(pendaftaranData.status)) {
        pendaftaranData.status = pendaftaranData.status.pop();
    }
    
    Object.keys(pendaftaranData).forEach(key => {
        if (pendaftaranData[key] === '' || pendaftaranData[key] === 'undefined' || pendaftaranData[key] === 'null') {
            pendaftaranData[key] = null;
        }
    });

    if (files) {
      for (const key in files) {
        const file = files[key][0];
        pendaftaranData[key] = `/uploads/${file.filename}`; // Simpan path relatif
      }
    }

    const penciptaData = penciptaJson ? JSON.parse(penciptaJson) : [];
    
    // --- PERBAIKAN: Tambahkan tipe 'Prisma.TransactionClient' pada 'tx' ---
    const transaction = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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

export const deletePendaftaran = async (req: Request, res: Response) => {
  const { id } = req.params;
  // PERBAIKAN: Gunakan 'id' bukan 'userId'
  const userId = req.user?.id; 

  try {
    const draft = await prisma.pendaftaran.findFirst({
      where: { id: id, userId: userId },
    });

    if (!draft) {
      return res.status(404).json({ message: 'Draf pendaftaran tidak ditemukan atau Anda tidak memiliki akses.' });
    }

    if (draft.status !== 'draft') {
      return res.status(403).json({ message: 'Hanya pendaftaran dengan status draf yang bisa dihapus.' });
    }

    await prisma.pendaftaran.delete({
      where: { id: id },
    });

    res.status(200).json({ message: 'Draf pendaftaran berhasil dihapus.' });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: 'Gagal menghapus pendaftaran' });
  }
};

export const getProtectedFile = async (req: Request, res: Response) => {
  const { filename } = req.params;
  // PERBAIKAN: Gunakan 'id' bukan 'userId'
  const userId = req.user?.id; 

  try {
    const whereClause: any = {
        OR: [
          { lampiran_karya_url: { contains: filename } },
          { surat_pernyataan_url: { contains: filename } },
          { scan_ktp_kolektif_url: { contains: filename } },
          { surat_pengalihan_url: { contains: filename } },
          { bukti_transfer_url: { contains: filename } },
          { sertifikat_hki_url: { contains: filename } },
        ],
    };
    
    // Jika bukan admin, batasi hanya untuk file milik sendiri
    if (req.user?.role !== 'Admin') {
        whereClause.userId = userId;
    }

    const pendaftaran = await prisma.pendaftaran.findFirst({ where: whereClause });

    if (!pendaftaran) {
      return res.status(404).json({ message: 'File tidak ditemukan atau Anda tidak memiliki akses.' });
    }

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
  // PERBAIKAN: Gunakan 'id' bukan 'userId'
  const userId = req.user?.id; 
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'File bukti pembayaran tidak ditemukan.' });
  }

  try {
    const pendaftaran = await prisma.pendaftaran.findFirst({
      where: { id: id, userId: userId },
    });

    if (!pendaftaran) {
      return res.status(404).json({ message: 'Pendaftaran tidak ditemukan atau Anda tidak memiliki akses.' });
    }

    if (pendaftaran.status !== 'approved') {
      return res.status(403).json({ message: 'Pembayaran hanya bisa dilakukan untuk pendaftaran yang sudah disetujui.' });
    }

    const fileUrl = `/uploads/${file.filename}`;

    const updatedPendaftaran = await prisma.pendaftaran.update({
      where: { id: id },
      data: {
        bukti_transfer_url: fileUrl,
        status: 'review',
      },
    });
    
    res.status(200).json({ message: 'Bukti pembayaran berhasil diunggah.', pendaftaran: updatedPendaftaran });

  } catch (error) {
    console.error("Submit payment error:", error);
    res.status(500).json({ message: 'Gagal memproses pembayaran' });
  }
};

export const finalizePendaftaran = async (req: Request, res: Response) => {
  const { id } = req.params;
  // PERBAIKAN: Gunakan 'id' bukan 'userId'
  const userId = req.user?.id; 

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
    console.error("Finalize error:", error);
    res.status(500).json({ message: 'Gagal memfinalisasi pendaftaran.' });
  }
};

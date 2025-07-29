import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { StatusPendaftaran } from '@prisma/client';
import { sendMail } from '../lib/mailer';

// Mengambil SEMUA pendaftaran yang perlu direview
export const getAllPendaftaranForAdmin = async (req: Request, res: Response) => {
  try {
    const pendaftaran = await prisma.pendaftaran.findMany({
      where: { NOT: { status: 'draft' } },
      include: { user: { select: { nama_lengkap: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(pendaftaran);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data pendaftaran' });
  }
};

// --- FUNGSI BARU: Mengambil DETAIL satu pendaftaran ---
export const getPendaftaranDetailForAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const pendaftaran = await prisma.pendaftaran.findUnique({
      where: { id },
      include: {
        user: { select: { nama_lengkap: true, email: true } },
        pencipta: true,
      },
    });
    if (!pendaftaran) {
      return res.status(404).json({ message: 'Pendaftaran tidak ditemukan' });
    }
    res.status(200).json(pendaftaran);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil detail pendaftaran' });
  }
};

// Memperbarui status pendaftaran (oleh Admin)
export const updatePendaftaranStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, catatan_revisi } = req.body;
    try {
        // Ambil data pendaftaran yang ada terlebih dahulu untuk mendapatkan info user
        const pendaftaran = await prisma.pendaftaran.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        email: true,
                        nama_lengkap: true
                    }
                }
            }
        });

        if (!pendaftaran) {
            return res.status(404).json({ message: 'Pendaftaran tidak ditemukan' });
        }

        // Lakukan pembaruan status
        const updatedPendaftaran = await prisma.pendaftaran.update({
            where: { id },
            data: {
                status: status as StatusPendaftaran,
                catatan_revisi: status === 'revisi' ? catatan_revisi : null,
            },
        });

        // 2. Kirim email notifikasi jika status adalah 'approved'
        if (updatedPendaftaran.status === 'approved' && pendaftaran.user) {
            try {
                const subject = "Pendaftaran HKI Anda Telah Disetujui!";
                const message = `Halo ${pendaftaran.user.nama_lengkap},\n\nKabar baik! Pendaftaran HKI Anda dengan judul "${pendaftaran.judul}" telah kami setujui.\n\nLangkah selanjutnya adalah melakukan pembayaran untuk memproses pendaftaran Anda. Silakan login ke akun Anda untuk melihat detail tagihan dan instruksi pembayaran.\n\nTerima kasih.\n\nSalam,\nTim Sentra HKI UTY`;

                await sendMail({
                    to: pendaftaran.user.email,
                    subject: subject,
                    text: message,
                    html: `<p>${message.replace(/\n/g, '<br>')}</p>`,
                });
                console.log(`Email notifikasi persetujuan terkirim ke ${pendaftaran.user.email}`);
            } catch (emailError) {
                console.error("Gagal mengirim email notifikasi persetujuan:", emailError);
                // Proses tetap lanjut meskipun email gagal terkirim
            }
        }

        res.status(200).json({ message: 'Status berhasil diperbarui', pendaftaran: updatedPendaftaran });
    } catch (error) {
        res.status(500).json({ message: 'Gagal memperbarui status' });
    }
};

// --- FUNGSI BARU: Mengunggah sertifikat dan mengubah status menjadi 'granted' ---
export const uploadSertifikat = async (req: Request, res: Response) => {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'File sertifikat tidak ditemukan.' });
    }

    try {
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

        const updatedPendaftaran = await prisma.pendaftaran.update({
            where: { id },
            data: {
                sertifikat_hki_url: fileUrl,
                sertifikat_hki_filename: file.originalname,
                sertifikat_uploaded_at: new Date(),
                status: 'granted', // Langsung ubah status menjadi 'granted'
            },
        });

        res.status(200).json({ message: 'Sertifikat berhasil diunggah dan status diubah menjadi Granted.', pendaftaran: updatedPendaftaran });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengunggah sertifikat' });
    }
};
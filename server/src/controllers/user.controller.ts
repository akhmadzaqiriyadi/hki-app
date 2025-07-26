import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';

// Mengambil profil pengguna yang sedang login
export const getMyProfile = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      // Pilih field yang aman untuk dikirim ke frontend
      select: {
        id: true,
        nama_lengkap: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil profil' });
  }
};

// Memperbarui profil pengguna yang sedang login
export const updateMyProfile = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { nama_lengkap } = req.body;

  if (!nama_lengkap) {
    return res.status(400).json({ message: 'Nama lengkap tidak boleh kosong' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        nama_lengkap: nama_lengkap,
      },
       select: {
        id: true,
        nama_lengkap: true,
        email: true,
        role: true,
      },
    });

    res.status(200).json({ message: 'Profil berhasil diperbarui', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui profil' });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { currentPassword, newPassword } = req.body;

  // 1. Validasi input
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Password lama dan baru wajib diisi.' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ message: 'Password baru minimal 8 karakter.' });
  }

  try {
    // 2. Ambil data pengguna, termasuk password-nya
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    }

    // 3. Verifikasi password saat ini
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Password lama Anda salah.' });
    }

    // 4. Hash password baru dan update ke database
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.status(200).json({ message: 'Password berhasil diperbarui.' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui password.' });
  }
};
import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
// Impor 'UserRole' dihapus karena tidak diperlukan dan menyebabkan error

// Mengambil profil pengguna yang sedang login
export const getMyProfile = async (req: Request, res: Response) => {
  // Ambil ID pengguna dari token yang sudah diverifikasi oleh middleware
  const userId = req.user?.id;

  // Penambahan: Validasi jika userId tidak ada (sebagai pengaman tambahan)
  if (!userId) {
    return res.status(401).json({ message: 'Akses ditolak, pengguna tidak terautentikasi.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
    console.error("Error getting my profile:", error);
    res.status(500).json({ message: 'Gagal mengambil profil' });
  }
};

// Memperbarui profil pengguna yang sedang login
export const updateMyProfile = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { nama_lengkap } = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'Akses ditolak, pengguna tidak terautentikasi.' });
  }

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
    console.error("Error updating my profile:", error);
    res.status(500).json({ message: 'Gagal memperbarui profil' });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { currentPassword, newPassword } = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'Akses ditolak, pengguna tidak terautentikasi.' });
  }

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Password lama dan baru wajib diisi.' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ message: 'Password baru minimal 8 karakter.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Password lama Anda salah.' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.status(200).json({ message: 'Password berhasil diperbarui.' });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: 'Gagal memperbarui password.' });
  }
};

// Fungsi utilitas untuk menghapus field password dari objek user
const excludePassword = (user: any) => {
    const { password, ...data } = user;
    return data;
};

// [Admin] Mendapatkan semua pengguna
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                nama_lengkap: true,
                email: true,
                role: true,
                createdAt: true,
            }
        });
        res.status(200).json(users);
    } catch (error) {
        console.error("Error getting all users:", error);
        res.status(500).json({ message: 'Gagal mendapatkan data pengguna.' });
    }
};

// [Admin] Mendapatkan satu pengguna berdasarkan ID
export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                nama_lengkap: true,
                email: true,
                role: true,
                createdAt: true,
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error getting user by id:", error);
        res.status(500).json({ message: 'Gagal mendapatkan data pengguna.' });
    }
};

// [Admin] Membuat pengguna baru
export const createUser = async (req: Request, res: Response) => {
    const { nama_lengkap, email, password, role } = req.body;

    if (!nama_lengkap || !email || !password) {
        return res.status(400).json({ message: 'Nama lengkap, email, dan password harus diisi.' });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email sudah terdaftar.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                nama_lengkap,
                email,
                password: hashedPassword,
                // PERBAIKAN: Gunakan string literal yang cocok dengan enum di skema
                role: role === 'Admin' ? 'Admin' : 'User',
            },
        });

        res.status(201).json({ message: 'Pengguna berhasil dibuat.', user: excludePassword(newUser) });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: 'Gagal membuat pengguna baru.' });
    }
};

// [Admin] Memperbarui data pengguna
export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nama_lengkap, email, password, role } = req.body;

    try {
        if (email) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    email: email,
                    id: { not: id },
                },
            });
            if (existingUser) {
                return res.status(409).json({ message: 'Email baru sudah digunakan oleh pengguna lain.' });
            }
        }
        
        const dataToUpdate: any = {};
        if (nama_lengkap) dataToUpdate.nama_lengkap = nama_lengkap;
        if (email) dataToUpdate.email = email;
        if (role) dataToUpdate.role = role;
        
        // PERBAIKAN: Hanya hash dan update password jika field password diisi (tidak kosong)
        if (password && password.length > 0) {
            dataToUpdate.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: dataToUpdate,
        });

        res.status(200).json({ message: 'Data pengguna berhasil diperbarui.', user: excludePassword(updatedUser) });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: 'Gagal memperbarui data pengguna.' });
    }
};

// [Admin] Menghapus pengguna
export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({
            where: { id },
        });
        res.status(200).json({ message: 'Pengguna berhasil dihapus.' });
    } catch (error) {
        console.error("Error deleting user:", error);
        if ((error as any).code === 'P2025') {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }
        res.status(500).json({ message: 'Gagal menghapus pengguna.' });
    }
};

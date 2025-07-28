import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; 
import { sendMail } from '../lib/mailer';

export const register = async (req: Request, res: Response) => {
  const { nama_lengkap, email, password } = req.body;

  if (!nama_lengkap || !email || !password) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email sudah terdaftar" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        nama_lengkap,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ 
        message: "Registrasi berhasil!",
        userId: newUser.id 
    });
  } catch (error) {
    console.error("Error saat registrasi:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // ... (kode untuk mencari user dan verifikasi password)
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Kredensial tidak valid" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Kredensial tidak valid" });
    }
    
    // --- PERBAIKAN DI SINI ---
    // Ubah 'userId' menjadi 'id' agar konsisten
    const token = jwt.sign(
      { id: user.id, role: user.role,       nama_lengkap: user.nama_lengkap, // <-- Tambahkan ini
      email: user.email, }, // Ganti 'userId' menjadi 'id'
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );
    // --- AKHIR PERBAIKAN ---

    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 hari
      })
      .status(200)
      .json({ token, user: userInfo }); // Kirim token dan data user

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Gagal untuk login!" });
  }
};

// --- FUNGSI BARU: FORGOT PASSWORD ---
export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            // Respon yang sama untuk email terdaftar atau tidak untuk keamanan
            return res.status(200).json({ message: 'Jika email terdaftar, link reset password akan dikirimkan.' });
        }

        // Buat token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const passwordResetToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
            
        const passwordResetExpires = new Date(Date.now() + 3600000); // 1 jam

        await prisma.user.update({
            where: { email },
            data: {
                resetPasswordToken: passwordResetToken,
                resetPasswordExpires: passwordResetExpires,
            },
        });

        // Kirim email
        const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`; // Ganti dengan URL frontend Anda
        const message = `Anda menerima email ini karena Anda (atau orang lain) meminta untuk mereset password akun Anda. Silakan klik link di bawah atau paste ke browser Anda untuk menyelesaikan prosesnya. Link akan kedaluwarsa dalam 1 jam.\n\n${resetURL}\n\nJika Anda tidak memintanya, abaikan email ini dan password Anda tidak akan berubah.`;

        await sendMail({
            to: user.email,
            subject: 'Reset Password Akun HKI Portal',
            text: message,
            html: `<p>${message.replace(/\n/g, '<br>')}</p>`,
        });

        res.status(200).json({ message: 'Jika email terdaftar, link reset password akan dikirimkan.' });

    } catch (error) {
        console.error("Forgot password error:", error);
        // Hapus token jika terjadi error
         await prisma.user.update({
            where: { email },
            data: {
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });
        res.status(500).json({ message: 'Gagal mengirim email reset password.' });
    }
};

// --- FUNGSI BARU: RESET PASSWORD ---
export const resetPassword = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: { gt: new Date() },
            },
        });

        if (!user) {
            return res.status(400).json({ message: 'Token tidak valid atau sudah kedaluwarsa.' });
        }

        if (!password || password.length < 8) {
            return res.status(400).json({ message: 'Password baru minimal 8 karakter.' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });
        
        res.status(200).json({ message: 'Password berhasil direset.' });

    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: 'Gagal mereset password.' });
    }
};